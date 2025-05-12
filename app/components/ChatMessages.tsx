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

  // Handle scrolling
  // console.log("showScrollButton: ", showScrollButton);
  // console.log("ChatMessages rendered");
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
  const scrollToBottom = useCallback((isSmooth: boolean = true) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView({
        behavior: isSmooth ? "smooth" : "instant",
        block: "end",
      });
    }
  }, []);

  useEffect(() => {
    if (isStreaming) {
      console.log("useEffect: isStreaming", cancelAutoScrollRef.current);
      cancelAutoScrollRef.current = false;
    }
  }, [isStreaming]);

  // debug effect
  useEffect(() => {
    // console.log("ChatMessages component mounted");
  });

  // Auto-scroll to bottom on new messages and check if scroll button should be shown
  useEffect(() => {
    // For new messages, scroll immediately
    if (messagesContainerRef.current) {
      if (isStreaming) {
        if (!cancelAutoScrollRef.current) {
          console.log("useEffect: scrollToBottom false");
          scrollToBottom(false);
        }
      } else {
        // For completed messages, use smooth scrolling
        console.log("useEffect: scrollToBottom true");
        scrollToBottom(true);
      }
    }

    // Use setTimeout to let the render complete before checking scroll position
    // setTimeout(() => {
    //   if (ScrollContainerRef.current) {
    //     const { scrollHeight, clientHeight } = ScrollContainerRef.current;
    //     // Only show button if content is scrollable
    //     if (scrollHeight > clientHeight) {
    //       console.log("set timeout: handleScroll");
    //       handleScroll();
    //     }
    //   }
    // }, 100);
  }, [messages, scrollToBottom, isStreaming]);

  return (
    <div className="relative h-full">
      <div
        ref={ScrollContainerRef}
        className="h-full flex flex-col overflow-y-auto"
        onScroll={handleScroll}
      >
        <div ref={messagesContainerRef} className="flex flex-col pb-25">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <h3 className="text-2xl font-semibold mb-2">Lite LLM Chat</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Start a conversation with our AI assistant powered by LLM
                models.
              </p>
            </div>
          )}

          <ChatMessageList
            messages={messages}
            isStreaming={isStreaming}
          />

          {/* {isLoading && (
            <div className="py-5 bg-gray-50" ref={lastMessageRef}>
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
          )} */}
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={() => scrollToBottom(true)}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all flex items-center justify-center z-50"
            aria-label="Scroll to bottom"
          >
            <ChevronDown size={24} />
          </button>
        )}
      </div>
    </div>
  );
}); 