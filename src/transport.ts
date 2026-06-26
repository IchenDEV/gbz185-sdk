export interface JsonTransport {
  request<TRequest = unknown, TResponse = unknown>(operation: string, payload: TRequest): Promise<TResponse>;
}

export type JsonOperationHandler<TRequest = unknown, TResponse = unknown> = (payload: TRequest) => Promise<TResponse> | TResponse;

export class InProcessJsonTransport implements JsonTransport {
  private handlers = new Map<string, JsonOperationHandler>();

  register<TRequest = unknown, TResponse = unknown>(operation: string, handler: JsonOperationHandler<TRequest, TResponse>): void {
    this.handlers.set(operation, handler as JsonOperationHandler);
  }

  async request<TRequest = unknown, TResponse = unknown>(operation: string, payload: TRequest): Promise<TResponse> {
    const handler = this.handlers.get(operation);
    if (!handler) {
      throw new Error(`No JSON transport handler registered for operation: ${operation}`);
    }
    return handler(payload) as Promise<TResponse>;
  }
}

export interface HttpJsonTransportOptions {
  endpoint: string;
  fetchImpl?: typeof fetch;
  headers?: Record<string, string>;
}

export class HttpJsonTransport implements JsonTransport {
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly options: HttpJsonTransportOptions) {
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async request<TRequest = unknown, TResponse = unknown>(operation: string, payload: TRequest): Promise<TResponse> {
    const response = await this.fetchImpl(this.options.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(this.options.headers ?? {})
      },
      body: JSON.stringify({ operation, payload })
    });
    if (!response.ok) {
      throw new Error(`HTTP JSON transport failed: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as TResponse;
  }
}
