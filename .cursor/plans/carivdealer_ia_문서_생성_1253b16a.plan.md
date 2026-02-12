---
name: CarivDealer IA 문서 생성
overview: VID와 FSD_IA_NODEID_SSOT를 베이스로, 실제 코드베이스·mcp_outputs 노드와 1:1 대응되는 FRD 수준의 CarivDealer_IA 메인 문서를 생성. 공식 IA·FRD 보편 구조를 웹 그라운딩하고 IA_SITEMAP_SPEC_IPOE의 I·P·O·E 서술 방식을 벤치마크.
todos: []
isProject: false
---

# CarivDealer_IA 문서 생성 플랜

## 1. 목적·범위


| 항목        | 내용                                                                                                          |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| **산출물**   | `docs/CarivDealer_IA.md` — 단일 IA 메인 문서                                                                      |
| **기준**    | [CarivDealer_VID.md](docs/CarivDealer_VID.md) §4, [FSD_IA_NODEID_SSOT.md](docs/figma/FSD_IA_NODEID_SSOT.md) |
| **필수 포함** | 실제 코드베이스 기준 플로우·사이트맵, 정보구조, 태스크 플로우, FRD 수준 페이지/스크린별 설명, mcp_outputs 노드 대응                                  |


---

## 2. 문서 구조 (인덱스)

공식 IA·FRD·기존 문서를 조합한 구조:


| 절   | 제목                | 내용                             | 참조                                           |
| --- | ----------------- | ------------------------------ | -------------------------------------------- |
| §0  | 메타데이터·선언          | 버전, 데이터 소스, 기준 문서              | VID §0                                       |
| §1  | 개요                | 목적, 범위, 아키텍처 원칙                | FRD Introduction, NN/G IA                    |
| §2  | 정보구조 (IA)         | 계층·사이트맵, 분류체계, 네비게이션           | NN/G IA, IA_SITEMAP §3                       |
| §3  | 전체 플로우·태스크 플로우    | 전역 플로우(Mermaid), CTA별 플로우      | IA_SITEMAP §2, SITEMAP_IMPLEMENTATION_STATUS |
| §4  | 라우트·사이트맵 매핑       | router.tsx 기준 URL ↔ 페이지 ↔ 노드   | VID §4, FSD_IA_NODEID_SSOT §1                |
| §5  | 페이지·스크린별 명세 (FRD) | 각 페이지 I·P·O·E + mcp_outputs 대응 | IA_SITEMAP §4, FRD Screen Spec               |
| §6  | 노드 인덱스            | mcp_outputs 43개 → 페이지·라우트 역매핑  | FSD_IA_NODEID_SSOT §4                        |
| §7  | 참조·추적성            | API·ERD·FIGMASCR·Figma URL     | FSD_IA_NODEID_SSOT §7                        |


---

## 3. §5 페이지·스크린별 명세 템플릿 (FRD 벤치마크)

기존 [IA_SITEMAP_SPEC_IPOE.md](docs/figma/IA_SITEMAP_SPEC_IPOE.md) §4.x I·P·O·E 패턴 + FRD "Input/Behavior/Output" 확장:

```markdown
### 5.X {페이지명} — {라우트}

| 구분 | 내용 |
|------|------|
| **I** | 진입: `{URL}`. 전제: {인증 등}. 입력: {쿼리·파라미터}. |
| **P** | {처리 로직·API·상태 전환}. |
| **O** | 화면: {출력 요소}. |
| **E** | {예외·에러·빈 상태}. |

**코드**: `{페이지 컴포넌트}` | `{import 경로}`

**mcp_outputs 노드 대응**

| nodeId | IA 라벨 | 동일 페이지 내 변형/상태 |
|--------|---------|--------------------------|
| {id} | {라벨} | {쿼리·탭·모달 등} |

**참조**: API §x, ERD §x
```

- **누락 방지**: router.tsx의 모든 Route를 §5에 1:1 매핑. mcp_outputs에 없는 페이지(회원가입, 로그인 등)는 "nodeId: —" 표기.

---

## 4. 데이터 소스·매핑 전략


| 소스                                                                        | 용도                                                   |
| ------------------------------------------------------------------------- | ---------------------------------------------------- |
| [router.tsx](src/app/router.tsx)                                          | 라우트·페이지 목록 (공개 11, 보호 30, 폴백 1)                      |
| [FSD_IA_NODEID_SSOT.md](docs/figma/FSD_IA_NODEID_SSOT.md) §4              | nodeId 43개 → 페이지·라우트 매핑                              |
| [mcp_outputs/](docs/figmaMCP/mcp_outputs/)                                | metadata_raw.txt, design_context_raw.txt — 스크린 설명 보강 |
| [IA_SITEMAP_SPEC_IPOE.md](docs/figma/IA_SITEMAP_SPEC_IPOE.md)             | I·P·O·E 문구·API·ERD 참조                                |
| [SITEMAP_IMPLEMENTATION_STATUS.md](docs/SITEMAP_IMPLEMENTATION_STATUS.md) | 구현 현황·미구현 구간                                         |


