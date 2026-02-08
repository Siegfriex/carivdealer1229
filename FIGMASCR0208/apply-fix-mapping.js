/**
 * 스크린샷 검증 결과 반영: 잘못 매핑된 파일 이동·리네임
 * VERIFICATION_FIX_MAPPING.md 기준
 * 실행 순서: 단일 이동 → 스왑 → §3.4→§3.10 대량 이동
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const BASE = __dirname;

const S44 = '§3.4_차량목록';
const S45 = '§3.5_차량등록_상세_경매';
const S47 = '§3.7_일반판매';
const S410 = '§3.10_탁송';

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

function copy(srcRel, destRel) {
  const src = path.join(BASE, srcRel);
  const dest = path.join(BASE, destRel);
  if (!fs.existsSync(src)) {
    console.warn('Skip (missing):', srcRel);
    return false;
  }
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log('Copy:', path.basename(srcRel), '->', destRel);
  return true;
}

function run() {
  let ok = 0;

  // --- 1. §3.4 16327 → §3.5 (차량 등록 진입 에러) ---
  if (move(`${S44}/§3.4_1418-16327_차량목록_검색.png`, `${S45}/§3.5_1418-20498_차량등록진입_에러.png`)) ok++;

  // --- 2. §3.7 8153 → §3.5 (판매 가격/시작가 설정) ---
  if (move(`${S47}/§3.7_1425-8153_나의매물목록_전체_상태.png`, `${S45}/§3.5_1418-23705_경매_시작가설정_보정.png`)) ok++;
  if (move(`${S47}/§3.7_1425-8153_나의매물목록_전체_상태-1.png`, `${S45}/§3.5_1418-23705_경매_시작가설정_보정-1.png`)) ok++;

  // --- 3. 스왑: §3.10 29145 ↔ §3.7 8636 ---
  // 29145(내용=나의매물) → §3.7 8636_보정 / 8636(내용=탁송단계) → §3.10 29145
  // 29145(내용=나의매물) 보존을 위해 먼저 copy → 8636_보정, 그 다음 8636을 §3.10 29145로 move(덮어씀)
  if (copy(`${S410}/§3.10_1418-29145_물류스케줄목록_탁송단계.png`, `${S47}/§3.7_1425-8636_나의매물목록_탁송필터_보정.png`)) ok++;
  if (move(`${S47}/§3.7_1425-8636_나의매물목록_탁송필터.png`, `${S410}/§3.10_1418-29145_물류스케줄목록_탁송단계.png`)) ok++;

  // --- 4. §3.4 → §3.10 (새 탁송 예약 계열) ---
  const to310 = [
    ['§3.4_1418-15487_차량목록_기본.png', '§3.10_1418-25400_새탁송예약_폼.png'],
    ['§3.4_1418-15487_차량목록_기본-1.png', '§3.10_1418-25400_새탁송예약_폼-1.png'],
    ['§3.4_1418-15487_차량목록_기본-2.png', '§3.10_1418-25400_새탁송예약_폼-2.png'],
    ['§3.4_1418-15695_차량목록_전체탭.png', '§3.10_1418-26325_새탁송예약_월선택.png'],
    ['§3.4_1418-15695_차량목록_전체탭-1.png', '§3.10_1418-26325_새탁송예약_월선택-1.png'],
    ['§3.4_1418-15695_차량목록_전체탭-2.png', '§3.10_1418-26325_새탁송예약_월선택-2.png'],
    ['§3.4_1418-15565_차량목록_등록완료.png', '§3.10_1418-26583_새탁송예약_시간선택.png'],
    ['§3.4_1418-15565_차량목록_등록완료-1.png', '§3.10_1418-26583_새탁송예약_시간선택-1.png'],
    ['§3.4_1418-15565_차량목록_등록완료-2.png', '§3.10_1418-26583_새탁송예약_시간선택-2.png'],
    ['§3.4_1418-15565_차량목록_등록완료-3.png', '§3.10_1418-26583_새탁송예약_시간선택-3.png'],
    ['§3.4_1418-17357_차량목록_그리드.png', '§3.10_1418-26827_새탁송예약_주소검색.png'],
    ['§3.4_1418-17357_차량목록_그리드-1.png', '§3.10_1418-26827_새탁송예약_주소검색-1.png'],
    ['§3.4_1418-17357_차량목록_그리드-2.png', '§3.10_1418-26827_새탁송예약_주소검색-2.png'],
    ['§3.4_1418-17357_차량목록_그리드-3.png', '§3.10_1418-26827_새탁송예약_주소검색-3.png'],
    ['§3.4_1418-17357_차량목록_그리드-4.png', '§3.10_1418-26827_새탁송예약_주소검색-4.png'],
    ['§3.4_1418-20145_차량목록_리스트.png', '§3.10_1418-27070_새탁송예약_주소결과.png'],
    ['§3.4_1418-20145_차량목록_리스트-1.png', '§3.10_1418-27070_새탁송예약_주소결과-1.png'],
    ['§3.4_1418-15903_차량목록_임시저장.png', '§3.10_1418-25619_새탁송예약_일별달력.png'],
  ];
  for (const [from, to] of to310) {
    if (move(`${S44}/${from}`, `${S410}/${to}`)) ok++;
  }

  console.log('Done. Total operations:', ok);
}

run();
