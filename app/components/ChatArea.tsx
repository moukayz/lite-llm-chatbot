'use client';

import { useState, FormEvent, useRef, useEffect, useCallback } from 'react';
import { defaultSystemPrompt } from '../config/systemPrompt';
import { ChatSettings } from './ChatSettings';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { Message, Model } from '../types/chat';
import { useChat } from '../hooks/useChat';

const availableModels: Model[] = [
  { name: '通义千问-Max', code: 'qwen-max' },
  { name: '通义千问-Plus', code: 'qwen-plus' },
  { name: '通义千问-Turbo', code: 'qwen-turbo' },
];

export function ChatArea() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: defaultSystemPrompt },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState<Model>(availableModels[0]);

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

  // Error handler
  const handleError = useCallback((error: Error) => {
    console.error('Chat error:', error);
  }, []);

  const { isLoading, isStreaming, sendMessage } = useChat({
    onStreamUpdate: handleStreamUpdate,
    onError: handleError
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isStreaming) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Create new message array with user's message
    const updatedMessages = [...messages, userMessage];
    
    // Add a placeholder for assistant's response
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
    
    // Send the request (content updates will happen via streaming callback)
    await sendMessage(updatedMessages, selectedModel.code);
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
      <ChatSettings 
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        availableModels={availableModels}
      />
      
      <ChatMessages 
        messages={messages}
        isLoading={isLoading}
        isStreaming={isStreaming}
        messagesEndRef={messagesEndRef}
      />
      
      <ChatInput 
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        isStreaming={isStreaming}
      />
    </div>
  );
} 