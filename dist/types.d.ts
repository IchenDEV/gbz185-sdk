export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
    [key: string]: JsonValue;
}
export type AgentInteractionMode = "point_to_point" | "group" | "hybrid";
export type AgentRole = "requester" | "service";
export type MessageArtifact = "work_communication" | "work_result";
export type TaskState = "accepted" | "rejected" | "completed" | "failed" | "cancelled" | "in_progress" | "progress";
export interface AgentIdentityCodeParts {
    oid: "1.2.156.3088";
    version: "1";
    registrationServiceProvider: string;
    registrationRequester: string;
    ontologySerial: string;
    instanceSerial: string;
}
export type AgentIdentityCode = string;
export interface SkillDescription {
    skillId: string;
    skillName: string;
    skillDescription: string;
    tags: string[];
    examples?: string[] | undefined;
    inputTypes: string[];
    outputTypes: string[];
    dependencies?: JsonObject[] | undefined;
}
export interface AccessMethod {
    type: "url" | "ip" | "fqdn" | string;
    address: string;
    metadata?: JsonObject | undefined;
}
export interface AuthenticationDescription {
    type: "none" | "x509" | "bearer" | "custom" | string;
    metadata?: JsonObject | undefined;
}
export interface AgentDescription {
    agentId: AgentIdentityCode;
    name: string;
    alias?: string | undefined;
    version: string;
    description: string;
    iconAddress?: string | undefined;
    provider: string | JsonObject;
    accessAddress?: string | undefined;
    accessMethod?: AccessMethod[] | undefined;
    servingArea?: JsonObject | undefined;
    authentication?: AuthenticationDescription | undefined;
    capabilities: JsonObject;
    defaultInputTypes: string[];
    defaultOutputTypes: string[];
    skills: SkillDescription[];
    discoverable?: boolean | undefined;
    available?: boolean | undefined;
    metadata?: JsonObject | undefined;
}
export interface DiscoveryQuery {
    text?: string | undefined;
    agentId?: AgentIdentityCode | undefined;
    name?: string | undefined;
    requiredSkills?: string[] | undefined;
    tags?: string[] | undefined;
    inputTypes?: string[] | undefined;
    outputTypes?: string[] | undefined;
    includeUndiscoverable?: boolean | undefined;
    requireAvailable?: boolean | undefined;
    limit?: number | undefined;
}
export interface DiscoveryResult {
    description: AgentDescription;
    score: number;
    matchedBy: string[];
}
export interface DataItem {
    type: string;
    metadata: JsonObject;
    payload: unknown;
}
export interface Message {
    senderRole: AgentRole;
    senderId: AgentIdentityCode;
    sessionId: string;
    taskId?: string | undefined;
    id: string;
    artifact?: MessageArtifact | undefined;
    final?: boolean | undefined;
    chunkIndex?: number | undefined;
    lastChunk?: boolean | undefined;
    dataItems: DataItem[];
    createdAt: string;
}
export interface Task {
    id: string;
    sessionId: string;
    state: TaskState;
    stateChangedAt?: string | undefined;
    messages?: Message[] | undefined;
    artifacts?: Array<Message | Task> | undefined;
}
export interface SessionReceiver {
    agentId: AgentIdentityCode;
    accessAddress?: string | undefined;
    mode: AgentInteractionMode;
    parameters?: JsonObject | undefined;
}
export interface Session {
    id: string;
    mode: AgentInteractionMode;
    sender: {
        agentId: AgentIdentityCode;
        accessAddress?: string | undefined;
    };
    receivers: SessionReceiver[];
    context?: Array<Message | Task> | undefined;
    createdAt: string;
}
export interface ToolDescriptor {
    toolId: string;
    toolName: string;
    toolDescription: string;
    toolVersion: string;
    toolInputParam: JsonObject;
    toolOutputParam: JsonObject;
    metadata?: JsonObject | undefined;
}
export interface ToolRequestData {
    requestType: 1 | 2;
    timestamp?: string | number | undefined;
    toolRequestList?: string[] | undefined;
}
export interface ToolSyncData {
    syncType: 1 | 2;
    timestamp?: string | number | undefined;
    toolSyncList: ToolDescriptor[];
}
export interface ToolUpdateData {
    syncType: 2;
    timestamp?: string | number | undefined;
    toolUpdateList: Pick<ToolDescriptor, "toolId" | "toolName" | "toolDescription" | "toolVersion">[];
}
export interface ToolInvokeItem {
    toolId: string;
    toolVersion: string;
    toolInputParam: JsonObject;
}
export interface ToolInvokeRequest {
    sessionId: string | number;
    timestamp?: string | number | undefined;
    toolInvokeList: ToolInvokeItem[];
}
export interface ToolResultItem {
    toolId: string;
    toolVersion: string;
    toolOutputParam?: JsonObject | undefined;
    statusCode: string | number;
    ok: boolean;
    error?: string | undefined;
}
export interface ToolInvokeResult {
    sessionId: string | number;
    timestamp?: string | number | undefined;
    toolResultList: ToolResultItem[];
}
//# sourceMappingURL=types.d.ts.map