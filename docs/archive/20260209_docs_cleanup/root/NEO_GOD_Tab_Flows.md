# NEO GOD 탭별 상세 유저 플로우 (Detailed Tab Flow)

**목적**: 각 주요 탭/메뉴별 상세 플로우. 전역 플로우의 시작/종료 노드와 연동.  
**규칙**: 평행사변형(입출력), 마름모(분기) 엄격 준수. 화면 `[ "/path 화면명" ]`.

---

## Flow ID 목록

| Flow ID | 탭/메뉴 | 전역 연동 노드 |
|---------|---------|----------------|
| TAB_LANDING | 랜딩·로그인·비밀번호찾기 | B, C, E → I |
| TAB_SIGNUP | 회원가입 step1~complete | D, F, G, H → I |
| TAB_VEHICLE | 차량 목록·등록·상세·일반판매·경매 | J → T1 |
| TAB_INSPECTION | 검차 목록·신청·진행·내역 | K → T2 |
| TAB_OFFERS | 일반판매 제안 목록 | L |
| TAB_LOGISTICS | 탁송 일정·내역 | M, N |
| TAB_SALES | 판매이력 | O |
| TAB_SETTLEMENTS | 정산 목록·상세 | P → T3 |

---

## TAB_LANDING: 랜딩·로그인·비밀번호찾기

**전역 연동**: 시작 노드 B["/ 랜딩"], C["/login"], E["/forgot-password"]. 종료 노드 I["/dashboard"].

```mermaid
flowchart TB
    B["/ 랜딩"]
    C["/login 로그인"]
    E["/forgot-password 비밀번호 찾기"]
    I["/dashboard 대시보드"]
    I1[/"CTA 클릭: 로그인 또는 회원가입"/]
    I2[/"이메일, 비밀번호 입력"/]
    I3[/"이메일 입력"/]
    D1{"로그인 성공?"}
    D2{"이메일 존재?"}
    O1[\"세션·대시 이동"\]
    O2[\"에러 메시지"\]
    O3[\"재설정 메일 안내"\]

    B --> I1
    I1 --> C
    I1 --> E
    C --> I2
    I2 --> D1
    D1 -->|예| O1
    O1 --> I
    D1 -->|아니오| O2
    O2 --> C
    C --> E
    E --> I3
    I3 --> D2
    D2 -->|예| O3
    D2 -->|아니오| O2
```

---

## TAB_SIGNUP: 회원가입 step1~complete

**전역 연동**: 시작 D, F~H. 종료 I.

```mermaid
flowchart TB
    D["/signup 회원가입 진입"]
    F["/signup/step1~5"]
    G["/signup/pending"]
    H["/signup/complete"]
    I["/dashboard 대시보드"]
    I1[/"step1: 사업자·정보"/]
    I2[/"step2: 인증 서류"/]
    I3[/"step3: 정산 정보"/]
    I4[/"step4~5: 약관·확인"/]
    D1{"유효성 통과?"}
    D2{"승인 대기/완료"}

    D --> F
    F --> I1
    I1 --> D1
    D1 -->|아니오| F
    D1 -->|예| I2
    I2 --> I3
    I3 --> I4
    I4 --> G
    G --> D2
    D2 --> H
    H --> I
```

---

## TAB_VEHICLE: 차량 목록·등록·상세·일반판매·경매

**전역 연동**: 시작 J. 종료 T1(차량 등록 완료). 차량 상세에서 판매방식 분기 후 일반판매/경매 각각 완료 노드.

### 차량 등록 (진입 → step1 → step2 → complete)

```mermaid
flowchart TB
    S0["/vehicles/new 진입"]
    S1["/vehicles/new/step1"]
    S2["/vehicles/new/step2"]
    S3["/vehicles/:id/complete 등록완료"]
    I1[/"차량번호·진입"/]
    I2[/"등록원부 업로드·기본정보"/]
    I3[/"판매방식·추가정보"/]
    D1{"step1 유효?"}
    D2{"step2 유효?"}
    O1[\"등록완료·차량 ID"\]
    O2[\"에러 메시지"\]

    S0 --> I1
    I1 --> S1
    S1 --> I2
    I2 --> D1
    D1 -->|아니오| S1
    D1 -->|예| S2
    S2 --> I3
    I3 --> D2
    D2 -->|아니오| S2
    D2 -->|예| O1
    O1 --> S3
    S3(("완료"))
```

### 차량 상세 → 판매방식 분기

```mermaid
flowchart TB
    S0["/vehicles/:id 차량상세"]
    D{"판매 방식 선택"}
    S1["/vehicles/:id/sale/* 일반판매"]
    S2["/vehicles/:id/auction/* 경매"]

    S0 --> D
    D -->|일반판매| S1
    D -->|경매| S2
```

### 일반판매 (analyzing → price → complete)

