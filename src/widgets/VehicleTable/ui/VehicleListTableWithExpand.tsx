/**
 * 차량 목록 리스트뷰 — 검차탭 InspectionListPage와 동일한 위젯 구조.
 * 그리드 헤더 + 행 카드, 클릭 시 아래 확장 영역 표시.
 * Figma 1037-5126, 1037-5391, 1037-5673 SSOT.
 */

import type React from 'react';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Car, Gauge, DollarSign } from 'lucide-react';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { VehicleStatusBadge } from '@/entities/vehicle/ui/VehicleStatusBadge';
import { Button } from '@/shared/ui/Button';
import type { Vehicle } from '@/entities/vehicle/model/types';

/** 컬럼 정의 인터페이스 — columnDefs prop으로 주입 가능 */
export interface ColumnDef<T> {
  key: string;
  label: string;
  width?: string;
  render?: (item: T, context?: { statusLabelOverride?: (item: T) => string }) => React.ReactNode;
}

export interface VehicleListTableWithExpandProps {
  vehicles: Vehicle[];
  onView?: (vehicle: Vehicle) => void;
  statusLabelOverride?: (vehicle: Vehicle) => string;
  columnDefs?: ColumnDef<Vehicle>[];
}

/** 기본 차량 컬럼 정의 (POC: 기존 동작과 동일) */
export const DEFAULT_VEHICLE_COLUMN_DEFS: ColumnDef<Vehicle>[] = [
  {
    key: 'status',
    label: '상태',
    width: '1fr',
    render: (v, ctx) => <VehicleStatusBadge status={v.status} size="sm" label={ctx?.statusLabelOverride?.(v)} />,
  },
  {
    key: 'plateModel',
    label: '차량번호 · 모델',
    width: '2fr',
    render: (v) => (
      <div>
        <p className="text-body font-medium text-gray-900">
          {v.plateNumber} · {v.modelName}
        </p>
        <p className="text-caption text-gray-500">{v.manufacturer}</p>
      </div>
    ),
  },
  {
    key: 'modelYear',
    label: '연식',
    width: '1fr',
    render: (v) => <span className="text-body text-gray-700">{v.modelYear}년형</span>,
  },
  {
    key: 'mileage',
    label: '주행거리',
    width: '1fr',
    render: (v) => (
      <span className="text-caption text-gray-600">
        {v.mileage ? `${(parseInt(v.mileage, 10) / 10000).toFixed(1)}만 km` : '-'}
      </span>
    ),
  },
  {
    key: 'price',
    label: '가격',
    width: '1.5fr',
    render: (v) => (
      <span className="text-body text-gray-700">
        {v.price ? `${parseInt(v.price, 10).toLocaleString()}만원` : '-'}
      </span>
    ),
  },
];

/** 차량 목록 리스트뷰 — 검차 리스트와 동일 구조, 클릭 시 아래 확장 */
export const VehicleListTableWithExpand = ({
  vehicles,
  onView,
  statusLabelOverride,
  columnDefs,
}: VehicleListTableWithExpandProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const useColumnDefs = columnDefs && columnDefs.length > 0;
  const cols = useColumnDefs ? columnDefs : DEFAULT_VEHICLE_COLUMN_DEFS;
  const gridCols = useColumnDefs
    ? `grid-cols-[28px_${cols.map((c) => c.width ?? '1fr').join('_')}_auto]`
    : 'grid-cols-[28px_1fr_2fr_1fr_1fr_1.5fr_auto]';

  return (
    <>
      {/* 테이블 헤더 — 검차 Figma 1193:8810과 동일 구조 */}
      <div
        className={`sticky top-0 z-10 grid ${gridCols} gap-4 px-6 h-11 items-center bg-white rounded-[15px] text-caption font-semibold text-gray-900 shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] ${LAYOUT_CLASSES.MAIN_GNB} mb-2`}
        data-node-id="1193:8810"
      >
        <input type="checkbox" className="rounded border-gray-300" aria-label="전체 선택" />
        {cols.map((c) => (
          <span key={c.key}>{c.label}</span>
        ))}
        <span className="w-8" aria-hidden />
      </div>
      <div className={`w-full ${LAYOUT_CLASSES.MAIN_GNB} flex flex-col`} data-node-id="1037:5126">
        <div className="flex flex-col gap-y-2 w-full max-w-[974px]">
          {vehicles.map((vehicle) => {
            const isExpanded = expandedIds.has(vehicle.id);
            return (
              <div
                key={vehicle.id}
                className={`w-full ${LAYOUT_CLASSES.GNB_LIST_ROW_CARD} overflow-hidden`}
                data-node-id="1037:5391"
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onClick={() => toggleExpand(vehicle.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleExpand(vehicle.id);
                    }
                  }}
                  className={`grid ${gridCols} gap-4 px-6 min-h-[56px] py-3 items-center hover:bg-gray-50/80 cursor-pointer transition-fast`}
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${vehicle.plateNumber} 선택`}
                  />
                  {cols.map((c) => (
                    <div key={c.key}>
                      {c.render
                        ? c.render(vehicle, { statusLabelOverride })
                        : null}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(vehicle.id);
                    }}
                    className="p-2 text-gray-500 hover:text-gray-900"
                    aria-label={isExpanded ? '접기' : '펼치기'}
                  >
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>

                {/* 확장 영역: Figma 1037-5673 — 차량 상세·상세보기 */}
                {isExpanded && (
                  <div className="px-6 pb-4 pt-2 bg-[#eef5fe]/30 border-t border-gray-100">
                    <p className="text-caption font-semibold mb-2 text-gray-900">
                      {statusLabelOverride?.(vehicle) ?? vehicle.modelName}
                    </p>
                    <div className="flex flex-col gap-1 text-body text-gray-700">
                      <p className="flex items-center gap-2 text-caption">
                        <Car className="h-4 w-4 text-gray-500" />
                        차량번호 : {vehicle.plateNumber} · {vehicle.modelName}
                      </p>
                      <p className="flex items-center gap-2 text-caption">
                        <Gauge className="h-4 w-4 text-gray-500" />
                        주행거리 : {vehicle.mileage ? `${(parseInt(vehicle.mileage, 10) / 10000).toFixed(1)}만 km` : '-'}
                      </p>
                      <p className="flex items-center gap-2 text-caption">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        가격 : {vehicle.price ? `${parseInt(vehicle.price, 10).toLocaleString()}만원` : '-'}
                      </p>
                    </div>
                    {onView && (
                      <Button
                        size="sm"
                        className="mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(vehicle);
                        }}
                      >
                        상세보기
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
