import type { CredentialIssuer, IssuedCredential } from "./credentials.js";
import type { AgentDescriptionRegistry, DescriptionRecord, PublicationRequestInfo } from "./description-registry.js";
import type { IdentityAccount, IdentityRegistryRuntime, RegisterIdentityInput, RegisterIdentityResult } from "./identity-registry.js";
import type { AgentDescription, AgentIdentityCode } from "./types.js";
export declare class AgentIdentityMaintenance {
    private readonly registry;
    private readonly credentialIssuer?;
    private activeAccount;
    private credentials;
    constructor(registry: IdentityRegistryRuntime, credentialIssuer?: CredentialIssuer | undefined);
    get identityCode(): AgentIdentityCode | undefined;
    listCredentials(): IssuedCredential[];
    register(input: RegisterIdentityInput): Promise<RegisterIdentityResult>;
    refresh(): Promise<IdentityAccount | undefined>;
    update(patch: Parameters<IdentityRegistryRuntime["update"]>[1]): Promise<IdentityAccount>;
    issueCredential(input: Omit<Parameters<IdentityRegistryRuntime["issueCredential"]>[1], "agentId">): Promise<IssuedCredential>;
    lock(reason?: string): Promise<IdentityAccount>;
    unlock(reason?: string): Promise<IdentityAccount>;
    revoke(reason?: string): Promise<IdentityAccount>;
    lockCredential(credentialId: string, reason?: string): Promise<void>;
    unlockCredential(credentialId: string, reason?: string): Promise<void>;
    revokeCredential(credentialId: string, reason?: string): Promise<void>;
    private requireAccount;
}
export declare class AgentDescriptionMaintenance {
    private readonly registry;
    constructor(registry: AgentDescriptionRegistry);
    register(description: AgentDescription): Promise<DescriptionRecord>;
    requestReview(agentId: AgentIdentityCode, reviewerId: string, approved: boolean, reason?: string): Promise<DescriptionRecord>;
    publish(agentId: AgentIdentityCode, publication?: PublicationRequestInfo): Promise<DescriptionRecord>;
    change(agentId: AgentIdentityCode, patch: Partial<AgentDescription>): Promise<DescriptionRecord>;
    unpublish(agentId: AgentIdentityCode): Promise<DescriptionRecord>;
    revoke(agentId: AgentIdentityCode, reason?: string): Promise<DescriptionRecord>;
}
//# sourceMappingURL=agent-maintenance.d.ts.map