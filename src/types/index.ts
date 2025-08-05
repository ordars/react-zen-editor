// 에디터 관련 타입 정의

export interface CustomEditorProps {
  value?: string;
  onChange?: (content: string) => void;
}

export interface ToolbarButtonProps {
  command?: string;
  icon: React.ComponentType<any>;
  title: string;
  value?: string | null;
  onClick?: (() => void) | null;
  executeCommand?: (command: string, value?: string | null) => void;
}

export type ModalType = 'link' | 'image' | 'video' | null;

export interface ModalData {
  url: string;
  text?: string;
  alt?: string;
  target?: '_blank' | '_self';
}

export interface DropdownButtonProps {
  icon: React.ComponentType<any>;
  title: string;
  options: Array<{ value: string; label: string }>;
  onOptionSelect: (value: string) => void;
  placeholder?: string;
}

export interface ColorPickerProps {
  type: 'text' | 'background';
  onColorSelect: (color: string) => void;
}

export interface ModalProps {
  modalData: ModalData;
  setModalData: (data: ModalData) => void;
  onInsert: () => void;
  onClose: () => void;
  selectedText?: string;
}