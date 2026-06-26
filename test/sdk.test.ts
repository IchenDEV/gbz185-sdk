import { describe, expect, it } from "vitest";
import {
  AgentDescriptionRegistry,
  DevelopmentCredentialIssuer,
  DevelopmentCredentialVerifier,
  DiscoveryService,
  GBZ185_CONFORMANCE_MATRIX,
  GBZ185_FRAI_INTERFACES,
  GBZ185_FUNCTIONS,
  InMemoryCredentialRepository,
  InMemoryCredentialStatusStore,
  InterconnectionAuthorizationRuntime,
  InteractionRuntime,
  MessageDistributionRuntime,
  ToolAccessRuntime,
  ToolRuntime,
  assertAgentDescription,
  createAgentInterconnectRuntime,
  createProcessCredentialPackage,
  formatIdentityCode,
  parseIdentityCode,
  validateIdentityCode
} from "../src/index.js";
import type { AgentDescription, ToolDescriptor } from "../src/index.js";

const requesterId = formatIdentityCode({
  registrationServiceProvider: "A1",
  registrationRequester: "B2",
  ontologySerial: "C3",
  instanceSerial: "0"
});

const serviceId = formatIdentityCode({
  registrationServiceProvider: "A1",
  registrationRequester: "B2",
  ontologySerial: "CAL001",
  instanceSerial: "1"
});

function calendarDescription(overrides: Partial<AgentDescription> = {}): AgentDescription {
  return {
    agentId: serviceId,
    name: "Calendar Agent",
    version: "1.0.0",
    description: "Creates and queries calendar schedules",
    provider: "Example Provider",
    accessAddress: "local://calendar",
    accessMethod: [{ type: "url", address: "local://calendar" }],
    authentication: { type: "x509" },
    capabilities: { sse: false, asyncMessages: true },
    defaultInputTypes: ["text"],
    defaultOutputTypes: ["text", "json"],
    discoverable: true,
    available: true,
    skills: [
      {
        skillId: "schedule.add",
        skillName: "add_schedule",
        skillDescription: "Add a calendar schedule",
        tags: ["calendar", "schedule"],
        examples: ["Add meeting tomorrow at 10"],
        inputTypes: ["text", "json"],
        outputTypes: ["json"]
      }
    ],
    ...overrides
  };
}

describe("identity code", () => {
  it("parses and validates GB/Z 185 identity codes", () => {
    const code = formatIdentityCode({
      registrationServiceProvider: "abc123",
      registrationRequester: "req001",
      ontologySerial: "bot000001",
      instanceSerial: "0"
    });

    expect(code).toBe("1.2.156.3088.1.ABC123.REQ001.BOT000001.0");
    expect(validateIdentityCode(code)).toBe(true);
    expect(parseIdentityCode(code).registrationRequester).toBe("REQ001");
  });

  it("rejects malformed identity codes", () => {
    expect(validateIdentityCode("1.2.156.3088.2.A.B.C.0")).toBe(false);
    expect(validateIdentityCode("1.2.156.3088.1.A.B.C")).toBe(false);
    expect(() =>
      formatIdentityCode({
        registrationServiceProvider: "bad!",
        registrationRequester: "B",
        ontologySerial: "C",
        instanceSerial: "0"
      })
    ).toThrow(/base36/);
  });
});

