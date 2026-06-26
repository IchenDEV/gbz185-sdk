package dev.idevlab.gbz185;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public final class InProcessJsonTransport implements JsonTransport {
  @FunctionalInterface
  public interface JsonOperationHandler {
    JsonNode handle(JsonNode payload) throws IOException;
  }

  private static final ObjectMapper MAPPER = new ObjectMapper();
  private final Map<String, JsonOperationHandler> handlers = new HashMap<>();

  public void register(String operation, JsonOperationHandler handler) {
    handlers.put(operation, handler);
  }

  @Override
  public JsonNode request(String operation, Object payload) throws IOException {
    JsonOperationHandler handler = handlers.get(operation);
    if (handler == null) {
      throw new IOException("No JSON transport handler registered for operation: " + operation);
    }
    return handler.handle(MAPPER.valueToTree(payload));
  }
}
