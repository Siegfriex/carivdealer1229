# 04. Parser 서비스 분석

## 4.1 AuctionParserService

**파일**: `src/main/java/cariv/exp/domain/auction/service/AuctionParserService.java`

### 파싱 대상
- **문서 타입**: 경매증 (Auction Certificate)
- **입력 형식**: `UpstageResponse` (Upstage OCR API 응답)
- **출력 형식**: `AuctionParseResult` (AuctionInfo + missingFields)

### 파싱 메서드 분석

#### parse (라인: 62-158)
```java
public AuctionParseResult parse(UpstageResponse json) {
    Map<String, String> map = new HashMap<>();

    List<UpstageElement> tableElements = json.elements().stream()
            .filter(e -> "table".equalsIgnoreCase(e.category()))
            .filter(e -> e.content() != null && e.content().html() != null)
            .toList();

    List<List<String>> allRows = new ArrayList<>();
    for (UpstageElement table : tableElements) {
        allRows.addAll(parseHtmlTable(table.content().html()));
    }
    allRows = uniqueRows(allRows);

    String allText = allRows.stream()
            .flatMap(List::stream)
            .filter(Objects::nonNull)
            .collect(Collectors.joining(" "));

    // 라벨 기반 매칭 로직...
    
    return new AuctionParseResult(info, missing);
}
```

**분석:**
- **입력**: `UpstageResponse json` - Upstage OCR API 응답
- **출력**: `AuctionParseResult` - 파싱 결과 및 누락 필드 목록
- **파싱 전략**:
  1. **HTML 테이블 파싱**: JSoup을 사용하여 HTML 테이블을 행/열로 변환 (라인: 72, 282-297)
  2. **라벨 기반 매칭**: 미리 정의된 라벨 목록과 매칭하여 값 추출 (라인: 30-44)
  3. **정규표현식 패턴**: VIN, 차량번호, 숫자 추출 (라인: 58-60)
  4. **인라인 추출**: 라벨과 값이 같은 셀에 있는 경우 추출 (라인: 171-179)
  5. **전체 텍스트 보강**: 테이블에서 찾지 못한 경우 전체 텍스트에서 정규식으로 재검색 (라인: 130-131)

**파싱 단계:**
1. **전처리 단계** (라인: 65-74):
   - table 카테고리 요소만 필터링
   - HTML 테이블을 행/열 리스트로 변환
   - 중복 행 제거

2. **텍스트 추출 단계** (라인: 76-79):
   - 모든 행의 셀을 하나의 텍스트로 병합

3. **데이터 추출 단계** (라인: 81-128):
   - 각 행의 셀을 순회하며 라벨 매칭
   - 다음 non-blank 셀 또는 인라인 값 추출
   - 추출된 값들을 Map에 저장

4. **보강 단계** (라인: 130-131):
   - registrationNo, chassisNo가 없으면 전체 텍스트에서 정규식으로 재검색

5. **타입 변환 단계** (라인: 133-136):
   - modelYear: Integer 변환 (라인: 199-212)
   - mileage: Long 변환 (라인: 214-223)
   - displacement: Integer 변환 (라인: 225-234)
   - initialRegistrationDate: LocalDate 변환 (라인: 236-254)

6. **검증 단계** (라인: 150-152):
   - 필수 필드 누락 여부 확인

**사용하는 정규표현식 패턴:**
- `VIN_PATTERN`: `[A-HJ-NPR-Z0-9]{17}` - VIN 추출 (라인: 58)
- `PLATE_PATTERN`: `\\b\\d{2,3}[가-힣]\\d{4}\\b` - 차량번호 추출 (라인: 59)
- `FIRST_NUMBER`: `(\\d{1,9})` - 첫 번째 숫자 추출 (라인: 60)

**에러 처리:**
- 파싱 실패 시: 해당 필드는 null로 설정
- 부분 파싱 실패 시: missingFields에 누락 필드 추가 (라인: 150-152)

**사용하는 외부 라이브러리:**
- `org.jsoup.Jsoup` - HTML 파싱 (라인: 8, 286)

**필수 필드:**
- registrationNo, chassisNo, model, modelYear, mileage, displacement, initialRegistrationDate, fuel, color (라인: 46-56)

---

## 4.2 RegistrationParserService

