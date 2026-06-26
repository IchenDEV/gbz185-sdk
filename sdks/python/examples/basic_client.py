from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from gbz185_sdk import AgentInterconnectClient, AgentIdentityCodeParts, InProcessJsonTransport, format_identity_code

agent_id = format_identity_code(
    AgentIdentityCodeParts(
        registration_service_provider="A1",
        registration_requester="REQ001",
        ontology_serial="CALENDAR",
        instance_serial="1",
    )
)

transport = InProcessJsonTransport()
transport.register("discovery.discover", lambda payload: [{"description": {"agentId": agent_id}, "score": 1, "matchedBy": ["text"]}])

client = AgentInterconnectClient(transport)
print(client.discover({"text": "calendar"}))
