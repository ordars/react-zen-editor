'use client';

import React, { useCallback } from 'react';
import { ToolbarButtonProps } from '../types';

const ToolbarButton: React.FC<ToolbarButtonProps & { 
  executeCommand: (command: string, value?: string | null) => void 
}> = ({ 
  command, 
  icon: Icon, 
  title, 
  value = null, 
  onClick = null,
  executeCommand
}) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else if (command) {
      executeCommand(command, value);
    }
  }, [onClick, command, value, executeCommand]);

  return (
    <button
      type="button"
      className="p-2 hover:bg-gray-200 rounded transition-colors"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={handleClick}
    >
      <Icon size={16} />
    </button>
  );
};

export default ToolbarButton;