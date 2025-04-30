import { FormEvent, useRef, useEffect } from 'react';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  isLoading: boolean;
  isStreaming: boolean;
}

export function ChatInput({ 
  input, 
  setInput, 
  handleSubmit, 
  isLoading, 
  isStreaming 
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle submission with focus
  const onSubmit = async (e: FormEvent) => {
    await handleSubmit(e);
    // Refocus the input after submission
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  
  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={onSubmit} className="border-t p-4">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          // Input is always enabled, even during loading/streaming
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
  );
} 