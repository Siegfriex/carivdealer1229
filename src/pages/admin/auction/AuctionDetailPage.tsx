/**
 * 경매 거래 상세. CTA_3 경매 플로우. IA §4.11.
 * TradeDetailPage와 동일 레이아웃(GNB_SIDEBAR, MAIN_GNB_STEP). SaleMethodCards currentSaleType="경매".
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.11
 * 라우트: /vehicles/:vehicleId/auction. Figma 1418-21690.
 * 진입: VehicleDetailPage 경매선택, TradeListPage 경매거래 필터→행클릭, AuctionCompletePage 경매상세, AuctionStartPricePage 이전
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header';
import { ProgressSidebar, type ProgressStep } from '@/widgets/ProgressSidebar';
import { TradeDetailCard } from '@/widgets/TradeDetailCard';
import { SaleMethodCards } from '@/widgets/SaleMethodCards';
import { InspectionDetailModal } from '@/widgets/InspectionDetailModal';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { useVehicle } from '@/features/vehicle/register-form';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Modal } from '@/shared/ui/Modal';
import { MessageModal } from '@/shared/ui/MessageModal';
import { Clock, Building } from 'lucide-react';

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
  const [detailExpanded, setDetailExpanded] = useState(false);
  const [inspectionDetailModalOpen, setInspectionDetailModalOpen] = useState(false);

  const handleBack = () => navigate(vehicleId ? `/vehicles/${vehicleId}` : '/vehicles');
  const handleStartPrice = () => {
    const to = vehicleId ? `/vehicles/${vehicleId}/auction/start-price` : '/vehicles';
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuctionDetailPage:handleStartPrice',message:'CTA_3 경매 상세→시작가',data:{to},timestamp:Date.now(),hypothesisId:'H_CTA3_auction',runId:'register-flow-check'})}).catch(()=>{});
    if (vehicleId) navigate(to);
  };

  const handleDeleteConfirm = () => {
    setDeleteModalOpen(false);
    navigate(vehicleId ? `/vehicles/${vehicleId}` : '/vehicles');
  };

  const handleSaleMethodChangeConfirm = () => {
    setSaleMethodConfirmModalOpen(false);
    navigate(vehicleId ? `/vehicles/${vehicleId}/sale/analyzing` : '/vehicles');
  };

  const handlePriceEdit = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}/auction/start-price`);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader variant="main" activeNav="offers" />
      <div className={`flex min-w-0 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} ${LAYOUT_CLASSES.CONTAINER}`}>
        <aside className={`${LAYOUT_CLASSES.GNB_SIDEBAR} flex-shrink-0 bg-white border-r border-gray-200 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT}`}>
          <div className="p-4">
            <h3 className="text-body font-bold text-gray-900 mb-6">현재 거래 진행상황</h3>
            <ProgressSidebar steps={transactionProgressSteps} inline widthClass="w-full" />
          </div>
        </aside>
        <main className={`flex-1 min-w-0 overflow-x-auto p-6 ${LAYOUT_CLASSES.MAIN_GNB_STEP}`}>
          <h1 className="text-h1 font-bold text-gray-900 mb-6">거래 상세 보기</h1>

          <TradeDetailCard
            vehicle={vehicle}
            expanded={detailExpanded}
            onExpand={() => setDetailExpanded((e) => !e)}
            onInspectionDetail={() => setInspectionDetailModalOpen(true)}
          />

          {/* 경매 거래 중 — 시작가/즉시구매가/기간 (21690) */}
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

          <SaleMethodCards
            currentSaleType="경매"
            currentPrice="1,500만원"
            onSaleMethodChange={() => setSaleMethodConfirmModalOpen(true)}
            onPriceEdit={handlePriceEdit}
            onArchive={() => {}}
            onDelete={() => setDeleteModalOpen(true)}
          />

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

          <div className="mt-8 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={handleBack}>차량 상세</Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/logistics/schedule')}>탁송 목록으로</Button>
          </div>
        </main>
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

      {/* 22153: 판매 방식 변경 확인 모달 — 경매→일반으로 변경 시 sale/analyzing */}
      <MessageModal
        isOpen={saleMethodConfirmModalOpen}
        onClose={() => setSaleMethodConfirmModalOpen(false)}
        title="판매 방식 변경"
        message="판매 방식을 일반 판매로 변경하시겠습니까? 변경 시 현재 경매 설정이 초기화됩니다."
        cancelLabel="취소"
        confirmLabel="확인"
        onConfirm={handleSaleMethodChangeConfirm}
      />

      <InspectionDetailModal
        isOpen={inspectionDetailModalOpen}
        onClose={() => setInspectionDetailModalOpen(false)}
      />
    </div>
  );
};
