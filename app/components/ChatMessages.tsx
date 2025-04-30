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
    <div className="h-full overflow-y-auto">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center px-4">
          <h3 className="text-2xl font-semibold mb-2">Lite LLM Chat</h3>
          <p className="text-gray-600 mb-6 max-w-md">
            Start a conversation with our AI assistant powered by LLM models.
          </p>
        </div>
      )}
      
      {messages.slice(1).map((message, index) => (
        <div
          key={index}
          className={`py-5 ${
            message.role === "user"
              ? "bg-white"
              : "bg-gray-50"
          }`}
        >
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                message.role === "user"
                  ? "bg-gray-300"
                  : "bg-green-500 text-white"
              }`}>
                {message.role === "user" ? "U" : "A"}
              </div>
              <div className="flex-1">
                <MessageContent
                  role={message.role}
                  content={normalizeMathMarkdown(message.content)}
                  isStreaming={isStreaming}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="py-5 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
                A
              </div>
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} className="h-12" />
    </div>
  );
} 