import React, { useState } from 'react';
import { Message } from '../types/chat';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface DebugMessageBlockProps {
  message: Message;
  index: number;
}

export const DebugMessageBlock = ({ message, index }: DebugMessageBlockProps) => {
  const [isFolded, setIsFolded] = useState(false);

  return (
    <div className="mb-3 pb-3 border-b border-gray-200 last:border-0">
      <div 
        className="flex items-center cursor-pointer py-1 px-2 rounded hover:bg-gray-200 transition-colors"
        onClick={()=>{
          setIsFolded(!isFolded);
        }}
      >
        <div className="mr-2 text-gray-500">
          {isFolded ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </div>
        <div className="text-xs font-medium text-gray-500">
          {`[${index}] ${message.role}`}
        </div>
      </div>
      
      {!isFolded && (
        <div className="mt-2 pl-8 pr-2 whitespace-pre-wrap break-words text-gray-600 text-sm bg-gray-50 p-2 rounded">
          {message.content}
        </div>
      )}
    </div>
  );
}; 