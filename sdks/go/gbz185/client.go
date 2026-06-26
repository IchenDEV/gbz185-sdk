package gbz185

import "context"

type AgentInterconnectClient struct {
	transport JsonTransport
}

func NewAgentInterconnectClient(transport JsonTransport) *AgentInterconnectClient {
	return &AgentInterconnectClient{transport: transport}
}

func (c *AgentInterconnectClient) request(ctx context.Context, operation string, payload any, out any) error {
	return c.transport.Request(ctx, operation, payload, out)
}

func (c *AgentInterconnectClient) RegisterIdentity(ctx context.Context, input JSONObject, out any) error {
	return c.request(ctx, "identity.register", input, out)
}

func (c *AgentInterconnectClient) GetIdentity(ctx context.Context, agentID string, out any) error {
	return c.request(ctx, "identity.get", JSONObject{"agentId": agentID}, out)
}

func (c *AgentInterconnectClient) IssueCredential(ctx context.Context, agentID string, input JSONObject, out any) error {
	return c.request(ctx, "identity.issueCredential", JSONObject{"agentId": agentID, "input": input}, out)
}

func (c *AgentInterconnectClient) LockIdentity(ctx context.Context, agentID string, reason *string, out any) error {
	return c.request(ctx, "identity.lock", JSONObject{"agentId": agentID, "reason": reason}, out)
}

func (c *AgentInterconnectClient) UnlockIdentity(ctx context.Context, agentID string, reason *string, out any) error {
	return c.request(ctx, "identity.unlock", JSONObject{"agentId": agentID, "reason": reason}, out)
}

func (c *AgentInterconnectClient) RevokeIdentity(ctx context.Context, agentID string, reason *string, out any) error {
	return c.request(ctx, "identity.revoke", JSONObject{"agentId": agentID, "reason": reason}, out)
}

func (c *AgentInterconnectClient) RegisterDescription(ctx context.Context, description JSONObject, out any) error {
	return c.request(ctx, "description.register", description, out)
}

func (c *AgentInterconnectClient) PublishDescription(ctx context.Context, agentID string, out any) error {
	return c.request(ctx, "description.publish", JSONObject{"agentId": agentID}, out)
}

func (c *AgentInterconnectClient) PublishDescriptionWithInfo(ctx context.Context, agentID string, publication JSONObject, out any) error {
	return c.request(ctx, "description.publish", JSONObject{"agentId": agentID, "publication": publication}, out)
}

func (c *AgentInterconnectClient) ReviewDescription(ctx context.Context, agentID string, review JSONObject, out any) error {
	return c.request(ctx, "description.review", JSONObject{"agentId": agentID, "review": review}, out)
}

func (c *AgentInterconnectClient) IssuePublicationCertificate(ctx context.Context, agentID string, input JSONObject, out any) error {
	return c.request(ctx, "description.issuePublicationCertificate", JSONObject{"agentId": agentID, "input": input}, out)
}

func (c *AgentInterconnectClient) UnpublishDescription(ctx context.Context, agentID string, out any) error {
	return c.request(ctx, "description.unpublish", JSONObject{"agentId": agentID}, out)
}

func (c *AgentInterconnectClient) RevokeDescription(ctx context.Context, agentID string, reason *string, out any) error {
	return c.request(ctx, "description.revoke", JSONObject{"agentId": agentID, "reason": reason}, out)
}

func (c *AgentInterconnectClient) Discover(ctx context.Context, query JSONObject, out any) error {
	return c.request(ctx, "discovery.discover", query, out)
}

func (c *AgentInterconnectClient) CreateSession(ctx context.Context, input JSONObject, out any) error {
	return c.request(ctx, "interaction.createSession", input, out)
}

func (c *AgentInterconnectClient) SubmitTask(ctx context.Context, input JSONObject, out any) error {
	return c.request(ctx, "interaction.submitTask", input, out)
}

func (c *AgentInterconnectClient) SendMessage(ctx context.Context, input JSONObject, out any) error {
	return c.request(ctx, "interaction.sendMessage", input, out)
}

func (c *AgentInterconnectClient) DistributeMessage(ctx context.Context, input JSONObject, recipients []string, out any) error {
	return c.request(ctx, "interaction.distributeMessage", JSONObject{"input": input, "recipients": recipients}, out)
}

func (c *AgentInterconnectClient) ListTools(ctx context.Context, toolRequestList []string, out any) error {
	return c.request(ctx, "tool.list", JSONObject{"toolRequestList": toolRequestList}, out)
}

func (c *AgentInterconnectClient) SyncToolUpdates(ctx context.Context, out any) error {
	return c.request(ctx, "tool.updates", JSONObject{}, out)
}

func (c *AgentInterconnectClient) InvokeTools(ctx context.Context, request JSONObject, out any) error {
	return c.request(ctx, "tool.invoke", request, out)
}
