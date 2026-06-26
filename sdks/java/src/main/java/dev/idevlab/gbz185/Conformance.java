package dev.idevlab.gbz185;

import java.util.List;

public final class Conformance {
  private Conformance() {}

  public record FunctionDescriptor(String domain, String function, String sdk) {}
  public record FraiInterfaceDescriptor(String id, String from, String to) {}

  public static final List<FunctionDescriptor> GBZ185_FUNCTIONS = List.of(
      new FunctionDescriptor("agent", "agent identity maintenance", "AgentIdentityMaintenance"),
      new FunctionDescriptor("agent", "agent description maintenance", "AgentDescriptionMaintenance"),
      new FunctionDescriptor("agent", "agent interconnection authorization", "InterconnectionAuthorizationRuntime"),
      new FunctionDescriptor("agent", "agent interaction", "InteractionRuntime"),
      new FunctionDescriptor("agent", "tool access", "ToolAccessRuntime"),
      new FunctionDescriptor("management", "agent identity management", "IdentityRegistryRuntime"),
      new FunctionDescriptor("management", "agent credential management", "CredentialIssuer"),
      new FunctionDescriptor("management", "agent identity authentication", "CredentialVerifier"),
      new FunctionDescriptor("interconnection", "agent description management", "AgentDescriptionRegistry"),
      new FunctionDescriptor("interconnection", "agent discovery", "DiscoveryService"),
      new FunctionDescriptor("interconnection", "message distribution", "MessageDistributionRuntime"),
      new FunctionDescriptor("resource", "tool service", "ToolRuntime")
  );

  public static final List<FraiInterfaceDescriptor> GBZ185_FRAI_INTERFACES = List.of(
      new FraiInterfaceDescriptor("FRAI-01", "agent identity maintenance", "agent identity management"),
      new FraiInterfaceDescriptor("FRAI-02", "agent identity maintenance", "agent credential management"),
      new FraiInterfaceDescriptor("FRAI-03", "agent interconnection authorization", "agent identity authentication"),
      new FraiInterfaceDescriptor("FRAI-04", "agent identity management", "agent credential management"),
      new FraiInterfaceDescriptor("FRAI-05", "agent credential management", "agent identity authentication"),
      new FraiInterfaceDescriptor("FRAI-06", "agent description maintenance", "agent description management"),
      new FraiInterfaceDescriptor("FRAI-07", "agent description management", "agent discovery"),
      new FraiInterfaceDescriptor("FRAI-08", "agent interaction", "agent interaction"),
      new FraiInterfaceDescriptor("FRAI-09", "agent interaction", "message distribution"),
      new FraiInterfaceDescriptor("FRAI-10", "tool access", "tool service")
  );
}
