# Domestic Seller 1.0 – 컴포넌트 정리본

**Figma 노드**: [1194-6634 (컴포넌트 정리본)](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1194-6634&m=dev)  
**문서 버전**: 1.0  
**최종 확인**: 2026-01-28  

---

## 1. 개요

Domestic Seller 1.0 Figma 파일 내 **컴포넌트 정리본** 프레임입니다.  
화면/플로우별로 사용되는 컴포넌트를 한곳에서 확인할 수 있습니다.

| 항목 | 내용 |
|------|------|
| **Figma 링크** | https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1194-6634&m=dev |
| **노드 ID** | 1194-6634 |
| **용도** | 컴포넌트 목록·구성 참고, 구현 시 컴포넌트 매핑 |

---

## 2. 활용 방법

- **구현 시**: Figma에서 해당 노드(1194-6634)를 열어 공통/재사용 컴포넌트 확인
- **디자인-코드 매핑**: 정리본에 나온 컴포넌트와 `src/shared/ui`, `src/entities/*/ui` 등 실제 컴포넌트 매핑
- **ReNew 작업**: 디자인 갱신 시 정리본과 비교해 누락·변경 컴포넌트 점검

---

## 3. Figma → 코드 컴포넌트 매핑

Figma 컴포넌트 정리본(1194-6634)에 나온 UI와 프로젝트 내 구현 매핑입니다.

| Figma (컴포넌트 정리) | 프로젝트 경로 | 비고 |
|----------------------|---------------|------|
| 옵션1/옵션2/옵션3 + 건수 (세그먼트) | `src/shared/ui/SegmentedControl.tsx` | 옵션 라벨 + 선택적 건수(10건 등) |
| 취소 / 확인 버튼 | `src/shared/ui/Button.tsx` | variant: secondary / primary |
| 메시지 박스 (제목, 내용, 취소/확인) | `src/shared/ui/MessageModal.tsx` | Modal + 제목/내용/버튼 |
| 필터 칩 (전체, 기본 상품, 옵션 상품 등) | `src/shared/ui/PillChip.tsx` | pill 형태 선택 칩 |
| 기간 선택 (Today, 7 days, 30 days, Custom) | `src/shared/ui/DateRangePicker.tsx` | 프리셋 + 캘린더 |
| 체크박스 그리드 | `src/shared/ui/Checkbox.tsx` | 여러 개 조합해 그리드 구성 |
| 데이터 테이블 (선택, 제목, 내용, 상태, 등록일, 등록자) | `src/shared/ui/Table.tsx` | TableHead/TableBody/TableRow/TableCell |
| 상품/주문 요약 테이블 (구분, 상품명, 판매가, 개수, 합계 등) | `src/shared/ui/Table.tsx` | 동일 Table 컴포넌트 |
| 라디오 리스트 (옵션1, 옵션2, 100건) | `src/shared/ui/Select.tsx` 또는 네이티브 radio | 필요 시 RadioGroup 추가 |
| 배지/태그 (활성, 비활성, 카테고리명 등) | `src/shared/ui/Badge.tsx` | variant로 스타일 구분 |

---

## 4. 관련 문서

| 문서 | 설명 |
|------|------|
| [FIGMA_DESIGN_SPEC.md](./FIGMA_DESIGN_SPEC.md) | 화면/플로우 스펙 (회원·인증, 로그인 후 랜딩) |
| [README.md](./README.md) | ReNew 폴더 개요 및 Figma 링크 모음 |

---

## 5. 구현 이력

- **2026-01-28**: Figma MCP로 노드 1194-6634 접근 후, 컴포넌트 정리본 기준으로 아래 컴포넌트 신규 구현.
  - `SegmentedControl` – 옵션 + 건수 세그먼트
  - `MessageModal` – 제목/내용/취소·확인 메시지 박스
  - `PillChip` – 필터용 pill 칩
  - `DateRangePicker` – Today/7d/30d/Custom + 캘린더

---

*캡처: 2026-01-28, Figma 노드 1194-6634 전체 스크린샷 캡처 완료.*
