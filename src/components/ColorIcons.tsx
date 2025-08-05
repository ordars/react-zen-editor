'use client';

import React from 'react';

interface TextColorIconProps {
  color?: string;
  currentColor?: string;
  size?: number;
}

interface BackgroundColorIconProps {
  backgroundColor?: string;
  currentColor?: string;
  size?: number;
}

export const TextColorIcon: React.FC<TextColorIconProps> = ({ 
  color = '#000000', 
  currentColor = '#ff0000',
  size = 16 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* T 아이콘 */}
      <path
        d="M4 7V5H20V7H13V19H11V7H4Z"
        fill={color}
        stroke={color}
        strokeWidth="0.5"
      />
    </svg>
  );
};

export const BackgroundColorIcon: React.FC<BackgroundColorIconProps> = ({ 
  backgroundColor = '#ffff00', 
  currentColor = '#ffff00',
  size = 16 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* T 아이콘 */}
      <path
        d="M4 7V5H20V7H13V19H11V7H4Z"
        fill="#000000"
        stroke="#000000"
        strokeWidth="0.5"
      />
    </svg>
  );
};