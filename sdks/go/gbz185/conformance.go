package gbz185

type FunctionDescriptor struct {
	Domain   string
	Function string
	SDK      string
}

type FraiInterfaceDescriptor struct {
	ID   string
	From string
	To   string
}

var GBZ185Functions = []FunctionDescriptor{
	{"agent", "agent identity maintenance", "AgentIdentityMaintenance"},
	{"agent", "agent description maintenance", "AgentDescriptionMaintenance"},
	{"agent", "agent interconnection authorization", "InterconnectionAuthorizationRuntime"},
	{"agent", "agent interaction", "InteractionRuntime"},
	{"agent", "tool access", "ToolAccessRuntime"},
	{"management", "agent identity management", "IdentityRegistryRuntime"},
	{"management", "agent credential management", "CredentialIssuer"},
	{"management", "agent identity authentication", "CredentialVerifier"},
	{"interconnection", "agent description management", "AgentDescriptionRegistry"},
	{"interconnection", "agent discovery", "DiscoveryService"},
	{"interconnection", "message distribution", "MessageDistributionRuntime"},
	{"resource", "tool service", "ToolRuntime"},
}

var GBZ185FraiInterfaces = []FraiInterfaceDescriptor{
	{"FRAI-01", "agent identity maintenance", "agent identity management"},
	{"FRAI-02", "agent identity maintenance", "agent credential management"},
	{"FRAI-03", "agent interconnection authorization", "agent identity authentication"},
	{"FRAI-04", "agent identity management", "agent credential management"},
	{"FRAI-05", "agent credential management", "agent identity authentication"},
	{"FRAI-06", "agent description maintenance", "agent description management"},
	{"FRAI-07", "agent description management", "agent discovery"},
	{"FRAI-08", "agent interaction", "agent interaction"},
	{"FRAI-09", "agent interaction", "message distribution"},
	{"FRAI-10", "tool access", "tool service"},
}
