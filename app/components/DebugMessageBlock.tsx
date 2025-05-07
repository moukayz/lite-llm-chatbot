import React from 'react';
import { Message } from '../types/chat';
import { FoldableSection } from './FoldableSection';

interface DebugMessageBlockProps {
  message: Message;
  index: number;
  isFolded?: boolean;
}

export const DebugMessageBlock = ({ message, index, isFolded }: DebugMessageBlockProps) => {
  return (
    <div className="mb-3 pb-3 border-b border-gray-200 last:border-0">
      <FoldableSection
        title={`[${index}] ${message.role}`}
        isExpanded={isFolded !== undefined ? !isFolded : undefined}
        titleClassName="!bg-transparent !p-1 !text-xs font-medium text-gray-500 hover:bg-gray-200 rounded"
        contentClassName="bg-gray-50 rounded"
      >
        <div className="whitespace-pre-wrap break-words text-gray-600 text-sm p-2">
          {message.content}
        </div>
      </FoldableSection>
    </div>
  );
}; 