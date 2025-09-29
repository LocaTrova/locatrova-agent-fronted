import React from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import type { Message } from "../../../shared/api";
import { STYLES, TYPE } from "../../constants/styles";
import { useEffect, useRef } from "react";
import { MessageSquareDashed } from "lucide-react";

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

  const messageCount = messages.length;
  const headerHint =
    messageCount === 0
      ? "Share a prompt to start curating locations."
      : "Refine your brief or ask follow-up questions.";
  const messageLabel =
    messageCount === 0
      ? "No messages yet"
      : `${messageCount} ${messageCount === 1 ? "message" : "messages"}`;

  return (
    <section
      aria-label="Conversation"
      className={`${STYLES.CONTAINER.SECTION} border border-orange-200/40 ring-1 ring-orange-300/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)]`}
    >
      <header className={`${STYLES.STICKY.TOP} px-4 sm:px-6 py-3`}>
        <div className="flex flex-wrap items-baseline justify-between gap-y-1">
          <div className="flex flex-col gap-1">
            <h2 className={`${TYPE.SECTION_LABEL} text-slate-700`}>Chat</h2>
            <p className="text-xs text-slate-500">{headerHint}</p>
          </div>
          <span
            className="text-[11px] font-medium text-slate-400 sm:text-xs"
            aria-live="polite"
          >
            {messageLabel}
          </span>
        </div>
      </header>
      <div
        ref={scrollRef}
        aria-live="polite"
        className={`${STYLES.SCROLL.AREA_WITH_BOTTOM} ${STYLES.SPACING.PADDING_RESPONSIVE} py-3 sm:py-4 flex flex-col ${STYLES.SPACING.CONTENT_GAP}`}
      >
        {messageCount === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-orange-200/60 bg-white/70 px-6 py-10 text-center text-slate-500">
            <MessageSquareDashed className="h-8 w-8 text-orange-400" aria-hidden />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">
                Start the conversation
              </p>
              <p className="text-xs text-slate-500">
                Describe the mood, setting, or shot you need and I’ll curate locations.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
      </div>
      <div className={STYLES.STICKY.BOTTOM}>
        <ChatInput onSend={onSendMessage} />
      </div>
    </section>
  );
}
