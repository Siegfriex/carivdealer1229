# -*- coding: utf-8 -*-
"""
마크다운 파일을 각주를 추가하고 소제목을 볼드 처리한 후 docx로 변환하는 스크립트
"""

import re

def process_markdown(input_file, output_file):
    """마크다운 파일을 처리하여 각주 추가 및 소제목 볼드 처리"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    footnote_counter = 1
    footnotes = []
    footnote_dict = {}
    
    def get_footnote_id(text):
        """텍스트에 대한 각주 ID 반환 (중복 방지)"""
        if text in footnote_dict:
            return footnote_dict[text]
        nonlocal footnote_counter
        footnote_id = footnote_counter
        footnote_dict[text] = footnote_id
        footnotes.append((footnote_id, text))
        footnote_counter += 1
        return footnote_id
    
    # 줄 단위로 처리
    lines = content.split('\n')
    new_lines = []
    i = 0
    in_table = False
    table_header_index = -1
    
    while i < len(lines):
        line = lines[i]
        original_line = line
        
        # 표 시작/끝 감지
        if '|' in line and not line.strip().startswith('|---'):
            in_table = True
            # 헤더 행 찾기
            if '소스(근거 문서)' in line:
                table_header_index = len(new_lines)
        elif line.strip() == '' and in_table:
            in_table = False
            table_header_index = -1
        
        # 1. > 참조: ... 형식을 각주로 변환
        if line.strip().startswith('> 참조:'):
            ref_text = line.replace('> 참조:', '').strip()
            footnote_id = get_footnote_id(f"참조: {ref_text}")
            new_lines.append(f"[^{footnote_id}]")
            i += 1
            continue
        
        # 2. > 주석: ... 형식을 각주로 변환
        if line.strip().startswith('> 주석:'):
            note_text = line.replace('> 주석:', '').strip()
            footnote_id = get_footnote_id(f"주석: {note_text}")
            new_lines.append(f"[^{footnote_id}]")
            i += 1
            continue
        
        # 3. 표 내의 "소스(근거 문서)" 필드 처리
        if in_table and '|' in line and table_header_index >= 0:
            parts = [p.strip() for p in line.split('|')]
            # 빈 부분 제거
            parts = [p for p in parts if p]
            
            # 헤더 행 찾기
            header_line = lines[table_header_index] if table_header_index < len(lines) else ''
            header_parts = [p.strip() for p in header_line.split('|')]
            header_parts = [p for p in header_parts if p]
            
            if '소스(근거 문서)' in header_parts:
                source_col_index = header_parts.index('소스(근거 문서)')
                if source_col_index < len(parts):
                    source_value = parts[source_col_index]
                    if source_value and source_value != '소스(근거 문서)' and not re.search(r'\[\^\d+\]', source_value):
                        footnote_id = get_footnote_id(f"소스(근거 문서): {source_value}")
                        parts[source_col_index] = f"{source_value} [^{footnote_id}]"
                        # 원래 형식 유지하면서 재구성
                        line_parts = original_line.split('|')
                        if len(line_parts) > source_col_index + 1:
                            line_parts[source_col_index + 1] = f" {parts[source_col_index]} "
                            line = '|'.join(line_parts)
        
        # 4. 소제목(##, ###, ####)을 볼드 처리
        heading_match = re.match(r'^(#{2,4})\s+(.+?)$', line)
        if heading_match:
            level = heading_match.group(1)
            title = heading_match.group(2).strip()
            # 이미 볼드가 아닌 경우만 처리
            if not (title.startswith('**') and title.endswith('**')):
                line = f"{level} **{title}**"
        
        new_lines.append(line)
        i += 1
    
    content = '\n'.join(new_lines)
    
    # 5. 목차 항목도 볼드 처리
    toc_start = content.find('## 목차')
    if toc_start != -1:
        toc_end = content.find('---', toc_start)
        if toc_end == -1:
            toc_end = len(content)
        
        toc_section = content[toc_start:toc_end]
        # 목차 항목 볼드 처리
        toc_section = re.sub(r'(\d+\.)\s+\[(.+?)\]\((.+?)\)', r'\1 [**\2**](\3)', toc_section)
        content = content[:toc_start] + toc_section + content[toc_end:]
    
    # 6. 각주 정의 추가 (문서 끝에)
    if footnotes:
        content += '\n\n---\n\n## 각주\n\n'
        for footnote_id, footnote_text in sorted(footnotes, key=lambda x: x[0]):
            content += f"[^{footnote_id}]: {footnote_text}\n\n"
    
    # 처리된 내용 저장
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"처리 완료: {len(footnotes)}개의 각주 추가됨")
    return output_file

if __name__ == '__main__':
    input_file = r'C:\fowardmax\PRD_Phase1_2025-12-31 copy 2.md'
    temp_md_file = r'C:\fowardmax\PRD_Phase1_2025-12-31_copy2_processed.md'
    
    print("마크다운 파일 처리 중...")
    process_markdown(input_file, temp_md_file)
    print(f"처리된 마크다운 파일 저장: {temp_md_file}")



