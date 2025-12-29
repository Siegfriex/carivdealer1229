# AI Studio 빠른 참조 카드

## 🚨 절대 금지
- ❌ 기존 파일 전체 재작성
- ❌ PRD 문서 무시
- ❌ 기존 코드 구조 완전 변경

## ✅ 필수 절차
1. 기존 파일 읽기 → 2. PRD 확인 → 3. 필요한 부분만 수정 → 4. 검증

## 📚 PRD 위치
`FOWARDMAX/PRD_Phase1_2025-12-31.md` (v2.13)

## 🔑 주요 섹션
- Section 6: ID 레지스트리
- Section 7: 매핑 테이블
- Section 9: 유저플로우
- Section 10: FRD
- Section 14: API/SRD

## 🎯 작업 예시
**요청**: "로그인 화면 수정"
**절차**: 
1. read_file('index.tsx')
2. read_file('FOWARDMAX/PRD_Phase1_2025-12-31.md', section='6.1') // SCR-0001 확인
3. read_file('FOWARDMAX/PRD_Phase1_2025-12-31.md', section='10') // FUNC-00 확인
4. search_replace()로 필요한 부분만 수정
5. read_lints(['index.tsx'])

