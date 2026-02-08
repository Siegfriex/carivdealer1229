# ForwardMax (carivdealder) 스크린 플로우차트

**프로젝트**: B2B 중고차 수출 플랫폼  
**문서 목적**: 화면 전환·입력·출력·결정을 Mermaid 차트로 통일된 기호 체계로 표현

---

## 1. 공통 기호 체계 (인포그래픽 기준)

| 기호 | Mermaid 노드 | 의미 | 사용 예 |
|------|--------------|------|---------|
| **시작/종료** | `( )` rounded | 플로우 시작 또는 종료 | 진입점, 완료 화면 |
| **화면(스크린)** | `[ ]` rectangle | 사용자가 보는 페이지 | 라우트 단위 화면 |
| **결정** | `{ }` diamond | 조건 분기(예/아니오) | 검증, 선택, 승인 여부 |
| **입력** | `[/ /]` parallelogram-left | 사용자/시스템 입력 | 폼 입력, 업로드, API 요청 파라미터 |
| **출력** | `[\ \]` parallelogram-right | 시스템/화면 출력 | 저장 결과, API 응답, 표시 데이터 |
| **프로세스** | `[ ]` rectangle | 백그라운드 처리 | 검증, 저장, 연산 |
| **외부/서브** | `[[ ]]` subroutine | 외부 시스템·하위 플로우 | Firebase, Gemini OCR, 정산 배치 |

**플로우 방향**: 위→아래 또는 좌→우. 화살표에 라벨(`|레이블|`)로 입력/출력/조건을 명시.

---

## 2. 앱 전체 스크린 맵 (High-Level)

```mermaid
flowchart TB
    subgraph 외부["🖥️ 진입"]
        A((시작))
    end

    subgraph 공개["공개 영역"]
        B[("/" 랜딩)]
        C["/login 로그인"]
        D["/signup 회원가입 진입"]
        E["/forgot-password 비밀번호 찾기"]
    end

    subgraph 인증["인증 플로우"]
        F["/signup/step1~5"]
        G["/signup/pending"]
        H["/signup/complete"]
    end

    subgraph 어드민["어드민(인증 후)"]
        I["/dashboard 대시보드"]
        J["/vehicles 차량 목록"]
        K["/inspections 검차"]
        L["/offers 일반판매제안"]
        M["/logistics 탁송"]
        N["/sales/history 판매이력"]
        O["/settlements 정산"]
    end

    A --> B
    B --> C
    B --> D
    C --> E
    D --> F
    F --> G --> H
    C --> I
    H --> I
    I --> J
    I --> K
    I --> L
    I --> M
    I --> N
    I --> O
```

---

## 3. 랜딩·로그인 플로우 (입출력·결정 포함)

```mermaid
flowchart TB
    subgraph 입력["입력"]
        I1[/"랜딩: CTA 클릭(로그인/회원가입)"/]
        I2[/"로그인: 이메일, 비밀번호"/]
        I3[/"비밀번호 찾기: 이메일"/]
    end

    subgraph 화면["화면"]
        S1(("진입"))
        S2["/ 랜딩"]
        S3["/login 로그인"]
        S4["/signup 회원가입 진입"]
        S5["/forgot-password 비밀번호 찾기"]
        S6["/dashboard 대시보드"]
        S7["/signup/step1"]
    end

    subgraph 결정["결정"]
        D1{"로그인 성공?"}
        D2{"이메일 존재?"}
    end

    subgraph 출력["출력"]
        O1[\"세션·토큰 저장"\]
        O2[\"에러 메시지 표시"\]
        O3[\"재설정 메일 발송 안내"\]
    end

    S1 --> S2
    S2 --> I1
    I1 --> S3
    I1 --> S4
    S3 --> I2
    I2 --> D1
    D1 -->|예| O1
    O1 --> S6
    D1 -->|아니오| O2
    O2 --> S3
    S3 --> S5
    S5 --> I3
    I3 --> D2
    D2 -->|예| O3
    D2 -->|아니오| O2
    S4 --> S7
```

---

## 4. 회원가입 플로우 (스텝·입출력·결정)

```mermaid
flowchart LR
    subgraph 화면["화면(스크린)"]
        A["/signup 진입"]
        B["/signup/step1"]
        C["/signup/step2"]
        D["/signup/step3"]
        E["/signup/step4"]
        F["/signup/step5"]
        G["/signup/pending"]
        H["/signup/complete"]
    end

    subgraph 입력["주요 입력"]
        I1[/"step1: 사업자 정보"/]
        I2[/"step2: 인증 서류"/]
        I3[/"step3: 정산 정보"/]
        I4[/"step4~5: 기타 약관·확인"/]
    end

    subgraph 결정["결정"]
        D1{"유효성 검증 통과?"}
        D2{"승인 대기/완료"}
    end

    A --> B
    B --> I1
    I1 --> D1
    D1 -->|예| C
    D1 -->|아니오| B
    C --> I2
    I2 --> D1
    D1 -->|예| D
    D --> I3
    I3 --> E
    E --> F
    F --> I4
    I4 --> G
    G --> D2
    D2 --> H
    H(("완료"))
```

---

## 5. 차량 등록 플로우 (OCR·입출력·결정)

