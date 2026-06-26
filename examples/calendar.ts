import {
  createAgentInterconnectRuntime,
  formatIdentityCode,
  type AgentDescription
} from "../src/index.js";

const runtime = createAgentInterconnectRuntime();

const requesterId = formatIdentityCode({
  registrationServiceProvider: "A1",
  registrationRequester: "REQ001",
  ontologySerial: "ASSISTANT",
  instanceSerial: "1"
});

const registration = await runtime.client.registerIdentity({
  delegatorId: "example-org",
  subject: "Calendar Agent",
  registrationServiceProvider: "A1",
  registrationRequester: "REQ001",
  ontologySerial: "CALENDAR",
  instanceSerial: "1",
  issueCredential: true,
  credentialAudience: [requesterId],
  credentialScope: ["agent:interact", "tool:invoke"]
});

const description: AgentDescription = {
  agentId: registration.account.id,
  name: "Calendar Agent",
  version: "1.0.0",
  description: "Creates calendar events from natural language task requests",
  provider: "Example Org",
  accessAddress: "local://calendar",
  accessMethod: [{ type: "url", address: "local://calendar" }],
  authentication: { type: "x509" },
  capabilities: { asyncMessages: true, taskStateHistory: true },
  defaultInputTypes: ["text", "json"],
  defaultOutputTypes: ["json"],
  skills: [
    {
      skillId: "schedule.add",
      skillName: "add_schedule",
      skillDescription: "Add one calendar schedule item",
      tags: ["calendar", "schedule"],
      inputTypes: ["text", "json"],
      outputTypes: ["json"]
    }
  ]
};

await runtime.client.registerDescription(description);
await runtime.client.publishDescription(description.agentId);
await runtime.toolRuntime.registerTool(
  {
    toolId: "calendar.add",
    toolName: "add_schedule",
    toolDescription: "Add one calendar event",
    toolVersion: "1.0.0",
    toolInputParam: { date: "string", time: "string", event: "string" },
    toolOutputParam: { eventId: "string", accepted: "boolean" }
  },
  (input) => ({
    eventId: `evt-${input.date}-${input.time}`,
    accepted: true
  })
);

const [match] = await runtime.client.discover({ text: "calendar schedule", requiredSkills: ["schedule.add"] });
if (!match) {
  throw new Error("Calendar agent was not discovered");
}

const session = await runtime.client.createSession({
  mode: "point_to_point",
  sender: { agentId: requesterId },
  receivers: [{ agentId: match.description.agentId, mode: "point_to_point", accessAddress: match.description.accessAddress }]
});
const task = await runtime.client.submitTask({ sessionId: session.id });
const toolResult = await runtime.client.invokeTools({
  sessionId: session.id,
  toolInvokeList: [
    {
      toolId: "calendar.add",
      toolVersion: "1.0.0",
      toolInputParam: {
        date: "2026-06-26",
        time: "10:00",
        event: "GB/Z 185 SDK review"
      }
    }
  ]
});
await runtime.client.sendMessage({
  senderRole: "service",
  senderId: match.description.agentId,
  sessionId: session.id,
  taskId: task.id,
  artifact: "work_result",
  final: true,
  lastChunk: true,
  dataItems: [{ type: "application/json", metadata: {}, payload: toolResult.toolResultList[0] ?? null }]
});

console.log(JSON.stringify({ discovered: match.description.name, sessionId: session.id, toolResult }, null, 2));
