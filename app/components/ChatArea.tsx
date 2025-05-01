'use client';

import { useState, FormEvent, useRef, useEffect, useCallback } from 'react';
import { defaultSystemPrompt } from '../config/systemPrompt';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { ChatSettings, Message, Model } from '../types/chat';
import { useChat } from '../hooks/useChat';
import { Sidebar } from './Sidebar';
import { DebugPanel } from './DebugPanel';
import { Menu } from 'lucide-react';

const availableModels: Model[] = [
  { name: '通义千问-Max', code: 'qwen-max' },
  { name: '通义千问-Plus', code: 'qwen-plus' },
  { name: '通义千问-Turbo', code: 'qwen-turbo' },
];

export function ChatArea() {
  const [chatSettings, setChatSettings] = useState({
    systemPrompt: defaultSystemPrompt,
    model: availableModels[0],
    availableModels: availableModels
  });

  const updateChatSettings = (updates: Partial<ChatSettings>) => {
    setChatSettings((prev) => ({ ...prev, ...updates }));
  };

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);

  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [sidebarWidth, setSidebarWidth] = useState<number>(500);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Streaming update handler
  const handleStreamUpdate = useCallback((updatedContent: string) => {
    setMessages((prev) => {
      const newMessages = [...prev];
      // Update the last message with the new content
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1].content = updatedContent;
      }
      return newMessages;
    });
  }, []);

  // Final response handler
  const handleFinalResponse = useCallback(() => {
    // No longer needed since finalResponse state was removed
  }, []);

  // Error handler
  const handleError = useCallback((error: Error) => {
    console.error("Chat error:", error);
  }, []);

  const { isLoading, isStreaming, sendMessage } = useChat({
    onStreamUpdate: handleStreamUpdate,
    onError: handleError,
    onFinalResponse: handleFinalResponse,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isStreaming) return;

    const newMessages = [...messages];
    // update system prompt if necessary
    if (newMessages.length > 0 && newMessages[0].role === "system") { 
      newMessages[0].content = chatSettings.systemPrompt;
    } else {
      newMessages.unshift({ role: "system", content: chatSettings.systemPrompt });
    }

    newMessages.push({ role: "user", content: input });
    newMessages.push({ role: "assistant", content: "" });
    setMessages(newMessages);

    setInput("");

    // Send the request with the system prompt included
    await sendMessage(newMessages, chatSettings.model.code);
  };

  // Toggle debug panel
  const toggleDebugPanel = useCallback(() => {
    setShowDebugPanel((prev) => !prev);
  }, []);

  return (
    <div className="z-10 w-full flex flex-row relative h-screen">
      {/* Sidebar - Always render but translate when hidden */}
      <Sidebar
        chatSettings={chatSettings}
        updateChatSettings={updateChatSettings}
        sidebarWidth={sidebarWidth}
        isSidebarVisible={showSidebar}
        setSidebarWidth={setSidebarWidth}
        setSidebarVisible={setShowSidebar}
        handleNewChat={handleNewChat}
      />

      {/* Overlay to capture clicks when sidebar is shown on mobile */}
      {showSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main chat container */}
      <div
        // style={{ marginLeft: showSidebar ? `${sidebarWidth}px` : "0" }}
        className="h-full relative flex flex-col flex-1"
      >
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-2 flex items-center">
          {!showSidebar && (
            <button
              onClick={() => {
                setShowSidebar(true)
                console.log("sidebar width: ", sidebarWidth)
              }}
              className="mr-3 p-1 rounded hover:bg-gray-100 transition-all"
            >
              <Menu size={20} />
            </button>
          )}
          <h2 className="text-lg font-medium flex-grow">
            <span className="p-1 text-gray-600 rounded-md bg-yellow-200">
              Chat with {chatSettings.model.name}
            </span>
          </h2>
          <button
            onClick={toggleDebugPanel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-medium flex items-center transition-colors"
          >
            {showDebugPanel ? "Hide Debug" : "Debug"}
          </button>
        </div>

        {/* Chat content container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Messages area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto bg-white">
              <ChatMessages
                messages={messages}
                isLoading={isLoading}
                isStreaming={isStreaming}
                messagesEndRef={messagesEndRef}
              />
            </div>

            {/* Input area */}
            <div className="p-4 border-t">
              <ChatInput
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                isStreaming={isStreaming}
              />
            </div>
          </div>

          {/* Debug panel */}
          <DebugPanel 
            showDebugPanel={showDebugPanel}
            toggleDebugPanel={toggleDebugPanel}
            messages={messages}
          />
        </div>
      </div>
    </div>
  );
} 