describe("description and discovery", () => {
  it("validates required description and skill fields", () => {
    expect(() => assertAgentDescription(calendarDescription({ skills: [] }))).toThrow(/skills/);
    expect(() => assertAgentDescription(calendarDescription())).not.toThrow();
  });

  it("discovers published and discoverable agents by text, tags, and IO types", async () => {
    const registry = new AgentDescriptionRegistry();
    const discoverable = await registry.register(calendarDescription());
    await registry.publish(discoverable.description.agentId);

    const hidden = await registry.register(
      calendarDescription({
        agentId: formatIdentityCode({
          registrationServiceProvider: "A1",
          registrationRequester: "B2",
          ontologySerial: "HIDDEN",
          instanceSerial: "1"
        }),
        name: "Hidden Calendar Agent",
        discoverable: false
      })
    );
    await registry.publish(hidden.description.agentId);

    const discovery = new DiscoveryService(registry);
    const results = await discovery.discover({
      text: "calendar schedule",
      tags: ["calendar"],
      inputTypes: ["text"],
      outputTypes: ["json"],
      requireAvailable: true
    });

    expect(results).toHaveLength(1);
    expect(results[0]?.description.agentId).toBe(serviceId);

    const empty = await discovery.discover({ text: "weather" });
    expect(empty).toEqual([]);
  });

  it("covers review, publication certificates, unpublish, and revocation lifecycle", async () => {
    const registry = new AgentDescriptionRegistry();
    await registry.register(calendarDescription());
    const reviewed = await registry.review(serviceId, {
      reviewerId: "reviewer-1",
      approved: true,
      riskLevel: "low"
    });
    expect(reviewed.reviews?.[0]?.approved).toBe(true);

    const certificate = await registry.issuePublicationCertificate(serviceId, {
      issuer: "description-manager",
      publicKeyDigest: "sha256:test"
    });
    expect(certificate.agentId).toBe(serviceId);

    const published = await registry.publish(serviceId, { regions: ["CN"], openBeta: true });
    expect(published.status).toBe("published");
    expect((await registry.list({ publishedOnly: true }))).toHaveLength(1);

    const unpublished = await registry.unpublish(serviceId);
    expect(unpublished.status).toBe("unpublished");
    expect((await registry.list({ publishedOnly: true }))).toHaveLength(0);

    const revoked = await registry.revoke(serviceId, "retired");
    expect(revoked.status).toBe("revoked");
    expect(revoked.description.discoverable).toBe(false);
  });
});

describe("interaction runtime", () => {
  it("creates sessions, tasks, chunked messages, and final results", async () => {
    const runtime = new InteractionRuntime();
    const session = await runtime.createSession({
      mode: "group",
      sender: { agentId: requesterId },
      receivers: [{ agentId: serviceId, mode: "group" }]
    });
    const task = await runtime.submitTask({ sessionId: session.id });
    await runtime.updateTaskState(task.id, "in_progress");

    await runtime.sendMessage({
      senderRole: "service",
      senderId: serviceId,
      sessionId: session.id,
      taskId: task.id,
      artifact: "work_result",
      chunkIndex: 0,
      lastChunk: false,
      dataItems: [{ type: "text/plain", metadata: { encoding: "utf-8" }, payload: "partial" }]
    });
    await runtime.sendMessage({
      senderRole: "service",
      senderId: serviceId,
      sessionId: session.id,
      taskId: task.id,
      artifact: "work_result",
      final: true,
      chunkIndex: 1,
      lastChunk: true,
      dataItems: [{ type: "application/json", metadata: {}, payload: { ok: true } }]
    });

    const messages = await runtime.listMessages(session.id);
    expect(messages).toHaveLength(2);
    expect(messages[1]?.final).toBe(true);
    expect((await runtime.getTask(task.id))?.messages).toHaveLength(2);
  });

  it("distributes group messages to all recipients except sender", async () => {
    const runtime = new InteractionRuntime();
    const distribution = new MessageDistributionRuntime(runtime);
    const otherServiceId = formatIdentityCode({
      registrationServiceProvider: "A1",
      registrationRequester: "B2",
      ontologySerial: "CAL002",
      instanceSerial: "1"
    });
    const session = await runtime.createSession({
      mode: "group",
      sender: { agentId: requesterId },
      receivers: [
        { agentId: serviceId, mode: "group" },
        { agentId: otherServiceId, mode: "group" }
      ]
    });

    const receipts = await distribution.distribute({
      senderRole: "requester",
      senderId: requesterId,
      sessionId: session.id,
      dataItems: [{ type: "text/plain", metadata: {}, payload: "hello group" }]
    });

    expect(receipts.map((receipt) => receipt.recipientId).sort()).toEqual([otherServiceId, serviceId].sort());
    expect(await distribution.listInbox(serviceId)).toHaveLength(1);
  });
});

