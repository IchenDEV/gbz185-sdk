export type Gbz185Domain = "agent" | "management_service" | "interconnection_service" | "resource_access";

export interface Gbz185FunctionDescriptor {
  id: string;
  domain: Gbz185Domain;
  name: string;
  sdkSurface: string;
  standardPart: string;
}

export interface Gbz185FraiInterfaceDescriptor {
  id: `FRAI-${string}`;
  standardPart: string;
  functionA: string;
  functionB: string;
  sdkSurface: string;
}

export const GBZ185_FUNCTIONS: Gbz185FunctionDescriptor[] = [
  {
    id: "agent.identityMaintenance",
    domain: "agent",
    name: "Agent identity maintenance",
    sdkSurface: "AgentIdentityMaintenance",
    standardPart: "GB/Z 185.1, GB/Z 185.2, GB/Z 185.3"
  },
  {
    id: "agent.descriptionMaintenance",
    domain: "agent",
    name: "Agent description maintenance",
    sdkSurface: "AgentDescriptionMaintenance",
    standardPart: "GB/Z 185.1, GB/Z 185.4"
  },
  {
    id: "agent.interconnectionAuthorization",
    domain: "agent",
    name: "Agent interconnection authorization",
    sdkSurface: "InterconnectionAuthorizationRuntime",
    standardPart: "GB/Z 185.1, GB/Z 185.3"
  },
  {
    id: "agent.interaction",
    domain: "agent",
    name: "Agent interaction",
    sdkSurface: "InteractionRuntime",
    standardPart: "GB/Z 185.6"
  },
  {
    id: "agent.toolAccess",
    domain: "agent",
    name: "Tool access",
    sdkSurface: "ToolAccessRuntime",
    standardPart: "GB/Z 185.7"
  },
  {
    id: "management.identityManagement",
    domain: "management_service",
    name: "Agent identity management",
    sdkSurface: "IdentityRegistryRuntime",
    standardPart: "GB/Z 185.3"
  },
  {
    id: "management.credentialManagement",
    domain: "management_service",
    name: "Agent credential management",
    sdkSurface: "CredentialIssuer",
    standardPart: "GB/Z 185.3"
  },
  {
    id: "management.identityAuthentication",
    domain: "management_service",
    name: "Agent identity authentication",
    sdkSurface: "CredentialVerifier",
    standardPart: "GB/Z 185.3"
  },
  {
    id: "interconnection.descriptionManagement",
    domain: "interconnection_service",
    name: "Agent description management",
    sdkSurface: "AgentDescriptionRegistry",
    standardPart: "GB/Z 185.4"
  },
  {
    id: "interconnection.discovery",
    domain: "interconnection_service",
    name: "Agent discovery",
    sdkSurface: "DiscoveryService",
    standardPart: "GB/Z 185.5"
  },
  {
    id: "interconnection.messageDistribution",
    domain: "interconnection_service",
    name: "Message distribution",
    sdkSurface: "MessageDistributionRuntime",
    standardPart: "GB/Z 185.6"
  },
  {
    id: "resource.toolService",
    domain: "resource_access",
    name: "Tool service",
    sdkSurface: "ToolRuntime",
    standardPart: "GB/Z 185.7"
  }
];

export const GBZ185_FRAI_INTERFACES: Gbz185FraiInterfaceDescriptor[] = [
  {
    id: "FRAI-01",
    standardPart: "GB/Z 185.3",
    functionA: "Agent identity maintenance",
    functionB: "Agent identity management",
    sdkSurface: "AgentIdentityMaintenance + IdentityRegistryRuntime"
  },
  {
    id: "FRAI-02",
    standardPart: "GB/Z 185.3",
    functionA: "Agent identity maintenance",
    functionB: "Agent credential management",
    sdkSurface: "AgentIdentityMaintenance + CredentialIssuer"
  },
  {
    id: "FRAI-03",
    standardPart: "GB/Z 185.3",
    functionA: "Agent interconnection authorization",
    functionB: "Agent identity authentication",
    sdkSurface: "InterconnectionAuthorizationRuntime + CredentialVerifier"
  },
  {
    id: "FRAI-04",
    standardPart: "GB/Z 185.3",
    functionA: "Agent identity management",
    functionB: "Agent credential management",
    sdkSurface: "IdentityRegistryRuntime.issueCredential"
  },
  {
    id: "FRAI-05",
    standardPart: "GB/Z 185.3",
    functionA: "Agent credential management",
    functionB: "Agent identity authentication",
    sdkSurface: "CredentialStatusStore + CredentialVerifier"
  },
  {
    id: "FRAI-06",
    standardPart: "GB/Z 185.4",
    functionA: "Agent description maintenance",
    functionB: "Agent description management",
    sdkSurface: "AgentDescriptionMaintenance + AgentDescriptionRegistry"
  },
  {
    id: "FRAI-07",
    standardPart: "GB/Z 185.5",
    functionA: "Agent description management",
    functionB: "Agent discovery",
    sdkSurface: "AgentDescriptionRegistry + DiscoveryService"
  },
  {
    id: "FRAI-08",
    standardPart: "GB/Z 185.6",
    functionA: "Agent interaction",
    functionB: "Agent interaction",
    sdkSurface: "InteractionRuntime"
  },
  {
    id: "FRAI-09",
    standardPart: "GB/Z 185.6",
    functionA: "Agent interaction",
    functionB: "Message distribution",
    sdkSurface: "InteractionRuntime + MessageDistributionRuntime"
  },
  {
    id: "FRAI-10",
    standardPart: "GB/Z 185.7",
    functionA: "Tool access",
    functionB: "Tool service",
    sdkSurface: "ToolAccessRuntime + ToolRuntime"
  }
];
