package dev.idevlab.gbz185;

import java.util.Locale;
import java.util.regex.Pattern;

public final class IdentityCodes {
  public static final String AGENT_IDENTITY_CODE_OID = "1.2.156.3088";
  public static final String CURRENT_IDENTITY_CODE_VERSION = "1";

  private static final Pattern NODE_PATTERN = Pattern.compile("^[0-9A-Z]+$", Pattern.CASE_INSENSITIVE);

  private IdentityCodes() {}

  public static String formatIdentityCode(AgentIdentityCodeParts parts) {
    AgentIdentityCodeParts normalized = new AgentIdentityCodeParts(
        blankToDefault(parts.oid(), AGENT_IDENTITY_CODE_OID),
        blankToDefault(parts.version(), CURRENT_IDENTITY_CODE_VERSION),
        parts.registrationServiceProvider().toUpperCase(Locale.ROOT),
        parts.registrationRequester().toUpperCase(Locale.ROOT),
        parts.ontologySerial().toUpperCase(Locale.ROOT),
        parts.instanceSerial().toUpperCase(Locale.ROOT)
    );
    validateIdentityCodeParts(normalized);
    return String.join(
        ".",
        normalized.oid(),
        normalized.version(),
        normalized.registrationServiceProvider(),
        normalized.registrationRequester(),
        normalized.ontologySerial(),
        normalized.instanceSerial()
    );
  }

  public static AgentIdentityCodeParts parseIdentityCode(String code) {
    String[] segments = code.split("\\.", -1);
    if (segments.length != 9) {
      throw new IllegalArgumentException("Agent identity code must contain 9 dot-separated segments");
    }

    String oid = String.join(".", segments[0], segments[1], segments[2], segments[3]);
    if (!AGENT_IDENTITY_CODE_OID.equals(oid)) {
      throw new IllegalArgumentException("Unsupported agent identity code OID: " + oid);
    }
    if (!CURRENT_IDENTITY_CODE_VERSION.equals(segments[4])) {
      throw new IllegalArgumentException("Unsupported agent identity code version: " + segments[4]);
    }

    AgentIdentityCodeParts parts = new AgentIdentityCodeParts(
        AGENT_IDENTITY_CODE_OID,
        CURRENT_IDENTITY_CODE_VERSION,
        segments[5].toUpperCase(Locale.ROOT),
        segments[6].toUpperCase(Locale.ROOT),
        segments[7].toUpperCase(Locale.ROOT),
        segments[8].toUpperCase(Locale.ROOT)
    );
    validateIdentityCodeParts(parts);
    return parts;
  }

  public static boolean validateIdentityCode(String code) {
    try {
      parseIdentityCode(code);
      return true;
    } catch (IllegalArgumentException error) {
      return false;
    }
  }

  public static void validateIdentityCodeParts(AgentIdentityCodeParts parts) {
    if (!AGENT_IDENTITY_CODE_OID.equals(parts.oid())) {
      throw new IllegalArgumentException("Agent identity code OID must be " + AGENT_IDENTITY_CODE_OID);
    }
    if (!CURRENT_IDENTITY_CODE_VERSION.equals(parts.version())) {
      throw new IllegalArgumentException("Agent identity code version must be " + CURRENT_IDENTITY_CODE_VERSION);
    }
    validateNode(parts.registrationServiceProvider(), "registrationServiceProvider", 6);
    validateNode(parts.registrationRequester(), "registrationRequester", 6);
    validateNode(parts.ontologySerial(), "ontologySerial", 9);
    validateNode(parts.instanceSerial(), "instanceSerial", 9);
  }

  private static void validateNode(String value, String name, int maxLength) {
    if (value == null || value.isBlank() || value.length() > maxLength || !NODE_PATTERN.matcher(value).matches()) {
      throw new IllegalArgumentException(name + " must be 1-" + maxLength + " base36 characters");
    }
  }

  private static String blankToDefault(String value, String defaultValue) {
    return value == null || value.isBlank() ? defaultValue : value;
  }
}
