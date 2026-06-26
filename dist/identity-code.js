export const AGENT_IDENTITY_CODE_OID = "1.2.156.3088";
export const CURRENT_IDENTITY_CODE_VERSION = "1";
const NODE_RE = /^[0-9A-Z]+$/i;
function validateNode(value, name, maxLength) {
    if (!value || value.length > maxLength || !NODE_RE.test(value)) {
        throw new Error(`${name} must be 1-${maxLength} base36 characters`);
    }
}
export function formatIdentityCode(parts) {
    const normalized = {
        oid: parts.oid ?? AGENT_IDENTITY_CODE_OID,
        version: parts.version ?? CURRENT_IDENTITY_CODE_VERSION,
        registrationServiceProvider: parts.registrationServiceProvider.toUpperCase(),
        registrationRequester: parts.registrationRequester.toUpperCase(),
        ontologySerial: parts.ontologySerial.toUpperCase(),
        instanceSerial: parts.instanceSerial.toUpperCase()
    };
    validateIdentityCodeParts(normalized);
    return [
        normalized.oid,
        normalized.version,
        normalized.registrationServiceProvider,
        normalized.registrationRequester,
        normalized.ontologySerial,
        normalized.instanceSerial
    ].join(".");
}
export function parseIdentityCode(code) {
    const segments = code.split(".");
    if (segments.length !== 9) {
        throw new Error("Agent identity code must contain 9 dot-separated segments");
    }
    const oid = segments.slice(0, 4).join(".");
    if (oid !== AGENT_IDENTITY_CODE_OID) {
        throw new Error(`Unsupported agent identity code OID: ${oid}`);
    }
    const [version, registrationServiceProvider, registrationRequester, ontologySerial, instanceSerial] = segments.slice(4);
    if (!version || version !== CURRENT_IDENTITY_CODE_VERSION) {
        throw new Error(`Unsupported agent identity code version: ${version ?? ""}`);
    }
    if (!registrationServiceProvider || !registrationRequester || !ontologySerial || !instanceSerial) {
        throw new Error("Agent identity code is missing one or more required nodes");
    }
    const parts = {
        oid: AGENT_IDENTITY_CODE_OID,
        version: CURRENT_IDENTITY_CODE_VERSION,
        registrationServiceProvider: registrationServiceProvider.toUpperCase(),
        registrationRequester: registrationRequester.toUpperCase(),
        ontologySerial: ontologySerial.toUpperCase(),
        instanceSerial: instanceSerial.toUpperCase()
    };
    validateIdentityCodeParts(parts);
    return parts;
}
export function validateIdentityCode(code) {
    try {
        parseIdentityCode(code);
        return true;
    }
    catch {
        return false;
    }
}
export function validateIdentityCodeParts(parts) {
    if (parts.oid !== AGENT_IDENTITY_CODE_OID) {
        throw new Error(`Agent identity code OID must be ${AGENT_IDENTITY_CODE_OID}`);
    }
    if (parts.version !== CURRENT_IDENTITY_CODE_VERSION) {
        throw new Error(`Agent identity code version must be ${CURRENT_IDENTITY_CODE_VERSION}`);
    }
    validateNode(parts.registrationServiceProvider, "registrationServiceProvider", 6);
    validateNode(parts.registrationRequester, "registrationRequester", 6);
    validateNode(parts.ontologySerial, "ontologySerial", 9);
    validateNode(parts.instanceSerial, "instanceSerial", 9);
}
//# sourceMappingURL=identity-code.js.map