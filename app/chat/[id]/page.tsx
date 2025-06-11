'use client';

import { ChatInput } from '@/components/ChatInput';
import { ChatMessages } from '@/components/ChatMessages';
import React, { use, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Message } from '@/types/chat';
import { fetchChatSessionMessages, updateChatSession } from '@/lib/api/chatSessionServiceFactory';
import { MessageChunk, useChat } from '@/hooks/useChat';
import { ChatSettingsContext } from '@/components/chatSettingContext';

type Params = Promise<{ id: string }>;
export default function Page({ params }: { params: Params }) {
  const param = use(params);
  const id = param.id === undefined ? null : param.id;
  console.log("param: ", param, id);

  const { chatSettings } = useContext(ChatSettingsContext);

  const needUpdateSession = useRef(false);
  const isCurrentChatLoded = useRef(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleStreamUpdate = useCallback(
    (updatedContent: MessageChunk) => {
      console.log("handleStreamUpdate", updatedContent);
      setMessages((prev) => {
        console.log("handleStreamUpdate inside", updatedContent);
        const newMessages = [...prev];

        if (newMessages.length > 0) {
          const lastMessageIndex = newMessages.length - 1;
          const lastMessage = { ...newMessages[lastMessageIndex] };

          if (updatedContent.type === "thinking") {
            lastMessage.thinkingContent = updatedContent.text;
          } else {
            lastMessage.content = updatedContent.text;
          }

          newMessages[lastMessageIndex] = lastMessage;
          console.log("lastMessage", lastMessage);
        }
        return newMessages;
      });
    },
    [setMessages]
  );

  // Final response handler
  const handleFinalResponse = useCallback(() => {
    needUpdateSession.current = true;
  }, []);

  useEffect(() => {
    const updateSession = async () => {
      if (messages.length > 0 && id) {
        try {
          await updateChatSession(id, messages);
        } catch (error) {
          console.error("Failed to update chat session:", error);
        }
      }
    };

    if (needUpdateSession.current) {
      needUpdateSession.current = false;
      console.log("updateSession", messages);
      updateSession();
    }
  }, [messages, id]);

  // Error handler
  const handleError = useCallback((error: Error) => {
    console.error("Chat error:", error);
  }, []);

  const { isStreaming, sendMessage } = useChat({
    onStreamUpdate: handleStreamUpdate,
    onError: handleError,
    onFinalResponse: handleFinalResponse,
  });

  const handleSubmit = async (input: string) => {
    if (!input.trim() || isStreaming) return;

    const newMessages = [...messages];

    // update system prompt if necessary
    if (newMessages.length > 0 && newMessages[0].role === "system") {
      newMessages[0].content = chatSettings.systemPrompt;
    } else {
      newMessages.unshift({
        role: "system",
        content: chatSettings.systemPrompt,
      });
    }

    newMessages.push({ role: "user", content: input });
    newMessages.push({ role: "assistant", content: "" });
    setMessages(newMessages);

    // Send the request with the system prompt included
    console.log("sendMessage from handleSubmit", newMessages);
    sendMessage(newMessages, chatSettings.model.code);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!id) return;
      const sessionMessages = await fetchChatSessionMessages(id);
      setMessages(sessionMessages);

      if (
        sessionMessages.length > 0 &&
        sessionMessages[sessionMessages.length - 1].role === "user"
      ) {
        console.log("new user input");
        sessionMessages.push({
          role: "assistant",
          content: "",
        });

        console.log(`${id} sendMessage from effect`, sessionMessages);
        sendMessage(sessionMessages, chatSettings.model.code);
      }
    };

    console.log(
      "fetchMessages from effect, id: ",
      id,
      isCurrentChatLoded.current
    );
    if (isCurrentChatLoded.current) {
      return;
    }

    isCurrentChatLoded.current = true;
    console.log(
      "start fetchMessages from effect, id: ",
      id,
      isCurrentChatLoded.current
    );
    fetchMessages();
  }, [id]);

  console.log(
    "render page, messages: ",
    messages,
    isCurrentChatLoded.current,
    param
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden ">
      {/* Messages area */}
      <div className="flex-1 flex flex-col overflow-hidden ">
        <ChatMessages messages={messages} isStreaming={isStreaming} />
      </div>

      {/* Floating Input area */}
      <div className="max-w-3xl mx-auto w-full bg-transparent px-3">
        <ChatInput handleSubmit={handleSubmit} isStreaming={isStreaming} />
      </div>
    </div>
  );
}
