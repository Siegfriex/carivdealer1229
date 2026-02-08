/**
 * VehicleRegisterStep1Page Component
 * 차량 등록 Step1 (Figma 1418:23705, 1418:23880 — §3.5 차량 등록·상세·경매)
 *
 * 좌측: ProgressSidebar (검색 + 스텝 진행)
 * 메인: 차량 정보 섹션 + 차량 등록원부 섹션. 라우트: /vehicles/new/step1
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { ProgressSidebar, type ProgressStep } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { useDevSkip } from '@/shared/context/DevSkipContext';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { ImageUpload } from '@/shared/ui/ImageUpload';
import { ocrRegistration } from '@/features/vehicle/register-form/api/vehicleApi';
import { VehicleStatusBadge } from '@/entities/vehicle/ui/VehicleStatusBadge';
import { ChevronLeft, ChevronRight, ScanEye, Search } from 'lucide-react';
import { LAYOUT_CLASSES } from '@/shared/config/layout';

const progressSteps: ProgressStep[] = [
  { id: 'upload', label: '차량 업로드', status: 'current' },
  { id: 'inspection', label: '검차 진행', status: 'upcoming' },
  { id: 'trade', label: '거래', status: 'upcoming' },
  { id: 'logistics', label: '탁송', status: 'upcoming' },
  { id: 'complete', label: '완료', status: 'upcoming' },
];

export const VehicleRegisterStep1Page = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [plateNumber, setPlateNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const plate = searchParams.get('plateNumber');
    if (plate) {
      setPlateNumber(decodeURIComponent(plate));
    }
  }, [searchParams]);

  // 차량 정보 (OCR 결과 또는 수동 입력)
  const [vehicleData, setVehicleData] = useState({
    vin: '',
    manufacturer: '현대',
    modelName: 'G70 3T 스포츠 엘리트',
    modelYear: '2020',
    mileage: '9.0',
    price: '3000',
    status: 'inspection' as const,
    updatedAt: new Date(),
  });

  // 등록원부 정보
  const [registrationData, setRegistrationData] = useState({
    businessNumber: '',
    businessCertificateImage: null as File | null,
    representativeName: '',
    businessAddress: '',
    businessType: '',
    businessInfo: '',
  });

  const [ocrLoading, setOcrLoading] = useState(false);
  const [, setUploadedFiles] = useState<File[]>([]);

  const { skipRequired } = useDevSkip();

  const handleOcr = async () => {
    if (!skipRequired && !plateNumber) {
      alert('차량번호를 입력해주세요');
      return;
    }

    setOcrLoading(true);
    try {
      const result = await ocrRegistration(plateNumber);
      setVehicleData({
        ...vehicleData,
        vin: result.vin,
        manufacturer: result.manufacturer,
        modelName: result.model,
        modelYear: result.year,
        mileage: result.mileage,
      });
    } catch (error) {
      console.error('OCR failed:', error);
      alert('OCR 처리에 실패했습니다');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    // TODO: 임시저장 API 호출 (status: 'draft')
    console.log('임시저장:', { vehicleData, registrationData });
    alert('임시저장되었습니다.');
    navigate('/vehicles?filter=draft');
  };

  const handleSubmit = () => {
    // TODO: 등록 제출 API 호출
    console.log('등록 제출:', { vehicleData, registrationData });
    // 차량번호를 쿼리 파라미터로 전달
    const params = new URLSearchParams();
    if (plateNumber) params.set('plateNumber', plateNumber);
    const queryString = params.toString();
    navigate(`/vehicles/new/step2${queryString ? `?${queryString}` : ''}`);
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      navigate('/vehicles');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader
        userName="홍길동"
        variant="main"
        activeNav="vehicles"
      />

      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        {/* 좌측 사이드바: 검색(상단) + ProgressSidebar(하단) — Figma 1198-5889 */}
        <aside className={`${LAYOUT_CLASSES.SIDEBAR} flex-shrink-0 bg-white border-r border-gray-200 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} flex flex-col`}>
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
            <ProgressSidebar steps={progressSteps} inline />
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className={`flex-1 ${LAYOUT_CLASSES.MAIN_PADDING}`}>
          <h1 className="text-h1 font-bold text-gray-900 mb-8">차량 원부 등록</h1>

          {/* 차량 정보 섹션 */}
          <Card className="mb-6" padding="lg">
            <h2 className="text-h3 font-bold text-gray-900 mb-6">
              차량 정보<span className="text-error ml-1">*</span>
            </h2>

            <div className="grid grid-cols-2 gap-8">
              {/* 좌측: 차량 요약 정보 */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <VehicleStatusBadge status={vehicleData.status} size="sm" />
                  <span className="text-caption text-gray-500">
                    {vehicleData.updatedAt.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    })}
                  </span>
                </div>

                <h3 className="text-h3 font-bold text-gray-900 mb-2">
                  {vehicleData.modelName}
                </h3>
                <p className="text-body text-gray-600 mb-4">
                  {plateNumber || '123가 4567'} {vehicleData.modelYear}년형 {vehicleData.mileage}만 km
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-caption text-gray-600 bg-gray-100">
                    위탁차량
                  </span>
                  <span className="px-3 py-1 rounded-full text-caption text-gray-600 bg-gray-100">
                    단순교환무사고
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-h3 font-bold text-primary mb-1">
                    {parseInt(vehicleData.price, 10).toLocaleString()}만원
                  </p>
                  <p className="text-caption text-gray-500 line-through">
                    신차 {(parseInt(vehicleData.price, 10) * 1.5).toLocaleString()}만원
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-caption text-gray-500">이전 차량</span>
                  <span className="text-caption text-gray-500 mx-2">|</span>
                  <span className="text-caption text-gray-500">다음 차량</span>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* 우측: 차량 이미지 갤러리 */}
              <div>
                <div className="relative w-full h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <img
                    src="https://via.placeholder.com/400x300?text=차량+이미지"
                    alt={vehicleData.modelName}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {['L', 'R', 'F', 'B'].map((view) => (
                      <button
                        key={view}
                        className="w-8 h-8 rounded-full bg-white bg-opacity-80 text-caption font-medium text-gray-700 hover:bg-opacity-100"
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 차량 등록원부 섹션 */}
          <Card className="mb-6" padding="lg">
            <h2 className="text-h3 font-bold text-gray-900 mb-6">
              차량 등록원부<span className="text-error ml-1">*</span>
            </h2>

            <div className="grid grid-cols-2 gap-8">
              {/* 좌측 열 */}
              <div className="space-y-6">
                <Input
                  label="사업자 등록 번호"
                  value={registrationData.businessNumber}
                  onChange={(e) =>
                    setRegistrationData({ ...registrationData, businessNumber: e.target.value })
                  }
                  placeholder="XXX-XX-XXXXX"
                  disabled
                  fullWidth
                />

                <div>
                  <label className="block text-body font-medium text-gray-700 mb-2">
                    사업자 등록증 이미지
                  </label>
                  <ImageUpload
                    onFilesSelect={(files) => {
                      if (files.length > 0) {
                        setUploadedFiles(files);
                        setRegistrationData({
                          ...registrationData,
                          businessCertificateImage: files[0],
                        });
                      }
                    }}
                    maxFiles={1}
                    accept="image/*"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button variant="secondary" size="sm">
                      파일추가
                    </Button>
                    <Button variant="secondary" size="sm">
                      항목 제거
                    </Button>
                    <Button variant="secondary" size="sm">
                      전체 항목 제거
                    </Button>
                  </div>
                </div>
              </div>

              {/* 우측 열 */}
              <div className="space-y-6">
                <Input
                  label="대표자명"
                  value={registrationData.representativeName}
                  onChange={(e) =>
                    setRegistrationData({ ...registrationData, representativeName: e.target.value })
                  }
                  placeholder="XXX-XX-XXXXX"
                  disabled
                  fullWidth
                />

                <Input
                  label="사업장 주소"
                  value={registrationData.businessAddress}
                  onChange={(e) =>
                    setRegistrationData({ ...registrationData, businessAddress: e.target.value })
                  }
                  placeholder="XXX-XX-XXXXX"
                  disabled
                  fullWidth
                />

                <Input
                  label="업태 종목"
                  value={registrationData.businessType}
                  onChange={(e) =>
                    setRegistrationData({ ...registrationData, businessType: e.target.value })
                  }
                  placeholder="XXX-XX-XXXXX"
                  disabled
                  fullWidth
                />

                <Input
                  label="사업자 정보 선택"
                  value={registrationData.businessInfo}
                  onChange={(e) =>
                    setRegistrationData({ ...registrationData, businessInfo: e.target.value })
                  }
                  placeholder="XXX-XX-XXXXX"
                  disabled
                  fullWidth
                />
              </div>
            </div>

            {/* 차량번호 + OCR (상단에 추가) */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex gap-4">
                <Input
                  label="차량번호"
                  type="text"
                  placeholder="123가 4567"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="flex-1"
                />
                <div className="flex items-end">
                  <Button onClick={handleOcr} loading={ocrLoading} className="whitespace-nowrap">
                    <ScanEye className="h-5 w-5 mr-2" />
                    OCR 실행
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* 하단 액션 바 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="text-body text-gray-600 hover:text-gray-900 transition-fast"
              >
                삭제
              </button>
              <button
                onClick={handleSaveDraft}
                className="text-body text-gray-600 hover:text-gray-900 transition-fast"
              >
                임시저장
              </button>
            </div>
            <Button onClick={handleSubmit} size="lg">
              거래하기
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};
