import {
  FormEvent,
  useRef,
  useEffect,
  KeyboardEvent,
  useState,
  memo,
  useCallback,
} from "react";
import { CircleStop, Send } from "lucide-react";
import { useTransition } from "react";

interface ChatInputProps {
  handleSubmit: (input: string) => Promise<void>;
  handleAbort: () => void;
  isStreaming: boolean;
}

export const ChatInput = memo(function ChatInput({
  handleSubmit,
  handleAbort,
  isStreaming,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [localInput, setLocalInput] = useState("");
  const [, startTransition] = useTransition();

  // Handle submission with focus
  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!localInput.trim() || isStreaming) return;

      setLocalInput("");
      startTransition(() => {
        handleSubmit(localInput);
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 0);
      });
    },
    [localInput, isStreaming, handleSubmit]
  );

  // Auto-resize textarea
  const textarea = textareaRef.current;
  if (textarea) {
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }

  // Focus input on component mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Handle text changes efficiently
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLocalInput(e.target.value);
    },
    []
  );

  // Handle Enter key for submission (Shift+Enter for new line)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        onSubmit(e as unknown as FormEvent);
      }
    },
    [onSubmit]
  );

  return (
    <div className="w-full max-w-3xl mx-auto ">
      <form
        onSubmit={onSubmit}
        className="relative  overflow-hidden flex items-center justify-center bg-white rounded-full border shadow-sm"
      >
        <textarea
          ref={textareaRef}
          value={localInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Message the AI..."
          className="w-full resize-none py-5 pl-4 pr-10 max-h-[300px] rounded-full focus:outline-none"
          rows={1}
        />
        {!isStreaming ? (
          <button
            type="submit"
            disabled={!localInput.trim()}
            className=" p-2 pr-4 rounded-md text-gray-700 hover:text-gray-500 hover:bg-gray-200 disabled:hover:bg-transparent disabled:opacity-40"
            aria-label="Send message"
          >
            <Send size={30} className="rotate-90" />
          </button>
        ) : (
          <button
            type="button"
            className=" p-2 pr-4 rounded-md text-gray-700 hover:text-gray-500 hover:bg-gray-100 disabled:hover:bg-transparent disabled:opacity-40"
            aria-label="Abort"
            onClick={handleAbort}
          >
            <CircleStop size={30} className="rotate-90" />
          </button>
        )}
      </form>
      <p className="text-xs text-center text-gray-500 mt-2">
        {isStreaming
          ? "AI is responding..."
          : "Press Enter to send, Shift+Enter for new line"}
      </p>
    </div>
  );
});
