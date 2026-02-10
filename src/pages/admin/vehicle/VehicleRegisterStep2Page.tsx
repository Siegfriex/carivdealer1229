/**
 * 차량 등록 Step2. 상세 정보·사진 업로드. IA §4.9 CTA_1.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.9
 * @see docs/figma/FSD_SPEC_BLUEPRINT.md §2.2
 * 라우트: /vehicles/new/step2. Figma 1418-20576.
 */

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { useDevSkip } from '@/shared/context/DevSkipContext';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { ProgressSidebar } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { StepProgress, type Step } from '@/shared/ui/StepProgress';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { ImageUpload } from '@/shared/ui/ImageUpload';
import { useFormFeedback } from '@/shared/lib/formFeedback';
import { Save } from 'lucide-react';

const steps: Step[] = [
  { id: 'step1', label: '차량 정보 입력', status: 'completed' },
  { id: 'step2', label: '상세 정보 입력', status: 'current' },
  { id: 'step3', label: '검차 신청', status: 'upcoming' },
];

const fuelTypeOptions = [
  { value: '가솔린', label: '가솔린' },
  { value: '디젤', label: '디젤' },
  { value: '하이브리드', label: '하이브리드' },
  { value: '전기', label: '전기' },
];

export const VehicleRegisterStep2Page = () => {
  const navigate = useNavigate();
  const { skipRequired } = useDevSkip();
  const { showSuccess, showValidationError } = useFormFeedback();
  const [searchParams] = useSearchParams();
  const [fuelType, setFuelType] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleSaveDraft = () => {
    console.log('임시저장:', { fuelType, color, price, files });
    showSuccess('임시저장되었습니다.');
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'VehicleRegisterStep2Page:handleSaveDraft',message:'CTA_1 step2 임시저장',data:{to:'/vehicles?filter=draft'},timestamp:Date.now(),hypothesisId:'H_CTA1',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    navigate('/vehicles?filter=draft');
  };

  const handleNext = () => {
    const vehicleId = searchParams.get('vehicleId') || 'new';
    if (skipRequired) {
      const to = `/vehicles/${vehicleId}/complete`;
      // #region agent log
      fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'VehicleRegisterStep2Page:handleNext',message:'CTA_1 step2→등록완료',data:{to},timestamp:Date.now(),hypothesisId:'H_CTA1',runId:'register-flow-check'})}).catch(()=>{});
      // #endregion
      navigate(to);
      return;
    }
    if (!fuelType) {
      showValidationError('연료 종류를 선택해주세요.');
      return;
    }
    if (!price) {
      showValidationError('판매가를 입력해주세요.');
      return;
    }
    const to = `/vehicles/${vehicleId}/complete`;
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'VehicleRegisterStep2Page:handleNext',message:'CTA_1 step2→등록완료(검차신청)',data:{to},timestamp:Date.now(),hypothesisId:'H_CTA1',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    navigate(to);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="vehicles" />

      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('upload')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline />
        <main className={`flex-1 py-8 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
          <StepProgress steps={steps} className="mb-12" />

          <div className="mx-auto max-w-4xl">
          <h1 className="text-h1 font-bold text-gray-900 mb-2">상세 정보를 입력해주세요</h1>
          <p className="text-body text-gray-600 mb-8">차량의 추가 정보를 입력하고 사진을 업로드하세요</p>

          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            {/* 상세 정보 */}
            <div className="grid grid-cols-2 gap-6">
              <Select
                label="연료 종류"
                options={fuelTypeOptions}
                placeholder="선택하세요"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                fullWidth
                required
              />

              <Input
                label="색상"
                type="text"
                placeholder="예: 화이트"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                fullWidth
              />

              <Input
                label="판매가 (만원)"
                type="number"
                placeholder="2850"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                className="col-span-2"
              />
            </div>

            {/* 차량 사진 업로드 */}
            <div>
              <label className="block text-body font-medium text-gray-700 mb-4">
                차량 사진 업로드
              </label>
              <ImageUpload
                onFilesSelect={(selectedFiles) => setFiles([...files, ...selectedFiles])}
                maxFiles={20}
              />
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-between pt-6">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                이전
              </Button>
              
              <div className="flex gap-4">
                <Button variant="ghost" onClick={handleSaveDraft}>
                  <Save className="h-5 w-5 mr-2" />
                  임시저장
                </Button>
                <Button onClick={handleNext}>다음 (검차 신청)</Button>
              </div>
            </div>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
};
