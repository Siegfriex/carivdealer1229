/**
 * PillChip / FilterChips
 * 필터 칩 (Figma 컴포넌트 정리 - 전체, 기본 상품, 옵션 상품, 선택, 비활성, 활성 등)
 */

export interface PillChipOption<T extends string = string> {
  value: T;
  label: string;
}

interface PillChipProps<T extends string = string> {
  options: PillChipOption<T>[];
  value?: T | T[]; // 단일 선택 또는 다중 선택
  onChange?: (value: T) => void;
  multiple?: boolean;
  className?: string;
}

export function PillChip<T extends string>({
  options,
  value,
  onChange,
  multiple: _multiple = false,
  className = '',
}: PillChipProps<T>) {
  const selectedSet = Array.isArray(value) ? new Set(value) : value != null ? new Set([value]) : new Set<string>();

  const handleClick = (optValue: T) => {
    if (!onChange) return;
    onChange(optValue);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} role="group" aria-label="필터 옵션">
      {options.map((opt) => {
        const isSelected = selectedSet.has(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleClick(opt.value)}
            className={`
              inline-flex items-center rounded-full border px-4 py-2 text-button font-medium
              transition-fast
              ${isSelected ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'}
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
