/**
 * 검차 일정·장소 표시 블록.
 * Figma 1121-5308 에셋(clock, map)은 이 위젯에서만 import.
 */

import imgClock from '@/shared/figma_image/1121-5308_검차일정_clock.png';
import imgMap from '@/shared/figma_image/1121-5308_검차장소_map.png';

export interface InspectionScheduleBlockProps {
  /** 검차 일정 표시 문자열 (예: "2025/01/01 10:00") */
  dateDisplay: string;
  /** 검차 장소 표시 문자열 */
  locationDisplay: string;
  className?: string;
}

export function InspectionScheduleBlock({
  dateDisplay,
  locationDisplay,
  className = '',
}: InspectionScheduleBlockProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 text-body text-gray-700 mb-2">
        <img src={imgClock} alt="" className="h-4 w-4 shrink-0" aria-hidden />
        <span>검차 일정: {dateDisplay}</span>
      </div>
      <div className="flex items-center gap-2 text-body text-gray-700 mb-4">
        <img src={imgMap} alt="" className="h-4 w-4 shrink-0" aria-hidden />
        <span>검차 장소: {locationDisplay}</span>
      </div>
    </div>
  );
}
