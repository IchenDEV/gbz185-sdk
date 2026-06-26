import { assertAgentDescription } from "./validation.js";
import { randomUUID } from "node:crypto";
export class InMemoryDescriptionStore {
    records = new Map();
    async save(record) {
        this.records.set(record.description.agentId, record);
    }
    async get(agentId) {
        return this.records.get(agentId);
    }
    async list() {
        return [...this.records.values()];
    }
}
export class AgentDescriptionRegistry {
    store;
    constructor(store = new InMemoryDescriptionStore()) {
        this.store = store;
    }
    async register(description) {
        assertAgentDescription(description);
        const now = new Date().toISOString();
        const record = {
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
    async review(agentId, review) {
        const record = await this.requireRecord(agentId);
        const updated = {
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
    async issuePublicationCertificate(agentId, input) {
        const record = await this.requireRecord(agentId);
        const certificate = {
            certificateId: randomUUID(),
            agentId,
            issuedAt: new Date().toISOString(),
            ...input
        };
        await this.store.save({ ...record, publicationCertificate: certificate, updatedAt: new Date().toISOString() });
        return certificate;
    }
    async publish(agentId, publication) {
        const record = await this.requireRecord(agentId);
        if (record.status === "revoked") {
            throw new Error(`Cannot publish revoked agent description: ${agentId}`);
        }
        const updated = {
            ...record,
            status: "published",
            published: true,
            publication,
            updatedAt: new Date().toISOString()
        };
        await this.store.save(updated);
        return updated;
    }
    async change(agentId, patch) {
        const record = await this.requireRecord(agentId);
        if (record.status === "revoked") {
            throw new Error(`Cannot change revoked agent description: ${agentId}`);
        }
        const description = { ...record.description, ...patch, agentId };
        assertAgentDescription(description);
        const updated = {
            ...record,
            description,
            updatedAt: new Date().toISOString()
        };
        await this.store.save(updated);
        return updated;
    }
    async unpublish(agentId) {
        const record = await this.requireRecord(agentId);
        const updated = {
            ...record,
            status: "unpublished",
            published: false,
            description: { ...record.description, available: false },
            updatedAt: new Date().toISOString()
        };
        await this.store.save(updated);
        return updated;
    }
    async revoke(agentId, reason) {
        const record = await this.requireRecord(agentId);
        const now = new Date().toISOString();
        const updated = {
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
    async get(agentId) {
        return this.store.get(agentId);
    }
    async list(options = {}) {
        const records = await this.store.list();
        return options.publishedOnly ? records.filter((record) => record.published) : records;
    }
    async requireRecord(agentId) {
        const record = await this.store.get(agentId);
        if (!record) {
            throw new Error(`Agent description not found: ${agentId}`);
        }
        return record;
    }
}
//# sourceMappingURL=description-registry.js.map