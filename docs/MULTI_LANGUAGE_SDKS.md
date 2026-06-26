# Language Package Status

This file records package status and release details for the GB/Z 185 SDK language packages. The website documentation embeds language-specific examples directly inside Setup, Get Started, API Reference, and Examples instead of sending developers to a separate multi-language page.

The TypeScript package is the Beta reference implementation and includes the full in-memory runtime. The Python, Go, Rust, and Java SDKs are Alpha experimental client and adapter SDKs: they expose the same identity-code helpers, JSON transport boundary, client operation names, and conformance constants so application teams can call a GB/Z 185 JSON gateway from their language of choice while the non-TypeScript APIs continue to settle.

## Capability Matrix

| Capability | TypeScript | Python | Go | Rust | Java |
| --- | --- | --- | --- | --- | --- |
| SDK status | Beta | Alpha experimental | Alpha experimental | Alpha experimental | Alpha experimental |
| Identity-code format/parse/validate | Yes | Yes | Yes | Yes | Yes |
| JSON transport interface | Yes | Yes | Yes | Yes | Yes |
| In-process transport for tests | Yes | Yes | Yes | Yes | Yes |
| HTTP JSON transport | Yes | Yes | Yes | Yes | Yes |
| Agent interconnect client | Yes | Yes | Yes | Yes | Yes |
| GB/Z 185.1 function constants | Yes | Yes | Yes | Yes | Yes |
| FRAI-01 through FRAI-10 constants | Yes | Yes | Yes | Yes | Yes |
| Full in-memory reference runtime | Yes | No | No | No | No |

All non-TypeScript SDKs use JSON objects for GB/Z 185 data models. That keeps the Alpha language SDKs thin, easy to validate, and compatible with a shared gateway that accepts:

```json
{
  "operation": "discovery.discover",
  "payload": {
    "text": "calendar schedule"
  }
}
```

## Standard Operations

All language clients use the same operation names:

| Domain | Operations |
| --- | --- |
| Identity | `identity.register`, `identity.get`, `identity.issueCredential`, `identity.lock`, `identity.unlock`, `identity.revoke` |
| Description | `description.register`, `description.review`, `description.issuePublicationCertificate`, `description.publish`, `description.unpublish`, `description.revoke` |
| Discovery | `discovery.discover` |
| Interaction | `interaction.createSession`, `interaction.submitTask`, `interaction.sendMessage`, `interaction.distributeMessage` |
| Tool | `tool.list`, `tool.updates`, `tool.invoke` |

## TypeScript

Status: **Beta**.

Install from npm:

```bash
npm install gbz185-sdk
```

Create an identity code:

```ts
import { formatIdentityCode, validateIdentityCode } from "gbz185-sdk";

const agentId = formatIdentityCode({
  registrationServiceProvider: "A1",
  registrationRequester: "REQ001",
  ontologySerial: "CALENDAR",
  instanceSerial: "1"
});

console.log(agentId);
console.log(validateIdentityCode(agentId));
```

Use the full in-memory runtime:

```ts
import { createAgentInterconnectRuntime } from "gbz185-sdk";

const runtime = createAgentInterconnectRuntime();
const results = await runtime.client.discover({
  text: "calendar schedule",
  requiredSkills: ["schedule.add"]
});
```

Use an HTTP JSON gateway:

```ts
import { AgentInterconnectClient, HttpJsonTransport } from "gbz185-sdk";

const client = new AgentInterconnectClient(
  new HttpJsonTransport({
    endpoint: "https://api.example.com/gbz185",
    headers: { authorization: "Bearer token" }
  })
);

const tools = await client.listTools();
```

Local verification:

```bash
pnpm install
pnpm prepublishOnly
```

## Python

Status: **Alpha experimental**.

Current repository install:

```bash
python -m pip install "git+https://github.com/IchenDEV/gbz185-sdk.git#subdirectory=sdks/python"
```

Local development install:

```bash
cd sdks/python
python -m pip install .
python -m unittest discover -s tests
python examples/basic_client.py
```

