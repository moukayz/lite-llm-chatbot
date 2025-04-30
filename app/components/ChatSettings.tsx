import { Dispatch, SetStateAction } from 'react';
import { Model } from '../types/chat';

interface ChatSettingsProps {
  selectedModel: Model;
  setSelectedModel: Dispatch<SetStateAction<Model>>;
  availableModels: Model[];
}

export function ChatSettings({ 
  selectedModel, 
  setSelectedModel, 
  availableModels 
}: ChatSettingsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-xs text-gray-500 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span>System prompt configured</span>
      </div>
      <div className="flex items-center">
        <label htmlFor="model-select" className="mr-2 text-sm text-gray-600">Model:</label>
        <select
          id="model-select"
          value={selectedModel.code}
          onChange={(e) => {
            const selected = availableModels.find(model => model.code === e.target.value);
            if (selected) setSelectedModel(selected);
          }}
          className="p-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {availableModels.map(model => (
            <option key={model.code} value={model.code}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 