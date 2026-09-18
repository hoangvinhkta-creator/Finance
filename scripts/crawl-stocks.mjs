// Cào nến ngày VN100 (VN30 + VN70 midcap) + VN-Index từ các nguồn công khai, ghi data/vn30.json để GitHub Pages phục vụ cùng origin (không CORS).
// Chạy bởi .github/workflows/stocks.yml (mỗi ngày sau phiên) hoặc tay: node scripts/crawl-stocks.mjs
// Không phụ thuộc gói ngoài (Node ≥ 20 có fetch). Giá quy về NGHÌN ĐỒNG, VN-Index giữ điểm — cùng quy tắc với index.html.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const VN30 = ['ACB','BCM','BID','BVH','CTG','FPT','GAS','GVR','HDB','HPG','LPB','MBB','MSN','MWG','PLX','SAB','SHB','SSB','SSI','STB','TCB','TPB','VCB','VHM','VIB','VIC','VJC','VNM','VPB','VRE'];
/* VN70 (VNMidcap) — danh sách tham khảo kỳ 2024–2025, HOSE đổi rổ mỗi 6 tháng; mã không lấy được sẽ nằm trong errors, sửa tay. */
const VN70 = ['AAA','ANV','ASM','BAF','BMP','BSI','BWE','CII','CMG','CTD','CTR','CTS','DBC','DCM','DGC','DGW','DIG','DPM','DXG','DXS','EIB','EVF','FRT','FTS','GEX','GMD','HAG','HCM','HDC','HDG','HHV','HSG','HT1','IMP','KBC','KDH','KOS','MSB','NKG','NLG','NT2','OCB','ORS','PAN','PC1','PDR','PHR','PNJ','POW','PPC','PTB','PVD','PVT','REE','SBT','SCS','SIP','SJS','SZC','TCH','TLG','VCG','VCI','VGC','VHC','VIX','VND','VOS','VPI','VSC'];
const VN100 = [...VN30, ...VN70];
/* Mã owner đang giữ nhưng ngoài VN100 — cào thêm để Danh mục cổ phiếu có giá. Cùng danh sách STOCK_EXTRA trong index.html. */
const EXTRA = ['DPR','TV2'];
const VN30_BASKET = 'VN100 = VN30 + 70 midcap · kỳ 08/2024 → 01/2025 (tham khảo)';
const INDEX = 'VNINDEX';
const BARS = 800, KEEP = 820, OUT = process.env.CRAWL_OUT || 'data/vn100.json';   // 800 phiên ≈ 3,2 năm: trừ 220 phiên khởi động còn ~2,3 năm chuỗi điểm để backtest hai kỳ. 101 mã × 820 × ~40 byte ≈ 3,3 MB, Pages nén gzip
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const isoDay = ms => new Date(ms).toISOString().slice(0,10);
const sleep = ms => new Promise(r=>setTimeout(r, ms));

/* Hạn giờ cho cả lần chạy: hết giờ thì NGỪNG tải và vẫn ghi file + commit phần đã làm mới.
   Trước đây không có mốc này nên job bị GitHub huỷ ở phút 15 và commit KHÔNG chạy — chạy cả buổi mà kho không đổi (17/09). */
const DEADLINE_MS = Number(process.env.CRAWL_DEADLINE_MS) || 11*60*1000;
const startedAt = Date.now();
const timeLeft = () => DEADLINE_MS - (Date.now() - startedAt);

