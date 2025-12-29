# -*- coding: utf-8 -*-
"""
마크다운 파일을 각주를 추가하고 소제목을 볼드 처리한 후 docx로 변환하는 스크립트
"""

import re
import subprocess
import sys

def process_markdown(input_file, output_file):
    """마크다운 파일을 처리하여 각주 추가 및 소제목 볼드 처리"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    footnote_counter = 1
    footnotes = []
    
    # 각주 딕셔너리 (중복 방지)
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
    
    while i < len(lines):
        line = lines[i]
        
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
        if '|' in line and '소스(근거 문서)' in line:
            parts = line.split('|')
            if len(parts) >= 3:
                # 헤더 행인지 확인
                if '소스(근거 문서)' in parts[0] or '소스(근거 문서)' in parts[1]:
                    new_lines.append(line)
                    i += 1
                    continue
                
                # 데이터 행 처리
                for j, part in enumerate(parts):
                    if '소스(근거 문서)' in parts[j-1] if j > 0 else False:
                        source_value = part.strip()
                        if source_value and not re.search(r'\[\^\d+\]', source_value):
                            footnote_id = get_footnote_id(f"소스(근거 문서): {source_value}")
                            parts[j] = f" {source_value} [^{footnote_id}] "
                            line = '|'.join(parts)
                            break
                    # 또는 이전 행이 헤더인 경우
                    elif j > 0 and '소스(근거 문서)' in new_lines[-1] if new_lines else False:
                        source_value = part.strip()
                        if source_value and not re.search(r'\[\^\d+\]', source_value) and source_value:
                            footnote_id = get_footnote_id(f"소스(근거 문서): {source_value}")
                            parts[j] = f" {source_value} [^{footnote_id}] "
                            line = '|'.join(parts)
                            break
        
        # 4. 소제목(##, ###, ####)을 볼드 처리
        heading_match = re.match(r'^(#{2,4})\s+(.+?)$', line)
        if heading_match:
            level = heading_match.group(1)
            title = heading_match.group(2).strip()
            # 이미 볼드가 아닌 경우만 처리
            if not title.startswith('**') and not title.endswith('**'):
                new_lines.append(f"{level} **{title}**")
            else:
                new_lines.append(line)
            i += 1
            continue
        
        new_lines.append(line)
        i += 1
    
    content = '\n'.join(new_lines)
    
    # 5. 목차 항목도 볼드 처리 (목차 섹션 내)
    toc_start = content.find('## 목차')
    if toc_start != -1:
        toc_end = content.find('---', toc_start)
        if toc_end == -1:
            toc_end = len(content)
        
        toc_section = content[toc_start:toc_end]
        # 목차 항목 볼드 처리: 숫자. [텍스트](링크) 형식
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
    
    return output_file

def convert_to_docx(md_file, docx_file):
    """pandoc을 사용하여 마크다운을 docx로 변환"""
    try:
        cmd = [
            'pandoc',
            md_file,
            '-o', docx_file,
            '--reference-doc=reference.docx' if False else '',  # 참조 문서가 있으면 사용
            '--toc',  # 목차 생성
            '--toc-depth=3',  # 목차 깊이
            '--highlight-style=tango',  # 코드 하이라이트 스타일
        ]
        # 빈 문자열 제거
        cmd = [c for c in cmd if c]
        
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
        
        if result.returncode != 0:
            print(f"Pandoc 오류: {result.stderr}")
            return False
        return True
    except FileNotFoundError:
        print("Pandoc이 설치되어 있지 않습니다. Pandoc을 설치해주세요.")
        return False

if __name__ == '__main__':
    input_file = r'C:\fowardmax\PRD_Phase1_2025-12-31 copy 2.md'
    temp_md_file = r'C:\fowardmax\PRD_Phase1_2025-12-31_copy2_processed.md'
    output_file = r'C:\fowardmax\PRD_Phase1_2025-12-31 copy 2.docx'
    
    print("마크다운 파일 처리 중...")
    process_markdown(input_file, temp_md_file)
    print(f"처리된 마크다운 파일 저장: {temp_md_file}")
    
    print("DOCX로 변환 중...")
    if convert_to_docx(temp_md_file, output_file):
        print(f"변환 완료: {output_file}")
    else:
        print("변환 실패. 처리된 마크다운 파일을 확인하세요.")

