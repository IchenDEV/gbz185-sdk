import { assertToolDescriptor } from "./validation.js";
import type { JsonObject, ToolDescriptor, ToolInvokeItem, ToolInvokeRequest, ToolInvokeResult, ToolResultItem, ToolSyncData, ToolUpdateData } from "./types.js";

export type ToolHandler = (input: JsonObject, context: { sessionId: string | number; item: ToolInvokeItem }) => Promise<JsonObject> | JsonObject;

export interface RegisteredTool {
  descriptor: ToolDescriptor;
  handler: ToolHandler;
}

export class ToolRuntime {
  private tools = new Map<string, RegisteredTool>();
  private updatedTools = new Set<string>();

  async registerTool(descriptor: ToolDescriptor, handler: ToolHandler): Promise<ToolDescriptor> {
    assertToolDescriptor(descriptor);
    this.tools.set(toolKey(descriptor.toolId, descriptor.toolVersion), { descriptor, handler });
    this.updatedTools.add(descriptor.toolId);
    return descriptor;
  }

  async listTools(requestedToolIds?: string[]): Promise<ToolSyncData> {
    const requested = requestedToolIds ? new Set(requestedToolIds) : undefined;
    return {
      syncType: requested ? 2 : 1,
      timestamp: Date.now(),
      toolSyncList: [...this.tools.values()]
        .map((tool) => tool.descriptor)
        .filter((descriptor) => !requested || requested.has(descriptor.toolId))
    };
  }

  async getUpdates(): Promise<ToolUpdateData> {
    const updateIds = new Set(this.updatedTools);
    this.updatedTools.clear();
    return {
      syncType: 2,
      timestamp: Date.now(),
      toolUpdateList: [...this.tools.values()]
        .map((tool) => tool.descriptor)
        .filter((descriptor) => updateIds.has(descriptor.toolId))
        .map(({ toolId, toolName, toolDescription, toolVersion }) => ({ toolId, toolName, toolDescription, toolVersion }))
    };
  }

  async invoke(request: ToolInvokeRequest): Promise<ToolInvokeResult> {
    const results: ToolResultItem[] = [];
    for (const item of request.toolInvokeList) {
      const registered = this.tools.get(toolKey(item.toolId, item.toolVersion));
      if (!registered) {
        results.push({
          toolId: item.toolId,
          toolVersion: item.toolVersion,
          statusCode: "TOOL_NOT_FOUND",
          ok: false,
          error: `Tool not found: ${item.toolId}@${item.toolVersion}`
        });
        continue;
      }

      try {
        const output = await registered.handler(item.toolInputParam, { sessionId: request.sessionId, item });
        results.push({
          toolId: item.toolId,
          toolVersion: item.toolVersion,
          toolOutputParam: output,
          statusCode: 0,
          ok: true
        });
      } catch (error) {
        results.push({
          toolId: item.toolId,
          toolVersion: item.toolVersion,
          statusCode: "TOOL_EXECUTION_FAILED",
          ok: false,
          error: (error as Error).message
        });
      }
    }

    return {
      sessionId: request.sessionId,
      timestamp: request.timestamp ?? Date.now(),
      toolResultList: results
    };
  }
}

function toolKey(toolId: string, version: string): string {
  return `${toolId}@${version}`;
}
