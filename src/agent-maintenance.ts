import type { CredentialIssuer, IssuedCredential } from "./credentials.js";
import type { AgentDescriptionRegistry, DescriptionRecord, PublicationRequestInfo } from "./description-registry.js";
import type { IdentityAccount, IdentityRegistryRuntime, RegisterIdentityInput, RegisterIdentityResult } from "./identity-registry.js";
import type { AgentDescription, AgentIdentityCode } from "./types.js";

export class AgentIdentityMaintenance {
  private activeAccount: IdentityAccount | undefined;
  private credentials = new Map<string, IssuedCredential>();

  constructor(
    private readonly registry: IdentityRegistryRuntime,
    private readonly credentialIssuer?: CredentialIssuer
  ) {}

  get identityCode(): AgentIdentityCode | undefined {
    return this.activeAccount?.id;
  }

  listCredentials(): IssuedCredential[] {
    return [...this.credentials.values()];
  }

  async register(input: RegisterIdentityInput): Promise<RegisterIdentityResult> {
    const result = await this.registry.register(input);
    this.activeAccount = result.account;
    if (result.issuedCredential) {
      this.credentials.set(result.issuedCredential.credential.credentialId, result.issuedCredential);
    }
    return result;
  }

  async refresh(): Promise<IdentityAccount | undefined> {
    if (!this.activeAccount) {
      return undefined;
    }
    this.activeAccount = await this.registry.get(this.activeAccount.id);
    return this.activeAccount;
  }

  async update(patch: Parameters<IdentityRegistryRuntime["update"]>[1]): Promise<IdentityAccount> {
    const account = this.requireAccount();
    this.activeAccount = await this.registry.update(account.id, patch);
    return this.activeAccount;
  }

  async issueCredential(input: Omit<Parameters<IdentityRegistryRuntime["issueCredential"]>[1], "agentId">): Promise<IssuedCredential> {
    const account = this.requireAccount();
    const issued = await this.registry.issueCredential(account.id, input);
    this.credentials.set(issued.credential.credentialId, issued);
    await this.refresh();
    return issued;
  }

  async lock(reason?: string): Promise<IdentityAccount> {
    const account = this.requireAccount();
    this.activeAccount = await this.registry.lock(account.id, reason);
    return this.activeAccount;
  }

  async unlock(reason?: string): Promise<IdentityAccount> {
    const account = this.requireAccount();
    this.activeAccount = await this.registry.unlock(account.id, reason);
    return this.activeAccount;
  }

  async revoke(reason?: string): Promise<IdentityAccount> {
    const account = this.requireAccount();
    this.activeAccount = await this.registry.revoke(account.id, reason);
    return this.activeAccount;
  }

  async lockCredential(credentialId: string, reason?: string): Promise<void> {
    if (!this.credentialIssuer) {
      throw new Error("No credential issuer configured");
    }
    await this.credentialIssuer.lockCredential(credentialId, reason);
  }

  async unlockCredential(credentialId: string, reason?: string): Promise<void> {
    if (!this.credentialIssuer) {
      throw new Error("No credential issuer configured");
    }
    await this.credentialIssuer.unlockCredential(credentialId, reason);
  }

  async revokeCredential(credentialId: string, reason?: string): Promise<void> {
    if (!this.credentialIssuer) {
      throw new Error("No credential issuer configured");
    }
    await this.credentialIssuer.revokeCredential(credentialId, reason);
  }

  private requireAccount(): IdentityAccount {
    if (!this.activeAccount) {
      throw new Error("Agent identity has not been registered");
    }
    return this.activeAccount;
  }
}

export class AgentDescriptionMaintenance {
  constructor(private readonly registry: AgentDescriptionRegistry) {}

  async register(description: AgentDescription): Promise<DescriptionRecord> {
    return this.registry.register(description);
  }

  async requestReview(agentId: AgentIdentityCode, reviewerId: string, approved: boolean, reason?: string): Promise<DescriptionRecord> {
    return this.registry.review(agentId, { reviewerId, approved, reason });
  }

  async publish(agentId: AgentIdentityCode, publication?: PublicationRequestInfo): Promise<DescriptionRecord> {
    return this.registry.publish(agentId, publication);
  }

  async change(agentId: AgentIdentityCode, patch: Partial<AgentDescription>): Promise<DescriptionRecord> {
    return this.registry.change(agentId, patch);
  }

  async unpublish(agentId: AgentIdentityCode): Promise<DescriptionRecord> {
    return this.registry.unpublish(agentId);
  }

  async revoke(agentId: AgentIdentityCode, reason?: string): Promise<DescriptionRecord> {
    return this.registry.revoke(agentId, reason);
  }
}
