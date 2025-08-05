// 에디터 스타일 정의

export const editorStyles = `
  .editor-content h1,
  .editor-content h1 *,
  .editor-content h1[style] {
    font-size: 2rem !important;
    font-weight: bold !important;
    margin: 1rem 0 0.5rem 0 !important;
    line-height: 1.2 !important;
    color: #1a202c !important;
    display: block !important;
  }
  .editor-content h2,
  .editor-content h2 *,
  .editor-content h2[style] {
    font-size: 1.5rem !important;
    font-weight: bold !important;
    margin: 0.875rem 0 0.5rem 0 !important;
    line-height: 1.3 !important;
    color: #2d3748 !important;
    display: block !important;
  }
  .editor-content h3,
  .editor-content h3 *,
  .editor-content h3[style] {
    font-size: 1.25rem !important;
    font-weight: bold !important;
    margin: 0.75rem 0 0.5rem 0 !important;
    line-height: 1.4 !important;
    color: #4a5568 !important;
    display: block !important;
  }
  .editor-content p {
    margin: 0.5rem 0;
    line-height: 1.6;
  }
  .editor-content ul,
  .editor-content ul[style] {
    margin: 0.5rem 0 !important;
    padding-left: 1.5rem !important;
    list-style-type: disc !important;
    display: block !important;
  }
  .editor-content ol,
  .editor-content ol[style] {
    margin: 0.5rem 0 !important;
    padding-left: 1.5rem !important;
    list-style-type: decimal !important;
    display: block !important;
  }
  .editor-content li,
  .editor-content li[style] {
    margin: 0.25rem 0 !important;
    line-height: 1.5 !important;
    display: list-item !important;
  }
  .editor-content ul ul {
    list-style-type: circle;
    margin: 0.25rem 0;
  }
  .editor-content ol ol {
    list-style-type: lower-alpha;
    margin: 0.25rem 0;
  }
  .editor-content strong {
    font-weight: bold;
  }
  .editor-content em {
    font-style: italic;
  }
  .editor-content u {
    text-decoration: underline;
  }
  .editor-content blockquote {
    border-left: 4px solid #e2e8f0;
    padding-left: 1rem;
    margin: 1rem 0;
    color: #4a5568;
    font-style: italic;
  }
  .editor-content code {
    background-color: #f7fafc;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
  }
  .editor-content pre {
    background-color: #f7fafc;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
  }
  .editor-content a {
    color: #1d4ed8;
    text-decoration: underline;
    cursor: pointer;
  }
  .editor-content a:hover {
    color: #1e40af;
    text-decoration: underline;
  }
  .editor-content a:visited {
    color: #7c3aed;
  }
  .editor-content iframe {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
  }
  .editor-content video {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
  }
  .editor-content img {
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  /* 글자 크기 스타일 */
  .editor-content font[size="1"] {
    font-size: 10px;
  }
  .editor-content font[size="2"] {
    font-size: 13px;
  }
  .editor-content font[size="3"] {
    font-size: 16px;
  }
  .editor-content font[size="4"] {
    font-size: 18px;
  }
  .editor-content font[size="5"] {
    font-size: 24px;
  }
  .editor-content font[size="6"] {
    font-size: 32px;
  }
  .editor-content font[size="7"] {
    font-size: 48px;
  }
  /* 기본 정렬 스타일 - text-align이 없는 경우 왼쪽 정렬 */
  .editor-content p,
  .editor-content div {
    text-align: left;
  }
  .editor-content h1,
  .editor-content h2,
  .editor-content h3 {
    text-align: left;
    margin-bottom: 0.5rem;
  }
  /* 명시적 정렬 스타일 */
  .editor-content [style*="text-align: center"] {
    text-align: center !important;
  }
  .editor-content [style*="text-align: right"] {
    text-align: right !important;
  }
  .editor-content [style*="text-align: left"] {
    text-align: left !important;
  }
  /* 포커스 시 아웃라인 제거 */
  .editor-content:focus {
    outline: none;
  }
  /* 빈 태그에 대한 최소 높이 */
  .editor-content p:empty::before {
    content: "\\00a0";
    color: transparent;
  }
  .editor-content div:empty::before {
    content: "\\00a0";
    color: transparent;
  }
`;