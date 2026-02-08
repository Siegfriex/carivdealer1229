/**
 * Badge Component
 * 상태 배지 컴포넌트
 * 
 * 디자인: design/design_component/상태창.svg
 */

import type { PropsWithChildren } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends PropsWithChildren {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  primary: 'bg-primary text-white border-primary',
  success: 'bg-success text-white border-success',
  warning: 'bg-warning text-white border-warning',
  error: 'bg-error text-white border-error',
  info: 'bg-info text-white border-info',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-1 text-caption',
  md: 'px-5 py-2 text-button',  // 디자인 파일 기준
  lg: 'px-6 py-3 text-body',
};

export const Badge = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
}: BadgeProps) => {
  return (
    <span
      className={`
        inline-flex items-center justify-center
        border font-medium
        transition-base
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      style={{
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {children}
    </span>
  );
};
