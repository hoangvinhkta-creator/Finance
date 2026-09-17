// Cào nến ngày VN100 (VN30 + VN70 midcap) + VN-Index từ các nguồn công khai, ghi data/vn30.json để GitHub Pages phục vụ cùng origin (không CORS).
// Chạy bởi .github/workflows/stocks.yml (mỗi ngày sau phiên) hoặc tay: node scripts/crawl-stocks.mjs
// Không phụ thuộc gói ngoài (Node ≥ 20 có fetch). Giá quy về NGHÌN ĐỒNG, VN-Index giữ điểm — cùng quy tắc với index.html.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const VN30 = ['ACB','BCM','BID','BVH','CTG','FPT','GAS','GVR','HDB','HPG','LPB','MBB','MSN','MWG','PLX','SAB','SHB','SSB','SSI','STB','TCB','TPB','VCB','VHM','VIB','VIC','VJC','VNM','VPB','VRE'];
/* VN70 (VNMidcap) — danh sách tham khảo kỳ 2024–2025, HOSE đổi rổ mỗi 6 tháng; mã không lấy được sẽ nằm trong errors, sửa tay. */
const VN70 = ['AAA','ANV','ASM','BAF','BMP','BSI','BWE','CII','CMG','CTD','CTR','CTS','DBC','DCM','DGC','DGW','DIG','DPM','DXG','DXS','EIB','EVF','FRT','FTS','GEX','GMD','HAG','HCM','HDC','HDG','HHV','HSG','HT1','IMP','KBC','KDH','KOS','MSB','NKG','NLG','NT2','OCB','ORS','PAN','PC1','PDR','PHR','PNJ','POW','PPC','PTB','PVD','PVT','REE','SBT','SCS','SIP','SJS','SZC','TCH','TLG','VCG','VCI','VGC','VHC','VIX','VND','VOS','VPI','VSC'];
const VN100 = [...VN30, ...VN70];
const VN30_BASKET = 'VN100 = VN30 + 70 midcap · kỳ 08/2024 → 01/2025 (tham khảo)';
const INDEX = 'VNINDEX';
const BARS = 800, KEEP = 820, OUT = 'data/vn100.json';   // 800 phiên ≈ 3,2 năm: trừ 220 phiên khởi động còn ~2,3 năm chuỗi điểm để backtest hai kỳ. 101 mã × 820 × ~40 byte ≈ 3,3 MB, Pages nén gzip
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const isoDay = ms => new Date(ms).toISOString().slice(0,10);
const sleep = ms => new Promise(r=>setTimeout(r, ms));

async function getJson(url, opts={}, ms=20000){
  const ctl = new AbortController(), t = setTimeout(()=>ctl.abort(), ms);
  try{
    const r = await fetch(url, { ...opts, signal: ctl.signal, headers: { 'User-Agent': UA, 'Accept': 'application/json, text/plain, */*', ...(opts.headers||{}) } });
    if(!r.ok) throw new Error('HTTP '+r.status);
    const txt = await r.text();
    try{ return JSON.parse(txt); }catch{ throw new Error('không phải JSON: '+txt.slice(0,80).replace(/\s+/g,' ')); }
  }finally{ clearTimeout(t); }
}

/* Mỗi nguồn: fetch(sym, kind, n) → mảng nến thô {time, open, high, low, close, volume}. Thứ tự = thứ tự ưu tiên.
   Lần chạy thật đầu tiên (2026-09-17): VCI/Vietcap trả đủ 600 nến cho 31/31 mã; TCBS trả HTTP 403 từ máy Actions (chặn IP trung tâm dữ liệu) ⇒ VCI lên đầu. */
