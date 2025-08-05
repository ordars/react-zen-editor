// 에디터 관련 타입 정의

export interface CustomEditorProps {
  value?: string;
  onChange?: (content: string) => void;
}

export interface ToolbarButtonProps {
  command?: string;
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  value?: string | null;
  onClick?: (() => void) | null;
}

export type ModalType = 'link' | 'image' | 'video' | null;

export interface ModalData {
  url: string;
  text?: string;
  alt?: string;
  target?: '_blank' | '_self';
}