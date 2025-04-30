import { FormEvent, useRef, useEffect, KeyboardEvent } from 'react';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Handle submission with focus
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isStreaming) return;
    
    await handleSubmit(e);
    // Refocus the input after submission
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);
  
  // Focus input on component mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Handle Enter key for submission (Shift+Enter for new line)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      <form onSubmit={onSubmit} className="relative bg-white rounded-lg border shadow-sm">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message the AI..."
          className="w-full resize-none py-3 pl-4 pr-10 max-h-[200px] rounded-lg focus:outline-none"
          rows={1}
        />
        <button
          type="submit"
          disabled={isLoading || isStreaming || !input.trim()}
          className="absolute right-2 bottom-2 p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 disabled:hover:bg-transparent disabled:opacity-40"
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 rotate-90">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </form>
      <p className="text-xs text-center text-gray-500 mt-2">
        {isLoading || isStreaming ? 'AI is responding...' : 'Press Enter to send, Shift+Enter for new line'}
      </p>
    </div>
  );
} 