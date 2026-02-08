/**
 * FIGMASCR0208 검증 테이블 기준 폴더 생성 및 파일 이동
 * - 루트의 §3.x_*.png 파일을 섹션별 폴더로 이동 (파일명 유지)
 * - .md, .js 파일은 이동하지 않음
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const BASE = __dirname;

const SECTION_TO_FOLDER = {
  '§3.1': '§3.1_랜딩',
  '§3.2': '§3.2_회원가입',
  '§3.3': '§3.3_대시보드',
  '§3.4': '§3.4_차량목록',
  '§3.5': '§3.5_차량등록_상세_경매',
  '§3.6': '§3.6_검차',
  '§3.7': '§3.7_일반판매',
  '§3.8': '§3.8_마이페이지',
  '§3.10': '§3.10_탁송',
  '§3.11': '§3.11_정산',
};

function getFolderForFile(filename) {
  const match = filename.match(/^(§3\.\d+)_/);
  if (!match) return null;
  return SECTION_TO_FOLDER[match[1]] || null;
}

function run() {
  const files = fs.readdirSync(BASE);
  let moved = 0;
  let skipped = 0;
  let err = 0;

  for (const name of files) {
    if (!name.endsWith('.png')) {
      skipped++;
      continue;
    }
    const folder = getFolderForFile(name);
    if (!folder) {
      console.warn('Unknown section for:', name);
      skipped++;
      continue;
    }
    const dirPath = path.join(BASE, folder);
    const destPath = path.join(dirPath, name);
    const srcPath = path.join(BASE, name);

    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      if (path.dirname(srcPath) === path.dirname(destPath) && path.basename(srcPath) === path.basename(destPath)) {
        skipped++;
        continue;
      }
      fs.renameSync(srcPath, destPath);
      console.log('Moved:', name, '->', folder + '/');
      moved++;
    } catch (e) {
      console.error('Error', name, e.message);
      err++;
    }
  }

  console.log('Done. moved=%d skipped=%d err=%d', moved, skipped, err);
}

run();
