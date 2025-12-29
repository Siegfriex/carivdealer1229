#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PRD 마크다운을 DOCX로 변환하는 스크립트
- 주석/부연설명/의존성을 각주로 변환
- 제목은 볼드체로 변환
"""

import re
import sys
from pathlib import Path

def preprocess_markdown(input_file, output_file):
    """마크다운 파일을 전처리하여 각주 형식으로 변환"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 각주 카운터
    footnote_counter = 1
    footnotes = []
    
    # 1. 주석 블록(> 참조:, > 주석:)을 각주로 변환
    def replace_comment(match):
        nonlocal footnote_counter
        comment_text = match.group(1).strip()
        # 백틱 제거
        comment_text = comment_text.replace('`', '')
        footnote_id = f"footnote_{footnote_counter}"
        footnotes.append(f"[^{footnote_id}]: {comment_text}")
        footnote_counter += 1
        return f"[^{footnote_id}]"
    
    # > 참조: 또는 > 주석: 패턴 찾기
    comment_pattern = r'>\s*(참조|주석|비고):\s*([^\n]+)'
    content = re.sub(comment_pattern, replace_comment, content)
    
    # 2. 표 내의 "비고" 컬럼도 각주로 변환 (간단한 패턴)
    # 표 내 비고는 그대로 유지하되, 필요시 수동 처리
    
    # 3. 제목에 볼드 적용 (pandoc은 기본적으로 제목 스타일을 사용하므로, 여기서는 마크다운 형식 유지)
    # 실제 볼드 처리는 DOCX 변환 후 스타일로 적용
    
    # 각주를 문서 끝에 추가
    if footnotes:
        content += "\n\n---\n\n## 각주\n\n"
        content += "\n\n".join(footnotes)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"전처리 완료: {output_file}")
    print(f"총 {len(footnotes)}개의 각주 생성됨")
    
    return output_file

def convert_with_pandoc(input_file, output_file):
    """pandoc을 사용하여 DOCX로 변환"""
    import subprocess
    
    # pandoc 명령어
    cmd = [
        'pandoc',
        input_file,
        '-o', output_file,
        '--reference-doc=reference.docx',  # 참조 문서가 있다면
        '--toc',  # 목차 생성
        '--toc-depth=3',  # 목차 깊이
        '--highlight-style=tango',  # 코드 하이라이트
        '--standalone',  # 독립 문서
    ]
    
    # reference.docx가 없으면 제거
    import os
    if not os.path.exists('reference.docx'):
        cmd.remove('--reference-doc=reference.docx')
    
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        print(f"DOCX 변환 완료: {output_file}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"변환 실패: {e.stderr}")
        return False
    except FileNotFoundError:
        print("pandoc이 설치되어 있지 않습니다.")
        print("설치 방법:")
        print("  Windows: choco install pandoc 또는 https://pandoc.org/installing.html")
        print("  또는 Python 패키지 사용: pip install pypandoc")
        return False

def convert_with_pypandoc(input_file, output_file):
    """pypandoc을 사용하여 DOCX로 변환"""
    try:
        import pypandoc
        pypandoc.convert_file(
            input_file,
            'docx',
            outputfile=output_file,
            extra_args=[
                '--toc',
                '--toc-depth=3',
                '--highlight-style=tango',
                '--standalone',
            ]
        )
        print(f"DOCX 변환 완료: {output_file}")
        return True
    except ImportError:
        print("pypandoc이 설치되어 있지 않습니다.")
        print("설치: pip install pypandoc")
        return False
    except Exception as e:
        print(f"변환 실패: {e}")
        return False

def main():
    input_file = Path('PRD_Phase1_2025-12-31.md')
    preprocessed_file = Path('PRD_Phase1_2025-12-31_preprocessed.md')
    output_file = Path('PRD_Phase1_2025-12-31.docx')
    
    if not input_file.exists():
        print(f"입력 파일을 찾을 수 없습니다: {input_file}")
        return
    
    # 1. 전처리
    print("마크다운 전처리 중...")
    preprocess_markdown(input_file, preprocessed_file)
    
    # 2. DOCX 변환 시도
    print("\nDOCX 변환 시도 중...")
    
    # 먼저 pypandoc 시도
    if convert_with_pypandoc(preprocessed_file, output_file):
        return
    
    # pypandoc 실패 시 pandoc 직접 시도
    if convert_with_pandoc(preprocessed_file, output_file):
        return
    
    print("\n변환 실패. 전처리된 마크다운 파일을 수동으로 변환하세요:")
    print(f"  pandoc {preprocessed_file} -o {output_file} --toc --toc-depth=3")

if __name__ == '__main__':
    main()



