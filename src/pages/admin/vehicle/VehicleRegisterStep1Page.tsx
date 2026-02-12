/**
 * 차량 등록 Step1. 원부등록 (1/2). IA §4.9 CTA_1.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.9
 * @see docs/figmaMCP/impl_plans/1425-7684_구현계획.md
 * 라우트: /vehicles/new/step1. Figma 1425-7684(등록됨).
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header';
import { ProgressSidebar } from '@/widgets/ProgressSidebar';
import { useDevSkip } from '@/shared/context/DevSkipContext';
import { Button } from '@/shared/ui/Button';
import { MessageModal } from '@/shared/ui/MessageModal';
import { ocrRegistration } from '@/features/vehicle-registration';
import { useFormFeedback } from '@/shared/lib/formFeedback';
import { Search } from 'lucide-react';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';

/** 좌측 열 필드 (Figma 1425:7687) */
const LEFT_FIELDS: { id: string; label: string; placeholder: string }[] = [
  { id: 'serialNumber', label: '일련번호', placeholder: "계좌번호 '-'를 제외하고 입력" },
  { id: 'managementNumber', label: '제원관리번호', placeholder: 'xxxx' },
  { id: 'cancellationDate', label: '말소등록일', placeholder: 'xxxx' }, /* Figma metadata 1425:7701 "말소등쪽일" → SSOT 정정 "말소등록일" */
  { id: 'modelName', label: '차명', placeholder: 'xxxx' },
  { id: 'vehicleType', label: '치종', placeholder: 'xxxx' },
  { id: 'vin', label: '차대번호', placeholder: 'xxxx' },
  { id: 'engineSpec', label: '원동기명식', placeholder: 'xxxx' },
  { id: 'use', label: '용도', placeholder: 'xxxx' },
  { id: 'modelYear', label: '연식(모델년도)', placeholder: 'xxxx' },
  { id: 'color', label: '색상', placeholder: 'xxxx' },
  { id: 'sourceType', label: '출처구분', placeholder: 'xxxx' },
];

/** 우측 열 필드 (Figma 1425:7754) */
const RIGHT_FIELDS: { id: string; label: string; placeholder: string }[] = [
  { id: 'firstRegistrationDate', label: '최초등록일', placeholder: "계좌번호 '-'를 제외하고 입력" },
  { id: 'detailType', label: '세부유형(사업용 자동차만 해당합니다.)', placeholder: '예) 하나은행, 삼성증권 등' },
  { id: 'manufactureDate', label: '제작연월일', placeholder: 'xxxx' },
  { id: 'lastOwner', label: '최종소유자', placeholder: 'xxxx' },
  { id: 'residentNumber', label: '주민(법인)등록번호', placeholder: 'xxxx' },
  { id: 'garageAddress', label: '사용본거지(차고지)', placeholder: 'xxxx' },
  { id: 'inspectionExpiry', label: '검사유효기간', placeholder: 'xxxx' },
  { id: 'registrationConfirmDate', label: '등록사항 확인일', placeholder: 'xxxx' },
  { id: 'closureDate', label: '폐쇠일', placeholder: 'xxxx' },
  { id: 'colorRight', label: '색상', placeholder: 'xxxx' },
  { id: 'sourceTypeRight', label: '출처구분', placeholder: 'xxxx' },
];

