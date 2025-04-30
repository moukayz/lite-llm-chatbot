import React from 'react';

interface DebugPanelProps {
  showDebugPanel: boolean;
  toggleDebugPanel: () => void;
  finalResponse: string;
}

export function DebugPanel({ showDebugPanel, toggleDebugPanel, finalResponse }: DebugPanelProps) {
  if (!showDebugPanel) return null;
  
  return (
    <div className="w-80 border-l bg-white overflow-y-auto">
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="font-semibold">Debug Panel</h3>
        <button
          onClick={toggleDebugPanel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="p-3">
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-700">
            Complete Response:
          </span>
        </div>
        <div className="bg-gray-100 p-3 rounded-md whitespace-pre-wrap font-mono text-sm overflow-auto max-h-[calc(100vh-200px)]">
          {finalResponse || "No response yet"}
        </div>
      </div>
    </div>
  );
} 