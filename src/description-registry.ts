import { assertAgentDescription } from "./validation.js";
import type { AgentDescription, AgentIdentityCode } from "./types.js";
import { randomUUID } from "node:crypto";

export type DescriptionStatus = "registered" | "published" | "unpublished" | "revoked";

export interface DescriptionReview {
  reviewId: string;
  reviewerId: string;
  approved: boolean;
  reason?: string | undefined;
  riskLevel?: "low" | "medium" | "high" | undefined;
  createdAt: string;
}

export interface PublicationRequestInfo {
  regions?: string[] | undefined;
  openBeta?: boolean | undefined;
  paid?: boolean | undefined;
  permissionRequirements?: string[] | undefined;
  copyrightCertificate?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
}

export interface PublicationCertificate {
  certificateId: string;
  agentId: AgentIdentityCode;
  issuer: string;
  issuedAt: string;
  publicKeyDigest?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
}

export interface DescriptionRecord {
  description: AgentDescription;
  status: DescriptionStatus;
  published: boolean;
  reviews?: DescriptionReview[] | undefined;
  publication?: PublicationRequestInfo | undefined;
  publicationCertificate?: PublicationCertificate | undefined;
  revokedAt?: string | undefined;
  revokeReason?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface DescriptionStore {
  save(record: DescriptionRecord): Promise<void>;
  get(agentId: AgentIdentityCode): Promise<DescriptionRecord | undefined>;
  list(): Promise<DescriptionRecord[]>;
}

export class InMemoryDescriptionStore implements DescriptionStore {
  private records = new Map<AgentIdentityCode, DescriptionRecord>();

  async save(record: DescriptionRecord): Promise<void> {
    this.records.set(record.description.agentId, record);
  }

  async get(agentId: AgentIdentityCode): Promise<DescriptionRecord | undefined> {
    return this.records.get(agentId);
  }

  async list(): Promise<DescriptionRecord[]> {
    return [...this.records.values()];
  }
}

export class AgentDescriptionRegistry {
  constructor(private readonly store: DescriptionStore = new InMemoryDescriptionStore()) {}

  async register(description: AgentDescription): Promise<DescriptionRecord> {
    assertAgentDescription(description);
    const now = new Date().toISOString();
    const record: DescriptionRecord = {
      description: {
        ...description,
        discoverable: description.discoverable ?? true,
        available: description.available ?? true
      },
      status: "registered",
      published: false,
      createdAt: now,
      updatedAt: now
    };
    await this.store.save(record);
    return record;
  }

  async review(agentId: AgentIdentityCode, review: Omit<DescriptionReview, "reviewId" | "createdAt">): Promise<DescriptionRecord> {
    const record = await this.requireRecord(agentId);
    const updated: DescriptionRecord = {
      ...record,
      reviews: [
        ...(record.reviews ?? []),
        {
          reviewId: randomUUID(),
          createdAt: new Date().toISOString(),
          ...review
        }
      ],
      updatedAt: new Date().toISOString()
    };
    await this.store.save(updated);
    return updated;
  }

  async issuePublicationCertificate(
    agentId: AgentIdentityCode,
    input: Omit<PublicationCertificate, "certificateId" | "agentId" | "issuedAt">
  ): Promise<PublicationCertificate> {
    const record = await this.requireRecord(agentId);
    const certificate: PublicationCertificate = {
      certificateId: randomUUID(),
      agentId,
      issuedAt: new Date().toISOString(),
      ...input
    };
    await this.store.save({ ...record, publicationCertificate: certificate, updatedAt: new Date().toISOString() });
    return certificate;
  }

  async publish(agentId: AgentIdentityCode, publication?: PublicationRequestInfo): Promise<DescriptionRecord> {
    const record = await this.requireRecord(agentId);
    if (record.status === "revoked") {
      throw new Error(`Cannot publish revoked agent description: ${agentId}`);
    }
    const updated: DescriptionRecord = {
      ...record,
      status: "published",
      published: true,
      publication,
      updatedAt: new Date().toISOString()
    };
    await this.store.save(updated);
    return updated;
  }

  async change(agentId: AgentIdentityCode, patch: Partial<AgentDescription>): Promise<DescriptionRecord> {
    const record = await this.requireRecord(agentId);
    if (record.status === "revoked") {
      throw new Error(`Cannot change revoked agent description: ${agentId}`);
    }
    const description: AgentDescription = { ...record.description, ...patch, agentId };
    assertAgentDescription(description);
    const updated: DescriptionRecord = {
      ...record,
      description,
      updatedAt: new Date().toISOString()
    };
    await this.store.save(updated);
    return updated;
  }

  async unpublish(agentId: AgentIdentityCode): Promise<DescriptionRecord> {
    const record = await this.requireRecord(agentId);
    const updated: DescriptionRecord = {
      ...record,
      status: "unpublished",
      published: false,
      description: { ...record.description, available: false },
      updatedAt: new Date().toISOString()
    };
    await this.store.save(updated);
    return updated;
  }

  async revoke(agentId: AgentIdentityCode, reason?: string): Promise<DescriptionRecord> {
    const record = await this.requireRecord(agentId);
    const now = new Date().toISOString();
    const updated: DescriptionRecord = {
      ...record,
      status: "revoked",
      published: false,
      description: { ...record.description, discoverable: false, available: false },
      revokedAt: now,
      revokeReason: reason,
      updatedAt: now
    };
    await this.store.save(updated);
    return updated;
  }

  async get(agentId: AgentIdentityCode): Promise<DescriptionRecord | undefined> {
    return this.store.get(agentId);
  }

  async list(options: { publishedOnly?: boolean } = {}): Promise<DescriptionRecord[]> {
    const records = await this.store.list();
    return options.publishedOnly ? records.filter((record) => record.published) : records;
  }

  private async requireRecord(agentId: AgentIdentityCode): Promise<DescriptionRecord> {
    const record = await this.store.get(agentId);
    if (!record) {
      throw new Error(`Agent description not found: ${agentId}`);
    }
    return record;
  }
}
