# Firebase Storage 구조 정의서

**버전**: 1.0  
**최종 업데이트**: 2025-01-XX  
**상태**: 테스트 모드 (2026-01-29까지)

---

## 개요

이 문서는 FOWARDMAX 프로젝트의 Firebase Storage 디렉토리 구조와 파일 네이밍 규칙을 정의합니다.

---

## 리전 설정

- **Storage 버킷**: `gs://carivdealer.firebasestorage.app`
- **리전**: `asia-northeast3` (서울)

---

## 디렉토리 구조

```
storage/
├── vehicles/
│   └── {vehicleId}/
│       ├── registration/          # 등록원부 이미지
│       │   └── registration_{timestamp}.{jpg|png|pdf}
│       ├── thumbnails/            # 썸네일 이미지
│       │   └── thumbnail_{timestamp}.jpg
│       └── documents/             # 기타 문서 (선택)
│           └── {documentType}_{timestamp}.{ext}
├── inspections/
│   └── {inspectionId}/
│       ├── photos/                # 검차 사진 (37+)
│       │   ├── exterior/          # 외관
│       │   ├── interior/          # 내관
│       │   ├── mechanic/          # 기계
│       │   └── frame/             # 차대
│       └── videos/                # 검차 영상 (3)
├── members/
│   └── {memberId}/
│       ├── business-registration/ # 사업자등록증
│       └── profile/               # 프로필 이미지 (선택)
└── public/
    └── assets/                    # 공개 자산 (로고 등)
```

---

## 파일 네이밍 규칙

### 타임스탬프 형식

- **형식**: `YYYYMMDD_HHmmss` 또는 Unix timestamp (밀리초)
- **예시**: `registration_20250120_143022.jpg` 또는 `registration_1737352222000.jpg`

### 카테고리별 접두사 규칙

| 카테고리 | 접두사 | 예시 |
|---------|--------|------|
| 등록원부 이미지 | `registration_` | `registration_20250120_143022.jpg` |
| 썸네일 이미지 | `thumbnail_` | `thumbnail_20250120_143022.jpg` |
| 검차 사진 (외관) | `exterior_` | `exterior_20250120_143022.jpg` |
| 검차 사진 (내관) | `interior_` | `interior_20250120_143022.jpg` |
| 검차 사진 (기계) | `mechanic_` | `mechanic_20250120_143022.jpg` |
| 검차 사진 (차대) | `frame_` | `frame_20250120_143022.jpg` |
| 검차 영상 | `video_` | `video_20250120_143022.mp4` |
| 사업자등록증 | `business_registration_` | `business_registration_20250120_143022.jpg` |
| 프로필 이미지 | `profile_` | `profile_20250120_143022.jpg` |

---

## 디렉토리별 상세 설명

### 1. vehicles/{vehicleId}/

차량 관련 파일 저장 디렉토리입니다.

#### registration/
- **용도**: 차량 등록원부 이미지 저장
- **파일 형식**: JPG, PNG, PDF
- **파일 크기 제한**: 10MB
- **예시 경로**: `vehicles/v-106/registration/registration_20250120_143022.jpg`

#### thumbnails/
- **용도**: 차량 썸네일 이미지 저장
- **파일 형식**: JPG
- **파일 크기 제한**: 2MB
- **권장 해상도**: 800x600px
- **예시 경로**: `vehicles/v-106/thumbnails/thumbnail_20250120_143022.jpg`

#### documents/
- **용도**: 기타 차량 관련 문서 저장 (보험증, 정비이력 등)
- **파일 형식**: PDF, JPG, PNG
- **파일 크기 제한**: 10MB
- **예시 경로**: `vehicles/v-106/documents/insurance_20250120_143022.pdf`

---

### 2. inspections/{inspectionId}/

검차 관련 미디어 파일 저장 디렉토리입니다.

#### photos/
검차 사진은 카테고리별로 하위 디렉토리에 분류하여 저장합니다.

##### exterior/
- **용도**: 외관 검차 사진
- **파일 형식**: JPG, PNG
- **파일 크기 제한**: 5MB
- **예상 파일 수**: 10-15개
- **예시 경로**: `inspections/insp-001/photos/exterior/exterior_20250120_143022.jpg`

##### interior/
- **용도**: 내관 검차 사진
- **파일 형식**: JPG, PNG
- **파일 크기 제한**: 5MB
- **예상 파일 수**: 10-15개
- **예시 경로**: `inspections/insp-001/photos/interior/interior_20250120_143022.jpg`

##### mechanic/
- **용도**: 기계 부품 검차 사진
- **파일 형식**: JPG, PNG
- **파일 크기 제한**: 5MB
- **예상 파일 수**: 5-10개
- **예시 경로**: `inspections/insp-001/photos/mechanic/mechanic_20250120_143022.jpg`

##### frame/
- **용도**: 차대 검차 사진
- **파일 형식**: JPG, PNG
- **파일 크기 제한**: 5MB
- **예상 파일 수**: 5-10개
- **예시 경로**: `inspections/insp-001/photos/frame/frame_20250120_143022.jpg`

#### videos/
- **용도**: 검차 영상 저장
- **파일 형식**: MP4
- **파일 크기 제한**: 100MB
- **예상 파일 수**: 3개
- **예시 경로**: `inspections/insp-001/videos/video_20250120_143022.mp4`

---

### 3. members/{memberId}/

회원 관련 파일 저장 디렉토리입니다.

#### business-registration/
- **용도**: 사업자등록증 이미지 저장
- **파일 형식**: JPG, PNG, PDF
- **파일 크기 제한**: 5MB
- **예시 경로**: `members/member-001/business-registration/business_registration_20250120_143022.jpg`

#### profile/
- **용도**: 프로필 이미지 저장 (선택)
- **파일 형식**: JPG, PNG
- **파일 크기 제한**: 2MB
- **권장 해상도**: 400x400px (정사각형)
- **예시 경로**: `members/member-001/profile/profile_20250120_143022.jpg`

---

### 4. public/assets/

공개 자산 저장 디렉토리입니다.

- **용도**: 로고, 아이콘 등 공개적으로 접근 가능한 자산
- **파일 형식**: SVG, PNG, JPG
- **파일 크기 제한**: 1MB
- **예시 경로**: `public/assets/logo.png`

---

## 파일 크기 제한

| 디렉토리 | 최대 파일 크기 |
|---------|---------------|
| vehicles/registration/ | 10MB |
| vehicles/thumbnails/ | 2MB |
| vehicles/documents/ | 10MB |
| inspections/photos/*/ | 5MB |
| inspections/videos/ | 100MB |
| members/business-registration/ | 5MB |
| members/profile/ | 2MB |
| public/assets/ | 1MB |

---

## 접근 제어

### 테스트 모드 (2026-01-29까지)
- 모든 읽기/쓰기 허용

### 프로덕션 모드 (향후)
- 역할 기반 접근 제어
- 파일 크기 제한 적용
- 파일 형식 검증
- 업로드 속도 제한

자세한 보안 규칙은 `storage.rules` 파일을 참조하세요.

---

## Storage Rules 참조

Storage 보안 규칙은 `storage.rules` 파일에 정의되어 있습니다.

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2025-01-XX | 초기 버전 작성 |

---

## 참고 문서

- [FIRESTORE_SCHEMA.md](./FIRESTORE_SCHEMA.md) - Firestore 컬렉션 구조 정의서
- [DATABASE_CONFIG.md](./DATABASE_CONFIG.md) - 데이터베이스 설정 문서

