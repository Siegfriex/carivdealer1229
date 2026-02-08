/**
 * A/B/C 에이전트 보고 + 확인필요 10건 반영 — 이동·리네임 일괄 적용
 * APPLY_AGENT_REPORTS_MAPPING.md 기준. 실행 순서: 이동 → §3.5 임시→24679→22630 → 기타 리네임
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const BASE = __dirname;

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

function run() {
  let ok = 0;
  const S32 = '§3.2_회원가입';
  const S34 = '§3.4_차량목록';
  const S35 = '§3.5_차량등록_상세_경매';
  const S36 = '§3.6_검차';
  const S37 = '§3.7_일반판매';
  const S311 = '§3.11_정산';

  // --- 1. 이동 (다른 폴더) ---
  if (move(path.join(S34, '§3.4_1418-16111_차량목록_확인필요.png'), path.join(S35, '§3.5_1418-20576_차량등록완료_확인.png'))) ok++;
  if (move(path.join(S34, '§3.4_1418-16684_차량목록_페이지네이션.png'), path.join(S36, '§3.6_1425-9445_검차요청내역_리스트.png'))) ok++;
  if (move(path.join(S34, '§3.4_1418-16860_차량목록_Empty.png'), path.join(S36, '§3.6_1425-9445_검차요청내역_리스트_변형.png'))) ok++;
  if (move(path.join(S34, '§3.4_1418-17036_차량목록_필터바.png'), path.join(S36, '§3.6_1425-10137_검차진행_매칭중.png'))) ok++;
  if (move(path.join(S34, '§3.4_1418-17196_차량목록_정렬.png'), path.join(S36, '§3.6_1425-10285_검차결과요약.png'))) ok++;
  if (move(path.join(S34, '§3.4_1418-17629_차량목록_카드_상태.png'), path.join(S36, '§3.6_1425-9875_검차요청내역_카드뷰.png'))) ok++;
  if (move(path.join(S36, '§3.6_1444-8198_검차신청_Step1.png'), path.join(S37, '§3.7_1425-8420_나의매물목록_검차필터_카드뷰.png'))) ok++;

  // --- 2. §3.2 리네임 ---
  if (move(path.join(S32, '§3.2_1513-12032_회원가입_Step1-1.png'), path.join(S32, '§3.2_1425-7280_로그인.png'))) ok++;
  if (move(path.join(S32, '§3.2_1425-7613_회원가입진입_ref.png'), path.join(S32, '§3.2_1513-12032_회원가입_Step1_ref.png'))) ok++;
  if (move(path.join(S32, '§3.2_ref_ver2.png'), path.join(S32, '§3.2_1425-7613_회원가입진입.png'))) ok++;

  // --- 3. §3.5 24679 → 임시 ---
  if (move(path.join(S35, '§3.5_1418-24679_거래상세.png'), path.join(S35, '§3.5_1418-_tmp_24679_1.png'))) ok++;
  if (move(path.join(S35, '§3.5_1418-24679_거래상세-1.png'), path.join(S35, '§3.5_1418-_tmp_24679_2.png'))) ok++;
  if (move(path.join(S35, '§3.5_1418-24679_거래상세-2.png'), path.join(S35, '§3.5_1418-_tmp_24679_3.png'))) ok++;

  // --- 4. §3.5 22630 → 24679_거래상세_변형 ---
  if (move(path.join(S35, '§3.5_1418-22630_판매_거래목록.png'), path.join(S35, '§3.5_1418-24679_거래상세_변형.png'))) ok++;
  for (let i = 1; i <= 13; i++) {
    const n = i === 1 ? '' : `-${i}`;
    if (move(path.join(S35, `§3.5_1418-22630_판매_거래목록${n}.png`), path.join(S35, `§3.5_1418-24679_거래상세_변형-${i}.png`))) ok++;
  }

  // --- 5. §3.5 임시 → 22630_목록뷰 ---
  if (move(path.join(S35, '§3.5_1418-_tmp_24679_1.png'), path.join(S35, '§3.5_1418-22630_판매_거래목록_목록뷰.png'))) ok++;
  if (move(path.join(S35, '§3.5_1418-_tmp_24679_2.png'), path.join(S35, '§3.5_1418-22630_판매_거래목록_목록뷰-1.png'))) ok++;
  if (move(path.join(S35, '§3.5_1418-_tmp_24679_3.png'), path.join(S35, '§3.5_1418-22630_판매_거래목록_목록뷰-2.png'))) ok++;

  // --- 6. §3.5 20498 시세로딩 → 판매방식선택 ---
  if (move(path.join(S35, '§3.5_1418-20498_차량등록진입_시세로딩.png'), path.join(S35, '§3.5_1418-20498_판매방식선택.png'))) ok++;
  if (move(path.join(S35, '§3.5_1418-20498_차량등록진입_시세로딩-1.png'), path.join(S35, '§3.5_1418-20498_판매방식선택-1.png'))) ok++;

  // --- 7. §3.7 리네임 ---
  if (move(path.join(S37, '§3.7_1425-8420_나의매물목록_검차필터.png'), path.join(S37, '§3.7_1425-12046_나의매물목록_판매거래_탭.png'))) ok++;

  // --- 8. §3.11 리네임 ---
  if (move(path.join(S311, '§3.11_1418-27657_정산상세.png'), path.join(S311, '§3.11_1418-36405_정산목록_정산필터카드뷰.png'))) ok++;
  if (move(path.join(S311, '§3.11_1418-36405_정산목록-1.png'), path.join(S311, '§3.11_1418-27434_정산현황_검차피드백.png'))) ok++;
  if (move(path.join(S311, '§3.11_1418-36405_정산목록-2.png'), path.join(S311, '§3.11_1418-27434_정산현황_검차피드백-1.png'))) ok++;

  console.log('Done. Total operations:', ok);
}

run();
