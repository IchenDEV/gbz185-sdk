import { randomUUID } from "node:crypto";
import { formatIdentityCode } from "./identity-code.js";
export class InMemoryIdentityAccountStore {
    accounts = new Map();
    async save(account) {
        this.accounts.set(account.id, account);
    }
    async get(agentId) {
        return this.accounts.get(agentId);
    }
    async list() {
        return [...this.accounts.values()];
    }
}
export class IdentityRegistryRuntime {
    store;
    credentialIssuer;
    constructor(store = new InMemoryIdentityAccountStore(), credentialIssuer) {
        this.store = store;
        this.credentialIssuer = credentialIssuer;
    }
    async register(input) {
        const now = new Date().toISOString();
        const agentId = formatIdentityCode({
            registrationServiceProvider: input.registrationServiceProvider,
            registrationRequester: input.registrationRequester,
            ontologySerial: input.ontologySerial ?? randomNode(8),
            instanceSerial: input.instanceSerial ?? "0"
        });
        const account = {
            id: agentId,
            delegatorId: input.delegatorId,
            subject: input.subject,
            description: input.description,
            status: "active",
            credentialIds: [],
            evidence: input.evidence,
            auditLog: [audit("registered", "identity-registry", "identity account registered")],
            createdAt: now,
            updatedAt: now
        };
        let issuedCredential;
        if (input.issueCredential && this.credentialIssuer) {
            issuedCredential = await this.credentialIssuer.issueCredential({
                agentId,
                subject: input.subject,
                audience: input.credentialAudience,
                scope: input.credentialScope,
                metadata: { delegatorId: input.delegatorId }
            });
            account.credentialIds.push(issuedCredential.credential.credentialId);
            account.auditLog?.push(audit("credential_issued", "identity-registry", "initial credential issued"));
        }
        await this.store.save(account);
        return { account, issuedCredential };
    }
    async update(agentId, patch) {
        const account = await this.requireAccount(agentId);
        const updated = {
            ...account,
            ...patch,
            auditLog: [...(account.auditLog ?? []), audit("updated", "identity-registry", "identity account updated")],
            updatedAt: new Date().toISOString()
        };
        await this.store.save(updated);
        return updated;
    }
    async issueCredential(agentId, input) {
        if (!this.credentialIssuer) {
            throw new Error("No credential issuer configured");
        }
        const account = await this.requireAccount(agentId);
        if (account.status !== "active") {
            throw new Error(`Cannot issue credential for ${account.status} identity account`);
        }
        const issued = await this.credentialIssuer.issueCredential({ ...input, agentId });
        const updated = {
            ...account,
            credentialIds: [...account.credentialIds, issued.credential.credentialId],
            auditLog: [...(account.auditLog ?? []), audit("credential_issued", "identity-registry", "credential issued")],
            updatedAt: new Date().toISOString()
        };
        await this.store.save(updated);
        return issued;
    }
    async lock(agentId, reason) {
        const account = await this.setStatus(agentId, "locked", reason);
        await this.applyCredentialStatus(account, "lock", reason);
        return account;
    }
    async unlock(agentId, reason) {
        const account = await this.setStatus(agentId, "active", reason);
        await this.applyCredentialStatus(account, "unlock", reason);
        return account;
    }
    async revoke(agentId, reason) {
        const account = await this.setStatus(agentId, "revoked", reason);
        await this.applyCredentialStatus(account, "revoke", reason);
        return account;
    }
    async get(agentId) {
        return this.store.get(agentId);
    }
    async list() {
        return this.store.list();
    }
    async setStatus(agentId, status, reason) {
        const account = await this.requireAccount(agentId);
        const eventType = status === "active" ? "unlocked" : status;
        const updated = {
            ...account,
            status,
            auditLog: [...(account.auditLog ?? []), audit(eventType, "identity-registry", reason)],
            updatedAt: new Date().toISOString()
        };
        await this.store.save(updated);
        return updated;
    }
    async applyCredentialStatus(account, action, reason) {
        if (!this.credentialIssuer) {
            return;
        }
        for (const credentialId of account.credentialIds) {
            if (action === "lock") {
                await this.credentialIssuer.lockCredential(credentialId, reason);
            }
            else if (action === "unlock") {
                await this.credentialIssuer.unlockCredential(credentialId, reason);
            }
            else {
                await this.credentialIssuer.revokeCredential(credentialId, reason);
            }
        }
    }
    async requireAccount(agentId) {
        const account = await this.store.get(agentId);
        if (!account) {
            throw new Error(`Identity account not found: ${agentId}`);
        }
        return account;
    }
}
function audit(type, actor, reason) {
    return {
        eventId: randomUUID(),
        type,
        actor,
        reason,
        createdAt: new Date().toISOString()
    };
}
function randomNode(length) {
    return randomUUID().replaceAll("-", "").slice(0, length).toUpperCase();
}
//# sourceMappingURL=identity-registry.js.map