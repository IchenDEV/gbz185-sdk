export type ConformanceStatus = "covered" | "covered_by_reference_runtime" | "extension_point";

export interface Gbz185ConformanceItem {
  part: "GB/Z 185.1" | "GB/Z 185.2" | "GB/Z 185.3" | "GB/Z 185.4" | "GB/Z 185.5" | "GB/Z 185.6" | "GB/Z 185.7";
  clause: string;
  topic: string;
  status: ConformanceStatus;
  sdkSurface: string[];
  notes: string;
}

export const GBZ185_CONFORMANCE_MATRIX: Gbz185ConformanceItem[] = [
  {
    part: "GB/Z 185.1",
    clause: "5",
    topic: "Concept model domains: user, agent, management service, interconnection service, resource access",
    status: "covered",
    sdkSurface: ["createAgentInterconnectRuntime", "AgentInterconnectRuntime", "GBZ185_FUNCTIONS"],
    notes: "Runtime wires all standard domains except user UI, which is represented by callers using the SDK."
  },
  {
    part: "GB/Z 185.1",
    clause: "6.2",
    topic: "Functional reference architecture function set",
    status: "covered",
    sdkSurface: ["GBZ185_FUNCTIONS"],
    notes: "All 12 function domains listed in the standard are represented by exported runtime surfaces or interfaces."
  },
  {
    part: "GB/Z 185.1",
    clause: "6.3",
    topic: "FRAI-01 through FRAI-10 reference interfaces",
    status: "covered",
    sdkSurface: ["GBZ185_FRAI_INTERFACES"],
    notes: "Machine-readable interface coverage map is exported and tested."
  },
  {
    part: "GB/Z 185.2",
    clause: "5.1-5.6",
    topic: "Identity code OID structure, version, registration service provider, requester, custom serials",
    status: "covered",
    sdkSurface: ["formatIdentityCode", "parseIdentityCode", "validateIdentityCode", "validateIdentityCodeParts"],
    notes: "Uses fixed OID prefix 1.2.156.3088 and current version 1; validates base36 node lengths."
  },
  {
    part: "GB/Z 185.2",
    clause: "6",
    topic: "Identity code allocation and management rules",
    status: "covered_by_reference_runtime",
    sdkSurface: ["IdentityRegistryRuntime", "AgentIdentityMaintenance"],
    notes: "Reference runtime allocates and preserves identity codes; external registries can replace the store."
  },
  {
    part: "GB/Z 185.2",
    clause: "Appendix B",
    topic: "International agent identity-code acquisition modes",
    status: "extension_point",
    sdkSurface: ["IdentityAccountStore", "IdentityRegistryRuntime"],
    notes: "The standard describes governance paths; the SDK leaves authority approval and cross-border registry integration to adapters."
  },
  {
    part: "GB/Z 185.3",
    clause: "5",
    topic: "Identity management framework roles and flows",
    status: "covered",
    sdkSurface: ["IdentityRegistryRuntime", "CredentialIssuer", "CredentialVerifier", "InterconnectionAuthorizationRuntime"],
    notes: "Delegator, agent, issuer, verifier, relying-party flow concepts are represented in types and runtimes."
  },
  {
    part: "GB/Z 185.3",
    clause: "6",
    topic: "Identity registration and evidence verification",
    status: "covered_by_reference_runtime",
    sdkSurface: ["IdentityRegistryRuntime.register", "RegisterIdentityInput.evidence"],
    notes: "Evidence is accepted and stored; actual legal/risk verification policies are application adapters."
  },
  {
    part: "GB/Z 185.3",
    clause: "7",
    topic: "Identity account update, lock, unlock, revoke, audit",
    status: "covered_by_reference_runtime",
    sdkSurface: ["IdentityRegistryRuntime.update", "IdentityRegistryRuntime.lock", "IdentityRegistryRuntime.unlock", "IdentityRegistryRuntime.revoke", "IdentityAuditEvent"],
    notes: "Revocation links to credential revocation for credentials issued through the account."
  },
  {
    part: "GB/Z 185.3",
    clause: "8",
    topic: "Credential issue, update, lock, unlock, revoke and status query",
    status: "covered_by_reference_runtime",
    sdkSurface: ["CredentialIssuer", "DevelopmentCredentialIssuer", "CredentialStatusStore", "InMemoryCredentialStatusStore"],
    notes: "Development implementation provides lifecycle behavior; production CA/status services should implement the same interfaces."
  },
  {
    part: "GB/Z 185.3",
    clause: "9",
    topic: "Credential presentation, verification, authentication assertion, authorization decision",
    status: "covered_by_reference_runtime",
    sdkSurface: ["createProcessCredentialPackage", "CredentialVerifier", "DevelopmentCredentialVerifier", "InterconnectionAuthorizationRuntime"],
    notes: "Includes audience, scope, validity, status, signature, and tamper checks."
  },
  {
    part: "GB/Z 185.3",
    clause: "9.2",
    topic: "National CA roots, national algorithms, tamper-proof audit requirements",
    status: "extension_point",
    sdkSurface: ["CertificateChainVerifier", "CredentialStatusStore", "CredentialIssuer", "CredentialVerifier"],
    notes: "The SDK is X.509-first by interface; regulator-approved CA, GM/T algorithms, and immutable audit stores are external implementations."
  },
  {
    part: "GB/Z 185.4",
    clause: "5",
    topic: "Agent description and skill attributes",
    status: "covered",
    sdkSurface: ["AgentDescription", "SkillDescription", "validateAgentDescription", "validateSkillDescription"],
    notes: "Required description and skill fields are typed and validated."
  },
  {
    part: "GB/Z 185.4",
    clause: "6-8",
    topic: "Description registration, review, publication certificate, publish, change, unpublish, revoke",
    status: "covered_by_reference_runtime",
    sdkSurface: ["AgentDescriptionRegistry", "AgentDescriptionMaintenance", "PublicationCertificate", "DescriptionReview"],
    notes: "Risk-review details are pluggable policy inputs; lifecycle transitions are implemented."
  },
  {
    part: "GB/Z 185.5",
    clause: "5-6.1",
    topic: "Discovery through discovery service",
    status: "covered_by_reference_runtime",
    sdkSurface: ["DiscoveryService", "AgentInterconnectClient.discover"],
    notes: "Supports text, identity, name, skill, tag, input/output, discoverability, availability, and limit filters."
  },
  {
    part: "GB/Z 185.5",
    clause: "6.2",
    topic: "Discovery through preset information and caches",
    status: "covered_by_reference_runtime",
    sdkSurface: ["PresetDiscoverySource", "DiscoveryService"],
    notes: "Preset sources represent provider preset data, cached results, user configuration, and well-known-derived descriptions."
  },
  {
    part: "GB/Z 185.5",
    clause: "6.1",
    topic: "API, GUI, or LUI discovery interface",
    status: "extension_point",
    sdkSurface: ["JsonTransport", "HttpJsonTransport", "AgentInterconnectClient"],
    notes: "API transport is provided; GUI/LUI are application surfaces built over the same client."
  },
  {
    part: "GB/Z 185.6",
    clause: "5-6",
    topic: "Interaction requirements and modes: point-to-point, group, hybrid",
    status: "covered_by_reference_runtime",
    sdkSurface: ["InteractionRuntime", "AgentInteractionMode"],
    notes: "All three interaction modes are typed and accepted by session creation."
  },
  {
    part: "GB/Z 185.6",
    clause: "7",
    topic: "Data, message, task, session structures",
    status: "covered",
    sdkSurface: ["DataItem", "Message", "Task", "Session", "SessionReceiver"],
    notes: "Standard content elements and relationships are modeled."
  },
  {
    part: "GB/Z 185.6",
    clause: "8",
    topic: "Point-to-point and group interaction flows with message distribution",
    status: "covered_by_reference_runtime",
    sdkSurface: ["InteractionRuntime", "MessageDistributionRuntime"],
    notes: "Group distribution receipts are implemented; point-to-point uses direct runtime messages."
  },
  {
    part: "GB/Z 185.6",
    clause: "Appendix A-B",
    topic: "Remote call, streaming, notification, master-slave, proxy negotiation, task subscription references",
    status: "extension_point",
    sdkSurface: ["JsonTransport", "HttpJsonTransport", "InteractionRuntime", "MessageDistributionRuntime"],
    notes: "The SDK models messages/chunks/tasks; concrete long-connection, callback, broker, or scheduler protocols are adapters."
  },
  {
    part: "GB/Z 185.7",
    clause: "4",
    topic: "Tool invocation architecture: agent, tool access, tool service",
    status: "covered",
    sdkSurface: ["ToolAccessRuntime", "ToolRuntime"],
    notes: "Agent-side tool access and resource-side tool service are separate surfaces."
  },
  {
    part: "GB/Z 185.7",
    clause: "5",
    topic: "Tool list acquisition, tool updates, tool invocation loop",
    status: "covered_by_reference_runtime",
    sdkSurface: ["ToolAccessRuntime.getToolList", "ToolAccessRuntime.syncToolUpdates", "ToolAccessRuntime.invokeUntilComplete", "ToolRuntime"],
    notes: "List, update, batch invocation, error result, and repeated invocation flows are implemented."
  },
  {
    part: "GB/Z 185.7",
    clause: "6",
    topic: "Tool descriptor, request, sync, update, invoke, result data formats",
    status: "covered",
    sdkSurface: ["ToolDescriptor", "ToolRequestData", "ToolSyncData", "ToolUpdateData", "ToolInvokeRequest", "ToolInvokeResult"],
    notes: "Data fields from the standard tables are represented as TypeScript types and validated where applicable."
  }
];
