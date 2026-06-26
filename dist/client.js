export class AgentInterconnectClient {
    transport;
    constructor(transport) {
        this.transport = transport;
    }
    registerIdentity(input) {
        return this.transport.request("identity.register", input);
    }
    getIdentity(agentId) {
        return this.transport.request("identity.get", { agentId });
    }
    issueCredential(agentId, input) {
        return this.transport.request("identity.issueCredential", { agentId, input });
    }
    lockIdentity(agentId, reason) {
        return this.transport.request("identity.lock", { agentId, reason });
    }
    unlockIdentity(agentId, reason) {
        return this.transport.request("identity.unlock", { agentId, reason });
    }
    revokeIdentity(agentId, reason) {
        return this.transport.request("identity.revoke", { agentId, reason });
    }
    registerDescription(description) {
        return this.transport.request("description.register", description);
    }
    publishDescription(agentId) {
        return this.transport.request("description.publish", { agentId });
    }
    reviewDescription(agentId, review) {
        return this.transport.request("description.review", { agentId, review });
    }
    issuePublicationCertificate(agentId, input) {
        return this.transport.request("description.issuePublicationCertificate", { agentId, input });
    }
    publishDescriptionWithInfo(agentId, publication) {
        return this.transport.request("description.publish", { agentId, publication });
    }
    unpublishDescription(agentId) {
        return this.transport.request("description.unpublish", { agentId });
    }
    revokeDescription(agentId, reason) {
        return this.transport.request("description.revoke", { agentId, reason });
    }
    discover(query) {
        return this.transport.request("discovery.discover", query);
    }
    createSession(input) {
        return this.transport.request("interaction.createSession", input);
    }
    submitTask(input) {
        return this.transport.request("interaction.submitTask", input);
    }
    sendMessage(input) {
        return this.transport.request("interaction.sendMessage", input);
    }
    distributeMessage(input, recipients) {
        return this.transport.request("interaction.distributeMessage", { input, recipients });
    }
    listTools(toolRequestList) {
        return this.transport.request("tool.list", { toolRequestList });
    }
    syncToolUpdates() {
        return this.transport.request("tool.updates", {});
    }
    invokeTools(request) {
        return this.transport.request("tool.invoke", request);
    }
}
//# sourceMappingURL=client.js.map