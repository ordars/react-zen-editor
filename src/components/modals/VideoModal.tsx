'use client';

import React from 'react';
import { ModalData } from '../types';
import { isYouTubeUrl } from '../utils';

interface VideoModalProps {
  modalData: ModalData;
  setModalData: React.Dispatch<React.SetStateAction<ModalData>>;
  onInsert: () => void;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({
  modalData,
  setModalData,
  onInsert,
  onClose
}) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">동영상 삽입</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            동영상 URL *
          </label>
          <input
            type="url"
            value={modalData.url}
            onChange={(e) => setModalData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://www.youtube.com/watch?v=... 또는 동영상 파일 URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
          <div className="font-medium mb-1">지원되는 형식:</div>
          <ul className="text-xs space-y-1">
            <li>• YouTube URL (자동으로 임베드 형태로 변환)</li>
            <li>• 직접 동영상 파일 URL (.mp4, .webm 등)</li>
          </ul>
        </div>
        {modalData.url && isYouTubeUrl(modalData.url) && (
          <div className="text-xs text-green-600">
            ✅ YouTube URL이 감지되었습니다. 임베드 형태로 삽입됩니다.
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

export default VideoModal;