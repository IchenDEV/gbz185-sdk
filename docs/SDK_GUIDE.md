# GB/Z 185 SDK Guide

This guide explains how the SDK maps GB/Z 185-2026 into TypeScript APIs and how to use the reference runtime.

## Install

```bash
npm install gbz185-sdk
```

The package is ESM-only and supports Node.js `>=20`. It also works with `pnpm add gbz185-sdk` and `yarn add gbz185-sdk`.

## 1. Runtime Shape

The SDK is organized around the seven GB/Z 185 parts:

| GB/Z 185 Part | SDK Surface |
| --- | --- |
| 185.1 General architecture | `createAgentInterconnectRuntime()` wires the identity, description, discovery, interaction, and tool domains. |
| 185.2 Identity code | `formatIdentityCode`, `parseIdentityCode`, `validateIdentityCode`. |
| 185.3 Identity management | `IdentityRegistryRuntime`, `CredentialIssuer`, `CredentialVerifier`, process credential packages, authentication assertions. |
| 185.4 Agent description | `AgentDescription`, `SkillDescription`, `AgentDescriptionRegistry`. |
| 185.5 Agent discovery | `DiscoveryService`, `DiscoveryQuery`, `DiscoveryResult`, preset discovery sources. |
| 185.6 Agent interaction | `Session`, `Task`, `Message`, `DataItem`, `InteractionRuntime`. |
| 185.7 Tool invocation | `ToolDescriptor`, `ToolRuntime`, tool list sync, tool updates, tool invocation results. |

The default runtime is in-memory and in-process. It is intended for local development, tests, examples, and protocol experiments.

## 1.1 Complete Function Coverage

GB/Z 185.1 defines function domains in the agent domain, management service domain, interconnection service domain, and resource access domain. The SDK exposes each function domain as a runtime, facade, or interface.

| Domain | Standard Function | SDK Surface |
| --- | --- | --- |
| Agent domain | Agent identity maintenance | `AgentIdentityMaintenance` |
| Agent domain | Agent description maintenance | `AgentDescriptionMaintenance` |
| Agent domain | Agent interconnection authorization | `InterconnectionAuthorizationRuntime` |
| Agent domain | Agent interaction | `InteractionRuntime` |
| Agent domain | Tool access | `ToolAccessRuntime` |
| Management service domain | Agent identity management | `IdentityRegistryRuntime` |
| Management service domain | Agent credential management | `CredentialIssuer` / `DevelopmentCredentialIssuer` |
| Management service domain | Agent identity authentication | `CredentialVerifier` / `DevelopmentCredentialVerifier` |
| Interconnection service domain | Agent description management | `AgentDescriptionRegistry` |
| Interconnection service domain | Agent discovery | `DiscoveryService` |
| Interconnection service domain | Message distribution | `MessageDistributionRuntime` |
| Resource access domain | Tool service | `ToolRuntime` |

The SDK also exports `GBZ185_FUNCTIONS` and `GBZ185_FRAI_INTERFACES` for machine-readable coverage checks. The FRAI constants cover `FRAI-01` through `FRAI-10`.

For a clause-level verification matrix, see `docs/CONFORMANCE.md` or import `GBZ185_CONFORMANCE_MATRIX`.

## 2. Identity Codes

GB/Z 185.2 uses an OID-style identity code. This SDK fixes the standard prefix and current version:

- OID prefix: `1.2.156.3088`
- Version: `1`
- Registration service provider: up to 6 base36 characters
- Registration requester: up to 6 base36 characters
- Ontology serial: up to 9 base36 characters
- Instance serial: up to 9 base36 characters

```ts
import { formatIdentityCode, parseIdentityCode, validateIdentityCode } from "gbz185-sdk";

const agentId = formatIdentityCode({
  registrationServiceProvider: "A1",
  registrationRequester: "REQ001",
  ontologySerial: "CALENDAR",
  instanceSerial: "1"
});

console.log(agentId);
// 1.2.156.3088.1.A1.REQ001.CALENDAR.1

console.log(validateIdentityCode(agentId));
console.log(parseIdentityCode(agentId));
```

## 3. Register And Publish An Agent

Use `createAgentInterconnectRuntime()` when you want all in-memory services connected through the default `InProcessJsonTransport`.

