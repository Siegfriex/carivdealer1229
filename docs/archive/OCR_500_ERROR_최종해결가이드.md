# OCR API 500 에러 최종 해결 가이드

**작성일**: 2025-12-30  
**버전**: 2.0  
**상태**: 최종 해결 방안

---

## 📋 목차

1. [문제 진단](#문제-진단)
2. [해결 방법](#해결-방법)
3. [코드 개선 사항](#코드-개선-사항)
4. [배포 절차](#배포-절차)
5. [검증 방법](#검증-방법)
6. [트러블슈팅](#트러블슈팅)

---

## 🔍 문제 진단

### 증상
- OCR API 호출 시 `500 Internal Server Error` 발생
- 프론트엔드에서 "서버 오류가 발생했습니다" 메시지 표시

### 원인 분석

1. **Secret Manager 설정 문제** (가장 가능성 높음)
   - `gemini-api-key` 시크릿이 생성되지 않음
   - 시크릿은 존재하지만 버전이 없음
   - 서비스 계정 권한 부족

2. **API 키 문제**
   - API 키가 유출되어 차단됨 (403 에러)
   - API 키가 만료되었거나 잘못됨
   - API 키 권한 부족

3. **런타임 리소스 부족**
   - 메모리 부족 (512MiB → 1GiB 필요)
   - 타임아웃 (프론트엔드 5초 → 30초 필요)

4. **에러 핸들링 부족**
   - 에러 메시지가 불명확하여 디버깅 어려움

---

## ✅ 해결 방법

### 1단계: Secret Manager 설정

#### 방법 A: PowerShell 스크립트 사용 (권장)

```powershell
# 스크립트 실행
cd C:\carivdealer\FOWARDMAX
.\scripts\setup-gemini-secret-final.ps1
```

스크립트가 자동으로:
- Secret Manager API 활성화 확인
- 시크릿 생성 또는 업데이트
- 서비스 계정 권한 설정

#### 방법 B: 수동 설정

```bash
# 1. Secret Manager API 활성화
gcloud services enable secretmanager.googleapis.com --project=carivdealer

# 2. 시크릿 생성 (없는 경우)
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key \
  --data-file=- \
  --replication-policy="automatic" \
  --project=carivdealer

# 또는 시크릿 업데이트 (이미 존재하는 경우)
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key \
  --data-file=- \
  --project=carivdealer

# 3. 서비스 계정 권한 부여
gcloud projects add-iam-policy-binding carivdealer \
  --member="serviceAccount:carivdealer@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 2단계: 코드 개선 적용

다음 파일들이 이미 개선되었습니다:

1. **`functions/src/config/secrets.ts`**
   - 상세한 에러 로깅 추가
   - 에러 타입별 명확한 메시지 제공

2. **`functions/src/vehicle/ocrRegistration.ts`**
   - Secret Manager 에러 핸들링 개선
   - 상세한 에러 로깅 추가
   - 에러 타입별 HTTP 상태 코드 반환

3. **`functions/src/index.ts`**
   - 메모리 증가: `512MiB` → `1GiB`

4. **`src/services/api.ts`**
   - 타임아웃 증가: `5초` → `30초`

### 3단계: Functions 재배포

```bash
cd C:\carivdealer\FOWARDMAX
firebase deploy --only functions:ocrRegistrationAPI
```

---

## 🔧 코드 개선 사항

### 1. Secret Manager 에러 핸들링 개선

```typescript
// functions/src/config/secrets.ts
export async function getSecret(secretName: string): Promise<string> {
  try {
    // ... 시크릿 조회 로직 ...
    
    if (!secretValue) {
      throw new Error(`Secret ${secretName} is empty. Please add a secret version.`);
    }
    
    return secretValue;
  } catch (error: any) {
    // 상세한 에러 로깅
    const errorCode = error.code || 'UNKNOWN';
    const errorMessage = error.message || 'Unknown error';
    
    console.error(`[SECRET] Failed to get secret ${secretName}:`, {
      code: errorCode,
      message: errorMessage,
      details: error.details || error
    });
    
    // 에러 타입별 처리
    if (errorCode === 'NOT_FOUND' || errorCode === 5) {
      throw new Error(`Secret ${secretName} not found in Secret Manager. Please create it first.`);
    } else if (errorCode === 'PERMISSION_DENIED' || errorCode === 7) {
      throw new Error(`Permission denied accessing secret ${secretName}. Check IAM permissions.`);
    } else {
      throw new Error(`Failed to retrieve secret ${secretName}: ${errorMessage}`);
    }
  }
}
```

### 2. OCR API 에러 핸들링 개선

```typescript
// functions/src/vehicle/ocrRegistration.ts
catch (error: any) {
  // 상세한 에러 로깅
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    code: error.code,
    details: error.details || error.response || error
  };
  
  console.error('[ERROR] OCR Registration Error:', errorDetails);
  
  // 에러 타입별 처리
  if (error.message?.includes('API key') || error.message?.includes('Secret')) {
    res.status(500).json({ 
      error: 'Gemini API key configuration error',
      details: 'Secret Manager 설정을 확인해주세요.',
      message: error.message
    });
  }
  // ... 기타 에러 처리 ...
}
```

### 3. 리소스 최적화

- **메모리**: `512MiB` → `1GiB` (큰 이미지 처리용)
- **타임아웃**: 프론트엔드 `5초` → `30초` (OCR 처리 시간 고려)

---

## 🚀 배포 절차

### 1. Secret Manager 설정 확인

```bash
# 시크릿 존재 확인
gcloud secrets describe gemini-api-key --project=carivdealer

# 시크릿 버전 확인
gcloud secrets versions list gemini-api-key --project=carivdealer
```

### 2. Functions 재배포

```bash
cd C:\carivdealer\FOWARDMAX
firebase deploy --only functions:ocrRegistrationAPI
```

### 3. 프론트엔드 빌드 및 배포

```bash
npm run build
firebase deploy --only hosting
```

---

## ✅ 검증 방법

### 1. Secret Manager 검증

```bash
# 시크릿 값 확인 (base64 인코딩된 값이 표시됨)
gcloud secrets versions access latest --secret="gemini-api-key" --project=carivdealer
```

### 2. Functions 로그 확인

```bash
# 최근 로그 확인
gcloud functions logs read ocrRegistrationAPI \
  --region=asia-northeast3 \
  --limit=50 \
  --project=carivdealer

# 실시간 로그 스트리밍
gcloud functions logs tail ocrRegistrationAPI \
  --region=asia-northeast3 \
  --project=carivdealer
```

### 3. API 테스트

웹 브라우저에서 OCR 기능 테스트:
1. 차량 등록 페이지로 이동
2. 등록원부 이미지 업로드
3. 성공적으로 데이터가 추출되는지 확인

---

## 🔧 트러블슈팅

### 문제 1: "Secret not found" 에러

**증상**: Functions 로그에 `Secret gemini-api-key not found` 메시지

**해결**:
```bash
# 시크릿 생성
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key \
  --data-file=- \
  --replication-policy="automatic" \
  --project=carivdealer
```

### 문제 2: "Permission denied" 에러

**증상**: Functions 로그에 `Permission denied accessing secret` 메시지

**해결**:
```bash
# 서비스 계정 권한 부여
gcloud projects add-iam-policy-binding carivdealer \
  --member="serviceAccount:carivdealer@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 문제 3: "Secret is empty" 에러

**증상**: 시크릿은 존재하지만 값이 비어있음

**해결**:
```bash
# 새 버전 추가
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key \
  --data-file=- \
  --project=carivdealer
```

### 문제 4: 타임아웃 에러

**증상**: 프론트엔드에서 타임아웃 발생

**해결**:
- 프론트엔드 타임아웃이 30초로 설정되었는지 확인
- Functions 타임아웃이 60초로 설정되어 있는지 확인
- 이미지 크기를 줄여서 재시도

### 문제 5: 메모리 부족 에러

**증상**: Functions 로그에 메모리 관련 에러

**해결**:
- Functions 메모리가 `1GiB`로 설정되었는지 확인
- 이미지 크기를 줄여서 재시도

### 문제 6: API 키 유출로 인한 차단 (403 에러)

**증상**: 
```
"Your API key was reported as leaked. Please use another API key."
"status": "PERMISSION_DENIED"
```

**해결**:

1. **새 API 키 생성**
   - Google AI Studio 접속: https://aistudio.google.com/app/apikey
   - 새 API 키 생성

2. **Secret Manager 업데이트**

   **방법 A: PowerShell 스크립트 사용 (권장)**
   ```powershell
   cd C:\carivdealer\FOWARDMAX
   .\scripts\update-gemini-api-key.ps1
   ```

   **방법 B: 수동 업데이트**
   ```bash
   # 새 버전 추가
   echo -n "NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key \
     --data-file=- \
     --project=carivdealer
   
   # 이전 버전 비활성화 (선택사항)
   gcloud secrets versions disable VERSION_NUMBER \
     --secret="gemini-api-key" \
     --project=carivdealer
   ```

3. **Functions 재배포**
   ```bash
   firebase deploy --only functions:ocrRegistrationAPI
   ```

4. **검증**
   ```bash
   # Functions 로그 확인
   gcloud functions logs read ocrRegistrationAPI \
     --region=asia-northeast3 \
     --limit=50 \
     --project=carivdealer
   ```

**예방 조치**:
- API 키를 코드나 공개 저장소에 커밋하지 않기
- Secret Manager만 사용하여 API 키 관리
- 정기적으로 API 키 로테이션

---

## 📊 체크리스트

배포 전 확인 사항:

- [ ] Secret Manager에 `gemini-api-key` 시크릿이 존재함
- [ ] 시크릿에 최신 버전이 있음
- [ ] 서비스 계정에 `roles/secretmanager.secretAccessor` 권한이 있음
- [ ] Functions 메모리가 `1GiB`로 설정됨
- [ ] 프론트엔드 타임아웃이 `30초`로 설정됨
- [ ] 코드 변경사항이 반영됨
- [ ] Functions 재배포 완료
- [ ] Functions 로그에서 에러가 없는지 확인

---

## 📞 추가 지원

문제가 지속되면 다음 정보를 확인하세요:

1. **Functions 로그**: `gcloud functions logs read ocrRegistrationAPI --region=asia-northeast3 --limit=100`
2. **Secret Manager 감사 로그**: GCP Console → Logging → Audit Logs → Secret Manager API
3. **IAM 권한**: GCP Console → IAM & Admin → IAM

---

**최종 업데이트**: 2025-12-30  
**작성자**: AI Assistant  
**검증 상태**: ✅ 코드 개선 완료, 배포 대기