describe("tool runtime", () => {
  it("lists, updates, invokes, and reports tool failures", async () => {
    const runtime = new ToolRuntime();
    const descriptor: ToolDescriptor = {
      toolId: "calendar.add",
      toolName: "add_schedule",
      toolDescription: "Add a schedule item",
      toolVersion: "1.0.0",
      toolInputParam: { date: "string", time: "string", event: "string" },
      toolOutputParam: { eventId: "string" }
    };
    await runtime.registerTool(descriptor, (input) => ({ eventId: `${input.date}-${input.time}` }));

    expect((await runtime.listTools()).toolSyncList).toHaveLength(1);
    expect((await runtime.getUpdates()).toolUpdateList).toHaveLength(1);

    const result = await runtime.invoke({
      sessionId: "session-1",
      toolInvokeList: [
        { toolId: "calendar.add", toolVersion: "1.0.0", toolInputParam: { date: "2026-06-26", time: "10:00", event: "meeting" } },
        { toolId: "missing", toolVersion: "1.0.0", toolInputParam: {} }
      ]
    });

    expect(result.toolResultList[0]?.ok).toBe(true);
    expect(result.toolResultList[1]?.statusCode).toBe("TOOL_NOT_FOUND");
  });

  it("exposes tool access facade and repeated invocation flow", async () => {
    const runtime = new ToolRuntime();
    const access = new ToolAccessRuntime(runtime);
    await runtime.registerTool(
      {
        toolId: "counter",
        toolName: "counter",
        toolDescription: "Increment a counter",
        toolVersion: "1.0.0",
        toolInputParam: { count: "number" },
        toolOutputParam: { count: "number" }
      },
      (input) => ({ count: Number(input.count ?? 0) + 1 })
    );

    expect((await access.getToolList()).toolSyncList).toHaveLength(1);
    expect((await access.syncToolUpdates()).toolUpdateList).toHaveLength(1);
    const rounds = await access.invokeUntilComplete({
      initialRequest: {
        sessionId: "session-counter",
        toolInvokeList: [{ toolId: "counter", toolVersion: "1.0.0", toolInputParam: { count: 0 } }]
      },
      isComplete: (result) => Number(result.toolResultList[0]?.toolOutputParam?.count ?? 0) >= 2,
      nextRequest: (result) => ({
        sessionId: "session-counter",
        toolInvokeList: [
          {
            toolId: "counter",
            toolVersion: "1.0.0",
            toolInputParam: { count: Number(result.toolResultList[0]?.toolOutputParam?.count ?? 0) }
          }
        ]
      }),
      maxRounds: 3
    });
    expect(rounds).toHaveLength(2);
  });
});

