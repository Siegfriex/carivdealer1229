/**
 * 그리드/리스트 뷰 전환 토글.
 * 에셋(그리드·리스트 아이콘)은 이 컴포넌트에서만 import.
 */

import iconGrid from '@/shared/figma_image/1425-8153_그리드_grid.png';
import iconList from '@/shared/figma_image/1425-8153_리스트_list.png';

export type ViewMode = 'grid' | 'list';

export interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  'aria-label'?: string;
  className?: string;
}

export function ViewModeToggle({
  value,
  onChange,
  'aria-label': ariaLabel = '뷰 모드',
  className = '',
}: ViewModeToggleProps) {
  return (
    <div
      className={`flex items-center gap-2 p-1 bg-gray-100 rounded-md ${className}`.trim()}
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={() => onChange('grid')}
        className={`p-2 rounded transition-fast ${
          value === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
        }`}
        aria-label="그리드 뷰"
        aria-pressed={value === 'grid'}
      >
        <img src={iconGrid} alt="" className="h-5 w-5 object-contain" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        className={`p-2 rounded transition-fast ${
          value === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
        }`}
        aria-label="리스트 뷰"
        aria-pressed={value === 'list'}
      >
        <img src={iconList} alt="" className="h-5 w-5 object-contain" aria-hidden />
      </button>
    </div>
  );
}
