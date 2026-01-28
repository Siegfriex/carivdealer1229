# Google Maps 위치 정보 Functions 업데이트

**작성일**: 2025-12-30  
**버전**: 1.0  
**상태**: 업데이트 완료

---

## 문제점

기존 `inspectionRequest` 함수가 Google Maps에서 선택한 위치 정보를 받지 않고 있었습니다.

---

## 해결 방법

### 1. `inspectionRequest` 함수 수정

**파일**: `functions/src/vehicle/inspection.ts`

**변경 사항**:
- 위치 정보(`location`) 파라미터 추가
- 위치 정보 검증 및 정리 로직 추가
- Firestore에 위치 정보 저장

**수정된 코드**:
```typescript
const { preferred_date, preferred_time, location } = req.body;

// 위치 정보 검증 및 정리
let locationData = null;
if (location) {
  if (location.address && location.location && location.location.lat && location.location.lng) {
    locationData = {
      address: location.address,
      coordinates: {
        lat: location.location.lat,
        lng: location.location.lng
      }
    };
  } else if (location.address) {
    // 주소만 있는 경우
    locationData = {
      address: location.address,
      coordinates: null
    };
  }
}

// Firestore에 위치 정보 포함하여 저장
if (locationData) {
  inspectionData.location = locationData;
}
```

### 2. Firestore 스키마 업데이트

**파일**: `docs/FIRESTORE_SCHEMA.md`

**추가된 필드**:
- `inspections` 컬렉션에 `location` 필드 추가
- 위치 정보 구조 정의:
  ```typescript
  {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    } | null;
  }
  ```

---

## API 요청 형식

### 검차 신청 API 호출 예시

```typescript
POST /inspectionRequestAPI
Content-Type: application/json

{
  "vehicle_id": "v-106",
  "preferred_date": "2025-01-20",
  "preferred_time": "14:00",
  "location": {
    "address": "서울특별시 강남구 테헤란로 123",
    "location": {
      "lat": 37.5665,
      "lng": 126.9780
    }
  }
}
```

---

## 배포 필요 사항

### Functions 재배포 필요

위치 정보 저장 기능이 추가되었으므로 **Functions 재배포가 필요**합니다.

```powershell
cd C:\carivdealer\FOWARDMAX
firebase deploy --only functions:inspectionRequestAPI
```

---

## 검증 방법

### 1. Functions 배포 확인

```bash
firebase functions:list
```

### 2. API 테스트

검차 신청 화면에서:
1. Google Maps로 위치 선택
2. 날짜/시간 선택
3. "예약 확정" 버튼 클릭
4. Firestore에서 `inspections` 컬렉션 확인
5. `location` 필드가 올바르게 저장되었는지 확인

### 3. Firestore 데이터 확인

```bash
# Firestore Console에서 확인
# https://console.firebase.google.com/project/carivdealer/firestore
```

**확인할 내용**:
- `inspections/{inspectionId}` 문서에 `location` 필드 존재
- `location.address` 값 확인
- `location.coordinates.lat`, `location.coordinates.lng` 값 확인

---

## 향후 개선 사항

1. **좌표 검증**: 좌표가 유효한 범위 내에 있는지 검증
2. **주소 정규화**: 주소 형식을 표준화
3. **역지오코딩**: 좌표만 있는 경우 주소로 변환
4. **거리 계산**: 평가사와의 거리 계산 기능 추가

---

**최종 업데이트**: 2025-12-30  
**작성자**: AI Assistant  
**검증 상태**: ✅ 코드 수정 완료, 배포 대기

