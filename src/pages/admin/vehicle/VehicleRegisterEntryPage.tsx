/**
 * 매물등록 CTA_1 진입. 차량번호 입력 후 step1으로 이동.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.9
 * @see docs/figmaMCP/impl_plans/1425-7638_구현계획.md
 * 라우트: /vehicles/new. Figma 1425-7638(매물등록 버튼 클릭 시 첫화면).
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header';
import { Button } from '@/shared/ui/Button';
import { Briefcase } from 'lucide-react';

/** Figma 1425:7683 SSOT — 이미 등록/거래된 매물 에러 문구 */
const SSOT_ERROR_ALREADY_REGISTERED = '이미 등록 또는 거래된 매물입니다';

export const VehicleRegisterEntryPage = () => {
  const navigate = useNavigate();
  const [plateNumber, setPlateNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!plateNumber.trim()) {
      setError('차량번호를 입력해주세요');
      return;
    }

    const plateRegex = /^\d{2,3}[가-힣]\s?\d{4}$/;
    if (!plateRegex.test(plateNumber.replace(/\s/g, ''))) {
      setError('올바른 차량번호 형식을 입력해주세요 (예: 123가 4567)');
      return;
    }

    const to = `/vehicles/new/step1?plateNumber=${encodeURIComponent(plateNumber)}`;
    fetch(LOG_INGEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'VehicleRegisterEntryPage:handleNext',
        message: 'CTA_1 랜딩→step1',
        data: { to },
        timestamp: Date.now(),
        hypothesisId: 'H_CTA1',
        runId: 'register-flow-check',
      }),
    }).catch(() => {});
    navigate(to);
  };

  return (
    <div
      className="min-h-screen bg-[var(--color-bg-primary)]"
      data-node-id="1425:7638"
    >
      <LandingHeader
        userName="홍길동"
        variant="main"
        activeNav="vehicles"
      />

      {/* 배지: 한국 수출차량 전문 플랫폼 — Figma 1425:7639 (260, 106, 203×37) */}
      <div
        className="mx-auto max-w-[1440px] px-4 pt-4"
        style={{ paddingLeft: 260 }}
        data-node-id="1425:7639"
      >
        <div
          className={`inline-flex items-center justify-center gap-1.5 px-3 ${LAYOUT_CLASSES.GNB_BADGE} border-[var(--color-primary-border)] bg-[var(--color-primary-light)]`}
          data-node-id="1425:7640"
        >
          <Briefcase className="h-[18px] w-[18px] shrink-0 text-[var(--color-primary)]" data-node-id="1425:7641" />
          <span className="text-[14px] font-semibold text-[var(--color-primary)] whitespace-nowrap" data-node-id="1425:7644">
            한국 수출차량 전문 플랫폼
          </span>
        </div>
      </div>

      {/* 중앙 그룹: 제목 + 입력 박스 + 에러 + 다음 — Figma 1425:7678 (385, 336, 669×350) */}
      <div
        className="mx-auto max-w-[669px] px-4 pt-6 pb-12"
        style={{ marginTop: 336 - 155 - 48 }}
        data-node-id="1425:7678"
      >
        <h1
          className="text-center text-[45px] font-extrabold leading-[61px] text-black mb-8"
          data-node-id="1425:7679"
        >
          빠르고 간편하게!
          <br aria-hidden="true" />
          완벽한 비대면 차량등록
        </h1>

        {/* 입력 박스 669×175 — Figma 1425:7680 */}
        <div
          className="relative h-[175px] w-full max-w-[669px] overflow-hidden rounded-xl border border-gray-200 bg-white"
          data-node-id="1425:7680"
        >
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => {
                setPlateNumber(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNext();
              }}
              placeholder="123가 4567"
              className="w-full max-w-[280px] bg-transparent text-center text-[54px] font-extrabold leading-[61px] text-[var(--color-gray-900)] placeholder:text-[#bebdbd] focus:outline-none"
              data-node-id="1425:7681"
            />
          </div>
        </div>

        {/* 에러: Figma 1425:7683 SSOT "※ 이미 등록 또는 거래된 매물입니다" (중복 시 SSOT_ERROR_ALREADY_REGISTERED 사용) */}
        {error && (
          <p
            className="mt-4 text-center text-[24px] font-extrabold leading-[61px] text-[var(--color-cta3-error-red)]"
            data-node-id="1425:7683"
          >
            ※ {error}
          </p>
        )}

        {/* 다음 버튼 */}
        <div className="mt-8 flex justify-center">
          <Button onClick={handleNext} size="lg" className="min-w-[222px]">
            다음
          </Button>
        </div>
      </div>
    </div>
  );
};
