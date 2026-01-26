/**
 * VehicleRegisterStep1Page Component
 * 차량 등록 Step 1 - 차량번호 및 OCR
 * 
 * 디자인: design/design_vehicle_input/vehicle_input_1/매물 등록 관리_차량 등록1.svg
 */

import { useState } from 'react';
import { Header } from '@/widgets/Header/ui/Header';
import { StepProgress, type Step } from '@/shared/ui/StepProgress';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { ocrRegistration } from '@/features/vehicle/register-form/api/vehicleApi';
import { ScanEye } from 'lucide-react';

const steps: Step[] = [
  { id: 'step1', label: '차량 정보 입력', status: 'current' },
  { id: 'step2', label: '상세 정보 입력', status: 'upcoming' },
  { id: 'step3', label: '검차 신청', status: 'upcoming' },
];

export const VehicleRegisterStep1Page = () => {
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleData, setVehicleData] = useState({
    vin: '',
    manufacturer: '',
    modelName: '',
    modelYear: '',
    mileage: '',
  });
  const [ocrLoading, setOcrLoading] = useState(false);

  const handleOcr = async () => {
    if (!plateNumber) {
      alert('차량번호를 입력해주세요');
      return;
    }

    setOcrLoading(true);
    try {
      const result = await ocrRegistration(plateNumber);
      setVehicleData({
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <StepProgress steps={steps} className="mb-12" />

        <div className="max-w-3xl mx-auto">
          <h1 className="text-h1 font-bold text-gray-900 mb-2">차량 정보를 입력해주세요</h1>
          <p className="text-body text-gray-600 mb-8">
            OCR 기능으로 등록원부에서 정보를 자동으로 가져올 수 있습니다
          </p>

          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            {/* 차량번호 + OCR */}
            <div className="flex gap-4">
              <Input
                label="차량번호"
                type="text"
                placeholder="33바 3333"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                className="flex-1"
                required
              />
              <div className="flex items-end">
                <Button onClick={handleOcr} loading={ocrLoading} className="whitespace-nowrap">
                  <ScanEye className="h-5 w-5 mr-2" />
                  OCR 실행
                </Button>
              </div>
            </div>

            {/* OCR 결과 */}
            <div className="grid grid-cols-2 gap-6">
              <Input label="VIN" value={vehicleData.vin} readOnly fullWidth />
              <Input label="제조사" value={vehicleData.manufacturer} readOnly fullWidth />
              <Input label="모델명" value={vehicleData.modelName} readOnly fullWidth />
              <Input label="연식" value={vehicleData.modelYear} readOnly fullWidth />
              <Input label="주행거리" value={vehicleData.mileage} readOnly fullWidth />
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-between pt-6">
              <Button variant="secondary" onClick={() => window.history.back()}>
                취소
              </Button>
              <Button disabled={!vehicleData.vin}>다음 단계</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
