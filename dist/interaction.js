import { randomUUID } from "node:crypto";
export class InteractionRuntime {
    sessions = new Map();
    tasks = new Map();
    messages = new Map();
    async createSession(input) {
        if (input.receivers.length === 0) {
            throw new Error("A session must contain at least one service agent receiver");
        }
        const session = {
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
    async submitTask(input) {
        this.requireSession(input.sessionId);
        const task = {
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
    async updateTaskState(taskId, state) {
        const task = this.requireTask(taskId);
        const updated = { ...task, state, stateChangedAt: new Date().toISOString() };
        this.tasks.set(taskId, updated);
        return updated;
    }
    async sendMessage(input) {
        this.requireSession(input.sessionId);
        if (input.taskId) {
            this.requireTask(input.taskId);
        }
        const message = {
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
            const updated = { ...task, messages: [...(task.messages ?? []), message] };
            this.tasks.set(task.id, updated);
        }
        return message;
    }
    async listMessages(sessionId) {
        this.requireSession(sessionId);
        return this.messages.get(sessionId) ?? [];
    }
    async getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
    async getTask(taskId) {
        return this.tasks.get(taskId);
    }
    requireSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error(`Session not found: ${sessionId}`);
        }
        return session;
    }
    requireTask(taskId) {
        const task = this.tasks.get(taskId);
        if (!task) {
            throw new Error(`Task not found: ${taskId}`);
        }
        return task;
    }
}
//# sourceMappingURL=interaction.js.map