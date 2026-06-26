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
export declare class InteractionRuntime {
    private sessions;
    private tasks;
    private messages;
    createSession(input: CreateSessionInput): Promise<Session>;
    submitTask(input: SubmitTaskInput): Promise<Task>;
    updateTaskState(taskId: string, state: TaskState): Promise<Task>;
    sendMessage(input: SendMessageInput): Promise<Message>;
    listMessages(sessionId: string): Promise<Message[]>;
    getSession(sessionId: string): Promise<Session | undefined>;
    getTask(taskId: string): Promise<Task | undefined>;
    private requireSession;
    private requireTask;
}
//# sourceMappingURL=interaction.d.ts.map