```mermaid
flowchart TB
    subgraph 입력["입력"]
        I1[/"차량번호 입력(진입)"/]
        I2[/"step1: 차량등록원부 업로드·기본정보"/]
        I3[/"step2: 판매방식·추가정보"/]
    end

    subgraph 화면["화면"]
        S0["/vehicles/new 진입"]
        S1["/vehicles/new/step1"]
        S2["/vehicles/new/step2"]
        S3["/vehicles/:id/complete 등록완료"]
    end

    subgraph 결정["결정"]
        D1{"차량번호 형식 OK?"}
        D2{"중복 매물?"}
        D3{"step1 유효?"}
        D4{"step2 유효?"}
    end

    subgraph 프로세스["프로세스"]
        P1[["OCR·Gemini 추출"]]
        P2[["Firebase 저장"]]
    end

    subgraph 출력["출력"]
        O1[\"등록완료·차량 ID"\]
        O2[\"에러 메시지"\]
    end

    S0 --> I1
    I1 --> D1
    D1 -->|아니오| O2
    D1 -->|예| D2
    D2 -->|예| O2
    D2 -->|아니오| S1
    S1 --> I2
    I2 --> P1
    P1 --> D3
    D3 -->|아니오| S1
    D3 -->|예| S2
    S2 --> I3
    I3 --> D4
    D4 -->|아니오| S2
    D4 -->|예| P2
    P2 --> O1
    O1 --> S3
    S3(("완료"))
```

---

## 6. 검차 신청 플로우 (입출력·결정)

```mermaid
flowchart TB
    subgraph 입력["입력"]
        I1[/"검차 신청 랜딩: 검색(차량번호/모델명)"/]
        I2[/"step1: 검차 대상·일정 선택"/]
        I3[/"step2: 신청 정보 확인·제출"/]
    end

    subgraph 화면["화면"]
        S1["/inspections/request 랜딩"]
        S2["/inspections/request/step1"]
        S3["/inspections/request/step2"]
        S4["/inspections 목록"]
        S5["/inspections/:id/progress 진행"]
        S6["/inspections/:id/complete 완료"]
    end

    subgraph 결정["결정"]
        D1{"임시저장?"}
        D2{"신청 제출?"}
        D3{"진행 상태"}
    end

    subgraph 출력["출력"]
        O1[\"검차 신청 ID·상태"\]
        O2[\"진행 단계 표시"\]
        O3[\"검차 완료 리포트"\]
    end

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
```

---

## 7. 일반 판매 제안 플로우 (입출력·결정)

```mermaid
flowchart LR
    subgraph 화면["화면"]
        A["/vehicles/:id 차량상세"]
        B["/vehicles/:id/sale/analyzing 분석중"]
        C["/vehicles/:id/sale/price 가격입력"]
        D["/vehicles/:id/sale/complete 제안완료"]
    end

    subgraph 입력["입력"]
        I1[/"일반판매 선택"/]
        I2[/"희망가·메모 입력"/]
    end

    subgraph 결정["결정"]
        D1{"분석 완료?"}
        D2{"가격 제출?"}
    end

    subgraph 출력["출력"]
        O1[\"AI 분석 결과"\]
        O2[\"제안 등록 완료"\]
    end

    A --> I1
    I1 --> B
    B --> D1
    D1 -->|예| C
    C --> I2
    I2 --> D2
    D2 -->|예| O2
    O2 --> E
    E(("완료"))
    B --> O1
```

---

## 8. 경매 플로우 (입출력·결정)

```mermaid
flowchart TB
    subgraph 화면["화면"]
        S1["/vehicles/:id/auction 경매 상세"]
        S2["/vehicles/:id/auction/start-price 시작가"]
        S3["/vehicles/:id/auction/duration 경매기간"]
        S4["/vehicles/:id/auction/complete 경매등록완료"]
    end

    subgraph 입력["입력"]
        I1[/"경매 선택"/]
        I2[/"시작가 입력"/]
        I3[/"경매 기간(일) 입력"/]
    end

    subgraph 결정["결정"]
        D1{"시작가 유효?"}
        D2{"기간 유효?"}
    end

    subgraph 출력["출력"]
        O1[\"경매 ID·상태"\]
    end

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

## 9. 탁송·정산 플로우 (스크린 단위)

```mermaid
flowchart TB
    subgraph 탁송["탁송"]
        L1["/logistics/schedule 일정"]
        L2["/logistics/history 이력"]
    end

    subgraph 정산["정산"]
        T1["/settlements 목록"]
        T2["/settlements/:id 상세"]
    end

    subgraph 입력["입력"]
        I1[/"일정 조회 조건"/]
        I2[/"정산 기간·필터"/]
    end

    subgraph 출력["출력"]
        O1[\"탁송 일정·상태 테이블"\]
        O2[\"정산 목록·상세 금액"\]
    end

    L1 --> I1
    I1 --> O1
    L2 --> O1
    T1 --> I2
    I2 --> O2
    T1 --> T2
    T2 --> O2
```

---

## 10. 차량 상세 → 판매방식 분기 (단일 결정 플로우)

```mermaid
flowchart TB
    subgraph 화면["화면"]
        S0["/vehicles/:id 차량상세"]
        S1["일반판매 플로우"]
        S2["경매 플로우"]
    end

    D{"판매 방식 선택"}
    S0 --> D
    D -->|일반판매| S1
    D -->|경매| S2
    S1 --> A["/vehicles/:id/sale/*"]
    S2 --> B["/vehicles/:id/auction/*"]
```

---

## 11. 공통 기호 요약 (복사용 스니펫)

- **시작**: `(("시작"))`
- **종료**: `(("완료"))`
- **화면**: `["/path 화면명"]`
- **결정**: `{"조건?"}`
- **입력**: `[/"입력 설명"/]`
- **출력**: `[\"출력 설명"\]
- **프로세스**: `[["처리명"]]`

이 문서는 라우트·화면 단위로만 구성되어 있으며, 실제 API·상태(React Query 등)는 코드 기준으로 보완하면 됩니다.
