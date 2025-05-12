import { FC } from "react";
import { MessageSquare, Clock } from "lucide-react";

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  firstMessage?: string;
}

interface ChatHistoryProps {
  chatSessions: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

export const ChatHistory: FC<ChatHistoryProps> = ({
  chatSessions,
  activeChatId,
  onSelectChat,
}) => {
  if (chatSessions.length === 0) {
    return (
      <div className="text-gray-400 text-center py-4">
        No chat history yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {chatSessions.map((session) => (
        <button
          key={session.id}
          className={`w-full text-left p-2 rounded-md flex items-start transition-colors ${
            activeChatId === session.id
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-800"
          }`}
          onClick={() => onSelectChat(session.id)}
        >
          <MessageSquare size={16} className="mr-2 mt-1 flex-shrink-0" />
          <div className="overflow-hidden flex-grow">
            <div className="font-medium truncate">{session.title}</div>
            <div className="text-xs text-gray-400 flex items-center mt-1">
              <Clock size={12} className="mr-1" />
              {formatDate(session.updatedAt)}
              <span className="mx-1">•</span>
              {session.messageCount} messages
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

// Helper function to format date as "Today at 2:30 PM" or "Feb 5 at 2:30 PM"
const formatDate = (date: Date): string => {
  console.log('date', date, typeof date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const timeString = date.toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  if (dateDay.getTime() === today.getTime()) {
    return `Today at ${timeString}`;
  } else {
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${timeString}`;
  }
}; 