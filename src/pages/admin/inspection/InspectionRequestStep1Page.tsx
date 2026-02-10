/**
 * InspectionRequestStep1Page Component
 * 검차 신청 Step1 (Figma §3.6 nodeId: 1444:8198)
 * 참조: FIGMASCR0208/§3.6_검차/§3.6_1444-8198_검차신청_Step1_변형.png
 * 검차 차량 선택 · 검차 일정 · 검차 장소 · 검차비 결제
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { ProgressSidebar } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useDevSkip } from '@/shared/context/DevSkipContext';
import { useFormFeedback } from '@/shared/lib/formFeedback';
import { Car, MapPin } from 'lucide-react';

export const InspectionRequestStep1Page = () => {
  const navigate = useNavigate();
  const { skipRequired } = useDevSkip();
  const { showValidationError } = useFormFeedback();
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [defaultAddress, setDefaultAddress] = useState(false);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');

  const handleSubmit = () => {
    if (!skipRequired && (!preferredDate || !preferredTime || !address)) {
      showValidationError('필수 항목을 입력해주세요.');
      return;
    }
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InspectionRequestStep1Page:next',message:'검차 step1→step2',data:{to:'/inspections/request/step2'},timestamp:Date.now(),hypothesisId:'H_CTA2',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    navigate('/inspections/request/step2');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="inspections" />

      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <aside className={`${LAYOUT_CLASSES.SIDEBAR} flex-shrink-0 bg-white border-r border-gray-200 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} flex flex-col`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-button font-medium text-gray-700 mb-2">검색</h3>
            <input
              type="text"
              placeholder="차량번호/모델명"
              className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-md text-body text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex-1 overflow-auto">
            <ProgressSidebar steps={getRegisterFlowSteps('inspection')} inline />
          </div>
        </aside>

        {/* §3.6 Figma 1033-4903: 메인 left 290, width 972~980, 레이아웃 스펙 반영 */}
        <main className={`flex-1 ${LAYOUT_CLASSES.MAIN_PADDING} max-w-[980px]`}>
          <h1 className="text-h1 font-bold text-gray-900 mb-8">검차 신청</h1>

          <div className="space-y-8">
            {/* § 검차 차량 선택 (Figma 1033-4903 1193:6763 블록 스타일) */}
            <section className="bg-white rounded-[15px] border border-gray-200 p-6 shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)]">
              <h2 className="text-body font-bold text-gray-900 mb-4">
                검차 차량 선택 <span className="text-red-500">*</span>
              </h2>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded">
                  <Car className="h-10 w-10 text-gray-500" />
                </div>
                <div className="flex-1 text-body text-gray-600">
                  차량을 선택하거나 등록해주세요.
                </div>
                <Button variant="secondary" size="sm">차량변경</Button>
              </div>
            </section>

            {/* § 검차 일정 (Figma 1193:6709) */}
            <section className="bg-white rounded-[15px] border border-gray-200 p-6 shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)]">
              <h2 className="text-body font-bold text-gray-900 mb-4">
                검차 일정 <span className="text-red-500">*</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="희망 날짜"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  fullWidth
                  required
                />
                <Input
                  label="희망 시간"
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  fullWidth
                  required
                />
              </div>
            </section>

            {/* § 검차 장소 */}
            <section className="bg-white rounded-[15px] border border-gray-200 p-6 shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)]">
              <h2 className="text-body font-bold text-gray-900 mb-4">
                검차 장소 <span className="text-red-500">*</span>
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    label="우편번호"
                    placeholder="우편번호를 입력해 주세요"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    fullWidth
                  />
                  <div className="pt-8">
                    <Button variant="secondary" size="md">우편번호 찾기</Button>
                  </div>
                </div>
                <Input
                  label="주소지"
                  placeholder="주소지를 입력해 주세요"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                  required
                />
                <Input
                  label="상세주소"
                  placeholder="상세주소를 입력해 주세요"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  fullWidth
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={defaultAddress}
                    onChange={(e) => setDefaultAddress(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-body text-gray-700">기본 주소지 설정</span>
                </label>
              </div>
              <Button variant="ghost" className="w-full mt-4" size="md">
                <MapPin className="h-5 w-5 mr-2 inline" />
                지도에서 장소 선택
              </Button>
            </section>

            {/* § 검차비 결제 (Figma 1033-4903 1193:6764, rounded-[30px] shadow) */}
            <section className="bg-white rounded-[30px] border border-gray-200 p-6 shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)]">
              <h2 className="text-body font-bold text-gray-900 mb-4">검차비 결제</h2>
              <p className="text-body text-gray-500">국내 결제 설정 영역 (연동 예정)</p>
            </section>

            {/* 하단 버튼 */}
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                이전
              </Button>
              <div className="flex gap-3">
                <Button variant="secondary">임시저장</Button>
                <Button onClick={handleSubmit}>신청하기</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
