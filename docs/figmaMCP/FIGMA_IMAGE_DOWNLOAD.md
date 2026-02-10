# Figma 이미지 다운로드 방법

## MCP로 “가져온 것”과 “지금 다운로드가 안 되는” 이유

**MCP로 가져오는 것**은 두 가지가 다릅니다.

| MCP 호출 | 가져오는 것 | 이미지 파일 |
|----------|-------------|-------------|
| **get_design_context** (Figma API MCP) | 디자인 코드 + **에셋 URL 목록** (`https://www.figma.com/api/mcp/asset/...`) | ❌ URL만 있음. 이 URL은 **Figma 쪽 인증(브라우저/앱 세션)** 이 있을 때만 접근 가능함. Cursor/스크립트에서 그대로 `fetch()` 하면 인증 없어서 **다운로드 불가**. |
| **TalkToFigma export_node_as_image** (Figma 플러그인 MCP) | — | ✅ Figma 데스크톱을 **연 상태**에서 노드 선택 후 호출하면, 플러그인이 노드를 이미지로 내보내서 **실제 이미지 데이터**를 받을 수 있음. |

그래서 **예전에 `src/shared/figma_image/`에 들어간 18개 파일**도 MCP **get_design_context**로 “URL 목록”을 가져온 뒤,  
실제 파일은 **(1) 수동 Export**, **(2) Figma REST API + 토큰**, **(3) TalkToFigma export (당시 Figma 열려 있었을 때)** 중 하나로 받았을 가능성이 큽니다.  
**get_design_context가 준 URL을 우리 환경에서 그대로 fetch해서 저장한 것은 아님**이라, 지금 같은 URL로는 다운로드가 안 되는 것이 맞습니다.

---

## 실제 이미지 파일 받는 방법

MCP가 주는 `https://www.figma.com/api/mcp/asset/...` URL은 **브라우저/앱 인증 전제**라 Cursor/스크립트에서 그대로 fetch해도 파일을 받을 수 없습니다.  
아래 **방법 0(TalkToFigma)** 또는 1·2로 **실제 이미지 파일**을 받아 `src/shared/figma_image/` 등에 저장할 수 있습니다.

---

## 방법 0: TalkToFigma MCP로 내보내기 (Figma 데스크톱 열린 상태)

**Figma 데스크톱 앱**을 열고, 해당 파일·노드가 보이는 상태에서 **TalkToFigma** MCP가 연결되어 있으면:

- **export_node_as_image** 도구로 `nodeId`, `format`(PNG/JPG/SVG/PDF), `scale`을 넘겨 호출하면,  
  플러그인이 해당 노드를 이미지로 내보내서 **이미지 데이터(또는 URL)** 를 반환합니다.
- 에이전트가 이 반환값을 받아 로컬 파일로 저장하면, “MCP로 이미지 다운로드”가 됩니다.

**조건**: Figma 데스크톱 실행, 해당 파일 열림, TalkToFigma 플러그인/채널 연결.  
**장점**: get_design_context로 노드만 알면, 같은 MCP 세션에서 바로 이미지까지 받기 가능. **단점**: Figma를 연 상태로 둬야 함.

---

## 방법 1: Figma에서 수동 Export (토큰 불필요)

1. [Figma 파일](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0) 열기
2. 내보낼 **노드(프레임/이미지)** 선택
3. 우측 패널 **Export** 섹션에서 형식(PNG/SVG 등) 선택 후 **Export** 클릭
4. 저장한 파일을 `src/shared/figma_image/`로 복사  
   - 파일명: `{nodeId하이픈}_{용도}_{이름}.png` (예: `1636-10134_차량_placeholder.png`)

**장점**: 토큰 없이 가능. **단점**: 노드 많을 때 반복 작업 필요.

---

## 방법 2: Figma REST API + 스크립트 (자동화)

Figma **Personal Access Token**으로 **Images API**를 호출하면, 노드별 **일회성 다운로드 URL**을 받을 수 있습니다. 그 URL로 바로 fetch 해서 로컬에 저장하면 됩니다.

### 2.1 토큰 발급

1. Figma 로그인 → **Settings** → **Account** → [Personal access tokens](https://www.figma.com/settings)
2. **Generate new token** → 이름 입력 후 생성
3. 생성된 토큰을 복사해 두기 (한 번만 표시됨)

### 2.2 API 사용

- **엔드포인트**: `GET https://api.figma.com/v1/images/:file_key`
- **쿼리**: `ids` = 노드 ID (콜론 형식, 여러 개는 쉼표 구분). 예: `ids=1636:10134,1636:10132`
- **헤더**: `X-Figma-Token: YOUR_ACCESS_TOKEN`
- **선택 쿼리**: `format=png` 또는 `format=svg`, `scale=1`(해상도)

**응답 예시**:

```json
{
  "err": null,
  "images": {
    "1636:10134": "https://s3-us-west-2.amazonaws.com/figma-alpha-api/..."
  },
  "status": 200
}
```

`images` 안의 URL은 **일시적(보통 30분 내)** 이므로, 받은 직후에 다운로드해야 합니다.

### 2.3 프로젝트 스크립트 사용

프로젝트 루트에 스크립트 `scripts/figma-download-images.mjs`를 두었습니다.

**사용 예**:

```bash
# .env.local 또는 환경 변수에 FIGMA_ACCESS_TOKEN 설정 후
set FIGMA_ACCESS_TOKEN=your_token
node scripts/figma-download-images.mjs
```

스크립트 기본값:

- **file_key**: `4w3ft8RpGwoho5EtvNO9hQ` (Domestic-Seller 1.0)
- **node ids**: 스크립트 상단 `NODE_IDS` 배열에 콜론 형식으로 지정 (예: `1636:10134`)
- **저장 경로**: `src/shared/figma_image/`  
  - 파일명: `{nodeId하이픈}.png` (예: `1636-10134.png`)

스크립트 내용을 열어 `NODE_IDS`만 바꾸면 다른 노드도 같은 방식으로 받을 수 있습니다.

---

## 요약

| 방법 | 토큰 | 조건 | 적합한 경우 |
|------|------|------|-------------|
| **TalkToFigma export_node_as_image** | 불필요 | Figma 데스크톱 열림, MCP 연결 | MCP로 노드만 지정해 이미지 받고 싶을 때 |
| **수동 Export** | 불필요 | — | 노드 수 적을 때, 한 번만 받을 때 |
| **REST API + 스크립트** | Personal Access Token 필요 | — | 노드 많을 때, CI/자동화 시 |

- **get_design_context**가 주는 에셋 URL은 **참조/상수용**일 뿐, Cursor/스크립트에서 그 URL로 fetch하면 인증 없어서 **다운로드되지 않음**.
- 실제 파일은 위 셋 중 하나(TalkToFigma export, 수동 Export, REST API)로 받아 `src/shared/figma_image/`에 두고 import해서 사용하면 됩니다.

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
