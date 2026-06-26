import { randomUUID } from "node:crypto";
import type { AgentIdentityCode, AgentInteractionMode, DataItem, Message, Session, SessionReceiver, Task, TaskState } from "./types.js";

export interface CreateSessionInput {
  mode: AgentInteractionMode;
  sender: {
    agentId: AgentIdentityCode;
    accessAddress?: string | undefined;
  };
  receivers: SessionReceiver[];
  context?: Array<Message | Task> | undefined;
}

export interface SubmitTaskInput {
  sessionId: string;
  initialMessages?: Message[] | undefined;
  artifacts?: Array<Message | Task> | undefined;
}

export interface SendMessageInput {
  senderRole: Message["senderRole"];
  senderId: AgentIdentityCode;
  sessionId: string;
  taskId?: string | undefined;
  artifact?: Message["artifact"] | undefined;
  final?: boolean | undefined;
  chunkIndex?: number | undefined;
  lastChunk?: boolean | undefined;
  dataItems: DataItem[];
}

export class InteractionRuntime {
  private sessions = new Map<string, Session>();
  private tasks = new Map<string, Task>();
  private messages = new Map<string, Message[]>();

  async createSession(input: CreateSessionInput): Promise<Session> {
    if (input.receivers.length === 0) {
      throw new Error("A session must contain at least one service agent receiver");
    }
    const session: Session = {
      id: randomUUID(),
      mode: input.mode,
      sender: input.sender,
      receivers: input.receivers,
      context: input.context,
      createdAt: new Date().toISOString()
    };
    this.sessions.set(session.id, session);
    this.messages.set(session.id, []);
    return session;
  }

  async submitTask(input: SubmitTaskInput): Promise<Task> {
    this.requireSession(input.sessionId);
    const task: Task = {
      id: randomUUID(),
      sessionId: input.sessionId,
      state: "accepted",
      stateChangedAt: new Date().toISOString(),
      messages: input.initialMessages ?? [],
      artifacts: input.artifacts
    };
    this.tasks.set(task.id, task);
    if (input.initialMessages?.length) {
      this.messages.set(input.sessionId, [...(this.messages.get(input.sessionId) ?? []), ...input.initialMessages]);
    }
    return task;
  }

  async updateTaskState(taskId: string, state: TaskState): Promise<Task> {
    const task = this.requireTask(taskId);
    const updated: Task = { ...task, state, stateChangedAt: new Date().toISOString() };
    this.tasks.set(taskId, updated);
    return updated;
  }

  async sendMessage(input: SendMessageInput): Promise<Message> {
    this.requireSession(input.sessionId);
    if (input.taskId) {
      this.requireTask(input.taskId);
    }
    const message: Message = {
      senderRole: input.senderRole,
      senderId: input.senderId,
      sessionId: input.sessionId,
      ...(input.taskId ? { taskId: input.taskId } : {}),
      id: randomUUID(),
      ...(input.artifact ? { artifact: input.artifact } : {}),
      ...(input.final !== undefined ? { final: input.final } : {}),
      ...(input.chunkIndex !== undefined ? { chunkIndex: input.chunkIndex } : {}),
      ...(input.lastChunk !== undefined ? { lastChunk: input.lastChunk } : {}),
      dataItems: input.dataItems,
      createdAt: new Date().toISOString()
    };
    this.messages.set(input.sessionId, [...(this.messages.get(input.sessionId) ?? []), message]);
    if (input.taskId) {
      const task = this.requireTask(input.taskId);
      const updated: Task = { ...task, messages: [...(task.messages ?? []), message] };
      this.tasks.set(task.id, updated);
    }
    return message;
  }

  async listMessages(sessionId: string): Promise<Message[]> {
    this.requireSession(sessionId);
    return this.messages.get(sessionId) ?? [];
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    return this.sessions.get(sessionId);
  }

  async getTask(taskId: string): Promise<Task | undefined> {
    return this.tasks.get(taskId);
  }

  private requireSession(sessionId: string): Session {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }
    return session;
  }

  private requireTask(taskId: string): Task {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }
    return task;
  }
}
