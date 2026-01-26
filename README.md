# ForwardMax - B2B 중고차 수출 플랫폼

**프로젝트**: carivdealer  
**버전**: 1.0.0  
**최종 업데이트**: 2026-01-26

---

## 개요

ForwardMax는 B2B 중고차 수출을 위한 통합 플랫폼입니다.

### 주요 기능

- 차량 등록 (OCR 기반)
- 검차 신청 및 관리
- 경매 시스템
- 일반 판매 제안
- 탁송 관리
- 정산 관리

---

## 기술 스택

### Frontend

- **프레임워크**: React 19.2.3
- **언어**: TypeScript 5.8.2 (strict mode)
- **아키텍처**: FSD (Feature-Sliced Design)
- **스타일링**: Tailwind CSS 3.4.17
- **상태 관리**: TanStack Query 5.62.0 + Zustand 5.0.3
- **데이터 검증**: Zod 3.24.1
- **빌드**: Vite 6.2.0

### Backend

- **Firebase**: Firestore, Storage, Functions (Node.js 20)
- **리전**: asia-northeast3 (서울)

---

## 프로젝트 구조

```
src/
├── app/                    # 애플리케이션 레이어
│   ├── providers/          # 전역 프로바이더
│   ├── styles/             # 전역 스타일
│   ├── router.tsx          # 라우팅
│   └── main.tsx            # 진입점
├── pages/                  # 페이지 (라우트)
│   ├── landing/
│   ├── auth/               # 로그인, 회원가입
│   └── admin/              # 어드민 페이지
├── widgets/                # 위젯 (큰 UI 블록)
│   ├── Header/
│   ├── Sidebar/
│   ├── VehicleTable/
│   └── ProgressSidebar/
├── features/               # 기능 (비즈니스 로직)
│   ├── vehicle/
│   ├── inspection/
│   ├── auction/
│   └── ...
├── entities/               # 엔티티 (데이터 모델)
│   ├── vehicle/
│   │   ├── model/          # 타입, 스키마, 상수
│   │   └── ui/             # 엔티티 UI
│   └── ...
└── shared/                 # 공통 라이브러리
    ├── api/                # API 클라이언트
    ├── ui/                 # 디자인 시스템
    ├── lib/                # 유틸리티
    ├── config/             # 설정
    └── hooks/              # 공통 훅
```

---

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일 생성:

```env
# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=carivdealer
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

서버: http://localhost:3000

### 4. 빌드

```bash
npm run build
```

### 5. 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 타입 체크
npm run type-check
```

---

## 디자인 시스템

### Typography

- **폰트**: Pretendard
- **스케일**: H1(36px) ~ Caption(10px)
- **1440px 기준 vw 계산**

### 색상

- **Primary**: #2048E5
- **Accent**: #8A38F5
- **Status**: 7가지 차량 상태 색상

### 반응형

- **Desktop**: 700px 이상 (vw 기반)
- **Mobile**: < 700px (MobileBlocker 표시)

참조: [docs/DESIGN_SPECIFICATION.md](./docs/DESIGN_SPECIFICATION.md)

---

## 문서

- [DATABASE_ERD_SCHEMA.md](./docs/DATABASE_ERD_SCHEMA.md) - DB ERD 스키마
- [FRONTEND_FSD_DATABASE_INTEGRATION_PLAN.md](./docs/FRONTEND_FSD_DATABASE_INTEGRATION_PLAN.md) - 통합 계획
- [DESIGN_SPECIFICATION.md](./docs/DESIGN_SPECIFICATION.md) - 디자인 명세
- [MIGRATION_PROGRESS.md](./docs/MIGRATION_PROGRESS.md) - 마이그레이션 진행 상황

---

## 라이선스

Proprietary - ForwardMax

---

**Last Updated**: 2026-01-26
