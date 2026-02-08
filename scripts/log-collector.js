/**
 * 매물등록 플로우 계측 로그 수집기.
 * 앱에서 fetch('http://127.0.0.1:7243/ingest/...') 로 보낸 페이로드를 파일에 기록.
 * 사용: node scripts/log-collector.js  (백그라운드 실행 후 npm run dev)
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.LOG_COLLECTOR_PORT) || 7244;
const LOG_DIR = path.join(process.cwd(), '.cursor');
const LOG_FILE = path.join(LOG_DIR, 'register-flow.log');

function ensureDir(dir) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (_) {}
}

function append(line) {
  ensureDir(LOG_DIR);
  fs.appendFileSync(LOG_FILE, line + '\n', 'utf8');
  console.log(line);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '', `http://127.0.0.1:${PORT}`);
  if (req.method === 'POST' && url.pathname.startsWith('/ingest/')) {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = body ? JSON.parse(body) : {};
        const ts = new Date().toISOString();
        const line = `[${ts}] ${payload.location || '-'} | ${payload.message || '-'} | ${JSON.stringify(payload.data || {})} | hypothesisId=${payload.hypothesisId || '-'} runId=${payload.runId || '-'}`;
        append(line);
      } catch (e) {
        append(`[${new Date().toISOString()}] PARSE_ERROR ${e.message} body=${body.slice(0, 200)}`);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.error(`[log-collector] listening http://127.0.0.1:${PORT} → ${LOG_FILE}`);
});
