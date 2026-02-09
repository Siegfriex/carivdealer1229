/**
 * 카드 컨테이너 컴포넌트
 * 패딩·호버 그림자 옵션. 디자인: design/design_component/리스트 카드.svg
 */

import type { PropsWithChildren, HTMLAttributes } from 'react';

/** Card props (hover 시 그림자, padding 크기 + div 속성) */
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

/**
 * 카드 래퍼. 흰 배경·테두리·그림자.
 * @param props.hover - true면 호버 시 그림자·커서 포인터
 * @param props.padding - none/sm/md/lg (기본 md)
 */
export const Card = ({
  hover = false,
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) => {
  const hoverClass = hover ? 'hover:shadow-[var(--card-shadow-hover)] cursor-pointer' : '';

  return (
    <div
      className={`
        bg-white border border-gray-100
        transition-shadow duration-base
        ${paddingClasses[padding]}
        ${hoverClass}
        ${className}
      `}
      style={{ borderRadius: 'var(--card-border-radius)', boxShadow: 'var(--card-shadow)' }}
      {...props}
    >
      {children}
    </div>
  );
};
