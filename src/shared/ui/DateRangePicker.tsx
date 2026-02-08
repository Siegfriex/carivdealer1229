/**
 * DateRangePicker
 * 기간 선택 (Figma 컴포넌트 정리 - Today, Yesterday, 7 days, 30 days, Custom Date)
 */

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type DatePreset = 'today' | 'yesterday' | '7days' | '30days' | 'custom';

export interface DateRange {
  start: Date;
  end: Date;
}

interface DateRangePickerProps {
  value?: DateRange | null;
  onChange?: (range: DateRange) => void;
  presets?: DatePreset[];
  className?: string;
}

const PRESET_LABELS: Record<DatePreset, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  '7days': '7 days',
  '30days': '30 days',
  custom: 'Custom Date',
};

function getRangeForPreset(preset: DatePreset): DateRange {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  let start = new Date(today);

  switch (preset) {
    case 'today':
      break;
    case 'yesterday':
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
      break;
    case '7days':
      start.setDate(start.getDate() - 6);
      break;
    case '30days':
      start.setDate(start.getDate() - 29);
      break;
    case 'custom':
      start = new Date(today);
      break;
  }
  return { start, end };
}

export function DateRangePicker({
  value,
  onChange,
  presets = ['today', 'yesterday', '7days', '30days', 'custom'],
  className = '',
}: DateRangePickerProps) {
  const [activePreset, setActivePreset] = useState<DatePreset>('today');
  const [viewDate, setViewDate] = useState(() => new Date());

  const range = value ?? getRangeForPreset(activePreset);

  const handlePresetClick = (preset: DatePreset) => {
    setActivePreset(preset);
    if (preset !== 'custom') {
      const next = getRangeForPreset(preset);
      onChange?.(next);
    }
  };

  const daysInMonth = useMemo(() => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startPad = first.getDay();
    const days: (number | null)[] = [];
    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(d);
    return days;
  }, [viewDate]);

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className={`inline-flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 ${className}`}>
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handlePresetClick(p)}
            className={`
              rounded-md px-3 py-1.5 text-caption font-medium transition-fast
              ${activePreset === p ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
          >
            {PRESET_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((d) => (
          <div key={d} className="py-1 text-caption font-medium text-gray-500">
            {d}
          </div>
        ))}
        {daysInMonth.map((d, i) => {
          const cellDate = d != null ? new Date(viewDate.getFullYear(), viewDate.getMonth(), d) : null;
          const inRange =
            cellDate &&
            cellDate.getTime() >= range.start.getTime() &&
            cellDate.getTime() <= range.end.getTime();
          return (
            <button
              key={i}
              type="button"
              disabled={d == null}
              className={`
                rounded p-1.5 text-caption transition-fast
                ${d == null ? 'invisible' : 'hover:bg-gray-100'}
                ${inRange ? 'bg-primary text-white hover:bg-primary-hover' : 'text-gray-800'}
              `}
            >
              {d ?? ''}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-2">
        <button
          type="button"
          onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1))}
          className="rounded p-1 text-gray-500 hover:bg-gray-100"
          aria-label="이전 달"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-body font-medium text-gray-800">
          {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
        </span>
        <button
          type="button"
          onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1))}
          className="rounded p-1 text-gray-500 hover:bg-gray-100"
          aria-label="다음 달"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
