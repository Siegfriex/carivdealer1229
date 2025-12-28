#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
PRD-IA-SPM 메타데이터 검증 및 매핑 스크립트
"""

import json
import re
from collections import defaultdict
from typing import Dict, List, Any

def parse_output_json(file_path: str) -> Dict[str, Any]:
    """output.json 파일 파싱"""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # IA 1.0 파싱
    ia_sheet = next((s for s in data['sheets'] if s['name'] == 'IA 1.0'), None)
    spm_sheet = next((s for s in data['sheets'] if s['name'] == 'SPM 1.0'), None)
    
    if not ia_sheet or not spm_sheet:
        raise ValueError("필요한 시트를 찾을 수 없습니다")
    
    # IA 항목 추출
    ia_items = []
    for row in ia_sheet['data']:
        func_id = row.get('System.Xml.XmlElement', '')
        if func_id and func_id.startswith('Seller-ia-front-'):
            item = {
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
                'empty_field_count': sum(1 for v in row.values() if v == '' or v == [] or (isinstance(v, list) and len(v) == 0))
            }
            ia_items.append(item)
    
    # SPM 항목 추출
    spm_items = []
    for row in spm_sheet['data']:
        policy_code = row.get('정책 코드', '')
        if policy_code and policy_code.startswith('dealer-sp-'):
            item = {
                'policy_id': policy_code,
                'policy_intro': row.get('정책 소개', ''),
                'policy_content': row.get('정책 내용', ''),
                'policy_category': row.get('정책분류', ''),
                'detail_item': row.get('세부 항목', ''),
                'empty_field_count': sum(1 for v in row.values() if v == '' or v == [] or (isinstance(v, list) and len(v) == 0))
            }
            spm_items.append(item)
    
    return {
        'ia_items': ia_items,
        'spm_items': spm_items,
        'ia_count': len(ia_items),
        'spm_count': len(spm_items)
    }

def parse_prd(file_path: str) -> Dict[str, Any]:
    """PRD 문서 파싱"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Function Registry 추출
    func_pattern = r'\|\s*(FUNC-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|'
    functions = []
    for match in re.finditer(func_pattern, content):
        func_id = match.group(1).strip()
        func_name = match.group(2).strip()
        func_desc = match.group(3).strip()
        functions.append({
            'id': func_id,
            'name': func_name,
            'description': func_desc
        })
    
    # Screen Registry 추출
    screen_pattern = r'\|\s*(SCR-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|'
    screens = []
    for match in re.finditer(screen_pattern, content):
        screen_id = match.group(1).strip()
        screen_name = match.group(2).strip()
        screen_role = match.group(3).strip()
        screens.append({
            'id': screen_id,
            'name': screen_name,
            'role': screen_role
        })
    
    # API Registry 추출
    api_pattern = r'\|\s*(API-\d+)\s*\|\s*([^|]+)\s*\|'
    apis = []
    for match in re.finditer(api_pattern, content):
        api_id = match.group(1).strip()
        api_desc = match.group(2).strip()
        apis.append({
            'id': api_id,
            'description': api_desc
        })
    
    # Entity Registry 추출
    entity_pattern = r'\|\s*(ENT-\d+)\s*\|\s*([^|]+)\s*\|'
    entities = []
    for match in re.finditer(entity_pattern, content):
        entity_id = match.group(1).strip()
        entity_name = match.group(2).strip()
        entities.append({
            'id': entity_id,
            'name': entity_name
        })
    
    # Flow Registry 추출
    flow_pattern = r'\|\s*(FLOW-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|'
    flows = []
    for match in re.finditer(flow_pattern, content):
        flow_id = match.group(1).strip()
        flow_name = match.group(2).strip()
        flow_desc = match.group(3).strip()
        flows.append({
            'id': flow_id,
            'name': flow_name,
            'description': flow_desc
        })
    
    # NFR Registry 추출
    nfr_pattern = r'\|\s*(NFR-\d+)\s*\|\s*([^|]+)\s*\|'
    nfrs = []
    for match in re.finditer(nfr_pattern, content):
        nfr_id = match.group(1).strip()
        nfr_desc = match.group(2).strip()
        nfrs.append({
            'id': nfr_id,
            'description': nfr_desc
        })
    
    # Decision Log 추출
    decision_pattern = r'\|\s*(D-[^|]+)\s*\|\s*([^|]+)\s*\|'
    decisions = []
    for match in re.finditer(decision_pattern, content):
        decision_id = match.group(1).strip()
        decision_content = match.group(2).strip()
        decisions.append({
            'id': decision_id,
            'content': decision_content
        })
    
    return {
        'functions': functions,
        'screens': screens,
        'apis': apis,
        'entities': entities,
        'flows': flows,
        'nfrs': nfrs,
        'decisions': decisions
    }

if __name__ == '__main__':
    # output.json 파싱
    print("output.json 파싱 중...")
    output_data = parse_output_json('output.json')
    print(f"IA 항목: {output_data['ia_count']}개")
    print(f"SPM 항목: {output_data['spm_count']}개")
    
    # PRD 파싱
    print("\nPRD 파싱 중...")
    prd_data = parse_prd('PRD_Phase1_2025-12-31.md')
    print(f"Functions: {len(prd_data['functions'])}개")
    print(f"Screens: {len(prd_data['screens'])}개")
    print(f"APIs: {len(prd_data['apis'])}개")
    print(f"Entities: {len(prd_data['entities'])}개")
    print(f"Flows: {len(prd_data['flows'])}개")
    print(f"NFRs: {len(prd_data['nfrs'])}개")
    print(f"Decisions: {len(prd_data['decisions'])}개")
    
    # 결과 저장
    result = {
        'output_json': output_data,
        'prd': prd_data
    }
    
    with open('parsed_data.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print("\n파싱 완료. 결과는 parsed_data.json에 저장되었습니다.")