**파일**: `src/main/java/cariv/exp/domain/registration/service/RegistrationParserService.java`

### 파싱 대상
- **문서 타입**: 등록증 (Registration Certificate)
- **입력 형식**: `UpstageResponse`
- **출력 형식**: `RegistrationParseResult` (RegistrationInfo + missingFields)

### 파싱 메서드 분석

#### parse (라인: 62-230)
```java
public RegistrationParseResult parse(UpstageResponse json) {
    Map<String, String> result = new HashMap<>();

    List<UpstageElement> tableElements = json.elements().stream()
            .filter(e -> "table".equalsIgnoreCase(e.category()))
            .filter(e -> {
                if (e.content() == null || e.content().html() == null) return false;
                String html = e.content().html();
                return WARNING_KEYWORDS.stream().noneMatch(html::contains);
            })
            .toList();

    // HTML 테이블 파싱 및 라벨 기반 매칭...
    
    return new RegistrationParseResult(info, missing);
}
```

**분석:**
- **입력**: `UpstageResponse json`
- **출력**: `RegistrationParseResult`
- **파싱 전략**:
  1. **HTML 테이블 파싱**: JSoup 사용
  2. **라벨 기반 매칭**: 등록증 특화 라벨 목록 사용 (라인: 24-43)
  3. **정규표현식 패턴**: VIN, 차량번호, 주민번호, 엔진 형식, 모델 코드 추출
  4. **전체 텍스트 보강**: 테이블에서 찾지 못한 경우 전체 텍스트에서 재검색 (라인: 191-195)

**파싱 단계:**
1. **전처리 단계** (라인: 67-74):
   - table 카테고리 요소 필터링
   - "유의사항", "말소등록 사유" 포함 테이블 제외

2. **HTML 테이블 파싱** (라인: 77-81):
   - 모든 테이블을 행/열로 변환
   - 중복 행 제거

3. **라벨 기반 데이터 추출** (라인: 90-188):
   - 등록증 특화 필드 추출:
     - registrationNo, vehicleType, vehicleUse, model, modelCode
     - chassisNo (VIN), engineType, ownerName, ownerId, address
     - 제원: length, width, height, weight, seating, displacement, maxLoad, power

4. **보강 단계** (라인: 191-195):
   - chassisNo: 전체 텍스트에서 VIN 재검색
   - registrationNo: 전체 텍스트에서 차량번호 재검색
   - ownerId: 전체 텍스트에서 주민번호 재검색

5. **DTO 생성** (라인: 198-220):
   - RegistrationInfo 객체 생성

**사용하는 정규표현식 패턴:**
- `VIN_PATTERN`: `[A-HJ-NPR-Z0-9]{17}` - VIN 추출 (라인: 55)
- `PLATE_PATTERN`: `\\b\\d{2,3}[가-힣]\\d{4}\\b` - 차량번호 추출 (라인: 56)
- `KOR_ID_PATTERN`: `\\b\\d{6}-\\d{7}\\b` - 주민번호 추출 (라인: 57)
- `FIRST_NUMBER`: `(\\d{1,6})` - 첫 번째 숫자 추출 (라인: 58)
- `ENGINE_TOKEN`: `\\b[A-Z0-9]{3,}\\b` - 엔진 형식 추출 (라인: 59)
- `MODEL_CODE_TOKEN`: `\\b[A-Z0-9-]{5,}\\b` - 모델 코드 추출 (라인: 60)

**에러 처리:**
- 파싱 실패 시: 해당 필드는 null
- missingFields에 누락 필드 추가 (라인: 222-224)

**사용하는 외부 라이브러리:**
- `org.jsoup.Jsoup` - HTML 파싱

**필수 필드:**
- registrationNo, vehicleType, vehicleUse, model, modelCode, chassisNo, engineType, ownerName, ownerId, address, length, width, height, weight, seating, displacement, maxLoad, power (라인: 45-50)

---

## 4.3 DeRegistrationParserService

**파일**: `src/main/java/cariv/exp/domain/malso/service/DeRegistrationParserService.java`

### 파싱 대상
- **문서 타입**: 말소등록증 (De-registration Certificate)
- **입력 형식**: `UpstageResponse`
- **출력 형식**: `DeRegistrationParseResult` (DeRegistrationInfo + missingFields)