```mermaid
flowchart TB
    A["/vehicles/:id 차량상세"]
    B["/vehicles/:id/sale/analyzing 분석중"]
    C["/vehicles/:id/sale/price 가격입력"]
    D["/vehicles/:id/sale/complete 제안완료"]
    I1[/"일반판매 선택"/]
    I2[/"희망가·메모 입력"/]
    D1{"분석 완료?"}
    D2{"가격 제출?"}
    O1[\"AI 분석 결과"\]
    O2[\"제안 등록 완료"\]

    A --> I1
    I1 --> B
    B --> D1
    D1 -->|예| C
    D1 -->|아니오| B
    C --> I2
    I2 --> D2
    D2 -->|예| O2
    O2 --> D
    D(("완료"))
    B --> O1
```

### 경매 (auction → start-price → duration → complete)

```mermaid
flowchart TB
    S1["/vehicles/:id/auction 경매 상세"]
    S2["/vehicles/:id/auction/start-price 시작가"]
    S3["/vehicles/:id/auction/duration 경매기간"]
    S4["/vehicles/:id/auction/complete 경매등록완료"]
    I1[/"경매 선택"/]
    I2[/"시작가 입력"/]
    I3[/"경매 기간(일) 입력"/]
    D1{"시작가 유효?"}
    D2{"기간 유효?"}
    O1[\"경매 ID·상태"\]

    S1 --> I1
    I1 --> S2
    S2 --> I2
    I2 --> D1
    D1 -->|아니오| S2
    D1 -->|예| S3
    S3 --> I3
    I3 --> D2
    D2 -->|아니오| S3
    D2 -->|예| O1
    O1 --> S4
    S4(("완료"))
```

---

## TAB_INSPECTION: 검차 목록·신청·진행·내역

**전역 연동**: 시작 K. 종료 T2(검차 신청 완료).

```mermaid
flowchart TB
    S1["/inspections/request 랜딩"]
    S2["/inspections/request/step1"]
    S3["/inspections/request/step2"]
    S4["/inspections 목록"]
    S5["/inspections/:id/progress 진행"]
    S6["/inspections/:id/complete 완료"]
    I1[/"검색(차량번호/모델명)"/]
    I2[/"검차 대상·일정 선택"/]
    I3[/"신청 정보 확인·제출"/]
    D1{"임시저장?"}
    D2{"제출?"}
    D3{"진행 상태"}
    O1[\"검차 신청 ID·상태"\]
    O2[\"진행 단계 표시"\]
    O3[\"검차 완료 리포트"\]

    S1 --> I1
    I1 --> D1
    D1 -->|예| S4
    D1 -->|아니오| S2
    S2 --> I2
    I2 --> S3
    S3 --> I3
    I3 --> D2
    D2 -->|제출| O1
    O1 --> S4
    S4 --> D3
    D3 -->|진행중| S5
    D3 -->|완료| S6
    S5 --> O2
    S6 --> O3
    S6(("완료"))
```

---

## TAB_OFFERS: 일반판매 제안 목록 (수락/거절)

**전역 연동**: 시작 L.

```mermaid
flowchart TB
    L["/offers 일반판매제안"]
    I1[/"제안 목록 조회"/]
    I2[/"수락 또는 거절 선택"/]
    D1{"수락/거절?"}
    O1[\"처리 결과 메시지"\]

    L --> I1
    I1 --> L
    L --> I2
    I2 --> D1
    D1 -->|수락| O1
    D1 -->|거절| O1
    O1 --> L
```

---

## TAB_LOGISTICS: 탁송 일정·내역

**전역 연동**: 시작 M, N.

```mermaid
flowchart TB
    M["/logistics/schedule 일정"]
    N["/logistics/history 내역"]
    I1[/"일정 조회 조건·예약 입력"/]
    I2[/"PIN 입력(인계 승인)"/]
    O1[\"탁송 일정·상태 테이블"\]
    O2[\"인계 완료 확인"\]

    M --> I1
    I1 --> O1
    N --> O1
    N --> I2
    I2 --> O2
    O2 --> N
```

---

## TAB_SALES: 판매이력

**전역 연동**: 시작 O.

```mermaid
flowchart TB
    O["/sales/history 판매이력"]
    I1[/"기간·필터 조회"/]
    O1[\"판매 목록"\]

    O --> I1
    I1 --> O1
    O1 --> O
```

---

## TAB_SETTLEMENTS: 정산 목록·상세

**전역 연동**: 시작 P. 종료 T3(정산 상세 조회 완료).

```mermaid
flowchart TB
    T1["/settlements 목록"]
    T2["/settlements/:id 상세"]
    I1[/"기간·필터"/]
    I2[/"상세 행 클릭"/]
    O1[\"정산 목록"\]
    O2[\"정산 상세 금액"\]

    T1 --> I1
    I1 --> O1
    O1 --> T1
    T1 --> I2
    I2 --> T2
    T2 --> O2
    O2 --> T2
    T2(("상세 조회 완료"))
```
