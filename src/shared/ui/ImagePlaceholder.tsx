/**
 * ImagePlaceholder — 목업용 이미지 placeholder
 * Figma URL 로드 실패 시 또는 thumbnailUrl 없을 때 "이미지인척" 사각형 박스.
 */

interface ImagePlaceholderProps {
  className?: string;
  /** 비율 (기본 16/9) */
  aspectRatio?: 'video' | 'square' | 'card';
  /** 라벨 (접근성) */
  ariaLabel?: string;
}

const aspectClasses: Record<string, string> = {
  video: 'aspect-video',
  square: 'aspect-square',
  card: 'aspect-[314/174]',
};

export const ImagePlaceholder = ({
  className = '',
  aspectRatio = 'card',
  ariaLabel = '이미지 placeholder',
}: ImagePlaceholderProps) => {
  const aspect = aspectClasses[aspectRatio] ?? '';
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`w-full bg-[#eef5fe] border-2 border-dashed border-gray-300 flex items-center justify-center ${aspect} ${className}`}
    >
      <div className="w-12 h-12 rounded bg-gray-200/60" />
    </div>
  );
};