let curTimeout = 20000;   // fetchSymbol đặt theo nguồn đang thử
async function getJson(url, opts={}, ms){
  const ctl = new AbortController(), t = setTimeout(()=>ctl.abort(), ms || curTimeout);
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
  { key:'vci', timeout:8000, retries:2, async fetch(sym, kind, n){
      const to = Math.floor(Date.now()/1000);
      const j = await getJson('https://trading.vietcap.com.vn/api/chart/OHLCChart/gap-chart', { method:'POST', headers:{'Content-Type':'application/json', 'Referer':'https://trading.vietcap.com.vn/'},
        body: JSON.stringify({ timeFrame:'ONE_DAY', symbols:[sym], to, countBack:n }) });
      const d = Array.isArray(j) ? j[0] : (j && j.data ? j.data[0] : null);
      if(!d || !Array.isArray(d.t)) return [];
      return d.t.map((t,i)=>({ time:Number(t)*1000, open:+d.o[i], high:+d.h[i], low:+d.l[i], close:+d.c[i], volume:+(d.v[i]||0) })); } },
  { key:'tcbs', timeout:10000, async fetch(sym, kind, n){
      const to = Math.floor(Date.now()/1000);
      const j = await getJson(`https://apipubaws.tcbs.com.vn/stock-insight/v2/stock/bars-long-term?ticker=${sym}&type=${kind==='index'?'index':'stock'}&resolution=D&to=${to}&countBack=${n}`);
      return (j.data||[]).map(r=>({ time:Date.parse(r.tradingDate), open:+r.open, high:+r.high, low:+r.low, close:+r.close, volume:+(r.volume||0) })); } },
  { key:'ssi', timeout:10000, async fetch(sym, kind, n){
      const to = Math.floor(Date.now()/1000), from = to - Math.round(n*1.6)*86400;
      const j = await getJson(`https://iboard.ssi.com.vn/dchart/api/history?resolution=D&symbol=${sym}&from=${from}&to=${to}`, { headers:{ 'Referer':'https://iboard.ssi.com.vn/' } });
      if(!j || j.s!=='ok' || !Array.isArray(j.t)) return [];
      return j.t.map((t,i)=>({ time:t*1000, open:+j.o[i], high:+j.h[i], low:+j.l[i], close:+j.c[i], volume:+(j.v[i]||0) })); } },
  { key:'vnd', noIndex:true, timeout:10000, async fetch(sym, kind, n){
      const from = isoDay(Date.now() - Math.round(n*1.6)*86400e3);
      const j = await getJson(`https://finfo-api.vndirect.com.vn/v4/stock_prices?sort=date&q=code:${sym}~date:gte:${from}&size=${n}`);
      return (j.data||[]).map(r=>({ time:Date.parse(r.date), open:+r.open, high:+r.high, low:+r.low, close:+r.close, volume:+(r.nmVolume||r.volume||0) })); } },
  { key:'cafef', timeout:10000, async fetch(sym, kind, n){
      const j = await getJson(`https://s.cafef.vn/Ajax/PageNew/DataHistory/PriceHistory.ashx?Symbol=${sym}&StartDate=&EndDate=&PageIndex=1&PageSize=${n}`, { headers:{ 'Referer':'https://s.cafef.vn/' } });
      const rows = j && j.Data && Array.isArray(j.Data.Data) ? j.Data.Data : [];
      const day = s => { const m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(String(s||'')); return m ? Date.UTC(+m[3], +m[2]-1, +m[1]) : NaN; };
      return rows.map(r=>({ time:day(r.Ngay), open:+r.GiaMoCua, high:+r.GiaCaoNhat, low:+r.GiaThapNhat, close:+r.GiaDongCua, volume:+(r.KhoiLuongKhopLenh||0) })); } },
];