describe("credential verification", () => {
  async function makeCredential(expiresAt?: string) {
    const repository = new InMemoryCredentialRepository();
    const statusStore = new InMemoryCredentialStatusStore();
    const issuer = new DevelopmentCredentialIssuer(repository, statusStore);
    const verifier = new DevelopmentCredentialVerifier(statusStore);
    const issued = await issuer.issueCredential({
      agentId: requesterId,
      subject: "Requester Agent",
      audience: ["service-agent"],
      scope: ["agent:interact", "tool:invoke"],
      expiresAt
    });
    return { issuer, verifier, issued };
  }

  it("accepts valid process credential packages", async () => {
    const { verifier, issued } = await makeCredential();
    const pkg = createProcessCredentialPackage({
      credential: issued.credential,
      privateKeyPem: issued.privateKeyPem,
      audience: "service-agent",
      scope: ["agent:interact"],
      payload: { action: "connect" }
    });

    const assertion = await verifier.verifyPresentation({
      package: pkg,
      expectedAudience: "service-agent",
      requiredScope: ["agent:interact"]
    });

    expect(assertion.result).toBe("success");
  });

  it("authorizes peer presentations through the interconnection authorization runtime", async () => {
    const { verifier, issued } = await makeCredential();
    const auth = new InterconnectionAuthorizationRuntime(verifier);
    const pkg = auth.createPresentation({
      credential: issued.credential,
      privateKeyPem: issued.privateKeyPem,
      audience: "service-agent",
      scope: ["agent:interact"]
    });

    const decision = await auth.authenticatePeer(pkg, {
      expectedAudience: "service-agent",
      requiredScope: ["agent:interact"]
    });

    expect(decision.allowed).toBe(true);
  });

  it("rejects expired, locked, audience-mismatched, and tampered credentials", async () => {
    const expired = await makeCredential("2020-01-01T00:00:00.000Z");
    const expiredPackage = createProcessCredentialPackage({
      credential: expired.issued.credential,
      privateKeyPem: expired.issued.privateKeyPem,
      audience: "service-agent",
      scope: ["agent:interact"]
    });
    expect((await expired.verifier.verifyPresentation({ package: expiredPackage, expectedAudience: "service-agent" })).result).toBe("failed");

    const locked = await makeCredential();
    await locked.issuer.lockCredential(locked.issued.credential.credentialId);
    const lockedPackage = createProcessCredentialPackage({
      credential: locked.issued.credential,
      privateKeyPem: locked.issued.privateKeyPem,
      audience: "service-agent",
      scope: ["agent:interact"]
    });
    expect((await locked.verifier.verifyPresentation({ package: lockedPackage, expectedAudience: "service-agent" })).reason).toMatch(/locked/);

    const audience = await makeCredential();
    const audiencePackage = createProcessCredentialPackage({
      credential: audience.issued.credential,
      privateKeyPem: audience.issued.privateKeyPem,
      audience: "other-service",
      scope: ["agent:interact"]
    });
    expect((await audience.verifier.verifyPresentation({ package: audiencePackage, expectedAudience: "service-agent" })).reason).toMatch(/audience/);

    const tampered = await makeCredential();
    const tamperedPackage = createProcessCredentialPackage({
      credential: tampered.issued.credential,
      privateKeyPem: tampered.issued.privateKeyPem,
      audience: "service-agent",
      scope: ["agent:interact"],
      payload: { action: "connect" }
    });
    const tamperedAssertion = await tampered.verifier.verifyPresentation({
      package: { ...tamperedPackage, payload: { action: "escalate" } },
      expectedAudience: "service-agent",
      requiredScope: ["agent:interact"]
    });
    expect(tamperedAssertion.reason).toMatch(/signature/);
  });
});

describe("GB/Z 185 function coverage", () => {
  it("exports all reference architecture functions and FRAI interfaces", () => {
    expect(GBZ185_FUNCTIONS.map((item) => item.id)).toEqual([
      "agent.identityMaintenance",
      "agent.descriptionMaintenance",
      "agent.interconnectionAuthorization",
      "agent.interaction",
      "agent.toolAccess",
      "management.identityManagement",
      "management.credentialManagement",
      "management.identityAuthentication",
      "interconnection.descriptionManagement",
      "interconnection.discovery",
      "interconnection.messageDistribution",
      "resource.toolService"
    ]);
    expect(GBZ185_FRAI_INTERFACES.map((item) => item.id)).toEqual([
      "FRAI-01",
      "FRAI-02",
      "FRAI-03",
      "FRAI-04",
      "FRAI-05",
      "FRAI-06",
      "FRAI-07",
      "FRAI-08",
      "FRAI-09",
      "FRAI-10"
    ]);
  });

  it("exports a conformance matrix covering all seven GB/Z 185 parts", () => {
    expect(new Set(GBZ185_CONFORMANCE_MATRIX.map((item) => item.part))).toEqual(
      new Set(["GB/Z 185.1", "GB/Z 185.2", "GB/Z 185.3", "GB/Z 185.4", "GB/Z 185.5", "GB/Z 185.6", "GB/Z 185.7"])
    );
    expect(GBZ185_CONFORMANCE_MATRIX).toHaveLength(24);
    expect(GBZ185_CONFORMANCE_MATRIX.every((item) => item.sdkSurface.length > 0)).toBe(true);
    expect(GBZ185_CONFORMANCE_MATRIX.some((item) => item.status === "extension_point")).toBe(true);
    expect(GBZ185_CONFORMANCE_MATRIX.map((item) => item.status)).not.toContain("missing");
  });
});

