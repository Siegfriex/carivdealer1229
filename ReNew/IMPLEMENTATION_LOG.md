# ReNew – Figma 컴포넌트 구현 작업 내역

**작업일**: 2026-01-28  
**기준**: [Figma 컴포넌트 정리본 (노드 1194-6634)](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1194-6634&m=dev)

---

## 1. 작업 요약

Figma MCP로 노드 1194-6634(컴포넌트 정리) 접근 후, 스크린샷·메타데이터를 기준으로 공통 UI 컴포넌트 4개를 신규 구현하고, 기존 컴포넌트와 매핑을 ReNew에 정리함.

---

## 2. 추가된 파일 (코드베이스)

| 파일 | 설명 |
|------|------|
| `src/shared/ui/SegmentedControl.tsx` | 옵션1/옵션2/옵션3 + 건수(10건 등) 세그먼트 컨트롤 |
| `src/shared/ui/MessageModal.tsx` | 메시지 박스 (제목, 내용, 취소/확인) – Modal + Button 조합 |
| `src/shared/ui/PillChip.tsx` | 필터용 pill 칩 (전체, 기본 상품, 옵션 상품 등) |
| `src/shared/ui/DateRangePicker.tsx` | 기간 선택 (Today, Yesterday, 7 days, 30 days, Custom) + 캘린더 |

---

## 3. 사용 예시 (ReNew 참고용)

### SegmentedControl

```tsx
import { SegmentedControl } from '@/shared/ui/SegmentedControl';

<SegmentedControl
  options={[
    { value: 'opt1', label: '옵션1', count: 10 },
    { value: 'opt2', label: '옵션2', count: 20 },
    { value: 'opt3', label: '옵션3' },
  ]}
  value={selected}
  onChange={setSelected}
/>
```

### MessageModal

```tsx
import { MessageModal } from '@/shared/ui/MessageModal';

<MessageModal
  isOpen={open}
  onClose={() => setOpen(false)}
  title="제목"
  message="내용을 입력해주세요."
  confirmLabel="확인"
  cancelLabel="취소"
  onConfirm={handleConfirm}
/>
```

### PillChip

```tsx
import { PillChip } from '@/shared/ui/PillChip';

<PillChip
  options={[
    { value: 'all', label: '전체' },
    { value: 'basic', label: '기본 상품' },
    { value: 'option', label: '옵션 상품' },
  ]}
  value={filter}
  onChange={setFilter}
/>
```

### DateRangePicker

```tsx
import { DateRangePicker } from '@/shared/ui/DateRangePicker';

<DateRangePicker value={range} onChange={setRange} />
```

---

## 4. ReNew 폴더에 반영된 문서

| 문서 | 내용 |
|------|------|
| [COMPONENT_SUMMARY.md](./COMPONENT_SUMMARY.md) | Figma 컴포넌트 정리본 개요, Figma→코드 매핑 표, 구현 이력 |
| [IMPLEMENTATION_LOG.md](./IMPLEMENTATION_LOG.md) | 본 문서 – 작업 요약, 추가 파일 목록, 사용 예시 |
| [README.md](./README.md) | ReNew 개요 및 Figma 링크 |

---

## 5. 검증

- **Lint**: 신규 4개 파일 린트 에러 없음
- **빌드**: `npm run build` 성공

---

*이 작업 내역은 ReNew에 “박아둔” 참고용 로그입니다.*
