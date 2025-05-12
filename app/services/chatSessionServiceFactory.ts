import * as localStorageService from './chatSessionService';
import * as apiService from './apiChatSessionService';
import { Message } from '../types/chat';
import { ChatSession } from '../components/ChatHistory';

// Check if we should use PostgreSQL
const shouldUsePostgres = (): boolean => {
  // Use PostgreSQL if DB_STORAGE environment variable is set to 'postgres'
//   console.log('NEXT_PUBLIC_DB_STORAGE', process.env.NEXT_PUBLIC_DB_STORAGE);
  return process.env.NEXT_PUBLIC_DB_STORAGE === 'postgres';
};

// Factory functions that return the appropriate implementation
export const createChatSession = async (messages: Message[]): Promise<ChatSession> => {
  return shouldUsePostgres() 
    ? apiService.createChatSession(messages)
    : localStorageService.createChatSession(messages);
};

export const updateChatSession = async (
  sessionId: string, 
  messages: Message[]
): Promise<ChatSession> => {
  return shouldUsePostgres()
    ? apiService.updateChatSession(sessionId, messages)
    : localStorageService.updateChatSession(sessionId, messages);
};

export const fetchChatSessions = async (): Promise<ChatSession[]> => {
  return shouldUsePostgres()
    ? apiService.fetchChatSessions()
    : localStorageService.fetchChatSessions();
};

export const fetchChatSessionMessages = async (sessionId: string): Promise<Message[]> => {
  return shouldUsePostgres()
    ? apiService.fetchChatSessionMessages(sessionId)
    : localStorageService.fetchChatSessionMessages(sessionId);
};

export const deleteChatSession = async (sessionId: string): Promise<boolean> => {
  return shouldUsePostgres()
    ? apiService.deleteChatSession(sessionId)
    : Promise.resolve(false); // LocalStorage version doesn't have delete functionality
}; 