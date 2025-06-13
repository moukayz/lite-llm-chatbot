import { useContext } from "react";
import { ChatSettingsContext } from "./chatSettingContext";
import CustomDropdown, { DropdownOption } from "./CustomDropdown";

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
    <div className="flex flex-col justify-start items-start">
      <CustomDropdown
        options={modelOptions}
        value={selectedModel.code}
        onChange={handleOnChange}
      />
    </div>
  );
}
