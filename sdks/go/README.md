# gbz185-sdk Go

Go client SDK for GB/Z 185-2026 agent interconnection JSON operations.

The Go SDK is a client/adapter SDK. It provides identity-code helpers, conformance constants, `JsonTransport`, `InProcessJsonTransport`, `HttpJsonTransport`, and `AgentInterconnectClient`. The full in-memory reference runtime lives in the TypeScript package.

## Install

Current repository usage:

```bash
go get github.com/IchenDEV/gbz185-sdk/sdks/go/gbz185@main
```

Import:

```go
import "github.com/IchenDEV/gbz185-sdk/sdks/go/gbz185"
```

Local verification:

```bash
cd sdks/go
go test ./...
```

For stable Go module releases, tag the submodule with Go's expected format, for example `sdks/go/v0.1.0`.

## Identity Code

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

fmt.Println(agentID)
fmt.Println(gbz185.ValidateIdentityCode(agentID))
```

## In-Process Transport

```go
transport := gbz185.NewInProcessJsonTransport()
transport.Register("discovery.discover", func(ctx context.Context, payload any) (any, error) {
    return []gbz185.JSONObject{
        {
            "description": gbz185.JSONObject{"agentId": "agent-1", "name": "Calendar Agent"},
            "score":       1,
            "matchedBy":   []string{"text"},
        },
    }, nil
})

client := gbz185.NewAgentInterconnectClient(transport)
var results []gbz185.JSONObject
err := client.Discover(context.Background(), gbz185.JSONObject{"text": "calendar"}, &results)
```

## HTTP JSON Transport

```go
transport := &gbz185.HttpJsonTransport{
    Endpoint: "https://api.example.com/gbz185",
    Headers:  map[string]string{"authorization": "Bearer token"},
}
client := gbz185.NewAgentInterconnectClient(transport)

var matches []gbz185.JSONObject
err := client.Discover(context.Background(), gbz185.JSONObject{
    "text":            "calendar schedule",
    "requiredSkills":  []string{"schedule.add"},
    "requireAvailable": true,
}, &matches)
```

The HTTP transport sends:

```json
{ "operation": "discovery.discover", "payload": { "text": "calendar schedule" } }
```

## Tool Invocation

```go
var result gbz185.JSONObject
err := client.InvokeTools(context.Background(), gbz185.JSONObject{
    "sessionId": "session-1",
    "toolInvokeList": []gbz185.JSONObject{
        {
            "toolId":      "calendar.add",
            "toolVersion": "1.0.0",
            "toolInputParam": gbz185.JSONObject{
                "date":  "2026-06-27",
                "time":  "10:00",
                "event": "GB/Z 185 review",
            },
        },
    },
}, &result)
```

## Client Methods

- `RegisterIdentity(ctx, input, out)`
- `GetIdentity(ctx, agentID, out)`
- `IssueCredential(ctx, agentID, input, out)`
- `LockIdentity(ctx, agentID, reason, out)`
- `UnlockIdentity(ctx, agentID, reason, out)`
- `RevokeIdentity(ctx, agentID, reason, out)`
- `RegisterDescription(ctx, description, out)`
- `PublishDescription(ctx, agentID, out)`
- `PublishDescriptionWithInfo(ctx, agentID, publication, out)`
- `ReviewDescription(ctx, agentID, review, out)`
- `IssuePublicationCertificate(ctx, agentID, input, out)`
- `UnpublishDescription(ctx, agentID, out)`
- `RevokeDescription(ctx, agentID, reason, out)`
- `Discover(ctx, query, out)`
- `CreateSession(ctx, input, out)`
- `SubmitTask(ctx, input, out)`
- `SendMessage(ctx, input, out)`
- `DistributeMessage(ctx, input, recipients, out)`
- `ListTools(ctx, toolRequestList, out)`
- `SyncToolUpdates(ctx, out)`
- `InvokeTools(ctx, request, out)`

## Conformance Constants

```go
if len(gbz185.GBZ185Functions) != 12 {
    panic("unexpected function count")
}
if len(gbz185.GBZ185FraiInterfaces) != 10 {
    panic("unexpected FRAI count")
}
```
