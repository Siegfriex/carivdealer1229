# Git 설치 및 GitHub 푸시 가이드

## 현재 상황

- Git이 시스템 PATH에 등록되지 않았거나 설치되어 있지 않습니다
- GitHub 레포지토리: https://github.com/Siegfriex/carivdealer1229.git

## Git 설치 방법

### 방법 1: Git for Windows 설치 (권장)

1. **Git 다운로드**: https://git-scm.com/download/win
2. **설치 프로그램 실행**:
   - 기본 설정으로 설치 (모든 옵션 체크)
   - **중요**: "Add Git to PATH" 옵션 선택
3. **PowerShell 재시작**: 설치 후 완전히 종료하고 다시 시작

### 방법 2: GitHub Desktop 설치 (GUI 방식)

1. **GitHub Desktop 다운로드**: https://desktop.github.com/
2. 설치 후 레포지토리 클론 및 관리 가능

## Git 설치 확인

```powershell
git --version
# 출력 예시: git version 2.43.0.windows.1
```

## 레포지토리 초기화 및 푸시 절차

### 1단계: Git 저장소 초기화 (처음 한 번만)

```powershell
cd C:\carivdealer
git init
```

### 2단계: 원격 레포지토리 연결

```powershell
git remote add origin https://github.com/Siegfriex/carivdealer1229.git
```

또는 이미 연결되어 있다면:

```powershell
git remote set-url origin https://github.com/Siegfriex/carivdealer1229.git
```

### 3단계: .gitignore 파일 생성 (필요한 경우)

```powershell
# .gitignore 파일 생성
@"
node_modules/
dist/
.env.local
.env
*.log
.DS_Store
.vscode/
.idea/
"@ | Out-File -FilePath .gitignore -Encoding utf8
```

### 4단계: 변경사항 스테이징

```powershell
# 모든 변경사항 스테이징
git add .

# 또는 특정 파일만 스테이징
git add FOWARDMAX/
git add index.html
git add index.tsx
git add package.json
```

### 5단계: 커밋

```powershell
git commit -m "PRD v2.13 업데이트 및 output.json 통합 완료

- PRD 문서 v2.13으로 업데이트 (output.json 참조 섹션 보완)
- Critical Issues 해결 완료 (상태 전이-화면 매핑, FLOW-03 순서, 사이트맵 구조)
- output.json IA/SPM 항목 부록 추가 (Section 23.5~23.6)
- AI Studio 에이전트 사전 지침 문서 추가
- 개발 서버 실행 가이드 추가"
```

### 6단계: 브랜치 확인 및 푸시

```powershell
# 현재 브랜치 확인
git branch

# main 브랜치로 전환 (없으면 생성)
git checkout -b main

# 원격 레포지토리에 푸시
git push -u origin main
```

## 인증 문제 해결

### Personal Access Token 사용 (권장)

GitHub에서 Personal Access Token을 생성하여 사용:

1. **GitHub 설정**: https://github.com/settings/tokens
2. **Generate new token (classic)** 클릭
3. **권한 선택**: `repo` 권한 체크
4. **토큰 생성 후 복사**
5. **푸시 시 사용**:
   ```powershell
   # 사용자명: Siegfriex
   # 비밀번호: Personal Access Token 입력
   git push -u origin main
   ```

### SSH 키 사용

```powershell
# SSH 키 생성
ssh-keygen -t ed25519 -C "your_email@example.com"

# 공개 키 복사
cat ~/.ssh/id_ed25519.pub

# GitHub에 SSH 키 추가: https://github.com/settings/keys
```

## 전체 명령어 시퀀스 (한 번에 실행)

```powershell
cd C:\carivdealer

# Git 초기화 (이미 초기화되어 있으면 생략)
git init

# 원격 레포지토리 연결
git remote add origin https://github.com/Siegfriex/carivdealer1229.git

# 변경사항 스테이징
git add .

# 커밋
git commit -m "PRD v2.13 업데이트 및 output.json 통합 완료"

# 브랜치 설정 및 푸시
git branch -M main
git push -u origin main
```

## 문제 해결

### 문제 1: "fatal: not a git repository"

**해결**: `git init` 실행

### 문제 2: "remote origin already exists"

**해결**: 
```powershell
git remote remove origin
git remote add origin https://github.com/Siegfriex/carivdealer1229.git
```

### 문제 3: 인증 실패

**해결**: Personal Access Token 사용 또는 SSH 키 설정

### 문제 4: "Please tell me who you are"

**해결**:
```powershell
git config --global user.name "Siegfriex"
git config --global user.email "your_email@example.com"
```

---

**참고**: Git이 설치되어 있지 않은 경우, 위의 설치 방법을 따라 Git을 먼저 설치한 후 위의 절차를 진행하세요.


