/**
 * ImageUpload Component
 * 이미지 업로드 컴포넌트
 * 
 * 디자인: design/design_component/차량 사진.svg
 */

import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { X, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onFilesSelect: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
}

export const ImageUpload = ({
  onFilesSelect,
  maxFiles = 10,
  accept = 'image/*',
  className = '',
}: ImageUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files).slice(0, maxFiles - previews.length);
    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));

    setPreviews((prev) => [...prev, ...newPreviews]);
    onFilesSelect(fileArray);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-md
          p-6 text-center cursor-pointer
          transition-base
          ${isDragging ? 'border-primary bg-primary-light' : 'border-gray-300 hover:border-primary'}
        `}
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleChange}
          className="hidden"
        />

        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-body text-gray-600 mb-2">
          이미지를 드래그하거나 클릭하여 업로드
        </p>
        <p className="text-caption text-gray-500">
          최대 {maxFiles}개 파일 ({previews.length}/{maxFiles})
        </p>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={preview} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-md border border-gray-200"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePreview(index);
                }}
                className="
                  absolute top-1 right-1
                  p-1 bg-black bg-opacity-50 rounded-full
                  text-white opacity-0 group-hover:opacity-100
                  transition-opacity
                "
                aria-label="삭제"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
