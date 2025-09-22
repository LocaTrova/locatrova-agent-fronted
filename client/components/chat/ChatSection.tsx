import React from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import type { Message } from "../../../shared/api";
import { STYLES } from "../../constants/styles";
import { useEffect, useRef } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  return (
    <section
      aria-label="Conversation"
      className={`${STYLES.CONTAINER.SECTION} border border-orange-200/40 ring-1 ring-orange-300/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)]`}
    >
      <header className={`${STYLES.STICKY.TOP} px-4 sm:px-6 py-2`}>
        <h2 className="text-sm font-medium text-slate-600">Chat</h2>
      </header>
      <div
        ref={scrollRef}
        aria-live="polite"
        className={`${STYLES.SCROLL.AREA_WITH_BOTTOM} ${STYLES.SPACING.PADDING_RESPONSIVE} py-3 sm:py-4 flex flex-col ${STYLES.SPACING.CONTENT_GAP}`}
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
