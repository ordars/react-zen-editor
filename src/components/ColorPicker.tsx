'use client';

import React from 'react';

interface ColorPickerProps {
  type: 'text' | 'background';
  onColorSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ type, onColorSelect }) => {
  const textColors = {
    basic: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF', '#FF0000', '#0000FF'],
    theme: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
    standard: [
      '#FF0000', '#FF8000', '#FFFF00', '#80FF00',
      '#00FF00', '#00FF80', '#00FFFF', '#0080FF',
      '#0000FF', '#8000FF', '#FF00FF', '#FF0080',
      '#800000', '#804000', '#808000', '#408000'
    ]
  };

  const backgroundColors = {
    basic: ['transparent', '#FFFFFF', '#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD', '#6C757D'],
    highlight: ['#FFF3CD', '#D1ECF1', '#D4EDDA', '#F8D7DA', '#E2E3E5', '#D6F5D6', '#FFE5CC', '#E7D3FF'],
    fluorescent: [
      '#FFFF99', '#99FF99', '#99FFFF', '#FF99FF',
      '#FFB399', '#B3B3FF', '#FFD700', '#FF6B6B',
      '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#FF9FF3'
    ]
  };

  const colors = type === 'text' ? textColors : backgroundColors;
  const labels = type === 'text' 
    ? { basic: '기본 색상', theme: '테마 색상', standard: '표준 색상' }
    : { basic: '기본 배경', highlight: '하이라이트', fluorescent: '형광펜' };

  return (
    <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-300 rounded shadow-lg z-50 w-52">
      {Object.entries(colors).map(([key, colorArray]) => (
        <div key={key} className="mb-2">
          <div className="text-xs text-gray-600 mb-1">{labels[key as keyof typeof labels]}</div>
          <div className="grid grid-cols-8 gap-1">
            {colorArray.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-gray-300 hover:scale-105 hover:border-blue-500 transition-all duration-150 relative"
                style={{ backgroundColor: color === 'transparent' ? '#ffffff' : color }}
                onClick={() => onColorSelect(color)}
                title={color === 'transparent' ? '투명' : color}
              >
                {color === 'transparent' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-0.5 bg-red-500 rotate-45"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
      
      <div className="border-t pt-2">
        <div className="text-xs text-gray-600 mb-1">사용자 정의</div>
        <input
          type="color"
          onChange={(e) => onColorSelect(e.target.value)}
          className="w-full h-8 border border-gray-300 rounded cursor-pointer"
          title={`사용자 정의 ${type === 'text' ? '색상' : '배경색'}`}
        />
      </div>
    </div>
  );
};

export default ColorPicker;