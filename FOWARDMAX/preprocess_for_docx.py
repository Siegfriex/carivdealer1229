#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PRD 마크다운을 DOCX 변환용으로 전처리
- 주석/부연설명/의존성을 각주로 변환
- pandoc 각주 형식([^note]) 사용
"""

import re
from pathlib import Path

def preprocess_markdown(input_file, output_file):
    """마크다운 파일을 전처리하여 각주 형식으로 변환"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    footnote_counter = 1
    footnotes = []
    footnote_dict = {}  # 중복 방지
    
    def get_footnote_id(text):
        """텍스트에 대한 각주 ID 반환 (중복 방지)"""
        # 백틱 제거 및 정리
        clean_text = text.replace('`', '').strip()
        if clean_text in footnote_dict:
            return footnote_dict[clean_text]
        nonlocal footnote_counter
        footnote_id = f"note{footnote_counter}"
        footnote_dict[clean_text] = footnote_id
        footnotes.append((footnote_id, clean_text))
        footnote_counter += 1
        return footnote_id
    
    new_lines = []
    i = 0
    in_table = False
    prev_line_was_table = False
    
    while i < len(lines):
        line = lines[i]
        original_line = line
        
        # 표 감지
        if '|' in line and not line.strip().startswith('|---'):
            in_table = True
            prev_line_was_table = True
        elif line.strip() == '' and prev_line_was_table:
            in_table = False
            prev_line_was_table = False
        
        # 1. > 참조: ... 형식을 각주로 변환
        if line.strip().startswith('> 참조:'):
            ref_text = line.replace('> 참조:', '').strip()
            footnote_id = get_footnote_id(f"참조: {ref_text}")
            # 이전 줄 끝에 각주 추가
            if new_lines and new_lines[-1].strip():
                new_lines[-1] = new_lines[-1].rstrip() + f" [^{footnote_id}]\n"
            else:
                new_lines.append(f"[^{footnote_id}]\n")
            i += 1
            continue
        
        # 2. > 주석: ... 형식을 각주로 변환
        if line.strip().startswith('> 주석:'):
            note_text = line.replace('> 주석:', '').strip()
            footnote_id = get_footnote_id(f"주석: {note_text}")
            # 이전 줄 끝에 각주 추가
            if new_lines and new_lines[-1].strip():
                new_lines[-1] = new_lines[-1].rstrip() + f" [^{footnote_id}]\n"
            else:
                new_lines.append(f"[^{footnote_id}]\n")
            i += 1
            continue
        
        # 3. > 비고: ... 형식을 각주로 변환
        if line.strip().startswith('> 비고:'):
            note_text = line.replace('> 비고:', '').strip()
            footnote_id = get_footnote_id(f"비고: {note_text}")
            # 이전 줄 끝에 각주 추가
            if new_lines and new_lines[-1].strip():
                new_lines[-1] = new_lines[-1].rstrip() + f" [^{footnote_id}]\n"
            else:
                new_lines.append(f"[^{footnote_id}]\n")
            i += 1
            continue
        
        # 4. 표 내의 "소스(근거 문서)" 필드 처리
        if in_table and '|' in line and '소스(근거 문서)' not in line:
            parts = line.split('|')
            # 마지막 컬럼이 소스인 경우
            if len(parts) > 1:
                last_col = parts[-1].strip()
                # 백틱이 있는 경우 (파일명 참조)
                if '`' in last_col or '참조' in last_col or 'Section' in last_col:
                    ref_text = last_col.replace('`', '').strip()
                    if ref_text:
                        footnote_id = get_footnote_id(f"참조: {ref_text}")
                        parts[-1] = f" [^{footnote_id}]"
                        line = '|'.join(parts)
        
        new_lines.append(line)
        i += 1
    
    # 각주를 문서 끝에 추가
    if footnotes:
        new_lines.append("\n\n---\n\n## 각주\n\n")
        for footnote_id, footnote_text in footnotes:
            new_lines.append(f"[^{footnote_id}]: {footnote_text}\n")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"전처리 완료: {output_file}")
    print(f"총 {len(footnotes)}개의 각주 생성됨")
    
    return output_file

if __name__ == '__main__':
    input_file = Path('PRD_Phase1_2025-12-31.md')
    output_file = Path('PRD_Phase1_2025-12-31_preprocessed.md')
    
    if not input_file.exists():
        print(f"입력 파일을 찾을 수 없습니다: {input_file}")
    else:
        preprocess_markdown(input_file, output_file)
        print(f"\n다음 명령어로 DOCX 변환:")
        print(f"pandoc {output_file} -o PRD_Phase1_2025-12-31.docx --toc --toc-depth=3 --standalone")



