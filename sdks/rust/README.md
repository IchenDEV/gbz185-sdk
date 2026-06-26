# gbz185-sdk Rust

Rust client SDK for GB/Z 185-2026 agent interconnection JSON operations.

The Rust crate is a client/adapter SDK. It provides identity-code helpers, conformance constants, `JsonTransport`, `InProcessJsonTransport`, `HttpJsonTransport`, and `AgentInterconnectClient`. The full in-memory reference runtime lives in the TypeScript package.

## Install

Local path usage:

```toml
[dependencies]
gbz185-sdk = { path = "../gbz185-sdk/sdks/rust" }
```

After crates.io publication:

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

## Identity Code

```rust
use gbz185_sdk::{format_identity_code, parse_identity_code, validate_identity_code, AgentIdentityCodeParts};

let parts = AgentIdentityCodeParts::new("A1", "REQ001", "CALENDAR", "1");
let agent_id = format_identity_code(&parts)?;

assert_eq!(agent_id, "1.2.156.3088.1.A1.REQ001.CALENDAR.1");
assert!(validate_identity_code(&agent_id));
assert_eq!(parse_identity_code(&agent_id)?.registration_requester, "REQ001");
```

## In-Process Transport

```rust
use gbz185_sdk::{AgentInterconnectClient, InProcessJsonTransport};
use serde_json::json;

let transport = InProcessJsonTransport::new();
transport.register("discovery.discover", |payload| {
    Ok(json!([{
        "description": { "agentId": "agent-1", "name": "Calendar Agent" },
        "score": 1,
        "matchedBy": ["text"],
        "payload": payload
    }]))
});

let client = AgentInterconnectClient::new(transport);
let results = client.discover(json!({ "text": "calendar" }))?;
```

## HTTP JSON Transport

```rust
use gbz185_sdk::{AgentInterconnectClient, HttpJsonTransport};
use serde_json::json;

let transport = HttpJsonTransport::new("https://api.example.com/gbz185")
    .with_header("authorization", "Bearer token");
let client = AgentInterconnectClient::new(transport);

let matches = client.discover(json!({
    "text": "calendar schedule",
    "requiredSkills": ["schedule.add"],
    "requireAvailable": true
}))?;
```

The HTTP transport sends:

```json
{ "operation": "discovery.discover", "payload": { "text": "calendar schedule" } }
```

## Tool Invocation

```rust
let result = client.invoke_tools(json!({
    "sessionId": "session-1",
    "toolInvokeList": [{
        "toolId": "calendar.add",
        "toolVersion": "1.0.0",
        "toolInputParam": {
            "date": "2026-06-27",
            "time": "10:00",
            "event": "GB/Z 185 review"
        }
    }]
}))?;
```

## Client Methods

- `register_identity(input)`
- `get_identity(agent_id)`
- `issue_credential(agent_id, input)`
- `lock_identity(agent_id, reason)`
- `unlock_identity(agent_id, reason)`
- `revoke_identity(agent_id, reason)`
- `register_description(description)`
- `publish_description(agent_id)`
- `publish_description_with_info(agent_id, publication)`
- `review_description(agent_id, review)`
- `issue_publication_certificate(agent_id, input)`
- `unpublish_description(agent_id)`
- `revoke_description(agent_id, reason)`
- `discover(query)`
- `create_session(input)`
- `submit_task(input)`
- `send_message(input)`
- `distribute_message(input, recipients)`
- `list_tools(tool_request_list)`
- `sync_tool_updates()`
- `invoke_tools(request)`

## Conformance Constants

```rust
use gbz185_sdk::{GBZ185_FRAI_INTERFACES, GBZ185_FUNCTIONS};

assert_eq!(GBZ185_FUNCTIONS.len(), 12);
assert_eq!(GBZ185_FRAI_INTERFACES.len(), 10);
```
