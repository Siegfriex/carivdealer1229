/**
 * 차량 등록 Step2. 원부등록 (2/2). IA §4.9 CTA_1.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.9
 * @see docs/figma/FSD_SPEC_BLUEPRINT.md §2.2
 * 라우트: /vehicles/new/step2.
 */

import { useNavigate } from 'react-router-dom';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { LandingHeader } from '@/widgets/Header';
import { ProgressSidebar } from '@/widgets/ProgressSidebar';
import { Button } from '@/shared/ui/Button';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';

export const VehicleRegisterStep2Page = () => {
  const navigate = useNavigate();

  const handlePrev = () => {
    navigate('/vehicles/new/step1');
  };

  const handleNext = () => {
    navigate('/vehicles');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]" data-node-id="1425:7684-step2">
      <LandingHeader userName="홍길동" variant="main" activeNav="vehicles" />

      <div className="flex max-w-[1440px] mx-auto">
        <aside
          className={`flex-shrink-0 ${LAYOUT_CLASSES.GNB_SIDEBAR} bg-white border-r border-gray-200 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} flex flex-col`}
          data-node-id="1425:7867"
        >
          <div className="flex-1 overflow-auto">
            <ProgressSidebar steps={getRegisterFlowSteps('upload')} inline />
          </div>
        </aside>

        <main className="flex-1 p-8 pl-10">
          <h1 className="text-[28px] font-bold text-black mb-6" data-node-id="1425:7685-step2">
            차량 원부 등록 (2/2)
          </h1>

          <div
            className="rounded-card bg-white p-8 shadow-figma-card max-w-[971px]"
            data-node-id="1425:7685-step2-card"
          >
            <p className="text-[22px] font-bold text-black mb-6">
              차량 등록 원부 (2/2)
            </p>
            <p className="text-body text-gray-600 mb-8">
              Step1에서 입력한 원부를 확인하고, 추가 정보를 입력한 뒤 다음 단계로 진행합니다.
            </p>

            <div className="flex items-center justify-between mt-8 max-w-[971px]">
              <Button variant="secondary" onClick={handlePrev} className="rounded-[10px] px-6 h-[37px]">
                이전
              </Button>
              <Button onClick={handleNext} className="rounded-[10px] px-6 h-[37px]">
                다음
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
