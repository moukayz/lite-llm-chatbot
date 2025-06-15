import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Message } from '../types/chat';
import { ChevronDown } from 'lucide-react';
import { ChatMessageList } from './ChatMessageList';

interface ChatMessagesProps {
  messages: Message[];
  isStreaming: boolean;
}

export const ChatMessages = React.memo(function ChatMessages({
  messages,
  isStreaming,
}: ChatMessagesProps) {
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const ScrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollPositionRef = useRef<number>(0);
  const cancelAutoScrollRef = useRef<boolean>(false);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      // console.log("handleScroll: ", e.currentTarget.scrollTop, lastScrollPositionRef.current);

      const lastPos = lastScrollPositionRef.current;
      lastScrollPositionRef.current = e.currentTarget.scrollTop;
      if (isStreaming) {
        if (lastPos > e.currentTarget.scrollTop) {
          cancelAutoScrollRef.current = true;
        }
      }

      // display or hide the scroll button only when:
      // 1. the chat is not streaming
      // 2. user scrolling up
      if (
        ScrollContainerRef.current &&
        (!isStreaming || cancelAutoScrollRef.current)
      ) {
        const { scrollTop, scrollHeight, clientHeight } =
          ScrollContainerRef.current;
        const isAtBottom =
          Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
        setShowScrollButton(!isAtBottom && scrollHeight > clientHeight);
      }
    },
    [isStreaming]
  );

  // Scroll to bottom function with smooth animation
  const scrollToBottom = useCallback(({ isSmooth = true }: { isSmooth?: boolean } = {}) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView({
        behavior: isSmooth ? "smooth" : "instant", 
        block: "end",
      });
    }
  }, []);

  useEffect(() => {
    if (isStreaming) {
      cancelAutoScrollRef.current = false;
    }
  }, [isStreaming]);

  useEffect(() => {
    // For new messages, scroll immediately
    if (messagesContainerRef.current) {
      const shouldAutoScroll = !isStreaming || !cancelAutoScrollRef.current;
      if (shouldAutoScroll) {
        console.log("useEffect: scrollToBottom , isStreaming: ", isStreaming);
        scrollToBottom({ isSmooth: !isStreaming });
      }
    }
  }, [messages, scrollToBottom, isStreaming]);

  return (
    <div className="relative h-full">
      {messages.length > 0 && (
        <div
          ref={ScrollContainerRef}
          className="h-full flex flex-col overflow-y-auto"
          onScroll={handleScroll}
        >
          <div ref={messagesContainerRef} className="flex flex-col pb-40">
            <ChatMessageList messages={messages} isStreaming={isStreaming} />
          </div>

          {showScrollButton && (
            <button
              onClick={() => scrollToBottom({ isSmooth: true })}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all flex items-center justify-center z-50"
              aria-label="Scroll to bottom"
            >
              <ChevronDown size={24} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}); 