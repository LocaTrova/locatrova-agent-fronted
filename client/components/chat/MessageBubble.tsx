import React from "react";
import type { Message } from "../../../shared/api";
import { COMPONENT_STYLES } from "@/constants/styles";
import { cn } from "@/lib/utils";

export { type Message } from "../../../shared/api";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const wrapperClass = isUser
    ? COMPONENT_STYLES.MESSAGE_BUBBLE.WRAPPER_USER
    : COMPONENT_STYLES.MESSAGE_BUBBLE.WRAPPER_ASSISTANT;
  const bubbleClass = cn(
    COMPONENT_STYLES.MESSAGE_BUBBLE.CONTENT,
    isUser
      ? COMPONENT_STYLES.MESSAGE_BUBBLE.USER
      : COMPONENT_STYLES.MESSAGE_BUBBLE.ASSISTANT,
  );

  return (
    <div className={wrapperClass}>
      <div className={bubbleClass}>
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {message.createdAt && (
          <div className={"mt-2 " + COMPONENT_STYLES.MESSAGE_BUBBLE.TIMESTAMP}>
            {message.createdAt}
          </div>
        )}
      </div>
    </div>
  );
}
