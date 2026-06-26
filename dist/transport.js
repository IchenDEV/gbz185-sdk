export class InProcessJsonTransport {
    handlers = new Map();
    register(operation, handler) {
        this.handlers.set(operation, handler);
    }
    async request(operation, payload) {
        const handler = this.handlers.get(operation);
        if (!handler) {
            throw new Error(`No JSON transport handler registered for operation: ${operation}`);
        }
        return handler(payload);
    }
}
export class HttpJsonTransport {
    options;
    fetchImpl;
    constructor(options) {
        this.options = options;
        this.fetchImpl = options.fetchImpl ?? fetch;
    }
    async request(operation, payload) {
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
        return (await response.json());
    }
}
//# sourceMappingURL=transport.js.map