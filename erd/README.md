# ERD (DBML)

- **파일**: [CarivDealer.dbml](CarivDealer.dbml)  
- **출처**: [CarivDealer_API_ERD_Mapping.md](../docs/CarivDealer_API_ERD_Mapping.md), [CarivDealer_api_v1.md](../docs/CarivDealer_api_v1.md)

## dbdiagram 확장으로 미리보기 (VS Code / Cursor)

1. **확장 설치**  
   - 워크스페이스 추천으로 **dbdiagram** (DBML support and diagram preview) 설치  
   - 또는: [DBML - dbdiagram](https://marketplace.visualstudio.com/items?itemName=dbdiagram.dbdiagram-vscode) 설치

2. **다이어그램 실행**  
   - `erd/CarivDealer.dbml` 파일을 연 다음  
   - **명령 팔레트** (`Ctrl+Shift+P`) → **"DBML: Open Preview to the Side"** 실행  
   - 편집기 옆에 ERD 미리보기가 열립니다.

3. **단축키 쓰기 (선택)**  
   - `Ctrl+K` → `Ctrl+S` 로 키보드 단축키 설정 열기  
   - "DBML" 검색 후 **"DBML: Open Preview to the Side"** 에 원하는 키 조합 지정

## 웹에서 보기

- [dbdiagram.io](https://dbdiagram.io) 접속 → **Import** → **Import from DBML** → `CarivDealer.dbml` 내용 붙여넣기
