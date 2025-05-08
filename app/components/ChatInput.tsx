import { FormEvent, useRef, useEffect, KeyboardEvent, useState, memo, useCallback } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  handleSubmit: (input: string) => Promise<void>;
  isLoading: boolean;
  isStreaming: boolean;
}

export const ChatInput = memo(function ChatInput({ 
  handleSubmit, 
  isLoading, 
  isStreaming 
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [localInput, setLocalInput] = useState("");
  
  // Handle submission with focus
  const onSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!localInput.trim() || isLoading || isStreaming) return;
    
    handleSubmit(localInput);

    setLocalInput("");
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  }, [localInput, isLoading, isStreaming, handleSubmit]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [localInput]);
  
  // Focus input on component mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Handle text changes efficiently
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalInput(e.target.value);
  }, []);

  // Handle Enter key for submission (Shift+Enter for new line)
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as unknown as FormEvent);
    }
  }, [onSubmit]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={onSubmit} className="relative bg-white rounded-full border shadow-sm">
        <textarea
          ref={textareaRef}
          value={localInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Message the AI..."
          className="w-full resize-none py-3 pl-4 pr-10 max-h-[200px] rounded-lg focus:outline-none"
          rows={1}
        />
        <button
          type="submit"
          disabled={isLoading || isStreaming || !localInput.trim()}
          className="absolute right-2 bottom-2 p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 disabled:hover:bg-transparent disabled:opacity-40"
          aria-label="Send message"
        >
          <Send size={20} className="rotate-90" />
        </button>
      </form>
      <p className="text-xs text-center text-gray-500 mt-2">
        {isLoading || isStreaming ? 'AI is responding...' : 'Press Enter to send, Shift+Enter for new line'}
      </p>
    </div>
  );
}); 