# 베이스라인 고정 문서
## ForwardMax 리팩토링 전 상태 기록

**작성일**: 2025-01-XX  
**목적**: 리팩토링 전 빌드 경고/위험요인을 기준선으로 고정하여 변경 전후 비교 가능하게 기록

---

## 1. 빌드 경고/위험요인

### 1.1 index.css 파일 부재 경고

**현상**:
- `index.html` 95번째 줄에 `<link rel="stylesheet" href="/index.css">` 링크 존재
- 실제 `index.css` 파일은 프로젝트 루트에 없음
- Vite 빌드 시 경고 발생 가능성: `index.css doesn't exist at build time, it will remain unchanged to be resolved at runtime`

**영향**:
- 빌드 경고 발생 (기능 영향 없음)
- 런타임에서 404 에러 발생 가능 (브라우저 콘솔)

**해결 방안**:
- `index.css` 파일 생성 또는 링크 제거

---

### 1.2 GeminiService import 혼재

**현상**:
- `index.tsx` 73번째 줄: 정적 import `import { GeminiService } from './src/services/gemini';`
- `index.tsx` 1319, 1395, 1828, 2802번째 줄: 동적 import `const { GeminiService } = await import('./src/services/gemini');`

**영향**:
- Vite 빌드 경고: `C:/carivdealer/FOWARDMAX/src/services/gemini.ts is dynamically imported by C:/carivdealer/FOWARDMAX/index.tsx but also statically imported by C:/carivdealer/FOWARDMAX/index.tsx, dynamic import will not move module into another chunk.`
- 코드 스플리팅 효과 없음 (동적 import가 정적 import로 인해 청크 분리되지 않음)

**해결 방안**:
- 정적 import 제거하고 동적 import만 사용하거나
- 정적 import만 사용 (코드 스플리팅 포기)

---

## 2. 디자인 시스템 컬러 토큰 (SSOT)

**소스**: `index.html` 30-39번째 줄 (Tailwind CDN 설정)

**정의된 컬러**:
```javascript
'fmax-bg': '#FFFFFF',
'fmax-surface': '#F8F9FA',
'fmax-border': '#E9ECEF',
'fmax-primary': '#373EEF',
'fmax-accent': '#00D8FF',
'fmax-text-main': '#1A233A',
'fmax-text-sub': '#6C757D',
'fmax-success': '#00B37E',
'fmax-error': '#E03131'
```

**사용 원칙**:
- 모든 UI 컴포넌트는 이 컬러 토큰을 우선 사용
- Tailwind 기본 팔레트(`bg-green-50` 등)는 보조적으로만 사용

---

## 3. 빌드 출력 (참고)

**명령어**: `npm run build`

**예상 경고**:
```
(!) C:/carivdealer/FOWARDMAX/src/services/gemini.ts is dynamically imported by C:/carivdealer/FOWARDMAX/index.tsx but also statically imported by C:/carivdealer/FOWARDMAX/index.tsx, dynamic import will not move module into another chunk.

/index.css doesn't exist at build time, it will remain unchanged to be resolved at runtime
```

**번들 크기** (이전 빌드 기준):
- `dist/assets/index-*.js`: ~616 KB (gzip: ~146 KB)

---

## 4. 검증 방법

**변경 전 빌드**:
```bash
cd C:\carivdealer\FOWARDMAX
npm run build
```

**확인 사항**:
1. 경고 메시지 개수/내용
2. 번들 크기
3. 빌드 성공 여부

**변경 후 비교**:
- 동일한 명령어로 빌드 후 경고 감소 여부 확인
- 번들 크기 변화 확인

---

## 5. 다음 단계

이 베이스라인을 기준으로 Phase 1부터 진행하며, 각 Phase 완료 시 빌드 결과를 비교하여 개선 효과를 측정합니다.

