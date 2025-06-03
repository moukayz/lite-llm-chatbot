"use client";

import React, { useRef } from "react";

export default function ScrollDemo() {
  // Ref for the scrollable container
  const containerRef = useRef<HTMLDivElement>(null);
  // Ref for the second item
  const secondItemRef = useRef<HTMLDivElement>(null);

  const scrollSecondToTop = () => {
    const itemEl = secondItemRef.current;
    if (itemEl) {
      itemEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="flex flex-col overflow-y-auto h-[200px] border border-gray-300"
      >
        {/* First item: sits at the top */}
        <div className="min-h-[50px] bg-[#add8e6] flex items-center justify-center border-b">
          Item 1
        </div>
        <div className="min-h-[50px] bg-[#add8e6] flex items-center justify-center border-b">
          Item 1
        </div>
        <div className="min-h-[50px] bg-[#add8e6] flex items-center justify-center border-b">
          Item 1
        </div>

        {/* Second item: the target item */}
        <div
          ref={secondItemRef}
          className="h-[50px] bg-[#90ee90] flex items-center justify-center border-b"
        >
          Item 2 (Target)
        </div>

        <div className="min-h-[120%] bg-[#87ceeb] flex items-center justify-center border-b">
          Item 8
        </div>
      </div>

      <button
        onClick={scrollSecondToTop}
        className="mt-4 py-2 px-3 text-sm cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Scroll Item 2 to Top
      </button>
    </div>
  );
}
