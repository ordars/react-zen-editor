'use client';

import React from 'react';
import { ModalData } from '../types';

interface ImageModalProps {
  modalData: ModalData;
  setModalData: React.Dispatch<React.SetStateAction<ModalData>>;
  onInsert: () => void;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  modalData,
  setModalData,
  onInsert,
  onClose
}) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">이미지 삽입</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이미지 URL *
          </label>
          <input
            type="url"
            value={modalData.url}
            onChange={(e) => setModalData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            대체 텍스트 (Alt)
          </label>
          <input
            type="text"
            value={modalData.alt}
            onChange={(e) => setModalData(prev => ({ ...prev, alt: e.target.value }))}
            placeholder="이미지 설명"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {modalData.url && (
          <div className="text-xs text-gray-500">
            💡 이미지는 자동으로 반응형 크기로 조정됩니다
          </div>
        )}
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

export default ImageModal;