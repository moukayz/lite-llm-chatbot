"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface CustomDropdownProps {
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ModelSelectorDropdown({
  options,
  value,
  onChange,
  placeholder = "Select…",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) ?? null;
  const toggleOpen = () => setIsOpen((o) => !o);

  const handleOptionClick = (opt: DropdownOption, idx: number) => {
    onChange(opt.value);
    setIsOpen(false);
    setHighlightedIndex(idx);
  };

  return (
    <div
      className="relative p-2 rounded-md  hover:bg-gray-200  text-gray-900 flex justify-start items-center"
      ref={containerRef}
    >
      <label className="flex-shrink-0 text-lg text-gray-900">
        Chat with
      </label>
      <button
        type="button"
        className="w-full flex justify-between items-center "
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggleOpen}
      >
        <span className="px-2 text-gray-500">
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <ul
        role="listbox"
        tabIndex={-1}
        className={`absolute top-full left-0 z-10 mt-2 w-full min-w-max bg-gray-50 border rounded-lg shadow max-h-60 overflow-auto transition-all duration-200 ease-out transform origin-top ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {options.map((opt, idx) => {
          const isSelected = opt.value === value;
          const isHighlighted = idx === highlightedIndex;
          return (
            <li
              key={opt.value}
              role="option"
              aria-selected={isSelected}
              className={`hover:bg-gray-200 m-2 rounded-lg cursor-pointer select-none flex justify-between items-center px-4 py-2
                  text-gray-900
               ${isSelected && !isHighlighted ? "font-semibold" : ""}`}
              onMouseEnter={() => setHighlightedIndex(idx)}
              onClick={() => handleOptionClick(opt, idx)}
            >
              <span>{opt.label}</span>
              {isSelected && <CheckIcon className="w-5 h-5" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
