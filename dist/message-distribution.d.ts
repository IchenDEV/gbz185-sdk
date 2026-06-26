import type { InteractionRuntime, SendMessageInput } from "./interaction.js";
import type { AgentIdentityCode, Message } from "./types.js";
export interface DistributionReceipt {
    recipientId: AgentIdentityCode;
    sessionId: string;
    messageId: string;
    deliveredAt: string;
    message: Message;
}
export declare class MessageDistributionRuntime {
    private readonly interactionRuntime;
    private inboxes;
    constructor(interactionRuntime: InteractionRuntime);
    distribute(input: SendMessageInput, recipients?: AgentIdentityCode[]): Promise<DistributionReceipt[]>;
    listInbox(agentId: AgentIdentityCode): Promise<DistributionReceipt[]>;
    private inferRecipients;
}
//# sourceMappingURL=message-distribution.d.ts.map