```ts
import { createAgentInterconnectRuntime, type AgentDescription } from "gbz185-sdk";

const runtime = createAgentInterconnectRuntime();

const registration = await runtime.client.registerIdentity({
  delegatorId: "example-org",
  subject: "Calendar Agent",
  registrationServiceProvider: "A1",
  registrationRequester: "REQ001",
  ontologySerial: "CALENDAR",
  instanceSerial: "1",
  issueCredential: true,
  credentialAudience: ["requester-agent"],
  credentialScope: ["agent:interact", "tool:invoke"]
});

const description: AgentDescription = {
  agentId: registration.account.id,
  name: "Calendar Agent",
  version: "1.0.0",
  description: "Creates calendar events",
  provider: "Example Org",
  capabilities: { asyncMessages: true },
  defaultInputTypes: ["text", "json"],
  defaultOutputTypes: ["json"],
  skills: [
    {
      skillId: "schedule.add",
      skillName: "add_schedule",
      skillDescription: "Add one calendar schedule item",
      tags: ["calendar", "schedule"],
      inputTypes: ["text", "json"],
      outputTypes: ["json"]
    }
  ]
};

await runtime.client.registerDescription(description);
await runtime.client.publishDescription(description.agentId);
```

The full description lifecycle also includes review, publication certificate issuance, unpublish, and revoke:

```ts
await runtime.client.reviewDescription(description.agentId, {
  reviewerId: "description-manager",
  approved: true,
  riskLevel: "low"
});

await runtime.client.issuePublicationCertificate(description.agentId, {
  issuer: "description-manager",
  publicKeyDigest: "sha256:..."
});

await runtime.client.publishDescriptionWithInfo(description.agentId, {
  regions: ["CN"],
  openBeta: false,
  paid: false,
  permissionRequirements: ["calendar.write"]
});

await runtime.client.unpublishDescription(description.agentId);
await runtime.client.revokeDescription(description.agentId, "retired");
```

## 4. Discovery

Discovery searches published descriptions and optional preset sources. By default, descriptions marked `discoverable: false` are filtered out.

```ts
const results = await runtime.client.discover({
  text: "calendar schedule",
  requiredSkills: ["schedule.add"],
  inputTypes: ["text"],
  outputTypes: ["json"],
  requireAvailable: true
});

const target = results[0]?.description;
```

`DiscoveryQuery` supports:

- `text`
- `agentId`
- `name`
- `requiredSkills`
- `tags`
- `inputTypes`
- `outputTypes`
- `includeUndiscoverable`
- `requireAvailable`
- `limit`

## 5. Interaction

GB/Z 185.6 is represented as:

- `Session`: a multi-agent interaction process
- `Task`: a work unit inside a session
- `Message`: an exchange unit
- `DataItem`: the message payload unit

```ts
const session = await runtime.client.createSession({
  mode: "point_to_point",
  sender: { agentId: "requester-agent-id" },
  receivers: [{ agentId: target.agentId, mode: "point_to_point" }]
});

const task = await runtime.client.submitTask({ sessionId: session.id });

await runtime.client.sendMessage({
  senderRole: "service",
  senderId: target.agentId,
  sessionId: session.id,
  taskId: task.id,
  artifact: "work_result",
  final: true,
  lastChunk: true,
  dataItems: [
    {
      type: "application/json",
      metadata: {},
      payload: { ok: true }
    }
  ]
});
```

Supported interaction modes are:

- `point_to_point`
- `group`
- `hybrid`

For group mode, use `MessageDistributionRuntime` or the client `distributeMessage` helper. The distribution service records delivery receipts and writes the source message into the interaction runtime.

```ts
const receipts = await runtime.client.distributeMessage({
  senderRole: "requester",
  senderId: "requester-agent-id",
  sessionId: session.id,
  dataItems: [{ type: "text/plain", metadata: {}, payload: "hello group" }]
});
```

## 6. Tool Invocation

Register tools with `ToolRuntime`, then invoke them through the client.

```ts
await runtime.toolRuntime.registerTool(
  {
    toolId: "calendar.add",
    toolName: "add_schedule",
    toolDescription: "Add one calendar event",
    toolVersion: "1.0.0",
    toolInputParam: { date: "string", time: "string", event: "string" },
    toolOutputParam: { eventId: "string", accepted: "boolean" }
  },
  (input) => ({
    eventId: `evt-${input.date}-${input.time}`,
    accepted: true
  })
);

const toolResult = await runtime.client.invokeTools({
  sessionId: session.id,
  toolInvokeList: [
    {
      toolId: "calendar.add",
      toolVersion: "1.0.0",
      toolInputParam: {
        date: "2026-06-26",
        time: "10:00",
        event: "GB/Z 185 SDK review"
      }
    }
  ]
});
```

Tool failures are returned as result items instead of throwing for the whole batch. For example, a missing tool returns `statusCode: "TOOL_NOT_FOUND"` and `ok: false`.

The agent-side tool-access facade wraps the resource-side tool service:

