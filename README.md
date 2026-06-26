# GB/Z 185 Agent Interconnect SDK

TypeScript SDK and reference runtime for the GB/Z 185-2026 "Artificial intelligence - Agent interconnection" guidance documents.

This package is intentionally transport-neutral. It models the standard objects and flows as JSON-friendly TypeScript APIs, then exposes them through a pluggable `JsonTransport` interface. The default runtime is in-process and memory-backed so it can be used for development, tests, and protocol experiments.

The SDK exposes every function domain listed in the GB/Z 185.1 reference architecture: identity maintenance, description maintenance, interconnection authorization, interaction, tool access, identity management, credential management, identity authentication, description management, discovery, message distribution, and tool service.

## What Is Included

- Identity code helpers for the GB/Z 185.2 OID structure:
  - fixed prefix `1.2.156.3088`
  - version `1`
  - registration service provider
  - registration requester
  - ontology serial
  - instance serial
- X.509-first identity interfaces:
  - certificate chain verifier interface
  - credential status store
  - process credential package
  - authentication assertion
  - development Ed25519 implementation for local tests
- In-memory reference runtimes:
  - `AgentIdentityMaintenance`
  - `AgentDescriptionMaintenance`
  - `InterconnectionAuthorizationRuntime`
  - `IdentityRegistryRuntime`
  - `AgentDescriptionRegistry`
  - `DiscoveryService`
  - `InteractionRuntime`
  - `MessageDistributionRuntime`
  - `ToolAccessRuntime`
  - `ToolRuntime`
- Client and transport:
  - `JsonTransport`
  - `InProcessJsonTransport`
  - `HttpJsonTransport`
  - `AgentInterconnectClient`

## Install

```bash
# npm
npm install gbz185-sdk

# pnpm
pnpm add gbz185-sdk

# yarn
yarn add gbz185-sdk
```

The package is ESM-only and requires Node.js `>=20`.

## Develop And Verify

```bash
git clone https://github.com/IchenDEV/gbz185-sdk.git
cd gbz185-sdk
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm example:calendar
pnpm pack:check
```

## Documentation

- Canonical developer documentation: https://blogs.idevlab.dev/gbz185-sdk/
- SDK guide: [`docs/SDK_GUIDE.md`](docs/SDK_GUIDE.md)
- API reference: [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md)
- GB/Z 185 conformance matrix: [`docs/CONFORMANCE.md`](docs/CONFORMANCE.md)
- Multi-language SDKs: [`docs/MULTI_LANGUAGE_SDKS.md`](docs/MULTI_LANGUAGE_SDKS.md)
- npm release checklist: [`docs/NPM_RELEASE.md`](docs/NPM_RELEASE.md)
- GitHub Pages deployment notes: [`docs/GITHUB_PAGES.md`](docs/GITHUB_PAGES.md)

## Other Language SDKs

Client SDKs for Python, Go, Rust, and Java live in the repository under [`sdks/`](https://github.com/IchenDEV/gbz185-sdk/tree/main/sdks). They expose the same GB/Z 185 identity-code helpers, JSON transport boundary, operation names, client methods, and conformance constants as the TypeScript package.

## Quick Start

```ts
import {
  createAgentInterconnectRuntime,
  formatIdentityCode
} from "gbz185-sdk";

const runtime = createAgentInterconnectRuntime();

const requesterId = formatIdentityCode({
  registrationServiceProvider: "A1",
  registrationRequester: "REQ001",
  ontologySerial: "ASSISTANT",
  instanceSerial: "1"
});

const registration = await runtime.client.registerIdentity({
  delegatorId: "example-org",
  subject: "Calendar Agent",
  registrationServiceProvider: "A1",
  registrationRequester: "REQ001",
  ontologySerial: "CALENDAR",
  instanceSerial: "1",
  issueCredential: true,
  credentialAudience: [requesterId],
  credentialScope: ["agent:interact", "tool:invoke"]
});

await runtime.client.registerDescription({
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
});
await runtime.client.publishDescription(registration.account.id);

const matches = await runtime.client.discover({
  text: "calendar schedule",
  requiredSkills: ["schedule.add"]
});
```

See `examples/calendar.ts` for a full register -> publish -> discover -> interact -> tool invocation flow.

For a fuller API and runtime guide, see [`docs/SDK_GUIDE.md`](docs/SDK_GUIDE.md). For the national-standard coverage check, see [`docs/CONFORMANCE.md`](docs/CONFORMANCE.md).

## GB/Z 185 Function Coverage

The exported `GBZ185_FUNCTIONS` and `GBZ185_FRAI_INTERFACES` constants provide a machine-readable coverage map for the national-standard function domains and FRAI interfaces.

| Function Domain | SDK Surface |
| --- | --- |
| Agent identity maintenance | `AgentIdentityMaintenance` |
| Agent description maintenance | `AgentDescriptionMaintenance` |
| Agent interconnection authorization | `InterconnectionAuthorizationRuntime` |
| Agent interaction | `InteractionRuntime` |
| Tool access | `ToolAccessRuntime` |
| Identity management | `IdentityRegistryRuntime` |
| Credential management | `CredentialIssuer` |
| Identity authentication | `CredentialVerifier` |
| Description management | `AgentDescriptionRegistry` |
| Agent discovery | `DiscoveryService` |
| Message distribution | `MessageDistributionRuntime` |
| Tool service | `ToolRuntime` |

## Standard Mapping

- GB/Z 185.1: domain/runtime composition through `createAgentInterconnectRuntime`.
- GB/Z 185.2: identity code parse/format/validation helpers.
- GB/Z 185.3: identity accounts, credentials, process credential packages, assertions.
- GB/Z 185.4: `AgentDescription` and `SkillDescription`.
- GB/Z 185.5: discovery service and preset discovery source.
- GB/Z 185.6: session/task/message/data interaction model.
- GB/Z 185.7: tool descriptor, tool list sync, tool update, tool invocation result model.

## Security Boundary

The credential implementation is a development reference. It follows the GB/Z 185 identity-management shape and keeps X.509 certificate chain verification as a first-class interface, but it does not claim production compliance with any national CA, GM/T algorithm suite, or regulator-specific certificate policy.

For production use, replace:

- `CertificateChainVerifier`
- `CredentialStatusStore`
- `CredentialIssuer`
- `CredentialVerifier`
- in-memory repositories

with implementations backed by your CA, certificate status service, key custody model, audit log, and persistence layer.

## Transport Boundary

The SDK does not prescribe HTTP paths, WebSocket messages, or MCP method names. All client calls go through:

```ts
interface JsonTransport {
  request<TRequest, TResponse>(operation: string, payload: TRequest): Promise<TResponse>;
}
```

Use `InProcessJsonTransport` for tests and local runtimes. Use `HttpJsonTransport` or a custom adapter when you want to bind the operations to a network protocol.
