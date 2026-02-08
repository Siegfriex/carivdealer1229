/**
 * §3.10 탁송 폴더 재분류 — VERIFICATION_§3.10_RECLASSIFY.md 기준
 * 1) 이동 10건 (§3.5, §3.6, §3.7) 2) §3.10 내 리네임 2건
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const BASE = __dirname;
const S310 = path.join(BASE, '§3.10_탁송');
const S35 = path.join(BASE, '§3.5_차량등록_상세_경매');
const S36 = path.join(BASE, '§3.6_검차');
const S37 = path.join(BASE, '§3.7_일반판매');

function move(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn('Skip (missing):', src);
    return false;
  }
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.renameSync(src, dest);
  console.log('OK:', path.basename(src), '->', path.relative(BASE, dest));
  return true;
}

let ok = 0;

// --- 1. §3.10 → §3.6, §3.7, §3.5 이동 ---
if (move(path.join(S310, '§3.10_1418-27070_새탁송예약_주소결과-1.png'), path.join(S36, '§3.6_1444-8198_검차신청_Step1_변형.png'))) ok++;
if (move(path.join(S310, '§3.10_1418-26325_새탁송예약_월선택-1.png'), path.join(S36, '§3.6_1425-10137_검차진행_매칭중_변형.png'))) ok++;
if (move(path.join(S310, '§3.10_1418-26325_새탁송예약_월선택-2.png'), path.join(S37, '§3.7_1425-8153_나의매물목록_전체.png'))) ok++;
if (move(path.join(S310, '§3.10_1418-26583_새탁송예약_시간선택-1.png'), path.join(S35, '§3.5_1418-20498_차량등록_비대면_랜딩.png'))) ok++;
if (move(path.join(S310, '§3.10_1418-26583_새탁송예약_시간선택-2.png'), path.join(S35, '§3.5_1418-20498_차량등록_원부등록-1.png'))) ok++;
if (move(path.join(S310, '§3.10_1418-26583_새탁송예약_시간선택-3.png'), path.join(S35, '§3.5_1418-20498_차량등록_원부등록-2.png'))) ok++;
if (move(path.join(S310, '§3.10_1418-26827_새탁송예약_주소검색-1.png'), path.join(S36, '§3.6_1425-10813_검차진행_완료.png'))) ok++;
if (move(path.join(S310, '§3.10_1418-26827_새탁송예약_주소검색-2.png'), path.join(S35, '§3.5_1418-22630_판매_거래목록_그리드뷰-1.png'))) ok++;
if (move(path.join(S310, '§3.10_1418-26827_새탁송예약_주소검색-3.png'), path.join(S35, '§3.5_1418-22630_판매_거래목록_그리드뷰-2.png'))) ok++;
if (move(path.join(S310, '§3.10_1418-25400_새탁송예약_폼-2.png'), path.join(S36, '§3.6_1425-10285_검차결과요약_변형.png'))) ok++;

// --- 2. §3.10 내 리네임 ---
if (move(path.join(S310, '§3.10_1418-26827_새탁송예약_주소검색-4.png'), path.join(S310, '§3.10_1418-28880_탁송목록_그리드탭.png'))) ok++;
if (move(path.join(S310, '§3.10_1418-25619_새탁송예약_일별달력.png'), path.join(S310, '§3.10_1418-26325_새탁송예약_월선택_변형.png'))) ok++;

console.log('Done. Total operations:', ok);