const SOURCES = [
  { key:'vci', async fetch(sym, kind, n){
      const to = Math.floor(Date.now()/1000);
      const j = await getJson('https://trading.vietcap.com.vn/api/chart/OHLCChart/gap-chart', { method:'POST', headers:{'Content-Type':'application/json', 'Referer':'https://trading.vietcap.com.vn/'},
        body: JSON.stringify({ timeFrame:'ONE_DAY', symbols:[sym], to, countBack:n }) });
      const d = Array.isArray(j) ? j[0] : (j && j.data ? j.data[0] : null);
      if(!d || !Array.isArray(d.t)) return [];
      return d.t.map((t,i)=>({ time:Number(t)*1000, open:+d.o[i], high:+d.h[i], low:+d.l[i], close:+d.c[i], volume:+(d.v[i]||0) })); } },
  { key:'tcbs', async fetch(sym, kind, n){
      const to = Math.floor(Date.now()/1000);
      const j = await getJson(`https://apipubaws.tcbs.com.vn/stock-insight/v2/stock/bars-long-term?ticker=${sym}&type=${kind==='index'?'index':'stock'}&resolution=D&to=${to}&countBack=${n}`);
      return (j.data||[]).map(r=>({ time:Date.parse(r.tradingDate), open:+r.open, high:+r.high, low:+r.low, close:+r.close, volume:+(r.volume||0) })); } },
  { key:'ssi', async fetch(sym, kind, n){
      const to = Math.floor(Date.now()/1000), from = to - Math.round(n*1.6)*86400;
      const j = await getJson(`https://iboard.ssi.com.vn/dchart/api/history?resolution=D&symbol=${sym}&from=${from}&to=${to}`, { headers:{ 'Referer':'https://iboard.ssi.com.vn/' } });
      if(!j || j.s!=='ok' || !Array.isArray(j.t)) return [];
      return j.t.map((t,i)=>({ time:t*1000, open:+j.o[i], high:+j.h[i], low:+j.l[i], close:+j.c[i], volume:+(j.v[i]||0) })); } },
  { key:'vnd', noIndex:true, async fetch(sym, kind, n){
      const from = isoDay(Date.now() - Math.round(n*1.6)*86400e3);
      const j = await getJson(`https://finfo-api.vndirect.com.vn/v4/stock_prices?sort=date&q=code:${sym}~date:gte:${from}&size=${n}`);
      return (j.data||[]).map(r=>({ time:Date.parse(r.date), open:+r.open, high:+r.high, low:+r.low, close:+r.close, volume:+(r.nmVolume||r.volume||0) })); } },
  { key:'cafef', async fetch(sym, kind, n){
      const j = await getJson(`https://s.cafef.vn/Ajax/PageNew/DataHistory/PriceHistory.ashx?Symbol=${sym}&StartDate=&EndDate=&PageIndex=1&PageSize=${n}`, { headers:{ 'Referer':'https://s.cafef.vn/' } });
      const rows = j && j.Data && Array.isArray(j.Data.Data) ? j.Data.Data : [];
      const day = s => { const m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(String(s||'')); return m ? Date.UTC(+m[3], +m[2]-1, +m[1]) : NaN; };
      return rows.map(r=>({ time:day(r.Ngay), open:+r.GiaMoCua, high:+r.GiaCaoNhat, low:+r.GiaThapNhat, close:+r.GiaDongCua, volume:+(r.KhoiLuongKhopLenh||0) })); } },
];

function normalize(rows, kind){
  const ok = (rows||[]).filter(r=>r && isFinite(r.time) && isFinite(r.close) && r.close>0).sort((a,b)=>a.time-b.time);
  const byDay = new Map(); for(const r of ok) byDay.set(isoDay(r.time), r);
  let out = [...byDay.values()].map(r=>({ ...r, time: Date.parse(isoDay(r.time)) }));
  if(kind!=='index' && out.length){
    const med = out.map(r=>r.close).sort((a,b)=>a-b)[Math.floor(out.length/2)];
    if(med > 1000) out = out.map(r=>({ ...r, open:r.open/1000, high:r.high/1000, low:r.low/1000, close:r.close/1000 }));
  }
  return out;
}
const r3 = x => Math.round(x*1000)/1000;
const pack = rows => rows.map(r=>[r.time, r3(r.open), r3(r.high), r3(r.low), r3(r.close), Math.round(r.volume||0)]);
const unpack = arr => (arr||[]).map(a=>({ time:a[0], open:a[1], high:a[2], low:a[3], close:a[4], volume:a[5] }));

async function fetchSymbol(sym, kind){
  const tried = [];
  for(const src of SOURCES){
    if(kind==='index' && src.noIndex) continue;
    try{
      const rows = normalize(await src.fetch(sym, kind, BARS), kind);
      if(rows.length < 30) throw new Error(`chỉ ${rows.length} nến`);
      return { rows, source: src.key, tried };
    }catch(e){ tried.push(`${src.key}: ${e.name==='AbortError' ? 'quá 20 s' : (e.message||e)}`); }
    await sleep(150);
  }
  return { rows:[], source:null, tried };
}

let prev = { symbols:{}, index:null };
try{ prev = JSON.parse(readFileSync(OUT,'utf8')); }catch{ /* lần đầu */ }

const out = { updatedAt: Date.now(), basket: VN30_BASKET, bars: BARS, symbols:{}, index:null, errors:{} };
let okCount = 0;
for(const sym of [...VN100, INDEX]){
  const kind = sym===INDEX ? 'index' : 'stock';
  const got = await fetchSymbol(sym, kind);
  const old = sym===INDEX ? (prev.index||null) : (prev.symbols||{})[sym];
  const merged = new Map(unpack(old && old.rows).map(r=>[isoDay(r.time), r]));
  for(const r of got.rows) merged.set(isoDay(r.time), r);
  const rows = [...merged.values()].sort((a,b)=>a.time-b.time).slice(-KEEP);
  const rec = { source: got.source || (old && old.source ? old.source+' (cũ)' : null), fetchedAt: got.source ? Date.now() : (old && old.fetchedAt) || null, rows: pack(rows) };
  if(sym===INDEX) out.index = rec; else out.symbols[sym] = rec;
  if(got.source) okCount++; else out.errors[sym] = got.tried.join(' · ');
  console.log(`${sym.padEnd(7)} ${got.source ? 'OK  '+got.source.padEnd(6) : 'LỖI      '} ${String(rows.length).padStart(4)} nến` + (got.tried.length ? `   [${got.tried.join(' | ')}]` : ''));
  await sleep(120);
}
mkdirSync('data', { recursive:true });
writeFileSync(OUT, JSON.stringify(out));
console.log(`\n${okCount}/${VN100.length+1} mã lấy được hôm nay · ghi ${OUT} (${(JSON.stringify(out).length/1024).toFixed(0)} KB)`);
if(okCount===0){ console.error('Không nguồn nào trả dữ liệu cho bất kỳ mã nào — xem log từng mã ở trên.'); process.exit(1); }
