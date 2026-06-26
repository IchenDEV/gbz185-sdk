# GB/Z 185 Conformance Verification

This document verifies `gbz185-sdk` against the seven GB/Z 185-2026 agent interconnection documents supplied in this workspace.

The verification scope is SDK-level conformance: types, validation helpers, runtime surfaces, lifecycle flows, and transport extension points. The GB/Z 185 files are guidance documents, so some items are necessarily implemented as adapter interfaces rather than fixed code.

## Result

- Functional domains from GB/Z 185.1: covered.
- FRAI-01 through FRAI-10: covered by exported coverage constants and runtime/client surfaces.
- GB/Z 185.2 identity-code structure and validation: covered.
- GB/Z 185.3 identity, credential, and authentication lifecycle: covered by reference runtime plus production adapter interfaces.
- GB/Z 185.4 description lifecycle: covered.
- GB/Z 185.5 discovery service and preset discovery: covered.
- GB/Z 185.6 interaction models and group message distribution: covered.
- GB/Z 185.7 tool service and tool access: covered.

Items marked as extension points are not missing SDK functions. They are areas where the standard references governance, UI, CA, network, scheduler, or security infrastructure that must be supplied by the application environment.

## Coverage Matrix

| Standard | Clause | Topic | Status | SDK Surface |
| --- | --- | --- | --- | --- |
| GB/Z 185.1 | 5 | Concept model domains | Covered | `createAgentInterconnectRuntime`, `AgentInterconnectRuntime`, `GBZ185_FUNCTIONS` |
| GB/Z 185.1 | 6.2 | Functional reference architecture function set | Covered | `GBZ185_FUNCTIONS` |
| GB/Z 185.1 | 6.3 | FRAI-01 through FRAI-10 | Covered | `GBZ185_FRAI_INTERFACES` |
| GB/Z 185.2 | 5.1-5.6 | Identity code OID/version/provider/requester/serial structure | Covered | `formatIdentityCode`, `parseIdentityCode`, `validateIdentityCode` |
| GB/Z 185.2 | 6 | Identity-code allocation and management | Covered by reference runtime | `IdentityRegistryRuntime`, `AgentIdentityMaintenance` |
| GB/Z 185.2 | Appendix B | International identity-code governance | Extension point | `IdentityAccountStore`, `IdentityRegistryRuntime` |
| GB/Z 185.3 | 5 | Identity-management framework | Covered | `IdentityRegistryRuntime`, `CredentialIssuer`, `CredentialVerifier`, `InterconnectionAuthorizationRuntime` |
| GB/Z 185.3 | 6 | Registration and evidence verification | Covered by reference runtime | `IdentityRegistryRuntime.register`, `RegisterIdentityInput.evidence` |
| GB/Z 185.3 | 7 | Account update/lock/unlock/revoke/audit | Covered by reference runtime | `IdentityRegistryRuntime`, `IdentityAuditEvent` |
| GB/Z 185.3 | 8 | Credential issue/update/lock/unlock/revoke/status | Covered by reference runtime | `CredentialIssuer`, `CredentialStatusStore` |
| GB/Z 185.3 | 9 | Presentation, verification, assertion, authorization | Covered by reference runtime | `createProcessCredentialPackage`, `CredentialVerifier`, `InterconnectionAuthorizationRuntime` |
| GB/Z 185.3 | 9.2 | National CA roots, algorithms, immutable audit | Extension point | `CertificateChainVerifier`, `CredentialIssuer`, `CredentialVerifier` |
| GB/Z 185.4 | 5 | Agent description and skill attributes | Covered | `AgentDescription`, `SkillDescription`, validation helpers |
| GB/Z 185.4 | 6-8 | Register/review/certificate/publish/change/unpublish/revoke | Covered by reference runtime | `AgentDescriptionRegistry`, `AgentDescriptionMaintenance` |
| GB/Z 185.5 | 5-6.1 | Discovery service flow | Covered by reference runtime | `DiscoveryService`, `AgentInterconnectClient.discover` |
| GB/Z 185.5 | 6.2 | Preset/cache/user/well-known discovery | Covered by reference runtime | `PresetDiscoverySource`, `DiscoveryService` |
| GB/Z 185.5 | 6.1 | API/GUI/LUI query interface | Extension point | `JsonTransport`, `HttpJsonTransport`, `AgentInterconnectClient` |
| GB/Z 185.6 | 5-6 | Point-to-point/group/hybrid modes | Covered by reference runtime | `InteractionRuntime`, `AgentInteractionMode` |
| GB/Z 185.6 | 7 | Data/message/task/session models | Covered | `DataItem`, `Message`, `Task`, `Session` |
| GB/Z 185.6 | 8 | Point-to-point and group message flows | Covered by reference runtime | `InteractionRuntime`, `MessageDistributionRuntime` |
| GB/Z 185.6 | Appendix A-B | Streaming/notification/collaboration patterns | Extension point | `JsonTransport`, `InteractionRuntime`, `MessageDistributionRuntime` |
| GB/Z 185.7 | 4 | Tool architecture | Covered | `ToolAccessRuntime`, `ToolRuntime` |
| GB/Z 185.7 | 5 | Tool list/update/invocation loop | Covered by reference runtime | `ToolAccessRuntime`, `ToolRuntime` |
| GB/Z 185.7 | 6 | Tool data formats | Covered | `ToolDescriptor`, `ToolRequestData`, `ToolSyncData`, `ToolUpdateData`, `ToolInvokeRequest`, `ToolInvokeResult` |

The same matrix is exported as `GBZ185_CONFORMANCE_MATRIX` for automated checks.

## Automated Verification

The package test suite verifies:

- identity code parse/format/validation and malformed code rejection;
- description required fields and skill fields;
- discovery service, preset filtering behavior, undiscoverable filtering, empty-result handling;
- description review, publication certificate, publish, unpublish, and revoke;
- point-to-point and group interaction flows;
- message distribution receipts;
- tool list acquisition, updates, success, missing tool, and repeated invocation;
- credential success, expiry, lock, audience mismatch, and tamper rejection;
- interconnection authorization facade;
- identity revocation linked to credential revocation;
- GB/Z 185.1 function-domain and FRAI interface coverage;
- conformance matrix coverage for all seven standard parts.

Run:

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm pack --pack-destination /tmp
```

Current verified package name:

```text
gbz185-sdk@0.1.0
```

## Explicit Adapter Boundaries

The SDK deliberately does not hard-code the following because the standards do not define concrete implementation details or because the responsibility belongs to external governance infrastructure:

- regulator-approved identity registration service governance;
- international identity-code approval processes;
- production CA, national algorithm suite, key custody, and certificate-status service;
- immutable audit-log storage;
- legal/risk review policy for description registration and publication;
- GUI/LUI discovery interfaces;
- fixed REST paths, WebSocket frames, MCP methods, message brokers, schedulers, or callback URLs.

Each of those areas has an exported interface or transport boundary so production systems can provide the required implementation without changing the SDK object model.
