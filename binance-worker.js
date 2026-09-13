/* ---------------------------------------------------------------------------
   binance-worker.js — Cloudflare Worker cho FinTrace

   VÌ SAO CẦN: Binance chặn CORS với các endpoint cần chữ ký, nên trình duyệt
   không gọi thẳng GET /api/v3/account được. Worker này đứng giữa: FinTrace gọi
   Worker, Worker ký rồi gọi Binance.

   NÓ CHỈ LÀM ĐÚNG MỘT VIỆC: đọc số dư. Không có đường dẫn nào đặt lệnh, rút
   tiền hay chuyển tiền. Đường dẫn duy nhất được nhận là GET /account.

   KHOÁ NẰM Ở ĐÂU: BINANCE_KEY và BINANCE_SECRET là biến bí mật của Worker
   (Settings → Variables and Secrets → Type: Secret). Chúng không nằm trong
   repo, không nằm trên Firestore, và không bao giờ được gửi về trình duyệt.

   AI GỌI ĐƯỢC: chỉ ai biết ACCESS_TOKEN. FinTrace gửi token đó trong header
   Authorization. Token này lưu trên Firestore — lộ token cũng chỉ đọc được số
   dư, không làm gì thêm được.

   Hướng dẫn dựng từng bước: xem BINANCE.md.
   --------------------------------------------------------------------------- */

const BINANCE_BASE = 'https://api.binance.com';
const RECV_WINDOW = 10000;
const TIMEOUT_MS = 12000;

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOW_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };
    const json = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'GET') return json({ error: 'Worker chỉ nhận GET' }, 405);

    const path = new URL(request.url).pathname.replace(/\/+$/, '') || '/';
    if (path !== '/account') return json({ error: 'Worker chỉ có đường dẫn /account' }, 404);

    if (!env.ACCESS_TOKEN) return json({ error: 'Worker chưa đặt biến ACCESS_TOKEN' }, 500);
    const sent = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
    if (!safeEqual(sent, env.ACCESS_TOKEN)) return json({ error: 'Sai mã truy cập' }, 401);
    if (!env.BINANCE_KEY || !env.BINANCE_SECRET)
      return json({ error: 'Worker chưa đặt biến BINANCE_KEY hoặc BINANCE_SECRET' }, 500);

    const query = `recvWindow=${RECV_WINDOW}&timestamp=${Date.now()}`;
    const signature = await sign(query, env.BINANCE_SECRET);

    let res;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
    try {
      res = await fetch(`${BINANCE_BASE}/api/v3/account?${query}&signature=${signature}`, {
        headers: { 'X-MBX-APIKEY': env.BINANCE_KEY },
        signal: ctl.signal,
      });
    } catch (e) {
      return json({ error: 'Worker không gọi được Binance: ' + (e.name === 'AbortError' ? 'quá hạn chờ' : e.message) }, 502);
    } finally {
      clearTimeout(timer);
    }

    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch (e) { /* Binance trả về thứ không phải JSON */ }

    if (!res.ok) {
      const msg = (data && data.msg) || text.slice(0, 200) || 'không rõ lý do';
      return json({ error: `Binance từ chối (HTTP ${res.status}): ${msg}`, binanceStatus: res.status }, 502);
    }

    /* Chỉ trả về số dư khác 0 — không đưa ra ngoài nhiều hơn mức FinTrace cần. */
    const balances = (data && Array.isArray(data.balances) ? data.balances : [])
      .filter(b => Number(b.free) > 0 || Number(b.locked) > 0)
      .map(b => ({ asset: b.asset, free: b.free, locked: b.locked }));

    return json({ balances, fetchedAt: Date.now() });
  },
};

/* HMAC-SHA256 hex, đúng cách Binance yêu cầu ký. */
async function sign(query, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const buf = await crypto.subtle.sign('HMAC', key, enc.encode(query));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/* So sánh không rẽ nhánh theo nội dung, để không lộ token qua thời gian phản hồi. */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
