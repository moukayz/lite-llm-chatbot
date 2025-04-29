'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { MessageContent } from './components/MessageContent';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

function normalizeMathMarkdown(markdown: string): string {
  return markdown.replace(
    /(^|[\n\r])\\\[(.*?)\\\]($|[\n\r])/gs,
    (_, prefix, inside, suffix) => `${prefix}$$${inside}$$${suffix}`
  );
}

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'You are a helpful assistant.' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isStreaming) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Add an empty assistant message that we'll stream content into
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
      setIsLoading(false);
      setIsStreaming(true);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      // Process the streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedContent = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          const chunkText = decoder.decode(value);
          const lines = chunkText
            .split('\n\n')
            .filter(line => line.startsWith('data: '))
            .map(line => line.replace('data: ', ''));

          for (const line of lines) {
            if (line === '[DONE]') continue;
            
            try {
              const { text } = JSON.parse(line);
              if (text) {
                accumulatedContent += text;
                // Update the last message with the accumulated content
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content = accumulatedContent;
                  return newMessages;
                });
              }
            } catch (err) {
              console.error('Error parsing stream data:', err);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => {
        // If we're streaming, update the last message
        if (isStreaming) {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = 'Sorry, I encountered an error. Please try again.';
          return newMessages;
        }
        // Otherwise add a new error message
        return [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }];
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center justify-between">
        <h1 className="mb-8 text-3xl font-bold text-center">ChatBot</h1>

        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
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

          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || isStreaming}
              />
              <button
                type="submit"
                disabled={isLoading || isStreaming || !input.trim()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
