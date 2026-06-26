# gbz185-sdk API Reference

This reference lists the main public APIs exported by `gbz185-sdk`.

## Identity Code

| API | Purpose |
| --- | --- |
| `formatIdentityCode(parts)` | Builds a GB/Z 185.2 identity code with prefix `1.2.156.3088` and version `1`. |
| `parseIdentityCode(code)` | Parses identity code parts and validates OID/version/node structure. |
| `validateIdentityCode(code)` | Returns a boolean instead of throwing. |
| `validateIdentityCodeParts(parts)` | Validates parsed or manually assembled identity-code parts. |

## Runtime Factory

| API | Purpose |
| --- | --- |
| `createAgentInterconnectRuntime()` | Creates the in-memory reference runtime with identity, credential, description, discovery, interaction, message distribution, tool access, tool service, transport, and client wired together. |
| `AgentInterconnectRuntime` | Interface describing the assembled runtime object. |

## Agent-Side Facades

| API | Purpose |
| --- | --- |
| `AgentIdentityMaintenance` | Agent-side identity-code and credential maintenance: register, refresh, update, issue credential, lock/unlock/revoke account, lock/unlock/revoke credential. |
| `AgentDescriptionMaintenance` | Agent-side description maintenance: register, review request, publish, change, unpublish, revoke. |
| `InterconnectionAuthorizationRuntime` | Creates process credential packages, authenticates peers, evaluates authorization decisions, and supports mutual authentication. |
| `ToolAccessRuntime` | Agent-side tool access facade: get tool list, sync updates, invoke tools, repeat invocation until complete. |

## Identity And Credentials

| API | Purpose |
| --- | --- |
| `IdentityRegistryRuntime` | Identity account lifecycle: register, update, issue credential, lock, unlock, revoke, get, list. |
| `IdentityAccount` | Account model with identity code, delegator, subject, status, evidence, credential IDs, audit log, timestamps. |
| `IdentityAuditEvent` | Audit event emitted by identity lifecycle operations. |
| `CredentialIssuer` | Interface for issuing, updating, locking, unlocking, revoking, and reading credentials. |
| `CredentialVerifier` | Interface for verifying process credential packages. |
| `DevelopmentCredentialIssuer` | Node.js crypto development implementation using Ed25519 keys. |
| `DevelopmentCredentialVerifier` | Development verifier for validity, status, audience, scope, and signature checks. |
| `CertificateChainVerifier` | Production extension point for X.509 chain validation. |
| `CredentialStatusStore` | Extension point for credential lock/revoke status lookup. |
| `createProcessCredentialPackage(input)` | Signs a process credential package for peer authentication. |

## Agent Description

| API | Purpose |
| --- | --- |
| `AgentDescription` | GB/Z 185.4 agent description model. |
| `SkillDescription` | GB/Z 185.4 skill model. |
| `AgentDescriptionRegistry` | Description lifecycle: register, review, issue publication certificate, publish, change, unpublish, revoke, get, list. |
| `DescriptionRecord` | Stored description record with lifecycle status and publication metadata. |
| `PublicationCertificate` | Reference model for publication certificate metadata. |
| `validateAgentDescription(description)` | Returns validation errors for required fields and skills. |
| `assertAgentDescription(description)` | Throws on invalid descriptions. |

## Discovery

| API | Purpose |
| --- | --- |
| `DiscoveryService` | Searches published and preset descriptions using text, identity code, name, skills, tags, IO types, discoverability, availability, and limit filters. |
| `PresetDiscoverySource` | Represents provider preset data, cached discovery results, user configuration, or `.well-known`-derived descriptions. |
| `DiscoveryQuery` | Query object for discovery. |
| `DiscoveryResult` | Scored result with matched fields. |

## Interaction And Message Distribution

| API | Purpose |
| --- | --- |
| `InteractionRuntime` | Creates sessions, submits tasks, updates task state, sends messages, lists messages. |
| `MessageDistributionRuntime` | Distributes group messages to all recipients except the sender and stores delivery receipts. |
| `Session` | GB/Z 185.6 session model. |
| `Task` | GB/Z 185.6 task model. |
| `Message` | GB/Z 185.6 message model. |
| `DataItem` | GB/Z 185.6 data payload model. |

## Tool Invocation

| API | Purpose |
| --- | --- |
| `ToolRuntime` | Resource-side tool service: register tools, list tools, get updates, invoke one or more tools. |
| `ToolDescriptor` | GB/Z 185.7 tool property description. |
| `ToolRequestData` | Tool-list request data shape. |
| `ToolSyncData` | Tool-list sync data shape. |
| `ToolUpdateData` | Tool-update notification data shape. |
| `ToolInvokeRequest` | Tool invocation request data shape. |
| `ToolInvokeResult` | Tool invocation result data shape. |

## Client And Transport

| API | Purpose |
| --- | --- |
| `JsonTransport` | Transport contract: `request(operation, payload)`. |
| `InProcessJsonTransport` | Local in-process operation router used by the reference runtime. |
| `HttpJsonTransport` | Minimal HTTP adapter that POSTs `{ operation, payload }` to a configured endpoint. |
| `AgentInterconnectClient` | Client facade over identity, description, discovery, interaction, distribution, and tool operations. |

## Conformance Metadata

| API | Purpose |
| --- | --- |
| `GBZ185_FUNCTIONS` | 12 GB/Z 185.1 function domains mapped to SDK surfaces. |
| `GBZ185_FRAI_INTERFACES` | FRAI-01 through FRAI-10 interface coverage map. |
| `GBZ185_CONFORMANCE_MATRIX` | Clause-level conformance map for GB/Z 185.1 through GB/Z 185.7. |

## Production Extension Points

The reference runtime is intentionally replaceable. Production systems should implement these interfaces:

- `IdentityAccountStore`
- `DescriptionStore`
- `CredentialIssuer`
- `CredentialVerifier`
- `CredentialStatusStore`
- `CertificateChainVerifier`
- `JsonTransport`
