import type { AgentDescription, JsonObject, SkillDescription, ToolDescriptor } from "./types.js";
export interface ValidationResult {
    ok: boolean;
    errors: string[];
}
export declare function isJsonObject(value: unknown): value is JsonObject;
export declare function validateSkillDescription(skill: SkillDescription, path?: string): ValidationResult;
export declare function validateAgentDescription(description: AgentDescription): ValidationResult;
export declare function assertAgentDescription(description: AgentDescription): void;
export declare function validateToolDescriptor(tool: ToolDescriptor): ValidationResult;
export declare function assertToolDescriptor(tool: ToolDescriptor): void;
//# sourceMappingURL=validation.d.ts.map