# 코드베이스 정리 계획

**작성일**: 2026-01-26  
**목적**: 불필요한 파일 제거 및 프로젝트 구조 정리

---

## 📊 현재 상태 분석

### 1. 불필요한 파일 카테고리

#### A. 임시/백업 파일 (즉시 삭제 가능)
- `old/~$D_FowardMax_Cariv_P1.docx` - Word 임시 파일
- `old/~WRL0001.tmp` - 임시 파일
- `old/test_utf8.txt` - 테스트 파일
- `old/output.json` - 임시 출력 파일

#### B. 중복 파일들
- `FLOW/image copy*.png` (8개) - 원본 이미지의 복사본
- `docs/API_SPECIFICATION.md` vs `docs/API_SPECIFICATION_v2.md` - v2가 최신
- `docs/FRD.md` vs `docs/FRD_v2.md` - v2가 최신
- `docs/*.docx`, `docs/*.pdf` - 마크다운과 중복

#### C. 오래된/사용하지 않는 문서들
- `old/` 폴더 전체 - 개발 초기 단계 파일들
- 루트의 여러 상태 보고서들 (DEPLOYMENT_STATUS*, FIXES_APPLIED.md 등)
- 중복된 가이드 문서들

#### D. 테스트/검증 스크립트
- `old/comprehensive_validation.py`
- `old/validate_prd_*.py`
- `old/parse_output_json.py`
- `old/extract_output_json_details.py`

---

## 🗂️ 정리 계획

### Phase 1: 즉시 삭제 가능한 파일들

#### 1.1 임시 파일 삭제
```
old/~$D_FowardMax_Cariv_P1.docx
old/~WRL0001.tmp
old/test_utf8.txt
old/output.json
```

#### 1.2 중복 이미지 삭제
```
FLOW/image copy*.png (8개 파일)
→ 원본 image.png만 유지
```

#### 1.3 중복 문서 삭제
```
docs/API_SPECIFICATION.md (v2가 최신)
docs/FRD.md (v2가 최신)
docs/*.docx, docs/*.pdf (마크다운과 중복)
```

---

### Phase 2: old/ 폴더 정리

#### 2.1 old/ 폴더 분석
- **총 파일 수**: 약 80개 이상
- **주요 내용**:
  - AI Studio 관련 프롬프트 파일들
  - DOCX 변환 스크립트들
  - PRD 검증/변환 스크립트들
  - 오래된 문서들

#### 2.2 old/ 폴더 처리 방안

**옵션 A: 전체 삭제** (권장)
- 현재 프로젝트에서 사용하지 않는 파일들
- Git 히스토리에 보존됨
- 디스크 공간 절약

**옵션 B: 아카이브로 이동**
- `archive/` 폴더로 이동
- `.gitignore`에 추가하여 Git에서 제외

**권장**: 옵션 A (전체 삭제)

---

### Phase 3: 루트 디렉토리 문서 정리

#### 3.1 상태 보고서 통합
현재 루트에 있는 상태 보고서들:
- `DEPLOYMENT_STATUS.md`
- `DEPLOYMENT_STATUS_CHECK.md`
- `FIXES_APPLIED.md`
- `UPDATE_SUMMARY.md`
- `NEXT_STEPS.md`
- `NEXT_ACTIONS.md`

**처리 방안**:
- 최신 상태만 유지 (`DEPLOYMENT_STATUS.md`)
- 나머지는 `docs/archive/`로 이동 또는 삭제

#### 3.2 가이드 문서 정리
- `GCP_IAM_FIX_GUIDE.md` → `docs/`로 이동
- `IAM_설정_간단가이드.md` → `docs/`로 이동
- `FIX_IAM_WITH_SERVICE_ACCOUNT.md` → `docs/`로 이동
- `GCP_API_활성화_목록.md` → `docs/`로 이동
- `GCP_API_활성화_확인_결과.md` → `docs/`로 이동

---

### Phase 4: docs/ 폴더 정리

#### 4.1 중복 문서 제거
- `API_SPECIFICATION.md` 삭제 (v2 유지)
- `FRD.md` 삭제 (v2 유지)
- `.docx`, `.pdf` 파일 삭제 (마크다운 유지)

