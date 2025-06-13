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

export default function CustomDropdown({
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
      className="relative w-64 text-gray-900"
      ref={containerRef}
    >
      <button
        type="button"
        className="w-full bg-white border border-gray-300 rounded px-4 py-2 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggleOpen}
      >
        <span>{selectedOption?.label ?? placeholder}</span>
        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-10 mt-1 w-full bg-gray-50 border  rounded-lg shadow max-h-60 overflow-auto"
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isHighlighted = idx === highlightedIndex;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                className={`m-2 rounded-lg cursor-pointer select-none flex justify-between items-center px-4 py-2 ${
                  isHighlighted ? "bg-blue-600 text-white" : "text-gray-900"
                } ${isSelected && !isHighlighted ? "font-semibold" : ""}`}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onClick={() => handleOptionClick(opt, idx)}
              >
                <span>{opt.label}</span>
                {isSelected && <CheckIcon className="w-5 h-5" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
