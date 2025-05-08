'use client';

import { useState, useEffect, useCallback } from 'react';
import { defaultSystemPrompt } from '../config/systemPrompt';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { ChatSettings, Message, Model } from '../types/chat';
import { useChat } from '../hooks/useChat';
import { Sidebar } from './Sidebar';
import { DebugPanel } from './DebugPanel';
import { Menu } from 'lucide-react';
import { ChatSession } from './ChatHistory';
import { createChatSession, fetchChatSessions, fetchChatSessionMessages, updateChatSession } from '../services/chatSessionService';

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

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isFinalMessageReceived, setIsFinalMessageReceived] = useState(false);
  
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  // Fetch chat sessions on component mount
  useEffect(() => {
    const loadChatSessions = async () => {
      try {
        const sessions = await fetchChatSessions();
        setChatSessions(sessions);
        
        // If there are sessions and no active chat, set the first one as active
        if (sessions.length > 0 && !activeChatId) {
          setActiveChatId(sessions[0].id);
          const sessionMessages = await fetchChatSessionMessages(sessions[0].id);
          setMessages(sessionMessages);
        }
      } catch (error) {
        console.error('Failed to load chat sessions:', error);
      }
    };
    
    loadChatSessions();
  }, [activeChatId]);

  // Handle chat session selection
  const handleSelectChat = async (chatId: string) => {
    if (chatId === activeChatId) return;
    
    try {
      setActiveChatId(chatId);
      const sessionMessages = await fetchChatSessionMessages(chatId);
      setMessages(sessionMessages);
    } catch (error) {
      console.error(`Failed to load messages for chat session ${chatId}:`, error);
    }
  };

  // Create a new chat session
  const handleNewChat = async () => {
    setMessages([]);
    setActiveChatId(null);
  };

  // Update chat session on server when final message is received
  useEffect(() => {
    const updateSession = async () => {
      if (isFinalMessageReceived && messages.length > 0) {
        try {
          // If we have an active chat id, update it. Otherwise create a new session.
          let session: ChatSession;
          
          if (activeChatId) {
            session = await updateChatSession(activeChatId, messages);
          } else {
            session = await createChatSession(messages);
            setActiveChatId(session.id);
          }
          
          // Update the chat sessions list
          setChatSessions(prevSessions => {
            const existingIndex = prevSessions.findIndex(s => s.id === session.id);
            if (existingIndex >= 0) {
              // Replace the existing session
              const updatedSessions = [...prevSessions];
              updatedSessions[existingIndex] = session;
              return updatedSessions;
            } else {
              // Add the new session
              return [session, ...prevSessions];
            }
          });
          
          setIsFinalMessageReceived(false);
        } catch (error) {
          console.error('Failed to update chat session:', error);
        }
      }
    };
    
    updateSession();
  }, [isFinalMessageReceived, messages, activeChatId]);

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
    setIsFinalMessageReceived(true);
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

  const handleSubmit = async (input: string) => {
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

    // Send the request with the system prompt included
    await sendMessage(newMessages, chatSettings.model.code);
  };

  // Toggle debug panel
  const toggleDebugPanel = useCallback(() => {
    setShowDebugPanel((prev) => !prev);
  }, []);

  return (
    <div className="z-10 w-full flex flex-row relative h-screen overflow-hidden">
      {/* Sidebar - Always render but translate when hidden */}
      <Sidebar
        chatSettings={chatSettings}
        updateChatSettings={updateChatSettings}
        isSidebarVisible={showSidebar}
        setSidebarVisible={setShowSidebar}
        handleNewChat={handleNewChat}
        chatSessions={chatSessions}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
      />

      {/* Overlay to capture clicks when sidebar is shown on mobile */}
      {showSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main chat container */}
      <div className="h-full relative flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-2 flex items-center">
          {!showSidebar && (
            <button
              onClick={() => {
                setShowSidebar(true);
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
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              isStreaming={isStreaming}
            />

            {/* Input area */}
            <div className="p-4 border-t">
              <ChatInput
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