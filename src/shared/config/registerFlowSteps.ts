/**
 * 매물등록 플로우 진행 단계 (차량 업로드 → 검차 진행 → 거래 → 탁송 → 완료).
 * GNB 탭으로 나가지 않고 플로우 내에서 단계만 전환할 때 사용.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §3.5, 1714-22332
 */

import type { ProgressStep } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';

/** 매물등록 플로우 단계 식별자 (차량 업로드 → 검차 → 거래 → 탁송 → 완료) */
export type RegisterFlowStepId = 'upload' | 'inspection' | 'trade' | 'logistics' | 'complete';

const STEP_IDS: RegisterFlowStepId[] = ['upload', 'inspection', 'trade', 'logistics', 'complete'];
const STEP_LABELS: Record<RegisterFlowStepId, string> = {
  upload: '차량 업로드',
  inspection: '검차 진행',
  trade: '거래',
  logistics: '탁송',
  complete: '완료',
};

/**
 * 현재 단계 기준으로 ProgressSidebar용 단계 목록 반환.
 * @param currentStep - 현재 플로우 단계
 * @returns completed/current/upcoming 상태가 붙은 ProgressStep 배열
 */
export function getRegisterFlowSteps(currentStep: RegisterFlowStepId): ProgressStep[] {
  const currentIndex = STEP_IDS.indexOf(currentStep);
  return STEP_IDS.map((id, index) => ({
    id,
    label: STEP_LABELS[id],
    status:
      index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'upcoming',
  }));
}
