import React from "react";

export type ChatRole = "user" | "assistant";

export interface Message {
  id: string;
  role: ChatRole;
  content: string;
  createdAt?: string;
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={isUser ? "flex justify-end mb-6" : "mb-6"}>
      <div
        className={
          (isUser
            ? "bg-slate-200 text-slate-800"
            : "bg-white text-slate-800 border border-slate-200") +
          " max-w-[90%] sm:max-w-[85%] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm leading-5"
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
