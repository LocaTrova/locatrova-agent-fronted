import React from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import type { Message } from "../../../shared/api";
import { STYLES } from "../../constants/styles";

interface ChatSectionProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

/**
 * Chat section component
 * Single Responsibility: Manages chat UI display
 * Follows composition pattern
 */
export default function ChatSection({
  messages,
  onSendMessage,
}: ChatSectionProps) {
  return (
    <section className={STYLES.CONTAINER.SECTION}>
      <div
        aria-live="polite"
        className={`${STYLES.SCROLL.AREA_WITH_BOTTOM} ${STYLES.SPACING.PADDING_RESPONSIVE} py-2 flex flex-col ${STYLES.SPACING.CONTENT_GAP}`}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
      <div className={STYLES.STICKY.BOTTOM}>
        <ChatInput onSend={onSendMessage} />
      </div>
    </section>
  );
}
