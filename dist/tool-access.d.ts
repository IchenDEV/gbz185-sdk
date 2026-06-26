import type { ToolRuntime } from "./tools.js";
import type { ToolInvokeRequest, ToolInvokeResult, ToolSyncData, ToolUpdateData } from "./types.js";
export declare class ToolAccessRuntime {
    private readonly toolService;
    constructor(toolService: ToolRuntime);
    getToolList(toolRequestList?: string[]): Promise<ToolSyncData>;
    syncToolUpdates(): Promise<ToolUpdateData>;
    invokeTools(request: ToolInvokeRequest): Promise<ToolInvokeResult>;
    invokeUntilComplete(input: {
        initialRequest: ToolInvokeRequest;
        isComplete: (result: ToolInvokeResult, round: number) => boolean;
        nextRequest: (result: ToolInvokeResult, round: number) => ToolInvokeRequest;
        maxRounds?: number | undefined;
    }): Promise<ToolInvokeResult[]>;
}
//# sourceMappingURL=tool-access.d.ts.map