# MCP 원본 응답 저장 디렉터리

**목적**: Figma MCP 호출 시 반환된 **응답 전문**을 노드 단위로 저장. 파싱/분석은 이 파일을 읽어 수행하여, 응답 잘림·누락 오판을 방지.

---

## 하위 구조

- **한 노드당 하나의 폴더**: `{nodeId하이픈}/`
  - 예: `1418-24679/`, `1425-7280/`
- **각 노드 폴더 내 파일**:
  - `metadata_raw.txt` — get_metadata 호출 시 반환된 전체 텍스트
  - `design_context_raw.txt` — get_design_context 호출 시 반환된 전체 텍스트
  - `screenshot.png` — (선택) get_screenshot 호출 시 저장한 이미지

---

## 사용 규칙

1. **콜링 직후** 응답 전체를 해당 파일에 저장.
2. "마지막 줄만 보고 데이터 미반환"으로 처리하지 말고, **저장된 파일**을 기준으로 [MCP_RESPONSE_CHECKLIST.md](../MCP_RESPONSE_CHECKLIST.md) 체크.
3. 구현·리디자인 시 메타데이터·디자인 컨텍스트는 이 경로의 raw 파일을 읽어 사용.

---

## 예시

```
mcp_outputs/
  1418-24679/
    metadata_raw.txt
    design_context_raw.txt
    screenshot.png
  1425-7280/
    metadata_raw.txt
    design_context_raw.txt
```

노드 폴더는 작업한 노드만 생성하면 됨. 빈 폴더는 .gitkeep 없이 README만으로 규칙만 유지해도 됨.

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
