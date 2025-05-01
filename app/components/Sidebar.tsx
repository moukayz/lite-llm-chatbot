import { SystemPromptEditor } from './SystemPromptEditor';
import { ChatModelSelector } from './ChatModelSettings';
import { ChatSettings } from '../types/chat';
import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface SidebarProps {
  chatSettings: ChatSettings;
  updateChatSettings: (updates: Partial<ChatSettings>) => void;
  sidebarWidth: number;
  isSidebarVisible: boolean;
  setSidebarWidth: Dispatch<SetStateAction<number>>;
  setSidebarVisible: Dispatch<SetStateAction<boolean>>;
}

export function Sidebar({
  chatSettings,
  updateChatSettings,
  isSidebarVisible,
  sidebarWidth,
  setSidebarWidth,
  setSidebarVisible,
}: SidebarProps) {
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const MIN_WIDTH = 180;
  const MAX_WIDTH = 500;

  // Handle mouse down on the resize handle
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  const transitionTypeClass = isResizing
    ? "transition-none" // disables ALL transitions
    : "transition-[width] duration-200 ease-in-out";

  // Handle mouse move when resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      // Calculate new width based on mouse position
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, e.clientX));

      // Notify parent component about width change
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <aside
      ref={sidebarRef}
      style={{
        width: `${isSidebarVisible ? sidebarWidth : 0}px`,
      }}
      className={`bg-gray-900 text-white overflow-hidden relative h-full flex flex-col border-r border-gray-700 z-10 
        ${transitionTypeClass}`}
    >
      <div
        className={`h-full px-4 py-2 flex flex-col relative transition-opacity duration-200
            ${isSidebarVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Lite LLM Chat</h2>
            <button
              onClick={() => setSidebarVisible(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-grow p-4">
          <SystemPromptEditor
            updateSystemPrompt={(prompt) =>
              updateChatSettings({ systemPrompt: prompt })
            }
            currentSystemPrompt={chatSettings.systemPrompt}
          />
        </div>

        <div className="p-4 border-t border-gray-700">
          <ChatModelSelector
            selectedModel={chatSettings.model}
            updateSelectedModel={(new_model) =>
              updateChatSettings({ model: new_model })
            }
            availableModels={chatSettings.availableModels}
          />
        </div>

        {/* Resizer handle */}
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-green-500 hover:opacity-50 opacity-0"
          onMouseDown={handleMouseDown}
        ></div>
      </div>
    </aside>
  );
} 