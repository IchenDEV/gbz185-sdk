import { type AuthenticationAssertion, type CredentialVerifier, type CreatePresentationInput, type ProcessCredentialPackage } from "./credentials.js";
import type { JsonObject } from "./types.js";
export interface AuthorizationPolicy {
    expectedAudience: string;
    requiredScope?: string[] | undefined;
    allowNeedsMoreVerification?: boolean | undefined;
    metadata?: JsonObject | undefined;
}
export interface AuthorizationDecision {
    allowed: boolean;
    assertion: AuthenticationAssertion;
    reason?: string | undefined;
}
export interface MutualAuthenticationResult {
    requester: AuthorizationDecision;
    service: AuthorizationDecision;
    allowed: boolean;
}
export declare class InterconnectionAuthorizationRuntime {
    private readonly verifier;
    constructor(verifier: CredentialVerifier);
    createPresentation(input: CreatePresentationInput): ProcessCredentialPackage;
    authenticatePeer(pkg: ProcessCredentialPackage, policy: AuthorizationPolicy): Promise<AuthorizationDecision>;
    authorizeAssertion(assertion: AuthenticationAssertion, policy: AuthorizationPolicy): AuthorizationDecision;
    mutualAuthenticate(input: {
        requesterPackage: ProcessCredentialPackage;
        requesterPolicy: AuthorizationPolicy;
        servicePackage: ProcessCredentialPackage;
        servicePolicy: AuthorizationPolicy;
    }): Promise<MutualAuthenticationResult>;
}
//# sourceMappingURL=authorization.d.ts.map