### 파싱 메서드 분석

#### parse (라인: 69-203)
```java
public DeRegistrationParseResult parse(UpstageResponse json) {
    Map<String, String> map = new HashMap<>();

    List<UpstageElement> tableElements = json.elements().stream()
            .filter(e -> "table".equalsIgnoreCase(e.category()))
            .filter(e -> {
                if (e.content() == null || e.content().html() == null) return false;
                String html = e.content().html();
                return WARNING_KEYWORDS.stream().noneMatch(html::contains);
            })
            .toList();

    // HTML 테이블 파싱 및 라벨 기반 매칭...
    
    return new DeRegistrationParseResult(info, missing);
}
```

**분석:**
- **입력**: `UpstageResponse json`
- **출력**: `DeRegistrationParseResult`
- **파싱 전략**:
  1. **HTML 테이블 파싱**: JSoup 사용
  2. **라벨 기반 매칭**: 말소등록증 특화 라벨 목록 사용 (라인: 24-42)
  3. **인접 셀 매칭**: 라벨 셀의 다음 셀(i+1)에서 값 추출 (라인: 98-165)
  4. **특수 케이스 처리**: "소유자/Owner" 다음에 "성명/Name"이 오는 경우 (라인: 134-140)

**파싱 단계:**
1. **전처리 단계** (라인: 74-82):
   - table 카테고리 요소 필터링
   - "유의사항", "말소등록 사유" 포함 테이블 제외

2. **HTML 테이블 파싱** (라인: 85-92):
   - 모든 테이블을 행/열로 변환
   - 중복 행 제거

3. **라벨-값 쌍 추출** (라인: 95-166):
   - 각 행에서 (label, value) 쌍 찾기
   - 인접 셀(i, i+1)에서 라벨과 값 매칭
   - 특수 케이스: ownerName은 "소유자" → "성명" → 실제 이름 구조 처리

4. **타입 변환** (라인: 168-171):
   - initialRegistrationDate: LocalDate 변환 (라인: 263-278)
   - deRegistrationDate: LocalDate 변환
   - modelYear: Integer 변환 (라인: 279-290)

5. **DTO 생성** (라인: 173-191)

**사용하는 정규표현식 패턴:**
- 없음 (라벨 기반 매칭만 사용)

**에러 처리:**
- 파싱 실패 시: 해당 필드는 null
- missingFields에 누락 필드 추가 (라인: 193-195)

**사용하는 외부 라이브러리:**
- `org.jsoup.Jsoup` - HTML 파싱

**필수 필드:**
- documentNo, registrationNo, vehicleTypeMileage, model, chassisNo, engineType, modelYear, specNo, vehicleUse, initialRegistrationDate, businessUsagePeriod, ownerName, ownerBirthOrRegNo, deRegistrationDate, certificateUse, deRegistrationReason, rightsRelation (라인: 44-62)

---

## 4.4 InvoiceParserService

**파일**: `src/main/java/cariv/exp/domain/invoice/service/InvoiceParserService.java`

### 파싱 대상
- **문서 타입**: 세금계산서 (Tax Invoice)
- **입력 형식**: `UpstageResponse`
- **출력 형식**: `InvoiceParseResult` (InvoiceInfo + missingFields)

### 파싱 메서드 분석

#### parse (라인: 39-105)
```java
public InvoiceParseResult parse(UpstageResponse json) {
    Map<String, String> map = new HashMap<>();

    List<UpstageElement> tableElements = json.elements().stream()
            .filter(e -> "table".equalsIgnoreCase(e.category()))
            .filter(e -> e.content() != null && e.content().html() != null)
            .toList();

    // HTML 테이블 파싱 및 라벨 기반 매칭...
    
    return new InvoiceParseResult(info, missing);
}
```

**분석:**
- **입력**: `UpstageResponse json`
- **출력**: `InvoiceParseResult`
- **파싱 전략**:
  1. **HTML 테이블 파싱**: JSoup 사용
  2. **라벨 기반 매칭**: 차량번호, 합계금액 라벨 사용 (라인: 28-29)
  3. **정규표현식 패턴**: 차량번호, 금액 추출
  4. **다음 행 검색**: 합계금액이 현재 행에 없으면 다음 행에서 검색 (라인: 79-81)

