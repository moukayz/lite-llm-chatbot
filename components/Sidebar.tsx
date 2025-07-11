import { SystemPromptEditor } from "./SystemPromptEditor";
import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
import { PanelLeft, X } from "lucide-react";
import { FoldableSection } from "./FoldableSection";
import { ChatHistory } from "./ChatHistory";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isSidebarVisible: boolean;
  setSidebarVisible: Dispatch<SetStateAction<boolean>>;
  activeChatId: string | null;
}

export function Sidebar({
  isSidebarVisible,
  setSidebarVisible,
  activeChatId,
}: SidebarProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [localSidebarWidth, setLocalSidebarWidth] = useState(350);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const MIN_WIDTH = 180;
  const MAX_WIDTH = 500;
  const router = useRouter();

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
      setLocalSidebarWidth(newWidth);
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
  }, [isResizing]);

  return (
    <aside
      ref={sidebarRef}
      style={{
        width: `${isSidebarVisible ? localSidebarWidth : 0}px`,
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

        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
          <FoldableSection title="Chat History" isExpanded={true}>
            <ChatHistory activeChatId={activeChatId} />
          </FoldableSection>

          <FoldableSection title="System Prompt">
            <SystemPromptEditor />
          </FoldableSection>

          {/* <FoldableSection title="Model Settings">
            <ChatModelSelector />
          </FoldableSection> */}
        </div>

        <div className="mt-6 py-6 border-t border-gray-700">
          <button
            className="w-full p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm flex items-center justify-center"
            onClick={() => {
              router.push("/chat");
            }}
          >
            <PanelLeft size={16} className="mr-2" />
            New Chat
          </button>
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
