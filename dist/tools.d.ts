import type { JsonObject, ToolDescriptor, ToolInvokeItem, ToolInvokeRequest, ToolInvokeResult, ToolSyncData, ToolUpdateData } from "./types.js";
export type ToolHandler = (input: JsonObject, context: {
    sessionId: string | number;
    item: ToolInvokeItem;
}) => Promise<JsonObject> | JsonObject;
export interface RegisteredTool {
    descriptor: ToolDescriptor;
    handler: ToolHandler;
}
export declare class ToolRuntime {
    private tools;
    private updatedTools;
    registerTool(descriptor: ToolDescriptor, handler: ToolHandler): Promise<ToolDescriptor>;
    listTools(requestedToolIds?: string[]): Promise<ToolSyncData>;
    getUpdates(): Promise<ToolUpdateData>;
    invoke(request: ToolInvokeRequest): Promise<ToolInvokeResult>;
}
//# sourceMappingURL=tools.d.ts.map