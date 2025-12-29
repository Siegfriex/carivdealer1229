#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
PRD 심층점검 스크립트 (디버깅 및 논리구성 확인)
- 데이터 무결성 검사
- 논리 일치성 검사
- PRD ↔ output.json 교차검증
"""

import json
import re
from collections import defaultdict
from typing import Dict, List, Any, Set, Tuple
from dataclasses import dataclass, field
from enum import Enum

class Severity(Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

@dataclass
class Issue:
    severity: Severity
    category: str
    rule: str
    description: str
    location: str = ""
    affected_ids: List[str] = field(default_factory=list)
    recommendation: str = ""

class PRDDeepValidator:
    def __init__(self, prd_path: str, output_json_path: str):
        self.prd_path = prd_path
        self.output_json_path = output_json_path
        self.issues: List[Issue] = []
        
        # PRD 데이터 구조
        self.prd_content = ""
        self.registries = {
            'flows': {},
            'screens': {},
            'functions': {},
            'apis': {},
            'entities': {},
            'nfrs': {},
            'decisions': {},
        }
        self.mappings = {
            'flow_to_screen': defaultdict(list),
            'screen_to_function': defaultdict(list),
            'function_to_entity': defaultdict(list),
            'function_to_api': defaultdict(list),
            'function_to_nfr': defaultdict(list),
        }
        self.id_references_in_text: Dict[str, Set[str]] = defaultdict(set)
        
        # output.json 데이터 구조
        self.ia_items: List[Dict] = []
        self.spm_items: List[Dict] = []
        
    def parse_prd(self):
        """PRD 문서 파싱"""
        with open(self.prd_path, 'r', encoding='utf-8') as f:
            self.prd_content = f.read()
        
        # Flow Registry 파싱
        flow_pattern = r'\|\s*(FLOW-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|'
        for match in re.finditer(flow_pattern, self.prd_content):
            flow_id = match.group(1).strip()
            self.registries['flows'][flow_id] = {
                'name': match.group(2).strip(),
                'description': match.group(3).strip(),
                'owner': match.group(4).strip(),
                'status': match.group(5).strip(),
            }
        
        # Screen Registry 파싱
        screen_pattern = r'\|\s*(SCR-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|'
        for match in re.finditer(screen_pattern, self.prd_content):
            screen_id = match.group(1).strip()
            self.registries['screens'][screen_id] = {
                'name': match.group(2).strip(),
                'role': match.group(3).strip(),
                'flow': match.group(4).strip(),
                'status': match.group(5).strip(),
            }
        
        # Function Registry 파싱
        func_pattern = r'\|\s*(FUNC-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|'
        for match in re.finditer(func_pattern, self.prd_content):
            func_id = match.group(1).strip()
            self.registries['functions'][func_id] = {
                'name': match.group(2).strip(),
                'description': match.group(3).strip(),
                'related_screens': match.group(4).strip(),
                'status': match.group(5).strip(),
            }
        
        # API Registry 파싱
        api_pattern = r'\|\s*(API-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|'
        for match in re.finditer(api_pattern, self.prd_content):
            api_id = match.group(1).strip()
            self.registries['apis'][api_id] = {
                'name': match.group(2).strip(),
                'method': match.group(3).strip(),
                'endpoint': match.group(4).strip(),
                'description': match.group(5).strip(),
                'related_function': match.group(6).strip(),
                'related_nfr': match.group(7).strip(),
                'status': match.group(8).strip(),
            }
        
        # Entity는 TSD 섹션에서 파싱 (ENT-01: Vehicle 형태)
        entity_pattern = r'#### ENT-(\d+):\s*([^(]+)'
        for match in re.finditer(entity_pattern, self.prd_content):
            entity_id = f"ENT-{match.group(1).zfill(2)}"
            entity_name = match.group(2).strip()
            self.registries['entities'][entity_id] = {
                'name': entity_name,
            }
        
        # NFR 파싱
        nfr_pattern = r'\|\s*NFR-ID\s*\|\s*(NFR-\d+)\s*\|'
        for match in re.finditer(nfr_pattern, self.prd_content):
            nfr_id = match.group(1).strip()
            # NFR 상세 정보 추출 시도
            nfr_section = self._extract_nfr_section(nfr_id)
            self.registries['nfrs'][nfr_id] = nfr_section
        
        # Decision 파싱
        decision_pattern = r'\|\s*(D-P1-\d+)\s*\|\s*([^|]+)\s*\|'
        for match in re.finditer(decision_pattern, self.prd_content):
            decision_id = match.group(1).strip()
            self.registries['decisions'][decision_id] = {
                'content': match.group(2).strip(),
            }
        
        # 매핑 테이블 파싱
        self._parse_mapping_tables()
        
        # 본문에서 ID 참조 추출
        self._extract_id_references()
    
    def _extract_nfr_section(self, nfr_id: str) -> Dict:
        """NFR 섹션 추출"""
        pattern = rf'###\s+\d+\.\d+\s+{re.escape(nfr_id)}:.*?(?=###|\Z)'
        match = re.search(pattern, self.prd_content, re.DOTALL)
        if match:
            section = match.group(0)
            return {
                'section': section,
            }
        return {}
    
    def _parse_mapping_tables(self):
        """매핑 테이블 파싱"""
        # FLOW → Screen 매핑
        flow_screen_pattern = r'\|\s*(FLOW-\d+)\s*\|\s*(SCR-\d+)\s*\|\s*(\d+)\s*\|'
        for match in re.finditer(flow_screen_pattern, self.prd_content):
            flow_id = match.group(1).strip()
            screen_id = match.group(2).strip()
            order = int(match.group(3).strip())
            self.mappings['flow_to_screen'][flow_id].append((screen_id, order))
        
        # Screen → Function 매핑
        screen_func_pattern = r'\|\s*(SCR-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|'
        # Screen → Function 매핑 테이블 섹션만 추출
        screen_func_section = re.search(r'#### Screen → Function 매핑.*?(?=####|\Z)', self.prd_content, re.DOTALL)
        if screen_func_section:
            for match in re.finditer(screen_func_pattern, screen_func_section.group(0)):
                screen_id = match.group(1).strip()
                func_ref = match.group(2).strip()
                # FUNC-XX 추출
                func_ids = re.findall(r'FUNC-\d+', func_ref)
                for func_id in func_ids:
                    self.mappings['screen_to_function'][screen_id].append(func_id)
        
        # Function → Entity/API/NFR 매핑
        func_mapping_pattern = r'\|\s*(FUNC-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|'
        func_mapping_section = re.search(r'#### Function → Entity/API/NFR 매핑.*?(?=####|\Z)', self.prd_content, re.DOTALL)
        if func_mapping_section:
            for match in re.finditer(func_mapping_pattern, func_mapping_section.group(0)):
                func_id = match.group(1).strip()
                entity_ref = match.group(2).strip()
                api_ref = match.group(3).strip()
                nfr_ref = match.group(4).strip()
                
                # Entity 추출
                entity_ids = re.findall(r'ENT-\d+', entity_ref)
                for entity_id in entity_ids:
                    self.mappings['function_to_entity'][func_id].append(entity_id)
                
                # API 추출
                api_ids = re.findall(r'API-\d+', api_ref)
                for api_id in api_ids:
                    self.mappings['function_to_api'][func_id].append(api_id)
                
                # NFR 추출
                nfr_ids = re.findall(r'NFR-\d+', nfr_ref)
                for nfr_id in nfr_ids:
                    self.mappings['function_to_nfr'][func_id].append(nfr_id)
    
    def _extract_id_references(self):
        """본문에서 ID 참조 추출"""
        id_patterns = {
            'FUNC': r'FUNC-\d+',
            'SCR': r'SCR-\d+',
            'API': r'API-\d+',
            'ENT': r'ENT-\d+',
            'FLOW': r'FLOW-\d+',
            'NFR': r'NFR-\d+',
            'D-P1': r'D-P1-\d+',
        }
        
        for id_type, pattern in id_patterns.items():
            for match in re.finditer(pattern, self.prd_content):
                id_value = match.group(0)
                self.id_references_in_text[id_type].add(id_value)
    
    def parse_output_json(self):
        """output.json 파싱"""
        with open(self.output_json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # IA 1.0 파싱
        ia_sheet = next((s for s in data['sheets'] if s['name'] == 'IA 1.0'), None)
        if ia_sheet:
            for row in ia_sheet['data']:
                func_id = row.get('System.Xml.XmlElement', '')
                if func_id and func_id.startswith('Seller-ia-front-'):
                    self.ia_items.append({
                        'func_id': func_id,
                        'screen_id': row.get('화면 ID', ''),
                        'func_definition': row.get('기능 정의', ''),
                        'category': row.get('카테고리', ''),
                        'depth1': row.get('Depth 1', ''),
                        'depth2': row.get('Depth 2', ''),
                        'depth3': row.get('Depth 3', ''),
                        'policy_id': row.get('관련 정책 ID', ''),
                        'importance': row.get('중요도', ''),
                        'implementation_target': row.get('구현 대상', ''),
                    })
        
        # SPM 1.0 파싱
        spm_sheet = next((s for s in data['sheets'] if s['name'] == 'SPM 1.0'), None)
        if spm_sheet:
            for row in spm_sheet['data']:
                policy_code = row.get('정책 코드', '')
                if policy_code and policy_code.startswith('dealer-sp-'):
                    self.spm_items.append({
                        'policy_id': policy_code,
                        'policy_intro': row.get('정책 소개', ''),
                        'policy_content': row.get('정책 내용', ''),
                        'policy_category': row.get('정책분류', ''),
                        'detail_item': row.get('세부 항목', ''),
                    })
    
    def check_id_format(self):
        """ID 형식 검증"""
        id_patterns = {
            'FLOW': r'^FLOW-\d+$',
            'SCR': r'^SCR-\d{4}$',
            'FUNC': r'^FUNC-\d+$',
            'API': r'^API-\d{4}$',
            'ENT': r'^ENT-\d{2}$',
            'NFR': r'^NFR-\d{4}$',
            'D-P1': r'^D-P1-\d{3}$',
        }
        
        for registry_name, registry in self.registries.items():
            id_prefix = registry_name.upper().rstrip('S')
            if id_prefix == 'DECISION':
                id_prefix = 'D-P1'
            
            pattern = id_patterns.get(id_prefix)
            if pattern:
                for item_id in registry.keys():
                    if not re.match(pattern, item_id):
                        self.issues.append(Issue(
                            severity=Severity.CRITICAL,
                            category="ID 형식 검증",
                            rule=f"{id_prefix} ID 형식 규칙",
                            description=f"{item_id}가 형식 규칙({pattern})을 위반합니다",
                            location=f"{registry_name} Registry",
                            affected_ids=[item_id],
                            recommendation=f"{item_id}를 올바른 형식으로 수정하세요"
                        ))
    
    def check_uniqueness(self):
        """Registry 유일성 검사"""
        for registry_name, registry in self.registries.items():
            seen = {}
            for item_id, item_data in registry.items():
                if item_id in seen:
                    self.issues.append(Issue(
                        severity=Severity.CRITICAL,
                        category="ID 유일성",
                        rule=f"{registry_name} Registry 중복 정의",
                        description=f"{item_id}가 중복 정의되었습니다",
                        location=f"{registry_name} Registry",
                        affected_ids=[item_id],
                        recommendation=f"{item_id}의 중복 정의를 제거하거나 ID를 변경하세요"
                    ))
                seen[item_id] = item_data
    
    def check_cross_references(self):
        """Cross-Reference 무결성 검사"""
        # Screen Registry의 Flow ID 존재 여부
        for screen_id, screen_data in self.registries['screens'].items():
            flow_id = screen_data.get('flow', '').strip()
            if flow_id and flow_id not in self.registries['flows']:
                self.issues.append(Issue(
                    severity=Severity.CRITICAL,
                    category="Cross-Reference 무결성",
                    rule="Screen Registry의 Flow ID 참조",
                    description=f"{screen_id}가 참조하는 {flow_id}가 Flow Registry에 존재하지 않습니다",
                    location=f"Screen Registry: {screen_id}",
                    affected_ids=[screen_id, flow_id],
                    recommendation=f"{flow_id}를 Flow Registry에 추가하거나 Screen Registry의 Flow ID를 수정하세요"
                ))
        
        # Function Registry의 Screen ID 참조 검사
        for func_id, func_data in self.registries['functions'].items():
            related_screens = func_data.get('related_screens', '')
            screen_ids = re.findall(r'SCR-\d+', related_screens)
            for screen_id in screen_ids:
                if screen_id not in self.registries['screens']:
                    self.issues.append(Issue(
                        severity=Severity.HIGH,
                        category="Cross-Reference 무결성",
                        rule="Function Registry의 Screen ID 참조",
                        description=f"{func_id}가 참조하는 {screen_id}가 Screen Registry에 존재하지 않습니다",
                        location=f"Function Registry: {func_id}",
                        affected_ids=[func_id, screen_id],
                        recommendation=f"{screen_id}를 Screen Registry에 추가하거나 Function Registry의 관련 화면을 수정하세요"
                    ))
        
        # 매핑 테이블의 ID 참조 검사
        for flow_id, screens in self.mappings['flow_to_screen'].items():
            if flow_id not in self.registries['flows']:
                self.issues.append(Issue(
                    severity=Severity.CRITICAL,
                    category="Cross-Reference 무결성",
                    rule="FLOW → Screen 매핑 테이블",
                    description=f"매핑 테이블의 {flow_id}가 Flow Registry에 존재하지 않습니다",
                    location="FLOW → Screen 매핑 테이블",
                    affected_ids=[flow_id],
                    recommendation=f"{flow_id}를 Flow Registry에 추가하거나 매핑 테이블을 수정하세요"
                ))
            for screen_id, _ in screens:
                if screen_id not in self.registries['screens']:
                    self.issues.append(Issue(
                        severity=Severity.CRITICAL,
                        category="Cross-Reference 무결성",
                        rule="FLOW → Screen 매핑 테이블",
                        description=f"매핑 테이블의 {screen_id}가 Screen Registry에 존재하지 않습니다",
                        location="FLOW → Screen 매핑 테이블",
                        affected_ids=[screen_id],
                        recommendation=f"{screen_id}를 Screen Registry에 추가하거나 매핑 테이블을 수정하세요"
                    ))
        
        for screen_id, func_ids in self.mappings['screen_to_function'].items():
            if screen_id not in self.registries['screens']:
                self.issues.append(Issue(
                    severity=Severity.CRITICAL,
                    category="Cross-Reference 무결성",
                    rule="Screen → Function 매핑 테이블",
                    description=f"매핑 테이블의 {screen_id}가 Screen Registry에 존재하지 않습니다",
                    location="Screen → Function 매핑 테이블",
                    affected_ids=[screen_id],
                    recommendation=f"{screen_id}를 Screen Registry에 추가하거나 매핑 테이블을 수정하세요"
                ))
            for func_id in func_ids:
                if func_id not in self.registries['functions']:
                    self.issues.append(Issue(
                        severity=Severity.CRITICAL,
                        category="Cross-Reference 무결성",
                        rule="Screen → Function 매핑 테이블",
                        description=f"매핑 테이블의 {func_id}가 Function Registry에 존재하지 않습니다",
                        location="Screen → Function 매핑 테이블",
                        affected_ids=[func_id],
                        recommendation=f"{func_id}를 Function Registry에 추가하거나 매핑 테이블을 수정하세요"
                    ))
        
        # Function → Entity/API/NFR 매핑 검사
        for func_id, entity_ids in self.mappings['function_to_entity'].items():
            if func_id not in self.registries['functions']:
                self.issues.append(Issue(
                    severity=Severity.CRITICAL,
                    category="Cross-Reference 무결성",
                    rule="Function → Entity 매핑 테이블",
                    description=f"매핑 테이블의 {func_id}가 Function Registry에 존재하지 않습니다",
                    location="Function → Entity/API/NFR 매핑 테이블",
                    affected_ids=[func_id],
                    recommendation=f"{func_id}를 Function Registry에 추가하거나 매핑 테이블을 수정하세요"
                ))
            for entity_id in entity_ids:
                if entity_id not in self.registries['entities']:
                    self.issues.append(Issue(
                        severity=Severity.HIGH,
                        category="Cross-Reference 무결성",
                        rule="Function → Entity 매핑 테이블",
                        description=f"매핑 테이블의 {entity_id}가 Entity Registry에 존재하지 않습니다",
                        location="Function → Entity/API/NFR 매핑 테이블",
                        affected_ids=[entity_id],
                        recommendation=f"{entity_id}를 Entity Registry에 추가하거나 매핑 테이블을 수정하세요"
                    ))
        
        for func_id, api_ids in self.mappings['function_to_api'].items():
            for api_id in api_ids:
                if api_id not in self.registries['apis']:
                    self.issues.append(Issue(
                        severity=Severity.HIGH,
                        category="Cross-Reference 무결성",
                        rule="Function → API 매핑 테이블",
                        description=f"매핑 테이블의 {api_id}가 API Registry에 존재하지 않습니다",
                        location="Function → Entity/API/NFR 매핑 테이블",
                        affected_ids=[api_id],
                        recommendation=f"{api_id}를 API Registry에 추가하거나 매핑 테이블을 수정하세요"
                    ))
        
        for func_id, nfr_ids in self.mappings['function_to_nfr'].items():
            for nfr_id in nfr_ids:
                if nfr_id not in self.registries['nfrs']:
                    self.issues.append(Issue(
                        severity=Severity.HIGH,
                        category="Cross-Reference 무결성",
                        rule="Function → NFR 매핑 테이블",
                        description=f"매핑 테이블의 {nfr_id}가 NFR Registry에 존재하지 않습니다",
                        location="Function → Entity/API/NFR 매핑 테이블",
                        affected_ids=[nfr_id],
                        recommendation=f"{nfr_id}를 NFR Registry에 추가하거나 매핑 테이블을 수정하세요"
                    ))
        
        # 본문에서 참조된 ID가 Registry에 존재하는지 검사
        for id_type, id_set in self.id_references_in_text.items():
            registry_name = id_type.lower()
            if id_type == 'D-P1':
                registry_name = 'decisions'
            elif id_type == 'SCR':
                registry_name = 'screens'
            elif id_type == 'FUNC':
                registry_name = 'functions'
            elif id_type == 'API':
                registry_name = 'apis'
            elif id_type == 'ENT':
                registry_name = 'entities'
            elif id_type == 'FLOW':
                registry_name = 'flows'
            elif id_type == 'NFR':
                registry_name = 'nfrs'
            
            registry = self.registries.get(registry_name, {})
            for ref_id in id_set:
                if ref_id not in registry:
                    self.issues.append(Issue(
                        severity=Severity.MEDIUM,
                        category="Cross-Reference 무결성",
                        rule="본문 ID 참조",
                        description=f"본문에서 참조된 {ref_id}가 {registry_name} Registry에 존재하지 않습니다",
                        location="PRD 본문",
                        affected_ids=[ref_id],
                        recommendation=f"{ref_id}를 {registry_name} Registry에 추가하거나 본문의 참조를 수정하세요"
                    ))
    
    def check_phase_logic(self):
        """Phase 1 범위 논리 검사"""
        # Function Registry 주석의 "총 N개"와 실제 Registry 개수 비교
        # NOTE: 문서에는 "총 10개 서비스 계정" 등 다른 '총 N개' 표현도 존재하므로,
        #       Function Registry 주석 라인에 한정하여 파싱한다.
        func_count_comment = re.search(
            r'>\s*주석:\s*Function Registry[^\n]*총\s*(\d+)\s*개',
            self.prd_content
        )
        if func_count_comment:
            stated_count = int(func_count_comment.group(1))
            actual_count = len(self.registries['functions'])
            if stated_count != actual_count:
                self.issues.append(Issue(
                    severity=Severity.MEDIUM,
                    category="Phase 범위 논리",
                    rule="Function Registry 개수 일치성",
                    description=f"주석에 명시된 Function 개수({stated_count}개)와 실제 Registry 개수({actual_count}개)가 일치하지 않습니다",
                    location="Function Registry 주석",
                    affected_ids=list(self.registries['functions'].keys()),
                    recommendation=f"주석을 {actual_count}개로 수정하거나 Registry를 확인하세요"
                ))
        
        # FRD 미작성 Function 언급 검사
        frd_unwritten_pattern = r'FRD 미작성 Function\(([^)]+)\)'
        frd_match = re.search(frd_unwritten_pattern, self.prd_content)
        if frd_match:
            unwritten_ids = [id.strip() for id in frd_match.group(1).split(',')]
            for func_id in unwritten_ids:
                if func_id not in self.registries['functions']:
                    self.issues.append(Issue(
                        severity=Severity.MEDIUM,
                        category="Phase 범위 논리",
                        rule="FRD 미작성 Function 존재 여부",
                        description=f"FRD 미작성으로 언급된 {func_id}가 Function Registry에 존재하지 않습니다",
                        location="Function Registry 주석",
                        affected_ids=[func_id],
                        recommendation=f"{func_id}를 Function Registry에 추가하거나 주석을 수정하세요"
                    ))
    
    def check_api_logic(self):
        """API 논리 검사"""
        # API Registry와 API 상세 명세의 1:1 대응성
        api_detail_pattern = r'#### API-(\d+):'
        api_detail_ids = set()
        for match in re.finditer(api_detail_pattern, self.prd_content):
            api_id = f"API-{match.group(1)}"
            api_detail_ids.add(api_id)
        
        registry_api_ids = set(self.registries['apis'].keys())
        
        # Registry에 있지만 상세 명세가 없는 API
        missing_details = registry_api_ids - api_detail_ids
        for api_id in missing_details:
            self.issues.append(Issue(
                severity=Severity.MEDIUM,
                category="API 논리",
                rule="API Registry ↔ 상세 명세 대응성",
                description=f"{api_id}가 API Registry에 있지만 상세 명세 섹션이 없습니다",
                location="API Registry",
                affected_ids=[api_id],
                recommendation=f"{api_id}의 상세 명세 섹션을 추가하세요"
            ))
        
        # 상세 명세가 있지만 Registry에 없는 API
        missing_registry = api_detail_ids - registry_api_ids
        for api_id in missing_registry:
            self.issues.append(Issue(
                severity=Severity.MEDIUM,
                category="API 논리",
                rule="API Registry ↔ 상세 명세 대응성",
                description=f"{api_id}의 상세 명세가 있지만 API Registry에 없습니다",
                location="API 상세 명세",
                affected_ids=[api_id],
                recommendation=f"{api_id}를 API Registry에 추가하세요"
            ))
        
        # 동일 엔드포인트/메서드 중복 검사
        endpoint_method_map = defaultdict(list)
        for api_id, api_data in self.registries['apis'].items():
            endpoint = api_data.get('endpoint', '')
            method = api_data.get('method', '')
            key = f"{method} {endpoint}"
            endpoint_method_map[key].append(api_id)
        
        for key, api_ids in endpoint_method_map.items():
            if len(api_ids) > 1:
                self.issues.append(Issue(
                    severity=Severity.HIGH,
                    category="API 논리",
                    rule="동일 엔드포인트/메서드 중복",
                    description=f"{key}가 {len(api_ids)}개의 API({', '.join(api_ids)})에서 중복 사용됩니다",
                    location="API Registry",
                    affected_ids=api_ids,
                    recommendation=f"엔드포인트 또는 메서드를 구분하거나 API를 통합하세요"
                ))
    
    def check_cross_validation(self):
        """IA/SPM ↔ PRD 교차검증"""
        # IA → PRD 커버리지
        unmapped_ia = []
        for ia_item in self.ia_items:
            func_id = ia_item['func_id']
            func_def = ia_item.get('func_definition', '')
            screen_id_ia = ia_item.get('screen_id', '')
            
            # 간단한 키워드 매칭으로 매핑 가능 여부 확인
            mapped = False
            for prd_func_id, prd_func_data in self.registries['functions'].items():
                func_name = prd_func_data.get('name', '')
                if any(keyword in func_def for keyword in func_name.split()):
                    mapped = True
                    break
            
            if not mapped and screen_id_ia:
                # Screen ID로 매핑 시도
                prd_screen_ids = [sid for sid in self.registries['screens'].keys() if screen_id_ia.lower() in sid.lower() or sid.lower() in screen_id_ia.lower()]
                if prd_screen_ids:
                    mapped = True
            
            if not mapped:
                unmapped_ia.append(ia_item)
        
        if unmapped_ia:
            unmapped_ids = [item['func_id'] for item in unmapped_ia[:10]]  # 최대 10개만
            self.issues.append(Issue(
                severity=Severity.HIGH,
                category="IA ↔ PRD 교차검증",
                rule="IA 기능 항목 미매핑",
                description=f"{len(unmapped_ia)}개의 IA 기능 항목이 PRD Function/Screen과 매핑되지 않습니다",
                location="output.json IA 1.0",
                affected_ids=unmapped_ids,
                recommendation=f"IA 항목을 PRD에 추가하거나 Phase 1 범위 외로 명시하세요"
            ))
        
        # SPM → PRD 커버리지
        unmapped_spm = []
        for spm_item in self.spm_items:
            policy_id = spm_item['policy_id']
            policy_intro = spm_item.get('policy_intro', '')
            
            # Decision Log와 매핑 시도
            mapped = False
            for decision_id, decision_data in self.registries['decisions'].items():
                decision_content = decision_data.get('content', '')
                if any(keyword in policy_intro for keyword in decision_content.split()[:5]):  # 처음 5개 단어만
                    mapped = True
                    break
            
            if not mapped:
                unmapped_spm.append(spm_item)
        
        if unmapped_spm:
            unmapped_ids = [item['policy_id'] for item in unmapped_spm[:10]]  # 최대 10개만
            self.issues.append(Issue(
                severity=Severity.HIGH,
                category="SPM ↔ PRD 교차검증",
                rule="SPM 정책 항목 미매핑",
                description=f"{len(unmapped_spm)}개의 SPM 정책 항목이 PRD Decision/NFR과 매핑되지 않습니다",
                location="output.json SPM 1.0",
                affected_ids=unmapped_ids,
                recommendation=f"SPM 정책을 PRD Decision Log에 추가하거나 범위 외로 명시하세요"
            ))
        
        # IA의 관련 정책 ID 공란 비율 분석
        empty_policy_refs = [item for item in self.ia_items if not item.get('policy_id', '').strip()]
        if empty_policy_refs:
            empty_ratio = len(empty_policy_refs) / len(self.ia_items) * 100 if self.ia_items else 0
            self.issues.append(Issue(
                severity=Severity.MEDIUM,
                category="정책 연결 무결성",
                rule="IA 관련 정책 ID 공란",
                description=f"IA 항목 중 {len(empty_policy_refs)}개({empty_ratio:.1f}%)의 '관련 정책 ID'가 비어있습니다",
                location="output.json IA 1.0",
                affected_ids=[item['func_id'] for item in empty_policy_refs[:10]],
                recommendation=f"관련 정책 ID를 채우거나 SPM 정책과 연결하세요"
            ))
    
    def generate_report(self) -> str:
        """리포트 생성"""
        report_lines = []
        report_lines.append("# PRD 심층점검 리포트")
        report_lines.append("")
        report_lines.append("**문서명**: ForwardMax 딜러 웹앱 PRD 심층점검 리포트")
        report_lines.append("**버전**: 1.0")
        report_lines.append(f"**검증 일자**: 2025-12-31")
        report_lines.append(f"**검증 범위**: PRD_Phase1_2025-12-31.md ↔ output.json")
        report_lines.append("")
        report_lines.append("---")
        report_lines.append("")
        
        # 실행 요약
        report_lines.append("## 1. 실행 요약")
        report_lines.append("")
        
        # Registry 개수 통계
        report_lines.append("### 1.1 Registry 개수 통계")
        report_lines.append("")
        report_lines.append("| Registry | 개수 |")
        report_lines.append("|---|---|")
        report_lines.append(f"| Flow | {len(self.registries['flows'])}개 |")
        report_lines.append(f"| Screen | {len(self.registries['screens'])}개 |")
        report_lines.append(f"| Function | {len(self.registries['functions'])}개 |")
        report_lines.append(f"| API | {len(self.registries['apis'])}개 |")
        report_lines.append(f"| Entity | {len(self.registries['entities'])}개 |")
        report_lines.append(f"| NFR | {len(self.registries['nfrs'])}개 |")
        report_lines.append(f"| Decision | {len(self.registries['decisions'])}개 |")
        report_lines.append("")
        
        # IA/SPM 개수 통계
        report_lines.append("### 1.2 output.json 개수 통계")
        report_lines.append("")
        report_lines.append("| 항목 | 개수 |")
        report_lines.append("|---|---|")
        report_lines.append(f"| IA 기능 항목 | {len(self.ia_items)}개 |")
        report_lines.append(f"| SPM 정책 항목 | {len(self.spm_items)}개 |")
        report_lines.append("")
        
        # 이슈 통계
        issue_counts = defaultdict(int)
        for issue in self.issues:
            issue_counts[issue.severity.value] += 1
        
        report_lines.append("### 1.3 이슈 통계")
        report_lines.append("")
        report_lines.append("| 우선순위 | 개수 |")
        report_lines.append("|---|---|")
        for severity in [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW]:
            count = issue_counts.get(severity.value, 0)
            report_lines.append(f"| {severity.value} | {count}개 |")
        report_lines.append(f"| **전체** | **{len(self.issues)}개** |")
        report_lines.append("")
        
        # 규칙별 점검 결과
        report_lines.append("## 2. 규칙별 점검 결과")
        report_lines.append("")
        
        categories = defaultdict(list)
        for issue in self.issues:
            categories[issue.category].append(issue)
        
        for category, category_issues in sorted(categories.items()):
            report_lines.append(f"### 2.{list(categories.keys()).index(category) + 1} {category}")
            report_lines.append("")
            
            for severity in [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW]:
                severity_issues = [i for i in category_issues if i.severity == severity]
                if severity_issues:
                    report_lines.append(f"#### {severity.value} ({len(severity_issues)}건)")
                    report_lines.append("")
                    
                    for idx, issue in enumerate(severity_issues[:20], 1):  # 최대 20개만
                        report_lines.append(f"**{idx}. {issue.rule}**")
                        report_lines.append("")
                        report_lines.append(f"- **설명**: {issue.description}")
                        if issue.location:
                            report_lines.append(f"- **위치**: {issue.location}")
                        if issue.affected_ids:
                            ids_str = ', '.join(issue.affected_ids[:5])  # 최대 5개만
                            if len(issue.affected_ids) > 5:
                                ids_str += f" 외 {len(issue.affected_ids) - 5}개"
                            report_lines.append(f"- **영향 ID**: {ids_str}")
                        if issue.recommendation:
                            report_lines.append(f"- **권장 수정**: {issue.recommendation}")
                        report_lines.append("")
        
        # 위험요인 우선순위 분류
        report_lines.append("## 3. 위험요인 우선순위 분류")
        report_lines.append("")
        
        for severity in [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW]:
            severity_issues = [i for i in self.issues if i.severity == severity]
            if severity_issues:
                report_lines.append(f"### 3.{severity.value}")
                report_lines.append("")
                report_lines.append("| 우선순위 | 위험요인 | 건수 | 상태 |")
                report_lines.append("|---|---|---|---|")
                
                category_counts = defaultdict(int)
                for issue in severity_issues:
                    category_counts[issue.category] += 1
                
                for category, count in sorted(category_counts.items()):
                    report_lines.append(f"| {severity.value} | {category} | {count}건 | 확인됨 |")
                report_lines.append("")
        
        # 권장 수정안
        report_lines.append("## 4. 권장 수정안")
        report_lines.append("")
        
        critical_high_issues = [i for i in self.issues if i.severity in [Severity.CRITICAL, Severity.HIGH]]
        if critical_high_issues:
            report_lines.append("### 4.1 즉시 수정 필요 (Critical/High)")
            report_lines.append("")
            
            for idx, issue in enumerate(critical_high_issues[:10], 1):  # 최대 10개만
                report_lines.append(f"{idx}. **{issue.rule}**")
                report_lines.append(f"   - 위치: {issue.location}")
                report_lines.append(f"   - 수정 방법: {issue.recommendation}")
                report_lines.append("")
        
        # 수정 체크리스트
        report_lines.append("## 5. 수정 체크리스트")
        report_lines.append("")
        report_lines.append("| 순서 | 항목 | 우선순위 | 상태 |")
        report_lines.append("|---|---|---|---|")
        
        checklist_items = []
        for severity in [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW]:
            severity_issues = [i for i in self.issues if i.severity == severity]
            for issue in severity_issues:
                checklist_items.append((severity, issue))
        
        for idx, (severity, issue) in enumerate(checklist_items[:30], 1):  # 최대 30개만
            report_lines.append(f"| {idx} | {issue.rule} | {severity.value} | - |")
        
        report_lines.append("")
        report_lines.append("---")
        report_lines.append("")
        report_lines.append("**검증 완료일**: 2025-12-31")
        report_lines.append("**검증 방법**: 자동화 스크립트 기반 규칙 검사")
        
        return '\n'.join(report_lines)

def main():
    validator = PRDDeepValidator(
        prd_path='PRD_Phase1_2025-12-31.md',
        output_json_path='output.json'
    )
    
    print("1. PRD 파싱 중...")
    validator.parse_prd()
    print(f"   - Flow: {len(validator.registries['flows'])}개")
    print(f"   - Screen: {len(validator.registries['screens'])}개")
    print(f"   - Function: {len(validator.registries['functions'])}개")
    print(f"   - API: {len(validator.registries['apis'])}개")
    print(f"   - Entity: {len(validator.registries['entities'])}개")
    print(f"   - NFR: {len(validator.registries['nfrs'])}개")
    print(f"   - Decision: {len(validator.registries['decisions'])}개")
    
    print("\n2. output.json 파싱 중...")
    validator.parse_output_json()
    print(f"   - IA 항목: {len(validator.ia_items)}개")
    print(f"   - SPM 항목: {len(validator.spm_items)}개")
    
    print("\n3. 무결성 규칙 검사 중...")
    validator.check_id_format()
    validator.check_uniqueness()
    validator.check_cross_references()
    print(f"   - 발견된 이슈: {len(validator.issues)}개")
    
    print("\n4. 논리 일치성 규칙 검사 중...")
    validator.check_phase_logic()
    validator.check_api_logic()
    print(f"   - 발견된 이슈: {len(validator.issues)}개")
    
    print("\n5. 교차검증 중...")
    validator.check_cross_validation()
    print(f"   - 발견된 이슈: {len(validator.issues)}개")
    
    print("\n6. 리포트 생성 중...")
    report = validator.generate_report()
    
    with open('PRD_심층점검_리포트.md', 'w', encoding='utf-8') as f:
        f.write(report)
    
    print("\n완료! 리포트가 PRD_심층점검_리포트.md에 저장되었습니다.")
    print(f"\n총 {len(validator.issues)}개의 이슈가 발견되었습니다.")

if __name__ == '__main__':
    main()

