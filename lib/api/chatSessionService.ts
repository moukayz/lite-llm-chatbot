import { Message } from "../../../types/chat";
import { ChatSession } from "../../../components/ChatHistory";

// Storage keys
const CHAT_SESSIONS_KEY = "lite-llm-chat-sessions";
const CHAT_MESSAGES_PREFIX = "lite-llm-chat-messages-";

// Helper to generate a title from the first user message
const generateTitleFromMessage = (message: string): string => {
  // Get first 30 characters or first line
  const firstLine = message.split('\n')[0];
  return firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine;
};

// Helper to properly deserialize dates from localStorage
const deserializeChatSession = (session: Omit<ChatSession, 'createdAt' | 'updatedAt'> & { 
  createdAt: string; 
  updatedAt: string; 
}): ChatSession => {
  return {
    ...session,
    createdAt: new Date(session.createdAt),
    updatedAt: new Date(session.updatedAt)
  };
};

export const createChatSession = async (messages: Message[]): Promise<ChatSession> => {
  // Filter out system messages to find the first user message
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  const firstContent = firstUserMessage?.content || 'New conversation';
  
  const sessionId = Date.now().toString();
  const newSession: ChatSession = {
    id: sessionId,
    title: generateTitleFromMessage(firstContent),
    createdAt: new Date(),
    updatedAt: new Date(),
    messageCount: messages.length,
    firstMessage: firstContent
  };

  try {
    // Save the chat session to localStorage
    const existingSessions = await fetchChatSessions();
    const updatedSessions = [newSession, ...existingSessions];
    localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(updatedSessions));
    
    // Save the messages for this session
    localStorage.setItem(CHAT_MESSAGES_PREFIX + sessionId, JSON.stringify(messages));
    
    console.log('Chat session created and saved to localStorage:', newSession);
    return newSession;
  } catch (error) {
    console.error('Failed to create chat session in localStorage:', error);
    throw error;
  }
};

export const updateChatSession = async (
  sessionId: string, 
  messages: Message[]
): Promise<ChatSession> => {
  try {
    // Get the existing sessions
    const allSessions = await fetchChatSessions();
    const existingSessionIndex = allSessions.findIndex(s => s.id === sessionId);
    
    if (existingSessionIndex === -1) {
      throw new Error(`Chat session with ID ${sessionId} not found`);
    }
    
    // Find the first user message for title
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    const firstContent = firstUserMessage?.content || 'Conversation';
    
    // Update the session
    const updatedSession: ChatSession = {
      ...allSessions[existingSessionIndex],
      title: generateTitleFromMessage(firstContent),
      updatedAt: new Date(),
      messageCount: messages.length
    };
    
    // Replace the session in the array
    allSessions[existingSessionIndex] = updatedSession;
    
    // Save updated sessions list
    localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(allSessions));
    
    // Save the updated messages
    localStorage.setItem(CHAT_MESSAGES_PREFIX + sessionId, JSON.stringify(messages));
    
    console.log(`Chat session ${sessionId} updated in localStorage`);
    return updatedSession;
  } catch (error) {
    console.error(`Failed to update chat session ${sessionId} in localStorage:`, error);
    throw error;
  }
};

export const fetchChatSessions = async (): Promise<ChatSession[]> => {
  try {
    const sessionsData = localStorage.getItem(CHAT_SESSIONS_KEY);
    
    if (!sessionsData) {
      return [];
    }
    
    // Parse and properly deserialize dates
    const sessions = JSON.parse(sessionsData) as Array<Omit<ChatSession, 'createdAt' | 'updatedAt'> & { 
      createdAt: string; 
      updatedAt: string; 
    }>;
    return sessions.map(deserializeChatSession);
  } catch (error) {
    console.error('Failed to fetch chat sessions from localStorage:', error);
    return [];
  }
};

export const fetchChatSessionMessages = async (sessionId: string): Promise<Message[]> => {
  try {
    const messagesData = localStorage.getItem(CHAT_MESSAGES_PREFIX + sessionId);
    
    if (!messagesData) {
      return [];
    }
    
    return JSON.parse(messagesData) as Message[];
  } catch (error) {
    console.error(`Failed to fetch messages for chat session ${sessionId} from localStorage:`, error);
    return [];
  }
}; 