import { RefObject } from 'react';
import { MessageContent } from './MessageContent';
import { Message } from '../types/chat';

function normalizeMathMarkdown(markdown: string): string {
  return markdown.replace(
    /(^|[\n\r])\\\[([\s\S]*?)\\\]($|[\n\r])/g,
    (_, prefix, inside, suffix) => `${prefix}$$${inside}$$${suffix}`
  );
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export function ChatMessages({ 
  messages, 
  isLoading, 
  isStreaming, 
  messagesEndRef 
}: ChatMessagesProps) {
  return (
    <div className="h-[500px] overflow-y-auto p-4 flex flex-col gap-4">
      {messages.slice(1).map((message, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg ${
            message.role === "user"
              ? "bg-blue-100 ml-auto max-w-[80%]"
              : "bg-gray-100 mr-auto max-w-[90%]"
          }`}
        >
          <MessageContent
            role={message.role}
            content={normalizeMathMarkdown(message.content)}
            isStreaming={isStreaming}
          />
        </div>
      ))}
      {isLoading && (
        <div className="bg-gray-100 p-3 rounded-lg mr-auto animate-pulse">
          Thinking...
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
} 