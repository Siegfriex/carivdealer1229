/**
 * Carousel / ImageCarousel
 * Figma 1193-9217 검차 내역 결과 페이지 중단부 캐러셀
 * 좌우 화살표·인디케이터, 차량/검차 결과 이미지 슬라이드
 */

import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselSlide {
  id: string;
  /** 이미지 URL 또는 alt 전용일 때 빈 문자열 */
  src: string;
  alt: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  /** 자동 재생 간격(ms), 0이면 비활성 */
  autoPlayInterval?: number;
  className?: string;
  /** 슬라이드 영역 aspect ratio (예: "16/9") */
  aspectRatio?: string;
}

export function Carousel({
  slides,
  autoPlayInterval = 0,
  className = '',
  aspectRatio = '16/9',
}: CarouselProps) {
  const [index, setIndex] = useState(0);
  const length = slides.length;

  const goTo = useCallback(
    (next: number) => {
      if (length === 0) return;
      setIndex((i) => (i + next + length) % length);
    },
    [length]
  );

  useEffect(() => {
    if (autoPlayInterval <= 0 || length <= 1) return;
    const t = setInterval(() => goTo(1), autoPlayInterval);
    return () => clearInterval(t);
  }, [autoPlayInterval, length, goTo]);

  if (length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-[var(--radius-md)] ${className}`}
        style={{ aspectRatio }}
      >
        <span className="text-body text-gray-500">이미지 없음</span>
      </div>
    );
  }

  const current = slides[index];

  return (
    <div className={`relative w-full ${className}`} role="region" aria-label="이미지 캐러셀">
      <div
        className="relative w-full overflow-hidden rounded-[var(--radius-md)] bg-gray-100"
        style={{ aspectRatio }}
      >
        {current.src ? (
          <img
            src={current.src}
            alt={current.alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-body text-gray-500">{current.alt || '이미지 없음'}</span>
          </div>
        )}

        {length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-fast"
              aria-label="이전"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-fast"
              aria-label="다음"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {length > 1 && (
        <div className="flex justify-center gap-2 mt-3" role="tablist" aria-label="슬라이드 인디케이터">
          {slides.map((_, i) => (
            <button
              key={slides[i].id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`슬라이드 ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-base ${
                i === index ? 'bg-primary w-6' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
