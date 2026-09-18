// Cào lịch sử SÂU một lần cho nghiên cứu (2021 → nay, đủ mùa gấu 2022) vào data/vn100-deep.json — TÁCH KHỎI kho hằng ngày.
// Chạy bởi .github/workflows/stocks-deep.yml (chỉ bấm tay). Hạt giống: file deep cũ nếu có, không thì kho hằng ngày (đã có 800 nến)
// ⇒ chỉ tải các trang CŨ HƠN nến cổ nhất đang có, không tải lại phần đã có. Chạy nhiều lần thì tự bù mã còn thiếu.
// Cùng luật với crawl-stocks.mjs: chỉ VCI (bốn nguồn khác đã chết từ máy Actions), thử lại 3 lần × 8 giây, hạn giờ 11 phút rồi vẫn ghi file.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const VN30 = ['ACB','BCM','BID','BVH','CTG','FPT','GAS','GVR','HDB','HPG','LPB','MBB','MSN','MWG','PLX','SAB','SHB','SSB','SSI','STB','TCB','TPB','VCB','VHM','VIB','VIC','VJC','VNM','VPB','VRE'];
const VN70 = ['AAA','ANV','ASM','BAF','BMP','BSI','BWE','CII','CMG','CTD','CTR','CTS','DBC','DCM','DGC','DGW','DIG','DPM','DXG','DXS','EIB','EVF','FRT','FTS','GEX','GMD','HAG','HCM','HDC','HDG','HHV','HSG','HT1','IMP','KBC','KDH','KOS','MSB','NKG','NLG','NT2','OCB','ORS','PAN','PC1','PDR','PHR','PNJ','POW','PPC','PTB','PVD','PVT','REE','SBT','SCS','SIP','SJS','SZC','TCH','TLG','VCG','VCI','VGC','VHC','VIX','VND','VOS','VPI','VSC'];
const EXTRA = ['DPR','TV2'], INDEX = 'VNINDEX';
const TARGET = Number(process.env.DEEP_BARS) || 1500;          // ~6 năm phiên: 2020-09 → nay, đủ đỉnh 04/2022 và đáy 11/2022 cộng 220 phiên khởi động trước đó
const PAGE = 800, KEEP = TARGET + 20;
const OUT = process.env.DEEP_OUT || 'data/vn100-deep.json', SEED = process.env.DEEP_SEED || 'data/vn100.json';
const DEADLINE_MS = Number(process.env.CRAWL_DEADLINE_MS) || 11*60*1000, startedAt = Date.now(), timeLeft = () => DEADLINE_MS - (Date.now()-startedAt);
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const isoDay = ms => new Date(ms).toISOString().slice(0,10), sleep = ms => new Promise(r=>setTimeout(r, ms));

async function getJson(url, opts={}, ms=8000){
  const ctl = new AbortController(), t = setTimeout(()=>ctl.abort(), ms);
  try{ const r = await fetch(url, { ...opts, signal:ctl.signal, headers:{ 'User-Agent':UA, 'Accept':'application/json, text/plain, */*', ...(opts.headers||{}) } });
    if(!r.ok) throw new Error('HTTP '+r.status); const txt = await r.text();
    try{ return JSON.parse(txt); }catch{ throw new Error('không phải JSON: '+txt.slice(0,80).replace(/\s+/g,' ')); } }
  finally{ clearTimeout(t); }
}
/* Một trang VCI kết thúc tại `toSec` (giây), lùi `n` nến. */
async function vciPage(sym, toSec, n){
  const j = await getJson('https://trading.vietcap.com.vn/api/chart/OHLCChart/gap-chart', { method:'POST', headers:{'Content-Type':'application/json', 'Referer':'https://trading.vietcap.com.vn/'},
    body: JSON.stringify({ timeFrame:'ONE_DAY', symbols:[sym], to:toSec, countBack:n }) });
  const d = Array.isArray(j) ? j[0] : (j && j.data ? j.data[0] : null);
  if(!d || !Array.isArray(d.t)) return [];
  return d.t.map((t,i)=>({ time:Number(t)*1000, open:+d.o[i], high:+d.h[i], low:+d.l[i], close:+d.c[i], volume:+(d.v[i]||0) }));
}
function normalize(rows, kind){
  const ok = (rows||[]).filter(r=>r && isFinite(r.time) && isFinite(r.close) && r.close>0).sort((a,b)=>a.time-b.time);
  const byDay = new Map(); for(const r of ok) byDay.set(isoDay(r.time), r);
  let out = [...byDay.values()].map(r=>({ ...r, time: Date.parse(isoDay(r.time)) }));
  if(kind!=='index' && out.length){ const med = out.map(r=>r.close).sort((a,b)=>a-b)[Math.floor(out.length/2)];
    if(med > 1000) out = out.map(r=>({ ...r, open:r.open/1000, high:r.high/1000, low:r.low/1000, close:r.close/1000 })); }
  return out;
}
const r3 = x => Math.round(x*1000)/1000;
const pack = rows => rows.map(r=>[r.time, r3(r.open), r3(r.high), r3(r.low), r3(r.close), Math.round(r.volume||0)]);
const unpack = arr => (arr||[]).map(a=>({ time:a[0], open:a[1], high:a[2], low:a[3], close:a[4], volume:a[5] }));

