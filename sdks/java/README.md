# gbz185-sdk Java

Java client SDK for GB/Z 185-2026 agent interconnection JSON operations.

```xml
<dependency>
  <groupId>dev.idevlab</groupId>
  <artifactId>gbz185-sdk</artifactId>
  <version>0.1.0</version>
</dependency>
```

Local verification:

```bash
mvn test
```

The Java SDK targets Java 17, uses Jackson for JSON, and exposes the same operation names as the TypeScript SDK through `JsonTransport`.
