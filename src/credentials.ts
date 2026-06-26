import { createHash, generateKeyPairSync, randomUUID, sign, verify, X509Certificate } from "node:crypto";
import type { AgentIdentityCode, JsonObject, JsonValue } from "./types.js";

export type CredentialLifecycleStatus = "active" | "locked" | "revoked";
export type AuthenticationResult = "success" | "failed" | "needs_more_verification";

export interface AgentCredential {
  credentialId: string;
  agentId: AgentIdentityCode;
  issuerId: string;
  subject: string;
  publicKeyPem: string;
  certificatePem?: string | undefined;
  certificateChainPem?: string[] | undefined;
  audience?: string[] | undefined;
  scope: string[];
  issuedAt: string;
  expiresAt: string;
  metadata?: JsonObject | undefined;
}

export interface IssueCredentialInput {
  agentId: AgentIdentityCode;
  subject: string;
  issuerId?: string | undefined;
  audience?: string[] | undefined;
  scope?: string[] | undefined;
  expiresAt?: string | undefined;
  metadata?: JsonObject | undefined;
}

export interface IssuedCredential {
  credential: AgentCredential;
  privateKeyPem: string;
}

export interface ProcessCredentialPackage {
  credential: AgentCredential;
  audience: string;
  scope: string[];
  nonce?: string | undefined;
  timestamp: string;
  payload?: JsonValue | undefined;
  signature: string;
}

export interface CreatePresentationInput {
  credential: AgentCredential;
  privateKeyPem: string;
  audience: string;
  scope: string[];
  nonce?: string | undefined;
  timestamp?: string | undefined;
  payload?: JsonValue | undefined;
}

export interface VerifyPresentationInput {
  package: ProcessCredentialPackage;
  expectedAudience: string;
  requiredScope?: string[] | undefined;
  now?: Date | undefined;
}

export interface AuthenticationAssertion {
  assertionId: string;
  result: AuthenticationResult;
  agentId?: AgentIdentityCode | undefined;
  credentialId?: string | undefined;
  verifiedAt: string;
  reason?: string | undefined;
  verifiedAttributes?: JsonObject | undefined;
  policyAdvice?: JsonObject | undefined;
}

export interface CredentialStatusStore {
  getStatus(credentialId: string): Promise<CredentialLifecycleStatus | undefined>;
  setStatus(credentialId: string, status: CredentialLifecycleStatus, reason?: string | undefined): Promise<void>;
}

export interface CertificateChainVerifier {
  verifyCertificateChain(credential: AgentCredential, now?: Date): Promise<{ ok: boolean; reason?: string | undefined }>;
}

export interface CredentialIssuer {
  issueCredential(input: IssueCredentialInput): Promise<IssuedCredential>;
  updateCredential(credentialId: string, patch: Partial<Pick<AgentCredential, "audience" | "scope" | "expiresAt" | "metadata">>): Promise<AgentCredential>;
  lockCredential(credentialId: string, reason?: string | undefined): Promise<void>;
  unlockCredential(credentialId: string, reason?: string | undefined): Promise<void>;
  revokeCredential(credentialId: string, reason?: string | undefined): Promise<void>;
  getCredential(credentialId: string): Promise<AgentCredential | undefined>;
}

export interface CredentialVerifier {
  verifyPresentation(input: VerifyPresentationInput): Promise<AuthenticationAssertion>;
}

export class InMemoryCredentialStatusStore implements CredentialStatusStore {
  private statuses = new Map<string, { status: CredentialLifecycleStatus; reason?: string | undefined }>();

  async getStatus(credentialId: string): Promise<CredentialLifecycleStatus | undefined> {
    return this.statuses.get(credentialId)?.status;
  }

  async setStatus(credentialId: string, status: CredentialLifecycleStatus, reason?: string | undefined): Promise<void> {
    this.statuses.set(credentialId, { status, reason });
  }
}

export class InMemoryCredentialRepository {
  private credentials = new Map<string, AgentCredential>();

  async save(credential: AgentCredential): Promise<void> {
    this.credentials.set(credential.credentialId, credential);
  }

  async get(credentialId: string): Promise<AgentCredential | undefined> {
    return this.credentials.get(credentialId);
  }

