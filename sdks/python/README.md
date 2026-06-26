# gbz185-sdk Python

Python client SDK for GB/Z 185-2026 agent interconnection JSON operations.

**Status:** Alpha experimental.

The Python SDK is an Alpha client/adapter SDK. It provides identity-code helpers, conformance constants, `JsonTransport`, `InProcessJsonTransport`, `HttpJsonTransport`, and `AgentInterconnectClient`. The full in-memory reference runtime lives in the Beta TypeScript package.

## Install

Current repository install:

```bash
python -m pip install "git+https://github.com/IchenDEV/gbz185-sdk.git#subdirectory=sdks/python"
```

Local development:

```bash
cd sdks/python
python -m pip install .
python -m unittest discover -s tests
python examples/basic_client.py
```

After PyPI publication:

```bash
python -m pip install gbz185-sdk
```

## Identity Code

```python
from gbz185_sdk import AgentIdentityCodeParts, format_identity_code, parse_identity_code, validate_identity_code

agent_id = format_identity_code(
    AgentIdentityCodeParts(
        registration_service_provider="A1",
        registration_requester="REQ001",
        ontology_serial="CALENDAR",
        instance_serial="1",
    )
)

assert agent_id == "1.2.156.3088.1.A1.REQ001.CALENDAR.1"
assert validate_identity_code(agent_id)
assert parse_identity_code(agent_id).registration_requester == "REQ001"
```

## In-Process Transport

Use `InProcessJsonTransport` when writing tests, local demos, or adapters around an existing Python service object.

```python
from gbz185_sdk import AgentInterconnectClient, InProcessJsonTransport

transport = InProcessJsonTransport()
transport.register(
    "discovery.discover",
    lambda payload: [
        {
            "description": {"agentId": "agent-1", "name": "Calendar Agent"},
            "score": 1,
            "matchedBy": ["text"],
        }
    ],
)

client = AgentInterconnectClient(transport)
results = client.discover({"text": "calendar schedule"})
```

## HTTP JSON Transport

Use `HttpJsonTransport` when your server accepts the standard envelope:

```json
{ "operation": "discovery.discover", "payload": { "text": "calendar" } }
```

```python
from gbz185_sdk import AgentInterconnectClient, HttpJsonTransport

client = AgentInterconnectClient(
    HttpJsonTransport(
        "https://api.example.com/gbz185",
        headers={"authorization": "Bearer token"},
    )
)

matches = client.discover({
    "text": "calendar schedule",
    "requiredSkills": ["schedule.add"],
    "requireAvailable": True,
})
```

## Tool Invocation

```python
result = client.invoke_tools({
    "sessionId": "session-1",
    "toolInvokeList": [
        {
            "toolId": "calendar.add",
            "toolVersion": "1.0.0",
            "toolInputParam": {
                "date": "2026-06-27",
                "time": "10:00",
                "event": "GB/Z 185 review",
            },
        }
    ],
})
```

## Client Methods

- `register_identity(input)`
- `get_identity(agent_id)`
- `issue_credential(agent_id, input)`
- `lock_identity(agent_id, reason=None)`
- `unlock_identity(agent_id, reason=None)`
- `revoke_identity(agent_id, reason=None)`
- `register_description(description)`
- `publish_description(agent_id)`
- `publish_description_with_info(agent_id, publication=None)`
- `review_description(agent_id, review)`
- `issue_publication_certificate(agent_id, input)`
- `unpublish_description(agent_id)`
- `revoke_description(agent_id, reason=None)`
- `discover(query)`
- `create_session(input)`
- `submit_task(input)`
- `send_message(input)`
- `distribute_message(input, recipients=None)`
- `list_tools(tool_request_list=None)`
- `sync_tool_updates()`
- `invoke_tools(request)`

## Conformance Constants

```python
from gbz185_sdk import GBZ185_FUNCTIONS, GBZ185_FRAI_INTERFACES

assert len(GBZ185_FUNCTIONS) == 12
assert len(GBZ185_FRAI_INTERFACES) == 10
```
