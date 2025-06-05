import React, { useState } from 'react';
import { Message } from '../types/chat';
import { DebugMessageBlock } from './DebugMessageBlock';
import { FoldHorizontal, FoldVertical } from 'lucide-react';
import { GenericSidebar } from './GenericSidebar';

interface DebugPanelProps {
  showDebugPanel: boolean;
  toggleDebugPanel: () => void;
  messages: Message[];
}

const DebugContent = React.memo(function DebugContent({
  messages,
}: {
  messages: Message[];
}) {
  const [allFolded, setAllFolded] = useState(true);

  const handleFoldAllToggle = () => {
    setAllFolded(!allFolded);
  };

  return (
    <div className="p-3">
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          Messages: ({messages.length}):
        </span>
        <button
          onClick={handleFoldAllToggle}
          className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          aria-label={allFolded ? "Unfold All" : "Fold All"}
          title={allFolded ? "Unfold All" : "Fold All"}
        >
          {allFolded ? (
            <>
              <FoldVertical size={14} />
              <span>Unfold All</span>
            </>
          ) : (
            <>
              <FoldHorizontal size={14} />
              <span>Fold All</span>
            </>
          )}
        </button>
      </div>
      <div className="bg-gray-100 p-3 rounded-md overflow-auto max-h-[calc(100vh-200px)]">
        {messages.map((msg, index) => (
          <DebugMessageBlock
            key={index}
            message={msg}
            index={index}
            isFolded={allFolded}
          />
        ))}
        {messages.length === 0 && (
          <div className="text-sm text-gray-500 italic">No messages yet</div>
        )}
      </div>
    </div>
  );
});
  

export function DebugPanel({
  showDebugPanel,
  toggleDebugPanel,
  messages,
}: DebugPanelProps) {
  return (
    <GenericSidebar
      isVisible={showDebugPanel}
      setVisible={toggleDebugPanel}
      sidebarWidth={400}
      showCloseButton={false}
    >
      <DebugContent messages={messages} />
    </GenericSidebar>
  );
} 