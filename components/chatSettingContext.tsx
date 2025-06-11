import { createContext, useState } from "react";
import { ChatSettings, Model } from "@/types/chat";
import { defaultSystemPrompt } from "@/config/systemPrompt";

const availableModels: Model[] = [
  { name: "通义千问-Max", code: "qwen-max" },
  { name: "通义千问-Plus", code: "qwen-plus" },
  { name: "通义千问-Turbo", code: "qwen-turbo" },
  { name: "Qwen3.2-235B-A22B", code: "qwen3-235b-a22b" },
];

export const ChatSettingsContext = createContext<{
  chatSettings: ChatSettings;
  updateChatSettings: (settings: Partial<ChatSettings>) => void;
}>({
  chatSettings: {
    systemPrompt: "",
    model: { name: "", code: "" },
    availableModels: [],
  },
  updateChatSettings: () => {},
});

export function ChatSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    systemPrompt: defaultSystemPrompt,
    model: availableModels[0],
    availableModels: availableModels,
  });

  const updateChatSettings = (updates: Partial<ChatSettings>) => {
    setChatSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ChatSettingsContext value={{ chatSettings, updateChatSettings }}>
      {children}
    </ChatSettingsContext>
  );
}
