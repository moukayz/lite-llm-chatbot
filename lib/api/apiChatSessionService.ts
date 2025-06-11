import { ChatSession, Message } from "@/types/chat";

// API client for chat sessions
const API_BASE_URL = '/api/chat/sessions';

// Interface for raw session data from API
interface RawChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  firstMessage?: string | null;
}

// Interface for raw message data from API
interface RawMessage {
  role: string;
  content: string;
  thinkingContent: string;
}

// Helper function to convert date strings to Date objects for ChatSession
const deserializeChatSession = (session: RawChatSession): ChatSession => {
  return {
    id: session.id,
    title: session.title,
    createdAt: new Date(session.createdAt),
    updatedAt: new Date(session.updatedAt),
    messageCount: session.messageCount,
    firstMessage: session.firstMessage || undefined
  };
};

export const createChatSession = async (messages: Message[]): Promise<ChatSession> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create chat session');
    }

    const data = await response.json() as RawChatSession;
    return deserializeChatSession(data);
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
};

export const updateChatSession = async (
  sessionId: string,
  messages: Message[]
): Promise<ChatSession> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update chat session ${sessionId}`);
    }

    console.log("updateChatSession response", response);

    const data = await response.json() as RawChatSession;
    return deserializeChatSession(data);
  } catch (error) {
    console.error(`Error updating chat session ${sessionId}:`, error);
    throw error;
  }
};

export const fetchChatSessions = async (): Promise<ChatSession[]> => {
  try {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch chat sessions');
    }

    const data = await response.json() as RawChatSession[];
    return data.map(session => deserializeChatSession(session));
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return [];
  }
};

export const fetchChatSessionMessages = async (sessionId: string): Promise<Message[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${sessionId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to fetch messages for chat session ${sessionId}`);
    }

    const data = await response.json();
    
    // Ensure messages match the Message type
    return data.messages.map((msg: RawMessage): Message => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
      thinkingContent: msg.thinkingContent
    }));
  } catch (error) {
    console.error(`Error fetching messages for chat session ${sessionId}:`, error);
    return [];
  }
};

export const deleteChatSession = async (sessionId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${sessionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete chat session ${sessionId}`);
    }

    const data = await response.json();
    return Boolean(data.success);
  } catch (error) {
    console.error(`Error deleting chat session ${sessionId}:`, error);
    return false;
  }
}; 