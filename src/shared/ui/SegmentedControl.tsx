/**
 * SegmentedControl
 * 옵션 선택 세그먼트 (Figma 컴포넌트 정리 - 옵션1/옵션2/옵션3 + 건수)
 */

import type { ReactNode } from 'react';

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
  count?: number; // e.g. 10 → "10건"
}

interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5 ${className}`}
      role="tablist"
      aria-label="옵션 선택"
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(opt.value)}
            className={`
              inline-flex items-center gap-2 rounded-sm px-4 py-2 text-button font-medium
              transition-fast
              ${isSelected ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}
            `}
          >
            <span>{opt.label}</span>
            {opt.count != null && (
              <span className={isSelected ? 'text-primary' : 'text-gray-500'}>{opt.count}건</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