---

## 5. 실행 순서 (TODO)

1. **§0~§1** 문서 헤더·개요 작성
2. **§2** 정보구조 — VID §4 + FSD_IA_NODEID_SSOT §1 기반 사이트맵 계층표
3. **§3** 플로우 — IA_SITEMAP §2 Mermaid 기반 전역 플로우, CTA별 태스크 플로우(Mermaid)
4. **§4** 라우트 매핑 — VID §4 테이블 + nodeId 열 추가
5. **§5** 페이지별 명세 — router.tsx 41개 페이지 순회, 각각 I·P·O·E + mcp_outputs 대응 표 작성
6. **§6** 노드 인덱스 — FSD_IA_NODEID_SSOT §4 역순 정리 (nodeId → 페이지)
7. **§7** 참조·추적성 — API·ERD·FIGMASCR·Figma URL 정리
8. **검증** — router.tsx Route 수 = §5 항목 수, mcp_outputs 43개 = §6 항목 수

---

## 6. 웹 그라운딩 요약 (벤치마크)


| 출처                                                                                                                                       | 반영 내용                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [NN/G: IA vs Sitemaps](https://www.nngroup.com/articles/information-architecture-sitemaps/)                                              | IA = 구조·분류·네이밍; 사이트맵 = IA의 시각화 도구. §2 정보구조에 terminology·navigation 포합               |
| FRD 표준                                                                                                                                   | Purpose, Scope, Functional Requirements(Input/Process/Output/Exception) — §5 템플릿 적용 |
| [Zeroheight: IA for Documentation](https://zeroheight.com/help/guides/how-to-structure-your-documentations-information-architecture-ia/) | 포트폴리오 매핑, 마찰점 식별 — §3 플로우에 CTA별 분기·예외 반영                                            |
| [Balsamiq: IA and Sitemaps](https://balsamiq.com/learn/learning-tracks/how-to-design-navigation/information-architecture-sitemaps)       | 계층·Priority·Ontology — §2 사이트맵 계층표에 반영                                              |


---

## 7. 산출물 예시 (§5 한 페이지)

```markdown
### 5.12 판매방식선택 — /vehicles/:vehicleId/sale/analyzing

| 구분 | 내용 |
|------|------|
| **I** | 진입: `/vehicles/:vehicleId/sale/analyzing`. 전제: 로그인, 차량 등록 완료. 입력: vehicleId (path). |
| **P** | 일반판매/경매 카드 선택 → 시세분석 또는 경매 설정으로 분기. |
| **O** | 화면: SaleMethodCards(일반판매·경매), ProgressSidebar. |
| **E** | vehicleId 없음 시 FALLBACK_ROUTE. |

**코드**: `GeneralSaleAnalyzingPage` | `@/pages/admin/sale/GeneralSaleAnalyzingPage`

**mcp_outputs 노드 대응**

| nodeId | IA 라벨 | 비고 |
|--------|---------|------|
| 794-3704 | 판매방식선택 | 동일 |
| 794-4015 | 시세분석중 (일반/경매 공통) | 로딩 상태 |

**참조**: CarivDealer_api_v1 §3, CarivDealer_API_ERD_Mapping 차량·판매
```

---

## 8. 파일·의존성


| 파일                                      | 역할                        |
| --------------------------------------- | ------------------------- |
| `docs/CarivDealer_IA.md`                | 신규 생성 (메인 산출물)            |
| `docs/CarivDealer_VID.md`               | §4 라우트·페이지 매핑 출처          |
| `docs/figma/FSD_IA_NODEID_SSOT.md`      | §4 노드 매핑·§6 인덱스 출처        |
| `docs/figma/IA_SITEMAP_SPEC_IPOE.md`    | I·P·O·E 문구·플로우·참조 API/ERD |
| `docs/SITEMAP_IMPLEMENTATION_STATUS.md` | 구현·미구현 구간                 |


---

## 9. 예상 작업량


| 단계           | 예상 소요    | 비고                   |
| ------------ | -------- | -------------------- |
| §0~§4        | 30분      | 기존 문서 복합·정리          |
| §5 (41개 페이지) | 60~90분   | 페이지별 I·P·O·E + 노드 대응 |
| §6~§7        | 15분      | 인덱스·참조               |
| 검증           | 10분      | 수치·매핑 일치             |
| **합계**       | **~2시간** |                      |


