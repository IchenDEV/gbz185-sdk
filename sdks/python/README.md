# gbz185-sdk Python

Python client SDK for GB/Z 185-2026 agent interconnection JSON operations.

```bash
python -m pip install gbz185-sdk
```

Local development:

```bash
python -m unittest discover -s tests
```

The Python SDK intentionally follows the same operation names as the TypeScript package:

- `identity.register`
- `description.publish`
- `discovery.discover`
- `interaction.createSession`
- `interaction.distributeMessage`
- `tool.invoke`

Use `InProcessJsonTransport` for tests and `HttpJsonTransport` for a JSON gateway that accepts `{ "operation": "...", "payload": ... }`.
