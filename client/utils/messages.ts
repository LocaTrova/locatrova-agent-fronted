import type { Message, ChatRole } from "../../shared/api";
import { MESSAGES, TIMING } from "../constants";

/**
 * Create a new message object
 * Factory pattern for consistent message creation
 */
export function createMessage(role: ChatRole, content: string): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Create initial chat messages based on seed query
 */
export function createInitialMessages(seedQuery?: string | null): Message[] {
  const messages: Message[] = [];

  if (seedQuery) {
    messages.push(createMessage("user", seedQuery));
    messages.push(
      createMessage("assistant", MESSAGES.ASSISTANT.INITIAL_WITH_SEED),
    );
  } else {
    messages.push(
      createMessage("assistant", MESSAGES.ASSISTANT.INITIAL_NO_SEED),
    );
  }

  return messages;
}

/**
 * Add a user message and generate assistant response
 * Open/Closed Principle: Can be extended with different response strategies
 */
export function addUserMessage(
  messages: Message[],
  content: string,
  responseDelay = TIMING.ASSISTANT_RESPONSE_DELAY,
): { messages: Message[]; responsePromise: Promise<Message> } {
  const userMessage = createMessage("user", content);
  const newMessages = [...messages, userMessage];

  const responsePromise = new Promise<Message>((resolve) => {
    setTimeout(() => {
      const assistantMessage = createMessage(
        "assistant",
        MESSAGES.ASSISTANT.RESPONSE_DEFAULT,
      );
      resolve(assistantMessage);
    }, responseDelay);
  });

  return { messages: newMessages, responsePromise };
}
