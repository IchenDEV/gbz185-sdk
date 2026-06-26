GBZ185_FUNCTIONS = [
    {"domain": "agent", "function": "agent identity maintenance", "sdk": "AgentIdentityMaintenance"},
    {"domain": "agent", "function": "agent description maintenance", "sdk": "AgentDescriptionMaintenance"},
    {"domain": "agent", "function": "agent interconnection authorization", "sdk": "InterconnectionAuthorizationRuntime"},
    {"domain": "agent", "function": "agent interaction", "sdk": "InteractionRuntime"},
    {"domain": "agent", "function": "tool access", "sdk": "ToolAccessRuntime"},
    {"domain": "management", "function": "agent identity management", "sdk": "IdentityRegistryRuntime"},
    {"domain": "management", "function": "agent credential management", "sdk": "CredentialIssuer"},
    {"domain": "management", "function": "agent identity authentication", "sdk": "CredentialVerifier"},
    {"domain": "interconnection", "function": "agent description management", "sdk": "AgentDescriptionRegistry"},
    {"domain": "interconnection", "function": "agent discovery", "sdk": "DiscoveryService"},
    {"domain": "interconnection", "function": "message distribution", "sdk": "MessageDistributionRuntime"},
    {"domain": "resource", "function": "tool service", "sdk": "ToolRuntime"},
]

GBZ185_FRAI_INTERFACES = [
    {"id": "FRAI-01", "from": "agent identity maintenance", "to": "agent identity management"},
    {"id": "FRAI-02", "from": "agent identity maintenance", "to": "agent credential management"},
    {"id": "FRAI-03", "from": "agent interconnection authorization", "to": "agent identity authentication"},
    {"id": "FRAI-04", "from": "agent identity management", "to": "agent credential management"},
    {"id": "FRAI-05", "from": "agent credential management", "to": "agent identity authentication"},
    {"id": "FRAI-06", "from": "agent description maintenance", "to": "agent description management"},
    {"id": "FRAI-07", "from": "agent description management", "to": "agent discovery"},
    {"id": "FRAI-08", "from": "agent interaction", "to": "agent interaction"},
    {"id": "FRAI-09", "from": "agent interaction", "to": "message distribution"},
    {"id": "FRAI-10", "from": "tool access", "to": "tool service"},
]
