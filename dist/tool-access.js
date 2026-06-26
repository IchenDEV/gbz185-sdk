export class ToolAccessRuntime {
    toolService;
    constructor(toolService) {
        this.toolService = toolService;
    }
    async getToolList(toolRequestList) {
        return this.toolService.listTools(toolRequestList);
    }
    async syncToolUpdates() {
        return this.toolService.getUpdates();
    }
    async invokeTools(request) {
        return this.toolService.invoke(request);
    }
    async invokeUntilComplete(input) {
        const maxRounds = input.maxRounds ?? 8;
        const results = [];
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
//# sourceMappingURL=tool-access.js.map