**파싱 단계:**
1. **전처리 단계** (라인: 42-51):
   - table 카테고리 요소 필터링
   - HTML 테이블을 행/열로 변환
   - 중복 행 제거

2. **라벨 기반 데이터 추출** (라인: 58-84):
   - registrationNo: 차량번호 라벨 매칭 또는 정규식 추출
   - totalAmount: 합계금액 라벨 매칭, 다음 행까지 검색

3. **보강 단계** (라인: 87-88):
   - registrationNo: 전체 텍스트에서 차량번호 재검색
   - totalAmount: 전체 텍스트에서 금액 재검색

4. **타입 변환** (라인: 90):
   - totalAmount: Long 변환 (라인: 166-175)

5. **DTO 생성** (라인: 92-95)

**사용하는 정규표현식 패턴:**
- `PLATE_PATTERN`: `\\b\\d{2,3}[가-힣]\\d{4}\\b` - 차량번호 추출 (라인: 36)
- `MONEY_PATTERN`: `(\\d{1,3}(?:,\\d{3})+|\\d+)` - 금액 추출 (라인: 37)

**에러 처리:**
- 파싱 실패 시: 해당 필드는 null
- missingFields에 누락 필드 추가 (라인: 97-99)

**사용하는 외부 라이브러리:**
- `org.jsoup.Jsoup` - HTML 파싱

**필수 필드:**
- registrationNo, totalAmount (라인: 31-34)

---

## 4.5 ExportParserService

**파일**: `src/main/java/cariv/exp/domain/export/service/ExportParserService.java`

### 파싱 대상
- **문서 타입**: 수출신고필증 (Export Certificate)
- **입력 형식**: `UpstageResponse`
- **출력 형식**: `ExportParseResult` (ExportInfo + missingFields)

### 파싱 메서드 분석

#### parse (라인: 81-176)
```java
public ExportParseResult parse(UpstageResponse json) {
    Map<String, String> map = new HashMap<>();

    List<UpstageElement> tableElements = json.elements().stream()
            .filter(e -> "table".equalsIgnoreCase(e.category()))
            .filter(e -> e.content() != null && e.content().html() != null && !e.content().html().isBlank())
            .toList();

    // HTML 테이블 파싱 및 정규식 기반 추출...
    
    return new ExportParseResult(info, missing);
}
```

**분석:**
- **입력**: `UpstageResponse json`
- **출력**: `ExportParseResult`
- **파싱 전략**:
  1. **HTML 테이블 파싱**: JSoup 사용
  2. **정규표현식 기반 추출**: 수출신고필증 특화 정규식 패턴 사용 (라인: 26-61)
  3. **전체 텍스트 정규화**: 특수 문자 제거 및 공백 정규화 (라인: 99, 213-217)
  4. **다중 그룹 캡처**: 목적국, 적재항 등 여러 그룹을 한 번에 추출 (라인: 116-126)

**파싱 단계:**
1. **전처리 단계** (라인: 86-95):
   - table 카테고리 요소 필터링
   - HTML 테이블을 행/열로 변환
   - 중복 행 제거

2. **텍스트 정규화** (라인: 97-99):
   - 모든 행을 하나의 텍스트로 병합
   - 특수 문자 제거 및 공백 정규화

3. **정규식 기반 데이터 추출** (라인: 101-141):
   - declarationNo: 신고번호 패턴 매칭 (라인: 111)
   - declarationDate: 신고일자 패턴 매칭 (라인: 112)
   - acceptanceDate: 신고수리일자 패턴 매칭 (라인: 113)
   - loadingDeadline: 적재의무기한 패턴 매칭 (라인: 114)
   - destCountryCode/Name: 목적국 패턴 매칭 (다중 그룹) (라인: 116-120)
   - loadingPortCode/Name: 적재항 패턴 매칭 (다중 그룹) (라인: 122-126)
   - containerNo: 컨테이너번호 패턴 매칭 (라인: 128)
   - itemName: 거래품명 패턴 매칭 (라인: 129)
   - modelYear/chassisNo: 연도+VIN 패턴 매칭 (라인: 131-135)
   - amountKrw: FOB-KRW 금액 패턴 매칭 (라인: 137-138)
   - buyerName: 구매자 패턴 매칭 (라인: 141)

