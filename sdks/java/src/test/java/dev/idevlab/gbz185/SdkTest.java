package dev.idevlab.gbz185;

import static org.junit.jupiter.api.Assertions.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.Test;

class SdkTest {
  private static final ObjectMapper MAPPER = new ObjectMapper();

  @Test
  void identityCodeRoundTrip() {
    String code = IdentityCodes.formatIdentityCode(new AgentIdentityCodeParts("a1", "req001", "calendar", "1"));
    assertEquals("1.2.156.3088.1.A1.REQ001.CALENDAR.1", code);
    assertTrue(IdentityCodes.validateIdentityCode(code));
    assertEquals("REQ001", IdentityCodes.parseIdentityCode(code).registrationRequester());
    assertFalse(IdentityCodes.validateIdentityCode("1.2.156.9999.1.A1.REQ001.CALENDAR.1"));
  }

  @Test
  void clientUsesStandardOperations() throws Exception {
    InProcessJsonTransport transport = new InProcessJsonTransport();
    transport.register("discovery.discover", payload -> MAPPER.valueToTree(Map.of("score", 1, "payload", payload)));
    AgentInterconnectClient client = new AgentInterconnectClient(transport);
    assertEquals(1, client.discover(Map.of("text", "calendar")).get("score").asInt());
  }

  @Test
  void conformanceCounts() {
    assertEquals(12, Conformance.GBZ185_FUNCTIONS.size());
    assertEquals(10, Conformance.GBZ185_FRAI_INTERFACES.size());
  }
}
