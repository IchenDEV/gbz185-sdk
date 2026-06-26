package dev.idevlab.gbz185;

import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public final class AgentInterconnectClient {
  private final JsonTransport transport;

  public AgentInterconnectClient(JsonTransport transport) {
    this.transport = transport;
  }

  public JsonNode registerIdentity(Object input) throws IOException, InterruptedException {
    return transport.request("identity.register", input);
  }

  public JsonNode getIdentity(String agentId) throws IOException, InterruptedException {
    return transport.request("identity.get", Map.of("agentId", agentId));
  }

  public JsonNode issueCredential(String agentId, Object input) throws IOException, InterruptedException {
    return transport.request("identity.issueCredential", payload("agentId", agentId, "input", input));
  }

  public JsonNode lockIdentity(String agentId, String reason) throws IOException, InterruptedException {
    return transport.request("identity.lock", mapWithNullableReason(agentId, reason));
  }

  public JsonNode unlockIdentity(String agentId, String reason) throws IOException, InterruptedException {
    return transport.request("identity.unlock", mapWithNullableReason(agentId, reason));
  }

  public JsonNode revokeIdentity(String agentId, String reason) throws IOException, InterruptedException {
    return transport.request("identity.revoke", mapWithNullableReason(agentId, reason));
  }

  public JsonNode registerDescription(Object description) throws IOException, InterruptedException {
    return transport.request("description.register", description);
  }

  public JsonNode publishDescription(String agentId) throws IOException, InterruptedException {
    return transport.request("description.publish", Map.of("agentId", agentId));
  }

  public JsonNode publishDescriptionWithInfo(String agentId, Object publication) throws IOException, InterruptedException {
    return transport.request("description.publish", payload("agentId", agentId, "publication", publication));
  }

  public JsonNode reviewDescription(String agentId, Object review) throws IOException, InterruptedException {
    return transport.request("description.review", payload("agentId", agentId, "review", review));
  }

  public JsonNode issuePublicationCertificate(String agentId, Object input) throws IOException, InterruptedException {
    return transport.request("description.issuePublicationCertificate", payload("agentId", agentId, "input", input));
  }

  public JsonNode unpublishDescription(String agentId) throws IOException, InterruptedException {
    return transport.request("description.unpublish", Map.of("agentId", agentId));
  }

  public JsonNode revokeDescription(String agentId, String reason) throws IOException, InterruptedException {
    return transport.request("description.revoke", mapWithNullableReason(agentId, reason));
  }

  public JsonNode discover(Object query) throws IOException, InterruptedException {
    return transport.request("discovery.discover", query);
  }

  public JsonNode createSession(Object input) throws IOException, InterruptedException {
    return transport.request("interaction.createSession", input);
  }

  public JsonNode submitTask(Object input) throws IOException, InterruptedException {
    return transport.request("interaction.submitTask", input);
  }

  public JsonNode sendMessage(Object input) throws IOException, InterruptedException {
    return transport.request("interaction.sendMessage", input);
  }

  public JsonNode distributeMessage(Object input, List<String> recipients) throws IOException, InterruptedException {
    return transport.request("interaction.distributeMessage", payload("input", input, "recipients", recipients));
  }

  public JsonNode listTools(List<String> toolRequestList) throws IOException, InterruptedException {
    return transport.request("tool.list", payload("toolRequestList", toolRequestList));
  }

  public JsonNode syncToolUpdates() throws IOException, InterruptedException {
    return transport.request("tool.updates", Map.of());
  }

  public JsonNode invokeTools(Object request) throws IOException, InterruptedException {
    return transport.request("tool.invoke", request);
  }

  private static Map<String, Object> mapWithNullableReason(String agentId, String reason) {
    return payload("agentId", agentId, "reason", reason);
  }

  private static Map<String, Object> payload(Object... pairs) {
    Map<String, Object> payload = new HashMap<>();
    for (int index = 0; index < pairs.length; index += 2) {
      payload.put((String) pairs[index], pairs[index + 1]);
    }
    return payload;
  }
}
