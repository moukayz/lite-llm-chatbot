import { useState } from 'react';
import { Message } from '../types/chat';

interface UseChatOptions {
  onError?: (error: Error) => void;
  onStreamUpdate?: (updatedContent: string) => void;
  onFinalResponse?: (finalContent: string) => void;
}

export function useChat(options?: UseChatOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async (
    messages: Message[],
    modelCode: string
  ): Promise<Message> => {
    setIsLoading(true);
    
    try {
      // Create new assistant message that we'll stream into
      const assistantMessage: Message = { role: 'assistant', content: '' };
      
      setIsLoading(false);
      setIsStreaming(true);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          model: modelCode,
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
                // Update the assistant message with new content
                assistantMessage.content = accumulatedContent;
                
                // Call the callback if provided to update UI in real-time
                if (options?.onStreamUpdate) {
                  options.onStreamUpdate(accumulatedContent);
                }
              }
            } catch (err) {
              console.error('Error parsing stream data:', err);
            }
          }
        }
      }
      
      // Send the final, complete response when streaming is done
      if (options?.onFinalResponse) {
        options.onFinalResponse(accumulatedContent);
      }

      return assistantMessage;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Chat error:', errorMessage);
      
      if (options?.onError) {
        options.onError(error instanceof Error ? error : new Error(errorMessage));
      }
      
      return { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return {
    isLoading,
    isStreaming,
    sendMessage,
  };
} 