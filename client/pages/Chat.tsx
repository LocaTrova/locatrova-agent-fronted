import React from 'react';
import { ChatContainer } from '../components/chat/ChatContainer';

/**
 * Chat page component
 * Simplified to follow Single Responsibility Principle
 * Now only responsible for being the route entry point
 */
export default function ChatPage() {
  return <ChatContainer />;
}
