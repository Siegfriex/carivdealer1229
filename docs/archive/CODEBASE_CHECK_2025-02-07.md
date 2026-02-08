# 코드베이스 일괄 점검 결과

**검증 일시**: 2025-02-07  
**검증 범위**: 프론트엔드(src), Firebase Functions(functions), 라우터/API/에러핸들링

---

## 1. 실행 요약

| 항목 | 결과 | 비고 |
|------|------|------|
| 프로젝트 구조(FSD) | ✅ 일치 | app, entities, features, pages, shared, widgets 확인 |
| 라우터 페이지 import | ✅ 전부 존재 | router.tsx 39개 라우트 ↔ 실제 페이지 파일 일치 |
| TypeScript 타입체크 | ✅ 통과 | 수정 후 `npm run type-check` 성공 |
| 프론트엔드 빌드 | ✅ 성공 | `npm run build` (Vite) 정상 |
| Functions 빌드 | ✅ 성공 | `cd functions && npm run build` 정상 |
| API/에러 패턴 | ✅ 일관 | apiClient + analyzeError, Mock 시 _isMockData 사용 |
| ESLint | ⚠️ 설정 전환 필요 | ESLint 9용 eslint.config.mjs 생성됨, 의존성 설치 필요 |

---

## 2. 수정한 항목

### 2.1 타입/빌드 오류 제거

- **`src/features/auction/place-bid/model/useBid.test.ts`**  
  - JSX 포함으로 `.ts` 확장자에서 TS 오류 발생 → **삭제**  
  - 동일 내용의 `useBid.test.tsx`가 이미 있어 중복 제거.

- **`src/pages/admin/GeneralSaleOffersPage.tsx`**  
  - `useNavigate()` / `navigate` 미사용 → import 및 변수 제거.

- **`src/pages/admin/LogisticsHistoryPage.tsx`**  
  - `Z_INDEX` 미정의 사용 → `import { Z_INDEX } from '@/shared/config/zIndex'` 추가.

### 2.2 포맷

- **`functions/src/index.ts`**  
  - `};// API-0800`, `};// API-0900`처럼 붙어 있던 주석을 다음 줄로 분리.

---

## 3. 검증 방법

- **구조**: `list_dir`로 `src/`, `src/pages/`, `functions/src/` 확인.
- **라우터**: `router.tsx`의 각 페이지 import 경로와 `src/pages/` 하위 파일 대조.
- **타입체크**: `npm run type-check` (tsc --noEmit).
- **빌드**: `npm run build`, `cd functions && npm run build`.
- **API/에러**: `grep`으로 `analyzeError`, `_isMockData`, `@/shared/api/client` 사용처 확인.

---

## 4. API·에러 핸들링 정리

- **중앙 클라이언트**: `src/shared/api/apiClient.ts` (타임아웃, Mock 폴백, `_isMockData` 플래그).
- **에러 분석**: `src/shared/lib/errorHandler.ts`의 `analyzeError` 사용.  
  - 네트워크/타임아웃/4xx·5xx 구분, 한글 메시지 반환.
- **alias**: `@/shared/api/client` → `apiClient` re-export.  
  - `useBid`, `useBuyNow`, `useInspectionRequest` 등에서 사용.

---

## 5. 권장 후속 작업

1. **ESLint 실행 가능하도록 하기**  
   - `eslint.config.mjs`는 이미 생성됨.  
   - 다음 설치 후 `npm run lint` 실행 권장 (버전 충돌 시 `@eslint/js@9` 등 호환 버전 지정).  
   ```bash
   npm install @eslint/compat globals @eslint/js @eslint/eslintrc eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser -D
   ```
2. **테스트**  
   - `npm run test` / `npm run test:coverage` 로 유닛 테스트 확인.
3. **문서 참조**  
   - 라우트별 페이지는 `docs/FRONTEND_FSD_DATABASE_INTEGRATION_PLAN.md` 등에서 `useBid.test.ts` 참조가 있을 수 있음 → `useBid.test.tsx` 기준으로 정리 권장.

---

## 6. Functions export 일치 여부

`functions/src/index.ts`에서 export한 모든 HTTP/스케줄 함수에 대응하는 구현 파일이 존재함.

- vehicle: ocrRegistration, inspection  
- member: verifyBusiness  
- inspection: assign, uploadResult, getResult  
- trade: changeSaleMethod, acceptProposal, manageProposalTTL  
- logistics: schedule, dispatch (request/confirm), handover  
- settlement: notify  
- auction: bid, buyNow  
- report: saveReport, generateReport  
- config: getGoogleMapsApiKey  
- order: createOrder, getOrder, updateOrderStatus  
- payment: createPayment, getPayment, refundPayment  
- address: createAddress, getAddress, listAddresses, updateAddress, deleteAddress  
- review: createReview, listReviews  
- seller_docs: uploadDoc, approveDoc, listDocs  

---

*이 문서는 코드베이스 일괄 점검 시 실제 실행한 명령과 결과를 바탕으로 작성되었습니다.*
