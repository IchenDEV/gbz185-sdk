import type { AgentIdentityCode, AgentIdentityCodeParts } from "./types.js";
export declare const AGENT_IDENTITY_CODE_OID: "1.2.156.3088";
export declare const CURRENT_IDENTITY_CODE_VERSION: "1";
export declare function formatIdentityCode(parts: Omit<AgentIdentityCodeParts, "oid" | "version"> & Partial<Pick<AgentIdentityCodeParts, "oid" | "version">>): AgentIdentityCode;
export declare function parseIdentityCode(code: AgentIdentityCode): AgentIdentityCodeParts;
export declare function validateIdentityCode(code: AgentIdentityCode): boolean;
export declare function validateIdentityCodeParts(parts: AgentIdentityCodeParts): void;
//# sourceMappingURL=identity-code.d.ts.map