/** 원부등록 행: 라벨 + 입력 + 수정 버튼 (Figma 행 높이 68px). 텍스트 튀어나오지 않도록 overflow·min-w-0 적용. 선택자: data-testid="form-row" */
function FormRow({
  label,
  placeholder,
  value,
  onChange,
  onEdit,
  dataNodeId,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onEdit: () => void;
  dataNodeId?: string;
}) {
  return (
    <div
      className="grid min-w-0 max-w-full grid-cols-[minmax(0,145px)_minmax(0,1fr)_68px] gap-0 items-start overflow-hidden"
      style={{ minHeight: 68 }}
      data-node-id={dataNodeId}
      data-testid="form-row"
    >
      <label className="min-w-0 truncate text-[16px] font-bold text-black pt-0.5">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 max-w-full truncate mt-[28px] h-10 rounded-[5px] border-0 bg-[var(--color-gray-100)] px-3 text-[14px] text-gray-900 placeholder-[var(--color-1033-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      />
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 mt-[28px] h-10 w-[68px] rounded-[5px] bg-[var(--color-gray-100)] text-[14px] text-[var(--color-1033-placeholder)] hover:bg-gray-200 hover:text-gray-700"
      >
        수정
      </button>
    </div>
  );
}

export const VehicleRegisterStep1Page = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showValidationError, showSuccess } = useFormFeedback();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const plate = searchParams.get('plateNumber');
    if (plate) setPlateNumber(decodeURIComponent(plate));
  }, [searchParams]);

  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [ocrLoading, setOcrLoading] = useState(false);
  const { skipRequired } = useDevSkip();

  const updateField = (id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleOcr = async () => {
    if (!skipRequired && !plateNumber) {
      showValidationError('차량번호를 입력해주세요');
      return;
    }
    setOcrLoading(true);
    try {
      const result = await ocrRegistration(plateNumber);
      setFormValues((prev) => ({
        ...prev,
        vin: result.vin ?? prev.vin,
        modelName: result.model ?? prev.modelName,
        modelYear: result.year ?? prev.modelYear,
      }));
    } catch (error) {
      console.error('OCR failed:', error);
      showValidationError('OCR 처리에 실패했습니다');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    showSuccess('임시저장되었습니다.');
    fetch(LOG_INGEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'VehicleRegisterStep1Page:handleSaveDraft',
        message: 'CTA_1 step1 임시저장',
        data: { to: '/vehicles?filter=draft' },
        timestamp: Date.now(),
        hypothesisId: 'H_CTA1',
        runId: 'register-flow-check',
      }),
    }).catch(() => {});
    navigate('/vehicles?filter=draft');
  };

  const handleSubmit = () => {
    const queryString = plateNumber ? `plateNumber=${encodeURIComponent(plateNumber)}` : '';
    const to = `/inspections/request${queryString ? `?${queryString}` : ''}`;
    fetch(LOG_INGEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'VehicleRegisterStep1Page:handleSubmit',
        message: 'CTA_1 step1→검차신청',
        data: { to },
        timestamp: Date.now(),
        hypothesisId: 'H_CTA1',
        runId: 'register-flow-check',
      }),
    }).catch(() => {});
    navigate(to);
  };

  const handleDelete = () => setShowDeleteConfirm(true);
  const handleConfirmDelete = () => {
    navigate('/vehicles');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]" data-node-id="1425:7684">
      <MessageModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="삭제 확인"
        message="정말 삭제하시겠습니까?"
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleConfirmDelete}
        variant="warning"
      />
      <LandingHeader userName="홍길동" variant="main" activeNav="vehicles" />

      <div className="flex max-w-[1440px] mx-auto">
        {/* 좌측 사이드바: Figma 1425:7867 — 249×2151 */}
        <aside
          className={`flex-shrink-0 ${LAYOUT_CLASSES.GNB_SIDEBAR} bg-white border-r border-gray-200 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} flex flex-col`}
          data-node-id="1425:7867"
        >
          <div className="p-4 border-b border-gray-200">
            <p className="text-[14px] text-[rgba(144,144,144,0.6)] mb-2">검색</p>
            <div className="relative">
              <input
                type="text"
                placeholder="차량번호/모델명"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-3 pr-10 rounded-[20px] border border-black/10 bg-white text-[14px] text-gray-900 placeholder-[#909090] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <ProgressSidebar steps={getRegisterFlowSteps('upload')} inline />
          </div>
        </aside>

        {/* 메인: 페이지 제목 + 상단 카드 + 원부 폼 카드 + 하단 액션 */}
        <main className="flex-1 p-8 pl-10">
          <h1
            className="text-[28px] font-bold text-black mb-6"
            data-node-id="1425:7685"
          >
            차량 원부 등록
          </h1>

          {/* 상단 카드: 차량 등록 원부 + * + 스크린샷 영역 (Figma 1425:7824) */}
          <div
            className="mb-6 rounded-card bg-white p-6 shadow-figma-card max-w-[971px]"
            data-node-id="1425:7824"
          >
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[22px] font-bold text-black">차량 등록 원부</h2>
              <span className="text-[22px] font-bold text-[var(--color-error-figma)]">*</span>
            </div>
            <div className="h-[300px] w-full max-w-[921px] rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-body">
              차량 이미지 영역
            </div>
          </div>

          {/* 메인 폼 카드: 차량 등록 원부 (1/2) + 2단 폼 (Figma 1425:7685, 7686, 7687, 7754) */}
          <div
            className="rounded-card bg-white p-8 shadow-figma-card max-w-[971px]"
            data-node-id="1425:7685"
          >
            <p
              className="text-[22px] font-bold text-black mb-6"
              data-node-id="1425:7821"
            >
              차량 등록 원부 (1/2)
            </p>

            <div className="flex min-w-0 gap-[106px]" data-node-id="1425:7686">
              {/* 좌측 열 358px, 행 간격 31px — 선택자: [data-form-column="left"] 또는 [data-node-id="1425:7687"] */}
              <div className="flex w-[358px] min-w-0 flex-col gap-[31px] overflow-hidden" data-node-id="1425:7687" data-form-column="left">
                {LEFT_FIELDS.map((f) => (
                  <FormRow
                    key={f.id}
                    label={f.label}
                    placeholder={f.placeholder}
                    value={formValues[f.id] ?? ''}
                    onChange={(v) => updateField(f.id, v)}
                    onEdit={() => {}}
                  />
                ))}
              </div>
              {/* 우측 열 358px — 선택자: [data-form-column="right"] 또는 [data-node-id="1425:7754"] */}
              <div className="flex w-[358px] min-w-0 flex-col gap-[31px] overflow-hidden" data-node-id="1425:7754" data-form-column="right">
                {RIGHT_FIELDS.map((f) => (
                  <FormRow
                    key={f.id}
                    label={f.label}
                    placeholder={f.placeholder}
                    value={formValues[f.id] ?? ''}
                    onChange={(v) => updateField(f.id, v)}
                    onEdit={() => {}}
                  />
                ))}
              </div>
            </div>

            {/* 차량번호 + OCR (기능 유지) */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4 items-end">
              <div>
                <label className="block text-[16px] font-bold text-black mb-1">차량번호</label>
                <input
                  type="text"
                  placeholder="123가 4567"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="h-10 w-[200px] rounded-[5px] border border-gray-200 bg-[var(--color-gray-100)] px-3 text-[14px]"
                />
              </div>
              <Button onClick={handleOcr} loading={ocrLoading} size="md">
                OCR 실행
              </Button>
            </div>
          </div>

          {/* 하단 액션: 삭제, 저장(임시저장), 다음(검차신청) — Figma 1425:7915, 7916, 7822 */}
          <div className="flex items-center justify-between mt-8 max-w-[971px]">
            <div className="flex gap-6">
              <button
                type="button"
                onClick={handleDelete}
                className="text-[12px] text-[#161616] hover:text-black"
                data-node-id="1425:7915"
              >
                삭제
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="text-[12px] text-[#161616] hover:text-black"
              >
                임시저장
              </button>
            </div>
            <Button
              onClick={handleSubmit}
              className="rounded-[10px] px-6 h-[37px]"
              data-node-id="1425:7822"
            >
              다음
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};