  async listByAgent(agentId: AgentIdentityCode): Promise<AgentCredential[]> {
    return [...this.credentials.values()].filter((credential) => credential.agentId === agentId);
  }
}

export class NodeX509CertificateChainVerifier implements CertificateChainVerifier {
  async verifyCertificateChain(credential: AgentCredential, now = new Date()): Promise<{ ok: boolean; reason?: string | undefined }> {
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
    } catch (error) {
      return { ok: false, reason: `Invalid X.509 certificate: ${(error as Error).message}` };
    }
  }
}

export class DevelopmentCredentialIssuer implements CredentialIssuer {
  private readonly issuerId: string;

  constructor(
    private readonly repository = new InMemoryCredentialRepository(),
    private readonly statusStore: CredentialStatusStore = new InMemoryCredentialStatusStore(),
    issuerId = "development-x509-issuer"
  ) {
    this.issuerId = issuerId;
  }

  async issueCredential(input: IssueCredentialInput): Promise<IssuedCredential> {
    const { publicKey, privateKey } = generateKeyPairSync("ed25519");
    const publicKeyPem = publicKey.export({ type: "spki", format: "pem" }).toString();
    const privateKeyPem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
    const now = new Date();
    const credential: AgentCredential = {
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

  async updateCredential(credentialId: string, patch: Partial<Pick<AgentCredential, "audience" | "scope" | "expiresAt" | "metadata">>): Promise<AgentCredential> {
    const existing = await this.requireCredential(credentialId);
    const updated: AgentCredential = { ...existing, ...patch };
    await this.repository.save(updated);
    return updated;
  }

  async lockCredential(credentialId: string, reason?: string | undefined): Promise<void> {
    await this.requireCredential(credentialId);
    await this.statusStore.setStatus(credentialId, "locked", reason);
  }

  async unlockCredential(credentialId: string, reason?: string | undefined): Promise<void> {
    await this.requireCredential(credentialId);
    await this.statusStore.setStatus(credentialId, "active", reason);
  }

  async revokeCredential(credentialId: string, reason?: string | undefined): Promise<void> {
    await this.requireCredential(credentialId);
    await this.statusStore.setStatus(credentialId, "revoked", reason);
  }

  async getCredential(credentialId: string): Promise<AgentCredential | undefined> {
    return this.repository.get(credentialId);
  }

  private async requireCredential(credentialId: string): Promise<AgentCredential> {
    const credential = await this.repository.get(credentialId);
    if (!credential) {
      throw new Error(`Credential not found: ${credentialId}`);
    }
    return credential;
  }
}

export class DevelopmentCredentialVerifier implements CredentialVerifier {
  constructor(
    private readonly statusStore: CredentialStatusStore = new InMemoryCredentialStatusStore(),
    private readonly chainVerifier: CertificateChainVerifier = new NodeX509CertificateChainVerifier()
  ) {}

  async verifyPresentation(input: VerifyPresentationInput): Promise<AuthenticationAssertion> {
    const verifiedAt = (input.now ?? new Date()).toISOString();
    const credential = input.package.credential;
    const fail = (reason: string): AuthenticationAssertion => ({
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
    const signatureOk = verify(
      null,
      Buffer.from(canonicalJson(expectedPayload)),
      credential.publicKeyPem,
      Buffer.from(input.package.signature, "base64")
    );
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

export function createProcessCredentialPackage(input: CreatePresentationInput): ProcessCredentialPackage {
  const pkgWithoutSignature = {
    credential: input.credential,
    audience: input.audience,
    scope: input.scope,
    nonce: input.nonce,
    timestamp: input.timestamp ?? new Date().toISOString(),
    payload: input.payload
  } satisfies Omit<ProcessCredentialPackage, "signature">;
  const signature = sign(
    null,
    Buffer.from(canonicalJson(presentationSigningPayload(pkgWithoutSignature))),
    input.privateKeyPem
  ).toString("base64");
  return { ...pkgWithoutSignature, signature };
}

export function canonicalJson(value: JsonValue | JsonObject | unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, entryValue]) => `${JSON.stringify(key)}:${canonicalJson(entryValue)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function hashJson(value: JsonValue): string {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

function presentationSigningPayload(pkg: Omit<ProcessCredentialPackage, "signature">): JsonObject {
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
