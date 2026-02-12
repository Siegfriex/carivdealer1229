/**
 * TradeDetailPage (Figma 794-4708/1123-14112 거래상세 변형, 794-4542/1123-13946 펼쳐지는 뷰, 1302-27289 검차 상세 모달, 1302-27093 판매방식 변경·판매가 수정)
 * 거래 상세 보기. 컨테이너 클릭 시 아래로 펼침; 검차 상세내역 버튼 → 모달.
 * 라우트: /vehicles/:id/trade
 * @see docs/figmaMCP/impl_plans/794-4708_794-4542_1123-14112_1123-13946_1302-27093_1302-27289_구현계획.md
 * @remarks 매물등록 CTA_3 거래 단계에서 목록 돌아가기는 GNB 탁송 탭(/logistics/schedule)으로 이동. (docs/figmaMCP/impl_plans/CTA_4_탁송_플로우_요약.md)
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header';
import { ProgressSidebar, type ProgressStep } from '@/widgets/ProgressSidebar';
import { TradeDetailCard } from '@/widgets/TradeDetailCard';
import { SaleMethodCards } from '@/widgets/SaleMethodCards';
import { InspectionDetailModal } from '@/widgets/InspectionDetailModal';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { useVehicle } from '@/features/vehicle/register-form';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { MessageModal } from '@/shared/ui/MessageModal';
import { Modal } from '@/shared/ui/Modal';
import { Building } from 'lucide-react';

const transactionProgressSteps: ProgressStep[] = [
  { id: 'upload', label: '차량 업로드', status: 'completed' },
  { id: 'inspection', label: '검차 진행', status: 'completed' },
  { id: 'trade', label: '거래 진행중...', status: 'current' },
  { id: 'logistics', label: '탁송', status: 'upcoming' },
  { id: 'complete', label: '완료', status: 'upcoming' },
];

export const TradeDetailPage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(vehicleId ?? undefined);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [changeNotAllowedModalOpen, setChangeNotAllowedModalOpen] = useState(false);
  const [saleMethodConfirmModalOpen, setSaleMethodConfirmModalOpen] = useState(false);
  /** 794-4708 / 1123-14112: 컨테이너 클릭 시 아래 펼침 (794-4542 / 1123-13946) */
  const [detailExpanded, setDetailExpanded] = useState(false);
  /** 1302-27289: 검차 상세내역 모달 */
  const [inspectionDetailModalOpen, setInspectionDetailModalOpen] = useState(false);

  const handleBack = () => navigate(vehicleId ? `/vehicles/${vehicleId}` : '/vehicles');

  const handleDeleteConfirm = () => {
    setDeleteModalOpen(false);
    navigate(vehicleId ? `/vehicles/${vehicleId}` : '/vehicles');
  };

  const handleSaleMethodChangeConfirm = () => {
    setSaleMethodConfirmModalOpen(false);
    navigate(vehicleId ? `/vehicles/${vehicleId}/sale/analyzing?type=auction` : '/vehicles');
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

            <SaleMethodCards
              currentSaleType="일반 판매"
              currentPrice={vehicle?.price ? `${parseInt(vehicle.price, 10).toLocaleString()}만원` : '1,300만원'}
              onSaleMethodChange={() => setSaleMethodConfirmModalOpen(true)}
              onPriceEdit={() => vehicleId && navigate(`/vehicles/${vehicleId}/sale/price`)}
              onArchive={() => {}}
              onDelete={() => setDeleteModalOpen(true)}
            />

            {/* 구매 제안 (24679) */}
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

      {/* 22153: 판매 방식 변경 확인 모달 — 일반→경매로 변경 시 sale/analyzing?type=auction */}
      <MessageModal
        isOpen={saleMethodConfirmModalOpen}
        onClose={() => setSaleMethodConfirmModalOpen(false)}
        title="판매 방식 변경"
        message="판매 방식을 경매로 변경하시겠습니까? 변경 시 현재 일반 판매 설정이 초기화됩니다."
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
