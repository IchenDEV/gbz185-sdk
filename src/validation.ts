import { validateIdentityCode } from "./identity-code.js";
import type { AgentDescription, JsonObject, SkillDescription, ToolDescriptor } from "./types.js";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, path: string, errors: string[]): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${path} must be a non-empty string`);
  }
}

function requiredStringArray(value: unknown, path: string, errors: string[]): void {
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== "string" || item.trim().length === 0)) {
    errors.push(`${path} must be a non-empty string array`);
  }
}

export function validateSkillDescription(skill: SkillDescription, path = "skill"): ValidationResult {
  const errors: string[] = [];
  requiredString(skill.skillId, `${path}.skillId`, errors);
  requiredString(skill.skillName, `${path}.skillName`, errors);
  requiredString(skill.skillDescription, `${path}.skillDescription`, errors);
  requiredStringArray(skill.tags, `${path}.tags`, errors);
  requiredStringArray(skill.inputTypes, `${path}.inputTypes`, errors);
  requiredStringArray(skill.outputTypes, `${path}.outputTypes`, errors);
  if (skill.examples !== undefined) {
    requiredStringArray(skill.examples, `${path}.examples`, errors);
  }
  if (skill.dependencies !== undefined && (!Array.isArray(skill.dependencies) || skill.dependencies.some((item) => !isJsonObject(item)))) {
    errors.push(`${path}.dependencies must be an array of JSON objects`);
  }
  return { ok: errors.length === 0, errors };
}

export function validateAgentDescription(description: AgentDescription): ValidationResult {
  const errors: string[] = [];
  if (!validateIdentityCode(description.agentId)) {
    errors.push("agentId must be a valid GB/Z 185 identity code");
  }
  requiredString(description.name, "name", errors);
  requiredString(description.version, "version", errors);
  requiredString(description.description, "description", errors);
  if (!(typeof description.provider === "string" && description.provider.trim()) && !isJsonObject(description.provider)) {
    errors.push("provider must be a non-empty string or JSON object");
  }
  if (!isJsonObject(description.capabilities)) {
    errors.push("capabilities must be a JSON object");
  }
  requiredStringArray(description.defaultInputTypes, "defaultInputTypes", errors);
  requiredStringArray(description.defaultOutputTypes, "defaultOutputTypes", errors);
  if (!Array.isArray(description.skills) || description.skills.length === 0) {
    errors.push("skills must contain at least one skill");
  } else {
    for (const [index, skill] of description.skills.entries()) {
      errors.push(...validateSkillDescription(skill, `skills[${index}]`).errors);
    }
  }
  if (description.accessMethod !== undefined) {
    if (!Array.isArray(description.accessMethod)) {
      errors.push("accessMethod must be an array");
    } else {
      for (const [index, method] of description.accessMethod.entries()) {
        requiredString(method.type, `accessMethod[${index}].type`, errors);
        requiredString(method.address, `accessMethod[${index}].address`, errors);
      }
    }
  }
  return { ok: errors.length === 0, errors };
}

export function assertAgentDescription(description: AgentDescription): void {
  const result = validateAgentDescription(description);
  if (!result.ok) {
    throw new Error(`Invalid agent description: ${result.errors.join("; ")}`);
  }
}

export function validateToolDescriptor(tool: ToolDescriptor): ValidationResult {
  const errors: string[] = [];
  requiredString(tool.toolId, "toolId", errors);
  requiredString(tool.toolName, "toolName", errors);
  requiredString(tool.toolDescription, "toolDescription", errors);
  requiredString(tool.toolVersion, "toolVersion", errors);
  if (!isJsonObject(tool.toolInputParam)) {
    errors.push("toolInputParam must be a JSON object");
  }
  if (!isJsonObject(tool.toolOutputParam)) {
    errors.push("toolOutputParam must be a JSON object");
  }
  return { ok: errors.length === 0, errors };
}

export function assertToolDescriptor(tool: ToolDescriptor): void {
  const result = validateToolDescriptor(tool);
  if (!result.ok) {
    throw new Error(`Invalid tool descriptor: ${result.errors.join("; ")}`);
  }
}
