const STORAGE_KEYS = {
  language: "gbz185-sdk:language",
  sdkLanguage: "gbz185-sdk:sdk-language",
  theme: "gbz185-sdk:theme"
};

const PAGE_META = {
  "index.html": {
    zh: {
      title: "gbz185-sdk | 开发者文档",
      description: "GB/Z 185-2026 智能体互联 TypeScript SDK 开发者文档"
    },
    en: {
      title: "gbz185-sdk | Developer Docs",
      description: "Developer documentation for the GB/Z 185-2026 agent interconnection TypeScript SDK."
    }
  },
  "setup.html": {
    zh: { title: "Setup | gbz185-sdk", description: "gbz185-sdk 安装、TypeScript 配置和生产接入边界。" },
    en: { title: "Setup | gbz185-sdk", description: "Installation, TypeScript configuration, and production integration boundaries for gbz185-sdk." }
  },
  "getting-started.html": {
    zh: { title: "Get Started | gbz185-sdk", description: "用日历智能体跑通 GB/Z 185 SDK 核心链路。" },
    en: { title: "Get Started | gbz185-sdk", description: "Run the core GB/Z 185 SDK flow with a calendar agent example." }
  },
  "api.html": {
    zh: { title: "API Reference | gbz185-sdk", description: "gbz185-sdk 公开 API、接口、模型和运行时参考。" },
    en: { title: "API Reference | gbz185-sdk", description: "Reference for the public APIs, interfaces, models, and runtimes in gbz185-sdk." }
  },
  "examples.html": {
    zh: { title: "Examples | gbz185-sdk", description: "gbz185-sdk 端到端、身份、鉴别、HTTP、群组和工具调用示例。" },
    en: { title: "Examples | gbz185-sdk", description: "End-to-end, identity, authentication, HTTP, group messaging, and tool invocation examples for gbz185-sdk." }
  },
  "conformance.html": {
    zh: { title: "国标对照 | gbz185-sdk", description: "GB/Z 185.1-185.7 标准功能与 gbz185-sdk API 对照矩阵。" },
    en: { title: "Conformance | gbz185-sdk", description: "GB/Z 185.1-185.7 function and API conformance matrix for gbz185-sdk." }
  }
};

