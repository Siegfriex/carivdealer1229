/**
 * 버튼 컴포넌트
 * 기본 스타일 변형(primary/secondary/ghost/danger)·크기(sm/md/lg)·로딩·전체 너비 지원.
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/** 버튼 스타일 변형 */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
/** 버튼 크기 */
type ButtonSize = 'sm' | 'md' | 'lg';

/** Button props (variant, size, loading, fullWidth + HTML button 속성) */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary hover:bg-primary-hover active:bg-primary-active text-white',
  secondary: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-900',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  danger: 'bg-error hover:bg-red-600 active:bg-red-700 text-white',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-caption',
  md: 'px-6 py-3 text-button',
  lg: 'px-8 py-4 text-body',
};

/**
 * 버튼. ref 전달 가능.
 * @param props.variant - 스타일 (기본 primary)
 * @param props.size - 크기 (기본 md)
 * @param props.loading - 로딩 스피너 표시 시 비활성
 * @param props.fullWidth - 너비 100%
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-base disabled:opacity-50 disabled:cursor-not-allowed';
    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        style={{ borderRadius: 'var(--radius-md)' }}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
