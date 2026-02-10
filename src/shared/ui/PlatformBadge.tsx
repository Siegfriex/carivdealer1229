/**
 * 플랫폼 배지 (GNB 목록·랜딩 공통)
 * 203×37, rounded 39px, #eef5fe. 에셋은 사용처 위젯에서 넘김.
 */

import type { ReactNode } from 'react';
import { LAYOUT_CLASSES } from '@/shared/config/layout';

export interface PlatformBadgeProps {
  children: React.ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function PlatformBadge({ children, icon, className = '' }: PlatformBadgeProps) {
  return (
    <div
      className={`flex items-center gap-1.5 px-5 py-2 ${LAYOUT_CLASSES.GNB_BADGE} ${className}`.trim()}
      data-testid="platform-badge"
    >
      {icon != null && <span className="flex-shrink-0 [&>img]:h-[18px] [&>img]:w-[18px]">{icon}</span>}
      <span className="text-body font-semibold text-primary">{children}</span>
    </div>
  );
}
