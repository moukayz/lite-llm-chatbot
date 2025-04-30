import { ChangeEvent, useState, useEffect } from 'react';
import { defaultSystemPrompt } from '../config/systemPrompt';

interface SystemPromptEditorProps {
  onUpdateSystemPrompt: (newPrompt: string) => void;
  currentSystemPrompt?: string;
}

export function SystemPromptEditor({ 
  onUpdateSystemPrompt, 
  currentSystemPrompt = defaultSystemPrompt 
}: SystemPromptEditorProps) {
  const [editedPrompt, setEditedPrompt] = useState(currentSystemPrompt);
  const [hasChanges, setHasChanges] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  
  // Update edited prompt when the current system prompt changes
  useEffect(() => {
    setEditedPrompt(currentSystemPrompt);
    setHasChanges(false);
  }, [currentSystemPrompt]);
  
  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEditedPrompt(e.target.value);
    setHasChanges(e.target.value !== currentSystemPrompt);
    setIsApplied(false);
  };
  
  const handleApplyPrompt = () => {
    onUpdateSystemPrompt(editedPrompt);
    setIsApplied(true);
    setHasChanges(false);
  };
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-2">System Prompt</h2>
      <p className="text-sm text-gray-600 mb-2">
        Customize the system prompt to control the assistant&apos;s behavior.
        Changes will apply on your next message.
      </p>
      
      <textarea
        value={editedPrompt}
        onChange={handlePromptChange}
        className="w-full flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
        style={{ minHeight: "300px", resize: 'none' }}
      />
      
      <div className="mt-3 flex items-center">
        {hasChanges && (
          <span className="text-yellow-600 text-xs mr-2">
            ● Unsaved changes
          </span>
        )}
        
        {isApplied && !hasChanges && (
          <span className="text-green-600 text-xs mr-2">
            ✓ Changes applied
          </span>
        )}
        
        <button
          onClick={handleApplyPrompt}
          disabled={!hasChanges}
          className={`ml-auto px-4 py-2 rounded-lg text-white transition-colors ${
            hasChanges 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
} 