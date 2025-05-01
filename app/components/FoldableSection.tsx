import { ReactNode, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface FoldableSectionProps {
  title: string;
  children: ReactNode;
  isInitiallyExpanded?: boolean;
  titleClassName?: string;
  contentClassName?: string;
}

export function FoldableSection({
  title,
  children,
  isInitiallyExpanded = true,
  titleClassName = "",
  contentClassName = "",
}: FoldableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full">
      <button
        onClick={toggleExpanded}
        className={`flex bg-gray-800 p-2 rounded-md items-center text-lg font-semibold hover:text-blue-400 transition-colors w-full ${titleClassName}`}
      >
        {isExpanded ? (
          <ChevronDown size={20} className="mr-1" />
        ) : (
          <ChevronRight size={20} className="mr-1" />
        )}
        {title}
      </button>
      
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
        } ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
} 