function normalize(rows, kind){
  /* Loại nến vi phạm quan hệ OHLC (high < max(open,close), low > min(open,close), high < low, giá ≤ 0) — cùng luật với parseStockStore trong app (reaudit R03). */
  const ok = (rows||[]).filter(r=>r && isFinite(r.time) && isFinite(r.close) && r.close>0 && r.open>0 && r.high>0 && r.low>0 && r.high >= Math.max(r.open,r.close)-1e-9 && r.low <= Math.min(r.open,r.close)+1e-9 && r.high >= r.low).sort((a,b)=>a.time-b.time);
  const bad = (rows||[]).length - ok.length; if(bad>0) normalize.dropped = (normalize.dropped||0) + bad;
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

/* Nguồn hỏng liên tiếp `DEAD_AFTER` lần thì bỏ qua nốt lần chạy này — 17/09 mỗi mã hỏng phải chờ tcbs 403,
   ssi 403, vnd lỗi mạng, cafef rỗng, tốn 13 giây vô ích cho một kết quả đã biết trước. */
const DEAD_AFTER = 5, srcFail = {}, dead = new Set();
const reviveSources = () => { dead.clear(); for(const k of Object.keys(srcFail)) srcFail[k] = 0; };

async function fetchSymbol(sym, kind, want){
  const tried = []; let usable = 0;
  for(const src of SOURCES){
    if(kind==='index' && src.noIndex) continue;
    if(dead.has(src.key)) continue;
    usable++;
    curTimeout = src.timeout || 12000;
    for(let attempt=0; attempt <= (src.retries||0); attempt++){
      if(timeLeft() <= 0) return { rows:[], source:null, tried, out:true };
      try{
        const rows = normalize(await src.fetch(sym, kind, want), kind);
        if(rows.length < Math.min(5, want)) throw new Error(`chỉ ${rows.length} nến`);
        srcFail[src.key] = 0;
        return { rows, source: src.key, tried };
      }catch(e){
        tried.push(`${src.key}${attempt?`#${attempt+1}`:''}: ${e.name==='AbortError' ? `quá ${(src.timeout||12000)/1000} s` : (e.message||e)}`);
        if(attempt < (src.retries||0)) await sleep(400*(attempt+1));   // VCI chập chờn: thử lại rẻ hơn nhiều so với rơi xuống nguồn đã chết
      }
    }
    srcFail[src.key] = (srcFail[src.key]||0) + 1;
    if(srcFail[src.key] >= DEAD_AFTER) dead.add(src.key);
    await sleep(150);
  }
  if(!usable) tried.push(`mọi nguồn đã hỏng ${DEAD_AFTER} lần liên tiếp trước đó, không thử lại trong lần chạy này`);
  return { rows:[], source:null, tried };
}

let prev = { symbols:{}, index:null };
try{ prev = JSON.parse(readFileSync(process.env.CRAWL_IN || OUT,'utf8')); }catch{ /* lần đầu */ }

const out = { updatedAt: Date.now(), basket: VN30_BASKET, bars: BARS, symbols:{}, index:null, errors:{} };
let okCount = 0, miss = 0, streak = 0, pauses = 0, stopped = '';
/* Thứ tự: VN-Index trước (mọi mã chấm điểm so với nó), rồi mã LÂU NHẤT CHƯA LÀM MỚI trước.
   Nguồn chặn tốc độ giữa chừng là chuyện thường (17/09: 45/103 mã), nếu giữ thứ tự cố định thì
   mã cuối danh sách không bao giờ được làm mới. Xếp theo `fetchedAt` để lượt sau bù cho lượt trước. */
const freshAt = sym => { const r = (prev.symbols||{})[sym]; return (r && r.fetchedAt) || 0; };
const ALL = [INDEX, ...[...VN100, ...EXTRA].sort((a,b)=>freshAt(a)-freshAt(b))];
if(process.env.CRAWL_DRY){ console.log('Thứ tự:', ALL.slice(0,8).join(' '), '…', ALL.slice(-4).join(' ')); process.exit(0); }
for(const sym of ALL){
  const kind = sym===INDEX ? 'index' : 'stock';
  const old = sym===INDEX ? (prev.index||null) : (prev.symbols||{})[sym];
  const oldRows = unpack(old && old.rows);
  /* Chỉ xin phần THIẾU khi kho đã có lịch sử: mỗi ngày tải lại 800 nến × 103 mã là thứ làm nguồn chặn tốc độ. */
  const lastT = oldRows.length ? oldRows[oldRows.length-1].time : 0;
  const gapDays = lastT ? Math.ceil((Date.now()-lastT)/86400e3) : 0;
  const want = oldRows.length >= 300 ? Math.min(BARS, Math.max(10, gapDays + 5)) : BARS;
  const got = stopped ? { rows:[], source:null, tried:['bỏ qua — '+stopped] } : await fetchSymbol(sym, kind, want);
  if(got.out){ stopped = `hết hạn ${Math.round(DEADLINE_MS/60000)} phút`; }
  const merged = new Map(oldRows.map(r=>[isoDay(r.time), r]));
  for(const r of got.rows) merged.set(isoDay(r.time), r);
  const rows = [...merged.values()].sort((a,b)=>a.time-b.time).slice(-KEEP);
  const rec = { source: got.source || (old && old.source ? old.source+' (cũ)' : null), fetchedAt: got.source ? Date.now() : (old && old.fetchedAt) || null, rows: pack(rows) };
  if(sym===INDEX) out.index = rec; else out.symbols[sym] = rec;
  if(got.source){ okCount++; streak = 0; } else { miss++; streak++; if(!stopped) out.errors[sym] = got.tried.join(' · '); }
  if(!stopped) console.log(`${sym.padEnd(7)} ${got.source ? 'OK  '+String(got.source).padEnd(6) : 'LỖI      '} ${String(rows.length).padStart(4)} nến · xin ${want}` + (got.tried.length ? `   [${got.tried.join(' | ')}]` : ''));
  /* Hỏng liên tiếp = nguồn đang chặn tốc độ chứ không phải mã lỗi ⇒ nghỉ một nhịp rồi cho các nguồn sống lại, tối đa 2 lần. */
  if(!stopped && streak >= 8 && pauses < 2 && timeLeft() > 90e3){
    pauses++; streak = 0; console.log(`   … ${8} mã liên tiếp hỏng, nghỉ 45 giây rồi thử lại (lần ${pauses}/2)`);
    reviveSources(); await sleep(45000);
  }
  if(timeLeft() <= 0 && !stopped) stopped = `hết hạn ${Math.round(DEADLINE_MS/60000)} phút`;
  await sleep(120);
}
if(stopped) console.log(`\n⏱  Dừng tải giữa chừng: ${stopped}. Mã chưa kịp làm mới giữ nguyên nến cũ.`);
mkdirSync('data', { recursive:true });
writeFileSync(OUT, JSON.stringify(out));
console.log(`\n${okCount}/${ALL.length} mã lấy được hôm nay · ${miss} mã giữ nến cũ${normalize.dropped?` · loại ${normalize.dropped} nến OHLC sai`:''} · ghi ${OUT} (${(JSON.stringify(out).length/1024).toFixed(0)} KB) · ${Math.round((Date.now()-startedAt)/1000)} giây`);
if(dead.size) console.log(`Nguồn bỏ giữa chừng vì hỏng ${DEAD_AFTER} lần liên tiếp: ${[...dead].join(', ')}`);
if(okCount===0){ console.error('Không nguồn nào trả dữ liệu cho bất kỳ mã nào — xem log từng mã ở trên.'); process.exit(1); }
