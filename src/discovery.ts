import type { AgentDescription, DiscoveryQuery, DiscoveryResult } from "./types.js";
import type { AgentDescriptionRegistry } from "./description-registry.js";

export class PresetDiscoverySource {
  constructor(private readonly descriptions: AgentDescription[] = []) {}

  async list(): Promise<AgentDescription[]> {
    return this.descriptions;
  }
}

export class DiscoveryService {
  constructor(
    private readonly registry: AgentDescriptionRegistry,
    private readonly presetSources: PresetDiscoverySource[] = []
  ) {}

  async discover(query: DiscoveryQuery): Promise<DiscoveryResult[]> {
    const published = (await this.registry.list({ publishedOnly: true })).map((record) => record.description);
    const presets = (await Promise.all(this.presetSources.map((source) => source.list()))).flat();
    const byId = new Map<string, AgentDescription>();
    for (const description of [...published, ...presets]) {
      byId.set(description.agentId, description);
    }

    const results = [...byId.values()]
      .map((description) => scoreDescription(description, query))
      .filter((result): result is DiscoveryResult => result !== undefined)
      .sort((left, right) => right.score - left.score || left.description.name.localeCompare(right.description.name));

    return typeof query.limit === "number" ? results.slice(0, query.limit) : results;
  }
}

function scoreDescription(description: AgentDescription, query: DiscoveryQuery): DiscoveryResult | undefined {
  if (!query.includeUndiscoverable && description.discoverable === false) {
    return undefined;
  }
  if (query.requireAvailable && description.available === false) {
    return undefined;
  }
  if (query.agentId && description.agentId !== query.agentId) {
    return undefined;
  }

  let score = 0;
  const matchedBy: string[] = [];
  const haystack = [
    description.name,
    description.alias ?? "",
    description.description,
    ...description.skills.flatMap((skill) => [skill.skillName, skill.skillDescription, ...skill.tags])
  ].join(" ").toLowerCase();

  if (query.name) {
    const name = query.name.toLowerCase();
    if (!description.name.toLowerCase().includes(name) && !description.alias?.toLowerCase().includes(name)) {
      return undefined;
    }
    score += 20;
    matchedBy.push("name");
  }

  if (query.text) {
    const terms = query.text.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = terms.filter((term) => haystack.includes(term));
    if (matches.length === 0) {
      return undefined;
    }
    score += matches.length * 10;
    matchedBy.push("text");
  }

  if (query.requiredSkills?.length) {
    const skillIds = new Set(description.skills.map((skill) => skill.skillId));
    const skillNames = new Set(description.skills.map((skill) => skill.skillName.toLowerCase()));
    if (!query.requiredSkills.every((skill) => skillIds.has(skill) || skillNames.has(skill.toLowerCase()))) {
      return undefined;
    }
    score += query.requiredSkills.length * 15;
    matchedBy.push("requiredSkills");
  }

  if (query.tags?.length) {
    const tags = new Set(description.skills.flatMap((skill) => skill.tags.map((tag) => tag.toLowerCase())));
    if (!query.tags.every((tag) => tags.has(tag.toLowerCase()))) {
      return undefined;
    }
    score += query.tags.length * 8;
    matchedBy.push("tags");
  }

  if (query.inputTypes?.length) {
    const supported = new Set(description.defaultInputTypes.map((type) => type.toLowerCase()));
    if (!query.inputTypes.every((type) => supported.has(type.toLowerCase()))) {
      return undefined;
    }
    score += query.inputTypes.length * 5;
    matchedBy.push("inputTypes");
  }

  if (query.outputTypes?.length) {
    const supported = new Set(description.defaultOutputTypes.map((type) => type.toLowerCase()));
    if (!query.outputTypes.every((type) => supported.has(type.toLowerCase()))) {
      return undefined;
    }
    score += query.outputTypes.length * 5;
    matchedBy.push("outputTypes");
  }

  if (matchedBy.length === 0) {
    score = 1;
    matchedBy.push("all");
  }
  return { description, score, matchedBy };
}
