# 시작하기 가이드

**프로젝트**: ForwardMax (carivdealer)  
**버전**: 1.0.0  
**작성일**: 2026-01-26

---

## 🚀 빠른 시작

### 1. 의존성 설치

```powershell
cd Y:\0126\0128\carivdealer1229
npm install
```

**설치되는 패키지**:
- React 19.2.3
- TypeScript 5.8.2
- Tailwind CSS 3.4.17
- TanStack Query 5.62.0
- Zod 3.24.1
- Firebase 10.13.0
- Vitest, Playwright (테스트)

### 2. 환경 변수 설정

`.env` 파일이 이미 존재하는지 확인하세요. 없다면 생성:

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

서버가 http://localhost:3000 에서 시작됩니다.

### 4. 검증

```bash
# 타입 체크
npm run type-check

# 테스트 실행
npm run test

# 빌드
npm run build
```

---

## 📁 프로젝트 구조 이해하기

### FSD (Feature-Sliced Design) 아키텍처

```
src/
├── app/            ← 1. 애플리케이션 진입점
├── pages/          ← 2. 페이지 (라우트)
├── widgets/        ← 3. 위젯 (큰 UI 블록)
├── features/       ← 4. 기능 (비즈니스 로직)
├── entities/       ← 5. 엔티티 (데이터 모델)
└── shared/         ← 6. 공통 라이브러리
```

**의존성 방향**: app → pages → widgets → features → entities → shared

### 주요 폴더

- **entities/vehicle/model**: 차량 타입, 스키마, 상수
- **features/vehicle/register-form**: 차량 등록 훅, API
- **pages/admin**: 관리자 페이지
- **shared/ui**: 디자인 시스템 컴포넌트
- **widgets**: 재사용 가능한 큰 UI 블록

---

## 🎨 디자인 시스템 사용하기

### Typography

```tsx
<h1 className="text-h1 font-bold">제목</h1>
<p className="text-body text-gray-600">본문</p>
<span className="text-caption text-gray-500">작은 텍스트</span>
```

### 색상

```tsx
<div className="bg-primary text-white">Primary</div>
<div className="bg-success text-white">Success</div>
<div className="bg-error text-white">Error</div>
```

### 간격

```tsx
<div className="p-6 gap-4">
  {/* padding: 24px, gap: 16px (1440px 기준) */}
</div>
```

### 컴포넌트

```tsx
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

<Button variant="primary" size="lg">클릭</Button>
<Input label="이메일" type="email" fullWidth />
```

---

## 🔍 주요 기능 사용하기

### 차량 목록 조회

```tsx
import { useVehicles } from '@/features/vehicle/register-form/model/useVehicles';

const { data: vehicles, isLoading } = useVehicles({
  status: ['draft', 'inspection'],
});
```

### 차량 등록

```tsx
import { useVehicleRegister } from '@/features/vehicle/register-form/model/useVehicleRegister';

const { mutate: registerVehicle } = useVehicleRegister();

registerVehicle({
  status: 'draft',
  plateNumber: '33바 3333',
  manufacturer: 'Kia',
  modelName: 'Carnival KA4',
  modelYear: '2022',
  mileage: '50000',
});
```

### OCR 처리

```tsx
import { ocrRegistration } from '@/features/vehicle/register-form/api/vehicleApi';

const result = await ocrRegistration('33바 3333');
console.log(result.vin, result.manufacturer, result.model);
```

---

## 🧪 테스트 실행하기

### 단위 테스트

```bash
npm run test
```

### 테스트 UI

```bash
npm run test:ui
```

### E2E 테스트

```bash
npm run test:e2e
```

---

## 📚 문서

- [README.md](./README.md) - 프로젝트 개요
- [docs/DESIGN_SPECIFICATION.md](./docs/DESIGN_SPECIFICATION.md) - 디자인 명세
- [docs/DATABASE_ERD_SCHEMA.md](./docs/DATABASE_ERD_SCHEMA.md) - DB 스키마
- [docs/FINAL_MIGRATION_REPORT.md](./docs/FINAL_MIGRATION_REPORT.md) - 마이그레이션 보고서

---

## ❗ 문제 해결

### npm install 오류

PowerShell 실행 정책 문제 시:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
```

### Tailwind 클래스 미적용

globals.css가 import 되었는지 확인:
- `src/app/main.tsx`에 `import './styles/globals.css'` 있는지 확인

### 타입 에러

```bash
npm run type-check
```

strict mode 관련 에러는 타입 단언보다 타입 가드 사용 권장.

---

**도움이 필요하시면 문서를 참조하세요!**