#### 4.2 오래된 검증 보고서 정리
다음 파일들은 특정 시점의 검증 보고서로 보임:
- `BASELINE_FREEZE_2025-01-XX.md`
- `COMPREHENSIVE_REVIEW_2025-01-XX.md`
- `DEPLOYMENT_READINESS_CHECK_2025-01-XX.md`
- `ENDPOINT_VERIFICATION_2025-01-XX.md`
- `VERIFICATION_LOG_2025-01-XX.md`

**처리 방안**: `docs/archive/` 폴더 생성 후 이동

#### 4.3 중복 가이드 정리
- `DOCX_변환_가이드.md` - old/ 폴더와 중복
- `GCP_서비스계정_생성_가이드.md` - 루트에도 있음
- `GCP_통합런타임서비스계정_생성_완료보고서.md` - 완료 보고서

---

### Phase 5: scripts/ 폴더 정리

#### 5.1 현재 스크립트 목록
- `check-firestore-rules.ps1` ✅ 유지
- `check-gcp-apis.ps1` ✅ 유지
- `check-secret-manager-permissions.ps1` ✅ 유지
- `fix-functions-iam-service-account.ps1` ✅ 유지
- `fix-functions-iam.ps1` ✅ 유지
- `setup-gemini-secret-final.ps1` ✅ 유지
- `setup-gemini-secret.ps1` ⚠️ final 버전과 중복 가능
- `setup-kotsa-secret.ps1` ✅ 유지
- `setup-secrets.ps1` ✅ 유지
- `update-gemini-api-key.ps1` ✅ 유지
- `iam-setup-checklist.md` ✅ 유지

**확인 필요**: `setup-gemini-secret.ps1` vs `setup-gemini-secret-final.ps1` 중복 여부

---

## 📋 실행 계획

### Step 1: 백업 확인
- [ ] Git 저장소 상태 확인
- [ ] 현재 브랜치 확인
- [ ] 변경사항 커밋 여부 확인

### Step 2: 임시 파일 삭제
- [ ] `old/~$*.docx` 삭제
- [ ] `old/~WRL*.tmp` 삭제
- [ ] `old/test_utf8.txt` 삭제
- [ ] `old/output.json` 삭제

### Step 3: 중복 이미지 삭제
- [ ] `FLOW/image copy*.png` 삭제 (8개)

### Step 4: 중복 문서 삭제
- [ ] `docs/API_SPECIFICATION.md` 삭제
- [ ] `docs/FRD.md` 삭제
- [ ] `docs/*.docx` 삭제
- [ ] `docs/*.pdf` 삭제

### Step 5: old/ 폴더 처리
- [ ] `old/` 폴더 전체 삭제 (또는 archive로 이동)

### Step 6: 루트 문서 정리
- [ ] 상태 보고서 통합 (최신만 유지)
- [ ] 가이드 문서들을 `docs/`로 이동

### Step 7: docs/ 폴더 정리
- [ ] 오래된 검증 보고서를 `docs/archive/`로 이동
- [ ] 중복 가이드 정리

### Step 8: scripts/ 폴더 확인
- [ ] 중복 스크립트 확인 및 정리

### Step 9: 최종 검증
- [ ] 프로젝트 빌드 테스트
- [ ] Git 상태 확인
- [ ] 정리 결과 문서화

---

## 📊 예상 효과

### 디스크 공간 절약
- `old/` 폴더: 약 50-100MB
- 중복 문서: 약 10-20MB
- 중복 이미지: 약 5-10MB
- **총 예상 절약**: 약 65-130MB

### 프로젝트 구조 개선
- 루트 디렉토리 파일 수 감소
- 문서 구조 명확화
- 유지보수 용이성 향상

---

## ⚠️ 주의사항

1. **Git 히스토리 보존**: 삭제 전 Git 커밋 확인
2. **의존성 확인**: 삭제 전 파일 참조 여부 확인
3. **백업**: 중요한 파일은 별도 백업 권장
4. **점진적 실행**: 단계별로 실행하여 문제 발생 시 롤백 가능

---

## 📝 정리 후 구조

```
carivdealer1229/
├── src/                    # 소스 코드
├── functions/              # Firebase Functions
├── scripts/                # 유틸리티 스크립트
├── docs/                   # 문서 (정리됨)
│   ├── archive/            # 오래된 문서 (선택적)
│   └── [최신 문서들]
├── FLOW/                   # 이미지 (중복 제거됨)
├── README.md               # 프로젝트 설명
├── package.json
└── [설정 파일들]
```

---

## ✅ 다음 단계

정리 계획 검토 후 실행 여부 결정
