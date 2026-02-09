/**
 * 상태 배지 컴포넌트
 * 변형(기본·primary·success·warning·error·info)·크기(sm/md/lg). 디자인: design/design_component/상태창.svg
 */

import type { PropsWithChildren } from 'react';

/** 배지 색상 변형 */
type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
/** 배지 크기 */
type BadgeSize = 'sm' | 'md' | 'lg';

/** Badge props */
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

/**
 * 배지. 상태·라벨 표시용.
 * @param props.variant - 색상 변형 (기본 default)
 * @param props.size - 크기 (기본 md)
 */
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
