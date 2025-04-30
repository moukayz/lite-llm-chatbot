'use client';

import { useState, FormEvent, useRef, useEffect, useCallback } from 'react';
import { defaultSystemPrompt } from '../config/systemPrompt';
import { ChatSettings } from './ChatSettings';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { SystemPromptEditor } from './SystemPromptEditor';
import { Message, Model } from '../types/chat';
import { useChat } from '../hooks/useChat';

const availableModels: Model[] = [
  { name: '通义千问-Max', code: 'qwen-max' },
  { name: '通义千问-Plus', code: 'qwen-plus' },
  { name: '通义千问-Turbo', code: 'qwen-turbo' },
];

export function ChatArea() {
  const [input, setInput] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState<Model>(availableModels[0]);
  const [finalResponse, setFinalResponse] = useState<string>('');
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
  const handleFinalResponse = useCallback((completeContent: string) => {
    setFinalResponse(completeContent);
  }, []);

  // Error handler
  const handleError = useCallback((error: Error) => {
    console.error('Chat error:', error);
  }, []);

  const { isLoading, isStreaming, sendMessage } = useChat({
    onStreamUpdate: handleStreamUpdate,
    onError: handleError,
    onFinalResponse: handleFinalResponse
  });

  // Handle system prompt updates
  const handleUpdateSystemPrompt = useCallback((newPrompt: string) => {
    setSystemPrompt(newPrompt);
    // The updated prompt will be used in the next conversation
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isStreaming) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setFinalResponse(''); // Clear the previous final response

    // Create message array with current system prompt and all previous messages
    const messagesWithSystem: Message[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];
    
    // Add a placeholder for assistant's response
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
    
    // Send the request with the system prompt included
    await sendMessage(messagesWithSystem, selectedModel.code);
  };

  // Toggle debug panel
  const toggleDebugPanel = useCallback(() => {
    setShowDebugPanel(prev => !prev);
  }, []);

  return (
    <div className="flex w-full  mx-auto max-w-6xl">
      {/* Left sidebar with system prompt editor */}
      <div className="w-1/4 flex-shrink-0">
        <SystemPromptEditor 
          onUpdateSystemPrompt={handleUpdateSystemPrompt}
          currentSystemPrompt={systemPrompt}
        />
      </div>
      
      {/* Main chat area */}
      <div className="w-2/4 flex-grow bg-white rounded-xl ml-4 shadow-lg overflow-hidden flex flex-col">
        <div className="flex justify-between items-center bg-gray-50 border-b px-4 py-2">
          <div className="flex-grow">
            <ChatSettings 
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              availableModels={availableModels}
            />
          </div>
          <button 
            onClick={toggleDebugPanel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 ml-2 rounded-md text-sm font-medium"
          >
            {showDebugPanel ? 'Hide Debug' : 'Show Debug'}
          </button>
        </div>
        
        <div className="flex-grow overflow-auto">
          <ChatMessages 
            messages={messages} 
            isLoading={isLoading}
            isStreaming={isStreaming}
            messagesEndRef={messagesEndRef}
          />
        </div>
        
        <ChatInput 
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          isStreaming={isStreaming}
        />
      </div>

      {/* Debug panel */}
      {showDebugPanel && (
        <div className="w-1/4 ml-4 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-lg p-4 h-full overflow-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Debug Panel</h3>
              <button 
                onClick={toggleDebugPanel}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">Complete Response:</span>
            </div>
            <div className="bg-gray-100 p-3 rounded-md whitespace-pre-wrap font-mono text-sm overflow-auto max-h-[calc(100vh-200px)]">
              {finalResponse || 'No response yet'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 