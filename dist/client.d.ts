import type { JsonTransport } from "./transport.js";
import type { DescriptionRecord, DescriptionReview, PublicationCertificate, PublicationRequestInfo } from "./description-registry.js";
import type { IdentityAccount, RegisterIdentityInput, RegisterIdentityResult } from "./identity-registry.js";
import type { AgentDescription, AgentIdentityCode, DiscoveryQuery, DiscoveryResult, Message, Session, ToolInvokeRequest, ToolInvokeResult, ToolSyncData, ToolUpdateData } from "./types.js";
import type { CreateSessionInput, SendMessageInput, SubmitTaskInput } from "./interaction.js";
import type { Task } from "./types.js";
import type { DistributionReceipt } from "./message-distribution.js";
import type { IssuedCredential } from "./credentials.js";
export declare class AgentInterconnectClient {
    private readonly transport;
    constructor(transport: JsonTransport);
    registerIdentity(input: RegisterIdentityInput): Promise<RegisterIdentityResult>;
    getIdentity(agentId: AgentIdentityCode): Promise<IdentityAccount | undefined>;
    issueCredential(agentId: AgentIdentityCode, input: {
        subject: string;
        audience?: string[];
        scope?: string[];
        expiresAt?: string;
    }): Promise<IssuedCredential>;
    lockIdentity(agentId: AgentIdentityCode, reason?: string): Promise<IdentityAccount>;
    unlockIdentity(agentId: AgentIdentityCode, reason?: string): Promise<IdentityAccount>;
    revokeIdentity(agentId: AgentIdentityCode, reason?: string): Promise<IdentityAccount>;
    registerDescription(description: AgentDescription): Promise<DescriptionRecord>;
    publishDescription(agentId: AgentIdentityCode): Promise<DescriptionRecord>;
    reviewDescription(agentId: AgentIdentityCode, review: Omit<DescriptionReview, "reviewId" | "createdAt">): Promise<DescriptionRecord>;
    issuePublicationCertificate(agentId: AgentIdentityCode, input: Omit<PublicationCertificate, "certificateId" | "agentId" | "issuedAt">): Promise<PublicationCertificate>;
    publishDescriptionWithInfo(agentId: AgentIdentityCode, publication?: PublicationRequestInfo): Promise<DescriptionRecord>;
    unpublishDescription(agentId: AgentIdentityCode): Promise<DescriptionRecord>;
    revokeDescription(agentId: AgentIdentityCode, reason?: string): Promise<DescriptionRecord>;
    discover(query: DiscoveryQuery): Promise<DiscoveryResult[]>;
    createSession(input: CreateSessionInput): Promise<Session>;
    submitTask(input: SubmitTaskInput): Promise<Task>;
    sendMessage(input: SendMessageInput): Promise<Message>;
    distributeMessage(input: SendMessageInput, recipients?: AgentIdentityCode[]): Promise<DistributionReceipt[]>;
    listTools(toolRequestList?: string[]): Promise<ToolSyncData>;
    syncToolUpdates(): Promise<ToolUpdateData>;
    invokeTools(request: ToolInvokeRequest): Promise<ToolInvokeResult>;
}
//# sourceMappingURL=client.d.ts.map