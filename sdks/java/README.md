# gbz185-sdk Java

Java client SDK for GB/Z 185-2026 agent interconnection JSON operations.

The Java SDK is a client/adapter SDK. It provides identity-code helpers, conformance constants, `JsonTransport`, `InProcessJsonTransport`, `HttpJsonTransport`, and `AgentInterconnectClient`. The full in-memory reference runtime lives in the TypeScript package.

## Install

Local development:

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

After Maven Central publication, use the same dependency coordinates.

Local verification:

```bash
mvn test
```

## Identity Code

```java
import dev.idevlab.gbz185.AgentIdentityCodeParts;
import dev.idevlab.gbz185.IdentityCodes;

String agentId = IdentityCodes.formatIdentityCode(
    new AgentIdentityCodeParts("A1", "REQ001", "CALENDAR", "1")
);

boolean valid = IdentityCodes.validateIdentityCode(agentId);
String requester = IdentityCodes.parseIdentityCode(agentId).registrationRequester();
```

## In-Process Transport

```java
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.idevlab.gbz185.AgentInterconnectClient;
import dev.idevlab.gbz185.InProcessJsonTransport;
import java.util.Map;

ObjectMapper mapper = new ObjectMapper();
InProcessJsonTransport transport = new InProcessJsonTransport();
transport.register("discovery.discover", payload ->
    mapper.valueToTree(Map.of(
        "description", Map.of("agentId", "agent-1", "name", "Calendar Agent"),
        "score", 1,
        "matchedBy", new String[] {"text"}
    ))
);

AgentInterconnectClient client = new AgentInterconnectClient(transport);
JsonNode results = client.discover(Map.of("text", "calendar"));
```

## HTTP JSON Transport

```java
import com.fasterxml.jackson.databind.JsonNode;
import dev.idevlab.gbz185.AgentInterconnectClient;
import dev.idevlab.gbz185.HttpJsonTransport;
import java.util.List;
import java.util.Map;

AgentInterconnectClient client =
    new AgentInterconnectClient(new HttpJsonTransport("https://api.example.com/gbz185"));

JsonNode matches = client.discover(Map.of(
    "text", "calendar schedule",
    "requiredSkills", List.of("schedule.add"),
    "requireAvailable", true
));
```

The HTTP transport sends:

```json
{ "operation": "discovery.discover", "payload": { "text": "calendar schedule" } }
```

## Tool Invocation

```java
JsonNode result = client.invokeTools(Map.of(
    "sessionId", "session-1",
    "toolInvokeList", List.of(Map.of(
        "toolId", "calendar.add",
        "toolVersion", "1.0.0",
        "toolInputParam", Map.of(
            "date", "2026-06-27",
            "time", "10:00",
            "event", "GB/Z 185 review"
        )
    ))
));
```

## Client Methods

- `registerIdentity(input)`
- `getIdentity(agentId)`
- `issueCredential(agentId, input)`
- `lockIdentity(agentId, reason)`
- `unlockIdentity(agentId, reason)`
- `revokeIdentity(agentId, reason)`
- `registerDescription(description)`
- `publishDescription(agentId)`
- `publishDescriptionWithInfo(agentId, publication)`
- `reviewDescription(agentId, review)`
- `issuePublicationCertificate(agentId, input)`
- `unpublishDescription(agentId)`
- `revokeDescription(agentId, reason)`
- `discover(query)`
- `createSession(input)`
- `submitTask(input)`
- `sendMessage(input)`
- `distributeMessage(input, recipients)`
- `listTools(toolRequestList)`
- `syncToolUpdates()`
- `invokeTools(request)`

## Conformance Constants

```java
import dev.idevlab.gbz185.Conformance;

assert Conformance.GBZ185_FUNCTIONS.size() == 12;
assert Conformance.GBZ185_FRAI_INTERFACES.size() == 10;
```

## Release Note

Maven Central publication requires project signing and Sonatype namespace setup. Until then, use `mvn install` locally or consume from a private Maven repository.
