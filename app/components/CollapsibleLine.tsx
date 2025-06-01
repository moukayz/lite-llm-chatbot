'use client';

import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

/** A single line of text that toggles extra content below it. */
export function CollapsibleLine({
  heading,
  children,
  isOpen,
}: {
  heading: string;
  children: ReactNode;
  isOpen: boolean;
}) {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  console.log(`render collapsible line, isOpen: ${isOpen}, open: ${open}`);

  return (
    <div className="w-full">
      {/* Clickable line */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center text-left font-medium hover:text-blue-600 focus:outline-none cursor-pointer"
      >
        {heading}
        {open ? (
          <ChevronDown size={20} className="mr-1" />
        ) : (
          <ChevronRight size={20} className="mr-1" />
        )}
      </button>

      {/* Animated wrapper */}
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        {/* The actual content lives here.  `min-h-0` lets the grid shrink. */}
        <div className="min-h-0 py-2">{children}</div>
      </div>
    </div>
  );
}

