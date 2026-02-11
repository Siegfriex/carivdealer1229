/**
 * StepFooter — 스텝 페이지 하단 액션 버튼 행
 * CTA_3 가격설정·경매시작가 등 스텝 컴포넌트 공통. fixed/sticky 없음.
 * @see GeneralSalePricePage, AuctionStartPricePage
 */

import { Button } from './Button';

export interface StepFooterProps {
  /** 이전 버튼 클릭 핸들러 */
  onBack?: () => void;
  /** 확인/등록완료 등 메인 버튼 클릭 핸들러 */
  onConfirm?: () => void;
  /** 메인 버튼 라벨 (기본: "확인") */
  confirmLabel?: string;
  /** 이전 버튼 라벨 (기본: "이전") */
  backLabel?: string;
  /** 메인 버튼 비활성화 */
  confirmDisabled?: boolean;
  /** 메인 버튼 추가 className */
  confirmClassName?: string;
  /** 오른쪽 액션 영역 (삭제·임시저장 등) */
  leftActions?: React.ReactNode;
  className?: string;
}

export const StepFooter = ({
  onBack,
  onConfirm,
  confirmLabel = '확인',
  backLabel = '이전',
  confirmDisabled = false,
  confirmClassName = '',
  leftActions,
  className = '',
}: StepFooterProps) => {
  return (
    <div className={`w-full flex flex-wrap gap-4 mt-8 ${className}`}>
      {leftActions}
      {onBack && (
        <Button variant="secondary" onClick={onBack}>
          {backLabel}
        </Button>
      )}
      {onConfirm && (
        <Button onClick={onConfirm} disabled={confirmDisabled} className={confirmClassName}>
          {confirmLabel}
        </Button>
      )}
    </div>
  );
};
