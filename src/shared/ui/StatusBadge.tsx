/**
 * StatusBadge Component
 * 상태 표시 배지
 * 
 * 디자인: design/design_component/상태창.svg
 */

interface StatusBadgeProps {
  label: string;
  color: string;
  variant?: 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'px-3 py-1 text-caption',
  md: 'px-5 py-2 text-button',  // 디자인 파일 기준: 20px padding-x, 33px height
  lg: 'px-6 py-3 text-body',
};

export const StatusBadge = ({
  label,
  color,
  variant = 'filled',
  size = 'md',
  className = '',
}: StatusBadgeProps) => {
  const filledStyles = {
    backgroundColor: color,
    color: '#FFFFFF',
  };

  const outlinedStyles = {
    backgroundColor: 'transparent',
    border: `1px solid ${color}`,
    color: color,
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-md font-medium
        transition-base
        ${sizeClasses[size]}
        ${className}
      `}
      style={{
        ...(variant === 'filled' ? filledStyles : outlinedStyles),
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {label}
    </span>
  );
};
