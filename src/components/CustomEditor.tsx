'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Eye, EyeOff, Link, Image, Video, Heading, AlignJustify, Type, Undo, Redo, Minus, Hash, Copy, ChevronsUpDown } from 'lucide-react';
import { CustomEditorProps, ModalType, ModalData } from '../types';
import { isYouTubeUrl, getYouTubeVideoId, getCurrentAlignment } from '../utils';
import { editorStyles } from '../styles';
import ToolbarButton from './ToolbarButton';
import DropdownButton from './DropdownButton';
import ColorPicker from './ColorPicker';
import LinkModal from './modals/LinkModal';
import ImageModal from './modals/ImageModal';
import VideoModal from './modals/VideoModal';
import { TextColorIcon, BackgroundColorIcon } from './ColorIcons';

const CustomEditor: React.FC<CustomEditorProps> = ({ 
  value = '', 
  onChange = () => {} 
}) => {
  // 다국어 처리 (Hydration mismatch 방지를 위해 클라이언트에서만 감지)
  const [isKorean, setIsKorean] = useState(true); // 기본값: 한국어
  const texts = {
    ko: {
      // 툴바
      bold: '굵게',
      italic: '기울임',
      underline: '밑줄',
      alignLeft: '왼쪽 정렬 (토글)',
      alignCenter: '가운데 정렬 (토글)',
      alignRight: '오른쪽 정렬 (토글)',
      bulletList: '순서 없는 목록',
      numberedList: '순서 있는 목록',
      insertLink: '링크 삽입',
      insertImage: '이미지 삽입',
      insertVideo: '동영상 삽입 (YouTube 지원)',
      horizontalRule: '구분선 삽입',
      specialChars: '특수문자 삽입',
      textColor: '글자 색상',
      backgroundColor: '배경 색상',
      undo: '되돌리기 (Ctrl+Z)',
      redo: '다시실행 (Ctrl+Y)',
      // 드롭다운
      style: '스타일',
      fontSize: '크기',
      lineHeight: '줄간격',
      normalParagraph: '일반 문단',
      heading1: '제목 1 (큰 제목)',
      heading2: '제목 2 (중간 제목)',
      heading3: '제목 3 (작은 제목)',
      verySmall: '매우 작게 (10px)',
      small: '작게 (13px)',
      normal: '보통 (16px)',
      large: '크게 (18px)',
      veryLarge: '매우 크게 (24px)',
      extraLarge: '특대 (32px)',
      huge: '초대형 (48px)',
      lineHeight1: '줄간격 1.0',
      lineHeight12: '줄간격 1.2',
      lineHeight14: '줄간격 1.4',
      lineHeight16: '줄간격 1.6',
      lineHeight18: '줄간격 1.8',
      lineHeight2: '줄간격 2.0',
      lineHeight25: '줄간격 2.5',
      // 하단
      characterCount: '글자 수',
      htmlView: 'HTML 보기',
      editorView: '에디터 보기',
      copyToClipboard: 'HTML 복사',
      copySuccess: '복사완료',
      copyError: '복사 실패',
      // 특수문자
      insertChar: '삽입',
    },
    en: {
      // 툴바
      bold: 'Bold',
      italic: 'Italic', 
      underline: 'Underline',
      alignLeft: 'Align Left (Toggle)',
      alignCenter: 'Align Center (Toggle)',
      alignRight: 'Align Right (Toggle)',
      bulletList: 'Bullet List',
      numberedList: 'Numbered List',
      insertLink: 'Insert Link',
      insertImage: 'Insert Image',
      insertVideo: 'Insert Video (YouTube Support)',
      horizontalRule: 'Insert Horizontal Rule',
      specialChars: 'Insert Special Characters',
      textColor: 'Text Color',
      backgroundColor: 'Background Color',
      undo: 'Undo (Ctrl+Z)',
      redo: 'Redo (Ctrl+Y)',
      // 드롭다운
      style: 'Style',
      fontSize: 'Size',
      lineHeight: 'Line Height',
      normalParagraph: 'Normal Paragraph',
      heading1: 'Heading 1 (Large)',
      heading2: 'Heading 2 (Medium)',
      heading3: 'Heading 3 (Small)',
      verySmall: 'Very Small (10px)',
      small: 'Small (13px)',
      normal: 'Normal (16px)',
      large: 'Large (18px)',
      veryLarge: 'Very Large (24px)',
      extraLarge: 'Extra Large (32px)',
      huge: 'Huge (48px)',
      lineHeight1: 'Line Height 1.0',
      lineHeight12: 'Line Height 1.2',
      lineHeight14: 'Line Height 1.4',
      lineHeight16: 'Line Height 1.6',
      lineHeight18: 'Line Height 1.8',
      lineHeight2: 'Line Height 2.0',
      lineHeight25: 'Line Height 2.5',
      // 하단
      characterCount: 'Character Count',
      htmlView: 'HTML View',
      editorView: 'Editor View',
      copyToClipboard: 'Copy HTML',
      copySuccess: 'Copied!',
      copyError: 'Failed',
      // 특수문자
      insertChar: 'Insert',
    }
  };
  const t = texts[isKorean ? 'ko' : 'en'];

  const [htmlMode, setHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState(value);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<ModalData>({ url: '', text: '', alt: '', target: '_blank' });
  const [selectedText, setSelectedText] = useState('');
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);
  const [showSpecialCharPicker, setShowSpecialCharPicker] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [currentTextColor, setCurrentTextColor] = useState('#ff0000');
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState('#ffff00');
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isUpdatingFromParent = useRef(false);

  // 에디터 명령 실행
  const executeCommand = useCallback((command: string, value: string | null = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value || undefined);
      
      // 명령 실행 후 스타일 강제 적용
      setTimeout(() => {
        forceApplyStyles();
      }, 50);
      
      // 명령 실행 후 내용 업데이트
      const content = editorRef.current.innerHTML;
      setHtmlContent(content);
      onChange(content);
    }
  }, [onChange]);

  // 스타일 강제 적용 함수
  const forceApplyStyles = useCallback(() => {
    if (!editorRef.current) return;
    
    // 제목 태그들에 직접 스타일 적용
    const headings = editorRef.current.querySelectorAll('h1, h2, h3');
    headings.forEach(heading => {
      const tagName = heading.tagName.toLowerCase();
      const element = heading as HTMLElement;
      if (tagName === 'h1') {
        element.style.fontSize = '2rem';
        element.style.fontWeight = 'bold';
        element.style.margin = '1rem 0 0.5rem 0';
        element.style.color = '#1a202c';
        element.style.display = 'block';
      } else if (tagName === 'h2') {
        element.style.fontSize = '1.5rem';
        element.style.fontWeight = 'bold';
        element.style.margin = '0.875rem 0 0.5rem 0';
        element.style.color = '#2d3748';
        element.style.display = 'block';
      } else if (tagName === 'h3') {
        element.style.fontSize = '1.25rem';
        element.style.fontWeight = 'bold';
        element.style.margin = '0.75rem 0 0.5rem 0';
        element.style.color = '#4a5568';
        element.style.display = 'block';
      }
    });
    
    // 일반 문단(p) 태그의 스타일 초기화
    const paragraphs = editorRef.current.querySelectorAll('p');
    paragraphs.forEach(p => {
      const element = p as HTMLElement;
      // 제목에서 문단으로 변경된 경우 불필요한 스타일 제거
      element.style.removeProperty('font-size');
      element.style.removeProperty('font-weight');
      element.style.removeProperty('color');
      element.style.removeProperty('display');
      element.style.removeProperty('line-height');
      element.style.removeProperty('margin');
      
      // 스타일 속성이 완전히 비어있으면 style 속성 자체도 제거
      if (!element.style.cssText) {
        element.removeAttribute('style');
      }
    });
    
    // div 태그 스타일 초기화 (가끔 div로 생성되는 경우)
    const divs = editorRef.current.querySelectorAll('div');
    divs.forEach(div => {
      const element = div as HTMLElement;
      // 제목 스타일이 남아있는 div 태그 정리
      if (element.style.fontSize && (element.style.fontSize === '2rem' || element.style.fontSize === '1.5rem' || element.style.fontSize === '1.25rem')) {
        element.style.removeProperty('font-size');
        element.style.removeProperty('font-weight');
        element.style.removeProperty('color');
        element.style.removeProperty('display');
        element.style.removeProperty('margin');
      }
    });
    
    // 리스트에 직접 스타일 적용
    const lists = editorRef.current.querySelectorAll('ul, ol');
    lists.forEach(list => {
      const element = list as HTMLElement;
      element.style.paddingLeft = '1.5rem';
      element.style.margin = '0.5rem 0';
      element.style.display = 'block';
      if (list.tagName.toLowerCase() === 'ul') {
        element.style.listStyleType = 'disc';
      } else {
        element.style.listStyleType = 'decimal';
      }
    });
    
    // 리스트 아이템에 스타일 적용
    const listItems = editorRef.current.querySelectorAll('li');
    listItems.forEach(item => {
      const element = item as HTMLElement;
      element.style.margin = '0.25rem 0';
      element.style.lineHeight = '1.5';
      element.style.display = 'list-item';
    });
  }, []);

  // 선택된 텍스트 가져오기
  const getSelectedText = useCallback(() => {
    const selection = window.getSelection();
    return selection ? selection.toString() : '';
  }, []);

  // 링크 모달 열기
  const openLinkModal = useCallback(() => {
    const selection = window.getSelection();
    const selected = selection ? selection.toString() : '';
    
    // 현재 선택 영역 또는 커서 위치를 저장
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setSavedRange(range.cloneRange());
    } else {
      // 선택된 텍스트가 없어도 커서 위치 저장을 위해 에디터에 포커스
      if (editorRef.current) {
        editorRef.current.focus();
        const newSelection = window.getSelection();
        if (newSelection && newSelection.rangeCount > 0) {
          const range = newSelection.getRangeAt(0);
          setSavedRange(range.cloneRange());
        }
      }
    }
    
    setSelectedText(selected);
    setModalData({ url: '', text: selected, alt: '', target: '_blank' });
    setActiveModal('link');
  }, []);

  // 이미지 모달 열기
  const openImageModal = useCallback(() => {
    // 현재 커서 위치를 저장
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setSavedRange(range.cloneRange());
    } else {
      // 선택된 텍스트가 없어도 커서 위치 저장을 위해 에디터에 포커스
      if (editorRef.current) {
        editorRef.current.focus();
        const newSelection = window.getSelection();
        if (newSelection && newSelection.rangeCount > 0) {
          const range = newSelection.getRangeAt(0);
          setSavedRange(range.cloneRange());
        }
      }
    }
    
    setModalData({ url: '', text: '', alt: '삽입된 이미지' });
    setActiveModal('image');
  }, []);

  // 동영상 모달 열기
  const openVideoModal = useCallback(() => {
    // 현재 커서 위치를 저장
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setSavedRange(range.cloneRange());
    } else {
      // 선택된 텍스트가 없어도 커서 위치 저장을 위해 에디터에 포커스
      if (editorRef.current) {
        editorRef.current.focus();
        const newSelection = window.getSelection();
        if (newSelection && newSelection.rangeCount > 0) {
          const range = newSelection.getRangeAt(0);
          setSavedRange(range.cloneRange());
        }
      }
    }
    
    setModalData({ url: '', text: '', alt: '' });
    setActiveModal('video');
  }, []);

  // 모달 닫기
  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData({ url: '', text: '', alt: '', target: '_blank' });
    setSelectedText('');
    setSavedRange(null);
  }, []);

  // 링크 삽입 실행
  const insertLink = useCallback(() => {
    const { url, text, target } = modalData;
    if (!url) return;

    // 에디터에 포커스 복원
    if (editorRef.current) {
      editorRef.current.focus();
    }

    if (selectedText && savedRange) {
      // 저장된 선택 영역 복원 (선택된 텍스트가 있는 경우)
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedRange);
        
        // 선택된 텍스트를 링크로 변환
        const targetAttr = target === '_blank' ? ' target="_blank"' : '';
        const linkHTML = `<a href="${url}"${targetAttr} style="color: #1d4ed8; text-decoration: underline;">${selectedText}</a>`;
        executeCommand('insertHTML', linkHTML);
      }
    } else if (savedRange) {
      // 선택된 텍스트는 없지만 저장된 커서 위치가 있는 경우
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedRange);
        
        // 현재 커서 위치에 새 링크 삽입
        const linkText = text || url;
        const targetAttr = target === '_blank' ? ' target="_blank"' : '';
        executeCommand('insertHTML', `<a href="${url}"${targetAttr} style="color: #1d4ed8; text-decoration: underline;">${linkText}</a>`);
      }
    } else {
      // 저장된 위치가 없으면 현재 위치에 삽입
      const linkText = text || url;
      const targetAttr = target === '_blank' ? ' target="_blank"' : '';
      executeCommand('insertHTML', `<a href="${url}"${targetAttr} style="color: #1d4ed8; text-decoration: underline;">${linkText}</a>`);
    }
    
    closeModal();
  }, [modalData, selectedText, savedRange, executeCommand, closeModal]);

  // 이미지 삽입 실행
  const insertImage = useCallback(() => {
    const { url, alt } = modalData;
    if (url) {
      if (savedRange) {
        // 저장된 커서 위치 복원
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(savedRange);
        }
      }
      executeCommand('insertHTML', `<img src="${url}" alt="${alt || '삽입된 이미지'}" style="max-width: 100%; height: auto;" />`);
    }
    closeModal();
  }, [modalData, savedRange, executeCommand, closeModal]);

  // 동영상 삽입 실행
  const insertVideo = useCallback(() => {
    const { url } = modalData;
    if (url) {
      if (savedRange) {
        // 저장된 커서 위치 복원
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(savedRange);
        }
      }
      
      if (isYouTubeUrl(url)) {
        const videoId = getYouTubeVideoId(url);
        if (videoId) {
          const embedHtml = `
            <div contenteditable="false" style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%; margin: 1rem 0;">
              <iframe 
                src="https://www.youtube.com/embed/${videoId}" 
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                frameborder="0" 
                allowfullscreen>
              </iframe>
            </div>
            <p><br></p>
          `;
          executeCommand('insertHTML', embedHtml);
        }
      } else {
        // 일반 동영상 파일 URL
        const videoHtml = `
          <video controls contenteditable="false" style="max-width: 100%; height: auto; margin: 1rem 0;">
            <source src="${url}" type="video/mp4">
            동영상을 재생할 수 없습니다.
          </video>
          <p><br></p>
        `;
        executeCommand('insertHTML', videoHtml);
      }
    }
    closeModal();
  }, [modalData, savedRange, executeCommand, closeModal]);

  // 글자 색상 변경 (CSS 기반)
  const changeTextColor = useCallback((color: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        if (selection.isCollapsed) {
          // 커서만 있는 경우 - 새로운 span 요소를 생성하여 입력될 텍스트에 스타일 적용
          const range = selection.getRangeAt(0);
          const span = document.createElement('span');
          span.style.color = color;
          span.innerHTML = '&#8203;'; // 보이지 않는 문자
          
          range.insertNode(span);
          
          // 커서를 span 내부로 이동
          range.setStart(span.firstChild!, 1);
          range.setEnd(span.firstChild!, 1);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // 텍스트가 선택된 경우 - 선택된 텍스트를 span으로 감싸고 스타일 적용
          const range = selection.getRangeAt(0);
          const selectedContent = range.extractContents();
          
          const span = document.createElement('span');
          span.style.color = color;
          span.appendChild(selectedContent);
          
          range.insertNode(span);
          
          // 선택을 유지
          range.selectNodeContents(span);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        // 변경사항을 상위로 전달 (DOM 업데이트 후 실행)
        setTimeout(() => {
          if (onChange && editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }, 0);
      }
    }
    
    setCurrentTextColor(color);
    setShowTextColorPicker(false);
  }, [onChange]);

  // 배경 색상 변경 (CSS 기반)
  const changeBackgroundColor = useCallback((color: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        if (selection.isCollapsed) {
          // 커서만 있는 경우 - 새로운 span 요소를 생성하여 입력될 텍스트에 스타일 적용
          const range = selection.getRangeAt(0);
          const span = document.createElement('span');
          span.style.backgroundColor = color;
          span.innerHTML = '&#8203;'; // 보이지 않는 문자
          
          range.insertNode(span);
          
          // 커서를 span 내부로 이동
          range.setStart(span.firstChild!, 1);
          range.setEnd(span.firstChild!, 1);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // 텍스트가 선택된 경우 - 선택된 텍스트를 span으로 감싸고 스타일 적용
          const range = selection.getRangeAt(0);
          const selectedContent = range.extractContents();
          
          const span = document.createElement('span');
          span.style.backgroundColor = color;
          span.appendChild(selectedContent);
          
          range.insertNode(span);
          
          // 선택을 유지
          range.selectNodeContents(span);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        // 변경사항을 상위로 전달 (DOM 업데이트 후 실행)
        setTimeout(() => {
          if (onChange && editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }, 0);
      }
    }
    
    setCurrentBackgroundColor(color);
    setShowBackgroundColorPicker(false);
  }, [onChange]);

  // 구분선 삽입
  const insertHorizontalRule = useCallback(() => {
    if (savedRange) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedRange);
      }
    }
    executeCommand('insertHTML', '<hr style="border: none; border-top: 1px solid #ccc; margin: 1rem 0;" />');
  }, [savedRange, executeCommand]);

  // 특수문자 삽입
  const insertSpecialChar = useCallback((char: string) => {
    if (savedRange) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedRange);
      }
    }
    executeCommand('insertText', char);
    setShowSpecialCharPicker(false);
  }, [savedRange, executeCommand]);

  // 특수문자 팔레트 열기
  const openSpecialCharPicker = useCallback(() => {
    // 현재 커서 위치를 저장
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setSavedRange(range.cloneRange());
    } else {
      if (editorRef.current) {
        editorRef.current.focus();
        const newSelection = window.getSelection();
        if (newSelection && newSelection.rangeCount > 0) {
          const range = newSelection.getRangeAt(0);
          setSavedRange(range.cloneRange());
        }
      }
    }
    
    setShowSpecialCharPicker(!showSpecialCharPicker);
    setShowTextColorPicker(false);
    setShowBackgroundColorPicker(false);
  }, [showSpecialCharPicker]);

  // 복사 버튼 기능 (상태별로 다른 복사 방식)
  const copyToClipboard = useCallback(async () => {
    try {
      if (htmlMode) {
        // HTML 보기 상태: HTML 코드를 복사
        await navigator.clipboard.writeText(htmlContent);
      } else {
        // 에디터 보기 상태: 서식을 유지한 상태로 복사
        if (editorRef.current) {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(editorRef.current);
          selection?.removeAllRanges();
          selection?.addRange(range);
          
          // 서식이 유지된 상태로 클립보드에 복사
          const successful = document.execCommand('copy');
          selection?.removeAllRanges();
          
          if (!successful) {
            // execCommand가 실패하면 텍스트만 복사
            const plainText = editorRef.current.textContent || '';
            await navigator.clipboard.writeText(plainText);
          }
        }
      }
      
      setShowCopySuccess(true);
      setTimeout(() => {
        setShowCopySuccess(false);
      }, 2000); // 2초 후 사라짐
    } catch (err) {
      console.error('복사 실패:', err);
      // 오류 발생 시 기본 텍스트 복사 시도
      try {
        const fallbackText = htmlMode ? htmlContent : (editorRef.current?.textContent || '');
        await navigator.clipboard.writeText(fallbackText);
        setShowCopySuccess(true);
        setTimeout(() => {
          setShowCopySuccess(false);
        }, 2000);
      } catch (fallbackErr) {
        console.error('대체 복사도 실패:', fallbackErr);
      }
    }
  }, [htmlContent, htmlMode]);

  // 드롭다운 옵션들
  const styleOptions = [
    { value: 'p', label: t.normalParagraph },
    { value: 'h1', label: t.heading1 },
    { value: 'h2', label: t.heading2 },
    { value: 'h3', label: t.heading3 }
  ];

  const fontSizeOptions = [
    { value: '10px', label: t.verySmall },
    { value: '13px', label: t.small },
    { value: '16px', label: t.normal },
    { value: '18px', label: t.large },
    { value: '24px', label: t.veryLarge },
    { value: '32px', label: t.extraLarge },
    { value: '48px', label: t.huge }
  ];

  const lineHeightOptions = [
    { value: '1', label: t.lineHeight1 },
    { value: '1.2', label: t.lineHeight12 },
    { value: '1.4', label: t.lineHeight14 },
    { value: '1.6', label: t.lineHeight16 },
    { value: '1.8', label: t.lineHeight18 },
    { value: '2', label: t.lineHeight2 },
    { value: '2.5', label: t.lineHeight25 }
  ];

  // 스타일 변경 핸들러
  const handleStyleChange = useCallback((value: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    // 현재 선택된 요소의 이전 스타일 제거
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let element = selection.anchorNode;
      if (element && element.nodeType === Node.TEXT_NODE) {
        element = element.parentElement;
      }
      
      // 현재 요소의 인라인 스타일 제거
      if (element instanceof HTMLElement) {
        element.style.removeProperty('font-size');
        element.style.removeProperty('font-weight');
        element.style.removeProperty('color');
        element.style.removeProperty('margin');
        element.style.removeProperty('display');
        element.style.removeProperty('line-height');
        
        // 스타일 속성이 완전히 비어있으면 style 속성 자체도 제거
        if (!element.style.cssText) {
          element.removeAttribute('style');
        }
      }
    }
    
    // formatBlock 명령 실행
    if (value === 'p') {
      executeCommand('formatBlock', 'p');
    } else {
      executeCommand('formatBlock', `<${value}>`);
    }
  }, [executeCommand]);

  // 글자 크기 변경 핸들러 (CSS 기반)
  const handleFontSizeChange = useCallback((value: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        if (selection.isCollapsed) {
          // 커서만 있는 경우 - 새로운 span 요소를 생성하여 입력될 텍스트에 스타일 적용
          const range = selection.getRangeAt(0);
          const span = document.createElement('span');
          span.style.fontSize = value;
          span.innerHTML = '&#8203;'; // 보이지 않는 문자
          
          range.insertNode(span);
          
          // 커서를 span 내부로 이동
          range.setStart(span.firstChild!, 1);
          range.setEnd(span.firstChild!, 1);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // 텍스트가 선택된 경우 - 선택된 텍스트를 span으로 감싸고 스타일 적용
          const range = selection.getRangeAt(0);
          const selectedContent = range.extractContents();
          
          const span = document.createElement('span');
          span.style.fontSize = value;
          span.appendChild(selectedContent);
          
          range.insertNode(span);
          
          // 선택을 유지
          range.selectNodeContents(span);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        // 변경사항을 상위로 전달 (DOM 업데이트 후 실행)
        setTimeout(() => {
          if (onChange && editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }, 0);
      }
    }
  }, [onChange]);

  // 줄간격 변경 핸들러
  const handleLineHeightChange = useCallback((value: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        // 선택된 텍스트가 있는 경우
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();
        
        // 선택된 영역의 HTML을 완전히 새로 만들기
        const cleanHTML = `<span style="line-height: ${value}">${selectedText}</span>`;
        
        // 기존 선택 영역을 새로운 HTML로 교체
        range.deleteContents();
        range.insertNode(range.createContextualFragment(cleanHTML));
        
        // 에디터 전체에서 중첩된 line-height span 정리
        setTimeout(() => {
          if (editorRef.current) {
            let htmlContent = editorRef.current.innerHTML;
            
            // 정규식으로 중첩된 line-height span 제거 (반복적으로)
            let prevContent = '';
            while (htmlContent !== prevContent) {
              prevContent = htmlContent;
              // 중첩된 line-height span을 찾아서 가장 안쪽 내용만 유지
              htmlContent = htmlContent.replace(
                /<span[^>]*style="[^"]*line-height[^"]*"[^>]*>(\s*<span[^>]*style="[^"]*line-height[^"]*"[^>]*>.*?<\/span>\s*)<\/span>/gi,
                '$1'
              );
            }
            
            // 정리된 HTML을 다시 적용
            if (htmlContent !== editorRef.current.innerHTML) {
              editorRef.current.innerHTML = htmlContent;
              
              // 선택 복원
              const walker = document.createTreeWalker(
                editorRef.current,
                NodeFilter.SHOW_TEXT,
                null
              );
              
              let textNode;
              while (textNode = walker.nextNode()) {
                if (textNode.textContent?.includes(selectedText)) {
                  const newRange = document.createRange();
                  const startIndex = textNode.textContent.indexOf(selectedText);
                  newRange.setStart(textNode, startIndex);
                  newRange.setEnd(textNode, startIndex + selectedText.length);
                  
                  selection.removeAllRanges();
                  selection.addRange(newRange);
                  break;
                }
              }
            }
            
            // 에디터 내용 업데이트
            const content = editorRef.current.innerHTML;
            setHtmlContent(content);
            onChange(content);
          }
        }, 50);
      }
    }
  }, [onChange]);

  // 색상 선택기 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.color-picker-container')) {
        setShowTextColorPicker(false);
        setShowBackgroundColorPicker(false);
      }
    };

    if (showTextColorPicker || showBackgroundColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showTextColorPicker, showBackgroundColorPicker]);

  // 정렬 토글 함수
  const toggleAlignment = useCallback((alignment: string) => {
    const currentAlignment = getCurrentAlignment(editorRef);
    
    if (currentAlignment === alignment) {
      // 같은 정렬이면 완전히 제거
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let element = selection.anchorNode;
        if (element && element.nodeType === Node.TEXT_NODE) {
          element = element.parentElement;
        }
        
        // 현재 블록 요소 찾기
        while (element && element !== editorRef.current) {
          if (element instanceof HTMLElement) {
            const tagName = element.tagName.toLowerCase();
            if (['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'].includes(tagName)) {
              // text-align 스타일 완전히 제거
              element.style.removeProperty('text-align');
              // 스타일 속성이 비어있으면 style 속성 자체도 제거
              if (!element.style.cssText) {
                element.removeAttribute('style');
              }
              break;
            }
          }
          element = element.parentElement;
        }
        
        // 내용 업데이트
        if (editorRef.current) {
          const content = editorRef.current.innerHTML;
          setHtmlContent(content);
          onChange(content);
        }
      }
    } else {
      // 다른 정렬이면 적용
      executeCommand(`justify${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`);
    }
  }, [executeCommand, onChange]);

  // HTML 모드 토글
  const toggleHtmlMode = useCallback(() => {
    if (htmlMode) {
      // HTML 모드에서 에디터 모드로 전환
      const content = textareaRef.current?.value || '';
      setHtmlContent(content);
      onChange(content);
      setHtmlMode(false);
      // 다음 렌더링 후 에디터에 내용 설정
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = content;
        }
      }, 50);
    } else {
      // 에디터 모드에서 HTML 모드로 전환
      const content = editorRef.current?.innerHTML || '';
      setHtmlContent(content);
      onChange(content);
      setHtmlMode(true);
      // 다음 렌더링 후 텍스트영역에 내용 설정
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.value = content;
        }
      }, 50);
    }
  }, [htmlMode, onChange]);

  // 에디터 내용 변경 처리 (직접 타이핑 시)
  const handleEditorInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    if (!isUpdatingFromParent.current) {
      const target = e.target as HTMLDivElement;
      const content = target.innerHTML;
      setHtmlContent(content);
      onChange(content);
      
      // 입력 후 스타일 재적용
      setTimeout(() => {
        forceApplyStyles();
      }, 10);
    }
  }, [onChange, forceApplyStyles]);

  // HTML 텍스트 변경 처리
  const handleHtmlChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setHtmlContent(newContent);
    onChange(newContent);
  }, [onChange]);

  // 외부에서 value가 변경될 때만 에디터 내용 업데이트
  useEffect(() => {
    if (value !== htmlContent && !htmlMode) {
      isUpdatingFromParent.current = true;
      setHtmlContent(value);
      if (editorRef.current) {
        // 현재 포커스된 요소가 에디터가 아닌 경우에만 innerHTML 업데이트
        if (document.activeElement !== editorRef.current) {
          editorRef.current.innerHTML = value;
        }
      }
      // 다음 틱에서 플래그 해제 및 스타일 적용
      setTimeout(() => {
        isUpdatingFromParent.current = false;
        forceApplyStyles();
      }, 50);
    }
  }, [value, htmlContent, htmlMode, forceApplyStyles]);

  // 컴포넌트 마운트 시 초기 내용 설정
  useEffect(() => {
    if (editorRef.current && value && !htmlMode) {
      editorRef.current.innerHTML = value;
      setHtmlContent(value);
      
      // 초기 스타일 적용
      setTimeout(() => {
        forceApplyStyles();
      }, 100);
    }
  }, [forceApplyStyles]); // 빈 배열로 마운트 시에만 실행

  // HTML 모드 변경 시 텍스트영역에 내용 설정
  useEffect(() => {
    if (htmlMode && textareaRef.current) {
      textareaRef.current.value = htmlContent;
    }
  }, [htmlMode, htmlContent]);

  // 클라이언트 사이드에서 언어 감지 (Hydration mismatch 방지)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsKorean(navigator.language.startsWith('ko'));
    }
  }, []);

  // 외부 클릭 감지로 드롭다운들 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // 색상 picker 외부 클릭 감지
      if (!target.closest('.color-picker-container')) {
        setShowTextColorPicker(false);
        setShowBackgroundColorPicker(false);
      }
      
      // 특수문자 picker 외부 클릭 감지  
      if (!target.closest('.special-char-container')) {
        setShowSpecialCharPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* 에디터 스타일 정의 */}
      <style dangerouslySetInnerHTML={{ __html: editorStyles }} />
      
      {/* 툴바 - HTML 모드에서는 숨김 */}
      {!htmlMode && (
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-300">
          {/* 왼쪽 툴바 그룹 */}
          <div className="flex items-center gap-1 flex-wrap">
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
              <ToolbarButton command="bold" icon={Bold} title={t.bold} executeCommand={executeCommand} />
              <ToolbarButton command="italic" icon={Italic} title={t.italic} executeCommand={executeCommand} />
              <ToolbarButton command="underline" icon={Underline} title={t.underline} executeCommand={executeCommand} />
            </div>
            
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
              <ToolbarButton 
                icon={AlignLeft} 
                title={t.alignLeft} 
                onClick={() => toggleAlignment('left')}
                executeCommand={executeCommand}
              />
              <ToolbarButton 
                icon={AlignCenter} 
                title={t.alignCenter} 
                onClick={() => toggleAlignment('center')}
                executeCommand={executeCommand}
              />
              <ToolbarButton 
                icon={AlignRight} 
                title={t.alignRight} 
                onClick={() => toggleAlignment('right')}
                executeCommand={executeCommand}
              />
            </div>
            
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2 md:border-r-0 md:pr-0 md:mr-0">
              <ToolbarButton command="insertUnorderedList" icon={List} title={t.bulletList} executeCommand={executeCommand} />
              <ToolbarButton command="insertOrderedList" icon={ListOrdered} title={t.numberedList} executeCommand={executeCommand} />
            </div>
            
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
              <ToolbarButton icon={Link} title={t.insertLink} onClick={openLinkModal} executeCommand={executeCommand} />
              <ToolbarButton icon={Image} title={t.insertImage} onClick={openImageModal} executeCommand={executeCommand} />
              <ToolbarButton icon={Video} title={t.insertVideo} onClick={openVideoModal} executeCommand={executeCommand} />
            </div>
            
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
              <ToolbarButton icon={Minus} title={t.horizontalRule} onClick={insertHorizontalRule} executeCommand={executeCommand} />
              <div className="relative special-char-container">
                <ToolbarButton icon={Hash} title={t.specialChars} onClick={openSpecialCharPicker} executeCommand={executeCommand} />
                {showSpecialCharPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 p-2">
                    <div className="grid grid-cols-8 gap-1 w-64">
                      {/* 일반 기호 */}
                      {['©', '®', '™', '§', '¶', '†', '‡', '•', '…', '‰', '′', '″', '‹', '›', '«', '»', 
                        '¡', '¿', '¢', '£', '¤', '¥', '€', '₩', '°', '±', '×', '÷', '←', '→', '↑', '↓',
                        '♠', '♣', '♥', '♦', '☆', '★', '♪', '♫', '✓', '✗', '⚡', '☀', '☁', '☂', '❄', '⭐',
                        'α', 'β', 'γ', 'δ', 'ε', 'π', 'λ', 'μ', 'σ', 'φ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ'
                      ].map((char, index) => (
                        <button
                          key={index}
                          type="button"
                          className="p-1 hover:bg-blue-50 rounded text-sm border border-gray-200 min-h-[32px] flex items-center justify-center"
                          onClick={() => insertSpecialChar(char)}
                          title={`${t.insertChar}: ${char}`}
                        >
                          {char}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2 md:border-r-0 md:pr-0 md:mr-0">
              {/* 글자 색상 */}
              <div className="relative color-picker-container">
                <div className="relative">
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-200 rounded transition-colors flex items-center"
                    onClick={() => {
                      setShowTextColorPicker(!showTextColorPicker);
                      setShowBackgroundColorPicker(false);
                    }}
                    title={t.textColor}
                  >
                    <TextColorIcon color="#ff0000" currentColor={currentTextColor} size={16} />
                  </button>
                  {/* 색상 인디케이터 바 */}
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 rounded-sm"
                    style={{ backgroundColor: currentTextColor }}
                  />
                </div>
                {showTextColorPicker && (
                  <ColorPicker type="text" onColorSelect={changeTextColor} />
                )}
              </div>
              
              {/* 배경 색상 */}
              <div className="relative color-picker-container">
                <div className="relative">
                  <button
                    type="button"
                    className="p-2 bg-yellow-400 hover:bg-yellow-500 rounded transition-colors flex items-center"
                    onClick={() => {
                      setShowBackgroundColorPicker(!showBackgroundColorPicker);
                      setShowTextColorPicker(false);
                    }}
                    title={t.backgroundColor}
                  >
                    <BackgroundColorIcon backgroundColor="#FFd700" currentColor={currentBackgroundColor} size={16} />
                  </button>
                  {/* 색상 인디케이터 바 */}
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 rounded-sm"
                    style={{ backgroundColor: currentBackgroundColor }}
                  />
                </div>
                {showBackgroundColorPicker && (
                  <ColorPicker type="background" onColorSelect={changeBackgroundColor} />
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
              <DropdownButton
                icon={Type}
                title={t.fontSize}
                options={fontSizeOptions}
                onOptionSelect={handleFontSizeChange}
                placeholder={t.fontSize}
                dropdownIcon={ChevronsUpDown}
              />
              
              <DropdownButton
                icon={Heading}
                title={t.style}
                options={styleOptions}
                onOptionSelect={handleStyleChange}
                placeholder={t.style}
              />
              
              <DropdownButton
                icon={AlignJustify}
                title={t.lineHeight}
                options={lineHeightOptions}
                onOptionSelect={handleLineHeightChange}
                placeholder={t.lineHeight}
              />
            </div>
            
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2 md:border-r-0 md:pr-0 md:mr-0">
              <ToolbarButton command="undo" icon={Undo} title={t.undo} executeCommand={executeCommand} />
              <ToolbarButton command="redo" icon={Redo} title={t.redo} executeCommand={executeCommand} />
            </div>
          </div>
          

        </div>
      )}

      {/* 에디터 영역 */}
      <div className="relative">
        {/* WYSIWYG 에디터 - htmlMode가 false일 때만 표시 */}
        {!htmlMode && (
          <div
            ref={editorRef}
            contentEditable
            className="min-h-64 p-4 focus:outline-none editor-content block"
            style={{ minHeight: '400px' }}
            onInput={handleEditorInput}
            suppressContentEditableWarning={true}
          />
        )}
        
        {/* HTML 코드 에디터 - htmlMode가 true일 때만 표시 */}
        {htmlMode && (
          <div className="relative">
            {/* HTML 모드 툴바 */}

            
            <textarea
              ref={textareaRef}
              value={htmlContent}
              onChange={handleHtmlChange}
              className="w-full border-0 font-mono resize-none focus:outline-none bg-gray-900 text-gray-100 placeholder-gray-400 block"
              style={{ 
                minHeight: '400px',
                tabSize: 2,
                fontSize: '14px',
                lineHeight: '1.5',
                padding: '16px',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
              }}
              placeholder="HTML 코드를 입력하세요..."
              spellCheck={false}
            />
          </div>
        )}
      </div>
      
      {/* 하단 정보 */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-300 text-xs text-gray-500 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            onClick={toggleHtmlMode}
          >
            {htmlMode ? t.editorView : t.htmlView}
          </button>
          <button
            type="button"
            className="flex items-center justify-center p-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
            onClick={copyToClipboard}
            title={htmlMode ? t.copyToClipboard : (isKorean ? '서식 유지 복사' : 'Copy with Formatting')}
          >
            <Copy size={14} />
          </button>
          {showCopySuccess && (
            <span className="text-green-600 text-xs font-medium animate-pulse">
              {t.copySuccess}
            </span>
          )}
        </div>
        <span>
          {t.characterCount}: {htmlMode ? htmlContent.length : (editorRef.current?.textContent?.length || 0)}
        </span>
      </div>

      {/* 모달 오버레이 */}
      {activeModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 9999 }}
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 링크 모달 */}
            {activeModal === 'link' && (
              <LinkModal
                modalData={modalData}
                setModalData={setModalData}
                selectedText={selectedText}
                onInsert={insertLink}
                onClose={closeModal}
              />
            )}

            {/* 이미지 모달 */}
            {activeModal === 'image' && (
              <ImageModal
                modalData={modalData}
                setModalData={setModalData}
                onInsert={insertImage}
                onClose={closeModal}
              />
            )}

            {/* 동영상 모달 */}
            {activeModal === 'video' && (
              <VideoModal
                modalData={modalData}
                setModalData={setModalData}
                onInsert={insertVideo}
                onClose={closeModal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomEditor;