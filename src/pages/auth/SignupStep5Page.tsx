/**
 * SignupStep5Page (회원가입 Step 5 - 약관 동의)
 * Figma 1194-6072: 약관 동의
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepProgress } from '@/shared/ui/StepProgress';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Button } from '@/shared/ui/Button';
import { PageLayout } from '@/shared/ui/PageLayout';
import { useToast } from '@/shared/ui/Toast';

const SIGNUP_STEPS = [
  { id: '1', label: '① 본인인증', status: 'completed' as const },
  { id: '2', label: '② 사업자 정보 입력', status: 'completed' as const },
  { id: '3', label: '③ 중고차 매매업 인증', status: 'completed' as const },
  { id: '4', label: '④ 정산 정보 입력', status: 'completed' as const },
  { id: '5', label: '⑤ 약관 동의', status: 'current' as const },
  { id: '6', label: '⑥ 승인 대기', status: 'upcoming' as const },
];

// 약관 내용 (예시)
const TERMS_CONTENT = {
  age14: `1. 수집하는 개인정보의 항목 및 수집방법
- 이름, 생년월일, 성별, 본인인증 정보

2. 개인정보의 수집 및 이용목적
- 만 14세 이상 확인

3. 개인정보의 보유 및 이용기간
- 회원 탈퇴 시까지

4. 동의를 거부할 권리 및 거부 시 불이익
- 동의를 거부할 수 있으나, 서비스 이용이 제한될 수 있습니다.`,

  service: `1. 서비스 제공을 위한 개인정보 수집
- 서비스 이용, 고객 지원, 계약 이행

2. 개인정보 수집 항목
- 이름, 이메일, 전화번호, 주소 등

3. 개인정보 보유 및 이용기간
- 회원 탈퇴 시까지

4. 동의를 거부할 권리 및 거부 시 불이익
- 동의를 거부할 수 있으나, 서비스 이용이 제한될 수 있습니다.`,

  privacy: `1. 개인정보 처리 목적
- 서비스 제공, 본인 확인, 부정 이용 방지

2. 개인정보 처리 및 보유기간
- 회원 탈퇴 시까지

3. 개인정보의 제3자 제공
- 원칙적으로 제공하지 않으며, 법령에 의한 경우에만 제공

4. 정보주체의 권리
- 열람, 정정, 삭제, 처리정지 요구 가능`,

  collection: `1. 개인정보 수집 항목
- 이름, 이메일, 전화번호, 주소, 사업자 정보

2. 개인정보 수집 및 이용 목적
- 회원 관리, 서비스 제공, 마케팅 및 광고

3. 개인정보 보유 및 이용기간
- 회원 탈퇴 시까지

4. 동의를 거부할 권리 및 거부 시 불이익
- 동의를 거부할 수 있으나, 서비스 이용이 제한될 수 있습니다.`,

  marketing: `1. 마케팅 정보 수신 동의
- 이메일, SMS, 푸시 알림을 통한 마케팅 정보 수신

2. 수신 정보 내용
- 이벤트, 할인, 신상품 안내 등

3. 수신 동의 철회
- 언제든지 동의를 철회할 수 있습니다.

4. 동의를 거부할 권리 및 거부 시 불이익
- 마케팅 정보 수신 동의는 선택사항이며, 거부해도 서비스 이용에는 제한이 없습니다.`,
};

function TermsSection({
  title,
  required,
  content,
  checked,
  onChange,
  id,
}: {
  title: string;
  required: boolean;
  content: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-body font-bold text-gray-900">
          {required && <span className="text-error">[필수]</span>} {title}
        </h3>
        <Checkbox id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      </div>
      <div className="bg-white border border-gray-200 rounded p-4 max-h-48 overflow-y-auto">
        <pre className="text-caption text-gray-700 whitespace-pre-wrap font-sans">{content}</pre>
      </div>
    </div>
  );
}

export const SignupStep5Page = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeAge14, setAgreeAge14] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeCollection, setAgreeCollection] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  // 모두 동의 체크 시 모든 약관 동의
  useEffect(() => {
    if (agreeAll) {
      setAgreeAge14(true);
      setAgreeService(true);
      setAgreePrivacy(true);
      setAgreeCollection(true);
      setAgreeMarketing(true);
    }
  }, [agreeAll]);

  // 개별 약관 체크 시 모두 동의 상태 업데이트
  useEffect(() => {
    const allChecked =
      agreeAge14 && agreeService && agreePrivacy && agreeCollection && agreeMarketing;
    if (!allChecked) {
      setAgreeAll(false);
    }
  }, [agreeAge14, agreeService, agreePrivacy, agreeCollection, agreeMarketing]);

  const handleAgreeAllChange = (checked: boolean) => {
    setAgreeAll(checked);
  };

  const handlePrev = () => {
    navigate('/signup/step4');
  };

  const handleNext = () => {
    if (!agreeAge14 || !agreeService || !agreePrivacy || !agreeCollection) {
      showToast('필수 약관에 모두 동의해주세요.', 'error');
      return;
    }

    navigate('/signup/pending');
  };

  const canProceed = agreeAge14 && agreeService && agreePrivacy && agreeCollection;

  return (
    <div className="min-h-screen bg-white">
      <PageLayout maxContentWidth="3xl">
        <h1 className="text-h1 font-bold text-gray-900 text-center mb-8">회원가입</h1>
        <StepProgress steps={SIGNUP_STEPS} className="mb-12" />

        <div className="space-y-6">
          {/* 거래약관 동의 섹션 */}
          <section className="border border-gray-200 rounded-lg bg-gray-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-h4 font-bold text-gray-900">
                거래약관 동의 <span className="text-error">*</span>
              </h2>
            </div>

            {/* 모두 동의 */}
            <div className="mb-6">
              <Checkbox
                id="agree-all"
                label="모두 동의합니다."
                checked={agreeAll}
                onChange={(e) => handleAgreeAllChange(e.target.checked)}
              />
            </div>

            {/* 안내 문구 */}
            <div className="bg-gray-100 border border-gray-200 rounded p-4 mb-6">
              <p className="text-caption text-gray-700">
                서비스 제공을 위해 개인정보를 수집·이용하며, 마케팅 및 광고 활용에 동의하시면
                다양한 혜택을 받으실 수 있습니다. 동의를 거부하실 수 있으나, 일부 서비스 이용에
                제한이 있을 수 있습니다.
              </p>
            </div>

            {/* 개별 약관 */}
            <div className="space-y-4">
              <TermsSection
                id="agree-age14"
                title="만 14세 이상 동의"
                required
                content={TERMS_CONTENT.age14}
                checked={agreeAge14}
                onChange={setAgreeAge14}
              />

              <TermsSection
                id="agree-service"
                title="서비스 제공 약관 동의"
                required
                content={TERMS_CONTENT.service}
                checked={agreeService}
                onChange={setAgreeService}
              />

              <TermsSection
                id="agree-privacy"
                title="개인정보 처리방침 동의"
                required
                content={TERMS_CONTENT.privacy}
                checked={agreePrivacy}
                onChange={setAgreePrivacy}
              />

              <TermsSection
                id="agree-collection"
                title="개인정보 수집 및 이용 동의"
                required
                content={TERMS_CONTENT.collection}
                checked={agreeCollection}
                onChange={setAgreeCollection}
              />

              <TermsSection
                id="agree-marketing"
                title="마케팅 정보 수신 동의"
                required={false}
                content={TERMS_CONTENT.marketing}
                checked={agreeMarketing}
                onChange={setAgreeMarketing}
              />
            </div>
          </section>

          <div className="flex justify-between pt-6">
            <Button variant="secondary" onClick={handlePrev}>
              이전
            </Button>
            <Button onClick={handleNext} disabled={!canProceed}>
              다음
            </Button>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};
