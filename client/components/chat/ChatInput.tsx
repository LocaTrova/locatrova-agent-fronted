import React from "react";
import SearchInput from "../shared/SearchInput";
import type { ChatMessageHandler } from "../../../shared/api";
import { MESSAGES } from "../../constants";

interface ChatInputProps extends ChatMessageHandler {
  placeholder?: string;
}

/**
 * Chat-specific input component
 * Wrapper around SearchInput with chat-specific defaults
 * Follows Adapter Pattern
 */
export default function ChatInput({
  placeholder = MESSAGES.PLACEHOLDERS.SEARCH_DEFAULT,
  onSend,
}: ChatInputProps) {
  return (
    <SearchInput
      placeholder={placeholder}
      onSubmit={onSend}
      showAttachment={true}
      showStyling={true}
    />
  );
}
