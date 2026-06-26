import { createProcessCredentialPackage, type AuthenticationAssertion, type CredentialVerifier, type CreatePresentationInput, type ProcessCredentialPackage } from "./credentials.js";
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

export class InterconnectionAuthorizationRuntime {
  constructor(private readonly verifier: CredentialVerifier) {}

  createPresentation(input: CreatePresentationInput): ProcessCredentialPackage {
    return createProcessCredentialPackage(input);
  }

  async authenticatePeer(pkg: ProcessCredentialPackage, policy: AuthorizationPolicy): Promise<AuthorizationDecision> {
    const assertion = await this.verifier.verifyPresentation({
      package: pkg,
      expectedAudience: policy.expectedAudience,
      requiredScope: policy.requiredScope
    });
    return this.authorizeAssertion(assertion, policy);
  }

  authorizeAssertion(assertion: AuthenticationAssertion, policy: AuthorizationPolicy): AuthorizationDecision {
    if (assertion.result === "success") {
      return { allowed: true, assertion };
    }
    if (assertion.result === "needs_more_verification" && policy.allowNeedsMoreVerification) {
      return { allowed: true, assertion, reason: "Allowed by policy with additional verification required" };
    }
    return { allowed: false, assertion, reason: assertion.reason ?? "Authentication failed" };
  }

  async mutualAuthenticate(input: {
    requesterPackage: ProcessCredentialPackage;
    requesterPolicy: AuthorizationPolicy;
    servicePackage: ProcessCredentialPackage;
    servicePolicy: AuthorizationPolicy;
  }): Promise<MutualAuthenticationResult> {
    const requester = await this.authenticatePeer(input.requesterPackage, input.requesterPolicy);
    const service = await this.authenticatePeer(input.servicePackage, input.servicePolicy);
    return {
      requester,
      service,
      allowed: requester.allowed && service.allowed
    };
  }
}
