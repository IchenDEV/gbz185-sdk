import { randomUUID } from "node:crypto";
import { formatIdentityCode } from "./identity-code.js";
import type { CredentialIssuer, IssuedCredential } from "./credentials.js";
import type { AgentDescription, AgentIdentityCode, JsonObject } from "./types.js";

export type IdentityAccountStatus = "active" | "locked" | "revoked";

export interface IdentityAccount {
  id: AgentIdentityCode;
  delegatorId: string;
  subject: string;
  description?: Partial<AgentDescription> | undefined;
  status: IdentityAccountStatus;
  credentialIds: string[];
  evidence?: JsonObject[] | undefined;
  auditLog?: IdentityAuditEvent[] | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface IdentityAuditEvent {
  eventId: string;
  type: "registered" | "updated" | "locked" | "unlocked" | "revoked" | "credential_issued";
  actor?: string | undefined;
  reason?: string | undefined;
  createdAt: string;
  metadata?: JsonObject | undefined;
}

export interface RegisterIdentityInput {
  delegatorId: string;
  subject: string;
  registrationServiceProvider: string;
  registrationRequester: string;
  ontologySerial?: string | undefined;
  instanceSerial?: string | undefined;
  description?: Partial<AgentDescription> | undefined;
  evidence?: JsonObject[] | undefined;
  issueCredential?: boolean | undefined;
  credentialAudience?: string[] | undefined;
  credentialScope?: string[] | undefined;
}

export interface RegisterIdentityResult {
  account: IdentityAccount;
  issuedCredential?: IssuedCredential | undefined;
}

export interface IdentityAccountStore {
  save(account: IdentityAccount): Promise<void>;
  get(agentId: AgentIdentityCode): Promise<IdentityAccount | undefined>;
  list(): Promise<IdentityAccount[]>;
}

export class InMemoryIdentityAccountStore implements IdentityAccountStore {
  private accounts = new Map<AgentIdentityCode, IdentityAccount>();

  async save(account: IdentityAccount): Promise<void> {
    this.accounts.set(account.id, account);
  }

  async get(agentId: AgentIdentityCode): Promise<IdentityAccount | undefined> {
    return this.accounts.get(agentId);
  }

  async list(): Promise<IdentityAccount[]> {
    return [...this.accounts.values()];
  }
}

export class IdentityRegistryRuntime {
  constructor(
    private readonly store: IdentityAccountStore = new InMemoryIdentityAccountStore(),
    private readonly credentialIssuer?: CredentialIssuer
  ) {}

  async register(input: RegisterIdentityInput): Promise<RegisterIdentityResult> {
    const now = new Date().toISOString();
    const agentId = formatIdentityCode({
      registrationServiceProvider: input.registrationServiceProvider,
      registrationRequester: input.registrationRequester,
      ontologySerial: input.ontologySerial ?? randomNode(8),
      instanceSerial: input.instanceSerial ?? "0"
    });
    const account: IdentityAccount = {
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

    let issuedCredential: IssuedCredential | undefined;
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

  async update(agentId: AgentIdentityCode, patch: Partial<Pick<IdentityAccount, "description" | "evidence">>): Promise<IdentityAccount> {
    const account = await this.requireAccount(agentId);
    const updated: IdentityAccount = {
      ...account,
      ...patch,
      auditLog: [...(account.auditLog ?? []), audit("updated", "identity-registry", "identity account updated")],
      updatedAt: new Date().toISOString()
    };
    await this.store.save(updated);
    return updated;
  }

  async issueCredential(agentId: AgentIdentityCode, input: Omit<Parameters<CredentialIssuer["issueCredential"]>[0], "agentId">): Promise<IssuedCredential> {
    if (!this.credentialIssuer) {
      throw new Error("No credential issuer configured");
    }
    const account = await this.requireAccount(agentId);
    if (account.status !== "active") {
      throw new Error(`Cannot issue credential for ${account.status} identity account`);
    }
    const issued = await this.credentialIssuer.issueCredential({ ...input, agentId });
    const updated: IdentityAccount = {
      ...account,
      credentialIds: [...account.credentialIds, issued.credential.credentialId],
      auditLog: [...(account.auditLog ?? []), audit("credential_issued", "identity-registry", "credential issued")],
      updatedAt: new Date().toISOString()
    };
    await this.store.save(updated);
    return issued;
  }

  async lock(agentId: AgentIdentityCode, reason?: string): Promise<IdentityAccount> {
    const account = await this.setStatus(agentId, "locked", reason);
    await this.applyCredentialStatus(account, "lock", reason);
    return account;
  }

  async unlock(agentId: AgentIdentityCode, reason?: string): Promise<IdentityAccount> {
    const account = await this.setStatus(agentId, "active", reason);
    await this.applyCredentialStatus(account, "unlock", reason);
    return account;
  }

  async revoke(agentId: AgentIdentityCode, reason?: string): Promise<IdentityAccount> {
    const account = await this.setStatus(agentId, "revoked", reason);
    await this.applyCredentialStatus(account, "revoke", reason);
    return account;
  }

  async get(agentId: AgentIdentityCode): Promise<IdentityAccount | undefined> {
    return this.store.get(agentId);
  }

  async list(): Promise<IdentityAccount[]> {
    return this.store.list();
  }

  private async setStatus(agentId: AgentIdentityCode, status: IdentityAccountStatus, reason?: string): Promise<IdentityAccount> {
    const account = await this.requireAccount(agentId);
    const eventType = status === "active" ? "unlocked" : status;
    const updated: IdentityAccount = {
      ...account,
      status,
      auditLog: [...(account.auditLog ?? []), audit(eventType, "identity-registry", reason)],
      updatedAt: new Date().toISOString()
    };
    await this.store.save(updated);
    return updated;
  }

  private async applyCredentialStatus(account: IdentityAccount, action: "lock" | "unlock" | "revoke", reason?: string): Promise<void> {
    if (!this.credentialIssuer) {
      return;
    }
    for (const credentialId of account.credentialIds) {
      if (action === "lock") {
        await this.credentialIssuer.lockCredential(credentialId, reason);
      } else if (action === "unlock") {
        await this.credentialIssuer.unlockCredential(credentialId, reason);
      } else {
        await this.credentialIssuer.revokeCredential(credentialId, reason);
      }
    }
  }

  private async requireAccount(agentId: AgentIdentityCode): Promise<IdentityAccount> {
    const account = await this.store.get(agentId);
    if (!account) {
      throw new Error(`Identity account not found: ${agentId}`);
    }
    return account;
  }
}

function audit(type: IdentityAuditEvent["type"], actor?: string, reason?: string): IdentityAuditEvent {
  return {
    eventId: randomUUID(),
    type,
    actor,
    reason,
    createdAt: new Date().toISOString()
  };
}

function randomNode(length: number): string {
  return randomUUID().replaceAll("-", "").slice(0, length).toUpperCase();
}
