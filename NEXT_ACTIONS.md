# 다음 단계 액션 플랜

**작성일**: 2025-01-XX  
**현재 상태**: API 계약 정렬 및 폴백 안정화 완료

---

## ✅ 완료된 작업

1. **API 계약 정렬** (Body/Query only)
   - `API_계약_정의서.md` 생성
   - 모든 Functions에서 `req.params` 제거
   - 프론트엔드 API 클라이언트 경로 파라미터 제거

2. **검차 결과 업로드** (multipart + Busboy)
   - `inspection/uploadResult.ts` Busboy 기반 재구현
   - Firebase Storage 업로드 로직 추가
   - 프론트엔드 FormData 구조 정렬

3. **5초 타임아웃 폴백 안정화**
   - 타임아웃만 폴백하도록 엄격화
   - 400/404/409 등 응답이 온 실패는 폴백하지 않음
   - `_isMockData` 플래그 추가

4. **Firestore Rules 분리**
   - `firestore.rules.prototype` (프로토타입용)
   - `firestore.rules.prod` (프로덕션용)
   - 배포 전 검증 스크립트 추가

5. **화면 단 호출 파라미터 수정**
   - `LogisticsSchedulePage`에 `vehicle_id` 추가

---

## 🎯 즉시 실행 필요 (우선순위 순)

### 1. 빌드 테스트 (필수)

```powershell
cd C:\carivdealer\FOWARDMAX
npm run build
```

**확인 사항**:
- [ ] 빌드 성공 여부
- [ ] `dist/` 폴더 생성 확인
- [ ] TypeScript 에러 없음
- [ ] 빌드 파일 크기 확인

**예상 시간**: 2-3분

---

### 2. Functions 배포 (변경사항 있음)

**변경된 Functions**:
- `inspection/assign.ts` - Body only로 변경
- `inspection/getResult.ts` - Query only로 변경
- `inspection/uploadResult.ts` - Busboy 기반 재구현
- `logistics/dispatch.ts` - Body only로 변경
- `logistics/handover.ts` - Body only로 변경
- `trade/acceptProposal.ts` - Body only로 변경
- `settlement/notify.ts` - Body only로 변경
- `vehicle/inspection.ts` - Body only로 변경
- `trade/changeSaleMethod.ts` - Body only로 변경
- `auction/bid.ts` - Body only로 변경
- `auction/buyNow.ts` - Body only로 변경

**배포 명령어**:
```powershell
cd C:\carivdealer\FOWARDMAX
firebase deploy --only functions
```

**예상 시간**: 5-10분

---

### 3. Firestore Rules 배포 (프로토타입/프로덕션 선택)

#### 옵션 A: 프로토타입용 Rules 배포 (개발 중)
```powershell
# 프로토타입용 rules로 전환
Copy-Item firestore.rules.prototype firestore.rules -Force

# 배포
firebase deploy --only firestore:rules
```

#### 옵션 B: 프로덕션용 Rules 배포 (운영 환경)
```powershell
# 프로덕션용 rules로 전환
Copy-Item firestore.rules.prod firestore.rules -Force

# 배포 전 검증
.\scripts\check-firestore-rules.ps1 -RulesFile firestore.rules

# 배포
firebase deploy --only firestore:rules
```

**예상 시간**: 1-2분

---

### 4. Hosting 배포 (프론트엔드 변경사항 반영)

**변경된 프론트엔드 파일**:
- `src/services/api.ts` - API 호출 구조 변경
- `src/components/LogisticsSchedulePage.tsx` - 파라미터 추가

**배포 명령어**:
```powershell
cd C:\carivdealer\FOWARDMAX
firebase deploy --only hosting
```

**예상 시간**: 3-5분

---

## 🔍 배포 후 검증 체크리스트

### API 계약 검증
- [ ] `inspectionAssignAPI` (POST body) 정상 동작
- [ ] `inspectionGetResultAPI` (GET query) 정상 동작
- [ ] `logisticsScheduleAPI` (vehicle_id 포함) 정상 동작
- [ ] `logisticsDispatchConfirmAPI` (POST body) 정상 동작
- [ ] `handoverApproveAPI` (POST body) 정상 동작

### 검차 업로드 검증
- [ ] multipart 전송 시 결과 JSON 파싱 정상
- [ ] Storage 업로드 정상 (이미지 파일)
- [ ] Firestore 업데이트 정상

### 폴백 검증
- [ ] 네트워크 차단 시: 폴백 + `_isMockData` 플래그 확인
- [ ] 5초 지연 시: 폴백 발생 확인
- [ ] 400/404 발생 시: 폴백 없이 에러 노출 확인

### 보안 검증
- [ ] 프로덕션 배포 시 오픈 룰이 적용되지 않았는지 확인
- [ ] Firestore Rules 검증 스크립트 실행 확인

---

## 📋 단계별 실행 가이드

### 시나리오 1: 전체 배포 (권장)

```powershell
# 1. 빌드 테스트
cd C:\carivdealer\FOWARDMAX
npm run build

# 2. Firestore Rules 전환 (프로토타입용)
Copy-Item firestore.rules.prototype firestore.rules -Force

# 3. 전체 배포
firebase deploy
```

**포함 항목**: Hosting + Functions + Firestore Rules

---

### 시나리오 2: 단계별 배포 (검증 후 진행)

```powershell
# 1. 빌드 테스트
cd C:\carivdealer\FOWARDMAX
npm run build

# 2. Functions만 먼저 배포
firebase deploy --only functions

# 3. Functions 로그 확인
firebase functions:log

# 4. Firestore Rules 배포
Copy-Item firestore.rules.prototype firestore.rules -Force
firebase deploy --only firestore:rules

# 5. Hosting 배포
firebase deploy --only hosting
```

---

## ⚠️ 주의사항

### 1. Firestore Rules 선택
- **프로토타입 단계**: `firestore.rules.prototype` 사용 (오픈 룰)
- **프로덕션 배포**: 반드시 `firestore.rules.prod` 사용 (인증 기반)

### 2. Functions 배포 시
- Functions v2는 자동 빌드되지만, 로컬에서 먼저 빌드 테스트 권장:
  ```powershell
  cd functions
  npm run build
  ```

### 3. 환경 변수 확인
- Functions에서 사용하는 Secret Manager 키 확인:
  - `gemini-api-key` (OCR API용)

---

## 🐛 문제 발생 시

### 빌드 실패
```powershell
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Functions 배포 실패
```powershell
cd functions
npm install
npm run build
# 빌드 에러 확인 후 수정
```

### Firestore Rules 검증 실패
```powershell
# 검증 스크립트 실행
.\scripts\check-firestore-rules.ps1 -RulesFile firestore.rules

# 오픈 룰이 발견되면 프로덕션용으로 전환
Copy-Item firestore.rules.prod firestore.rules -Force
```

---

## 📊 예상 소요 시간

| 단계 | 예상 시간 | 우선순위 |
|------|----------|---------|
| 빌드 테스트 | 2-3분 | 필수 |
| Functions 배포 | 5-10분 | 높음 |
| Firestore Rules 배포 | 1-2분 | 중간 |
| Hosting 배포 | 3-5분 | 높음 |
| **전체** | **10-20분** | - |

---

## 🎯 권장 실행 순서

1. ✅ **빌드 테스트** (필수)
2. ✅ **Functions 배포** (변경사항 많음)
3. ✅ **Firestore Rules 배포** (프로토타입용)
4. ✅ **Hosting 배포** (프론트엔드 변경사항)
5. ✅ **배포 후 검증** (체크리스트 확인)

---

**다음 액션**: 빌드 테스트부터 시작하세요!

