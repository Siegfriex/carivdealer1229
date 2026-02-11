/**
 * VehicleInfoPanel — 320×420 차량정보 패널 (공통)
 * impl_plans 794-4200 §5, 1123-13580, 1302-27096 레이아웃 스펙 준수.
 * @see docs/figmaMCP/impl_plans/794-4200_794-4371_구현계획.md
 */

const ROW_ITEMS = [
  { label: '제조사', key: 'manufacturer' as const },
  { label: '모델', key: 'modelName' as const },
  { label: '연식', key: 'modelYear' as const },
  { label: '주행거리', key: 'mileage' as const },
  { label: '연료', key: 'fuel' as const },
] as const;

/** 노드 ID 매핑 (prefix별) */
const NODE_IDS = {
  '794': {
    panel: '794:4201',
    label: '794:4204',
    plate: '794:4203',
    rows: ['794:4205', '794:4213', '794:4209', '794:4217', '794:4221'] as const,
  },
  '1123': {
    panel: '1123:13581',
    badge: '1123:13582',
    label: '1123:13584',
    plate: '1123:13583',
    rows: ['1123:13585', '1123:13593', '1123:13589', '1123:13597', '1123:13601'] as const,
  },
  '1425': {
    panel: '1425:10414',
    label: '1425:10417',
    plate: '1425:10416',
    rows: ['1425:10418', '1425:10426', '1425:10422', '1425:10430', '1425:10434'] as const,
  },
  '1302': {
    panel: '1302:27096',
    badge: '1302:27097',
    label: '1302:27099',
    plate: '1302:27098',
    rows: ['1302:27100', '1302:27108', '1302:27104', '1302:27112', '1302:27116'] as const,
  },
} as const;

export type VehicleInfoPanelNodeIdPrefix = keyof typeof NODE_IDS;

export interface VehicleInfoPanelProps {
  /** 차량 데이터 (null이면 기본값 표시) */
  vehicle?: {
    plateNumber?: string;
    manufacturer?: string;
    modelName?: string;
    modelYear?: string;
    mileage?: string;
    fuelType?: string;
  } | null;
  /** data-node-id prefix (794: GeneralSalePrice, 1123: AuctionStartPrice, 1302: TradeDetail) */
  nodeIdPrefix: VehicleInfoPanelNodeIdPrefix;
  /** 1123 전용: 차량정보 배지 표시 */
  showBadge?: boolean;
  className?: string;
}

function getRowValue(
  key: (typeof ROW_ITEMS)[number]['key'],
  vehicle: VehicleInfoPanelProps['vehicle']
): string {
  if (!vehicle) {
    return key === 'manufacturer'
      ? 'Hyundai'
      : key === 'modelName'
        ? 'G70 3T 스포츠 엘리트'
        : key === 'modelYear'
          ? '2018'
          : key === 'mileage'
            ? '14.6만 km'
            : '-';
  }
  if (key === 'mileage' && vehicle.mileage) {
    return `${(parseInt(vehicle.mileage, 10) / 10000).toFixed(1)}만 km`;
  }
  if (key === 'fuel') {
    return vehicle.fuelType ?? '-';
  }
  return (
    (key === 'manufacturer'
      ? vehicle.manufacturer
      : key === 'modelName'
        ? vehicle.modelName
        : key === 'modelYear'
          ? vehicle.modelYear
          : '') ?? '-'
  );
}

export function VehicleInfoPanel({
  vehicle,
  nodeIdPrefix,
  showBadge = nodeIdPrefix === '1123' || nodeIdPrefix === '1302',
  className = '',
}: VehicleInfoPanelProps) {
  const ids = NODE_IDS[nodeIdPrefix];
  const plateNumber = vehicle?.plateNumber ?? '12바 1234';

  return (
    <div
      className={`bg-white rounded-card shadow-figma-card w-[320px] h-[420px] overflow-hidden flex flex-col p-6 box-border shrink-0 ${className}`}
      data-node-id={ids.panel}
    >
      {showBadge && 'badge' in ids && (
        <div
          className="bg-[var(--color-primary-light)] h-[27px] w-[67px] rounded-[5px] shrink-0 mb-1"
          data-node-id={(ids as { badge?: string }).badge}
          aria-hidden
        />
      )}
      <p
        className="text-[15px] text-black/50 tracking-[0.15px] font-extrabold mb-1"
        data-node-id={ids.label}
      >
        차량정보
      </p>
      <p
        className="text-[28px] leading-[44px] font-extrabold text-primary mb-6"
        data-node-id={ids.plate}
      >
        {plateNumber}
      </p>
      <div className="flex flex-col flex-1 min-h-0">
        {ROW_ITEMS.map(({ label, key }, idx) => (
          <div
            key={label}
            className={`h-[51px] flex items-center justify-between border-b border-gray-200 shrink-0 last:border-b-0`}
            data-node-id={ids.rows[idx]}
          >
            <span className="text-[16px] font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>
              {label}
            </span>
            <span className="text-[16px] text-black/80">{getRowValue(key, vehicle)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const LAYOUT_CLASSES = {
  DETAIL_PANEL_ROW: 'h-[51px] flex items-center justify-between border-b border-gray-200 shrink-0',
} as const;
