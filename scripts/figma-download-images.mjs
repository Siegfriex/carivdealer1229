#!/usr/bin/env node
/**
 * Figma REST API로 노드 이미지를 다운로드해 src/shared/figma_image/ 에 저장.
 *
 * 사용: FIGMA_ACCESS_TOKEN=xxx node scripts/figma-download-images.mjs
 * 토큰: Figma Settings → Account → Personal access tokens
 * 상세: docs/figmaMCP/FIGMA_IMAGE_DOWNLOAD.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'src', 'shared', 'figma_image');

const FIGMA_FILE_KEY = '4w3ft8RpGwoho5EtvNO9hQ'; // Domestic-Seller 1.0

/** 노드 ID는 콜론 형식 (예: 1636:10134). 여러 개 시 배열에 추가 */
const NODE_IDS = [
  '1636:10134', // VehicleCard 카드 한 장
  '1636:10132', // 차량 placeholder 이미지 영역
];

async function main() {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    console.error('FIGMA_ACCESS_TOKEN 환경 변수를 설정하세요.');
    console.error('  Windows: set FIGMA_ACCESS_TOKEN=your_token');
    console.error('  Unix:    export FIGMA_ACCESS_TOKEN=your_token');
    process.exit(1);
  }

  const ids = NODE_IDS.join(',');
  const url = `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=1`;
  const res = await fetch(url, {
    headers: { 'X-Figma-Token': token },
  });

  if (!res.ok) {
    console.error('Figma API 오류:', res.status, await res.text());
    process.exit(1);
  }

  const data = await res.json();
  if (data.err) {
    console.error('Figma API err:', data.err);
    process.exit(1);
  }

  const images = data.images || {};
  if (Object.keys(images).length === 0) {
    console.error('반환된 이미지가 없습니다. node id 형식(1636:10134)과 파일 접근 권한을 확인하세요.');
    process.exit(1);
  }

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  for (const [nodeId, imageUrl] of Object.entries(images)) {
    if (!imageUrl) {
      console.warn(`노드 ${nodeId}: URL 없음 (렌더 불가 노드일 수 있음)`);
      continue;
    }
    const fileName = `${nodeId.replace(':', '-')}.png`;
    const filePath = path.join(OUT_DIR, fileName);
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      console.error(`다운로드 실패 ${nodeId}:`, imgRes.status);
      continue;
    }
    const buf = Buffer.from(await imgRes.arrayBuffer());
    fs.writeFileSync(filePath, buf);
    console.log('저장:', path.relative(ROOT, filePath));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
