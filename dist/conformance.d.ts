export type ConformanceStatus = "covered" | "covered_by_reference_runtime" | "extension_point";
export interface Gbz185ConformanceItem {
    part: "GB/Z 185.1" | "GB/Z 185.2" | "GB/Z 185.3" | "GB/Z 185.4" | "GB/Z 185.5" | "GB/Z 185.6" | "GB/Z 185.7";
    clause: string;
    topic: string;
    status: ConformanceStatus;
    sdkSurface: string[];
    notes: string;
}
export declare const GBZ185_CONFORMANCE_MATRIX: Gbz185ConformanceItem[];
//# sourceMappingURL=conformance.d.ts.map