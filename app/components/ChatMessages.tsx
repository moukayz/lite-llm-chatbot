import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Message } from '../types/chat';
import { MessageContent } from './MessageContent';
import { ChevronDown } from 'lucide-react';

function normalizeMathMarkdown(markdown: string): string {
  const text = markdown.replace(/\\\[(.*?)\\\]/gs, (_, inside) => `$$${inside}$$`);
  return text;
  // return markdown.replace(
  //   /(^|[\n\r]\s*)\\\[(.*?)\\\]($|[\n\r])/gs,
  //   (_, prefix, inside, suffix) => `${prefix}$$${inside}$$${suffix}`
  // );
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
}

export const ChatMessages = React.memo(function ChatMessages({
  messages,
  isLoading,
  isStreaming,
}: ChatMessagesProps) {
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Handle scrolling
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
      setShowScrollButton(!isAtBottom && scrollHeight > clientHeight);
    }
  }, []);

  // Scroll to bottom function with smooth animation
  const scrollToBottom = useCallback(() => {
    if (lastMessageRef.current) {
      console.log('scrolling to bottom: lastMessageRef');
      lastMessageRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
      });
    } else if (messagesContainerRef.current) {
      console.log('scrolling to bottom: scrollTo');
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // Auto-scroll to bottom on new messages and check if scroll button should be shown
  useEffect(() => {
    // For new messages, scroll immediately
    if (messagesContainerRef.current) {
      if (isStreaming) {
        // During streaming, use instant scroll
        console.log('scrolling to bottom: set scrollTop');
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      } else {
        // For completed messages, use smooth scrolling
        console.log('scrolling to bottom: scrollToBottom');
        scrollToBottom();
      }
    }
    
    // Use setTimeout to let the render complete before checking scroll position
    setTimeout(() => {
      if (messagesContainerRef.current) {
        const { scrollHeight, clientHeight } = messagesContainerRef.current;
        // Only show button if content is scrollable
        if (scrollHeight > clientHeight) {
          handleScroll();
        }
      }
    }, 100);
  }, [messages, scrollToBottom, handleScroll, isStreaming]);

  return (
    <div className="relative h-full flex-1 overflow-hidden">
      <div 
        ref={messagesContainerRef}
        className="h-full overflow-y-auto"
        onScroll={handleScroll}
        // style={{ scrollBehavior: 'smooth' }}
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <h3 className="text-2xl font-semibold mb-2">Lite LLM Chat</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Start a conversation with our AI assistant powered by LLM models.
            </p>
          </div>
        )}
        
        {messages.slice(1).map((message, index, array) => (
          <div
            key={index}
            ref={index === array.length - 1 ? lastMessageRef : null}
            className={`py-5 ${message.role === "user"
                ? "bg-white"
                : "bg-gray-50"
              }`}
          >
            <div className="max-w-3xl mx-auto px-4">
              <div className="flex items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${message.role === "user"
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
          <div 
            className="py-5 bg-gray-50"
            ref={lastMessageRef}
          >
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
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all flex items-center justify-center z-10"
          aria-label="Scroll to bottom"
        >
          <ChevronDown size={24} />
        </button>
      )}
    </div>
  );
}); 