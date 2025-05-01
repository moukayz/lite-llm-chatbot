import { Model } from '../types/chat';

interface ChatSettingsProps {
  selectedModel: Model;
  updateSelectedModel: (model:Model) => void;
  availableModels: Model[];
}

export function ChatModelSelector({ 
  selectedModel, 
  updateSelectedModel: setSelectedModel, 
  availableModels 
}: ChatSettingsProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor="model-select" className="mb-2 text-xs text-gray-400 uppercase font-medium">Model</label>
      <select
        id="model-select"
        value={selectedModel.code}
        onChange={(e) => {
          const selected = availableModels.find(model => model.code === e.target.value);
          if (selected) setSelectedModel(selected);
        }}
        className="p-2 w-full text-sm bg-gray-800 border border-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
      >
        {availableModels.map(model => (
          <option key={model.code} value={model.code}>
            {model.name}
          </option>
        ))}
      </select>
      
      <div className="mt-4 flex items-center">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
        <span className="text-xs text-gray-400">System prompt active</span>
      </div>
    </div>
  );
} 