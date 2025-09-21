import { useState, useCallback, useEffect, useRef } from "react";
import type { Message } from "../../shared/api";
import { createInitialMessages, createMessage } from "../utils/messages";
import { useService, SERVICE_TOKENS } from "../services/container";
import type { IGeminiService } from "../services/interfaces/geminiInterfaces";

/**
 * Custom hook for chat functionality with real backend integration
 * Encapsulates chat state and logic (Single Responsibility)
 * Uses dependency injection for service access (Dependency Inversion)
 */
export function useChat(seedQuery?: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const currentAssistantMessageId = useRef<string | null>(null);
  
  // Use dependency injection to get the Gemini service
  const geminiService = useService<IGeminiService>(SERVICE_TOKENS.GEMINI_SERVICE);

  useEffect(() => {
    // Only update messages when seedQuery actually changes value
    // This prevents re-initialization during React Router v7 transitions
    const initialMessages = createInitialMessages(seedQuery);
    setMessages(initialMessages);
  }, [seedQuery]);

  const sendMessage = useCallback(
    async (content: string) => {
      // Add user message
      const userMessage = createMessage("user", content);
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Create assistant message placeholder
      const assistantMessageId = crypto.randomUUID();
      currentAssistantMessageId.current = assistantMessageId;

      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Stream response from backend
      let accumulatedContent = "";

      await geminiService.streamResponse(
        { prompt: content, format: "text" },
        {
          onData: (chunk) => {
            accumulatedContent += chunk;
            // Update the assistant message with accumulated content
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: accumulatedContent }
                  : msg
              )
            );
          },
          onError: (error) => {
            console.error("Chat error:", error);
            // Update message to show error
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: `Error: ${error}` }
                  : msg
              )
            );
            setIsLoading(false);
          },
          onComplete: () => {
            currentAssistantMessageId.current = null;
            setIsLoading(false);
          },
        }
      );
    },
    [geminiService],
  );

  return {
    messages,
    sendMessage,
    isLoading,
  };
}
