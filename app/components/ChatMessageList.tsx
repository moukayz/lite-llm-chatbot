import React from 'react';
import { Message } from '../types/chat';
import { MessageContent, UserMessageContent } from './MessageContent'; // Needed for the inner ChatMessageItem

// Define props for the inner ChatMessageItem
interface ChatMessageItemProps {
  role: string;
  isStreaming: boolean;
  content: string;
}

// Inner ChatMessageItem component (memoized)
const ChatMessageItem = React.memo(function ChatMessageItem({
  role,
  isStreaming,
  content,
}: ChatMessageItemProps) {
  return role === "user" ? (
    <UserMessageContent content={content} />
  ) : (
    <MessageContent content={content} isStreaming={isStreaming} />
  );
});

// Props for the main ChatMessageList component
interface ChatMessageListProps {
  messages: Message[];
  isStreaming: boolean;
}

export const ChatMessageList = React.memo(function ChatMessageList({
  messages,
  isStreaming,
}: ChatMessageListProps) {
  return (
    <>
      {messages.slice(1).map((message, index) => (
        <ChatMessageItem
          key={index} // Keep key here on the mapped item
          role={message.role}
          isStreaming={isStreaming}
          content={message.content}
        />
      ))}
    </>
  );
}); 