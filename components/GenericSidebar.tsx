import { Dispatch, SetStateAction, ReactNode } from "react";
import { X } from "lucide-react";

interface GenericSidebarProps {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  sidebarWidth?: number; // Optional width, defaults to a reasonable value
  showCloseButton?: boolean;
  children: ReactNode;
  title?: string;
}

const DEFAULT_SIDEBAR_WIDTH = 300; // Default width if not provided

export function GenericSidebar({
  isVisible,
  setVisible,
  sidebarWidth = DEFAULT_SIDEBAR_WIDTH,
  showCloseButton = true,
  children,
}: GenericSidebarProps) {
  const transitionTypeClass = "transition-[width] duration-200 ease-in-out";

  return (
    <aside
      style={{
        width: `${isVisible ? sidebarWidth : 0}px`,
      }}
      className={`text-white overflow-hidden relative h-full flex flex-col border-r border-gray-700 z-10 
        ${transitionTypeClass}`}
    >
      <div
        className={`h-full px-4 py-2 flex flex-col transition-opacity duration-200
            ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        {showCloseButton && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setVisible(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* <div className="flex-grow p-4 space-y-4 overflow-y-auto"> */}
          {children}
        {/* </div> */}
      </div>
    </aside>
  );
} 