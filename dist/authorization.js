import { createProcessCredentialPackage } from "./credentials.js";
export class InterconnectionAuthorizationRuntime {
    verifier;
    constructor(verifier) {
        this.verifier = verifier;
    }
    createPresentation(input) {
        return createProcessCredentialPackage(input);
    }
    async authenticatePeer(pkg, policy) {
        const assertion = await this.verifier.verifyPresentation({
            package: pkg,
            expectedAudience: policy.expectedAudience,
            requiredScope: policy.requiredScope
        });
        return this.authorizeAssertion(assertion, policy);
    }
    authorizeAssertion(assertion, policy) {
        if (assertion.result === "success") {
            return { allowed: true, assertion };
        }
        if (assertion.result === "needs_more_verification" && policy.allowNeedsMoreVerification) {
            return { allowed: true, assertion, reason: "Allowed by policy with additional verification required" };
        }
        return { allowed: false, assertion, reason: assertion.reason ?? "Authentication failed" };
    }
    async mutualAuthenticate(input) {
        const requester = await this.authenticatePeer(input.requesterPackage, input.requesterPolicy);
        const service = await this.authenticatePeer(input.servicePackage, input.servicePolicy);
        return {
            requester,
            service,
            allowed: requester.allowed && service.allowed
        };
    }
}
//# sourceMappingURL=authorization.js.map