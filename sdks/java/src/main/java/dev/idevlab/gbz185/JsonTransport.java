package dev.idevlab.gbz185;

import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;

public interface JsonTransport {
  JsonNode request(String operation, Object payload) throws IOException, InterruptedException;
}
