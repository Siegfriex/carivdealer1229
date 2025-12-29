#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
output.json 파싱 스크립트
IA 1.0 및 SPM 1.0 시트의 모든 항목 추출
"""

import json
import re
from collections import defaultdict

def parse_output_json(file_path):
    """output.json 파일을 파싱하여 IA 및 SPM 데이터 추출"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 시트 찾기
    ia_sheet = None
    spm_sheet = None
    
    for sheet in data['sheets']:
        if sheet['name'] == 'IA 1.0':
            ia_sheet = sheet
        elif sheet['name'] == 'SPM 1.0':
            spm_sheet = sheet
    
    if not ia_sheet:
        raise ValueError("IA 1.0 시트를 찾을 수 없습니다")
    if not spm_sheet:
        raise ValueError("SPM 1.0 시트를 찾을 수 없습니다")
    
    # IA 1.0 파싱
    ia_items = []
    for row in ia_sheet['data']:
        # 필수 필드 확인
        if 'System.Xml.XmlElement' in row and row['System.Xml.XmlElement']:
            func_id = row['System.Xml.XmlElement']
            # Seller-ia-front- 형식인지 확인
            if func_id.startswith('Seller-ia-front-'):
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
                    'empty_fields': []
                }
                
                # 빈 필드 체크
                for key, value in row.items():
                    if value == '' or value == [] or (isinstance(value, list) and len(value) == 0):
                        item['empty_fields'].append(key)
                
                ia_items.append(item)
    
    # SPM 1.0 파싱
    spm_items = []
    for row in spm_sheet['data']:
        # 정책 ID 찾기 (System.Xml.XmlElement 필드에 있을 것으로 예상)
        policy_id = None
        policy_content = None
        
        # System.Xml.XmlElement 필드에서 정책 ID 찾기
        if 'System.Xml.XmlElement' in row:
            value = row['System.Xml.XmlElement']
            if isinstance(value, str) and value.startswith('dealer-sp-'):
                policy_id = value
        
        # 정책 내용 찾기 (다양한 필드명 시도)
        for key in ['정책 내용', '정책', '내용', 'Policy', 'Content']:
            if key in row and row[key]:
                policy_content = row[key]
                break
        
        if policy_id:
            item = {
                'policy_id': policy_id,
                'policy_content': policy_content or '',
                'category': row.get('카테고리', ''),
                'empty_fields': []
            }
            
            # 빈 필드 체크
            for key, value in row.items():
                if value == '' or value == [] or (isinstance(value, list) and len(value) == 0):
                    item['empty_fields'].append(key)
            
            spm_items.append(item)
    
    return {
        'ia_items': ia_items,
        'spm_items': spm_items,
        'ia_count': len(ia_items),
        'spm_count': len(spm_items)
    }

if __name__ == '__main__':
    result = parse_output_json('output.json')
    
    print(f"IA 1.0 항목 수: {result['ia_count']}")
    print(f"SPM 1.0 항목 수: {result['spm_count']}")
    
    # 샘플 출력
    if result['ia_items']:
        print("\n=== IA 1.0 샘플 (처음 3개) ===")
        for item in result['ia_items'][:3]:
            print(f"기능 ID: {item['func_id']}")
            print(f"화면 ID: {item['screen_id']}")
            print(f"기능 정의: {item['func_definition']}")
            print(f"Depth: {item['depth1']} > {item['depth2']} > {item['depth3']}")
            print()
    
    if result['spm_items']:
        print("\n=== SPM 1.0 샘플 (처음 3개) ===")
        for item in result['spm_items'][:3]:
            print(f"정책 ID: {item['policy_id']}")
            print(f"정책 내용: {item['policy_content'][:50] if item['policy_content'] else '(비어있음)'}")
            print()

