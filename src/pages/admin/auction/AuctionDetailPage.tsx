/**
 * 경매 거래 상세. CTA_3 경매 플로우. IA §4.11.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.11
 * @see docs/figma/FSD_SPEC_BLUEPRINT.md §2.2
 * 라우트: /vehicles/:vehicleId/auction. Figma 1418-21690.
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header';
import { ProgressSidebar, type ProgressStep } from '@/widgets/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { useVehicle } from '@/features/vehicle/register-form';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Modal } from '@/shared/ui/Modal';
import { MessageModal } from '@/shared/ui/MessageModal';
import { RefreshCw, Wallet, Archive, Trash2, Clock, Building } from 'lucide-react';

const transactionProgressSteps: ProgressStep[] = [
  { id: 'upload', label: '차량 업로드', status: 'completed' },
  { id: 'inspection', label: '검차 진행', status: 'completed' },
  { id: 'trade', label: '거래 진행중...', status: 'current' },
  { id: 'logistics', label: '탁송', status: 'upcoming' },
  { id: 'complete', label: '완료', status: 'upcoming' },
];

export const AuctionDetailPage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(vehicleId ?? undefined);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [changeNotAllowedModalOpen, setChangeNotAllowedModalOpen] = useState(false);
  const [saleMethodConfirmModalOpen, setSaleMethodConfirmModalOpen] = useState(false);

  const handleBack = () => navigate(vehicleId ? `/vehicles/${vehicleId}` : '/vehicles');
  const handleStartPrice = () => {
    const to = vehicleId ? `/vehicles/${vehicleId}/auction/start-price` : '/vehicles';
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuctionDetailPage:handleStartPrice',message:'CTA_3 경매 상세→시작가',data:{to},timestamp:Date.now(),hypothesisId:'H_CTA3_auction',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    if (vehicleId) navigate(to);
  };

  const handleDeleteConfirm = () => {
    setDeleteModalOpen(false);
    navigate(vehicleId ? `/vehicles/${vehicleId}` : '/vehicles');
  };

  const handleSaleMethodChangeConfirm = () => {
    setSaleMethodConfirmModalOpen(false);
    navigate(vehicleId ? `/vehicles/${vehicleId}` : '/vehicles');
  };

  if (!vehicleId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Button onClick={() => navigate('/vehicles')}>차량 목록</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-body text-gray-600">로딩 중...</p>
      </div>
    );
  }

  const plateNumber = vehicle?.plateNumber ?? '12바 1234';
  const modelName = vehicle?.modelName ?? 'G70 3T 스포츠 엘리트';
  const manufacturer = vehicle?.manufacturer ?? 'Hyundai';
  const modelYear = vehicle?.modelYear ?? '2018';
  const mileage = vehicle?.mileage ? `${(parseInt(vehicle.mileage, 10) / 10000).toFixed(1)}만 km` : '14.6만 km';

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader variant="main" activeNav="offers" />
      <div className={LAYOUT_CLASSES.CONTAINER}>
        <div className="flex">
          <div className={`${LAYOUT_CLASSES.SIDEBAR} flex-shrink-0 bg-white border-r border-gray-200 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT}`}>
            <div className="p-8">
              <h3 className="text-body font-bold text-gray-900 mb-6">현재 거래 진행상황</h3>
              <ProgressSidebar steps={transactionProgressSteps} inline />
            </div>
          </div>
          <main className={`flex-1 p-6 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
            <h1 className="text-h1 font-bold text-gray-900 mb-6">거래 상세 보기</h1>

            {/* 차량정보 · 전체 피드백 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <h3 className="text-h4 font-bold text-gray-900 mb-4">차량정보</h3>
                {vehicle?.thumbnailUrl && (
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img src={vehicle.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-body font-bold text-gray-900 mb-2">{plateNumber}</p>
                <p className="text-caption text-gray-500 mb-1">제조사: {manufacturer}</p>
                <p className="text-caption text-gray-500 mb-1">모델: {modelName}</p>
                <p className="text-caption text-gray-500 mb-1">연식: {modelYear}</p>
                <p className="text-caption text-gray-500 mb-1">주행거리: {mileage}</p>
                <p className="text-caption text-gray-500">연료: —</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-h4 font-bold text-gray-900 mb-4">전체 피드백</h3>
                {vehicle?.thumbnailUrl && (
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img src={vehicle.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex flex-wrap gap-4 mb-3">
                  <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-green-500" />양호 95개</span>
                  <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-orange-400" />경미 12개</span>
                  <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-red-500" />주의 3개</span>
                  <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-red-700" />불량 1개</span>
                </div>
                <Button variant="secondary" size="sm" className="mb-3">검차 상세내용 확인</Button>
                <p className="text-caption text-gray-600">
                  총 111개의 항목이 검사되었습니다. 전반적인 상태는 양호하며, 일부 부위에 경미한 스키레치가 확인되었습니다.
                </p>
              </Card>
            </div>

            {/* 거래 정보 — 경매 거래 중 (21690) */}
            <Card className="p-6 mb-6">
              <h3 className="text-h4 font-bold text-primary mb-3">경매 거래 중</h3>
              <div className="flex items-center gap-2 text-body text-gray-700 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-mono font-bold">26:13:02</span>
              </div>
              <div className="flex flex-wrap gap-6 text-body text-gray-700">
                <div>
                  <span className="text-caption text-gray-500">경매 시작가</span>
                  <p className="font-bold text-gray-900">1,000만원</p>
                </div>
                <div>
                  <span className="text-caption text-gray-500">즉시 구매가</span>
                  <p className="font-bold text-gray-900">1,500만원</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="mt-4" onClick={handleStartPrice}>
                시작가 설정
              </Button>
            </Card>

            {/* 판매 방식 4카드 (21690) */}
            <section className="mb-8">
              <h2 className="text-h3 font-bold text-gray-900 mb-4">판매 방식</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <div className="flex items-start gap-3">
                    <RefreshCw className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="text-body font-bold text-gray-900 mb-1">판매 방식 변경</h3>
                      <p className="text-caption text-gray-600 mb-3">현재 경매 판매로 거래 중입니다.</p>
                      <Button size="sm" onClick={() => setSaleMethodConfirmModalOpen(true)}>변경하기</Button>
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-start gap-3">
                    <Wallet className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="text-body font-bold text-gray-900 mb-1">판매가 수정</h3>
                      <p className="text-caption text-gray-600 mb-3">현재 즉시 판매가격은 1,300만원 입니다.</p>
                      <Button size="sm">수정하기</Button>
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-start gap-3">
                    <Archive className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="text-body font-bold text-gray-900 mb-1">보관하기</h3>
                      <p className="text-caption text-gray-600 mb-3">해당 거래를 미노출 시킵니다.</p>
                      <Button size="sm" variant="secondary">보관하기</Button>
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-start gap-3">
                    <Trash2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="text-body font-bold text-gray-900 mb-1">삭제하기</h3>
                      <p className="text-caption text-gray-600 mb-3">해당 거래를 영구적으로 삭제합니다.</p>
                      <Button size="sm" variant="secondary" onClick={() => setDeleteModalOpen(true)}>삭제하기</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* 구매 제안 */}
            <section>
              <h2 className="text-h3 font-bold text-gray-900 mb-4">구매 제안</h2>
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-body font-bold text-gray-900">Global Motors Inc.</p>
                        <p className="text-caption text-gray-500">33바 3333 · Carnival KA4</p>
                        <p className="text-h4 font-bold text-primary mt-1">2,850만원</p>
                        <p className="text-caption text-gray-500">제안일: 2025-05-20 <span className="text-orange-500">만료됨</span></p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">수락</Button>
                      <Button size="sm" variant="secondary">거절</Button>
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-body font-bold text-gray-900">Auto Export Co.</p>
                        <p className="text-caption text-gray-500">33바 3333 · Carnival KA4</p>
                        <p className="text-h4 font-bold text-primary mt-1">2,750만원</p>
                        <p className="text-caption text-gray-500">제안일: 2025-05-19 <span className="text-orange-500">만료됨</span></p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">수락</Button>
                      <Button size="sm" variant="secondary">거절</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            <div className="mt-8">
              <Button variant="secondary" size="sm" onClick={handleBack}>차량 상세</Button>
            </div>
          </main>
        </div>
      </div>

      {/* 21512: 삭제 확인 모달 */}
      <MessageModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="삭제 확인"
        message="해당 거래를 영구적으로 삭제합니다. 정말 삭제하시겠습니까?"
        cancelLabel="취소"
        confirmLabel="삭제"
        onConfirm={handleDeleteConfirm}
      />

      {/* 24856: 판매 방식 변경 불가 모달 */}
      <Modal isOpen={changeNotAllowedModalOpen} onClose={() => setChangeNotAllowedModalOpen(false)} title="판매 방식 변경 불가" size="sm">
        <p className="text-body text-gray-700 mb-6">현재 상태에서는 판매 방식을 변경할 수 없습니다. (입찰이 진행 중이거나 거래 진행 중인 경우 변경이 제한됩니다.)</p>
        <div className="flex justify-end">
          <Button onClick={() => setChangeNotAllowedModalOpen(false)}>확인</Button>
        </div>
      </Modal>

      {/* 22153: 판매 방식 변경 확인 모달 */}
      <MessageModal
        isOpen={saleMethodConfirmModalOpen}
        onClose={() => setSaleMethodConfirmModalOpen(false)}
        title="판매 방식 변경"
        message="판매 방식을 변경하시겠습니까? 변경 시 현재 경매 설정이 초기화됩니다."
        cancelLabel="취소"
        confirmLabel="확인"
        onConfirm={handleSaleMethodChangeConfirm}
      />
    </div>
  );
};
