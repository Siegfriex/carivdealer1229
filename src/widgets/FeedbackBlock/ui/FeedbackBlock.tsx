/**
 * FeedbackBlock — 전체 피드백 (양호/경미/주의/불량) + 검차 상세 버튼
 * impl_plans 794-4225, 1123-13605 등.
 * @see docs/figmaMCP/impl_plans/794-4200_794-4371_구현계획.md
 */

const NODE_IDS = {
  '794': {
    block: '794:4225',
    label: '794:4226',
    labelText: '794:4227',
    good: '794:4229',
    goodDot: '794:4230',
    goodLabel: '794:4232',
    goodCount: '794:4233',
    caution: '794:4234',
    cautionDot: '794:4235',
    cautionLabel: '794:4237',
    cautionCount: '794:4238',
    bad: '794:4239',
    badDot: '794:4240',
    badLabel: '794:4242',
    badCount: '794:4243',
    minor: '794:4244',
    minorDot: '794:4245',
    minorLabel: '794:4247',
    minorCount: '794:4248',
    button: '794:4250',
    buttonText: '794:4251',
    summary: '794:4252',
  },
  '1123': {
    block: '1123:13605',
    label: '1123:13606',
    labelText: '1123:13607',
    good: '1123:13609',
    goodDot: '1123:13610',
    goodLabel: '1123:13612',
    goodCount: '1123:13613',
    caution: '1123:13614',
    cautionDot: '1123:13615',
    cautionLabel: '1123:13617',
    cautionCount: '1123:13618',
    bad: '1123:13619',
    badDot: '1123:13620',
    badLabel: '1123:13622',
    badCount: '1123:13623',
    minor: '1123:13624',
    minorDot: '1123:13625',
    minorLabel: '1123:13627',
    minorCount: '1123:13628',
    button: '1123:13630',
    buttonText: '1123:13631',
    summary: '1123:13632',
  },
  '1425': {
    block: '1425:10385',
    label: '1425:10386',
    labelText: '1425:10387',
    good: '1425:10389',
    goodDot: '1425:10390',
    goodLabel: '1425:10392',
    goodCount: '1425:10393',
    caution: '1425:10394',
    cautionDot: '1425:10395',
    cautionLabel: '1425:10397',
    cautionCount: '1425:10398',
    bad: '1425:10399',
    badDot: '1425:10400',
    badLabel: '1425:10402',
    badCount: '1425:10403',
    minor: '1425:10404',
    minorDot: '1425:10405',
    minorLabel: '1425:10407',
    minorCount: '1425:10408',
    button: '1425:10410',
    buttonText: '1425:10411',
    summary: '1425:10412',
  },
  '1302': {
    block: '1302:27120',
    label: '1302:27121',
    labelText: '1302:27122',
    good: '1302:27124',
    goodDot: '1302:27125',
    goodLabel: '1302:27127',
    goodCount: '1302:27128',
    caution: '1302:27129',
    cautionDot: '1302:27130',
    cautionLabel: '1302:27132',
    cautionCount: '1302:27133',
    bad: '1302:27134',
    badDot: '1302:27135',
    badLabel: '1302:27137',
    badCount: '1302:27138',
    minor: '1302:27139',
    minorDot: '1302:27140',
    minorLabel: '1302:27142',
    minorCount: '1302:27143',
    button: '1302:27145',
    buttonText: '1302:27146',
    summary: '1302:27147',
  },
} as const;

export type FeedbackBlockNodeIdPrefix = keyof typeof NODE_IDS;

export interface FeedbackCounts {
  good: number;
  minor: number;
  caution: number;
  bad: number;
}

export interface FeedbackBlockProps {
  /** data-node-id prefix (794 | 1123) */
  nodeIdPrefix: FeedbackBlockNodeIdPrefix;
  /** 양호/경미/주의/불량 개수 */
  counts?: FeedbackCounts;
  /** 총 항목 수 + 본문 (예: total "총 111개", body "의 항목이 검사되었습니다.", paragraph2 "전반적인 상태는 양호하며...") */
  summaryText?: { total: string; body: string; paragraph2?: string };
  /** 검차 상세내용 확인 클릭 핸들러 */
  onInspectionDetail?: () => void;
  className?: string;
}

