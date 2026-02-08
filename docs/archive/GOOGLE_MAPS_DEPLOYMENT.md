# Google Maps 통합 배포 가이드

**작성일**: 2025-12-30  
**버전**: 1.0  
**상태**: 배포 준비 완료

---

## 배포 필요 사항

### ✅ 배포 필요: Hosting (프론트엔드)

Google Maps 컴포넌트가 프론트엔드에 추가되었으므로 **Hosting 배포가 필수**입니다.

### ❌ 배포 불필요

- **Functions**: Google Maps 관련 함수 변경사항 없음
- **Storage**: Google Maps 관련 Storage 변경사항 없음
- **Firestore Rules**: 변경사항 없음
- **Firestore Indexes**: 변경사항 없음

---

## 배포 절차

### 1단계: 프론트엔드 빌드

```powershell
cd C:\carivdealer\FOWARDMAX
npm run build
```

**예상 결과**:
- `dist/` 폴더에 빌드 결과물 생성
- 빌드 성공 메시지 확인

### 2단계: Hosting 배포

```powershell
firebase deploy --only hosting
```

**또는 전체 배포** (Functions도 함께 배포하려면):
```powershell
firebase deploy
```

---

## 배포 전 확인 사항

### 1. 환경 변수 확인

`.env` 또는 `.env.local` 파일에 다음이 설정되어 있는지 확인:

```env
# Google Maps API 키 (Gemini API 키와 동일)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyC0H1moukd9KnWlCqrTaBxYj1WE3Y16QpY
# 또는
VITE_GEMINI_API_KEY=AIzaSyC0H1moukd9KnWlCqrTaBxYj1WE3Y16QpY
```

**참고**: 둘 다 없으면 기본값이 사용됩니다.

### 2. Google Cloud Console API 활성화 확인

다음 API가 활성화되어 있는지 확인:
- ✅ Maps JavaScript API
- ✅ Places API
- ✅ Geocoding API

**확인 방법**:
```bash
gcloud services list --enabled --project=carivdealer | grep -E "maps|places|geocoding"
```

### 3. API 키 권한 확인

API 키에 다음 권한이 있는지 확인:
- Maps JavaScript API
- Places API
- Geocoding API

---

## 배포 후 검증

### 1. 배포 확인

배포 완료 후 다음 URL에서 확인:
- **프로덕션**: https://carivdealer.web.app

### 2. 기능 테스트

1. 검차 신청 화면으로 이동
2. "검차 장소" 섹션에서 주소 검색 테스트
3. 지도 클릭으로 위치 선택 테스트
4. 마커 및 정보창 표시 확인

### 3. 브라우저 콘솔 확인

개발자 도구(F12) → Console에서 다음 에러가 없는지 확인:
- Google Maps API 로드 에러
- Places API 에러
- Geocoding API 에러

---

## 트러블슈팅

### 문제 1: 빌드 실패

**증상**: `npm run build` 실행 시 에러 발생

**해결**:
1. `node_modules` 삭제 후 재설치:
   ```powershell
   Remove-Item -Recurse -Force node_modules
   npm install
   npm run build
   ```

2. TypeScript 에러 확인:
   ```powershell
   npx tsc --noEmit
   ```

### 문제 2: 배포 실패

**증상**: `firebase deploy --only hosting` 실행 시 에러 발생

**해결**:
1. Firebase 로그인 확인:
   ```powershell
   firebase login:list
   ```

2. 프로젝트 확인:
   ```powershell
   firebase use carivdealer
   ```

3. `dist/` 폴더 존재 확인:
   ```powershell
   Test-Path dist
   ```

### 문제 3: 지도가 표시되지 않음

**증상**: 배포 후 지도가 로드되지 않음

**해결**:
1. 브라우저 콘솔에서 에러 메시지 확인
2. API 키가 올바르게 설정되었는지 확인
3. Maps JavaScript API가 활성화되었는지 확인
4. API 키 제한 설정 확인 (HTTP 리퍼러 제한 등)

---

## 배포 체크리스트

배포 전:
- [ ] `npm run build` 성공
- [ ] `dist/` 폴더에 빌드 결과물 존재
- [ ] 환경 변수 설정 확인
- [ ] Google Maps API 활성화 확인

배포 중:
- [ ] `firebase deploy --only hosting` 실행
- [ ] 배포 성공 메시지 확인

배포 후:
- [ ] 프로덕션 URL에서 페이지 로드 확인
- [ ] 검차 신청 화면 접근 확인
- [ ] Google Maps 지도 표시 확인
- [ ] 주소 검색 기능 테스트
- [ ] 지도 클릭 기능 테스트
- [ ] 브라우저 콘솔 에러 확인

---

## 빠른 배포 명령어

```powershell
# 전체 프로세스 (빌드 + 배포)
cd C:\carivdealer\FOWARDMAX
npm run build
firebase deploy --only hosting
```

---

**최종 업데이트**: 2025-12-30  
**작성자**: AI Assistant  
**검증 상태**: ✅ 배포 준비 완료

