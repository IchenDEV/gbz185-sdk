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
export declare function createAgentInterconnectRuntime(): AgentInterconnectRuntime;
//# sourceMappingURL=factory.d.ts.map