/**
 * SignupStep1Page (회원가입 Step 1 - 본인인증)
 * Figma 1194-5792: 기본정보 입력, 본인인증, 신분증 등록
 * DEV:SKIP(좌하단): dev:skip ON 시 필수 입력 검증 스킵 후 step2 이동
 */

import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { StepProgress } from '@/shared/ui/StepProgress';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { PageLayout } from '@/shared/ui/PageLayout';
import { useDevSkip } from '@/shared/context/DevSkipContext';
import { Eye, EyeOff, Plus } from 'lucide-react';

const SIGNUP_STEPS = [
  { id: '1', label: '① 본인인증', status: 'current' as const },
  { id: '2', label: '② 사업자 정보 입력', status: 'upcoming' as const },
  { id: '3', label: '③ 중고차 매매업 인증', status: 'upcoming' as const },
  { id: '4', label: '④ 정산 정보 입력', status: 'upcoming' as const },
  { id: '5', label: '⑤ 약관 동의', status: 'upcoming' as const },
  { id: '6', label: '⑥ 승인 대기', status: 'upcoming' as const },
];

const DOMAIN_OPTIONS = [
  { value: '', label: '도메인 선택' },
  { value: 'naver.com', label: 'naver.com' },
  { value: 'gmail.com', label: 'gmail.com' },
  { value: 'hanmail.net', label: 'hanmail.net' },
  { value: 'daum.net', label: 'daum.net' },
  { value: 'direct', label: '직접입력' },
];

export const SignupStep1Page = () => {
  const navigate = useNavigate();
  const { skipRequired } = useDevSkip();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailLocal, setEmailLocal] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [emailDirect, setEmailDirect] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyComplete, setVerifyComplete] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrev = () => {
    navigate('/signup');
  };

  const handleNext = () => {
    setError('');
    if (!skipRequired) {
      if (!loginId || !password || !confirmPassword) {
        setError('기본정보를 모두 입력해주세요.');
        return;
      }
      if (password.length < 6) {
        setError('비밀번호는 6자 이상이어야 합니다.');
        return;
      }
      if (password !== confirmPassword) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
      }
      const domainVal = emailDomain === 'direct' ? emailDirect : emailDomain;
      if (!emailLocal || !domainVal) {
        setError('이메일을 입력해주세요.');
        return;
      }
      if (!name || !phone) {
        setError('본인인증 정보를 입력해주세요.');
        return;
      }
      if (files.length === 0) {
        setError('신분증을 등록해주세요.');
        return;
      }
    }
    navigate('/signup/step2');
  };

  const handleCheckDuplicate = () => {
    if (!loginId) return;
    // TODO: API 중복 확인
    console.log('중복 확인:', loginId);
  };

  const handleSendVerify = () => {
    if (!phone) return;
    // TODO: 인증번호 전송 API
    console.log('인증번호 전송:', phone);
    setVerifyComplete(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected) setFiles((prev) => [...prev, ...Array.from(selected)]);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));
  const clearFiles = () => setFiles([]);

  return (
    <div className="min-h-screen bg-white">
      <PageLayout maxContentWidth="3xl">
        {/* 제목 */}
        <h1 className="text-h1 font-bold text-gray-900 text-center mb-8">회원가입</h1>

        {/* 스텝 진행 (가로형) */}
        <StepProgress steps={SIGNUP_STEPS} className="mb-12" />

        <div className="space-y-10">
          {/* 1. 기본정보 입력 */}
          <section>
            <h2 className="text-h4 font-bold text-gray-900 mb-4">
              기본정보 입력 <span className="text-error">*</span>
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    label="아이디"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="아이디"
                    fullWidth
                    required
                  />
                </div>
                <div className="flex items-end pb-2">
                  <Button type="button" variant="secondary" size="md" onClick={handleCheckDuplicate}>
                    중복 확인
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Input
                  label="비밀번호"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  fullWidth
                  required
                  helperText="6자 이상"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="비밀번호 확인"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호 확인"
                  fullWidth
                  required
                  helperText="6자 이상"
                  error={password !== confirmPassword && confirmPassword ? '비밀번호가 일치하지 않습니다.' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </section>

          {/* 2. 본인인증 */}
          <section>
            <h2 className="text-h4 font-bold text-gray-900 mb-4">
              본인인증 <span className="text-error">*</span>
            </h2>
            <div className="space-y-4">
              <div className="flex flex-wrap items-end gap-2">
                <Input
                  label="이메일 주소"
                  type="text"
                  value={emailLocal}
                  onChange={(e) => setEmailLocal(e.target.value)}
                  placeholder="아이디"
                  className="flex-1 min-w-[120px]"
                />
                <span className="pb-3 text-body text-gray-500">@</span>
                {emailDomain === 'direct' ? (
                  <Input
                    type="text"
                    value={emailDirect}
                    onChange={(e) => setEmailDirect(e.target.value)}
                    placeholder="도메인"
                    className="flex-1 min-w-[120px]"
                  />
                ) : (
                  <div className="min-w-[140px] flex-1">
                    <Select
                      options={DOMAIN_OPTIONS}
                      value={emailDomain}
                      onChange={(e) => setEmailDomain(e.target.value)}
                      fullWidth
                    />
                  </div>
                )}
              </div>

              <Input
                label="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
                fullWidth
                required
              />

              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    label="휴대폰 번호"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="휴대폰 번호"
                    fullWidth
                    required
                  />
                </div>
                <div className="flex items-end pb-2">
                  <Button type="button" variant="secondary" size="md" onClick={handleSendVerify}>
                    인증번호 전송
                  </Button>
                </div>
              </div>

              <Input
                label="인증번호"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="인증번호"
                fullWidth
                required
                helperText={verifyComplete ? '인증이 완료되었습니다.' : undefined}
              />
            </div>
          </section>

          {/* 3. 신분증 등록 */}
          <section>
            <h2 className="text-h4 font-bold text-gray-900 mb-4">
              신분증 등록 <span className="text-error">*</span>
            </h2>
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
                multiple
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Plus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-body text-gray-600">
                이곳을 더블클릭 또는 파일을 드래그 하세요.
              </p>
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
                onClick={() => files.length > 0 && removeFile(files.length - 1)}
              >
                항목 제거
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFiles}
              >
                전체 항목 제거
              </Button>
            </div>
            {files.length > 0 && (
              <p className="text-caption text-gray-500 mt-2">등록된 파일: {files.length}개</p>
            )}
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
