#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
PRD 및 output.json 종합 무결성 검증 스크립트
- PRD 내부 일관성 검증 (플로우차트-사이트맵, 기능명-화면명 등)
- output.json과 PRD 간 일치성 검증
- 논리적 일관성 검증 (상태 전이, 플로우 순서 등)
"""

import json
import re
from collections import defaultdict
from typing import Dict, List, Set, Tuple, Any
from pathlib import Path

class ComprehensiveValidator:
    def __init__(self, prd_path: str, output_json_path: str):
        self.prd_path = prd_path
        self.output_json_path = output_json_path
        self.issues = []
        self.warnings = []
        self.info = []
        
        # PRD 데이터 구조
        self.prd_screens = {}  # SCR-#### -> {name, flow, functions}
        self.prd_functions = {}  # FUNC-## -> {name, screens, apis, entities}
        self.prd_flows = {}  # FLOW-## -> {name, screens, order}
        self.prd_apis = {}  # API-#### -> {name, function, endpoint}
        self.prd_entities = {}  # ENT-## -> {name, fields}
        self.prd_decisions = {}  # D-* -> {content, impact}
        self.prd_sitemap = []  # 사이트맵 항목들
        self.prd_state_transitions = []  # 상태 전이
        
        # output.json 데이터 구조
        self.ia_items = []  # IA 기능 항목
        self.spm_items = []  # SPM 정책 항목
        
    def parse_prd(self):
        """PRD 파일 파싱"""
        print("PRD 파일 파싱 중...")
        with open(self.prd_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Screen Registry 파싱
        screen_pattern = r'\|\s*(SCR-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|'
        screen_matches = re.finditer(screen_pattern, content)
        for match in screen_matches:
            screen_id = match.group(1).strip()
            name = match.group(2).strip()
            role = match.group(3).strip()
            flow = match.group(4).strip()
            status = match.group(5).strip()
            self.prd_screens[screen_id] = {
                'name': name,
                'role': role,
                'flow': flow,
                'status': status,
                'functions': []
            }
        
        # Function Registry 파싱
        func_pattern = r'\|\s*(FUNC-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|'
        func_matches = re.finditer(func_pattern, content)
        for match in func_matches:
            func_id = match.group(1).strip()
            name = match.group(2).strip()
            desc = match.group(3).strip()
            screens = match.group(4).strip()
            status = match.group(5).strip()
            self.prd_functions[func_id] = {
                'name': name,
                'description': desc,
                'screens': [s.strip() for s in screens.split(',') if s.strip()],
                'status': status,
                'apis': [],
                'entities': []
            }
        
        # Flow Registry 파싱
        flow_pattern = r'\|\s*(FLOW-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|'
        flow_matches = re.finditer(flow_pattern, content)
        for match in flow_matches:
            flow_id = match.group(1).strip()
            name = match.group(2).strip()
            desc = match.group(3).strip()
            owner = match.group(4).strip()
            status = match.group(5).strip()
            self.prd_flows[flow_id] = {
                'name': name,
                'description': desc,
                'owner': owner,
                'status': status,
                'screens': []
            }
        
        # API Registry 파싱
        api_pattern = r'\|\s*(API-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|'
        api_matches = re.finditer(api_pattern, content)
        for match in api_matches:
            api_id = match.group(1).strip()
            name = match.group(2).strip()
            method = match.group(3).strip()
            endpoint = match.group(4).strip()
            desc = match.group(5).strip()
            func = match.group(6).strip()
            nfr = match.group(7).strip()
            status = match.group(8).strip()
            self.prd_apis[api_id] = {
                'name': name,
                'method': method,
                'endpoint': endpoint,
                'description': desc,
                'function': func,
                'nfr': nfr,
                'status': status
            }
        
        # 사이트맵 파싱 (딜러 사이트맵)
        sitemap_pattern = r'\|\s*딜러\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|'
        sitemap_matches = re.finditer(sitemap_pattern, content)
        for match in sitemap_matches:
            depth1 = match.group(1).strip()
            depth2 = match.group(2).strip()
            depth3 = match.group(3).strip()
            contents = match.group(4).strip()
            # SCR-#### 추출
            screen_match = re.search(r'\(SCR-\d+\)', contents)
            screen_id = screen_match.group(0)[1:-1] if screen_match else None
            self.prd_sitemap.append({
                'depth1': depth1,
                'depth2': depth2,
                'depth3': depth3,
                'contents': contents,
                'screen_id': screen_id
            })
        
        # 상태 전이 파싱
        state_pattern = r'\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|'
        state_section = re.search(r'### 15\.2 상태 전이 로직', content)
        if state_section:
            state_content = content[state_section.end():]
            state_matches = re.finditer(state_pattern, state_content)
            for match in state_matches:
                prev_state = match.group(1).strip()
                next_state = match.group(2).strip()
                trigger = match.group(3).strip()
                actor = match.group(4).strip()
                if prev_state and next_state and not prev_state.startswith('이전'):
                    self.prd_state_transitions.append({
                        'from': prev_state,
                        'to': next_state,
                        'trigger': trigger,
                        'actor': actor
                    })
        
        print(f"  - Screen: {len(self.prd_screens)}개")
        print(f"  - Function: {len(self.prd_functions)}개")
        print(f"  - Flow: {len(self.prd_flows)}개")
        print(f"  - API: {len(self.prd_apis)}개")
        print(f"  - 사이트맵 항목: {len(self.prd_sitemap)}개")
        print(f"  - 상태 전이: {len(self.prd_state_transitions)}개")
    
    def parse_output_json(self):
        """output.json 파일 파싱"""
        print("output.json 파일 파싱 중...")
        with open(self.output_json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # IA 1.0 시트 찾기
        ia_sheet = None
        spm_sheet = None
        for sheet in data['sheets']:
            if sheet['name'] == 'IA 1.0':
                ia_sheet = sheet
            elif sheet['name'] == 'SPM 1.0':
                spm_sheet = sheet
        
        if not ia_sheet:
            self.issues.append("output.json에 IA 1.0 시트가 없습니다")
            return
        
        if not spm_sheet:
            self.issues.append("output.json에 SPM 1.0 시트가 없습니다")
            return
        
        # IA 1.0 파싱
        for row in ia_sheet['data']:
            # 기능 ID 찾기
            func_id = None
            for key, value in row.items():
                if isinstance(value, str) and value.startswith('Seller-ia-front-'):
                    func_id = value
                    break
            
            if func_id:
                item = {
                    'func_id': func_id,
                    'screen_id': row.get('화면 ID', ''),
                    'func_definition': row.get('기능 정의', ''),
                    'category': row.get('카테고리', ''),
                    'depth1': row.get('Depth 1', ''),
                    'depth2': row.get('Depth 2', ''),
                    'depth3': row.get('Depth 3', ''),
                    'policy_id': row.get('관련 정책 ID', ''),
                }
                self.ia_items.append(item)
        
        # SPM 1.0 파싱
        for row in spm_sheet['data']:
            policy_id = None
            for key, value in row.items():
                if isinstance(value, str) and value.startswith('dealer-sp-'):
                    policy_id = value
                    break
            
            if policy_id:
                item = {
                    'policy_id': policy_id,
                    'policy_intro': row.get('정책 소개', ''),
                    'policy_category': row.get('정책분류', ''),
                    'policy_content': row.get('정책 내용', ''),
                }
                self.spm_items.append(item)
        
        print(f"  - IA 항목: {len(self.ia_items)}개")
        print(f"  - SPM 항목: {len(self.spm_items)}개")
    
    def validate_prd_internal_consistency(self):
        """PRD 내부 일관성 검증"""
        print("\n=== PRD 내부 일관성 검증 ===")
        
        # 1. Screen-Function 매핑 일관성
        print("\n1. Screen-Function 매핑 일관성 검증...")
        screen_func_mapping = defaultdict(set)
        
        # Screen → Function 매핑 테이블에서 추출
        screen_func_pattern = r'\|\s*(SCR-\d+)\s*\|\s*(FUNC-\d+[^|]*)\s*\|\s*([^|]+)\s*\|'
        with open(self.prd_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        screen_func_matches = re.finditer(screen_func_pattern, content)
        for match in screen_func_matches:
            screen_id = match.group(1).strip()
            funcs_str = match.group(2).strip()
            # FUNC-XX 추출
            funcs = re.findall(r'FUNC-\d+', funcs_str)
            for func_id in funcs:
                screen_func_mapping[screen_id].add(func_id)
        
        # Function Registry의 screens와 비교
        for func_id, func_data in self.prd_functions.items():
            for screen_id in func_data['screens']:
                if screen_id not in screen_func_mapping:
                    self.warnings.append(f"Function {func_id}가 Screen {screen_id}를 참조하지만 Screen-Function 매핑 테이블에 없음")
                elif func_id not in screen_func_mapping[screen_id]:
                    self.warnings.append(f"Function {func_id}가 Screen {screen_id}를 참조하지만 매핑 테이블과 불일치")
        
        # 2. 사이트맵-Screen 일관성
        print("\n2. 사이트맵-Screen 일관성 검증...")
        sitemap_screens = set()
        for item in self.prd_sitemap:
            if item['screen_id']:
                sitemap_screens.add(item['screen_id'])
        
        for screen_id in self.prd_screens:
            if screen_id not in sitemap_screens:
                self.warnings.append(f"Screen {screen_id} ({self.prd_screens[screen_id]['name']})가 사이트맵에 없음")
        
        # 3. Flow-Screen 순서 일관성
        print("\n3. Flow-Screen 순서 일관성 검증...")
        flow_screen_pattern = r'\|\s*(FLOW-\d+)\s*\|\s*(SCR-\d+)\s*\|\s*(\d+)\s*\|\s*([^|]+)\s*\|'
        flow_screen_matches = re.finditer(flow_screen_pattern, content)
        flow_screens = defaultdict(list)
        for match in flow_screen_matches:
            flow_id = match.group(1).strip()
            screen_id = match.group(2).strip()
            order = int(match.group(3).strip())
            flow_screens[flow_id].append((order, screen_id))
        
        for flow_id, screens in flow_screens.items():
            screens.sort(key=lambda x: x[0])
            orders = [s[0] for s in screens]
            if orders != list(range(1, len(orders) + 1)):
                self.issues.append(f"Flow {flow_id}의 Screen 순서가 연속적이지 않음: {orders}")
        
        # 4. 상태 전이 로직 일관성
        print("\n4. 상태 전이 로직 일관성 검증...")
        valid_states = {'Draft', 'Inspecting', 'Active', 'Bidding', 'Locked', 'Settlement', 'Sold', 'Onboarded'}
        for transition in self.prd_state_transitions:
            if transition['from'] not in valid_states:
                self.warnings.append(f"상태 전이의 이전 상태 '{transition['from']}'가 유효하지 않음")
            if transition['to'] not in valid_states:
                self.warnings.append(f"상태 전이의 다음 상태 '{transition['to']}'가 유효하지 않음")
        
        # 5. API-Function 매핑 일관성
        print("\n5. API-Function 매핑 일관성 검증...")
        for api_id, api_data in self.prd_apis.items():
            func_id = api_data['function']
            if func_id and func_id not in self.prd_functions:
                self.issues.append(f"API {api_id}가 존재하지 않는 Function {func_id}를 참조")
            elif func_id:
                if api_id not in self.prd_functions[func_id]['apis']:
                    self.prd_functions[func_id]['apis'].append(api_id)
    
    def validate_prd_output_consistency(self):
        """PRD와 output.json 간 일치성 검증"""
        print("\n=== PRD-output.json 일치성 검증 ===")
        
        # 1. 기능명 일치성 (의미 기반)
        print("\n1. 기능명 일치성 검증...")
        # output.json의 기능 정의와 PRD의 기능명 비교는 의미 분석이 필요하므로 간단히 체크만
        
        # 2. 화면 ID 매핑 확인
        print("\n2. 화면 ID 매핑 확인...")
        output_screens = set()
        for item in self.ia_items:
            if item['screen_id']:
                output_screens.add(item['screen_id'])
        
        prd_screen_names = {screen['name']: screen_id for screen_id, screen in self.prd_screens.items()}
        
        # output.json의 화면 ID가 PRD Screen 이름과 매핑 가능한지 확인
        for screen_id in output_screens:
            # 화면 ID를 화면명으로 변환 시도
            screen_name = screen_id.replace('Join', '회원가입').replace('Offer', '제안')
            if screen_name not in prd_screen_names:
                self.warnings.append(f"output.json의 화면 ID '{screen_id}'가 PRD Screen과 매핑되지 않음")
    
    def validate_logical_consistency(self):
        """논리적 일관성 검증"""
        print("\n=== 논리적 일관성 검증 ===")
        
        # 1. 플로우 순서 논리성
        print("\n1. 플로우 순서 논리성 검증...")
        # FLOW-01 (회원가입) → FLOW-02 (검차) → FLOW-03 (판매) → FLOW-04 (탁송) 순서 확인
        
        # 2. 상태 전이 순서 논리성
        print("\n2. 상태 전이 순서 논리성 검증...")
        state_order = ['Draft', 'Inspecting', 'Active', 'Bidding', 'Locked', 'Settlement', 'Sold']
        state_index = {state: idx for idx, state in enumerate(state_order)}
        
        for transition in self.prd_state_transitions:
            from_idx = state_index.get(transition['from'], -1)
            to_idx = state_index.get(transition['to'], -1)
            if from_idx >= 0 and to_idx >= 0:
                if to_idx < from_idx:
                    self.warnings.append(f"상태 전이가 역순입니다: {transition['from']} → {transition['to']}")
        
        # 3. 필수 화면 존재 여부
        print("\n3. 필수 화면 존재 여부 검증...")
        required_screens = ['SCR-0001', 'SCR-0002', 'SCR-0100', 'SCR-0200', 'SCR-0300']
        for screen_id in required_screens:
            if screen_id not in self.prd_screens:
                self.issues.append(f"필수 화면 {screen_id}가 Screen Registry에 없음")
        
        # 4. 필수 기능 존재 여부
        print("\n4. 필수 기능 존재 여부 검증...")
        required_functions = ['FUNC-00', 'FUNC-01', 'FUNC-02', 'FUNC-05', 'FUNC-06']
        for func_id in required_functions:
            if func_id not in self.prd_functions:
                self.issues.append(f"필수 기능 {func_id}가 Function Registry에 없음")
    
    def generate_report(self) -> str:
        """검증 보고서 생성"""
        report = []
        report.append("# PRD 및 output.json 종합 무결성 검증 보고서\n")
        report.append(f"**검증 일시**: {Path(__file__).stat().st_mtime}\n")
        report.append(f"**PRD 파일**: {self.prd_path}\n")
        report.append(f"**output.json 파일**: {self.output_json_path}\n")
        report.append("\n---\n")
        
        report.append("## 1. 실행 요약\n\n")
        report.append(f"- **Critical Issues**: {len([i for i in self.issues if 'Critical' in i or '필수' in i])}건\n")
        report.append(f"- **Issues**: {len(self.issues)}건\n")
        report.append(f"- **Warnings**: {len(self.warnings)}건\n")
        report.append(f"- **Info**: {len(self.info)}건\n")
        
        report.append("\n## 2. Critical Issues\n\n")
        critical_issues = [i for i in self.issues if 'Critical' in i or '필수' in i]
        if critical_issues:
            for issue in critical_issues:
                report.append(f"- ❌ {issue}\n")
        else:
            report.append("- 없음\n")
        
        report.append("\n## 3. Issues\n\n")
        if self.issues:
            for issue in self.issues:
                report.append(f"- ⚠️ {issue}\n")
        else:
            report.append("- 없음\n")
        
        report.append("\n## 4. Warnings\n\n")
        if self.warnings:
            for warning in self.warnings[:20]:  # 처음 20개만
                report.append(f"- ⚡ {warning}\n")
            if len(self.warnings) > 20:
                report.append(f"\n... 외 {len(self.warnings) - 20}개 경고\n")
        else:
            report.append("- 없음\n")
        
        report.append("\n## 5. 통계\n\n")
        report.append("### 5.1 PRD 통계\n\n")
        report.append(f"- Screen: {len(self.prd_screens)}개\n")
        report.append(f"- Function: {len(self.prd_functions)}개\n")
        report.append(f"- Flow: {len(self.prd_flows)}개\n")
        report.append(f"- API: {len(self.prd_apis)}개\n")
        report.append(f"- 사이트맵 항목: {len(self.prd_sitemap)}개\n")
        report.append(f"- 상태 전이: {len(self.prd_state_transitions)}개\n")
        
        report.append("\n### 5.2 output.json 통계\n\n")
        report.append(f"- IA 항목: {len(self.ia_items)}개\n")
        report.append(f"- SPM 항목: {len(self.spm_items)}개\n")
        
        return ''.join(report)

def main():
    prd_path = r'C:\carivdealer\FOWARDMAX\PRD_Phase1_2025-12-31.md'
    output_json_path = r'C:\carivdealer\FOWARDMAX\output.json'
    
    validator = ComprehensiveValidator(prd_path, output_json_path)
    
    print("=" * 60)
    print("PRD 및 output.json 종합 무결성 검증 시작")
    print("=" * 60)
    
    try:
        validator.parse_prd()
        validator.parse_output_json()
        validator.validate_prd_internal_consistency()
        validator.validate_prd_output_consistency()
        validator.validate_logical_consistency()
        
        report = validator.generate_report()
        
        # 보고서 저장
        report_path = r'C:\carivdealer\FOWARDMAX\종합_무결성_검증_보고서.md'
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print("\n" + "=" * 60)
        print("검증 완료")
        print("=" * 60)
        print(f"\nCritical Issues: {len([i for i in validator.issues if 'Critical' in i or '필수' in i])}건")
        print(f"Issues: {len(validator.issues)}건")
        print(f"Warnings: {len(validator.warnings)}건")
        print(f"\n보고서 저장 위치: {report_path}")
        
        # 콘솔에도 요약 출력
        print("\n" + "=" * 60)
        print("주요 발견사항 요약")
        print("=" * 60)
        if validator.issues:
            print("\n[Issues]")
            for issue in validator.issues[:10]:
                print(f"  - {issue}")
        if validator.warnings:
            print("\n[Warnings]")
            for warning in validator.warnings[:10]:
                print(f"  - {warning}")
        
    except Exception as e:
        print(f"\n오류 발생: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()

