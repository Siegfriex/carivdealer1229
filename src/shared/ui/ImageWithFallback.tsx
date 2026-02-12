/**
 * ImageWithFallback — src 로드 실패 시 ImagePlaceholder를 fallback으로 표시
 * VehicleCard, VehicleListCard 등 이미지 onError 로직 중복 제거.
 */

import { useState } from 'react';
import { ImagePlaceholder } from './ImagePlaceholder';

export interface ImageWithFallbackProps {
  /** 이미지 URL */
  src: string | null | undefined;
  /** alt 텍스트 */
  alt: string;
  /** img에 적용할 클래스 (object-cover 등) */
  className?: string;
  /** fallback에 적용할 클래스 (컨테이너를 채울 때 w-full h-full 등) */
  fallbackClassName?: string;
  /** fallback placeholder 비율 (기본 card) */
  aspectRatio?: 'video' | 'square' | 'card';
  /** fallback aria-label */
  ariaLabel?: string;
}

/**
 * 이미지가 있으면 표시, 로드 실패 시 ImagePlaceholder 렌더.
 */
export const ImageWithFallback = ({
  src,
  alt,
  className = '',
  fallbackClassName = 'w-full h-full flex items-center justify-center',
  aspectRatio = 'card',
  ariaLabel = '이미지 placeholder',
}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={fallbackClassName}>
        <ImagePlaceholder
          aspectRatio={aspectRatio}
          ariaLabel={ariaLabel}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
