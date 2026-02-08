/**
 * Typography Component
 * Figma Typography 1194-7425, 가로 기준 1440px
 * H1/H2/H3/H4/Body/Button/Caption + weight 반영
 */

import type { PropsWithChildren, ElementType, HTMLAttributes } from 'react';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'button' | 'caption';

const variantConfig: Record<
  TypographyVariant,
  { as: ElementType; className: string }
> = {
  h1: { as: 'h1', className: 'text-h1 font-medium leading-tight tracking-tight' },
  h2: { as: 'h2', className: 'text-h2 font-medium leading-tight tracking-tight' },
  h3: { as: 'h3', className: 'text-h3 font-bold leading-tight' },
  h4: { as: 'h4', className: 'text-h4 font-normal leading-normal' },
  body: { as: 'p', className: 'text-body font-normal leading-normal' },
  button: { as: 'span', className: 'text-button font-normal leading-normal' },
  caption: { as: 'span', className: 'text-caption font-normal leading-normal' },
};

export interface TypographyProps extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
  variant?: TypographyVariant;
  as?: ElementType;
}

export function Typography({
  variant = 'body',
  as,
  className = '',
  children,
  ...props
}: TypographyProps) {
  const config = variantConfig[variant];
  const Component = as ?? config.as;

  return (
    <Component
      className={`${config.className} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
