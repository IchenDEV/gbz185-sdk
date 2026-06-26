import { createHash, generateKeyPairSync, randomUUID, sign, verify, X509Certificate } from "node:crypto";
export class InMemoryCredentialStatusStore {
    statuses = new Map();
    async getStatus(credentialId) {
        return this.statuses.get(credentialId)?.status;
    }
    async setStatus(credentialId, status, reason) {
        this.statuses.set(credentialId, { status, reason });
    }
}
export class InMemoryCredentialRepository {
    credentials = new Map();
    async save(credential) {
        this.credentials.set(credential.credentialId, credential);
    }
    async get(credentialId) {
        return this.credentials.get(credentialId);
    }
    async listByAgent(agentId) {
        return [...this.credentials.values()].filter((credential) => credential.agentId === agentId);
    }
}
export class NodeX509CertificateChainVerifier {
    async verifyCertificateChain(credential, now = new Date()) {
        if (!credential.certificatePem) {
            return { ok: true, reason: "No X.509 certificate PEM supplied; verified through public-key presentation only" };
        }
        try {
            const cert = new X509Certificate(credential.certificatePem);
            const validFrom = new Date(cert.validFrom);
            const validTo = new Date(cert.validTo);
            if (now < validFrom || now > validTo) {
                return { ok: false, reason: "X.509 certificate is outside its validity window" };
            }
            if (cert.publicKey.export({ type: "spki", format: "pem" }).toString() !== credential.publicKeyPem) {
                return { ok: false, reason: "X.509 certificate public key does not match credential public key" };
            }
            return { ok: true };
        }
        catch (error) {
            return { ok: false, reason: `Invalid X.509 certificate: ${error.message}` };
        }
    }
}
export class DevelopmentCredentialIssuer {
    repository;
    statusStore;
    issuerId;
    constructor(repository = new InMemoryCredentialRepository(), statusStore = new InMemoryCredentialStatusStore(), issuerId = "development-x509-issuer") {
        this.repository = repository;
        this.statusStore = statusStore;
        this.issuerId = issuerId;
    }
    async issueCredential(input) {
        const { publicKey, privateKey } = generateKeyPairSync("ed25519");
        const publicKeyPem = publicKey.export({ type: "spki", format: "pem" }).toString();
        const privateKeyPem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
        const now = new Date();
        const credential = {
            credentialId: randomUUID(),
            agentId: input.agentId,
            issuerId: input.issuerId ?? this.issuerId,
            subject: input.subject,
            publicKeyPem,
            audience: input.audience,
            scope: input.scope ?? ["agent:interact", "tool:invoke"],
            issuedAt: now.toISOString(),
            expiresAt: input.expiresAt ?? new Date(now.getTime() + 1000 * 60 * 60 * 24 * 365).toISOString(),
            metadata: {
                ...(input.metadata ?? {}),
                developmentOnly: true,
                certificateProfile: "x509-first-interface-with-ed25519-dev-key"
            }
        };
        await this.repository.save(credential);
        await this.statusStore.setStatus(credential.credentialId, "active");
        return { credential, privateKeyPem };
    }
    async updateCredential(credentialId, patch) {
        const existing = await this.requireCredential(credentialId);
        const updated = { ...existing, ...patch };
        await this.repository.save(updated);
        return updated;
    }
    async lockCredential(credentialId, reason) {
        await this.requireCredential(credentialId);
        await this.statusStore.setStatus(credentialId, "locked", reason);
    }
    async unlockCredential(credentialId, reason) {
        await this.requireCredential(credentialId);
        await this.statusStore.setStatus(credentialId, "active", reason);
    }
    async revokeCredential(credentialId, reason) {
        await this.requireCredential(credentialId);
        await this.statusStore.setStatus(credentialId, "revoked", reason);
    }
    async getCredential(credentialId) {
        return this.repository.get(credentialId);
    }
    async requireCredential(credentialId) {
        const credential = await this.repository.get(credentialId);
        if (!credential) {
            throw new Error(`Credential not found: ${credentialId}`);
        }
        return credential;
    }
}
export class DevelopmentCredentialVerifier {
    statusStore;
    chainVerifier;
    constructor(statusStore = new InMemoryCredentialStatusStore(), chainVerifier = new NodeX509CertificateChainVerifier()) {
        this.statusStore = statusStore;
        this.chainVerifier = chainVerifier;
    }
    async verifyPresentation(input) {
        const verifiedAt = (input.now ?? new Date()).toISOString();
        const credential = input.package.credential;
        const fail = (reason) => ({
            assertionId: randomUUID(),
            result: "failed",
            agentId: credential.agentId,
            credentialId: credential.credentialId,
            verifiedAt,
            reason
        });
        const status = await this.statusStore.getStatus(credential.credentialId);
        if (status === "locked" || status === "revoked") {
            return fail(`Credential is ${status}`);
        }
        const now = input.now ?? new Date();
        if (now < new Date(credential.issuedAt) || now > new Date(credential.expiresAt)) {
            return fail("Credential is outside its validity window");
        }
        const chainResult = await this.chainVerifier.verifyCertificateChain(credential, now);
        if (!chainResult.ok) {
            return fail(chainResult.reason ?? "Certificate chain verification failed");
        }
        if (credential.audience?.length && !credential.audience.includes(input.expectedAudience)) {
            return fail("Credential audience does not include expected audience");
        }
        if (input.package.audience !== input.expectedAudience) {
            return fail("Process credential package audience does not match expected audience");
        }
        const requiredScope = input.requiredScope ?? [];
        if (!requiredScope.every((scope) => credential.scope.includes(scope) && input.package.scope.includes(scope))) {
            return fail("Credential scope does not cover requested operation");
        }
        const expectedPayload = presentationSigningPayload(input.package);
        const signatureOk = verify(null, Buffer.from(canonicalJson(expectedPayload)), credential.publicKeyPem, Buffer.from(input.package.signature, "base64"));
        if (!signatureOk) {
            return fail("Process credential signature verification failed");
        }
        return {
            assertionId: randomUUID(),
            result: "success",
            agentId: credential.agentId,
            credentialId: credential.credentialId,
            verifiedAt,
            verifiedAttributes: {
                issuerId: credential.issuerId,
                subject: credential.subject,
                scope: credential.scope,
                payloadHash: hashJson(input.package.payload ?? null)
            },
            policyAdvice: {
                developmentOnly: credential.metadata?.developmentOnly === true
            }
        };
    }
}
export function createProcessCredentialPackage(input) {
    const pkgWithoutSignature = {
        credential: input.credential,
        audience: input.audience,
        scope: input.scope,
        nonce: input.nonce,
        timestamp: input.timestamp ?? new Date().toISOString(),
        payload: input.payload
    };
    const signature = sign(null, Buffer.from(canonicalJson(presentationSigningPayload(pkgWithoutSignature))), input.privateKeyPem).toString("base64");
    return { ...pkgWithoutSignature, signature };
}
export function canonicalJson(value) {
    if (Array.isArray(value)) {
        return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
    }
    if (value && typeof value === "object") {
        const entries = Object.entries(value)
            .filter(([, entryValue]) => entryValue !== undefined)
            .sort(([left], [right]) => left.localeCompare(right));
        return `{${entries.map(([key, entryValue]) => `${JSON.stringify(key)}:${canonicalJson(entryValue)}`).join(",")}}`;
    }
    return JSON.stringify(value);
}
function hashJson(value) {
    return createHash("sha256").update(canonicalJson(value)).digest("hex");
}
function presentationSigningPayload(pkg) {
    return {
        credentialId: pkg.credential.credentialId,
        agentId: pkg.credential.agentId,
        audience: pkg.audience,
        scope: pkg.scope,
        nonce: pkg.nonce ?? null,
        timestamp: pkg.timestamp,
        payloadHash: hashJson(pkg.payload ?? null)
    };
}
//# sourceMappingURL=credentials.js.map