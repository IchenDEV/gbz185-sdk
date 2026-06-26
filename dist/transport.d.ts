export interface JsonTransport {
    request<TRequest = unknown, TResponse = unknown>(operation: string, payload: TRequest): Promise<TResponse>;
}
export type JsonOperationHandler<TRequest = unknown, TResponse = unknown> = (payload: TRequest) => Promise<TResponse> | TResponse;
export declare class InProcessJsonTransport implements JsonTransport {
    private handlers;
    register<TRequest = unknown, TResponse = unknown>(operation: string, handler: JsonOperationHandler<TRequest, TResponse>): void;
    request<TRequest = unknown, TResponse = unknown>(operation: string, payload: TRequest): Promise<TResponse>;
}
export interface HttpJsonTransportOptions {
    endpoint: string;
    fetchImpl?: typeof fetch;
    headers?: Record<string, string>;
}
export declare class HttpJsonTransport implements JsonTransport {
    private readonly options;
    private readonly fetchImpl;
    constructor(options: HttpJsonTransportOptions);
    request<TRequest = unknown, TResponse = unknown>(operation: string, payload: TRequest): Promise<TResponse>;
}
//# sourceMappingURL=transport.d.ts.map