const ZH_TO_EN = {
  "跳到主要内容": "Skip to main content",
  "。": ".",
  "，": ", ",
  "；": "; ",
  "：": ":",
  "国标对照": "Conformance",
  "GB/Z 185 智能体互联 SDK 开发者文档": "GB/Z 185 Agent Interconnection SDK Developer Docs",
  "这里就是开发者使用": "This is the main documentation entry for developers using",
  "的主文档入口：从安装、初始化、端到端运行，到每个公开 API、接口、类型和示例，全部可以在网页内直接查到。": " for installation, initialization, end-to-end runs, and every public API, interface, type, and example directly on this site.",
  "跑通第一个智能体": "Run your first agent",
  "查看完整 API": "View the full API",
  "确认 Node.js、pnpm、TypeScript ESM 设置，选择 GitHub 安装、workspace 本地安装或源码开发方式。": "Check Node.js, pnpm, and TypeScript ESM settings, then choose GitHub install, local workspace install, or source development.",
  "进入 Setup": "Open Setup",
  "按身份注册、描述发布、发现、会话、任务、工具调用的顺序跑通完整链路。": "Walk through identity registration, description publication, discovery, session, task, and tool invocation in order.",
  "进入快速开始": "Open Get Started",
  "每个函数、类、接口、输入输出模型都有签名、用途、入参、返回值和注意事项。": "Every function, class, interface, and input/output model includes its signature, purpose, parameters, return value, and notes.",
  "进入 API Reference": "Open API Reference",
  "4. 语言示例切换": "4. Language Example Switcher",
  "Python、Go、Rust、Java 和 TypeScript 的安装、客户端、传输、工具调用和发布边界统一放在这里。": "Installation, clients, transports, tool invocation, and release boundaries for Python, Go, Rust, Java, and TypeScript are collected here.",
  "TypeScript SDK 当前为 Beta；Python、Go、Rust、Java SDK 当前为 Alpha 实验中。安装、客户端、传输和工具调用统一放在这里。": "The TypeScript SDK is currently Beta; the Python, Go, Rust, and Java SDKs are currently Alpha experimental. Installation, clients, transport, and tool invocation are collected here.",
  "Setup、Get Started、API Reference 和 Examples 都内置 TypeScript、Python、Go、Rust、Java 的示例版本，不需要跳到单独页面。": "Setup, Get Started, API Reference, and Examples all include TypeScript, Python, Go, Rust, and Java example variants, so developers do not need a separate page.",
  "查看语言示例": "View Language Examples",
  "SDK 覆盖哪些运行链路": "Runtime Flows Covered by the SDK",
  "链路": "Flow",
  "关键 API": "Key APIs",
  "开发者拿它做什么": "What developers use it for",
  "身份码": "Identity Code",
  "生成、解析和校验 GB/Z 185.2 结构的智能体身份码。": "Generate, parse, and validate agent identity codes that follow the GB/Z 185.2 structure.",
  "身份与凭证": "Identity and Credentials",
  "注册身份账户、发行开发凭证、验证过程凭证包、处理锁定和注销。": "Register identity accounts, issue development credentials, verify process credential packages, and handle lock/revoke flows.",
  "描述与发现": "Description and Discovery",
  "发布智能体描述，并按名称、自然语言、技能、标签、IO 类型和可用性查找。": "Publish agent descriptions and find them by name, natural language, skills, tags, IO types, and availability.",
  "交互与消息": "Interaction and Messages",
  "创建点对点、群组、混合会话，提交任务，发送分块消息和最终结果。": "Create point-to-point, group, and hybrid sessions, submit tasks, and send chunked messages and final results.",
  "工具调用": "Tool Invocation",
  "注册工具、同步工具列表、批量调用工具，并返回成功或失败状态。": "Register tools, sync tool lists, invoke tools in batches, and return success or failure status per item.",
  "传输适配": "Transport Adapter",
  "用统一 JSON operation 连接本地运行时、HTTP 服务或未来 MCP/WebSocket 适配器。": "Connect the local runtime, HTTP services, or future MCP/WebSocket adapters through one JSON operation model.",
  "适合首版集成的场景": "Good First Integrations",
  "在应用内验证 GB/Z 185 智能体互联流程。": "Validate the GB/Z 185 agent interconnection flow inside an application.",
  "给现有智能体补身份码、描述、发现和工具调用表面。": "Add identity codes, descriptions, discovery, and tool invocation surfaces to existing agents.",
  "用内存运行时写集成测试或协议实验。": "Use the in-memory runtime for integration tests or protocol experiments.",
  "用": "Use",
  "对接自己的 HTTP、WebSocket、消息队列或网关。": "to connect your own HTTP, WebSocket, message queue, or gateway.",
  "明确边界": "Explicit Boundaries",
  "内置凭证实现是开发参考，不宣称生产 CA 或国密合规。": "The built-in credential implementation is a development reference, not a production CA or GM/T compliance claim.",
  "存储默认是内存实现，生产环境应替换为数据库或状态服务。": "Storage defaults to in-memory implementations; production should replace them with databases or state services.",
  "SDK 不规定 REST 路径、MCP 方法名或 WebSocket 消息格式。": "The SDK does not prescribe REST paths, MCP method names, or WebSocket message formats.",
  "GUI/LUI 是应用层能力，SDK 提供可调用的客户端和模型。": "GUI/LUI is an application-layer concern; the SDK provides callable clients and models.",

  "运行环境": "Runtime Requirements",
  "安装方式": "Installation",
  "TypeScript 配置": "TypeScript Configuration",
  "验证安装": "Verify the Install",
  "选择运行方式": "Choose a Runtime Mode",
  "生产接入边界": "Production Integration Boundary",
  "这页解决“怎么把 SDK 放进项目、怎么配置、怎么确认它能跑”的问题。后面的 Get Started 和 Examples 都假设这里已经完成。": "This page answers how to add the SDK to a project, configure it, and confirm it runs. Get Started and Examples assume this setup is complete.",
  "依赖": "Dependency",
  "要求": "Requirement",
  "说明": "Description",
  "npm 包使用 ESM，并在开发凭证实现里使用 Node.js": "The npm package uses ESM, and the development credential implementation uses Node.js",
  "客户端 SDK 以": "The client SDK is imported as",
  "包导入，当前推荐 GitHub subdirectory 或本地路径安装。": "and currently recommends GitHub subdirectory or local path installation.",
  "模块路径是": "The module path is",
  "，业务包导入": ", and application code imports",
  "当前 crate 适合本地 path dependency 或企业私有 registry 试用。": "The current crate is suitable for local path dependencies or trials through a private enterprise registry.",
  "artifact 为": "The artifact is",
  "，客户端返回 Jackson": ", and the client returns Jackson",
  "仓库开发脚本以": "Repository development scripts use",
  "驱动主包；各语言 SDK 使用自己的生态工具验证。": "to drive the main package; each language SDK is verified with its own ecosystem tools.",
  "SDK 使用 ESM，并在开发凭证实现里使用 Node.js": "The SDK uses ESM and the development credential implementation uses Node.js",
  "包内类型随": "Package types ship with",
  "发布。": ".",
  "包管理器": "Package Manager",
  "仓库开发脚本用": "Repository scripts use",
  "；消费 SDK 不强制包管理器。": "; SDK consumers can use any package manager.",
  "模块系统": "Module System",
  "的": "'s",
  "是": "is",
  "从 GitHub 安装": "Install from GitHub",
  "当前仓库已经包含构建后的": "The repository already contains built",
  "，可以直接作为 GitHub package 依赖使用。": ", so it can be consumed directly as a GitHub package dependency.",
  "在本地 workspace 使用": "Use in a Local Workspace",
  "如果你的应用和 SDK 在同一台机器上开发，可以先构建 SDK，再从本地路径安装。": "If your application and the SDK are developed on the same machine, build the SDK first and install it from a local path.",
  "直接开发 SDK": "Develop the SDK Directly",
  "推荐你的应用使用 ESM 或支持 ESM 依赖解析的构建器。最小配置如下。": "Use ESM or a bundler that can resolve ESM dependencies. This is the minimal configuration.",
  "如果使用 Vite、Next.js、tsup 或其他 bundler，也可以使用": "When using Vite, Next.js, tsup, or another bundler, you can also use",
  "，只要运行环境能消费 ESM。": "as long as the runtime can consume ESM.",
  "新建一个": "Create a",
  "或 TypeScript 文件，确认 SDK 可以被导入、身份码可以生成、运行时可以创建。": "or TypeScript file to confirm the SDK imports, identity codes can be generated, and the runtime can be created.",
  "方式": "Mode",
  "入口": "Entry",
  "适合场景": "Best For",
  "内存参考运行时": "In-memory reference runtime",
  "本地开发、测试、协议演示、示例应用。": "Local development, tests, protocol demos, and sample applications.",
  "自定义进程内操作": "Custom in-process operations",
  "你已经有自己的服务对象，只想复用 SDK client。": "You already have service objects and only want to reuse the SDK client.",
  "HTTP JSON 网关": "HTTP JSON gateway",
  "把 SDK client 接到一个统一 HTTP endpoint，由服务端按": "Connect the SDK client to one HTTP endpoint, then route by",
  "路由。": "on the server.",
  "自定义网络协议": "Custom network protocol",
  "WebSocket、MCP、消息队列、RPC 网关或企业内部总线。": "WebSocket, MCP, message queue, RPC gateway, or enterprise bus.",
  "内置凭证实现只用于开发验证。": "The built-in credential implementation is for development validation only.",
  "它使用 Node.js Ed25519 key pair 模拟凭证签发和验签，并提供 X.509-first 的接口形态；它不是生产 CA、国密算法或主管部门合规实现。": "It uses Node.js Ed25519 key pairs to simulate credential issuance and verification and exposes X.509-first interfaces; it is not a production CA, GM/T algorithm, or regulator-approved implementation.",
  "生产环境建议替换以下接口或仓库实现：": "For production, replace these interfaces or repository implementations:",
  "：接数据库、审计日志、注册服务方治理流程。": ": connect databases, audit logs, and registration-service governance.",
  "：接描述发布、审核和撤销状态存储。": ": connect description publication, review, and revocation state storage.",
  "：接生产 CA、证书签发、密钥托管和凭证生命周期。": ": connect production CA, certificate issuance, key custody, and credential lifecycle.",
  "与": "and",
  "：接证书链、吊销状态、算法策略和授权策略。": ": connect certificate chains, revocation status, algorithm policy, and authorization policy.",
  "：接你的网络协议，不需要改变业务模型。": ": connect your network protocol without changing the business model.",

  "完整链路": "End-to-End Flow",
  "1. 注册身份": "1. Register Identity",
  "2. 发布描述": "2. Publish Description",
  "2. 发布智能体描述": "2. Publish Agent Description",
  "3. 注册工具": "3. Register Tool",
  "4. 发现智能体": "4. Discover Agent",
  "5. 建会话与任务": "5. Create Session and Task",
  "6. 调用工具并回消息": "6. Invoke Tool and Send Message",
  "6. 调用工具并回写最终结果": "6. Invoke Tool and Write Back Final Result",
  "运行示例": "Run the Example",
  "这一页用一个日历智能体示例跑通核心链路：身份注册、描述发布、发现、会话、任务、工具调用、最终结果消息。": "This page runs the core flow with a calendar agent: identity registration, description publication, discovery, session, task, tool invocation, and final result message.",
  "创建内存参考运行时：": "Create the in-memory reference runtime: ",
  "给请求方和服务方准备 GB/Z 185 身份码。": "Prepare GB/Z 185 identity codes for the requester and service provider.",
  "注册服务方身份并可选发行开发凭证。": "Register the service agent identity and optionally issue a development credential.",
  "注册并发布智能体描述。": "Register and publish the agent description.",
  "注册资源侧工具。": "Register the resource-side tool.",
  "通过发现服务找到服务方智能体。": "Find the service agent through discovery.",
  "创建点对点会话和任务。": "Create a point-to-point session and task.",
  "调用工具并把结果作为": "Invoke the tool and write the result as a",
  "消息写回会话。": "message back into the session.",
  "是服务方智能体身份码。开启": "is the service agent identity code. When",
  "时，内存运行时也会返回一张开发凭证。": "is enabled, the in-memory runtime also returns a development credential.",
  "注册会校验描述和技能必填字段；发布后才能被默认发现流程检索到。": "Registration validates required description and skill fields; publishing makes it visible to the default discovery flow.",
  "是资源侧工具服务，": "is the resource-side tool service, and",
  "是智能体侧工具访问门面。内存运行时已经把二者连在一起。": "is the agent-side tool access facade. The in-memory runtime wires them together.",
  "发现服务会按文本、名称、技能、标签、输入输出类型、可发现性和可用性过滤，并返回": "Discovery filters by text, name, skills, tags, input/output types, discoverability, and availability, then returns",
  "与": "and",
  "可以是": "can be",
  "或": "or",
  "。任务初始状态为": ". The initial task state is",
  "工具调用不会因为某个工具失败而让整个批次抛错；失败项会以": "A single tool failure does not throw the whole batch; failed items appear with",
  "和": "and",
  "出现在结果列表里。": "in the result list.",
  "运行仓库内示例": "Run the Repository Example",
  "说明：": "Note:",
  "仓库使用": "The repository uses",
  "执行 TypeScript 示例。业务项目里也可以直接从": "to execute TypeScript examples. Business projects can import the same APIs directly from",
  "导入同样 API。": ".",

  "运行时工厂": "Runtime Factory",
  "身份账户": "Identity Accounts",
  "凭证与鉴别": "Credentials and Authentication",
  "描述管理": "Description Management",
  "发现服务": "Discovery Service",
  "交互与消息": "Interaction and Messages",
  "校验": "Validation",
  "核心模型": "Core Models",
  "国标覆盖常量": "GB/Z Coverage Constants",
  "这页是开发者的完整 API 参考。所有公开函数、类、接口和核心数据模型都按模块说明：签名、用途、输入、输出和常见注意事项。": "This is the complete API reference. Every public function, class, interface, and core data model is documented by module with signature, purpose, inputs, outputs, and common notes.",
  "创建一个完整的内存参考运行时，包含身份、凭证、描述、发现、交互、消息分发、工具服务、工具访问、transport 和 client。": "Creates a complete in-memory reference runtime with identity, credentials, descriptions, discovery, interaction, message distribution, tool service, tool access, transport, and client modules.",
  "输入": "Input",
  "无。": "None.",
  "无": "None",
  "返回": "Returns",
  "，可直接用于本地开发和测试。": ", ready for local development and testing.",
  "适用": "Use Cases",
  "快速原型、单进程测试、国标流程 smoke test。": "Rapid prototypes, single-process tests, and GB/Z flow smoke tests.",
  "工厂返回的组合对象。": "The composed object returned by the factory.",
  "属性": "Property",
  "类型": "Type",
  "用途": "Purpose",
  "开发凭证仓库、状态仓库、issuer、verifier": "Development credential repository, status store, issuer, and verifier",
  "本地凭证签发、状态更新、验签。": "Local credential issuance, status updates, and signature verification.",
  "智能体侧身份维护门面。": "Agent-side identity maintenance facade.",
  "智能体侧描述维护门面。": "Agent-side description maintenance facade.",
  "过程凭证包、对端鉴别、互鉴权。": "Process credential packages, peer authentication, and mutual authorization.",
  "管理服务侧身份账户运行时。": "Management-service identity account runtime.",
  "描述注册、审核、发布和撤销。": "Description registration, review, publication, and revocation.",
  "发现服务。": "Discovery service.",
  "会话、任务、消息。": "Sessions, tasks, and messages.",
  "群组消息分发和收件箱。": "Group message distribution and inboxes.",
  "资源侧工具注册和执行。": "Resource-side tool registration and execution.",
  "智能体侧工具访问。": "Agent-side tool access.",
  "内存 operation 路由。": "In-memory operation routing.",
  "统一客户端。": "Unified client.",
  "客户端只依赖": "The client depends only on",
  "，因此同一套调用可以走内存、HTTP 或自定义协议。": ", so the same calls can run over in-memory, HTTP, or custom protocols.",
  "方法": "Method",
  "注册身份账户，可同时发行开发凭证。": "Registers an identity account and can issue a development credential at the same time.",
  "按身份码读取账户。": "Reads an account by identity code.",
  "给已有身份账户发行凭证。": "Issues a credential for an existing identity account.",
  "身份码、原因": "Identity code and reason",
  "锁定身份账户，并联动锁定已发行凭证。": "Locks the identity account and all issued credentials.",
  "恢复身份账户和凭证状态。": "Restores the identity account and credential status.",
  "注销身份账户，并联动注销凭证。": "Revokes the identity account and its credentials.",
  "注册并校验智能体描述。": "Registers and validates an agent description.",
  "追加描述审核记录。": "Appends a description review record.",
  "追加审核记录。": "Appends a review record.",
  "签发描述发布证书元数据。": "Issues publication-certificate metadata for a description.",
  "发布描述，使其默认可被发现。": "Publishes a description so it is discoverable by default.",
  "身份码、发布信息": "Identity code and publication info",
  "发布并携带区域、权限、版权等发布元数据。": "Publishes with region, permission, copyright, and related metadata.",
  "下架描述，并标记不可用。": "Unpublishes the description and marks it unavailable.",
  "撤销描述，并标记不可发现、不可用。": "Revokes the description and marks it undiscoverable and unavailable.",
  "按文本、身份码、名称、技能、标签和 IO 类型发现。": "Discovers by text, identity code, name, skills, tags, and IO types.",
  "创建点对点、群组或混合会话。": "Creates a point-to-point, group, or hybrid session.",
  "在会话内创建任务，初始状态为": "Creates a task in the session with initial state",
  "发送消息，可关联任务、分块和最终结果。": "Sends a message, optionally linked to a task, chunks, and final result markers.",
  "消息输入、收件人列表": "Message input and recipient list",
  "群组消息分发，未传收件人时从会话推断。": "Distributes group messages; recipients are inferred from the session when omitted.",
  "可选工具 ID 列表": "Optional tool ID list",
  "获取全部或部分工具描述。": "Gets all or selected tool descriptors.",
  "拉取工具更新摘要，读取后清空更新集合。": "Pulls tool update summaries and clears the update set after reading.",
  "批量调用工具，逐项返回成功或失败。": "Invokes tools in a batch and returns success or failure per item.",
  "格式化 GB/Z 185.2 身份码。默认 OID 为": "Formats a GB/Z 185.2 identity code. The default OID is",
  "，版本为": ", version is",
  "，业务节点会转成大写。": ", and business nodes are uppercased.",
  "注册服务方和注册请求方最长 6 位；本体序列号和实例序列号最长 9 位；节点必须是 base36 字符。": "Registration service provider and requester are up to 6 characters; ontology and instance serials are up to 9 characters; nodes must be base36.",
  "异常": "Throws",
  "非法 OID、版本、空节点、过长节点或非法字符会抛错。": "Invalid OID, version, empty node, overlong node, or invalid characters throw errors.",
  "解析身份码并返回结构化字段。要求完整 9 段点分结构：OID 四段、版本一段、业务节点四段。": "Parses an identity code into structured fields. Requires the complete 9-segment dotted form: 4 OID segments, 1 version segment, and 4 business segments.",
  "布尔校验包装器。适合表单校验或过滤输入，不会向调用方抛错。": "Boolean validation wrapper for forms or input filtering; it does not throw to the caller.",
  "校验结构化身份码字段。非法时抛错，合法时无返回值。": "Validates structured identity-code fields; throws on invalid input and returns nothing on success.",
  "签名/成员": "Signature / Members",
  "管理服务侧身份账户生命周期运行时。": "Management-service runtime for the identity account lifecycle.",
  "分配身份码，创建 active 账户，可选发行凭证。": "Allocates an identity code, creates an active account, and optionally issues a credential.",
  "更新描述或证据，并写入 audit log。": "Updates description or evidence and writes the audit log.",
  "给 active 账户发行凭证；locked/revoked 账户会抛错。": "Issues credentials for active accounts; locked/revoked accounts throw.",
  "锁定账户，并锁定该账户凭证。": "Locks the account and its credentials.",
  "恢复账户和凭证为 active。": "Restores account and credentials to active.",
  "注销账户，并注销该账户凭证。": "Revokes the account and its credentials.",
  "读取单个账户。": "Reads one account.",
  "列出账户。": "Lists accounts.",
  "身份账户存储接口，生产环境替换内存实现。": "Identity account storage interface; replace the in-memory implementation in production.",
  "内存 Map 实现": "In-memory Map implementation",
  "开发、测试使用。": "For development and tests.",
  "智能体侧身份维护门面，保存当前 active account 和本地凭证。": "Agent-side identity maintenance facade that keeps the current active account and local credentials.",
  "凭证签发和生命周期接口。": "Credential issuance and lifecycle interface.",
  "开发实现：生成 Ed25519 key pair，保存 public key 和 private key，默认一年有效。": "Development implementation: generates an Ed25519 key pair, stores public and private keys, and defaults to one-year validity.",
  "过程凭证包验证接口。": "Process credential package verification interface.",
  "校验证书状态、有效期、受众、scope、签名和 X.509 public key 匹配。": "Validates certificate status, validity period, audience, scope, signature, and X.509 public-key match.",
  "凭证状态查询接口。": "Credential status query interface.",
  "内存状态实现": "In-memory status implementation",
  "保存 active、locked、revoked。": "Stores active, locked, and revoked states.",
  "凭证存储实现。": "Credential storage implementation.",
  "X.509 证书链验证扩展点。": "X.509 certificate-chain verification extension point.",
  "检查": "checks",
  "验证证书有效期和证书 public key 是否匹配凭证 public key。": "Verifies certificate validity and whether the certificate public key matches the credential public key.",
  "用私钥签名 audience、scope、timestamp、payload 等内容，生成过程凭证包。": "Signs audience, scope, timestamp, payload, and related data with the private key to create a process credential package.",
  "稳定 JSON 序列化，用于签名载荷。": "Stable JSON serialization for signed payloads.",
  "智能体互联授权运行时，把凭证验证结果转为可执行的授权决策。": "Agent interconnection authorization runtime that turns credential verification results into executable authorization decisions.",
  "创建过程凭证包。": "Creates a process credential package.",
  "验证对端凭证包并套用授权策略。": "Verifies the peer credential package and applies the authorization policy.",
  "把鉴别断言转为 allow/deny。": "Turns an authentication assertion into allow/deny.",
  "同时验证请求方和服务方。": "Verifies requester and service provider at the same time.",
  "描述注册、审核、发布、变更、下架、撤销运行时。": "Runtime for description registration, review, publication, change, unpublish, and revocation.",
  "校验并注册描述，默认": "Validates and registers a description; by default",
  "和": "and",
  "为 true。": "are true.",
  "生成发布证书元数据。": "Generates publication-certificate metadata.",
  "发布描述；revoked 描述不可发布。": "Publishes a description; revoked descriptions cannot be published.",
  "合并修改描述并重新校验。": "Merges description changes and revalidates.",
  "状态变为 unpublished，available 变为 false。": "Status becomes unpublished and available becomes false.",
  "状态变为 revoked，discoverable 和 available 变为 false。": "Status becomes revoked, and discoverable and available become false.",
  "读取描述记录。": "Reads a description record.",
  "列出全部或已发布记录。": "Lists all records or published records.",
  "描述存储扩展点。": "Description storage extension point.",
  "预置发现源，可表示缓存、用户配置或 well-known 派生描述。": "Preset discovery source for cache, user configuration, or well-known-derived descriptions.",
  "组合已发布描述和预置源，并按查询条件排序。": "Combines published descriptions and preset sources, then sorts by query match.",
  "支持": "Supports",
  "GB/Z 185.6 会话、任务、消息内存运行时。": "GB/Z 185.6 in-memory runtime for sessions, tasks, and messages.",
  "创建会话；至少需要一个 receiver。": "Creates a session; at least one receiver is required.",
  "创建任务，状态为 accepted，可带初始消息和产物。": "Creates a task with accepted status; initial messages and artifacts are optional.",
  "更新任务状态。": "Updates task state.",
  "写入会话消息；可设置": "Writes a session message; can set",
  "群组消息分发。默认从会话中推断除发送方外的收件人。": "Group message distribution; by default recipients are inferred from the session except the sender.",
  "分发回执。": "Distribution receipt.",
  "资源侧工具服务。": "Resource-side tool service.",
  "校验工具描述并注册 handler。": "Validates the tool descriptor and registers the handler.",
  "返回全部工具或指定 ID 工具。未传 ID 时": "Returns all tools or specified IDs. When IDs are omitted,",
  "为 1。": "is 1.",
  "返回注册后发生更新的工具摘要，并清空更新集合。": "Returns summaries of updated tools since registration and clears the update set.",
  "批量调用工具。缺失工具返回": "Invokes tools in a batch. Missing tools return",
  "，handler 抛错返回": ", and handler errors return",
  "智能体侧工具访问门面。": "Agent-side tool access facade.",
  "循环调用工具，直到完成或达到最大轮次，默认最多 8 轮。": "Invokes tools repeatedly until complete or the maximum round count is reached; defaults to 8 rounds.",
  "工具实现函数，context 带 sessionId 和当前调用项。": "Tool implementation function; context includes sessionId and the current invocation item.",
  "所有 client 调用的唯一传输抽象。": "The only transport abstraction used by all client calls.",
  "进程内 operation handler 类型。": "In-process operation handler type.",
  "本地 operation 路由。未注册 operation 会抛错。": "Local operation routing. Unregistered operations throw.",
  "向 endpoint POST": "POSTs to the endpoint with",
  "，响应 body 按 JSON 解析。": ", and parses the response body as JSON.",
  "判断普通 JSON 对象。": "Checks for a plain JSON object.",
  "校验技能 ID、名称、描述、标签、输入输出类型、示例和依赖。": "Validates skill ID, name, description, tags, input/output types, examples, and dependencies.",
  "校验身份码、名称、版本、provider、capabilities、默认 IO、skills、accessMethod。": "Validates identity code, name, version, provider, capabilities, default IO, skills, and accessMethod.",
  "校验失败时抛出聚合错误。": "Throws an aggregate error when validation fails.",
  "校验工具 ID、名称、描述、版本、输入输出 JSON 对象。": "Validates tool ID, name, description, version, and input/output JSON objects.",
  "校验失败时抛错。": "Throws when validation fails.",
  "核心模型与接口": "Core Models and Interfaces",
  "关键字段": "Key Fields",
  "身份码结构化字段。": "Structured identity-code fields.",
  "身份码字符串别名。": "Identity-code string alias.",
  "身份账户记录。": "Identity account record.",
  "注册身份输入。": "Identity registration input.",
  "智能体凭证。": "Agent credential.",
  "过程凭证包。": "Process credential package.",
  "鉴别断言。": "Authentication assertion.",
  "授权策略。": "Authorization policy.",
  "智能体描述。": "Agent description.",
  "智能体技能描述。": "Agent skill description.",
  "描述生命周期记录。": "Description lifecycle record.",
  "发现查询。": "Discovery query.",
  "发现结果和匹配原因。": "Discovery result and match reasons.",
  "会话。": "Session.",
  "任务。": "Task.",
  "消息。": "Message.",
  "消息数据项。": "Message data item.",
  "工具描述。": "Tool descriptor.",
  "工具调用请求。": "Tool invocation request.",
  "工具调用结果。": "Tool invocation result.",
  "JSON 兼容值": "JSON-compatible value",
  "传输和模型扩展字段的基础类型。": "Base type for transport and model extension fields.",
  "常量": "Constant",
  "12 个 GB/Z 185.1 功能域到 SDK surface 的映射。": "Mapping from the 12 GB/Z 185.1 function domains to SDK surfaces.",
  "FRAI-01 到 FRAI-10 参考接口映射。": "Reference interface mapping from FRAI-01 to FRAI-10.",
  "GB/Z 185.1-185.7 条款级覆盖矩阵。": "Clause-level coverage matrix for GB/Z 185.1-185.7.",

  "端到端日历智能体": "End-to-End Calendar Agent",
  "身份码工具": "Identity-Code Helpers",
  "凭证鉴别": "Credential Authentication",
  "群组消息": "Group Messages",
  "多轮工具调用": "Multi-Round Tool Invocation",
  "这些示例覆盖开发者最常见的集成点。示例优先展示可组合的 SDK 调用，而不是隐藏在框架代码里。": "These examples cover the most common integration points. They focus on composable SDK calls instead of hiding behavior inside framework code.",
  "仓库内置": "The repository includes",
  "，覆盖注册身份、发布描述、发现、建会话、调用工具、发送最终结果。": ", covering identity registration, description publication, discovery, session creation, tool invocation, and final result messages.",
  "完整代码见仓库示例文件；Get Started 页面逐段解释了每一步。": "See the repository example file for the full code; the Get Started page explains each step.",
  "凭证鉴别与授权": "Credential Authentication and Authorization",
  "生产提醒：": "Production note:",
  "这个示例使用开发 issuer/verifier。生产环境应实现": "This example uses the development issuer/verifier. Production should implement",
  "不规定 REST 路径。它只向一个 endpoint POST": "does not prescribe REST paths. It only POSTs to one endpoint with",
  "，服务端自行路由。": ", and the server routes it.",
  "服务端收到的 body 形态如下。": "The server receives a body shaped like this.",
  "群组消息分发": "Group Message Distribution",
  "未显式传": "When",
  "时，分发运行时会从会话中推断所有参与方，并排除发送方。": "is omitted, the distribution runtime infers all session participants and excludes the sender.",
  "这个模式适合工具返回“还没完成，需要下一轮输入”的场景。SDK 不规定完成判断，你用": "This pattern fits tools that return not-complete-yet states and need another input round. The SDK does not define completion; use",
  "写业务条件。": "to express your business condition.",
  "Next: 国标对照": "Next: Conformance",
  "当前语言的最小链路": "Minimal Flow in the Selected Language",
  "示例语言": "Example Language",
  "SDK 示例语言": "SDK Example Language",
  "TypeScript Beta；Python / Go / Rust / Java Alpha 实验中": "TypeScript Beta; Python / Go / Rust / Java Alpha experimental",
  "TypeScript Beta": "TypeScript Beta",
  "Python Alpha 实验中": "Python Alpha Experimental",
  "Go Alpha 实验中": "Go Alpha Experimental",
  "Rust Alpha 实验中": "Rust Alpha Experimental",
  "Java Alpha 实验中": "Java Alpha Experimental",
  "TypeScript Beta：完整内存运行时": "TypeScript Beta: Full In-Memory Runtime",
  "Python Alpha：调用 JSON gateway": "Python Alpha: Call a JSON Gateway",
  "Go Alpha：调用 JSON gateway": "Go Alpha: Call a JSON Gateway",
  "Rust Alpha：调用 JSON gateway": "Rust Alpha: Call a JSON Gateway",
  "Java Alpha：调用 JSON gateway": "Java Alpha: Call a JSON Gateway",
  "TypeScript 可以在一个进程里直接创建身份、描述、发现、会话和工具运行时。下面各步骤展开完整流程。": "TypeScript can create the identity, description, discovery, session, and tool runtimes in one process. The steps below expand that full flow.",
  "客户端语言版本": "Client Language Variants",
  "同一组标准 operation 在不同 SDK 里使用各自语言习惯的方法名。切换示例语言可以直接看调用形态。": "The same standard operations use idiomatic method names in each SDK. Switch the example language to see the call shape directly.",
  "本地源码开发：": "Local source development:",
  "本地源码验证：": "Local source verification:",
  "业务代码导入：": "Application import:",
  "用当前示例语言跑一个最小 smoke test，确认 SDK 可以被导入、身份码可以生成。": "Run a minimal smoke test in the selected example language to confirm the SDK imports and identity codes can be generated.",
  "npm 包是当前主分发入口，包含完整参考运行时。": "The npm package is the current primary distribution entry and includes the full reference runtime.",
  "这页是 TypeScript、Python、Go、Rust、Java 开发者的统一入口。每种语言都按安装、身份码、传输、客户端调用、工具调用、测试验证的顺序说明。": "This is the unified entry point for TypeScript, Python, Go, Rust, and Java developers. Each language is documented in the order of install, identity code, transport, client call, tool invocation, and verification.",
  "当前成熟度：": "Current maturity:",
  "TypeScript SDK 为": "TypeScript SDK is",
  "；Python、Go、Rust、Java SDK 为": "; Python, Go, Rust, and Java SDKs are",
  "Alpha 实验中": "Alpha experimental",
  "TypeScript 是参考实现，包含完整内存运行时。Python、Go、Rust、Java 是客户端和适配 SDK，负责在各自语言里生成身份码、发送标准 JSON operation、调用统一客户端方法，并复用国标覆盖常量。": "TypeScript is the reference implementation and includes the full in-memory runtime. Python, Go, Rust, and Java are client and adapter SDKs for generating identity codes, sending standard JSON operations, calling unified client methods, and reusing conformance constants.",
  "TypeScript 是 Beta 参考实现，包含完整内存运行时。Python、Go、Rust、Java 是 Alpha 实验中的客户端和适配 SDK，负责在各自语言里生成身份码、发送标准 JSON operation、调用统一客户端方法，并复用国标覆盖常量。": "TypeScript is the Beta reference implementation and includes the full in-memory runtime. Python, Go, Rust, and Java are Alpha experimental client and adapter SDKs for generating identity codes, sending standard JSON operations, calling unified client methods, and reusing conformance constants.",
  "能力": "Capability",
  "SDK 成熟度": "SDK Maturity",
  "身份码解析、格式化、校验": "Identity-code parse, format, and validate",
  "统一 JSON transport": "Unified JSON transport",
  "进程内 transport": "In-process transport",
  "HTTP JSON transport": "HTTP JSON transport",
  "统一客户端方法": "Unified client methods",
  "GB/Z 185.1 功能常量": "GB/Z 185.1 function constants",
  "FRAI-01 到 FRAI-10 常量": "FRAI-01 to FRAI-10 constants",
  "完整内存参考运行时": "Full in-memory reference runtime",
  "支持": "Yes",
  "不内置": "Not built in",
  "如果你要在单进程里跑完整 GB/Z 185 链路，用 TypeScript 运行时。如果你的服务已经有自己的后端，只需要从 Python、Go、Rust 或 Java 调一个标准网关，用对应语言 SDK。": "Use the TypeScript runtime when you need the complete GB/Z 185 flow in one process. Use the language SDK when your service already has a backend and only needs to call a standard gateway from Python, Go, Rust, or Java.",
  "所有语言的客户端都只依赖同一种请求信封。SDK 不规定 REST 路径、WebSocket 消息名或 MCP 方法名；你只需要把 operation 和 payload 交给自己的网关。": "All language clients depend on the same request envelope. The SDK does not prescribe REST paths, WebSocket message names, or MCP method names; pass operation and payload to your own gateway.",
  "服务端返回标准 JSON 对象或数组。HTTP transport 会把响应体作为 JSON 解析；进程内 transport 会直接返回 handler 的结果。": "The server returns a standard JSON object or array. HTTP transport parses the response body as JSON; in-process transport returns the handler result directly.",
  "领域": "Domain",
  "客户端方法": "Client Method",
  "按智能体身份码读取账户。": "Reads an account by agent identity code.",
  "身份账户锁定、解锁和注销。": "Locks, unlocks, and revokes identity accounts.",
  "描述发布、下架和撤销。": "Publishes, unpublishes, and revokes descriptions.",
  "按自然语言、身份码、名称、技能、标签、IO 类型和可用性发现。": "Discovers by natural language, identity code, name, skills, tags, IO types, and availability.",
  "提交任务、发送消息、标记最终结果。": "Submits tasks, sends messages, and marks final results.",
  "群组消息分发。": "Group message distribution.",
  "工具列表、工具更新和批量工具调用。": "Tool list, tool updates, and batch tool invocation.",
  "安装": "Install",
  "成熟度": "Maturity",
  "HTTP 网关客户端": "HTTP Gateway Client",
  "验证": "Verify",
  "完整内存运行时": "Full In-Memory Runtime",
  "TypeScript 包是参考实现，适合直接跑完整国标流程，也适合作为其他语言服务端网关的实现基础。": "The TypeScript package is the reference implementation. It can run the full standard flow directly and can also serve as the implementation base for a gateway used by other languages.",
  "状态：": "Status:",
  "Beta。TypeScript 包是参考实现，适合直接跑完整国标流程，也适合作为其他语言服务端网关的实现基础。": "Beta. The TypeScript package is the reference implementation. It can run the full standard flow directly and can also serve as the implementation base for a gateway used by other languages.",
  "Python SDK 适合把 Python 服务、脚本、数据处理任务或智能体后端接入 GB/Z 185 JSON gateway。": "The Python SDK is suitable for connecting Python services, scripts, data jobs, or agent backends to a GB/Z 185 JSON gateway.",
  "Alpha 实验中。Python SDK 适合把 Python 服务、脚本、数据处理任务或智能体后端接入 GB/Z 185 JSON gateway。": "Alpha experimental. The Python SDK is suitable for connecting Python services, scripts, data jobs, or agent backends to a GB/Z 185 JSON gateway.",
  "Go SDK 适合在网关、后端服务、微服务和 CLI 中调用 GB/Z 185 operation。所有方法都接收 context，并把结果解码到调用方提供的 out 参数。": "The Go SDK is suitable for gateways, backend services, microservices, and CLIs that call GB/Z 185 operations. Every method accepts a context and decodes into the caller-provided out parameter.",
  "Alpha 实验中。Go SDK 适合在网关、后端服务、微服务和 CLI 中调用 GB/Z 185 operation。所有方法都接收 context，并把结果解码到调用方提供的 out 参数。": "Alpha experimental. The Go SDK is suitable for gateways, backend services, microservices, and CLIs that call GB/Z 185 operations. Every method accepts a context and decodes into the caller-provided out parameter.",
  "Rust crate 适合在高可靠服务、代理、边缘网关或命令行工具中调用标准 GB/Z 185 JSON operation。模型载荷使用 serde_json::Value，方便和网关协议保持一致。": "The Rust crate fits reliable services, proxies, edge gateways, and command-line tools that call standard GB/Z 185 JSON operations. Model payloads use serde_json::Value to stay aligned with the gateway contract.",
  "Alpha 实验中。Rust crate 适合在高可靠服务、代理、边缘网关或命令行工具中调用标准 GB/Z 185 JSON operation。模型载荷使用 serde_json::Value，方便和网关协议保持一致。": "Alpha experimental. The Rust crate fits reliable services, proxies, edge gateways, and command-line tools that call standard GB/Z 185 JSON operations. Model payloads use serde_json::Value to stay aligned with the gateway contract.",
  "Java SDK 适合 Spring、Quarkus、Micronaut、传统后端或 JVM 网关。客户端返回 Jackson JsonNode，输入可以是 Map、List、POJO 或 JsonNode。": "The Java SDK fits Spring, Quarkus, Micronaut, traditional backends, and JVM gateways. The client returns Jackson JsonNode values, and inputs can be Map, List, POJO, or JsonNode.",
  "Alpha 实验中。Java SDK 适合 Spring、Quarkus、Micronaut、传统后端或 JVM 网关。客户端返回 Jackson JsonNode，输入可以是 Map、List、POJO 或 JsonNode。": "Alpha experimental. The Java SDK fits Spring, Quarkus, Micronaut, traditional backends, and JVM gateways. The client returns Jackson JsonNode values, and inputs can be Map, List, POJO, or JsonNode.",
  "语言": "Language",
  "当前推荐使用方式": "Recommended Current Usage",
  "正式仓库发布说明": "Registry Release Notes",
  "npm 包已经是首个公开分发入口。": "The npm package is already the first public distribution entry.",
  "GitHub subdirectory 或本地路径安装": "GitHub subdirectory or local path install",
  "发布 PyPI 后使用": "After PyPI publication, use",
  "Go 子模块稳定版本应使用": "Stable Go submodule versions should use",
  "Go 子模块未来稳定版本应使用": "Future stable Go submodule versions should use",
  "这类 tag。": "tags.",
  "本地 path dependency": "Local path dependency",
  "发布 crates.io 后使用": "After crates.io publication, use",
  "后依赖本地 artifact": "then depend on the local artifact",
  "发布 Maven Central 前可接企业私有 Maven 仓库。": "Before Maven Central publication, use a private enterprise Maven repository.",
  "非 TypeScript SDK 当前是客户端和适配层，不内置完整内存运行时。生产环境的身份治理、证书策略、数据库、审计、HTTP 路由和权限控制仍应由你的服务端实现。": "Non-TypeScript SDKs are currently client and adapter layers; they do not include the full in-memory runtime. Production identity governance, certificate policy, databases, audit, HTTP routing, and authorization controls should still be implemented on your server.",

  "覆盖摘要": "Coverage Summary",
  "功能域": "Function Domains",
  "FRAI 接口": "FRAI Interfaces",
  "条款矩阵": "Clause Matrix",
  "边界": "Boundaries",
  "GB/Z 185 对照验证": "GB/Z 185 Conformance Validation",
  "SDK 导出": "The SDK exports",
  "。这页把同样的信息直接展开，方便开发者判断该用哪个 API。": ". This page expands the same information so developers can choose the right API.",
  "条款对照": "Clause mappings",
  "标准分册": "Standard parts",
  "GB/Z 185.1 功能域到 SDK 表面": "GB/Z 185.1 Function Domains to SDK Surfaces",
  "SDK 表面": "SDK Surface",
  "接口": "Interface",
  "连接功能": "Connected Functions",
  "身份维护 -> 身份管理": "Identity maintenance -> Identity management",
  "身份维护 -> 凭证管理": "Identity maintenance -> Credential management",
  "互联授权 -> 身份鉴别": "Interconnection authorization -> Identity authentication",
  "身份管理 -> 凭证管理": "Identity management -> Credential management",
  "凭证管理 -> 身份鉴别": "Credential management -> Identity authentication",
  "描述维护 -> 描述管理": "Description maintenance -> Description management",
  "描述管理 -> 发现": "Description management -> Discovery",
  "智能体交互 -> 智能体交互": "Agent interaction -> Agent interaction",
  "智能体交互 -> 消息分发": "Agent interaction -> Message distribution",
  "工具访问 -> 工具服务": "Tool access -> Tool service",
  "身份维护 ->": "Identity maintenance ->",
  "互联授权 ->": "Interconnection authorization ->",
  "身份管理 ->": "Identity management ->",
  "凭证管理 ->": "Credential management ->",
  "描述维护 ->": "Description maintenance ->",
  "描述管理 ->": "Description management ->",
  "智能体交互 ->": "Agent interaction ->",
  "工具访问 ->": "Tool access ->",
  "身份管理": "Identity management",
  "凭证管理": "Credential management",
  "身份鉴别": "Identity authentication",
  "发现": "Discovery",
  "智能体交互": "Agent interaction",
  "消息分发": "Message distribution",
  "工具服务": "Tool service",
  "条款级覆盖矩阵": "Clause-Level Coverage Matrix",
  "分册": "Part",
  "条款": "Clause",
  "主题": "Topic",
  "状态": "Status",
  "用户、智能体、管理服务、互联服务、资源访问概念域": "Concept domains for users, agents, management services, interconnection services, and resource access.",
  "功能参考架构函数集": "Function set of the functional reference architecture.",
  "FRAI-01 到 FRAI-10": "FRAI-01 to FRAI-10",
  "身份码 OID、版本、服务方、请求方、本体序列号、实例序列号": "Identity-code OID, version, service provider, requester, ontology serial, and instance serial.",
  "身份码分配和管理": "Identity-code allocation and management.",
  "国际身份码获取治理": "Governance for obtaining international identity codes.",
  "身份管理框架": "Identity management framework.",
  "注册和证据核验": "Registration and evidence verification.",
  "账户更新、锁定、解锁、注销、审计": "Account update, lock, unlock, revocation, and audit.",
  "凭证签发、更新、锁定、解锁、注销、状态查询": "Credential issuance, update, lock, unlock, revocation, and status query.",
  "凭证出示、验证、鉴别断言、授权决策": "Credential presentation, verification, authentication assertion, and authorization decision.",
  "生产 CA、国密算法、不可篡改审计": "Production CA, GM/T algorithms, and tamper-resistant audit.",
  "智能体描述和技能属性": "Agent description and skill attributes.",
  "描述注册、审核、发布证书、发布、变更、下架、撤销": "Description registration, review, publication certificate, publication, change, unpublish, and revocation.",
  "发现服务流程": "Discovery service flow.",
  "预置信息、缓存、用户配置、well-known 派生发现": "Preset information, cache, user configuration, and well-known-derived discovery.",
  "API、GUI、LUI 查询接口": "API, GUI, and LUI query interfaces.",
  "点对点、群组、混合交互模式": "Point-to-point, group, and hybrid interaction modes.",
  "数据、消息、任务、会话结构": "Data, message, task, and session structures.",
  "点对点和群组消息流程": "Point-to-point and group message flows.",
  "远程调用、流式、通知、代理协商、订阅": "Remote calls, streaming, notifications, proxy negotiation, and subscription.",
  "工具调用架构": "Tool invocation architecture.",
  "工具列表、工具更新、工具调用循环": "Tool lists, tool updates, and tool invocation loops.",
  "工具描述、请求、同步、更新、调用、结果数据格式": "Tool descriptor, request, sync, update, invocation, and result data formats.",
  "边界说明": "Boundary Notes",
  "表示 SDK 类型或公开 API 已直接覆盖；": "means SDK types or public APIs directly cover it;",
  "表示内存运行时已提供可运行参考实现；": "means the in-memory runtime provides a runnable reference implementation;",
  "表示国标涉及治理、基础设施、生产安全或界面形态，SDK 提供接口，不假装替你完成合规落地。": "means the standard involves governance, infrastructure, production security, or UI shape; the SDK provides interfaces and does not pretend to complete compliance for you.",
  "生产级 CA、国密算法、主管部门证书策略：实现": "Production CA, GM/T algorithms, and regulator certificate policy: implement",
  "监管认可的身份注册治理：实现": "Regulator-recognized identity registration governance: implement",
  "并把审核流程接入": "and connect the review process to",
  "GUI/LUI 发现界面：基于": "GUI/LUI discovery interface: build on",
  "构建应用界面。": "to build application UI.",
  "REST、WebSocket、MCP、消息队列：实现": "REST, WebSocket, MCP, and message queues: implement",
  "或在服务端适配 operation。": "or adapt operations on the server."
};

