"use client";

import { ChatInput } from "@/components/ChatInput";
import { ChatSettingsContext } from "@/components/chatSettingContext";
import React, { useContext } from "react";
import { createChatSession } from "@/lib/api/chatSessionServiceFactory";
import { Message } from "@/types/chat";
import { useRouter } from "next/navigation";

export default function NewChatPage() {
  const { chatSettings } = useContext(ChatSettingsContext);
  const router = useRouter();

  const handleSubmit = async (input: string) => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      {
        role: "system",
        content: chatSettings.systemPrompt,
      },
    ];
    newMessages.push({ role: "user", content: input });

    const session = await createChatSession(newMessages);
    console.log("create new chat session, id: ", session.id);
    router.push(`/chat/${session.id}`);
  };

  return (
    <div className="max-w-3xl m-auto w-full bg-transparent px-3 text-gray-900">
      <div className=" flex flex-col items-center justify-center text-center px-4">
        <h3 className="text-2xl font-semibold mb-2">Lite LLM Chat</h3>
        <p className="text-gray-600 mb-6 ">
          Start a conversation with our AI assistant powered by LLM models.
        </p>
      </div>
      <ChatInput handleSubmit={handleSubmit} isStreaming={false} />
    </div>
  );
}
