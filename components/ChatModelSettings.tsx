import { useContext } from "react";
import { ChatSettingsContext } from "./chatSettingContext";

export function ChatModelSelector() {
  const { chatSettings, updateChatSettings } = useContext(ChatSettingsContext);
  const selectedModel = chatSettings.model;
  const availableModels = chatSettings.availableModels;

  return (
    <div className="flex flex-col">
      <label
        htmlFor="model-select"
        className="mb-2 text-xs text-gray-400 uppercase font-medium"
      >
        Model
      </label>
      <select
        id="model-select"
        value={selectedModel.code}
        onChange={(e) => {
          const selected = availableModels.find(
            (model) => model.code === e.target.value
          );
          if (selected) updateChatSettings({ model: selected });
        }}
        className="p-2 w-full text-sm bg-gray-800 border border-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
      >
        {availableModels.map((model) => (
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
