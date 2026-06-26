import type { JsonTransport } from "./transport.js";
import type { DescriptionRecord, DescriptionReview, PublicationCertificate, PublicationRequestInfo } from "./description-registry.js";
import type { IdentityAccount, RegisterIdentityInput, RegisterIdentityResult } from "./identity-registry.js";
import type { AgentDescription, AgentIdentityCode, DiscoveryQuery, DiscoveryResult, Message, Session, ToolInvokeRequest, ToolInvokeResult, ToolSyncData, ToolUpdateData } from "./types.js";
import type { CreateSessionInput, SendMessageInput, SubmitTaskInput } from "./interaction.js";
import type { Task } from "./types.js";
import type { DistributionReceipt } from "./message-distribution.js";
import type { IssuedCredential } from "./credentials.js";

export class AgentInterconnectClient {
  constructor(private readonly transport: JsonTransport) {}

  registerIdentity(input: RegisterIdentityInput): Promise<RegisterIdentityResult> {
    return this.transport.request<RegisterIdentityInput, RegisterIdentityResult>("identity.register", input);
  }

  getIdentity(agentId: AgentIdentityCode): Promise<IdentityAccount | undefined> {
    return this.transport.request<{ agentId: AgentIdentityCode }, IdentityAccount | undefined>("identity.get", { agentId });
  }

  issueCredential(agentId: AgentIdentityCode, input: { subject: string; audience?: string[]; scope?: string[]; expiresAt?: string }): Promise<IssuedCredential> {
    return this.transport.request("identity.issueCredential", { agentId, input });
  }

  lockIdentity(agentId: AgentIdentityCode, reason?: string): Promise<IdentityAccount> {
    return this.transport.request("identity.lock", { agentId, reason });
  }

  unlockIdentity(agentId: AgentIdentityCode, reason?: string): Promise<IdentityAccount> {
    return this.transport.request("identity.unlock", { agentId, reason });
  }

  revokeIdentity(agentId: AgentIdentityCode, reason?: string): Promise<IdentityAccount> {
    return this.transport.request("identity.revoke", { agentId, reason });
  }

  registerDescription(description: AgentDescription): Promise<DescriptionRecord> {
    return this.transport.request<AgentDescription, DescriptionRecord>("description.register", description);
  }

  publishDescription(agentId: AgentIdentityCode): Promise<DescriptionRecord> {
    return this.transport.request<{ agentId: AgentIdentityCode }, DescriptionRecord>("description.publish", { agentId });
  }

  reviewDescription(agentId: AgentIdentityCode, review: Omit<DescriptionReview, "reviewId" | "createdAt">): Promise<DescriptionRecord> {
    return this.transport.request("description.review", { agentId, review });
  }

  issuePublicationCertificate(
    agentId: AgentIdentityCode,
    input: Omit<PublicationCertificate, "certificateId" | "agentId" | "issuedAt">
  ): Promise<PublicationCertificate> {
    return this.transport.request("description.issuePublicationCertificate", { agentId, input });
  }

  publishDescriptionWithInfo(agentId: AgentIdentityCode, publication?: PublicationRequestInfo): Promise<DescriptionRecord> {
    return this.transport.request("description.publish", { agentId, publication });
  }

  unpublishDescription(agentId: AgentIdentityCode): Promise<DescriptionRecord> {
    return this.transport.request("description.unpublish", { agentId });
  }

  revokeDescription(agentId: AgentIdentityCode, reason?: string): Promise<DescriptionRecord> {
    return this.transport.request("description.revoke", { agentId, reason });
  }

  discover(query: DiscoveryQuery): Promise<DiscoveryResult[]> {
    return this.transport.request<DiscoveryQuery, DiscoveryResult[]>("discovery.discover", query);
  }

  createSession(input: CreateSessionInput): Promise<Session> {
    return this.transport.request<CreateSessionInput, Session>("interaction.createSession", input);
  }

  submitTask(input: SubmitTaskInput): Promise<Task> {
    return this.transport.request<SubmitTaskInput, Task>("interaction.submitTask", input);
  }

  sendMessage(input: SendMessageInput): Promise<Message> {
    return this.transport.request<SendMessageInput, Message>("interaction.sendMessage", input);
  }

  distributeMessage(input: SendMessageInput, recipients?: AgentIdentityCode[]): Promise<DistributionReceipt[]> {
    return this.transport.request("interaction.distributeMessage", { input, recipients });
  }

  listTools(toolRequestList?: string[]): Promise<ToolSyncData> {
    return this.transport.request<{ toolRequestList?: string[] | undefined }, ToolSyncData>("tool.list", { toolRequestList });
  }

  syncToolUpdates(): Promise<ToolUpdateData> {
    return this.transport.request("tool.updates", {});
  }

  invokeTools(request: ToolInvokeRequest): Promise<ToolInvokeResult> {
    return this.transport.request<ToolInvokeRequest, ToolInvokeResult>("tool.invoke", request);
  }
}
