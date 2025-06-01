import { Message } from "../types/chat";
import { ChatSession } from "../components/ChatHistory";
import prisma from "../lib/db";

// Helper to generate a title from the first user message
const generateTitleFromMessage = (message: string): string => {
  // Get first 30 characters or first line
  const firstLine = message.split('\n')[0];
  return firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine;
};

// Define our database entity types
interface DbChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  firstMessage: string | null;
}

interface DbMessage {
  id: number;
  role: string;
  content: string;
  thinkingContent: string;
  sessionId: string;
  createdAt: Date;
}

const createMessage = (message: Message) => {
  return {
    role: message.role,
    content: message.content,
    thinkingContent: message.thinkingContent ?? "",
  };
};

export const createChatSession = async (messages: Message[]): Promise<ChatSession> => {
  // Filter out system messages to find the first user message
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  const firstContent = firstUserMessage?.content || 'New conversation';
  
  const sessionId = Date.now().toString();
  
  try {
    // Create chat session in database
    const newSession = await prisma.chatSession.create({
      data: {
        id: sessionId,
        title: generateTitleFromMessage(firstContent),
        messageCount: messages.length,
        firstMessage: firstContent,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: {
          create: messages.map(createMessage)
        }
      }
    });
    
    // Convert database model to application model
    return {
      id: newSession.id,
      title: newSession.title,
      createdAt: newSession.createdAt,
      updatedAt: newSession.updatedAt,
      messageCount: newSession.messageCount,
      firstMessage: newSession.firstMessage || undefined
    };
  } catch (error) {
    console.error('Failed to create chat session in database:', error);
    throw error;
  }
};

export const updateChatSession = async (
  sessionId: string, 
  messages: Message[]
): Promise<ChatSession> => {
  try {
    // Find the first user message for title
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    const firstContent = firstUserMessage?.content || 'Conversation';
    
    // Delete existing messages for this session
    await prisma.message.deleteMany({
      where: { sessionId }
    });
    
    // Update the session
    const updatedSession = await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        title: generateTitleFromMessage(firstContent),
        messageCount: messages.length,
        firstMessage: firstContent,
        updatedAt: new Date(),
        messages: {
          create: messages.map(createMessage)
        }
      }
    });
    
    // Convert database model to application model
    return {
      id: updatedSession.id,
      title: updatedSession.title,
      createdAt: updatedSession.createdAt,
      updatedAt: updatedSession.updatedAt,
      messageCount: updatedSession.messageCount,
      firstMessage: updatedSession.firstMessage || undefined
    };
  } catch (error) {
    console.error(`Failed to update chat session ${sessionId} in database:`, error);
    throw error;
  }
};

export const fetchChatSessions = async (): Promise<ChatSession[]> => {
  try {
    const sessions = await prisma.chatSession.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    
    // Convert database models to application models
    return sessions.map((session: DbChatSession) => ({
      id: session.id,
      title: session.title,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messageCount: session.messageCount,
      firstMessage: session.firstMessage || undefined
    }));
  } catch (error) {
    console.error('Failed to fetch chat sessions from database:', error);
    return [];
  }
};

export const fetchChatSessionMessages = async (sessionId: string): Promise<Message[]> => {
  try {
    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { id: 'asc' }
    });
    
    // Convert database models to application models
    return messages.map((msg: DbMessage) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
      thinkingContent: msg.thinkingContent
    }));
  } catch (error) {
    console.error(`Failed to fetch messages for chat session ${sessionId} from database:`, error);
    return [];
  }
};

export const deleteChatSession = async (sessionId: string): Promise<boolean> => {
  try {
    await prisma.chatSession.delete({
      where: { id: sessionId }
    });
    return true;
  } catch (error) {
    console.error(`Failed to delete chat session ${sessionId} from database:`, error);
    return false;
  }
}; 