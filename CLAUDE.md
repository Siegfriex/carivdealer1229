# ForwardMax - Claude Code Context

## Project Overview
중고차 딜러 플랫폼 (Used Car Dealer Platform)
- Firebase Functions 백엔드
- React/Vite 프론트엔드
- Firestore 데이터베이스

## Tech Stack
- **Backend**: Firebase Functions (Node.js/TypeScript)
- **Frontend**: React 18 + Vite + TypeScript
- **Database**: Firestore
- **Storage**: Firebase Storage
- **Auth**: Firebase Authentication
- **AI/ML**: Google Gemini API (OCR, 차량 분석)
- **Maps**: Google Maps API
- **Deploy**: Firebase Hosting + Functions

## Project Structure
```
FOWARDMAX/
├── functions/           # Firebase Functions (백엔드)
│   ├── src/
│   │   ├── auction/     # 경매 관련 Functions
│   │   ├── auth/        # 인증 관련 Functions
│   │   ├── config/      # 설정 (secrets, firebase)
│   │   ├── inspection/  # 검수 관련 Functions
│   │   ├── logistics/   # 탁송 관련 Functions
│   │   ├── settlement/  # 정산 관련 Functions
│   │   ├── trade/       # 거래 관련 Functions
│   │   ├── vehicle/     # 차량 관련 Functions
│   │   └── index.ts     # Entry point
│   └── package.json
├── src/                 # React 프론트엔드
│   ├── components/      # React 컴포넌트
│   ├── services/        # API 서비스
│   ├── hooks/           # Custom Hooks
│   └── utils/           # 유틸리티
├── docs/                # 문서
├── scripts/             # 배포/설정 스크립트
├── firestore.rules      # Firestore 보안 규칙
├── firestore.indexes.json
├── storage.rules        # Storage 보안 규칙
└── firebase.json        # Firebase 설정
```

## Key Commands
```bash
# Development
npm run dev              # 프론트엔드 개발 서버
npm run build            # 프로덕션 빌드

# Functions
cd functions && npm run build    # Functions 빌드
cd functions && npm run serve    # Functions 로컬 에뮬레이터

# Deploy
firebase deploy                  # 전체 배포
firebase deploy --only functions # Functions만 배포
firebase deploy --only hosting   # Hosting만 배포
firebase deploy --only firestore:rules  # Firestore 규칙만 배포
```

## Auto-Run Mode Guidelines

### Autonomous Operation Principles
1. **No Permission Needed**: 모든 개발 관련 작업은 자율적으로 수행
2. **Proactive Problem Solving**: 에러 발견 시 즉시 수정
3. **Continuous Integration**: 변경사항은 테스트 후 자동 커밋/푸시 가능
4. **Documentation**: 중요 변경사항은 자동 문서화

### Anti-Gravity Mode
- 제약 없이 자유롭게 코드 탐색 및 수정
- 필요시 새 파일 생성, 기존 파일 삭제/수정
- 빌드 에러, 타입 에러 발견 시 자율적 수정
- 최적화 기회 발견 시 자율적 개선

### Commit Convention
```
feat: 새로운 기능
fix: 버그 수정
chore: 설정, 의존성 등 변경
docs: 문서 변경
refactor: 리팩토링
style: 포맷팅, 세미콜론 등
test: 테스트 추가/수정
perf: 성능 개선
```

## Environment Variables
- Firebase 설정: `.env.local`, `functions/.env.local`
- Secrets: GCP Secret Manager 사용
  - `GEMINI_API_KEY`: Gemini AI API 키
  - `KOTSA_API_KEY`: 자동차 등록 API 키

## Important Notes
- OCR 기능: Gemini Vision API 사용
- 탁송 거리 계산: Google Maps Distance Matrix API
- 결제: 토스페이먼츠 연동 예정
- 알림: Firebase Cloud Messaging (FCM)

## Current Branch
- `1230`: 현재 개발 브랜치

---
*This file provides context for Claude Code autonomous operation.*
