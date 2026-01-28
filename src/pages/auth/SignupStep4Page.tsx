/**
 * SignupStep4Page (회원가입 Step 4 - 정산 정보 입력)
 * Figma 1194-6002: 정산 정보 입력
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepProgress } from '@/shared/ui/StepProgress';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { PageLayout } from '@/shared/ui/PageLayout';
import { Plus, Image as ImageIcon } from 'lucide-react';

const SIGNUP_STEPS = [
  { id: '1', label: '① 본인인증', status: 'completed' as const },
  { id: '2', label: '② 사업자 정보 입력', status: 'completed' as const },
  { id: '3', label: '③ 중고차 매매업 인증', status: 'completed' as const },
  { id: '4', label: '④ 정산 정보 입력', status: 'current' as const },
  { id: '5', label: '⑤ 약관 동의', status: 'upcoming' as const },
  { id: '6', label: '⑥ 승인 대기', status: 'upcoming' as const },
];

function FileUploadZone({
  label,
  file,
  onFileChange,
  onRemove,
  inputRef,
  accept = 'image/*,.pdf',
}: {
  label: string;
  file: File | null;
  onFileChange: (f: File | null) => void;
  onRemove: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept?: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    onFileChange(selected ?? null);
    e.target.value = '';
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFileChange(f);
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div>
      <label className="block text-body font-medium text-gray-700 mb-2">{label}</label>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-base"
        onDoubleClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        {file ? (
          <div className="space-y-2">
            <ImageIcon className="mx-auto h-12 w-12 text-primary" />
            <p className="text-body text-gray-900 font-medium">{file.name}</p>
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
          onClick={() => inputRef.current?.click()}
        >
          파일추가
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove} disabled={!file}>
          항목 제거
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove} disabled={!file}>
          전체 항목 제거
        </Button>
      </div>
    </div>
  );
}

export const SignupStep4Page = () => {
  const navigate = useNavigate();
  // 필수정보
  const [settlementAccountNo, setSettlementAccountNo] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankbookImage, setBankbookImage] = useState<File | null>(null);

  // 선택정보
  const [accountType, setAccountType] = useState<'corporate' | 'representative' | ''>('');

  const [error, setError] = useState('');
  const bankbookRef = useRef<HTMLInputElement>(null);

  const handlePrev = () => {
    navigate('/signup/step3');
  };

  const handleNext = () => {
    setError('');

    if (!settlementAccountNo.trim()) {
      setError('정산 계좌번호를 입력해주세요.');
      return;
    }
    if (!bankName.trim()) {
      setError('은행명을 입력해주세요.');
      return;
    }
    if (!accountHolderName.trim()) {
      setError('예금주 실명을 입력해주세요.');
      return;
    }
    if (!bankbookImage) {
      setError('통장 사본 이미지를 등록해주세요.');
      return;
    }

    navigate('/signup/step5');
  };

  const clearBankbook = () => {
    setBankbookImage(null);
    if (bankbookRef.current) bankbookRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-white">
      <PageLayout maxContentWidth="3xl">
        <h1 className="text-h1 font-bold text-gray-900 text-center mb-8">회원가입</h1>
        <StepProgress steps={SIGNUP_STEPS} className="mb-12" />

        <div className="space-y-10">
          {/* 필수정보 입력 */}
          <section>
            <h2 className="text-h4 font-bold text-gray-900 mb-4">
              필수정보 입력 <span className="text-error">*</span>
            </h2>
            <div className="space-y-4">
              <Input
                label="정산 계좌번호"
                value={settlementAccountNo}
                onChange={(e) => setSettlementAccountNo(e.target.value)}
                placeholder="계좌번호 '-'를 제외하고 입력"
                fullWidth
                required
              />

              <Input
                label="은행명"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="예) 하나은행, 삼성증권 등"
                fullWidth
                required
              />

              <Input
                label="예금주 실명"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="예금주 실명"
                fullWidth
                required
              />

              <FileUploadZone
                label="통장 사본 이미지"
                file={bankbookImage}
                onFileChange={setBankbookImage}
                onRemove={clearBankbook}
                inputRef={bankbookRef}
              />
            </div>
          </section>

          {/* 선택정보 입력 */}
          <section>
            <h2 className="text-h4 font-bold text-gray-900 mb-4">선택정보 입력</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-body font-medium text-gray-700 mb-2">
                  계좌 유형 선택
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === 'corporate'}
                      onChange={() => setAccountType('corporate')}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="text-body text-gray-900">법인계좌</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === 'representative'}
                      onChange={() => setAccountType('representative')}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="text-body text-gray-900">대표자 계좌</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {error && <p className="text-caption text-error">{error}</p>}

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
