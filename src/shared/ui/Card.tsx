/**
 * Card Component
 * 카드 컨테이너 컴포넌트
 * 
 * 디자인: design/design_component/리스트 카드.svg
 */

import type { PropsWithChildren, HTMLAttributes } from 'react';

interface CardProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = ({
  hover = false,
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) => {
  const hoverClass = hover ? 'hover:shadow-lg cursor-pointer' : '';

  return (
    <div
      className={`
        bg-white rounded-md shadow-md
        transition-shadow duration-base
        ${paddingClasses[padding]}
        ${hoverClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
