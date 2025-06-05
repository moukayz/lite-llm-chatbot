import React from 'react';
import { Message } from '../types/chat';
import { AssistantMessageContent, UserMessageContent } from './MessageContent'; // Needed for the inner ChatMessageItem

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
        message.role === 'user' ? (
          <UserMessageContent key={index} content={message.content} />
        ) : (
          <AssistantMessageContent key={index} content={message} isStreaming={isStreaming} />
        )
      ))}
    </>
  );
}); 