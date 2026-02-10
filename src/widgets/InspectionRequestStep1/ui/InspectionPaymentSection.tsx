/**
 * 검차비 결제 섹션 (Figma 1193:6764)
 * SSOT: docs/figmaMCP/mcp_outputs/1033-4903 design_context_raw.txt
 * - 제목 24px Bold "검차비 결제"
 * - 내부 카드 rounded-[30px] shadow 2.344px 3.125px 11.017px, 980px
 */

export const InspectionPaymentSection = () => {
  return (
    <section className="w-full max-w-[980px]" data-node-id="1193:6764">
      <div className="mb-4 flex items-center" data-node-id="1193:6760">
        <h2 className="font-bold leading-[44px] text-[24px] text-black" data-node-id="1193:6761">
          검차비 결제
        </h2>
      </div>
      <div className="inspection-step1-section-card overflow-hidden bg-white p-6">
        <p className="text-[16px] leading-[18.753px] text-[#909090]">국내 결제 설정 영역 (연동 예정)</p>
      </div>
    </section>
  );
};
