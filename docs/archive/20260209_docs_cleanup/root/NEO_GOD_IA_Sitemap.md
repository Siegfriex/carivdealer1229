# NEO GOD IA(정보 구조) 및 사이트맵

**목적**: 계층형 정보 구조와 전체 라우트 트리. 정의된 IA([figma/FIGMA_IA_FSD_STRUCTURE.md](figma/FIGMA_IA_FSD_STRUCTURE.md), [figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md](figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md)) 기준 11섹션·87프레임·라우트 매핑.

**참조**: [archive/FIGMA_SCR_ROUTE_MAP.md](archive/FIGMA_SCR_ROUTE_MAP.md) SCR↔경로, [figma/FIGMA_11_SECTIONS_TO_APP_MAP.md](figma/FIGMA_11_SECTIONS_TO_APP_MAP.md).

---

## 1. IA (정보 구조) 계층

```
1. 공개 (§3.1, §3.2)
   ├── /                          랜딩 (§3.1, 3프레임)
   ├── /login                     로그인 (SCR-0001)
   ├── /signup                    회원가입 진입 (SCR-0002)
   │   ├── /signup/step1          본인인증 (1513:12032)
   │   ├── /signup/step2          사업자 정보 (1425:7309)
   │   ├── /signup/step3          중고차 매매업 인증 (1513:11607)
   │   ├── /signup/step4          정산 정보 (1425:7445)
   │   ├── /signup/step5          약관 동의 (1425:7514)
   │   ├── /signup/pending        승인 대기 (SCR-0003-1)
   │   └── /signup/complete       승인 완료 (SCR-0003-2)
   └── /forgot-password           비밀번호 찾기

2. 인증 후 — 어드민 (§3.3)
   └── /dashboard                 대시보드 (SCR-0100, 1418:25059)

3. 대시보드 하위 (§3.4~§3.11)
   ├── 차량 (§3.4, §3.5)
   │   ├── /vehicles                          차량 목록 (13프레임, 쿼리: filter/view/q/page/sort)
   │   ├── /vehicles/new                      차량 등록 진입
   │   ├── /vehicles/new/step1, step2         차량 등록 step
   │   ├── /vehicles/:id                      차량 상세 (§3.5)
   │   ├── /vehicles/:id/complete             차량 등록 완료
   │   ├── 일반 판매 (§3.7)
   │   │   ├── /vehicles/:id/sale/analyzing   원부 등록·시세 분석
   │   │   ├── /vehicles/:id/sale/price       가격 설정
   │   │   └── /vehicles/:id/sale/complete    일반 판매 완료
   │   └── 경매 (§3.9)
   │       ├── /vehicles/:id/auction
   │       ├── /vehicles/:id/auction/start-price
   │       ├── /vehicles/:id/auction/duration
   │       └── /vehicles/:id/auction/complete
   ├── 검차 (§3.6)
   │   ├── /inspections                       검차 목록
   │   ├── /inspections/request               검차 신청 랜딩
   │   ├── /inspections/request/step1, step2  검차 신청 step
   │   ├── /inspections/:id/progress          검차 진행
   │   ├── /inspections/:id/complete          검차 결과
   │   └── /inspections/history               검차 내역 (tab/view 쿼리)
   ├── 오퍼·마이페이지 (§3.8)
   │   ├── /offers                            오퍼 목록
   │   └── /mypage/*
   │       ├── /mypage/profile                내 프로필
   │       ├── /mypage/profile/edit           기본 정보 수정
   │       ├── /mypage/account/password       비밀번호 변경
   │       ├── /mypage/profile/approval       딜러 승인 상태
   │       ├── /mypage/profile/business       사업자 정보
   │       ├── /mypage/settlement-account     정산 계좌
   │       ├── /mypage/notifications          알림 센터·설정
   │       └── /mypage/support                고객 지원/FAQ
   ├── 탁송 (§3.10)
   │   ├── /logistics/schedule                탁송 스케줄·예약
   │   ├── /logistics/history                 탁송 내역
   │   ├── /logistics/request                 탁송 신청
   │   └── /logistics/:id                     탁송 상세·완료
   ├── 정산 (§3.11)
   │   ├── /settlements                       정산 목록
   │   ├── /settlements/:id                   정산 상세
   │   └── /sales/history                     판매·매출 내역
   └── (폴백) * → /dashboard
```

---

## 2. SCR ↔ 경로 매핑 (요약)

