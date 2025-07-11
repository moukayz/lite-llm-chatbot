import { ChangeEvent, useState } from 'react';
import { useContext } from 'react';
import { ChatSettingsContext } from './chatSettingContext';

export function SystemPromptEditor() {
  const { chatSettings, updateChatSettings } = useContext(ChatSettingsContext);
  const [editedPrompt, setEditedPrompt] = useState(chatSettings.systemPrompt);
  const [hasChanges, setHasChanges] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  
  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEditedPrompt(e.target.value);
    setHasChanges(e.target.value !== chatSettings.systemPrompt);
    setIsApplied(false);
  };
  
  const handleApplyPrompt = () => {
    updateChatSettings({ systemPrompt: editedPrompt });
    setEditedPrompt(chatSettings.systemPrompt);
    setIsApplied(true);
    setHasChanges(false);
  };
  
  return (
    <div className="rounded-lg shadow-sm h-full flex flex-col">
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