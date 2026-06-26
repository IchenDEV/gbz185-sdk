export type Gbz185Domain = "agent" | "management_service" | "interconnection_service" | "resource_access";
export interface Gbz185FunctionDescriptor {
    id: string;
    domain: Gbz185Domain;
    name: string;
    sdkSurface: string;
    standardPart: string;
}
export interface Gbz185FraiInterfaceDescriptor {
    id: `FRAI-${string}`;
    standardPart: string;
    functionA: string;
    functionB: string;
    sdkSurface: string;
}
export declare const GBZ185_FUNCTIONS: Gbz185FunctionDescriptor[];
export declare const GBZ185_FRAI_INTERFACES: Gbz185FraiInterfaceDescriptor[];
//# sourceMappingURL=functional-architecture.d.ts.map