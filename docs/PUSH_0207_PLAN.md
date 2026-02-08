# 0207 브랜치 강제 푸시 계획

**작성일**: 2026-02-08  
**상태**: 계획만 수립 (미실행)  
**대상 원격**: https://github.com/Siegfriex/carivdealder.git  
**대상 브랜치**: `0207`

---

## 1. 현시점 0207 vs 원격(carivdealder/0207) 차이

### 1.1 커밋 히스토리

| 항목 | 결과 |
|------|------|
| 로컬 HEAD | `b6feb1c3971f135598f65c80a2ccde7e6ef2fa6d` |
| 원격 carivdealder/0207 | `b6feb1c3971f135598f65c80a2ccde7e6ef2fa6d` |
| 로컬이 원격보다 앞선 커밋 수 | **0** |
| 원격이 로컬보다 앞선 커밋 수 | **0** |

**결론**: 커밋은 완전히 동일함. 차이는 **작업 디렉터리의 미커밋 변경**뿐이다.

### 1.2 미커밋 변경 (스테이징 대상)

| 구분 | 경로 | 변경 요약 |
|------|------|-----------|
| 수정 | `docs/CarivDealer_API_ERD_Mapping.md` | +34줄 |
| 수정 | `docs/figma/FIGMA_GLOBAL_PLAN.md` | 대폭 축소 (323줄 → 적은 줄 수) |
| 수정 | `docs/figma/FIGMA_IA_FSD_STRUCTURE.md` | +27줄 수준 변경 |
| 신규 | `docs/figma/VEHICLE_LIST_SECTION_INTEGRITY_REPORT.md` | Untracked |

**전체**: 3 files changed, 83 insertions(+), 301 deletions(-) + 신규 파일 1개.

---

## 2. 원격/브랜치 정리

| 원격 이름 | URL | 용도 |
|-----------|-----|------|
| `origin` | https://github.com/Siegfriex/carivdealer1229.git | 기존 저장소 |
| **carivdealder** | https://github.com/Siegfriex/carivdealder.git | 푸시 대상 (0207) |

현재 브랜치 `0207`은 `carivdealder/0207`을 추적 중이므로, 푸시 시 `carivdealder` 원격의 `0207` 브랜치가 갱신된다.

---

## 3. 실행 계획 (아직 실행하지 말 것)

### 3.1 전제

- **전체 스테이징**: 수정 3개 + 신규 1개만 반영 (코드베이스 “전체”가 아니라 현재 변경분만 커밋).
- **강제 푸시**: 원격에 다른 사람이 푸시한 커밋이 있으면 덮어쓰게 됨. 지금은 원격과 동일 커밋이므로, 커밋 후 푸시하면 “강제”가 아니어도 되지만, 계획대로라면 `--force-with-lease` 또는 `--force` 사용 가능.

### 3.2 단계별 명령

```powershell
# 1) 작업 디렉터리 전체 스테이징 (수정 + 신규 포함)
cd c:\carivdealer
git add -A

# 2) 스테이징 결과 확인
git status

# 3) 커밋 (메시지는 필요 시 수정)
git commit -m "docs: API ERD 매핑, Figma IA/FSD 구조, 글로벌 플랜 정리 및 차량 리스트 섹션 무결성 보고서 추가"

# 4) 원격 최신 0207 다시 fetch (푸시 직전 상태 확인)
git fetch carivdealder 0207

# 5) 푸시
# 옵션 A: 일반 푸시 (원격에 새 커밋 없으면 이걸로 충분)
git push carivdealder 0207

# 옵션 B: 강제 푸시 (원격 0207을 로컬로 덮어쓸 때)
git push carivdealder 0207 --force-with-lease
# 또는 (덮어쓰기 확실)
# git push carivdealder 0207 --force
```

### 3.3 “전체 코드베이스”를 정말 전부 스테이징하는 경우

- 이미 모든 변경은 위 4개 파일뿐이므로 `git add -A`가 곧 “현재 코드베이스에서 변경된/추가된 전체”와 동일하다.
- 다른 디렉터리에 미추적/수정이 더 있으면 `git add -A`가 그대로 모두 스테이징한다.

---

## 4. 실행 전 체크리스트

- [ ] `docs/` 변경만 반영할지, 코드 변경도 포함할지 확인
- [ ] 커밋 메시지 확정
- [ ] 원격 `carivdealder` 0207 브랜치를 덮어써도 되는지 확인 (협업 시)
- [ ] 푸시 후 `carivdealder/0207`에서 브랜치/파일 목록 한 번 확인

---

## 5. 요약

| 항목 | 내용 |
|------|------|
| 0207과 원격 차이 | 커밋 동일. 차이는 **미커밋 4개 파일** (수정 3 + 신규 1) |
| 스테이징 범위 | `git add -A` → 위 4개 파일 |
| 푸시 대상 | `carivdealder` 원격, 브랜치 `0207` |
| 강제 푸시 필요성 | 현재는 원격과 같은 커밋이므로, 1개 커밋 올린 뒤 일반 `git push`로 충분. 필요 시에만 `--force-with-lease` 사용 |

이 문서는 **계획만** 반영했으며, 위 명령은 **아직 실행하지 않은 상태**이다.
