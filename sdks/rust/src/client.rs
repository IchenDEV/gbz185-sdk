use crate::{JsonTransport, Result};
use serde_json::{json, Value};

pub struct AgentInterconnectClient<T: JsonTransport> {
    transport: T,
}

impl<T: JsonTransport> AgentInterconnectClient<T> {
    pub fn new(transport: T) -> Self {
        Self { transport }
    }

    pub fn register_identity(&self, input: Value) -> Result<Value> {
        self.transport.request("identity.register", input)
    }

    pub fn get_identity(&self, agent_id: &str) -> Result<Value> {
        self.transport
            .request("identity.get", json!({ "agentId": agent_id }))
    }

    pub fn issue_credential(&self, agent_id: &str, input: Value) -> Result<Value> {
        self.transport.request(
            "identity.issueCredential",
            json!({ "agentId": agent_id, "input": input }),
        )
    }

    pub fn lock_identity(&self, agent_id: &str, reason: Option<&str>) -> Result<Value> {
        self.transport.request(
            "identity.lock",
            json!({ "agentId": agent_id, "reason": reason }),
        )
    }

    pub fn unlock_identity(&self, agent_id: &str, reason: Option<&str>) -> Result<Value> {
        self.transport.request(
            "identity.unlock",
            json!({ "agentId": agent_id, "reason": reason }),
        )
    }

    pub fn revoke_identity(&self, agent_id: &str, reason: Option<&str>) -> Result<Value> {
        self.transport.request(
            "identity.revoke",
            json!({ "agentId": agent_id, "reason": reason }),
        )
    }

    pub fn register_description(&self, description: Value) -> Result<Value> {
        self.transport.request("description.register", description)
    }

    pub fn publish_description(&self, agent_id: &str) -> Result<Value> {
        self.transport
            .request("description.publish", json!({ "agentId": agent_id }))
    }

    pub fn publish_description_with_info(
        &self,
        agent_id: &str,
        publication: Value,
    ) -> Result<Value> {
        self.transport.request(
            "description.publish",
            json!({ "agentId": agent_id, "publication": publication }),
        )
    }

    pub fn review_description(&self, agent_id: &str, review: Value) -> Result<Value> {
        self.transport.request(
            "description.review",
            json!({ "agentId": agent_id, "review": review }),
        )
    }

    pub fn issue_publication_certificate(&self, agent_id: &str, input: Value) -> Result<Value> {
        self.transport.request(
            "description.issuePublicationCertificate",
            json!({ "agentId": agent_id, "input": input }),
        )
    }

    pub fn unpublish_description(&self, agent_id: &str) -> Result<Value> {
        self.transport
            .request("description.unpublish", json!({ "agentId": agent_id }))
    }

    pub fn revoke_description(&self, agent_id: &str, reason: Option<&str>) -> Result<Value> {
        self.transport.request(
            "description.revoke",
            json!({ "agentId": agent_id, "reason": reason }),
        )
    }

    pub fn discover(&self, query: Value) -> Result<Value> {
        self.transport.request("discovery.discover", query)
    }

    pub fn create_session(&self, input: Value) -> Result<Value> {
        self.transport.request("interaction.createSession", input)
    }

    pub fn submit_task(&self, input: Value) -> Result<Value> {
        self.transport.request("interaction.submitTask", input)
    }

    pub fn send_message(&self, input: Value) -> Result<Value> {
        self.transport.request("interaction.sendMessage", input)
    }

    pub fn distribute_message(&self, input: Value, recipients: Value) -> Result<Value> {
        self.transport.request(
            "interaction.distributeMessage",
            json!({ "input": input, "recipients": recipients }),
        )
    }

    pub fn list_tools(&self, tool_request_list: Value) -> Result<Value> {
        self.transport
            .request("tool.list", json!({ "toolRequestList": tool_request_list }))
    }

    pub fn sync_tool_updates(&self) -> Result<Value> {
        self.transport.request("tool.updates", json!({}))
    }

    pub fn invoke_tools(&self, request: Value) -> Result<Value> {
        self.transport.request("tool.invoke", request)
    }
}
