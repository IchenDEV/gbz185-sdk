export class AgentIdentityMaintenance {
    registry;
    credentialIssuer;
    activeAccount;
    credentials = new Map();
    constructor(registry, credentialIssuer) {
        this.registry = registry;
        this.credentialIssuer = credentialIssuer;
    }
    get identityCode() {
        return this.activeAccount?.id;
    }
    listCredentials() {
        return [...this.credentials.values()];
    }
    async register(input) {
        const result = await this.registry.register(input);
        this.activeAccount = result.account;
        if (result.issuedCredential) {
            this.credentials.set(result.issuedCredential.credential.credentialId, result.issuedCredential);
        }
        return result;
    }
    async refresh() {
        if (!this.activeAccount) {
            return undefined;
        }
        this.activeAccount = await this.registry.get(this.activeAccount.id);
        return this.activeAccount;
    }
    async update(patch) {
        const account = this.requireAccount();
        this.activeAccount = await this.registry.update(account.id, patch);
        return this.activeAccount;
    }
    async issueCredential(input) {
        const account = this.requireAccount();
        const issued = await this.registry.issueCredential(account.id, input);
        this.credentials.set(issued.credential.credentialId, issued);
        await this.refresh();
        return issued;
    }
    async lock(reason) {
        const account = this.requireAccount();
        this.activeAccount = await this.registry.lock(account.id, reason);
        return this.activeAccount;
    }
    async unlock(reason) {
        const account = this.requireAccount();
        this.activeAccount = await this.registry.unlock(account.id, reason);
        return this.activeAccount;
    }
    async revoke(reason) {
        const account = this.requireAccount();
        this.activeAccount = await this.registry.revoke(account.id, reason);
        return this.activeAccount;
    }
    async lockCredential(credentialId, reason) {
        if (!this.credentialIssuer) {
            throw new Error("No credential issuer configured");
        }
        await this.credentialIssuer.lockCredential(credentialId, reason);
    }
    async unlockCredential(credentialId, reason) {
        if (!this.credentialIssuer) {
            throw new Error("No credential issuer configured");
        }
        await this.credentialIssuer.unlockCredential(credentialId, reason);
    }
    async revokeCredential(credentialId, reason) {
        if (!this.credentialIssuer) {
            throw new Error("No credential issuer configured");
        }
        await this.credentialIssuer.revokeCredential(credentialId, reason);
    }
    requireAccount() {
        if (!this.activeAccount) {
            throw new Error("Agent identity has not been registered");
        }
        return this.activeAccount;
    }
}
export class AgentDescriptionMaintenance {
    registry;
    constructor(registry) {
        this.registry = registry;
    }
    async register(description) {
        return this.registry.register(description);
    }
    async requestReview(agentId, reviewerId, approved, reason) {
        return this.registry.review(agentId, { reviewerId, approved, reason });
    }
    async publish(agentId, publication) {
        return this.registry.publish(agentId, publication);
    }
    async change(agentId, patch) {
        return this.registry.change(agentId, patch);
    }
    async unpublish(agentId) {
        return this.registry.unpublish(agentId);
    }
    async revoke(agentId, reason) {
        return this.registry.revoke(agentId, reason);
    }
}
//# sourceMappingURL=agent-maintenance.js.map