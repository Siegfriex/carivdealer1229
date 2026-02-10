/**
 * TradeDetailPage (Figma 794-4708/1123-14112 거래상세 변형, 794-4542/1123-13946 펼쳐지는 뷰, 1302-27289 검차 상세 모달, 1302-27093 판매방식 변경·판매가 수정)
 * 거래 상세 보기. 컨테이너 클릭 시 아래로 펼침; 검차 상세내역 버튼 → 모달.
 * 라우트: /vehicles/:id/trade
 * @remarks 매물등록 CTA_3 거래 단계에서 목록 돌아가기는 GNB 탁송 탭(/logistics/schedule)으로 이동. (docs/figmaMCP/impl_plans/CTA_4_탁송_플로우_요약.md)
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { ProgressSidebar, type ProgressStep } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { useVehicle } from '@/features/vehicle/register-form/model/useVehicle';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Modal } from '@/shared/ui/Modal';
import { MessageModal } from '@/shared/ui/MessageModal';
import { RefreshCw, Wallet, Archive, Trash2, Building, ChevronDown, ChevronUp } from 'lucide-react';

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

            {/* 794-4708 / 1123-14112: 거래상세 변형 — 컨테이너 클릭 시 아래 펼침 (794-4542 / 1123-13946) */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setDetailExpanded((e) => !e)}
                className="w-full text-left rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                data-node-id="794:4708"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {/* 1302-27093: 좌측 패널 320×420, 행 51px, rounded-[30px] shadow (1302:27096) */}
                  <div className="bg-white rounded-card shadow-figma-card w-full max-w-[320px] min-h-[420px] overflow-hidden flex flex-col p-6 box-border shrink-0" data-node-id="1302:27096">
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
                  </div>
                  <div className="min-h-[420px] flex flex-col">
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
                    {/* 1302-27093: 검차 상세내용 확인 — bg #eef5fe, rounded-[10px], text #2048e5 16px */}
                    <button
                      type="button"
                      className="mb-3 inline-flex items-center justify-center rounded-[10px] bg-[#eef5fe] px-4 py-2 text-base font-medium text-[#2048e5] hover:bg-[#e0ecfc] focus:outline-none focus:ring-2 focus:ring-[#2048e5] focus:ring-offset-2"
                      onClick={(ev) => { ev.stopPropagation(); setInspectionDetailModalOpen(true); }}
                    >
                      검차 상세내용 확인
                    </button>
                    <p className="text-caption text-gray-600">
                      총 111개의 항목이 검사되었습니다. 전반적인 상태는 양호하며, 일부 부위에 경미한 스키레치가 확인되었습니다.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center py-2 border-t border-gray-100">
                  {detailExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </div>
              </button>
              {/* 794-4542 / 1123-13946: 펼쳐지는 뷰 — 차량정보·전체 피드백 요약 톤 */}
              {detailExpanded && (
                <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm" data-node-id="794:4542">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 shadow-sm">
                      <h3 className="text-h4 font-bold text-gray-900 mb-4">차량정보 요약</h3>
                      <dl className="space-y-2 text-body">
                        <div className="flex justify-between"><dt className="text-gray-500">번호판</dt><dd className="font-medium text-gray-900">{plateNumber}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">제조사</dt><dd className="font-medium text-gray-900">{manufacturer}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">모델</dt><dd className="font-medium text-gray-900">{modelName}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">연식</dt><dd className="font-medium text-gray-900">{modelYear}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">주행거리</dt><dd className="font-medium text-gray-900">{mileage}</dd></div>
                      </dl>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 shadow-sm">
                      <h3 className="text-h4 font-bold text-gray-900 mb-4">전체 피드백 요약</h3>
                      <div className="flex flex-wrap gap-3 mb-3">
                        <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-green-500" />양호 95개</span>
                        <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-orange-400" />경미 12개</span>
                        <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-red-500" />주의 3개</span>
                        <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-red-700" />불량 1개</span>
                      </div>
                      <p className="text-caption text-gray-600">총 111개의 항목이 검사되었습니다. 전반적인 상태는 양호하며, 일부 부위에 경미한 스키레치가 확인되었습니다.</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <h3 className="text-h4 font-bold text-gray-900 mb-3">거래 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-caption text-gray-600">
                      <div><span className="font-medium text-gray-700">거래 유형</span> 일반 판매</div>
                      <div><span className="font-medium text-gray-700">등록일</span> 2025-02-10</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 1302-27093: 판매방식 변경 및 판매가 수정 컨테이너 (일반/경매 공통) */}

            {/* 판매 방식 4카드 (24679 일반 판매) */}
            <section className="mb-8">
              <h2 className="text-h3 font-bold text-gray-900 mb-4">판매 방식</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <div className="flex items-start gap-3">
                    <RefreshCw className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="text-body font-bold text-gray-900 mb-1">판매 방식 변경</h3>
                      <p className="text-caption text-gray-600 mb-3">현재 일반 판매로 거래 중입니다.</p>
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
        message="판매 방식을 변경하시겠습니까? 변경 시 현재 판매 설정이 초기화됩니다."
        cancelLabel="취소"
        confirmLabel="확인"
        onConfirm={handleSaleMethodChangeConfirm}
      />

      {/* 1302-27289: 검차 상세내역 모달 — 제목 26px, 섹션 24px, 행 h-14 border-b #e6e6e6, 라벨 16px, 개수 12px #707070 */}
      <Modal
        isOpen={inspectionDetailModalOpen}
        onClose={() => setInspectionDetailModalOpen(false)}
        title="세부 검차내역"
        size="lg"
        titleClassName="text-[26px] font-extrabold leading-[44px] text-black"
      >
        <div className="space-y-6" data-node-id="1302:27289">
          <section>
            <h4 className="text-[24px] font-semibold leading-[26px] text-black mb-3">사진항목</h4>
            <ul className="rounded-lg overflow-hidden border border-[#e6e6e6]">
              {[
                { label: '차량 외관', count: '9' },
                { label: '차량 내부', count: '14' },
                { label: '타이어', count: '4' },
                { label: '유리', count: '2' },
                { label: '사이드미러', count: '2' },
                { label: '트렁크', count: '2' },
                { label: '범퍼', count: '2' },
                { label: '보닛', count: '1' },
                { label: '성능기록부', count: '1' },
                { label: '외부 손상', count: 'x' },
              ].map((item) => (
                <li
                  key={item.label}
                  className="h-14 px-4 flex justify-between items-center border-b border-[#e6e6e6] last:border-b-0 bg-white"
                >
                  <span className="text-base font-semibold text-black">{item.label}</span>
                  <span className="text-xs text-[#707070]">{item.count}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h4 className="text-[24px] font-semibold leading-[26px] text-black mb-3">영상항목</h4>
            <ul className="rounded-lg overflow-hidden border border-[#e6e6e6]">
              {[
                { label: '보닛', count: '10초 / 1' },
                { label: '성능기록부', count: '10초 / 1' },
                { label: '외부 손상', count: '10초 / 1' },
              ].map((item) => (
                <li
                  key={`video-${item.label}`}
                  className="h-14 px-4 flex justify-between items-center border-b border-[#e6e6e6] last:border-b-0 bg-white"
                >
                  <span className="text-base font-semibold text-black">{item.label}</span>
                  <span className="text-xs text-[#707070]">{item.count}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={() => setInspectionDetailModalOpen(false)}>닫기</Button>
        </div>
      </Modal>
    </div>
  );
};
