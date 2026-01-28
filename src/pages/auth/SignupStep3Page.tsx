/**
 * SignupStep3Page (회원가입 Step 3 - 중고차 매매업 인증)
 * Figma 1194-5921: 필수정보 입력 및 선택정보 입력
 */

import { useState, useRef } from 'react';
import { StepProgress } from '@/shared/ui/StepProgress';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Plus, Image as ImageIcon } from 'lucide-react';

const SIGNUP_STEPS = [
  { id: '1', label: '① 본인인증', status: 'completed' as const },
  { id: '2', label: '② 사업자 정보 입력', status: 'completed' as const },
  { id: '3', label: '③ 중고차 매매업 인증', status: 'current' as const },
  { id: '4', label: '④ 정산 정보 입력', status: 'upcoming' as const },
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

export const SignupStep3Page = () => {
  // 필수정보
  const [dealershipRegCert, setDealershipRegCert] = useState<File | null>(null);
  const [dealershipName, setDealershipName] = useState('');
  const [employeeCardNo, setEmployeeCardNo] = useState('');
  const [employeeCardPhoto, setEmployeeCardPhoto] = useState<File | null>(null);
  const [dealershipRegImage, setDealershipRegImage] = useState<File | null>(null);

  // 선택정보
  const [falseSalePledgeSignature, setFalseSalePledgeSignature] = useState('');
  const [associationMember, setAssociationMember] = useState<'yes' | 'no'>('no');

  const [error, setError] = useState('');
  const regCertRef = useRef<HTMLInputElement>(null);
  const employeePhotoRef = useRef<HTMLInputElement>(null);
  const regImageRef = useRef<HTMLInputElement>(null);

  const handlePrev = () => {
    window.history.pushState({}, '', '/signup/step2');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleNext = () => {
    setError('');

    if (!dealershipRegCert) {
      setError('중고차 매매업 등록증을 등록해주세요.');
      return;
    }
    if (!dealershipName.trim()) {
      setError('매매 상사명을 입력해주세요.');
      return;
    }
    if (!employeeCardNo.trim()) {
      setError('매매 사원증 번호를 입력해주세요.');
      return;
    }
    if (!employeeCardPhoto) {
      setError('매매 사원증 사진을 등록해주세요.');
      return;
    }
    if (!dealershipRegImage) {
      setError('매매업 등록증 이미지를 등록해주세요.');
      return;
    }

    window.history.pushState({}, '', '/signup/step4');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const clearFile = (
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    ref: React.RefObject<HTMLInputElement | null>
  ) => {
    setter(null);
    if (ref.current) ref.current.value = '';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-h1 font-bold text-gray-900 text-center mb-8">회원가입</h1>
        <StepProgress steps={SIGNUP_STEPS} className="mb-12" />

        <div className="space-y-10">
          {/* 필수정보 입력 */}
          <section>
            <h2 className="text-h4 font-bold text-gray-900 mb-4">
              필수정보 입력 <span className="text-error">*</span>
            </h2>
            <div className="space-y-4">
              <FileUploadZone
                label="중고차 매매업 등록증"
                file={dealershipRegCert}
                onFileChange={setDealershipRegCert}
                onRemove={() => clearFile(setDealershipRegCert, regCertRef)}
                inputRef={regCertRef}
              />

              <Input
                label="매매 상사명"
                value={dealershipName}
                onChange={(e) => setDealershipName(e.target.value)}
                placeholder="매매 상사명"
                fullWidth
                required
              />

              <Input
                label="매매 사원증 번호"
                value={employeeCardNo}
                onChange={(e) => setEmployeeCardNo(e.target.value)}
                placeholder="예) AA12-12345"
                fullWidth
                required
              />

              <FileUploadZone
                label="매매 사원증 사진"
                file={employeeCardPhoto}
                onFileChange={setEmployeeCardPhoto}
                onRemove={() => clearFile(setEmployeeCardPhoto, employeePhotoRef)}
                inputRef={employeePhotoRef}
              />

              <FileUploadZone
                label="매매업 등록증 이미지"
                file={dealershipRegImage}
                onFileChange={setDealershipRegImage}
                onRemove={() => clearFile(setDealershipRegImage, regImageRef)}
                inputRef={regImageRef}
              />
            </div>
          </section>

          {/* 선택정보 입력 */}
          <section>
            <h2 className="text-h4 font-bold text-gray-900 mb-4">선택정보 입력</h2>
            <div className="space-y-4">
              <Input
                label="허위매물 근절 서약서(전자서명)"
                value={falseSalePledgeSignature}
                onChange={(e) => setFalseSalePledgeSignature(e.target.value)}
                placeholder="전자서명 입력"
                fullWidth
              />

              <div>
                <label className="block text-body font-medium text-gray-700 mb-2">
                  협회/조합 회원 여부
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="associationMember"
                      checked={associationMember === 'yes'}
                      onChange={() => setAssociationMember('yes')}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="text-body text-gray-900">예</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="associationMember"
                      checked={associationMember === 'no'}
                      onChange={() => setAssociationMember('no')}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="text-body text-gray-900">아니오</span>
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
      </div>
    </div>
  );
};
