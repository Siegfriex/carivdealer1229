/**
 * 검차 신청 랜딩. CTA_2 진입. step1 또는 목록으로 이동.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.10
 * @see docs/figma/FSD_SPEC_BLUEPRINT.md §2.2
 * 라우트: /inspections/request. Figma 1444-8198 검차신청_Step1_변형 연계.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { ProgressSidebar } from '@/widgets/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { Button } from '@/shared/ui/Button';
import { Search } from 'lucide-react';

export const InspectionRequestLandingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleStartRequest = () => {
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InspectionRequestLandingPage:handleStartRequest',message:'검차신청 시작→step1',data:{to:'/inspections/request/step1'},timestamp:Date.now(),hypothesisId:'H_CTA2',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    navigate('/inspections/request/step1');
  };

  const handleSaveDraft = () => {
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InspectionRequestLandingPage:handleSaveDraft',message:'검차 임시저장→목록',data:{to:'/inspections'},timestamp:Date.now(),hypothesisId:'H_CTA2',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    navigate('/inspections');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="inspections" />

      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <aside className={`${LAYOUT_CLASSES.GNB_SIDEBAR} flex-shrink-0 bg-white border-r border-gray-200 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} flex flex-col`} data-node-id="1033:4943">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-button font-medium text-gray-700 mb-2">검색</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="차량번호/모델명"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-md text-body text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <ProgressSidebar steps={getRegisterFlowSteps('inspection')} inline />
          </div>
        </aside>

        <main className={`flex-1 ${LAYOUT_CLASSES.MAIN_PADDING} max-w-[980px]`}>
          <h1 className={`${LAYOUT_CLASSES.GNB_TITLE} font-bold text-gray-900 mb-4 mt-2`} data-node-id="1033:4974">검차 신청</h1>
          <p className="text-body text-gray-600 mb-8">
            차량 검차를 신청하시면 전문 평가사가 배정되어 검차가 진행됩니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={handleStartRequest}>
              검차 신청하기
            </Button>
            <Button variant="secondary" size="lg" onClick={handleSaveDraft}>
              임시저장
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};
