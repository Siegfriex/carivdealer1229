#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
output.json에서 IA 1.0 및 SPM 1.0의 모든 세부 항목 추출
PRD 업데이트를 위한 데이터 준비
"""

import json
from collections import defaultdict
from pathlib import Path

def extract_ia_items(file_path):
    """IA 1.0 시트의 모든 항목 추출"""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    ia_sheet = next((s for s in data['sheets'] if s['name'] == 'IA 1.0'), None)
    if not ia_sheet:
        return []
    
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
            }
            ia_items.append(item)
    
    return ia_items

def extract_spm_items(file_path):
    """SPM 1.0 시트의 모든 항목 추출"""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    spm_sheet = next((s for s in data['sheets'] if s['name'] == 'SPM 1.0'), None)
    if not spm_sheet:
        return []
    
    spm_items = []
    for row in spm_sheet['data']:
        # 정책 코드 찾기
        policy_code = row.get('정책 코드', '')
        if not policy_code:
            # 다른 필드에서 찾기 시도
            for key, value in row.items():
                if isinstance(value, str) and value.startswith('dealer-sp-'):
                    policy_code = value
                    break
        
        if policy_code and policy_code.startswith('dealer-sp-'):
            item = {
                'policy_id': policy_code,
                'policy_intro': row.get('정책 소개', ''),
                'policy_content': row.get('정책 내용', ''),
                'policy_category': row.get('정책분류', ''),
                'detail_item': row.get('세부 항목', ''),
            }
            spm_items.append(item)
    
    return spm_items

def group_by_category(items):
    """카테고리별로 그룹화"""
    grouped = defaultdict(list)
    for item in items:
        category = item.get('category', '') or item.get('depth1', '') or '기타'
        grouped[category].append(item)
    return grouped

def main():
    output_json_path = r'C:\carivdealer\FOWARDMAX\output.json'
    
    print("output.json 파싱 중...")
    ia_items = extract_ia_items(output_json_path)
    spm_items = extract_spm_items(output_json_path)
    
    print(f"\nIA 항목: {len(ia_items)}개")
    print(f"SPM 항목: {len(spm_items)}개")
    
    # 카테고리별 그룹화
    ia_by_category = group_by_category(ia_items)
    
    print("\n=== IA 카테고리별 분포 ===")
    for category, items in sorted(ia_by_category.items()):
        print(f"{category}: {len(items)}개")
    
    # 결과를 JSON으로 저장
    result = {
        'ia_items': ia_items,
        'spm_items': spm_items,
        'ia_by_category': {k: len(v) for k, v in ia_by_category.items()}
    }
    
    output_path = r'C:\carivdealer\FOWARDMAX\output_json_extracted.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"\n추출 결과 저장: {output_path}")
    
    # 샘플 출력
    print("\n=== IA 샘플 (처음 5개) ===")
    for item in ia_items[:5]:
        print(f"- {item['func_id']}: {item['func_definition'][:50]}...")
    
    print("\n=== SPM 샘플 (처음 5개) ===")
    for item in spm_items[:5]:
        print(f"- {item['policy_id']}: {item['policy_intro'][:50] if item['policy_intro'] else '(정책 소개 없음)'}...")

if __name__ == '__main__':
    main()

