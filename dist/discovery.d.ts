import type { AgentDescription, DiscoveryQuery, DiscoveryResult } from "./types.js";
import type { AgentDescriptionRegistry } from "./description-registry.js";
export declare class PresetDiscoverySource {
    private readonly descriptions;
    constructor(descriptions?: AgentDescription[]);
    list(): Promise<AgentDescription[]>;
}
export declare class DiscoveryService {
    private readonly registry;
    private readonly presetSources;
    constructor(registry: AgentDescriptionRegistry, presetSources?: PresetDiscoverySource[]);
    discover(query: DiscoveryQuery): Promise<DiscoveryResult[]>;
}
//# sourceMappingURL=discovery.d.ts.map