// 에디터 유틸리티 함수들

export const isYouTubeUrl = (url: string): boolean => {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return youtubeRegex.test(url);
};

export const getYouTubeVideoId = (url: string): string | null => {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
};

export const getCurrentAlignment = (editorRef: React.RefObject<HTMLDivElement>): string => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    let element = selection.anchorNode;
    if (element && element.nodeType === Node.TEXT_NODE) {
      element = element.parentElement;
    }
    
    // 현재 요소나 부모 요소에서 text-align 스타일 찾기
    while (element && element !== editorRef.current) {
      if (element instanceof Element) {
        const computedStyle = window.getComputedStyle(element);
        const textAlign = computedStyle.textAlign;
        if (textAlign && textAlign !== 'start') {
          return textAlign;
        }
        // 인라인 스타일도 확인
        if (element instanceof HTMLElement) {
          const inlineStyle = element.style.textAlign;
          if (inlineStyle) {
            return inlineStyle;
          }
        }
      }
      element = element.parentElement;
    }
  }
  return 'left'; // 기본값
};