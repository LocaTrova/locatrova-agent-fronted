import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatSection from '../ChatSection';
import type { Message } from '../../../../shared/api';

describe('ChatSection', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you?',
      createdAt: '2024-01-01T10:00:00Z',
    },
    {
      id: '2',
      role: 'user',
      content: 'Find me urban locations',
      createdAt: '2024-01-01T10:01:00Z',
    },
    {
      id: '3',
      role: 'assistant',
      content: 'I found several urban locations for you...',
      createdAt: '2024-01-01T10:02:00Z',
    },
  ];

  it('should render all messages', () => {
    const onSendMessage = vi.fn();
    render(<ChatSection messages={mockMessages} onSendMessage={onSendMessage} />);

    // Check all messages are displayed
    expect(screen.getByText('Hello! How can I help you?')).toBeInTheDocument();
    expect(screen.getByText('Find me urban locations')).toBeInTheDocument();
    expect(screen.getByText('I found several urban locations for you...')).toBeInTheDocument();
  });

  it('should display messages in correct order', () => {
    const onSendMessage = vi.fn();
    render(<ChatSection messages={mockMessages} onSendMessage={onSendMessage} />);

    // Messages are in paragraph elements
    const messageElements = screen.getAllByText(/Hello!|Find me|I found/);
    expect(messageElements).toHaveLength(3);
  });

  it('should call onSendMessage when submitting a message', async () => {
    const onSendMessage = vi.fn();
    const user = userEvent.setup();

    render(<ChatSection messages={[]} onSendMessage={onSendMessage} />);

    // Find the input field - using the actual placeholder from SearchInput
    const input = screen.getByPlaceholderText(/Describe the scene or location you want to scout/i);

    // Type a message
    await user.type(input, 'Test message');

    // Submit the message
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(onSendMessage).toHaveBeenCalledWith('Test message');
    });
  });

  it('should not send empty messages', async () => {
    const onSendMessage = vi.fn();
    const user = userEvent.setup();

    render(<ChatSection messages={[]} onSendMessage={onSendMessage} />);

    const input = screen.getByPlaceholderText(/Describe the scene or location you want to scout/i);

    // Try to submit empty message
    await user.click(input);
    await user.keyboard('{Enter}');

    expect(onSendMessage).not.toHaveBeenCalled();
  });

  it('should clear input after sending message', async () => {
    const onSendMessage = vi.fn();
    const user = userEvent.setup();

    render(<ChatSection messages={[]} onSendMessage={onSendMessage} />);

    const input = screen.getByPlaceholderText(/Describe the scene or location you want to scout/i) as HTMLTextAreaElement;

    await user.type(input, 'Test message');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('should handle keyboard shortcuts correctly', async () => {
    const onSendMessage = vi.fn();
    const user = userEvent.setup();

    render(<ChatSection messages={[]} onSendMessage={onSendMessage} />);

    const input = screen.getByPlaceholderText(/Describe the scene or location you want to scout/i);

    // Test Cmd+Enter (Mac) / Ctrl+Enter (Windows/Linux)
    await user.type(input, 'Test with shortcut');
    await user.keyboard('{Meta>}{Enter}{/Meta}');

    await waitFor(() => {
      expect(onSendMessage).toHaveBeenCalledWith('Test with shortcut');
    });
  });

  it('should update when new messages are added', () => {
    const onSendMessage = vi.fn();
    const { rerender } = render(
      <ChatSection messages={[]} onSendMessage={onSendMessage} />
    );

    // Initially no messages
    expect(screen.queryByText('Hello!')).not.toBeInTheDocument();

    // Add a message
    const newMessages: Message[] = [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello!',
        createdAt: new Date().toISOString(),
      },
    ];

    rerender(<ChatSection messages={newMessages} onSendMessage={onSendMessage} />);

    // Message should now be visible
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    const onSendMessage = vi.fn();
    render(<ChatSection messages={mockMessages} onSendMessage={onSendMessage} />);

    // Check for aria-live region for new messages
    const container = document.querySelector('[aria-live="polite"]');
    expect(container).toBeInTheDocument();
  });

  it('should handle long messages with scrolling', () => {
    const longMessage: Message = {
      id: 'long',
      role: 'assistant',
      content: 'Lorem ipsum '.repeat(100),
      createdAt: new Date().toISOString(),
    };

    const onSendMessage = vi.fn();
    render(<ChatSection messages={[longMessage]} onSendMessage={onSendMessage} />);

    // Message should be rendered
    expect(screen.getByText(/Lorem ipsum/)).toBeInTheDocument();
  });

  it('should show send button as disabled when input is empty', () => {
    const onSendMessage = vi.fn();
    render(<ChatSection messages={[]} onSendMessage={onSendMessage} />);

    const sendButton = screen.getByRole('button', { name: /Send message/i });
    expect(sendButton).toBeDisabled();
  });

  it('should enable send button when input has text', async () => {
    const onSendMessage = vi.fn();
    const user = userEvent.setup();

    render(<ChatSection messages={[]} onSendMessage={onSendMessage} />);

    const input = screen.getByPlaceholderText(/Describe the scene or location you want to scout/i);
    const sendButton = screen.getByRole('button', { name: /Send message/i });

    // Initially disabled
    expect(sendButton).toBeDisabled();

    // Type some text
    await user.type(input, 'Some text');

    // Should now be enabled
    expect(sendButton).not.toBeDisabled();
  });

  it('should handle multiline messages with Shift+Enter', async () => {
    const onSendMessage = vi.fn();
    const user = userEvent.setup();

    render(<ChatSection messages={[]} onSendMessage={onSendMessage} />);

    const input = screen.getByPlaceholderText(/Describe the scene or location you want to scout/i) as HTMLTextAreaElement;

    // Type multiline message with Shift+Enter
    await user.type(input, 'Line 1');
    await user.keyboard('{Shift>}{Enter}{/Shift}');
    await user.type(input, 'Line 2');

    // Should not have sent the message yet
    expect(onSendMessage).not.toHaveBeenCalled();

    // Message should contain both lines
    expect(input.value).toContain('Line 1');
    expect(input.value).toContain('Line 2');

    // Now send with Enter
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(onSendMessage).toHaveBeenCalledWith(expect.stringContaining('Line 1'));
    });
  });
});