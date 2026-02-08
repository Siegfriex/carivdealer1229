/**
 * §3.1 랜딩 점검 결과 반영: GNB·맥락 기반 리네임·이동
 * VERIFICATION_§3.1_SCREEN_ANALYSIS.md 기준
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const BASE = __dirname;

const S31 = '§3.1_랜딩';
const S35 = '§3.5_차량등록_상세_경매';
const S37 = '§3.7_일반판매';
const S310 = '§3.10_탁송';

function move(srcRel, destRel) {
  const src = path.join(BASE, srcRel);
  const dest = path.join(BASE, destRel);
  if (!fs.existsSync(src)) {
    console.warn('Skip (missing):', srcRel);
    return false;
  }
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.renameSync(src, dest);
  console.log('OK:', path.basename(srcRel), '->', destRel);
  return true;
}

function rename(srcRel, newName) {
  const dir = path.dirname(srcRel);
  const destRel = dir ? path.join(dir, newName) : newName;
  return move(srcRel, destRel);
}

function run() {
  let ok = 0;

  // --- 1. §3.1 내 리네임: Hero중심_ref -> 로그인전_풀뷰 ---
  if (rename(path.join(S31, '§3.1_1368-37201_랜딩페이지_Hero중심_ref.png'), '§3.1_1368-37201_랜딩페이지_로그인전_풀뷰.png')) ok++;

  // --- 2. §3.1 -> §3.7 (나의 매물 목록 + 회원가입 유도) ---
  if (move(path.join(S31, '§3.1_1368-37201_랜딩페이지_내차팔기_ref.png'), path.join(S37, '§3.7_1425-8153_나의매물목록_회원가입유도.png'))) ok++;

  // --- 3. §3.1 -> §3.5 (시세 분석 중, 판매 전환 완료) ---
  if (move(path.join(S31, '§3.1_1368-37364_랜딩페이지_동일구조.png'), path.join(S35, '§3.5_1418-20498_차량등록진입_시세분석중.png'))) ok++;
  if (move(path.join(S31, '§3.1_1368-37364_랜딩페이지_동일구조-2.png'), path.join(S35, '§3.5_1418-20498_차량등록진입_시세분석중-1.png'))) ok++;
  if (move(path.join(S31, '§3.1_1368-37364_랜딩페이지_동일구조-1.png'), path.join(S35, '§3.5_1418-20576_판매전환완료.png'))) ok++;
  if (move(path.join(S31, '§3.1_1368-37364_랜딩페이지_동일구조-3.png'), path.join(S35, '§3.5_1418-20576_판매전환완료-1.png'))) ok++;

  // --- 4. §3.1 -> §3.10 (탁송 기사 배정 중) ---
  if (move(path.join(S31, '§3.1_1368-37364_랜딩페이지_동일구조-4.png'), path.join(S310, '§3.10_1418-25219_탁송_기사배정_진행중.png'))) ok++;

  console.log('Done. Total operations:', ok);
}

run();
