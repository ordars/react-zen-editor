'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownButtonProps {
  icon: React.ComponentType<any>;
  title: string;
  options: DropdownOption[];
  onOptionSelect: (value: string) => void;
  placeholder?: string;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  icon: Icon,
  title,
  options,
  onOptionSelect,
  placeholder = "선택"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionClick = (value: string) => {
    onOptionSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="p-2 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
        title={title}
      >
        <Icon size={16} />
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[160px]">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;