4. **타입 변환** (라인: 144-151):
   - declarationDate: LocalDate 변환 (라인: 229-249)
   - acceptanceDate: LocalDate 변환
   - loadingDeadline: LocalDate 변환
   - 파싱 실패 시 해당 키 제거 (라인: 149-151)

5. **DTO 생성** (라인: 153-169)

**사용하는 정규표현식 패턴:**
- `DECLARATION_NO_PATTERN`: `신고번호\\s*(\\d{5}-\\d{2}-\\d{6}[A-Z]?)` (라인: 26-27)
- `DECLARATION_DATE_PATTERN`: `신고일자\\s*(\\d{4}-\\d{2}-\\d{2})` (라인: 29-30)
- `ACCEPTANCE_DATE_PATTERN`: `신고수리일자\\s*(\\d{4}[/-]\\d{2}[/-]\\d{2})` (라인: 32-33)
- `LOADING_DEADLINE_PATTERN`: `적재의무기한\\s*(\\d{4}[/-]\\d{2}[/-]\\d{2})` (라인: 35-36)
- `DEST_PATTERN`: `목적국\\s*\\(?.*?\\)?\\s*([A-Z]{2,3})\\s*([A-Z]{2,}(?:\\s+[A-Z]{2,})*)` (라인: 38-39)
- `LOADING_PORT_PATTERN`: `적재항\\s*([A-Z]{4,5})\\s*([가-힣]{2,10}항)` (라인: 41-42)
- `CONTAINER_PATTERN`: `컨테이너번호\\s*([A-Z]{4}\\d{7})` (라인: 44-45)
- `ITEM_NAME_PATTERN`: `거래품명\\s*([A-Z0-9\\-]{2,})` (라인: 47-48)
- `YEAR_VIN_PATTERN`: `\\b(19\\d{2}|20\\d{2})\\b\\s+\\b([A-HJ-NPR-Z0-9]{17})\\b` (라인: 50-51)
- `ISSUE_NO_PATTERN`: `발\\s*행\\s*번\\s*호\\s*[:：]?\\s*(\\d{8,})` (라인: 53-54)
- `FOB_KRW_PATTERN`: `FOB\\s*-?\\s*KRW\\s*-\\s*([0-9,]+)(?:\\.\\d+)?` (라인: 56-57)
- `BUYER_PATTERN`: `구\\s*매\\s*자\\s*([A-Z][A-Z\\s]{2,})\\s*\\(구매자부호\\)` (라인: 60-61)

**에러 처리:**
- 파싱 실패 시: 해당 필드는 null
- 날짜 파싱 실패 시: 해당 키 제거 (라인: 149-151)
- missingFields에 누락 필드 추가 (라인: 171-173)

**사용하는 외부 라이브러리:**
- `org.jsoup.Jsoup` - HTML 파싱

**필수 필드:**
- declarationNo, declarationDate, acceptanceDate, issueNo, destCountryCode, destCountryName, loadingPortCode, loadingPortName, containerNo, itemName, modelYear, chassisNo, amountKrw, loadingDeadline, buyerName (라인: 63-79)

---

## 4.6 BaseInfoOcrParserService

**파일**: `src/main/java/cariv/exp/domain/document/service/BaseInfoOcrParserService.java`

### 파싱 대상
- **문서 타입**: 사업자등록증 (Business Registration Certificate)
- **입력 형식**: `UpstageResponse`
- **출력 형식**: `BaseInfoOcrData` (name, businessRegistrationNumber, businessAddress)

### 파싱 메서드 분석

#### parse (라인: 19-27)
```java
public BaseInfoOcrData parse(UpstageResponse response) {
    List<String> lines = extractLines(response);

    String businessRegistrationNumber = findBusinessRegistrationNumber(lines).orElse(null);
    String name = findLabeledValue(lines, NAME_LABELS).orElse(null);
    String address = findLabeledValue(lines, ADDRESS_LABELS).orElse(null);

    return new BaseInfoOcrData(name, businessRegistrationNumber, address);
}
```

