import type { AgentDescription, AgentIdentityCode } from "./types.js";
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
export declare class InMemoryDescriptionStore implements DescriptionStore {
    private records;
    save(record: DescriptionRecord): Promise<void>;
    get(agentId: AgentIdentityCode): Promise<DescriptionRecord | undefined>;
    list(): Promise<DescriptionRecord[]>;
}
export declare class AgentDescriptionRegistry {
    private readonly store;
    constructor(store?: DescriptionStore);
    register(description: AgentDescription): Promise<DescriptionRecord>;
    review(agentId: AgentIdentityCode, review: Omit<DescriptionReview, "reviewId" | "createdAt">): Promise<DescriptionRecord>;
    issuePublicationCertificate(agentId: AgentIdentityCode, input: Omit<PublicationCertificate, "certificateId" | "agentId" | "issuedAt">): Promise<PublicationCertificate>;
    publish(agentId: AgentIdentityCode, publication?: PublicationRequestInfo): Promise<DescriptionRecord>;
    change(agentId: AgentIdentityCode, patch: Partial<AgentDescription>): Promise<DescriptionRecord>;
    unpublish(agentId: AgentIdentityCode): Promise<DescriptionRecord>;
    revoke(agentId: AgentIdentityCode, reason?: string): Promise<DescriptionRecord>;
    get(agentId: AgentIdentityCode): Promise<DescriptionRecord | undefined>;
    list(options?: {
        publishedOnly?: boolean;
    }): Promise<DescriptionRecord[]>;
    private requireRecord;
}
//# sourceMappingURL=description-registry.d.ts.map