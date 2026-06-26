import { AgentDescriptionMaintenance, AgentIdentityMaintenance } from "./agent-maintenance.js";
import { InterconnectionAuthorizationRuntime } from "./authorization.js";
import { AgentInterconnectClient } from "./client.js";
import { DevelopmentCredentialIssuer, DevelopmentCredentialVerifier, InMemoryCredentialRepository, InMemoryCredentialStatusStore } from "./credentials.js";
import { AgentDescriptionRegistry } from "./description-registry.js";
import { DiscoveryService } from "./discovery.js";
import { IdentityRegistryRuntime } from "./identity-registry.js";
import { InteractionRuntime } from "./interaction.js";
import { MessageDistributionRuntime } from "./message-distribution.js";
import { ToolAccessRuntime } from "./tool-access.js";
import { InProcessJsonTransport } from "./transport.js";
import { ToolRuntime } from "./tools.js";

export interface AgentInterconnectRuntime {
  credentials: {
    repository: InMemoryCredentialRepository;
    statusStore: InMemoryCredentialStatusStore;
    issuer: DevelopmentCredentialIssuer;
    verifier: DevelopmentCredentialVerifier;
  };
  agentIdentityMaintenance: AgentIdentityMaintenance;
  agentDescriptionMaintenance: AgentDescriptionMaintenance;
  interconnectionAuthorization: InterconnectionAuthorizationRuntime;
  identityRegistry: IdentityRegistryRuntime;
  descriptionRegistry: AgentDescriptionRegistry;
  discoveryService: DiscoveryService;
  interactionRuntime: InteractionRuntime;
  messageDistribution: MessageDistributionRuntime;
  toolRuntime: ToolRuntime;
  toolAccess: ToolAccessRuntime;
  transport: InProcessJsonTransport;
  client: AgentInterconnectClient;
}

export function createAgentInterconnectRuntime(): AgentInterconnectRuntime {
  const credentialRepository = new InMemoryCredentialRepository();
  const credentialStatusStore = new InMemoryCredentialStatusStore();
  const credentialIssuer = new DevelopmentCredentialIssuer(credentialRepository, credentialStatusStore);
  const credentialVerifier = new DevelopmentCredentialVerifier(credentialStatusStore);
  const identityRegistry = new IdentityRegistryRuntime(undefined, credentialIssuer);
  const descriptionRegistry = new AgentDescriptionRegistry();
  const discoveryService = new DiscoveryService(descriptionRegistry);
  const interactionRuntime = new InteractionRuntime();
  const messageDistribution = new MessageDistributionRuntime(interactionRuntime);
  const toolRuntime = new ToolRuntime();
  const toolAccess = new ToolAccessRuntime(toolRuntime);
  const agentIdentityMaintenance = new AgentIdentityMaintenance(identityRegistry, credentialIssuer);
  const agentDescriptionMaintenance = new AgentDescriptionMaintenance(descriptionRegistry);
  const interconnectionAuthorization = new InterconnectionAuthorizationRuntime(credentialVerifier);
  const transport = new InProcessJsonTransport();

  transport.register("identity.register", (payload) => identityRegistry.register(payload as Parameters<IdentityRegistryRuntime["register"]>[0]));
  transport.register("identity.get", (payload) => identityRegistry.get((payload as { agentId: string }).agentId));
  transport.register("identity.issueCredential", (payload) => {
    const typed = payload as { agentId: string; input: Parameters<IdentityRegistryRuntime["issueCredential"]>[1] };
    return identityRegistry.issueCredential(typed.agentId, typed.input);
  });
  transport.register("identity.lock", (payload) => {
    const typed = payload as { agentId: string; reason?: string | undefined };
    return identityRegistry.lock(typed.agentId, typed.reason);
  });
  transport.register("identity.unlock", (payload) => {
    const typed = payload as { agentId: string; reason?: string | undefined };
    return identityRegistry.unlock(typed.agentId, typed.reason);
  });
  transport.register("identity.revoke", (payload) => {
    const typed = payload as { agentId: string; reason?: string | undefined };
    return identityRegistry.revoke(typed.agentId, typed.reason);
  });
  transport.register("description.register", (payload) => descriptionRegistry.register(payload as Parameters<AgentDescriptionRegistry["register"]>[0]));
  transport.register("description.review", (payload) => {
    const typed = payload as { agentId: string; review: Parameters<AgentDescriptionRegistry["review"]>[1] };
    return descriptionRegistry.review(typed.agentId, typed.review);
  });
  transport.register("description.issuePublicationCertificate", (payload) => {
    const typed = payload as { agentId: string; input: Parameters<AgentDescriptionRegistry["issuePublicationCertificate"]>[1] };
    return descriptionRegistry.issuePublicationCertificate(typed.agentId, typed.input);
  });
  transport.register("description.publish", (payload) => {
    const typed = payload as { agentId: string; publication?: Parameters<AgentDescriptionRegistry["publish"]>[1] };
    return descriptionRegistry.publish(typed.agentId, typed.publication);
  });
  transport.register("description.unpublish", (payload) => descriptionRegistry.unpublish((payload as { agentId: string }).agentId));
  transport.register("description.revoke", (payload) => {
    const typed = payload as { agentId: string; reason?: string | undefined };
    return descriptionRegistry.revoke(typed.agentId, typed.reason);
  });
  transport.register("discovery.discover", (payload) => discoveryService.discover(payload as Parameters<DiscoveryService["discover"]>[0]));
  transport.register("interaction.createSession", (payload) => interactionRuntime.createSession(payload as Parameters<InteractionRuntime["createSession"]>[0]));
  transport.register("interaction.submitTask", (payload) => interactionRuntime.submitTask(payload as Parameters<InteractionRuntime["submitTask"]>[0]));
  transport.register("interaction.sendMessage", (payload) => interactionRuntime.sendMessage(payload as Parameters<InteractionRuntime["sendMessage"]>[0]));
  transport.register("interaction.distributeMessage", (payload) => {
    const typed = payload as { input: Parameters<MessageDistributionRuntime["distribute"]>[0]; recipients?: Parameters<MessageDistributionRuntime["distribute"]>[1] };
    return messageDistribution.distribute(typed.input, typed.recipients);
  });
  transport.register("tool.list", (payload) => toolRuntime.listTools((payload as { toolRequestList?: string[] | undefined }).toolRequestList));
  transport.register("tool.updates", () => toolRuntime.getUpdates());
  transport.register("tool.invoke", (payload) => toolRuntime.invoke(payload as Parameters<ToolRuntime["invoke"]>[0]));

  const client = new AgentInterconnectClient(transport);
  return {
    credentials: {
      repository: credentialRepository,
      statusStore: credentialStatusStore,
      issuer: credentialIssuer,
      verifier: credentialVerifier
    },
    agentIdentityMaintenance,
    agentDescriptionMaintenance,
    interconnectionAuthorization,
    identityRegistry,
    descriptionRegistry,
    discoveryService,
    interactionRuntime,
    messageDistribution,
    toolRuntime,
    toolAccess,
    transport,
    client
  };
}
