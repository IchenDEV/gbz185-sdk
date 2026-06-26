package dev.idevlab.gbz185;

public record AgentIdentityCodeParts(
    String oid,
    String version,
    String registrationServiceProvider,
    String registrationRequester,
    String ontologySerial,
    String instanceSerial
) {
  public AgentIdentityCodeParts(
      String registrationServiceProvider,
      String registrationRequester,
      String ontologySerial,
      String instanceSerial
  ) {
    this(
        IdentityCodes.AGENT_IDENTITY_CODE_OID,
        IdentityCodes.CURRENT_IDENTITY_CODE_VERSION,
        registrationServiceProvider,
        registrationRequester,
        ontologySerial,
        instanceSerial
    );
  }
}
