# Domestic Seller 1.0 – 타이포그래피 시스템

**Figma 노드**: [1194-7425 (Typography)](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1194-7425&m=dev)  
**기준**: **모든 가로는 항상 1440px**  
**문서 버전**: 1.0  
**최종 반영**: 2026-01-28  

---

## 1. 폰트

| 항목 | 값 |
|------|-----|
| **Primary** | Pretendard |
| **Fallback** | -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif |
| **Android 혼용 시** | 한글: Noto Sans CJK KR, 영문/숫자: Roboto (영문/숫자 1–2px 더 크게 권장) |
| **정렬** | Baseline 기준 정렬. 한·영·숫자 혼용 시 auto layout만으로는 미세 조정 어려울 수 있음. |

---

## 2. 타입 스케일 (1440px 기준)

Figma Typography(1194-7425) 스펙. 가로 기준 1440px, vw = px ÷ 1440 × 100.

| 스타일 | 크기 | 굵기 | 용도 | CSS 변수 | Tailwind |
|--------|------|------|------|----------|----------|
| **H1** | 36px | Medium (500) | 대제목 | `--text-h1` | `text-h1 font-medium` |
| **H2** | 24px | Medium (500) | 중제목 | `--text-h2` | `text-h2 font-medium` |
| **H3** | 18px | Bold (700) | 소제목 | `--text-h3` | `text-h3 font-bold` |
| **H4** | 16px | Regular (400) | 본문 제목 | `--text-h4` | `text-h4 font-normal` |
| **Body** | 14px | Regular (400) | 본문 | `--text-body` | `text-body font-normal` |
| **Button** | 12px | Regular (400) | 버튼·캡션 | `--text-button` | `text-button font-normal` |
| **Caption** | 10px | (확장) | 보조 문구 | `--text-caption` | `text-caption` |

---

## 3. 구현 위치

| 구분 | 경로 |
|------|------|
| **디자인 토큰** | `src/shared/styles/design-tokens.css` |
| **Tailwind** | `tailwind.config.js` → `theme.extend.fontSize` |
| **글로벌 기본** | `src/app/styles/globals.css` → `h1`~`h4`, `p` |
| **컴포넌트** | `src/shared/ui/Typography.tsx` (variant로 적용) |

---

## 4. 사용 예시

```tsx
// HTML 시맨틱 + Tailwind
<h1 className="text-h1 font-medium leading-tight">제목</h1>
<p className="text-body font-normal leading-normal">본문</p>

// Typography 컴포넌트
import { Typography } from '@/shared/ui/Typography';
<Typography variant="h1">제목</Typography>
<Typography variant="body">본문</Typography>
```

---

## 5. 1440px 기준 정리

- **레이아웃**: `--layout-base-width: 1440px`, `--container-max: 1440px`
- **타이포**: clamp(최소, vw, **최대 px**)에서 최대값이 Figma 1440px 스펙
- **간격/spacing**: 동일하게 1440px 기준 vw 사용 (예: 24px → 1.67vw)

---

*Figma Domestic Seller 1.0, Typography (node 1194-7425) 반영.*
