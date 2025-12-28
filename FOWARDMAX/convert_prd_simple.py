#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
PRD를 HTML로 변환하여 Word에서 열 수 있도록 하는 간단한 스크립트
"""

import re
from pathlib import Path

def markdown_to_html(md_file_path, html_file_path):
    """마크다운을 HTML로 변환"""
    
    with open(md_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    html = []
    html.append('<!DOCTYPE html>')
    html.append('<html lang="ko">')
    html.append('<head>')
    html.append('<meta charset="UTF-8">')
    html.append('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
    html.append('<title>ForwardMax 딜러 웹앱 통합 설계 PRD</title>')
    html.append('<style>')
    html.append('body { font-family: "맑은 고딕", Malgun Gothic, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }')
    html.append('h1 { color: #0E162B; border-bottom: 3px solid #373EEF; padding-bottom: 10px; }')
    html.append('h2 { color: #373EEF; margin-top: 30px; }')
    html.append('h3 { color: #00F0FF; }')
    html.append('table { border-collapse: collapse; width: 100%; margin: 20px 0; }')
    html.append('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }')
    html.append('th { background-color: #373EEF; color: white; font-weight: bold; }')
    html.append('code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: Consolas, monospace; }')
    html.append('pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }')
    html.append('blockquote { border-left: 4px solid #00F0FF; padding-left: 20px; margin-left: 0; color: #666; }')
    html.append('</style>')
    html.append('</head>')
    html.append('<body>')
    
    lines = content.split('\n')
    in_table = False
    in_code = False
    code_lang = ''
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # 코드 블록
        if line.strip().startswith('```'):
            if in_code:
                html.append('</pre>')
                in_code = False
            else:
                code_lang = line.replace('```', '').strip()
                html.append('<pre><code>')
                in_code = True
            i += 1
            continue
        
        if in_code:
            html.append(line + '\n')
            i += 1
            continue
        
        # 제목
        if line.startswith('#'):
            level = len(line) - len(line.lstrip('#'))
            text = line.lstrip('# ').strip()
            # 볼드 제거
            text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
            html.append(f'<h{level}>{text}</h{level}>')
            i += 1
            continue
        
        # 테이블
        if '|' in line and not line.strip().startswith('|---'):
            if not in_table:
                html.append('<table>')
                in_table = True
            
            cells = [c.strip() for c in line.split('|') if c.strip()]
            if cells:
                html.append('<tr>')
                for cell in cells:
                    tag = 'th' if i == 0 or '---' in lines[i-1] if i > 0 else 'td'
                    html.append(f'<{tag}>{cell}</{tag}>')
                html.append('</tr>')
            i += 1
            continue
        
        if in_table and (not line.strip() or not '|' in line):
            html.append('</table>')
            in_table = False
        
        # 인용구
        if line.strip().startswith('>'):
            text = line.replace('>', '').strip()
            html.append(f'<blockquote>{text}</blockquote>')
            i += 1
            continue
        
        # 빈 줄
        if not line.strip():
            html.append('<br>')
            i += 1
            continue
        
        # 일반 텍스트 (볼드, 이탤릭, 링크 처리)
        text = line
        # 볼드
        text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
        # 이탤릭
        text = re.sub(r'\*(.+?)\*', r'<em>\1</em>', text)
        # 인라인 코드
        text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
        # 링크
        text = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'<a href="\2">\1</a>', text)
        
        html.append(f'<p>{text}</p>')
        i += 1
    
    if in_table:
        html.append('</table>')
    if in_code:
        html.append('</pre>')
    
    html.append('</body>')
    html.append('</html>')
    
    with open(html_file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(html))
    
    print(f"HTML 파일 생성 완료: {html_file_path}")
    print("Word에서 이 HTML 파일을 열고 '다른 이름으로 저장' → DOCX 형식으로 저장하세요.")

if __name__ == '__main__':
    input_file = 'PRD_Phase1_2025-12-31.md'
    output_file = 'PRD_Phase1_2025-12-31_최종.html'
    
    if not Path(input_file).exists():
        print(f"오류: {input_file} 파일을 찾을 수 없습니다.")
        exit(1)
    
    markdown_to_html(input_file, output_file)

