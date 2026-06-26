import type { InteractionRuntime, SendMessageInput } from "./interaction.js";
import type { AgentIdentityCode, Message } from "./types.js";

export interface DistributionReceipt {
  recipientId: AgentIdentityCode;
  sessionId: string;
  messageId: string;
  deliveredAt: string;
  message: Message;
}

export class MessageDistributionRuntime {
  private inboxes = new Map<AgentIdentityCode, DistributionReceipt[]>();

  constructor(private readonly interactionRuntime: InteractionRuntime) {}

  async distribute(input: SendMessageInput, recipients?: AgentIdentityCode[]): Promise<DistributionReceipt[]> {
    const message = await this.interactionRuntime.sendMessage(input);
    const targetRecipients = recipients ?? (await this.inferRecipients(input.sessionId, input.senderId));
    const receipts = targetRecipients
      .filter((recipientId) => recipientId !== input.senderId)
      .map((recipientId): DistributionReceipt => ({
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

  async listInbox(agentId: AgentIdentityCode): Promise<DistributionReceipt[]> {
    return this.inboxes.get(agentId) ?? [];
  }

  private async inferRecipients(sessionId: string, senderId: AgentIdentityCode): Promise<AgentIdentityCode[]> {
    const session = await this.interactionRuntime.getSession(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }
    return [session.sender.agentId, ...session.receivers.map((receiver) => receiver.agentId)].filter((agentId) => agentId !== senderId);
  }
}
