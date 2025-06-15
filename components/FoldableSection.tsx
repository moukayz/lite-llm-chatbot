import { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useControlledState } from "@/hooks/useControlledState";

interface FoldableSectionProps {
  title: string;
  children: ReactNode;
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  titleClassName?: string;
  contentClassName?: string;
}

export function FoldableSection({
  title,
  children,
  isExpanded: controlledIsExpanded,
  onExpandChange,
  titleClassName = "",
  contentClassName = "",
}: FoldableSectionProps) {
  // const [isExpanded, setIsExpanded] = useState(controlledIsExpanded);
  const [isExpanded, setIsExpanded] = useControlledState<boolean>(false, controlledIsExpanded);
  
  // useEffect(() => {
  //   if (controlledIsExpanded !== undefined) {
  //     setIsExpanded(controlledIsExpanded);
  //   }
  // }, [controlledIsExpanded]);

  const toggleExpanded = () => {
    const newValue = !isExpanded;
    setIsExpanded(newValue);
    onExpandChange?.(newValue);
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
        className={`transition-all duration-300 ease-in-out overflow-y-auto ${
          isExpanded ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
        } ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
} 