'use client';

import React, { useState, useEffect } from 'react';
import { ZenEditor } from 'react-zen-editor';

export default function EditorTestPage() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [showPreview, setShowPreview] = useState(true);

  // 샘플 콘텐츠들
  const sampleContents = {
    basic: '<p>안녕하세요! <strong>React Zen Editor</strong>를 테스트해보세요. 📝</p>',
    comprehensive: `
      <h1>🧘 React Zen Editor 테스트</h1>
      <p>이것은 <strong>굵은 텍스트</strong>와 <em>기울임 텍스트</em>, 그리고 <u>밑줄 텍스트</u>가 포함된 문단입니다.</p>
      
      <h2>주요 기능들</h2>
      <ul>
        <li>리치 텍스트 편집</li>
        <li>다국어 지원 (한국어/영어)</li>
        <li>이미지 및 동영상 삽입</li>
        <li>색상 및 스타일링</li>
        <li>링크 및 미디어 지원</li>
      </ul>
      
      <h3>스타일링 예시</h3>
      <p style="color: #dc2626;">빨간색 텍스트</p>
      <p style="background-color: #fef3c7; padding: 8px;">노란색 배경의 텍스트</p>
      <p style="text-align: center;">가운데 정렬된 텍스트</p>
      <p style="text-align: right;">오른쪽 정렬된 텍스트</p>
      
      <hr style="border: none; border-top: 1px solid #ccc; margin: 1rem 0;" />
      
      <p>링크 예시: <a href="https://github.com" target="_blank" style="color: #1d4ed8; text-decoration: underline;">GitHub</a></p>
      
      <ol>
        <li>첫 번째 순서</li>
        <li>두 번째 순서</li>
        <li>세 번째 순서</li>
      </ol>
    `,
    english: `
      <h1>🧘 React Zen Editor Test</h1>
      <p>This is a paragraph with <strong>bold text</strong>, <em>italic text</em>, and <u>underlined text</u>.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Rich text editing</li>
        <li>Multilingual support (Korean/English)</li>
        <li>Image and video insertion</li>
        <li>Colors and styling</li>
        <li>Links and media support</li>
      </ul>
      
      <h3>Styling Examples</h3>
      <p style="color: #dc2626;">Red colored text</p>
      <p style="background-color: #fef3c7; padding: 8px;">Text with yellow background</p>
      <p style="text-align: center;">Center aligned text</p>
      <p style="text-align: right;">Right aligned text</p>
      
      <hr style="border: none; border-top: 1px solid #ccc; margin: 1rem 0;" />
      
      <p>Link example: <a href="https://github.com" target="_blank" style="color: #1d4ed8; text-decoration: underline;">GitHub</a></p>
      
      <ol>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ol>
    `
  };

  // 초기 로딩 완료
  useEffect(() => {
    setContent(sampleContents.basic);
    setIsLoading(false);
  }, []);

  // 통계 계산
  const getStats = () => {
    const htmlLength = content.length;
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    const charCount = textContent.length;
    const wordCount = textContent ? textContent.split(/\s+/).length : 0;
    const lineCount = textContent ? textContent.split('\n').length : 0;
    
    return { htmlLength, charCount, wordCount, lineCount };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">에디터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧘 React Zen Editor
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Next.js 환경에서의 테스트 페이지
          </p>
          
          {/* 컨트롤 버튼들 */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <button
              onClick={() => setContent(sampleContents.basic)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              기본 샘플
            </button>
            <button
              onClick={() => setContent(sampleContents.comprehensive)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              종합 샘플
            </button>
            <button
              onClick={() => setContent(sampleContents.english)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              영어 샘플
            </button>
            <button
              onClick={() => setContent('<p><br></p>')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              내용 지우기
            </button>
            <button
              onClick={() => {
                const newHtml = prompt('HTML을 입력하세요:', content);
                if (newHtml !== null) setContent(newHtml);
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              HTML 설정
            </button>
          </div>

          {/* 토글 버튼들 */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => setShowStats(!showStats)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showStats 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              통계 {showStats ? '숨기기' : '보기'}
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showPreview 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              미리보기 {showPreview ? '숨기기' : '보기'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 에디터 영역 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">에디터</h2>
              </div>
              <div className="p-4">
                <ZenEditor
                  value={content}
                  onChange={setContent}
                />
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 통계 */}
            {showStats && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">📊 통계</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">글자 수:</span>
                    <span className="font-mono text-sm">{stats.charCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">단어 수:</span>
                    <span className="font-mono text-sm">{stats.wordCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HTML 길이:</span>
                    <span className="font-mono text-sm">{stats.htmlLength.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">줄 수:</span>
                    <span className="font-mono text-sm">{stats.lineCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* HTML 코드 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">💻 HTML 코드</h3>
                <button
                  onClick={() => navigator.clipboard.writeText(content)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  복사
                </button>
              </div>
              <div className="p-4">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap break-words max-h-64">
                  <code>{content}</code>
                </pre>
              </div>
            </div>

            {/* 미리보기 */}
            {showPreview && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">👁️ 미리보기</h3>
                </div>
                <div className="p-4">
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 테스트 가이드 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">🧪 테스트 가이드</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">기본 기능</h4>
              <ul className="space-y-1">
                <li>• 텍스트 입력 및 편집</li>
                <li>• 굵게, 기울임, 밑줄</li>
                <li>• 텍스트 정렬 (왼쪽/가운데/오른쪽)</li>
                <li>• 글자색, 배경색 변경</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">고급 기능</h4>
              <ul className="space-y-1">
                <li>• 제목 스타일 (H1, H2, H3)</li>
                <li>• 순서 있는/없는 목록</li>
                <li>• 링크, 이미지, 동영상 삽입</li>
                <li>• HTML/WYSIWYG 모드 전환</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">미디어 테스트</h4>
              <ul className="space-y-1">
                <li>• 이미지: https://via.placeholder.com/300x200</li>
                <li>• YouTube: https://youtube.com/watch?v=...</li>
                <li>• 링크: 텍스트 선택 후 링크 삽입</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">키보드 단축키</h4>
              <ul className="space-y-1">
                <li>• Ctrl+B: 굵게</li>
                <li>• Ctrl+I: 기울임</li>
                <li>• Ctrl+U: 밑줄</li>
                <li>• Ctrl+Z: 되돌리기</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}