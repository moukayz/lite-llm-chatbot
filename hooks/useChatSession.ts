import { fetchChatSessions } from "@/lib/api/apiChatSessionService";
import { ChatSession } from "@/types/chat";
import { useEffect, useState } from "react";

export const useChatSession = (activeChatId: string) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadChatSessions = async () => {
      try {
        setIsLoading(true);
        const sessions = await fetchChatSessions();
        console.log("history loadChatSessions, activeChatId: ", activeChatId);
        setChatSessions(sessions);
      } catch (error) {
        console.error("Failed to load chat sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    console.log("history render, activeChatId: ", activeChatId);
    loadChatSessions();
  }, [activeChatId]);

  return { chatSessions, isLoading };
}
