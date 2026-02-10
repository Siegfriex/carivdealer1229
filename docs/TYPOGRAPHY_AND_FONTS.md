# 타이포그래피·폰트 (SSOT)

## 폰트 로드 — 한 곳만 사용

- **로드 위치**: `src/app/styles/globals.css`  
  - `@font-face` Pretendard (400, 500, 700), SUITE Variable  
  - **다른 파일에서 `@font-face` 또는 폰트 CDN/import 추가 금지.**

- **전역 적용**: `body { font-family: var(--font-primary); }`  
  - `--font-primary` = Pretendard (design-tokens.css)  
  - **페이지/컴포넌트에서 `style={{ fontFamily: 'var(--font-primary)' }}` 등 인라인 지정 금지.**  
  - 전역 상속으로 동일하므로 중복 제거함.

- **Tailwind**: `theme.extend.fontFamily.sans` = Pretendard  
  - `font-sans` 사용 시 Pretendard 적용.

## 타이포 스케일 (design-tokens + Tailwind)

| 용도 | CSS 변수 | Tailwind 클래스 |
|------|----------|-----------------|
| H1 | --text-h1 (36px) | text-h1 |
| H2 | --text-h2 (24px) | text-h2 |
| H3 | --text-h3 (18px) | text-h3 |
| 본문 | --text-body (14px) | text-body |
| 섹션 제목 (탁송·검차 등) | --text-section-title (24px) | text-section-title |
| 폼 라벨 | --text-form-label (20px) | text-form-label |
| 폼 입력/버튼 문구 | --text-form-input (22px) | text-form-input |

- **페이지별 `text-[22px]`, `text-[24px]` 하드코딩 지양** → `text-form-input`, `text-section-title`, `text-form-label` 등 토큰 클래스 사용.

## 디스플레이(차량번호·강조)

- `--font-display` = SUITE Variable (design-tokens)  
- Tailwind: `font-display`  
- 필요 시 해당 노드에만 `className="font-display"` 사용.

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
