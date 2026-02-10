# 매물등록 플로우 테스트 모수

로그 리프레시 후 테스트 시 사용할 URL·ID·환경 변수 정리.

## 1. 환경 변수 (`.env.local`)

| 변수 | 설명 | 예시 |
|------|------|------|
| `VITE_LOG_INGEST_URL` | 로그 수집 엔드포인트 (수집기 포트와 일치) | `http://127.0.0.1:7244/ingest/746659b6-9689-4489-bbb8-e6301089bd42` |
| `VITE_LOG_RUN_ID` | 테스트 세션 구분용 runId (선택) | `test-20260209-1` |

- 수집기 기본 포트: **7244** (충돌 시 `LOG_COLLECTOR_PORT=7245 node scripts/log-collector.js` 등으로 변경 후, `VITE_LOG_INGEST_URL` 포트도 맞출 것).

## 2. 테스트용 Mock ID

- **검차 완료 건 (판매방식 선택 → CTA_3 진입용)**  
  - 검차 ID: `insp-4`  
  - 차량 ID: `v-4`  
  - URL: `http://localhost:3002/inspections/insp-4/complete`

- **일반 판매(시세분석) 진입**  
  - `http://localhost:3002/vehicles/v-4/sale/analyzing`

- **경매(시작가 설정) 진입**  
  - `http://localhost:3002/vehicles/v-4/auction/start-price`

- **차량번호 (원부등록 플로우)**  
  - 예: `122가 2122` (step1 쿼리용)

## 3. 진입 URL 체크리스트

| 단계 | URL |
|------|-----|
| 매물등록 랜딩 | `/vehicles/new` |
| 원부 step1 (차량번호 전달) | `/vehicles/new/step1?plateNumber=122%EA%B0%80%202122` |
| 검차 신청 랜딩 (원부 다음) | `/inspections/request` 또는 `/inspections/request?plateNumber=...` |
| 등록 완료 | `/vehicles/:id/complete` |
| 검차 step1/2 | `/inspections/request/step1`, `/inspections/request/step2` |
| 검차 완료(판매방식 선택) | `/inspections/insp-4/complete` |
| 일반 판매 시세분석 | `/vehicles/v-4/sale/analyzing` |
| 일반 판매 가격/완료 | `/vehicles/v-4/sale/price`, `/vehicles/v-4/sale/complete` |
| 경매 시작가/기간/완료 | `/vehicles/v-4/auction/start-price`, `.../duration`, `.../complete` |
| 탁송 예약 | `/logistics/schedule` (선택: `?vehicleId=v-4`) |
| 정산 목록/상세 | `/settlements`, `/settlements/settle-001` |

## 4. 로그 파일

- 수집기 기록 경로: **`.cursor/register-flow.log`**
- 로그 한 줄 형식: `[ISO시간] location | message | data JSON | hypothesisId=... runId=...`
- 세션별 분석: 로그에서 `runId=register-flow-check` 또는 `VITE_LOG_RUN_ID` 값으로 검색.

## 5. 테스트 실행 순서 (권장)

1. **로그 리프레시**  
   - `.cursor/register-flow.log` 삭제 또는 `scripts/run-register-flow-test.ps1` 실행(로그 초기화 + 수집기 기동).
2. **수집기 기동**  
   - `node scripts/log-collector.js` (백그라운드 권장).
3. **앱 기동**  
   - `npm run dev` (필요 시 `.env.local`에 `VITE_LOG_INGEST_URL`, `VITE_LOG_RUN_ID` 설정).
4. **플로우 진행**  
   - 위 진입 URL대로 클릭 또는 직접 이동.
5. **로그 확인**  
   - `.cursor/register-flow.log` 열어 location/message/runId 확인.

## 6. 배포 빌드에서 런데브(DEV 스킵) 활성화

- **호스팅 등 배포 빌드**에서도 DEV 스킵 버튼·목업을 쓰려면 빌드 시 환경 변수 설정.
- 예 (PowerShell): `$env:VITE_RUN_DEV='true'; npm run build`
- 또는 `.env.production`에 `VITE_RUN_DEV=true` 추가 후 `npm run build`.
- 그러면 `npm run dev`와 동일하게 좌하단 DEV:SKIP, 페이지별 스킵 버튼, 차량 목록 목업 등이 노출됨.