const DEFAULT_COUNTS: FeedbackCounts = {
  good: 95,
  minor: 12,
  caution: 3,
  bad: 1,
};

const DEFAULT_SUMMARY = {
  total: '총 111개',
  body: '의 항목이 검사되었습니다.',
  paragraph2: '전반적인 상태는 양호하며, 일부 부위에 경미한 스키레치가 확인되었습니다.',
};

export function FeedbackBlock({
  nodeIdPrefix,
  counts = DEFAULT_COUNTS,
  summaryText,
  onInspectionDetail,
  className = '',
}: FeedbackBlockProps) {
  const ids = NODE_IDS[nodeIdPrefix];
  const summary = summaryText ?? DEFAULT_SUMMARY;
  const totalStr = summary.total;
  const bodyStr = summary.body;
  const p2 = summary.paragraph2 ?? DEFAULT_SUMMARY.paragraph2;

  return (
    <div
      className={`bg-white rounded-[30px] shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] w-full max-w-[628px] min-h-[420px] p-6 box-border flex flex-col ${className}`}
      data-node-id={ids.block}
    >
      <div
        className="flex items-center justify-center self-start border border-black/20 rounded-[5px] px-2 py-1.5 h-[27px]"
        data-node-id={ids.label}
      >
        <p className="text-[15px] font-extrabold text-black/50 tracking-[0.15px]" data-node-id={ids.labelText}>
          전체 피드백
        </p>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
        <div className="flex items-center gap-2" data-node-id={ids.good}>
          <span className="w-2 h-2 rounded-full bg-[#4ade80]" data-node-id={ids.goodDot} />
          <div className="flex items-center gap-1.5 text-[16px]">
            <span className="font-medium text-black/40" data-node-id={ids.goodLabel}>양호</span>
            <span className="text-black/80" data-node-id={ids.goodCount}>{counts.good}개</span>
          </div>
        </div>
        <div className="flex items-center gap-2" data-node-id={ids.minor}>
          <span className="w-2 h-2 rounded-full bg-[#facc15]" data-node-id={ids.minorDot} />
          <div className="flex items-center gap-1.5 text-[16px]">
            <span className="font-medium text-black/40" data-node-id={ids.minorLabel}>경미</span>
            <span className="text-black/80" data-node-id={ids.minorCount}>{counts.minor}개</span>
          </div>
        </div>
        <div className="flex items-center gap-2" data-node-id={ids.caution}>
          <span className="w-2 h-2 rounded-full bg-[#fb923c]" data-node-id={ids.cautionDot} />
          <div className="flex items-center gap-1.5 text-[16px]">
            <span className="font-medium text-black/40" data-node-id={ids.cautionLabel}>주의</span>
            <span className="text-black/80" data-node-id={ids.cautionCount}>{counts.caution}개</span>
          </div>
        </div>
        <div className="flex items-center gap-2" data-node-id={ids.bad}>
          <span className="w-2 h-2 rounded-full bg-[#f87171]" data-node-id={ids.badDot} />
          <div className="flex items-center gap-1.5 text-[16px]">
            <span className="font-medium text-black/40" data-node-id={ids.badLabel}>불량</span>
            <span className="text-black/80" data-node-id={ids.badCount}>{counts.bad}개</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="self-start mt-4 bg-[var(--color-primary-light)] text-[var(--color-primary)] text-[16px] font-semibold rounded-[10px] px-6 py-3 hover:opacity-90"
        data-node-id={ids.button}
        onClick={(e) => { e.stopPropagation(); onInspectionDetail?.(); }}
      >
        <span data-node-id={ids.buttonText}>검차 상세내용 확인</span>
      </button>
      <div className="mt-6 pt-4 border-t border-gray-200" data-node-id={ids.summary}>
        <p className="text-[18px] text-black leading-[26px]">
          <span className="font-semibold">{totalStr}</span>
          <span>{bodyStr}</span>
        </p>
        <p className="text-[18px] text-black leading-[26px] mt-1">{p2}</p>
      </div>
    </div>
  );
}
