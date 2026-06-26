import type { AgentIdentityCode, JsonObject, JsonValue } from "./types.js";
export type CredentialLifecycleStatus = "active" | "locked" | "revoked";
export type AuthenticationResult = "success" | "failed" | "needs_more_verification";
export interface AgentCredential {
    credentialId: string;
    agentId: AgentIdentityCode;
    issuerId: string;
    subject: string;
    publicKeyPem: string;
    certificatePem?: string | undefined;
    certificateChainPem?: string[] | undefined;
    audience?: string[] | undefined;
    scope: string[];
    issuedAt: string;
    expiresAt: string;
    metadata?: JsonObject | undefined;
}
export interface IssueCredentialInput {
    agentId: AgentIdentityCode;
    subject: string;
    issuerId?: string | undefined;
    audience?: string[] | undefined;
    scope?: string[] | undefined;
    expiresAt?: string | undefined;
    metadata?: JsonObject | undefined;
}
export interface IssuedCredential {
    credential: AgentCredential;
    privateKeyPem: string;
}
export interface ProcessCredentialPackage {
    credential: AgentCredential;
    audience: string;
    scope: string[];
    nonce?: string | undefined;
    timestamp: string;
    payload?: JsonValue | undefined;
    signature: string;
}
export interface CreatePresentationInput {
    credential: AgentCredential;
    privateKeyPem: string;
    audience: string;
    scope: string[];
    nonce?: string | undefined;
    timestamp?: string | undefined;
    payload?: JsonValue | undefined;
}
export interface VerifyPresentationInput {
    package: ProcessCredentialPackage;
    expectedAudience: string;
    requiredScope?: string[] | undefined;
    now?: Date | undefined;
}
export interface AuthenticationAssertion {
    assertionId: string;
    result: AuthenticationResult;
    agentId?: AgentIdentityCode | undefined;
    credentialId?: string | undefined;
    verifiedAt: string;
    reason?: string | undefined;
    verifiedAttributes?: JsonObject | undefined;
    policyAdvice?: JsonObject | undefined;
}
export interface CredentialStatusStore {
    getStatus(credentialId: string): Promise<CredentialLifecycleStatus | undefined>;
    setStatus(credentialId: string, status: CredentialLifecycleStatus, reason?: string | undefined): Promise<void>;
}
export interface CertificateChainVerifier {
    verifyCertificateChain(credential: AgentCredential, now?: Date): Promise<{
        ok: boolean;
        reason?: string | undefined;
    }>;
}
export interface CredentialIssuer {
    issueCredential(input: IssueCredentialInput): Promise<IssuedCredential>;
    updateCredential(credentialId: string, patch: Partial<Pick<AgentCredential, "audience" | "scope" | "expiresAt" | "metadata">>): Promise<AgentCredential>;
    lockCredential(credentialId: string, reason?: string | undefined): Promise<void>;
    unlockCredential(credentialId: string, reason?: string | undefined): Promise<void>;
    revokeCredential(credentialId: string, reason?: string | undefined): Promise<void>;
    getCredential(credentialId: string): Promise<AgentCredential | undefined>;
}
export interface CredentialVerifier {
    verifyPresentation(input: VerifyPresentationInput): Promise<AuthenticationAssertion>;
}
export declare class InMemoryCredentialStatusStore implements CredentialStatusStore {
    private statuses;
    getStatus(credentialId: string): Promise<CredentialLifecycleStatus | undefined>;
    setStatus(credentialId: string, status: CredentialLifecycleStatus, reason?: string | undefined): Promise<void>;
}
export declare class InMemoryCredentialRepository {
    private credentials;
    save(credential: AgentCredential): Promise<void>;
    get(credentialId: string): Promise<AgentCredential | undefined>;
    listByAgent(agentId: AgentIdentityCode): Promise<AgentCredential[]>;
}
export declare class NodeX509CertificateChainVerifier implements CertificateChainVerifier {
    verifyCertificateChain(credential: AgentCredential, now?: Date): Promise<{
        ok: boolean;
        reason?: string | undefined;
    }>;
}
export declare class DevelopmentCredentialIssuer implements CredentialIssuer {
    private readonly repository;
    private readonly statusStore;
    private readonly issuerId;
    constructor(repository?: InMemoryCredentialRepository, statusStore?: CredentialStatusStore, issuerId?: string);
    issueCredential(input: IssueCredentialInput): Promise<IssuedCredential>;
    updateCredential(credentialId: string, patch: Partial<Pick<AgentCredential, "audience" | "scope" | "expiresAt" | "metadata">>): Promise<AgentCredential>;
    lockCredential(credentialId: string, reason?: string | undefined): Promise<void>;
    unlockCredential(credentialId: string, reason?: string | undefined): Promise<void>;
    revokeCredential(credentialId: string, reason?: string | undefined): Promise<void>;
    getCredential(credentialId: string): Promise<AgentCredential | undefined>;
    private requireCredential;
}
export declare class DevelopmentCredentialVerifier implements CredentialVerifier {
    private readonly statusStore;
    private readonly chainVerifier;
    constructor(statusStore?: CredentialStatusStore, chainVerifier?: CertificateChainVerifier);
    verifyPresentation(input: VerifyPresentationInput): Promise<AuthenticationAssertion>;
}
export declare function createProcessCredentialPackage(input: CreatePresentationInput): ProcessCredentialPackage;
export declare function canonicalJson(value: JsonValue | JsonObject | unknown): string;
//# sourceMappingURL=credentials.d.ts.map