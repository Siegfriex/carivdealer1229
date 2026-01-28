/**
 * PageLayout
 * 페이지 최외곽: container(1440px + 토큰 패딩) + 선택적 콘텐츠 최대폭.
 * 레이아웃·그리드 정합성용. 내부에서는 그리드/폼만 사용.
 */

interface PageLayoutProps {
  children: React.ReactNode;
  /** 콘텐츠 최대폭. full이면 container만 적용. */
  maxContentWidth?: '2xl' | '3xl' | '4xl' | 'full';
  /** 세로 패딩 (container에 적용) */
  className?: string;
}

const MAX_WIDTH_CLASS = {
  '2xl': 'max-w-2xl mx-auto',
  '3xl': 'max-w-3xl mx-auto',
  '4xl': 'max-w-4xl mx-auto',
  full: '',
} as const;

export const PageLayout = ({
  children,
  maxContentWidth = '3xl',
  className = '',
}: PageLayoutProps) => {
  const innerClass = MAX_WIDTH_CLASS[maxContentWidth];
  return (
    <div className={`container py-10 ${className}`.trim()}>
      {innerClass ? (
        <div className={innerClass}>{children}</div>
      ) : (
        children
      )}
    </div>
  );
};
