'use client';

import { ChatInput } from '@/components/ChatInput';
import { ChatMessages } from '@/components/ChatMessages';
import React, { use, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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

  const chatSettingsRef = useRef(chatSettings);
  const isStreamingRef = useRef(false);
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
    []
  );

  // Error handler
  const handleError = useCallback((error: Error) => {
    console.error("Chat error:", error);
  }, []);

  const useChatProps = useMemo(() => ({
    onStreamUpdate: handleStreamUpdate,
    onError: handleError,
  }), [handleStreamUpdate, handleError]);

  const { isStreaming, sendMessage } = useChat(useChatProps);

  useEffect(() => {
    chatSettingsRef.current = chatSettings;
  }, [chatSettings]);
   
  useEffect(() => {
    const updateSession = async () => {
      try {
        await updateChatSession(id!, messages);
      } catch (error) {
        console.error("Failed to update chat session:", error);
      }
    };

    let needUpdateSession = false;
    if (isStreamingRef.current !== isStreaming) {
      if (isStreamingRef.current) {
        needUpdateSession = true;
      }
      isStreamingRef.current = isStreaming;
    }

    if (needUpdateSession && messages.length > 0 && id) {
      console.log("updateSession", messages);
      updateSession();
    }
  }, [messages, id, isStreaming]);

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
    let canceled = false;

    const fetchMessages = async () => {
      const sessionMessages = await fetchChatSessionMessages(id!);
      if (canceled) return;
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
        sendMessage(sessionMessages, chatSettingsRef.current.model.code);
      }
    };

    fetchMessages();

    return () => {
      canceled = true;
    };
  }, [id, sendMessage]);

  console.log(
    "render page, messages: ",
    messages,
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
