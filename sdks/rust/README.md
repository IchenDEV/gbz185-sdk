# gbz185-sdk Rust

Rust client SDK for GB/Z 185-2026 agent interconnection JSON operations.

```toml
[dependencies]
gbz185-sdk = "0.1.0"
```

Local verification:

```bash
cargo test
```

The crate exposes identity-code helpers, conformance constants, an in-process JSON transport, an HTTP JSON transport, and a client surface aligned with the TypeScript SDK operation names.
