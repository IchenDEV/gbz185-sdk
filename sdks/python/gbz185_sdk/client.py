from __future__ import annotations

from typing import Any

from .transport import JsonTransport

JsonObject = dict[str, Any]


class AgentInterconnectClient:
    def __init__(self, transport: JsonTransport) -> None:
        self.transport = transport

    def register_identity(self, input: JsonObject) -> JsonObject:
        return self.transport.request("identity.register", input)

    def get_identity(self, agent_id: str) -> JsonObject | None:
        return self.transport.request("identity.get", {"agentId": agent_id})

    def issue_credential(self, agent_id: str, input: JsonObject) -> JsonObject:
        return self.transport.request("identity.issueCredential", {"agentId": agent_id, "input": input})

    def lock_identity(self, agent_id: str, reason: str | None = None) -> JsonObject:
        return self.transport.request("identity.lock", {"agentId": agent_id, "reason": reason})

    def unlock_identity(self, agent_id: str, reason: str | None = None) -> JsonObject:
        return self.transport.request("identity.unlock", {"agentId": agent_id, "reason": reason})

    def revoke_identity(self, agent_id: str, reason: str | None = None) -> JsonObject:
        return self.transport.request("identity.revoke", {"agentId": agent_id, "reason": reason})

    def register_description(self, description: JsonObject) -> JsonObject:
        return self.transport.request("description.register", description)

    def publish_description(self, agent_id: str) -> JsonObject:
        return self.transport.request("description.publish", {"agentId": agent_id})

    def publish_description_with_info(self, agent_id: str, publication: JsonObject | None = None) -> JsonObject:
        return self.transport.request("description.publish", {"agentId": agent_id, "publication": publication})

    def review_description(self, agent_id: str, review: JsonObject) -> JsonObject:
        return self.transport.request("description.review", {"agentId": agent_id, "review": review})

    def issue_publication_certificate(self, agent_id: str, input: JsonObject) -> JsonObject:
        return self.transport.request("description.issuePublicationCertificate", {"agentId": agent_id, "input": input})

    def unpublish_description(self, agent_id: str) -> JsonObject:
        return self.transport.request("description.unpublish", {"agentId": agent_id})

    def revoke_description(self, agent_id: str, reason: str | None = None) -> JsonObject:
        return self.transport.request("description.revoke", {"agentId": agent_id, "reason": reason})

    def discover(self, query: JsonObject) -> list[JsonObject]:
        return self.transport.request("discovery.discover", query)

    def create_session(self, input: JsonObject) -> JsonObject:
        return self.transport.request("interaction.createSession", input)

    def submit_task(self, input: JsonObject) -> JsonObject:
        return self.transport.request("interaction.submitTask", input)

    def send_message(self, input: JsonObject) -> JsonObject:
        return self.transport.request("interaction.sendMessage", input)

    def distribute_message(self, input: JsonObject, recipients: list[str] | None = None) -> list[JsonObject]:
        return self.transport.request("interaction.distributeMessage", {"input": input, "recipients": recipients})

    def list_tools(self, tool_request_list: list[str] | None = None) -> JsonObject:
        return self.transport.request("tool.list", {"toolRequestList": tool_request_list})

    def sync_tool_updates(self) -> JsonObject:
        return self.transport.request("tool.updates", {})

    def invoke_tools(self, request: JsonObject) -> JsonObject:
        return self.transport.request("tool.invoke", request)