**분석:**
- **입력**: `UpstageResponse response`
- **출력**: `BaseInfoOcrData`
- **파싱 전략**:
  1. **라인 기반 추출**: UpstageResponse의 모든 요소를 라인 단위로 추출 (라인: 29-54)
  2. **정규표현식 패턴**: 사업자등록번호 추출 (라인: 15)
  3. **라벨 기반 매칭**: 상호명, 주소 라벨 사용 (라인: 16-17)

**파싱 단계:**
1. **라인 추출 단계** (라인: 20, 29-54):
   - UpstageResponse의 모든 요소에서 텍스트 추출
   - text → markdown → html 순서로 시도
   - 라인 단위로 분할

2. **사업자등록번호 추출** (라인: 22, 56-64):
   - 정규식으로 사업자등록번호 패턴 매칭
   - 형식 정규화 (10자리 숫자를 XXX-XX-XXXXX 형식으로) (라인: 90-96)

3. **상호명 추출** (라인: 23, 66-78):
   - 라벨 목록과 매칭하여 값 추출
   - 라벨: "상호명", "상호", "법인명", "업체명", "회사명"

4. **주소 추출** (라인: 24, 66-78):
   - 라벨 목록과 매칭하여 값 추출
   - 라벨: "사업장 소재지", "사업장소재지", "사업장 주소", "사업장주소", "소재지", "주소"

5. **값 추출 로직** (라인: 80-88):
   - 라벨 뒤의 콜론(:) 또는 공백 뒤 값 추출
   - 라벨 제거 후 남은 텍스트 반환

**사용하는 정규표현식 패턴:**
- `BIZ_NUMBER_PATTERN`: `\\b(\\d{3}-\\d{2}-\\d{5}|\\d{10})\\b` - 사업자등록번호 추출 (라인: 15)

**에러 처리:**
- 파싱 실패 시: 해당 필드는 null
- BaseInfoOcrData 생성 시 자동 정규화 (라인: 104-107)

**사용하는 외부 라이브러리:**
- 없음 (UpstageResponse의 content만 사용)

**필수 필드:**
- name, businessRegistrationNumber, businessAddress (모두 선택적)

---

## 4.7 Parser 서비스 공통 패턴

### 공통 파싱 전략

1. **HTML 테이블 파싱**:
   - JSoup을 사용하여 HTML 테이블을 행/열 리스트로 변환
   - 중복 행 제거 로직 공통 사용

2. **라벨 기반 매칭**:
   - 미리 정의된 라벨 목록과 텍스트 매칭
   - 다음 non-blank 셀 또는 인라인 값 추출

3. **정규표현식 보강**:
   - 테이블에서 찾지 못한 경우 전체 텍스트에서 정규식으로 재검색

4. **타입 변환**:
   - 문자열 → Integer, Long, LocalDate 변환
   - 유연한 날짜 파싱 (여러 형식 지원)

5. **에러 처리**:
   - 파싱 실패 시 null 반환
   - missingFields에 누락 필드 목록 추가

### 파싱 전략 비교

| Parser | 주요 전략 | 정규식 사용 | 특수 처리 |
|--------|-----------|-------------|-----------|
| AuctionParserService | 라벨 기반 + 정규식 보강 | VIN, 차량번호 | 인라인 추출 |
| RegistrationParserService | 라벨 기반 + 정규식 보강 | VIN, 차량번호, 주민번호, 엔진, 모델코드 | 제원 필드 추출 |
| DeRegistrationParserService | 라벨 기반 (인접 셀) | 없음 | 소유자 이름 특수 구조 처리 |
| InvoiceParserService | 라벨 기반 + 정규식 보강 | 차량번호, 금액 | 다음 행 검색 |
| ExportParserService | 정규식 기반 | 다수의 복잡한 패턴 | 다중 그룹 캡처 |
| BaseInfoOcrParserService | 라인 기반 + 라벨 매칭 | 사업자등록번호 | 라인 단위 처리 |

### 공통 유틸리티 메서드

모든 Parser에서 공통으로 사용하는 패턴:
- `parseHtmlTable()` - HTML 테이블 파싱
- `uniqueRows()` - 중복 행 제거
- `isBlank()` - 빈 문자열 체크
- `normalize()` - 텍스트 정규화
- `firstNonBlank()` - 첫 번째 non-blank 값 반환
- `extractInlineAfter()` - 인라인 값 추출
- `parseDateFlexible()` - 유연한 날짜 파싱
