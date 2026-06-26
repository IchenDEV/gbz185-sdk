export class MessageDistributionRuntime {
    interactionRuntime;
    inboxes = new Map();
    constructor(interactionRuntime) {
        this.interactionRuntime = interactionRuntime;
    }
    async distribute(input, recipients) {
        const message = await this.interactionRuntime.sendMessage(input);
        const targetRecipients = recipients ?? (await this.inferRecipients(input.sessionId, input.senderId));
        const receipts = targetRecipients
            .filter((recipientId) => recipientId !== input.senderId)
            .map((recipientId) => ({
            recipientId,
            sessionId: input.sessionId,
            messageId: message.id,
            deliveredAt: new Date().toISOString(),
            message
        }));
        for (const receipt of receipts) {
            this.inboxes.set(receipt.recipientId, [...(this.inboxes.get(receipt.recipientId) ?? []), receipt]);
        }
        return receipts;
    }
    async listInbox(agentId) {
        return this.inboxes.get(agentId) ?? [];
    }
    async inferRecipients(sessionId, senderId) {
        const session = await this.interactionRuntime.getSession(sessionId);
        if (!session) {
            throw new Error(`Session not found: ${sessionId}`);
        }
        return [session.sender.agentId, ...session.receivers.map((receiver) => receiver.agentId)].filter((agentId) => agentId !== senderId);
    }
}
//# sourceMappingURL=message-distribution.js.map