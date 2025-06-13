import { useContext } from "react";
import { ChatSettingsContext } from "./chatSettingContext";
import ModelSelectorDropdown, { DropdownOption } from "./ModelSelectorDropdown";

export function ChatModelSelector() {
  const { chatSettings, updateChatSettings } = useContext(ChatSettingsContext);
  const selectedModel = chatSettings.model;
  const availableModels = chatSettings.availableModels;

  const handleOnChange = (value: string) => {
    const selected = availableModels.find((model) => model.code === value);
    if (selected) updateChatSettings({ model: selected });
  };

  const modelOptions: DropdownOption[] = availableModels.map((model) => ({
    value: model.code,
    label: model.name,
  }));

  return (
    <ModelSelectorDropdown
      options={modelOptions}
      value={selectedModel.code}
      onChange={handleOnChange}
    />
  );
}