const CONTROL_LABELS = {
  zh: {
    nav: "主导航",
    preferences: "显示偏好",
    language: "语言",
    theme: "主题",
    light: "浅色",
    dark: "深色",
    diagramAlt: "gbz185-sdk 运行时架构图"
  },
  en: {
    nav: "Primary navigation",
    preferences: "Display preferences",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    diagramAlt: "gbz185-sdk runtime architecture diagram"
  }
};

const originalText = new WeakMap();

function getStoredValue(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore private browsing or storage-disabled contexts.
  }
}

function preferredLanguage() {
  const stored = getStoredValue(STORAGE_KEYS.language);
  if (stored === "zh" || stored === "en") {
    return stored;
  }
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function preferredTheme() {
  const stored = getStoredValue(STORAGE_KEYS.theme);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function preferredSdkLanguage() {
  const stored = getStoredValue(STORAGE_KEYS.sdkLanguage);
  if (["ts", "python", "go", "rust", "java"].includes(stored ?? "")) {
    return stored;
  }
  return "ts";
}

function updateTextNodes(language) {
  const nodes = [];
  const ignoredTags = new Set(["SCRIPT", "STYLE", "PRE", "CODE", "SVG"]);
  const visit = (node) => {
    if (node.nodeType === 3) {
      if (node.nodeValue?.trim()) {
        nodes.push(node);
      }
      return;
    }

    if (node.nodeType !== 1 || ignoredTags.has(node.tagName)) {
      return;
    }

    for (const child of node.childNodes) {
      visit(child);
    }
  };

  visit(document.body);

  for (const node of nodes) {
    if (!originalText.has(node)) {
      originalText.set(node, node.nodeValue ?? "");
    }

    const source = originalText.get(node) ?? "";
    if (language === "zh") {
      node.nodeValue = source;
      continue;
    }

    const trimmed = source.trim();
    const translated = ZH_TO_EN[trimmed];
    if (!translated) {
      node.nodeValue = source;
      continue;
    }

    const leading = source.match(/^\s*/)?.[0] ?? "";
    const trailing = source.match(/\s*$/)?.[0] ?? "";
    node.nodeValue = `${leading}${translated}${trailing}`;
  }
}

function updatePageMeta(language) {
  const page = location.pathname.split("/").pop() || "index.html";
  const meta = PAGE_META[page]?.[language] ?? PAGE_META["index.html"][language];
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.title = meta.title;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute("content", meta.description);
  }
}

function updateControlLabels(language) {
  const labels = CONTROL_LABELS[language];
  document.querySelector("nav")?.setAttribute("aria-label", labels.nav);
  document.querySelector(".display-controls")?.setAttribute("aria-label", labels.preferences);
  document.querySelector('[data-control-group="language"]')?.setAttribute("aria-label", labels.language);
  document.querySelector('[data-control-group="theme"]')?.setAttribute("aria-label", labels.theme);

  const lightButton = document.querySelector('[data-theme-toggle="light"]');
  const darkButton = document.querySelector('[data-theme-toggle="dark"]');
  if (lightButton) {
    lightButton.textContent = labels.light;
  }
  if (darkButton) {
    darkButton.textContent = labels.dark;
  }

  document.querySelector(".hero-visual img")?.setAttribute("alt", labels.diagramAlt);
}

function applyLanguage(language) {
  updateTextNodes(language);
  updatePageMeta(language);
  updateControlLabels(language);
  setStoredValue(STORAGE_KEYS.language, language);

  for (const button of document.querySelectorAll("[data-lang-toggle]")) {
    button.setAttribute("aria-pressed", button.getAttribute("data-lang-toggle") === language ? "true" : "false");
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  setStoredValue(STORAGE_KEYS.theme, theme);

  for (const button of document.querySelectorAll("[data-theme-toggle]")) {
    button.setAttribute("aria-pressed", button.getAttribute("data-theme-toggle") === theme ? "true" : "false");
  }
}

function applySdkLanguage(sdkLanguage) {
  const panels = Array.from(document.querySelectorAll("[data-sdk-lang]"));
  if (panels.length === 0) {
    return;
  }

  const available = new Set(panels.map((panel) => panel.getAttribute("data-sdk-lang")));
  const activeLanguage = available.has(sdkLanguage) ? sdkLanguage : "ts";

  for (const panel of panels) {
    panel.hidden = panel.getAttribute("data-sdk-lang") !== activeLanguage;
  }

  for (const button of document.querySelectorAll("[data-sdk-lang-toggle]")) {
    const pressed = button.getAttribute("data-sdk-lang-toggle") === activeLanguage;
    button.setAttribute("aria-pressed", pressed ? "true" : "false");
  }

  setStoredValue(STORAGE_KEYS.sdkLanguage, activeLanguage);
}

function letterIndex(index) {
  let value = index;
  let label = "";
  do {
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26) - 1;
  } while (value >= 0);
  return label;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inferCodeLanguage(source) {
  const trimmed = source.trim();
  if (/^<[^>]+>/.test(trimmed)) {
    return "xml";
  }
  if (trimmed.startsWith("{") || trimmed.startsWith("[") || trimmed.includes('"compilerOptions"')) {
    return "json";
  }
  if (trimmed.includes("[dependencies]")) {
    return "toml";
  }
  if (/^(pnpm|npm|git|cd|node|curl|gh|python|go|cargo|mvn|javac|gradle)\b/m.test(trimmed) || trimmed.includes("\n# ")) {
    return "shell";
  }
  if (/\b(from\s+gbz185_sdk\s+import|def\s+\w+\(|print\()/.test(trimmed)) {
    return "python";
  }
  if (/\b(package\s+\w+|func\s+\w+\(|context\.Background\(\)|gbz185\.)/.test(trimmed)) {
    return "go";
  }
  if (/\b(use\s+gbz185_sdk|let\s+\w+\s*=|serde_json::json|Ok\(json!)/.test(trimmed)) {
    return "rust";
  }
  if (/\b(import\s+dev\.idevlab|new\s+AgentIdentityCodeParts|JsonNode|Map\.of)/.test(trimmed)) {
    return "java";
  }
  return "ts";
}

function stashToken(tokens, className, value) {
  const marker = `@@hl_${letterIndex(tokens.length).toLowerCase()}@@`;
  tokens.push({ marker, className, value });
  return marker;
}

function highlightSource(source, language) {
  const tokens = [];
  const tokenPattern = /(`(?:\\[\s\S]|[^`\\])*`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*)/g;
  let protectedSource = source.replace(tokenPattern, (match) => {
    const className = match.startsWith("//") || match.startsWith("/*") || match.startsWith("#")
      ? "tok-comment"
      : "tok-string";
    return stashToken(tokens, className, match);
  });

  let html = escapeHtml(protectedSource);
  const keywordPatterns = {
    shell: /\b(pnpm|npm|git|cd|node|curl|gh|python|go|cargo|mvn|javac|gradle|echo|export)\b/g,
    python: /\b(from|import|def|class|return|if|else|elif|True|False|None|lambda|assert|print)\b/g,
    go: /\b(package|import|func|return|if|else|var|const|type|struct|map|nil|true|false)\b/g,
    rust: /\b(use|let|mut|fn|pub|struct|impl|return|if|else|true|false|Ok|Err|Result)\b/g,
    java: /\b(import|public|private|final|class|new|return|if|else|true|false|null|String|boolean|var)\b/g,
    json: /\b(true|false|null)\b/g,
    toml: /\b(true|false)\b/g,
    xml: /\b\B/g,
    ts: /\b(await|async|const|let|var|import|from|type|new|return|if|throw|true|false|null|undefined|class|interface|extends|implements|function)\b/g
  };
  const keywordPattern = keywordPatterns[language] ?? keywordPatterns.ts;
  html = html.replace(keywordPattern, '<span class="tok-keyword">$1</span>');
  html = html.replace(/\b([A-Z][A-Za-z0-9_]+)\b/g, '<span class="tok-type">$1</span>');
  html = html.replace(/\b([a-zA-Z_$][\w$]*)(?=\()/g, '<span class="tok-function">$1</span>');
  html = html.replace(/\b(-?\d+(?:\.\d+)?)\b/g, '<span class="tok-number">$1</span>');

  for (const token of tokens) {
    html = html.replaceAll(token.marker, `<span class="${token.className}">${escapeHtml(token.value)}</span>`);
  }

  return html;
}

function highlightCodeBlocks() {
  for (const code of document.querySelectorAll("pre code")) {
    if (!code.dataset.rawCode) {
      code.dataset.rawCode = code.textContent ?? "";
    }

    const language = code.dataset.lang || inferCodeLanguage(code.dataset.rawCode);
    const pre = code.closest("pre");
    if (pre) {
      pre.setAttribute("data-code-lang", language.toUpperCase());
    }
    code.innerHTML = highlightSource(code.dataset.rawCode, language);
  }
}

function bindControls() {
  for (const button of document.querySelectorAll("[data-lang-toggle]")) {
    button.addEventListener("click", () => {
      const language = button.getAttribute("data-lang-toggle");
      if (language === "zh" || language === "en") {
        applyLanguage(language);
      }
    });
  }

  for (const button of document.querySelectorAll("[data-theme-toggle]")) {
    button.addEventListener("click", () => {
      const theme = button.getAttribute("data-theme-toggle");
      if (theme === "light" || theme === "dark") {
        applyTheme(theme);
      }
    });
  }

  for (const button of document.querySelectorAll("[data-sdk-lang-toggle]")) {
    button.addEventListener("click", () => {
      const sdkLanguage = button.getAttribute("data-sdk-lang-toggle");
      if (["ts", "python", "go", "rust", "java"].includes(sdkLanguage ?? "")) {
        applySdkLanguage(sdkLanguage);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  bindControls();
  applyTheme(preferredTheme());
  applyLanguage(preferredLanguage());
  applySdkLanguage(preferredSdkLanguage());
  highlightCodeBlocks();
});
