import React from "react";
import type { Message } from "../../../shared/api";

export { type Message } from "../../../shared/api";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex"}>
      <div
        className={
          (isUser
            ? "bg-[rgba(255,152,59,0.18)] text-slate-900 border border-orange-300"
            : "bg-white text-slate-800 border border-slate-200") +
          " max-w-[90%] sm:max-w-[85%] rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm leading-5"
        }
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {message.createdAt && (
          <div className="mt-2 text-xs text-gray-400">{message.createdAt}</div>
        )}
      </div>
    </div>
  );
}
