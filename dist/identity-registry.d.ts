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
export declare class InMemoryIdentityAccountStore implements IdentityAccountStore {
    private accounts;
    save(account: IdentityAccount): Promise<void>;
    get(agentId: AgentIdentityCode): Promise<IdentityAccount | undefined>;
    list(): Promise<IdentityAccount[]>;
}
export declare class IdentityRegistryRuntime {
    private readonly store;
    private readonly credentialIssuer?;
    constructor(store?: IdentityAccountStore, credentialIssuer?: CredentialIssuer | undefined);
    register(input: RegisterIdentityInput): Promise<RegisterIdentityResult>;
    update(agentId: AgentIdentityCode, patch: Partial<Pick<IdentityAccount, "description" | "evidence">>): Promise<IdentityAccount>;
    issueCredential(agentId: AgentIdentityCode, input: Omit<Parameters<CredentialIssuer["issueCredential"]>[0], "agentId">): Promise<IssuedCredential>;
    lock(agentId: AgentIdentityCode, reason?: string): Promise<IdentityAccount>;
    unlock(agentId: AgentIdentityCode, reason?: string): Promise<IdentityAccount>;
    revoke(agentId: AgentIdentityCode, reason?: string): Promise<IdentityAccount>;
    get(agentId: AgentIdentityCode): Promise<IdentityAccount | undefined>;
    list(): Promise<IdentityAccount[]>;
    private setStatus;
    private applyCredentialStatus;
    private requireAccount;
}
//# sourceMappingURL=identity-registry.d.ts.map