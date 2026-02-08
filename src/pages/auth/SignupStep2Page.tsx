/**
 * SignupStep2Page (회원가입 Step 2 - 사업자 정보 입력)
 * Figma 1194-5866: 사업자 등록 모달
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevSkip } from '@/shared/context/DevSkipContext';
import { StepProgress } from '@/shared/ui/StepProgress';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { PageLayout } from '@/shared/ui/PageLayout';
import { Plus, Image as ImageIcon } from 'lucide-react';

const SIGNUP_STEPS = [
  { id: '1', label: '① 본인인증', status: 'completed' as const },
  { id: '2', label: '② 사업자 정보 입력', status: 'current' as const },
  { id: '3', label: '③ 중고차 매매업 인증', status: 'upcoming' as const },
  { id: '4', label: '④ 정산 정보 입력', status: 'upcoming' as const },
  { id: '5', label: '⑤ 약관 동의', status: 'upcoming' as const },
  { id: '6', label: '⑥ 승인 대기', status: 'upcoming' as const },
];

// 업태 종목 옵션 (예시)
const BUSINESS_TYPE_OPTIONS = [
  { value: '', label: '업태 종목 선택' },
  { value: 'retail', label: '소매업' },
  { value: 'wholesale', label: '도매업' },
  { value: 'service', label: '서비스업' },
];

// 사업자 정보 선택 옵션 (예시)
const BUSINESS_INFO_OPTIONS = [
  { value: '', label: '사업자 정보 선택' },
  { value: 'individual', label: '개인사업자' },
  { value: 'corporation', label: '법인사업자' },
];

// 부가가치세 과세 유형 옵션 (예시)
const VAT_TAX_TYPE_OPTIONS = [
  { value: '', label: '부가가치세 과세 유형 선택' },
  { value: 'vat', label: '부가가치세 과세' },
  { value: 'simplified', label: '간이과세' },
  { value: 'exempt', label: '면세' },
];

export const SignupStep2Page = () => {
  const navigate = useNavigate();
  const { skipRequired } = useDevSkip();
  // 필수정보
  const [businessRegNo, setBusinessRegNo] = useState('');
  const [businessRegImage, setBusinessRegImage] = useState<File | null>(null);
  const [representativeName, setRepresentativeName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessInfo, setBusinessInfo] = useState('');

  // 선택정보
  const [vatTaxType, setVatTaxType] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');

  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrev = () => {
    navigate('/signup/step1');
  };

  const handleNext = () => {
    setError('');
    if (skipRequired) {
      navigate('/signup/step3');
      return;
    }
    // 필수정보 검증
    if (!businessRegNo) {
      setError('사업자 등록 번호를 입력해주세요.');
      return;
    }
    if (!businessRegImage) {
      setError('사업자 등록증 이미지를 등록해주세요.');
      return;
    }
    if (!representativeName) {
      setError('대표자명을 입력해주세요.');
      return;
    }
    if (!businessAddress) {
      setError('사업장 주소를 입력해주세요.');
      return;
    }
    if (!businessType) {
      setError('업태 종목을 선택해주세요.');
      return;
    }
    if (!businessInfo) {
      setError('사업자 정보를 선택해주세요.');
      return;
    }

    navigate('/signup/step3');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setBusinessRegImage(selected);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setBusinessRegImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const removeFile = () => {
    setBusinessRegImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 사업자 등록 번호 포맷팅 (XXX-XX-XXXXX)
  const formatBusinessRegNo = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 10)}`;
  };

  const handleBusinessRegNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBusinessRegNo(e.target.value);
    setBusinessRegNo(formatted);
  };

  return (
    <div className="min-h-screen bg-white">
      <PageLayout maxContentWidth="3xl">
        {/* 제목 */}
        <h1 className="text-h1 font-bold text-gray-900 text-center mb-8">회원가입</h1>

        {/* 스텝 진행 (가로형) */}
        <StepProgress steps={SIGNUP_STEPS} className="mb-12" />

        <div className="space-y-10">
          {/* 필수정보 입력 */}
          <section>
            <h2 className="text-h4 font-bold text-gray-900 mb-4">
              필수정보 입력 <span className="text-error">*</span>
            </h2>
            <div className="space-y-4">
              {/* 사업자 등록 번호 */}
              <Input
                label="사업자 등록 번호"
                value={businessRegNo}
                onChange={handleBusinessRegNoChange}
                placeholder="XXX-XX-XXXXX"
                fullWidth
                required
              />

              {/* 사업자 등록증 이미지 */}
              <div>
                <label className="block text-body font-medium text-gray-700 mb-2">
                  사업자 등록증 이미지 <span className="text-error">*</span>
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-base"
                  onDoubleClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {businessRegImage ? (
                    <div className="space-y-2">
                      <ImageIcon className="mx-auto h-12 w-12 text-primary" />
                      <p className="text-body text-gray-900 font-medium">{businessRegImage.name}</p>
                      <p className="text-caption text-gray-500">파일이 등록되었습니다.</p>
                    </div>
                  ) : (
                    <>
                      <Plus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-body text-gray-600">
                        이곳을 더블클릭 또는 파일을 드래그 하세요.
                      </p>
                    </>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    파일추가
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    disabled={!businessRegImage}
                  >
                    항목 제거
                  </Button>
                </div>
              </div>

              {/* 대표자명 */}
              <Input
                label="대표자명"
                value={representativeName}
                onChange={(e) => setRepresentativeName(e.target.value)}
                placeholder="대표자명"
                fullWidth
                required
              />

              {/* 사업장 주소 */}
              <Input
                label="사업장 주소"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="사업장 주소"
                fullWidth
                required
              />

              {/* 업태 종목 */}
              <Select
                label="업태 종목"
                options={BUSINESS_TYPE_OPTIONS}
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                fullWidth
                required
              />

              {/* 사업자 정보 선택 */}
              <Select
                label="사업자 정보 선택"
                options={BUSINESS_INFO_OPTIONS}
                value={businessInfo}
                onChange={(e) => setBusinessInfo(e.target.value)}
                fullWidth
                required
              />
            </div>
          </section>

          {/* 선택정보 입력 */}
          <section>
            <h2 className="text-h4 font-bold text-gray-900 mb-4">선택정보 입력</h2>
            <div className="space-y-4">
              {/* 부가가치세 과세 유형 */}
              <Select
                label="부가가치세 과세 유형"
                options={VAT_TAX_TYPE_OPTIONS}
                value={vatTaxType}
                onChange={(e) => setVatTaxType(e.target.value)}
                fullWidth
              />

              {/* 사업장 전화번호 */}
              <Input
                label="사업장 전화번호"
                type="tel"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="휴대전화번호 '-'를 제외하고 입력"
                fullWidth
                helperText="휴대전화번호 '-'를 제외하고 입력"
              />
            </div>
          </section>

          {error && (
            <p className="text-caption text-error">{error}</p>
          )}

          {/* 이전 / 다음 */}
          <div className="flex justify-between pt-6">
            <Button variant="secondary" onClick={handlePrev}>
              이전
            </Button>
            <Button onClick={handleNext}>다음</Button>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};