describe("end-to-end runtime smoke test", () => {
  it("registers, publishes, discovers, interacts, invokes a calendar tool, and returns task output", async () => {
    const runtime = createAgentInterconnectRuntime();
    const registration = await runtime.client.registerIdentity({
      delegatorId: "org-1",
      subject: "Calendar Agent",
      registrationServiceProvider: "A1",
      registrationRequester: "B2",
      ontologySerial: "CAL001",
      instanceSerial: "1",
      issueCredential: true,
      credentialAudience: ["requester-agent"],
      credentialScope: ["agent:interact", "tool:invoke"]
    });

    await runtime.client.registerDescription(calendarDescription({ agentId: registration.account.id }));
    await runtime.client.publishDescription(registration.account.id);
    await runtime.toolRuntime.registerTool(
      {
        toolId: "calendar.add",
        toolName: "add_schedule",
        toolDescription: "Add a schedule item",
        toolVersion: "1.0.0",
        toolInputParam: { date: "string", time: "string", event: "string" },
        toolOutputParam: { eventId: "string" }
      },
      (input) => ({ eventId: `evt-${input.date}-${input.time}` })
    );

    const discovered = await runtime.client.discover({ text: "calendar", requiredSkills: ["schedule.add"] });
    expect(discovered).toHaveLength(1);

    const session = await runtime.client.createSession({
      mode: "point_to_point",
      sender: { agentId: requesterId },
      receivers: [{ agentId: registration.account.id, mode: "point_to_point" }]
    });
    const task = await runtime.client.submitTask({ sessionId: session.id });
    const toolResult = await runtime.client.invokeTools({
      sessionId: session.id,
      toolInvokeList: [
        {
          toolId: "calendar.add",
          toolVersion: "1.0.0",
          toolInputParam: { date: "2026-06-26", time: "10:00", event: "GB/Z 185 review" }
        }
      ]
    });
    const message = await runtime.client.sendMessage({
      senderRole: "service",
      senderId: registration.account.id,
      sessionId: session.id,
      taskId: task.id,
      artifact: "work_result",
      final: true,
      lastChunk: true,
      dataItems: [{ type: "application/json", metadata: {}, payload: toolResult.toolResultList[0] ?? null }]
    });

    expect(message.final).toBe(true);
    expect(toolResult.toolResultList[0]?.ok).toBe(true);
  });

  it("links identity revocation to credential revocation through the complete runtime", async () => {
    const runtime = createAgentInterconnectRuntime();
    const registration = await runtime.client.registerIdentity({
      delegatorId: "org-2",
      subject: "Revocable Agent",
      registrationServiceProvider: "A1",
      registrationRequester: "B2",
      ontologySerial: "REV001",
      instanceSerial: "1",
      issueCredential: true,
      credentialAudience: ["service-agent"],
      credentialScope: ["agent:interact"]
    });
    const credential = registration.issuedCredential?.credential;
    expect(credential).toBeDefined();
    await runtime.client.revokeIdentity(registration.account.id, "retired");
    const pkg = createProcessCredentialPackage({
      credential: credential!,
      privateKeyPem: registration.issuedCredential!.privateKeyPem,
      audience: "service-agent",
      scope: ["agent:interact"]
    });
    const assertion = await runtime.credentials.verifier.verifyPresentation({
      package: pkg,
      expectedAudience: "service-agent",
      requiredScope: ["agent:interact"]
    });
    expect(assertion.reason).toMatch(/revoked/);
  });
});
