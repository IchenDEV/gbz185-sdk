# Multi-Language SDKs

This repository now includes first-version SDK surfaces for:

- TypeScript: root package, published as `gbz185-sdk` on npm.
- Python: `sdks/python`, package name `gbz185-sdk`.
- Go: `sdks/go`, module path `github.com/IchenDEV/gbz185-sdk/sdks/go`.
- Rust: `sdks/rust`, crate name `gbz185-sdk`.
- Java: `sdks/java`, Maven coordinates `dev.idevlab:gbz185-sdk`.

The non-TypeScript SDKs intentionally share the same integration boundary:

- identity-code helpers for GB/Z 185.2
- `JsonTransport` abstraction
- in-process transport for tests and local adapters
- HTTP JSON transport that sends `{ operation, payload }`
- `AgentInterconnectClient` methods for all standard operation names
- GB/Z 185.1 function-domain constants
- FRAI-01 through FRAI-10 constants

They are client SDKs and adapter SDKs. The full in-memory reference runtime remains in the TypeScript package for now.

## Standard Operations

All language clients use the same operation names:

| Domain | Operations |
| --- | --- |
| Identity | `identity.register`, `identity.get`, `identity.issueCredential`, `identity.lock`, `identity.unlock`, `identity.revoke` |
| Description | `description.register`, `description.review`, `description.issuePublicationCertificate`, `description.publish`, `description.unpublish`, `description.revoke` |
| Discovery | `discovery.discover` |
| Interaction | `interaction.createSession`, `interaction.submitTask`, `interaction.sendMessage`, `interaction.distributeMessage` |
| Tool | `tool.list`, `tool.updates`, `tool.invoke` |

## Python

```bash
cd sdks/python
python -m unittest discover -s tests
python examples/basic_client.py
```

Minimal usage:

```python
from gbz185_sdk import AgentInterconnectClient, HttpJsonTransport

client = AgentInterconnectClient(HttpJsonTransport("https://api.example.com/gbz185"))
results = client.discover({"text": "calendar schedule"})
```

## Go

```bash
cd sdks/go
go test ./...
```

Minimal usage:

```go
transport := &gbz185.HttpJsonTransport{Endpoint: "https://api.example.com/gbz185"}
client := gbz185.NewAgentInterconnectClient(transport)
var results []gbz185.JSONObject
err := client.Discover(context.Background(), gbz185.JSONObject{"text": "calendar"}, &results)
```

## Rust

```bash
cd sdks/rust
cargo test
```

Minimal usage:

```rust
use gbz185_sdk::{AgentInterconnectClient, HttpJsonTransport};
use serde_json::json;

let client = AgentInterconnectClient::new(HttpJsonTransport::new("https://api.example.com/gbz185"));
let results = client.discover(json!({ "text": "calendar" }))?;
```

## Java

```bash
cd sdks/java
mvn test
```

Minimal usage:

```java
AgentInterconnectClient client =
    new AgentInterconnectClient(new HttpJsonTransport("https://api.example.com/gbz185"));
JsonNode results = client.discover(Map.of("text", "calendar"));
```

This local machine currently does not have a JDK/Maven installed, so Java source is included but Java tests must be run on a machine with Java 17+ and Maven.

## Release Order

Recommended order:

1. Keep the TypeScript SDK as the reference package.
2. Publish Python to PyPI after `python -m unittest discover -s tests`.
3. Tag Go releases from this repository; Go users resolve modules by git tags.
4. Publish Rust to crates.io after `cargo test` and `cargo package`.
5. Publish Java to Maven Central after `mvn test` and signing setup.