```ts
const tools = await runtime.toolAccess.getToolList();
const updates = await runtime.toolAccess.syncToolUpdates();
const rounds = await runtime.toolAccess.invokeUntilComplete({
  initialRequest: {
    sessionId: session.id,
    toolInvokeList: [
      {
        toolId: "calendar.add",
        toolVersion: "1.0.0",
        toolInputParam: { date: "2026-06-26", time: "10:00", event: "review" }
      }
    ]
  },
  isComplete: (result) => result.toolResultList.every((item) => item.ok),
  nextRequest: (result) => ({
    sessionId: session.id,
    toolInvokeList: []
  })
});
```

## 7. Credential Verification

The credential layer is X.509-first by interface:

- `CertificateChainVerifier`
- `CredentialStatusStore`
- `CredentialIssuer`
- `CredentialVerifier`

The bundled `DevelopmentCredentialIssuer` uses Node.js `crypto` with Ed25519 keys so local flows can run without an external CA. It can optionally verify a supplied PEM certificate through `NodeX509CertificateChainVerifier`, but it is not a production CA implementation.

```ts
import {
  DevelopmentCredentialIssuer,
  DevelopmentCredentialVerifier,
  InMemoryCredentialRepository,
  InMemoryCredentialStatusStore,
  createProcessCredentialPackage
} from "gbz185-sdk";

const repository = new InMemoryCredentialRepository();
const statusStore = new InMemoryCredentialStatusStore();
const issuer = new DevelopmentCredentialIssuer(repository, statusStore);
const verifier = new DevelopmentCredentialVerifier(statusStore);

const issued = await issuer.issueCredential({
  agentId: "agent-id",
  subject: "Requester Agent",
  audience: ["service-agent"],
  scope: ["agent:interact"]
});

const presentation = createProcessCredentialPackage({
  credential: issued.credential,
  privateKeyPem: issued.privateKeyPem,
  audience: "service-agent",
  scope: ["agent:interact"],
  payload: { action: "connect" }
});

const assertion = await verifier.verifyPresentation({
  package: presentation,
  expectedAudience: "service-agent",
  requiredScope: ["agent:interact"]
});
```

Agent interconnection authorization is available as a higher-level facade:

```ts
const auth = runtime.interconnectionAuthorization;
const presentation = auth.createPresentation({
  credential: issued.credential,
  privateKeyPem: issued.privateKeyPem,
  audience: "service-agent",
  scope: ["agent:interact"]
});

const decision = await auth.authenticatePeer(presentation, {
  expectedAudience: "service-agent",
  requiredScope: ["agent:interact"]
});
```

Identity account lock/unlock/revoke operations are linked to associated credential states in the reference runtime. Revoking an identity account also revokes credentials issued through that account.

For production, replace the development issuer/verifier/status store with implementations backed by your CA, key custody, certificate status service, audit log, and persistence layer.

## 8. Transport

The SDK does not define REST paths or WebSocket frames. Every client method delegates to:

```ts
interface JsonTransport {
  request<TRequest, TResponse>(operation: string, payload: TRequest): Promise<TResponse>;
}
```

Bundled transports:

- `InProcessJsonTransport`: local runtime and tests.
- `HttpJsonTransport`: POSTs `{ operation, payload }` to a configured endpoint.

Operation names used by `createAgentInterconnectRuntime()`:

- `identity.register`
- `identity.get`
- `identity.issueCredential`
- `identity.lock`
- `identity.unlock`
- `identity.revoke`
- `description.register`
- `description.review`
- `description.issuePublicationCertificate`
- `description.publish`
- `description.unpublish`
- `description.revoke`
- `discovery.discover`
- `interaction.createSession`
- `interaction.submitTask`
- `interaction.sendMessage`
- `interaction.distributeMessage`
- `tool.list`
- `tool.updates`
- `tool.invoke`

## 9. Local Verification

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm example:calendar
pnpm pack --pack-destination /tmp
```

The test suite covers:

- identity code parse/format/validation
- description validation
- discovery filtering and matching
- session/task/message flows
- tool list, update, success, and missing-tool failures
- credential success, expiry, lock, audience mismatch, and tamper rejection
- full smoke flow: register -> publish -> discover -> session -> tool invocation -> final message
- full GB/Z 185.1 function-domain coverage constants and FRAI-01 through FRAI-10
- description review/publication certificate/unpublish/revoke lifecycle
- group-mode message distribution
- tool-access facade and iterative invocation
- identity revocation linked to credential revocation

## 10. Boundaries

This SDK is a reference implementation and developer toolkit. It intentionally does not decide:

- production CA policy
- national cryptographic algorithm suite
- HTTP route shape
- WebSocket event shape
- MCP adapter semantics
- database schema
- distributed message broker behavior

Those should be added as application-specific adapters on top of the stable TypeScript interfaces.
