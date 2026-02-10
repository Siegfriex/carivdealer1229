# CTA_3 거래 플로우 구현 요약 (§3.5)

**진입**: 검차 완료 내역에서 "판매하기" 클릭 → 판매방식선택 페이지로 이동 후 **일반/경매** 분기.

---

## 노드 ↔ 라우트 ↔ 페이지

| nodeId | 화면 | 라우트 | 페이지 |
|--------|------|--------|--------|
| 1714-22332 | GNB 거래 탭 리스팅 (클릭 시 하단 상태 전환) | `/offers` | TradeListPage |
| 794-3704 | 판매방식선택 | `/vehicles/:id/sale/analyzing` | GeneralSaleAnalyzingPage |
| 794-4015 | 시세분석중 (공통) | `/vehicles/:id/sale/analyzing` | GeneralSaleAnalyzingPage |
| **경우 1: 일반** | | | |
| 794-4200, 794-4371 | 경매 시작가 보정 | `/vehicles/:id/sale/price` | GeneralSalePricePage |
| 794-4107 | 판매전환완료 | `/vehicles/:id/sale/complete` | GeneralSaleCompletePage |
| 794-4708 | 거래상세 변형 (컨테이너 클릭 시 아래 펼침) | `/vehicles/:id/trade` | TradeDetailPage |
| 794-4542 | 거래상세 경매 (펼쳐지는 뷰) | `/vehicles/:id/trade` | TradeDetailPage |
| **경우 2: 경매** | | | |
| 1123-13580 | 경매 시작가설정 | `/vehicles/:id/auction/start-price` | AuctionStartPricePage |
| 1123-20023, 1123-20699 | 경매시작가 값입력·연월일시 | `/vehicles/:id/auction/duration` | AuctionDurationPage |
| 1123-13763 | 모두 입력 완료 화면 | `/vehicles/:id/auction/duration` | AuctionDurationPage |
| 1123-13487 | 판매전환완료 (경매) | `/vehicles/:id/auction/complete` | AuctionCompletePage |
| 1123-14112 | 거래상세 경매-1 (컨테이너 클릭 시 아래 펼침) | `/vehicles/:id/trade` | TradeDetailPage |
| 1123-13946 | 거래상세 경매 펼쳐지는 뷰 | `/vehicles/:id/trade` | TradeDetailPage |
| **공통** | | | |
| 1302-27289 | 검차 상세내역 모달 (컨테이너 내 버튼 클릭) | TradeDetailPage 모달 | TradeDetailPage |
| 1302-27093 | 판매방식 변경 및 판매가 수정 컨테이너 | `/vehicles/:id/trade` | TradeDetailPage |

---

## 구현 요구사항

1. **거래상세(794-4708, 1123-14112)**: 컨테이너 클릭 시 **아래로 펼쳐지는 뷰** (794-4542, 1123-13946).
2. **검차 상세내역**: 컨테이너 내 "검차 상세내역" 버튼 클릭 시 **모달 팝업** (1302-27289).
3. **경매**: 연·월·일·시 입력(1123-20023, 1123-20699) 및 **모두 입력 완료** 화면(1123-13763).
4. **판매방식 변경·판매가 수정**: TradeDetailPage에 컨테이너(1302-27093) 추가.

---

## mcp_outputs 폴더 (17노드)

- 1714-22332, 794-3704, 794-4015, 794-4200, 794-4371, 794-4107, 794-4708, 794-4542, 1302-27289  
- 1123-13580, 1123-20023, 1123-20699, 1123-13763, 1123-13487, 1123-14112, 1123-13946, 1302-27093  

레이아웃 스펙은 각 노드 `metadata_raw.txt`·`design_context_raw.txt` 채움 후 개별 구현계획에서 보강.

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