| Screen ID | 경로 | 화면 명칭 | Figma IA § |
|-----------|------|-----------|------------|
| SCR-0000 | / | 랜딩 페이지 | §3.1 |
| SCR-0001 | /login | 로그인 | §3.2 |
| SCR-0002 | /signup | 회원가입 진입 | §3.2 |
| SCR-0002-1 | /signup/step5 | 회원가입 약관 | §3.2 |
| SCR-0002-2 | /signup/step1~4 | 회원가입 정보·서류·인증·정산 | §3.2 |
| SCR-0003 | /signup/step3 | 사업자·중고차 매매업 인증 | §3.2 |
| SCR-0003-1 | /signup/pending | 승인 대기 | §3.2 |
| SCR-0003-2 | /signup/complete | 승인 완료 | §3.2 |
| — | /forgot-password | 비밀번호 찾기 | §3.2 |
| SCR-0100 | /dashboard | 딜러 대시보드 | §3.3 |
| SCR-0101 | /vehicles | 차량 목록 | §3.4 |
| SCR-0102 | /offers | 일반 판매 제안(오퍼) 목록 | §3.8 |
| SCR-0103 | /sales/history | 판매 내역 | §3.11 |
| SCR-0104 | /settlements | 정산 목록 | §3.11 |
| SCR-0105 | /settlements/:id | 정산 상세 | §3.11 |
| SCR-0200 | /vehicles/new, step1, step2, /vehicles/:id/complete | 차량 등록 | §3.5 |
| SCR-0200-Draft | /vehicles?filter=draft | 임시 저장 목록 | §3.4 |
| SCR-0201 | /inspections/request, step1, step2 | 검차 신청 | §3.6 |
| SCR-0201-Progress | /inspections/:id/progress | 검차 진행 | §3.6 |
| SCR-0202 | /inspections/history, /inspections/:id/complete | 검차 내역·결과 | §3.6 |
| SCR-0300 | /vehicles/:id | 차량 상세·판매 방식 선택 | §3.5 |
| SCR-0301-N~0303-N | /vehicles/:id/sale/analyzing, price, complete | 일반 판매 | §3.7 |
| SCR-0400~0403-A | /vehicles/:id/auction, start-price, duration, complete | 경매 | §3.9 |
| — | /mypage/* | 마이페이지(프로필·계정·승인·정산계좌·알림·문의) | §3.8 |
| SCR-0600 | /logistics/schedule | 탁송 스케줄·예약 | §3.10 |
| SCR-0601 | /logistics/history | 탁송 내역 | §3.10 |

---

## 3. 플로우차트 규칙 (Mermaid)

- **진입·종료**: 모든 플로우는 `([Start])` 한 개, `([End])` 한 개 이상으로 명시. 진입은 항상 Start, 종료는 End 또는 다중 End(분기별).
- **도형**:  
  - **시작/종료**: `([텍스트])` — 타원(캡슐).  
  - **판단(분기)**: `{텍스트}` — 마름모.  
  - **처리/화면**: `[텍스트]` — 사각형.  
  - **입력**: `[/텍스트/]` — 평행사변형.  
  - **서버/API**: `["텍스트"]` — 사각형(이중꺾쇠).
- **색상**(Figma 디자인 토큰 기준):  
  - **Start/End**: Primary `#2048E5` 채우기, 테두리·선 **검은색(#000)**.  
  - **Decision(마름모)**: Accent `#8A38F5` 채우기, 테두리 검은색.  
  - **Task/Process**: 배경 밝은 회색(`#f5f5f5`), 테두리 검은색.
- **선**: **검은색(#000), 실선**. Mermaid 기본 실선 사용, `linkStyle`로 stroke 명시.
- **시간순**: 플로우는 **위→아래(TD)** 또는 **왼쪽→오른쪽(LR)** 으로 시간 순서 유지.

---

## 4. 사이트맵 — 라우트 트리 (Mermaid)

```mermaid
flowchart TD
    Start([Start]):::start
    root["/ 랜딩"]:::task
    login["/login"]:::task
    signup["/signup"]:::task
    signupSteps["/signup/step1~5"]:::task
    pending["/signup/pending"]:::task
    complete["/signup/complete"]:::task
    forgot["/forgot-password"]:::task
    dash["/dashboard"]:::task
    vehicles["/vehicles"]:::task
    vehiclesNew["/vehicles/new"]:::task
    vehiclesId["/vehicles/:id"]:::task
    saleA["/vehicles/:id/sale/analyzing"]:::task
    saleP["/vehicles/:id/sale/price"]:::task
    saleC["/vehicles/:id/sale/complete"]:::task
    auction["/vehicles/:id/auction"]:::task
    auctionSP["/vehicles/:id/auction/start-price"]:::task
    auctionD["/vehicles/:id/auction/duration"]:::task
    auctionC["/vehicles/:id/auction/complete"]:::task
    insp["/inspections"]:::task
    inspReq["/inspections/request"]:::task
    inspReqS1["/inspections/request/step1"]:::task
    inspReqS2["/inspections/request/step2"]:::task
    inspProgress["/inspections/:id/progress"]:::task
    inspComplete["/inspections/:id/complete"]:::task
    inspHistory["/inspections/history"]:::task
    offers["/offers"]:::task
    mypage["/mypage/*"]:::task
    logSchedule["/logistics/schedule"]:::task
    logHistory["/logistics/history"]:::task
    logRequest["/logistics/request"]:::task
    logId["/logistics/:id"]:::task
    settlements["/settlements"]:::task
    settleId["/settlements/:id"]:::task
    sales["/sales/history"]:::task
    End([End]):::end

    Start --> root
    root --> login
    root --> signup
    root --> forgot
    root --> dash
    signup --> signupSteps --> pending --> complete --> dash
    login --> dash
    complete --> dash
    dash --> vehicles
    dash --> insp
    dash --> offers
    dash --> mypage
    dash --> logSchedule
    dash --> logHistory
    dash --> sales
    dash --> settlements
    vehicles --> vehiclesNew
    vehiclesNew --> vehiclesId
    vehicles --> vehiclesId
    vehiclesId --> saleA --> saleP --> saleC --> End
    vehiclesId --> auction --> auctionSP --> auctionD --> auctionC --> End
    insp --> inspReq --> inspReqS1 --> inspReqS2 --> inspProgress
    insp --> inspProgress --> inspComplete
    insp --> inspHistory
    settlements --> settleId
    logSchedule --> logRequest
    logSchedule --> logId
    dash --> End

    classDef start fill:#2048E5,stroke:#000,color:#fff
    classDef end fill:#2048E5,stroke:#000,color:#fff
    classDef task fill:#f5f5f5,stroke:#000
    linkStyle default stroke:#000,stroke-width:1px
```

---

## 5. 사용자 플로우 — 시간순 (진입·종료·분기 명시)

```mermaid
flowchart TD
    Start([진입]):::start
    A1["/ 랜딩"]:::task
    D1{행동 선택}:::decision
    A2["/login 로그인"]:::task
    A3["/signup 회원가입"]:::task
    A4["/forgot-password 비밀번호 찾기"]:::task
    A5["/dashboard 대시보드"]:::task
    D2{메뉴 선택}:::decision
    B1["/vehicles 차량"]:::task
    B2["/inspections 검차"]:::task
    B3["/offers 오퍼"]:::task
    B4["/mypage/* 마이페이지"]:::task
    B5["/logistics 탁송"]:::task
    B6["/settlements 정산"]:::task
    B7["/sales/history 판매내역"]:::task
    End1([종료]):::end

    Start --> A1
    A1 --> D1
    D1 -->|로그인| A2
    D1 -->|회원가입| A3
    D1 -->|비밀번호 찾기| A4
    D1 -->|지금 시작 등| A5
    A2 --> A5
    A3 --> A5
    A4 --> End1
    A5 --> D2
    D2 -->|차량| B1 --> End1
    D2 -->|검차| B2 --> End1
    D2 -->|오퍼| B3 --> End1
    D2 -->|마이페이지| B4 --> End1
    D2 -->|탁송| B5 --> End1
    D2 -->|정산| B6 --> End1
    D2 -->|판매내역| B7 --> End1

    classDef start fill:#2048E5,stroke:#000,color:#fff
    classDef end fill:#2048E5,stroke:#000,color:#fff
    classDef decision fill:#8A38F5,stroke:#000,color:#fff
    classDef task fill:#f5f5f5,stroke:#000
    linkStyle default stroke:#000,stroke-width:1px
```

---

## 6. 인증 플로우 — 회원가입·승인 (시간순)

```mermaid
flowchart TD
    Start([진입]):::start
    Signup["/signup 진입"]:::task
    S1["/signup/step1 본인인증"]:::task
    S2["/signup/step2 사업자"]:::task
    S3["/signup/step3 중고차매매업"]:::task
    S4["/signup/step4 정산정보"]:::task
    S5["/signup/step5 약관"]:::task
    Submit["제출"]:::task
    D{상태}:::decision
    Pending["/signup/pending 승인대기"]:::task
    Complete["/signup/complete 승인완료"]:::task
    Dash["/dashboard 이동"]:::task
    End1([종료]):::end

    Start --> Signup --> S1 --> S2 --> S3 --> S4 --> S5 --> Submit --> D
    D -->|SUBMITTED| Pending --> End1
    D -->|APPROVED 등| Complete --> Dash --> End1

    classDef start fill:#2048E5,stroke:#000,color:#fff
    classDef end fill:#2048E5,stroke:#000,color:#fff
    classDef decision fill:#8A38F5,stroke:#000,color:#fff
    classDef task fill:#f5f5f5,stroke:#000
    linkStyle default stroke:#000,stroke-width:1px
```

---

## 7. 차량·판매 방식 플로우 (시간순)

```mermaid
flowchart TD
    Start([진입]):::start
    List["/vehicles 목록"]:::task
    D1{선택}:::decision
    New["/vehicles/new 등록"]:::task
    Detail["/vehicles/:id 상세"]:::task
    D2{판매방식}:::decision
    SaleA["/vehicles/:id/sale/analyzing"]:::task
    SaleP["/vehicles/:id/sale/price"]:::task
    SaleC["/vehicles/:id/sale/complete"]:::task
    Auction["/vehicles/:id/auction"]:::task
    AucSP["/vehicles/:id/auction/start-price"]:::task
    AucD["/vehicles/:id/auction/duration"]:::task
    AucC["/vehicles/:id/auction/complete"]:::task
    End1([종료]):::end

    Start --> List --> D1
    D1 -->|등록| New --> Detail
    D1 -->|행/카드 클릭| Detail
    Detail --> D2
    D2 -->|일반 판매| SaleA --> SaleP --> SaleC --> End1
    D2 -->|경매| Auction --> AucSP --> AucD --> AucC --> End1

    classDef start fill:#2048E5,stroke:#000,color:#fff
    classDef end fill:#2048E5,stroke:#000,color:#fff
    classDef decision fill:#8A38F5,stroke:#000,color:#fff
    classDef task fill:#f5f5f5,stroke:#000
    linkStyle default stroke:#000,stroke-width:1px
```

---

## 8. 검차 플로우 (시간순)

```mermaid
flowchart TD
    Start([진입]):::start
    List["/inspections 목록"]:::task
    D1{선택}:::decision
    Req["/inspections/request 신청"]:::task
    Step1["/inspections/request/step1"]:::task
    Step2["/inspections/request/step2"]:::task
    Submit["제출 POST /vehicles/:id/inspections"]:::task
    Progress["/inspections/:id/progress 진행"]:::task
    Complete["/inspections/:id/complete 완료"]:::task
    History["/inspections/history 내역"]:::task
    End1([종료]):::end

    Start --> List --> D1
    D1 -->|검차 신청| Req --> Step1 --> Step2 --> Submit --> Progress --> End1
    D1 -->|행 클릭 진행중| Progress --> End1
    D1 -->|행 클릭 완료| Complete --> End1
    D1 -->|내역| History --> End1

    classDef start fill:#2048E5,stroke:#000,color:#fff
    classDef end fill:#2048E5,stroke:#000,color:#fff
    classDef decision fill:#8A38F5,stroke:#000,color:#fff
    classDef task fill:#f5f5f5,stroke:#000
    linkStyle default stroke:#000,stroke-width:1px
```

---

## 9. 사이트맵 (마크다운 목록)

- /
  - /login
  - /signup
  - /signup/step1 ~ step5
  - /signup/pending
  - /signup/complete
  - /forgot-password
  - /dashboard
    - /vehicles
      - /vehicles/new
      - /vehicles/new/step1, step2
      - /vehicles/:id
      - /vehicles/:id/complete
      - /vehicles/:id/sale/analyzing
      - /vehicles/:id/sale/price
      - /vehicles/:id/sale/complete
      - /vehicles/:id/auction
      - /vehicles/:id/auction/start-price
      - /vehicles/:id/auction/duration
      - /vehicles/:id/auction/complete
    - /inspections
    - /inspections/request
    - /inspections/request/step1, step2
    - /inspections/:id/progress
    - /inspections/:id/complete
    - /inspections/history
    - /offers
    - /mypage/profile
    - /mypage/profile/edit
    - /mypage/account/password
    - /mypage/profile/approval
    - /mypage/profile/business
    - /mypage/settlement-account
    - /mypage/notifications
    - /mypage/support
    - /logistics/schedule
    - /logistics/history
    - /logistics/request
    - /logistics/:id
    - /settlements
    - /settlements/:id
    - /sales/history

- **폴백**: `*` → Navigate to /dashboard
