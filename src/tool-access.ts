import type { ToolRuntime } from "./tools.js";
import type { ToolInvokeRequest, ToolInvokeResult, ToolSyncData, ToolUpdateData } from "./types.js";

export class ToolAccessRuntime {
  constructor(private readonly toolService: ToolRuntime) {}

  async getToolList(toolRequestList?: string[]): Promise<ToolSyncData> {
    return this.toolService.listTools(toolRequestList);
  }

  async syncToolUpdates(): Promise<ToolUpdateData> {
    return this.toolService.getUpdates();
  }

  async invokeTools(request: ToolInvokeRequest): Promise<ToolInvokeResult> {
    return this.toolService.invoke(request);
  }

  async invokeUntilComplete(input: {
    initialRequest: ToolInvokeRequest;
    isComplete: (result: ToolInvokeResult, round: number) => boolean;
    nextRequest: (result: ToolInvokeResult, round: number) => ToolInvokeRequest;
    maxRounds?: number | undefined;
  }): Promise<ToolInvokeResult[]> {
    const maxRounds = input.maxRounds ?? 8;
    const results: ToolInvokeResult[] = [];
    let request = input.initialRequest;
    for (let round = 0; round < maxRounds; round += 1) {
      const result = await this.invokeTools(request);
      results.push(result);
      if (input.isComplete(result, round)) {
        return results;
      }
      request = input.nextRequest(result, round);
    }
    return results;
  }
}
