# Google Maps 통합 가이드

**작성일**: 2025-12-30  
**버전**: 1.0  
**상태**: 구현 완료

---

## 개요

검차 신청 화면에 Google Maps를 통합하여 검차 장소를 선택할 수 있도록 구현했습니다.

---

## 구현 내용

### 1. Google Maps JavaScript API 통합

- Google Maps JavaScript API를 동적으로 로드
- Places API를 사용한 주소 자동완성
- React 컴포넌트로 Google Maps 통합

### 2. GoogleMapsPicker 컴포넌트

**위치**: `index.tsx` (라인 1721-1900)

**기능**:
- 주소 검색 및 자동완성 (한국 주소만 검색)
- 지도에 선택한 위치 표시
- 마커 및 정보창 표시
- 지도 클릭으로 위치 선택 가능
- 역지오코딩으로 주소 자동 변환
- 선택한 위치를 부모 컴포넌트로 전달

**Props**:
```typescript
{
  onPlaceSelect: (place: { 
    address: string; 
    location: { lat: number; lng: number } | null 
  }) => void;
  initialAddress?: string;
}
```

### 3. InspectionRequestPage 통합

- 검차 장소 선택 기능 추가
- 선택한 주소 표시
- 위치 정보를 검차 신청 데이터에 포함

---

## 환경 변수 설정

### Google Maps API 키 설정

**중요**: Google Maps API 키는 Gemini API 키와 동일한 키를 사용합니다.

`.env` 또는 `.env.local` 파일에 다음을 추가:

```env
# Google Maps API 키 (Gemini API 키와 동일)
VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
# 또는 Gemini API 키 사용
VITE_GEMINI_API_KEY=YOUR_API_KEY
```

**참고**: 
- `VITE_GOOGLE_MAPS_API_KEY`가 없으면 `VITE_GEMINI_API_KEY`를 사용합니다.
- 둘 다 없으면 기본값이 사용됩니다.

---

## Google Maps API 키 발급 방법

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com/

2. **프로젝트 선택**
   - `carivdealer` 프로젝트 선택

3. **Maps JavaScript API 활성화**
   - API 및 서비스 → 라이브러리
   - "Maps JavaScript API" 검색 및 활성화
   - "Places API" 검색 및 활성화 (주소 자동완성용)

4. **API 키 생성**
   - API 및 서비스 → 사용자 인증 정보
   - "사용자 인증 정보 만들기" → "API 키"
   - 생성된 API 키 복사

5. **API 키 제한 설정 (권장)**
   - 생성된 API 키 클릭
   - 애플리케이션 제한사항:
     - HTTP 리퍼러(웹사이트) 선택
     - 웹사이트 제한사항에 도메인 추가:
       - `https://carivdealer.web.app/*`
       - `http://localhost:3000/*` (개발용)
   - API 제한사항:
     - "키 제한" 선택
     - "Maps JavaScript API" 선택
     - "Places API" 선택

---

## 사용 방법

### 검차 신청 화면에서

1. "검차 장소" 섹션의 지도에서 주소 검색
2. 자동완성된 주소 선택
3. 지도에 마커가 표시되고 선택된 주소가 표시됨
4. "예약 확정" 버튼 클릭 시 선택한 위치 정보가 포함됨

---

## 기술 스택

- **Google Maps JavaScript API**: 최신 버전 (동적 로드)
- **Places API**: 주소 자동완성 및 검색
- **Geocoding API**: 역지오코딩 (좌표 → 주소)
- **React**: v19.2.3
- **TypeScript**: v5.8.2

---

## 주요 기능

### 1. 주소 검색 및 자동완성
- Google Places API를 사용한 주소 자동완성
- 검색어 입력 시 실시간 제안 표시
- 한국 주소만 검색 (componentRestrictions: { country: 'kr' })

### 2. 지도 표시
- 선택한 위치를 지도에 표시
- 마커 및 정보창 표시
- 뷰포트 자동 조정
- 지도 클릭으로 위치 선택 가능

### 3. 역지오코딩
- 지도 클릭 시 좌표를 주소로 자동 변환
- Geocoding API를 사용한 주소 검색

### 4. 위치 정보 저장
- 선택한 주소 및 좌표 정보 저장
- 검차 신청 시 위치 정보 포함

---

## 트러블슈팅

### 문제 1: 지도가 로드되지 않음

**증상**: "지도를 불러오는 중..." 메시지가 계속 표시됨

**해결**:
1. Google Maps API 키가 올바르게 설정되었는지 확인
2. Maps JavaScript API가 활성화되었는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인

### 문제 2: 주소 검색이 작동하지 않음

**증상**: 주소 입력 시 자동완성이 표시되지 않음

**해결**:
1. Places API가 활성화되었는지 확인
2. API 키에 Places API 권한이 있는지 확인
3. API 키 제한 설정 확인

### 문제 3: CORS 에러

**증상**: 브라우저 콘솔에 CORS 관련 에러 표시

**해결**:
1. API 키의 HTTP 리퍼러 제한 설정 확인
2. 현재 도메인이 허용 목록에 있는지 확인

---

## 코드 구조

```
index.tsx
├── GoogleMapsPicker 컴포넌트 (1721-1860)
│   ├── API 키 로드
│   ├── 웹 컴포넌트 초기화
│   ├── 이벤트 리스너 설정
│   └── 위치 선택 핸들러
│
└── InspectionRequestPage 컴포넌트
    ├── GoogleMapsPicker 사용
    ├── 위치 상태 관리
    └── 검차 신청 처리
```

---

## 향후 개선 사항

1. **현재 위치 자동 감지**
   - 사용자의 현재 위치를 자동으로 감지하여 지도 중심 설정

2. **주소 검증**
   - 선택한 주소가 유효한지 검증
   - 한국 주소만 허용하는 옵션

3. **지도 스타일 커스터마이징**
   - 브랜드 색상에 맞는 지도 스타일 적용

4. **반응형 개선**
   - 모바일 환경에서의 지도 크기 및 레이아웃 최적화

---

**최종 업데이트**: 2025-12-30  
**작성자**: AI Assistant  
**검증 상태**: ✅ 구현 완료

