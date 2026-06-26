package dev.idevlab.gbz185;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

public final class HttpJsonTransport implements JsonTransport {
  private static final ObjectMapper MAPPER = new ObjectMapper();

  private final URI endpoint;
  private final Map<String, String> headers;
  private final HttpClient httpClient;

  public HttpJsonTransport(String endpoint) {
    this(URI.create(endpoint), Map.of(), HttpClient.newHttpClient());
  }

  public HttpJsonTransport(URI endpoint, Map<String, String> headers, HttpClient httpClient) {
    this.endpoint = endpoint;
    this.headers = new HashMap<>(headers);
    this.httpClient = httpClient;
  }

  @Override
  public JsonNode request(String operation, Object payload) throws IOException, InterruptedException {
    Map<String, Object> envelope = new HashMap<>();
    envelope.put("operation", operation);
    envelope.put("payload", payload);
    byte[] body = MAPPER.writeValueAsBytes(envelope);
    HttpRequest.Builder builder = HttpRequest.newBuilder(endpoint)
        .POST(HttpRequest.BodyPublishers.ofByteArray(body))
        .header("content-type", "application/json");
    headers.forEach(builder::header);
    HttpResponse<String> response = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
    if (response.statusCode() < 200 || response.statusCode() >= 300) {
      throw new IOException("HTTP JSON transport failed: " + response.statusCode());
    }
    return MAPPER.readTree(response.body());
  }
}
