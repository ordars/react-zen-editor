'use client';

import React from 'react';
import { ModalData } from '../types';

interface LinkModalProps {
  modalData: ModalData;
  setModalData: React.Dispatch<React.SetStateAction<ModalData>>;
  selectedText: string;
  onInsert: () => void;
  onClose: () => void;
}

const LinkModal: React.FC<LinkModalProps> = ({
  modalData,
  setModalData,
  selectedText,
  onInsert,
  onClose
}) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">링크 삽입</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL *
          </label>
          <input
            type="url"
            value={modalData.url}
            onChange={(e) => setModalData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
        {!selectedText && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              링크 텍스트
            </label>
            <input
              type="text"
              value={modalData.text}
              onChange={(e) => setModalData(prev => ({ ...prev, text: e.target.value }))}
              placeholder="링크 텍스트 (비어있으면 URL 사용)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        {selectedText && (
          <div className="text-sm text-gray-600">
            선택된 텍스트: "<span className="font-medium">{selectedText}</span>"
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            링크 열기 방식
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="target"
                value="_blank"
                checked={modalData.target === '_blank'}
                onChange={(e) => setModalData(prev => ({ ...prev, target: e.target.value as '_blank' | '_self' }))}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">새창에서 열기 (권장)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="target"
                value="_self"
                checked={modalData.target === '_self'}
                onChange={(e) => setModalData(prev => ({ ...prev, target: e.target.value as '_blank' | '_self' }))}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">현재창에서 열기</span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          취소
        </button>
        <button
          onClick={onInsert}
          disabled={!modalData.url}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          삽입
        </button>
      </div>
    </div>
  );
};

export default LinkModal;