Create an identity code:

```python
from gbz185_sdk import AgentIdentityCodeParts, format_identity_code, validate_identity_code

agent_id = format_identity_code(
    AgentIdentityCodeParts(
        registration_service_provider="A1",
        registration_requester="REQ001",
        ontology_serial="CALENDAR",
        instance_serial="1",
    )
)

print(agent_id)
print(validate_identity_code(agent_id))
```

Use in-process transport for tests:

```python
from gbz185_sdk import AgentInterconnectClient, InProcessJsonTransport

transport = InProcessJsonTransport()
transport.register(
    "discovery.discover",
    lambda payload: [{"description": {"agentId": "agent-1"}, "score": 1, "matchedBy": ["text"]}],
)

client = AgentInterconnectClient(transport)
results = client.discover({"text": "calendar schedule"})
```

Use an HTTP JSON gateway:

```python
from gbz185_sdk import AgentInterconnectClient, HttpJsonTransport

client = AgentInterconnectClient(
    HttpJsonTransport(
        "https://api.example.com/gbz185",
        headers={"authorization": "Bearer token"},
    )
)

result = client.invoke_tools({
    "sessionId": "session-1",
    "toolInvokeList": [
        {
            "toolId": "calendar.add",
            "toolVersion": "1.0.0",
            "toolInputParam": {"date": "2026-06-27", "time": "10:00", "event": "review"}
        }
    ]
})
```

## Go

Status: **Alpha experimental**.

Use from the repository:

```bash
go get github.com/IchenDEV/gbz185-sdk/sdks/go/gbz185@main
```

Local verification:

```bash
cd sdks/go
go test ./...
```

Create an identity code:

```go
parts := gbz185.AgentIdentityCodeParts{
    RegistrationServiceProvider: "A1",
    RegistrationRequester:       "REQ001",
    OntologySerial:              "CALENDAR",
    InstanceSerial:              "1",
}

agentID, err := gbz185.FormatIdentityCode(parts)
if err != nil {
    panic(err)
}
fmt.Println(agentID, gbz185.ValidateIdentityCode(agentID))
```

Use in-process transport for tests:

```go
transport := gbz185.NewInProcessJsonTransport()
transport.Register("discovery.discover", func(ctx context.Context, payload any) (any, error) {
    return []gbz185.JSONObject{{"description": gbz185.JSONObject{"agentId": "agent-1"}, "score": 1}}, nil
})

client := gbz185.NewAgentInterconnectClient(transport)
var results []gbz185.JSONObject
err := client.Discover(context.Background(), gbz185.JSONObject{"text": "calendar"}, &results)
```

Use an HTTP JSON gateway:

```go
transport := &gbz185.HttpJsonTransport{
    Endpoint: "https://api.example.com/gbz185",
    Headers: map[string]string{"authorization": "Bearer token"},
}
client := gbz185.NewAgentInterconnectClient(transport)

var result gbz185.JSONObject
err := client.InvokeTools(context.Background(), gbz185.JSONObject{
    "sessionId": "session-1",
    "toolInvokeList": []gbz185.JSONObject{
        {
            "toolId": "calendar.add",
            "toolVersion": "1.0.0",
            "toolInputParam": gbz185.JSONObject{"date": "2026-06-27", "time": "10:00", "event": "review"},
        },
    },
}, &result)
```

Go release note: because this repository uses a Go submodule, future stable version tags should use the submodule tag format, for example `sdks/go/v0.1.0`.

## Rust

Status: **Alpha experimental**.

Use locally:

```toml
[dependencies]
gbz185-sdk = { path = "../gbz185-sdk/sdks/rust" }
```

After crates.io release:

```toml
[dependencies]
gbz185-sdk = "0.1.0"
```

Local verification:

```bash
cd sdks/rust
cargo fmt --check
cargo test
cargo package --allow-dirty
```

Create an identity code:

```rust
use gbz185_sdk::{format_identity_code, validate_identity_code, AgentIdentityCodeParts};

let parts = AgentIdentityCodeParts::new("A1", "REQ001", "CALENDAR", "1");
let agent_id = format_identity_code(&parts)?;
assert!(validate_identity_code(&agent_id));
```

Use in-process transport for tests:

```rust
use gbz185_sdk::{AgentInterconnectClient, InProcessJsonTransport};
use serde_json::json;

let transport = InProcessJsonTransport::new();
transport.register("discovery.discover", |payload| {
    Ok(json!([{ "description": { "agentId": "agent-1" }, "score": 1, "payload": payload }]))
});

let client = AgentInterconnectClient::new(transport);
let results = client.discover(json!({ "text": "calendar" }))?;
```

Use an HTTP JSON gateway:

```rust
use gbz185_sdk::{AgentInterconnectClient, HttpJsonTransport};
use serde_json::json;

let transport = HttpJsonTransport::new("https://api.example.com/gbz185")
    .with_header("authorization", "Bearer token");
let client = AgentInterconnectClient::new(transport);

let result = client.invoke_tools(json!({
    "sessionId": "session-1",
    "toolInvokeList": [{
        "toolId": "calendar.add",
        "toolVersion": "1.0.0",
        "toolInputParam": { "date": "2026-06-27", "time": "10:00", "event": "review" }
    }]
}))?;
```

## Java

Status: **Alpha experimental**.

Use locally:

```bash
cd sdks/java
mvn install
```

Then depend on the local artifact:

```xml
<dependency>
  <groupId>dev.idevlab</groupId>
  <artifactId>gbz185-sdk</artifactId>
  <version>0.1.0</version>
</dependency>
```

Local verification:

```bash
cd sdks/java
mvn test
```

Create an identity code:

```java
import dev.idevlab.gbz185.AgentIdentityCodeParts;
import dev.idevlab.gbz185.IdentityCodes;

String agentId = IdentityCodes.formatIdentityCode(
    new AgentIdentityCodeParts("A1", "REQ001", "CALENDAR", "1")
);

boolean valid = IdentityCodes.validateIdentityCode(agentId);
```

Use in-process transport for tests:

```java
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.idevlab.gbz185.AgentInterconnectClient;
import dev.idevlab.gbz185.InProcessJsonTransport;
import java.util.Map;

ObjectMapper mapper = new ObjectMapper();
InProcessJsonTransport transport = new InProcessJsonTransport();
transport.register("discovery.discover", payload ->
    mapper.valueToTree(Map.of("description", Map.of("agentId", "agent-1"), "score", 1))
);

AgentInterconnectClient client = new AgentInterconnectClient(transport);
JsonNode results = client.discover(Map.of("text", "calendar"));
```

Use an HTTP JSON gateway:

```java
import com.fasterxml.jackson.databind.JsonNode;
import dev.idevlab.gbz185.AgentInterconnectClient;
import dev.idevlab.gbz185.HttpJsonTransport;
import java.util.List;
import java.util.Map;

AgentInterconnectClient client =
    new AgentInterconnectClient(new HttpJsonTransport("https://api.example.com/gbz185"));

JsonNode result = client.invokeTools(Map.of(
    "sessionId", "session-1",
    "toolInvokeList", List.of(Map.of(
        "toolId", "calendar.add",
        "toolVersion", "1.0.0",
        "toolInputParam", Map.of("date", "2026-06-27", "time", "10:00", "event", "review")
    ))
));
```

Java release note: Maven Central publication requires project signing and Sonatype namespace setup. Until then, use `mvn install` locally or consume from a private Maven repository.

## Testing Summary

Run everything that can run locally on this machine:

```bash
cd sdks/python && python -m unittest discover -s tests && python examples/basic_client.py
cd ../go && go test ./...
cd ../rust && cargo fmt --check && cargo test && cargo package --allow-dirty
```

Java tests run in GitHub Actions with Temurin 17:

```bash
cd sdks/java && mvn test
```

The repository language SDK CI workflow verifies Python, Go, Rust, and Java on every relevant push and pull request.