/* Hạt giống: deep cũ ưu tiên, không thì kho hằng ngày. */
let seed = { symbols:{}, index:null };
for(const f of [OUT, SEED]){ if(existsSync(f)){ try{ seed = JSON.parse(readFileSync(f,'utf8')); console.log('Hạt giống:', f); break; }catch{} } }
const recOf = sym => sym===INDEX ? (seed.index||null) : (seed.symbols||{})[sym];

let vciFail = 0, dead = false, stopped = '';
/* Lùi từng trang cho tới khi đủ TARGET hoặc nguồn hết dữ liệu (trang trả < 30 nến). Trả rows đã gộp + số trang tải được. */
async function deepen(sym, kind, rows){
  let pages = 0, note = '';
  while(rows.length < TARGET){
    if(timeLeft() <= 0){ stopped = `hết hạn ${Math.round(DEADLINE_MS/60000)} phút`; break; }
    if(dead){ note = 'VCI đã hỏng 5 lần liên tiếp'; break; }
    const oldest = rows.length ? rows[0].time : Date.now(), toSec = Math.floor(oldest/1000) - 86400, want = Math.min(PAGE, TARGET - rows.length + 5);
    let page = null, err = '';
    for(let a=0;a<3;a++){ try{ page = normalize(await vciPage(sym, toSec, want), kind); break; }catch(e){ err = e.name==='AbortError' ? 'quá 8 s' : (e.message||String(e)); await sleep(400*(a+1)); } }
    if(page==null){ vciFail++; if(vciFail>=5) dead = true; note = 'vci: '+err; break; }
    vciFail = 0; pages++;
    const have = new Set(rows.map(r=>isoDay(r.time))), fresh = page.filter(r=>!have.has(isoDay(r.time)));
    rows = [...fresh, ...rows].sort((a,b)=>a.time-b.time);
    if(page.length < 30){ note = `nguồn hết dữ liệu (trang cuối ${page.length} nến)`; break; }                       // VCI không còn nến cũ hơn ⇒ đánh dấu exhausted, lần sau không hỏi lại
    if(fresh.length === 0){ note = `nguồn trả trang trùng ${page.length} nến — bỏ qua tham số to?`; break; }          // KHÔNG phải hết dữ liệu ⇒ không đánh dấu, ghi lỗi để soi
    await sleep(150);
  }
  return { rows: rows.slice(-KEEP), pages, note };
}

const out = { updatedAt: Date.now(), basket: 'VN100 + DPR, TV2 · lịch sử sâu cho nghiên cứu', bars: TARGET, symbols:{}, index:null, errors:{} };
const barsOf = sym => unpack((recOf(sym)||{}).rows).length;
/* VN-Index trước, rồi mã còn THIẾU nhiều nhất trước — chạy lại là tự bù. */
const ALL = [INDEX, ...[...VN30, ...VN70, ...EXTRA].sort((a,b)=>barsOf(a)-barsOf(b))];
let done = 0, touched = 0, pagesTotal = 0;
for(const sym of ALL){
  const kind = sym===INDEX ? 'index' : 'stock', old = recOf(sym), rows0 = unpack(old && old.rows);
  let rows = rows0, pages = 0, note = '';
  if(!stopped && rows0.length < TARGET && !(old && old.exhausted)){ const r = await deepen(sym, kind, rows0); rows = r.rows; pages = r.pages; note = r.note; }
  const exhausted = /hết dữ liệu/.test(note) || (old && old.exhausted) || false;
  const rec = { source: 'vci', fetchedAt: pages ? Date.now() : (old && old.fetchedAt) || null, exhausted, from: rows.length ? isoDay(rows[0].time) : null, rows: pack(rows) };
  if(sym===INDEX) out.index = rec; else out.symbols[sym] = rec;
  if(rows.length >= TARGET || exhausted) done++; else if(note && !stopped) out.errors[sym] = note;
  if(pages) touched++; pagesTotal += pages;
  if(!stopped || pages) console.log(`${sym.padEnd(7)} ${String(rows0.length).padStart(4)} → ${String(rows.length).padStart(4)} nến · từ ${rec.from} · ${pages} trang${note?' · '+note:''}`);
}
mkdirSync('data', { recursive:true });
if(touched || !existsSync(OUT)) writeFileSync(OUT, JSON.stringify(out)); else console.log('Không tải thêm được gì — giữ file cũ, không ghi.');
console.log(`\n${done}/${ALL.length} mã đã đủ ${TARGET} nến hoặc hết nguồn · ${touched} mã tải thêm lần này (${pagesTotal} trang) · ghi ${OUT} (${(JSON.stringify(out).length/1024/1024).toFixed(1)} MB) · ${Math.round((Date.now()-startedAt)/1000)} giây${stopped?' · dừng: '+stopped:''}${dead?' · VCI chặn giữa chừng':''}`);
if(done < ALL.length) console.log(`Còn ${ALL.length-done} mã chưa đủ — chạy lại workflow này, nó tự bù phần thiếu.`);
