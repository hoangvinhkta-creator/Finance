# CLAUDE.md — FinTrace

Tài liệu này là **điểm vào duy nhất** cho mọi session Claude làm việc trên repo. Đọc hết trước khi làm gì.
Nó ghi tinh thần làm việc của giai đoạn hiện tại, các quyết định đã chốt, và phạm vi của pha đang mở.
`SPEC.md` vẫn là đặc tả gốc của 5 tab tài chính (Sổ tháng, Công nợ, Tài sản, Lịch sử, Tổng quan); khi hai file mâu thuẫn thì **file này thắng**.

---

## 1. Tinh thần làm việc: vibe coding, code trước

- **Code trước, bàn sau.** Khi yêu cầu đủ rõ để bắt tay được thì làm ngay, chọn mặc định hợp lý thay vì hỏi. Chỉ dừng lại hỏi khi hai cách hiểu dẫn đến hai sản phẩm khác hẳn nhau, hoặc khi thao tác không quay lại được (xoá dữ liệu thật, đổi Firebase project).
- **Owner kiểm tra bằng cách dùng, không phải bằng cách đọc code.** Mọi thay đổi phải nhìn thấy và bấm được trên GitHub Pages sau khi merge. Không có "làm xong nhưng chưa nối vào UI".
- **Mỗi session một việc, kết thúc bằng merge lên `main`.** Quy trình chuẩn cho session làm code:
  1. Làm trên nhánh của session (`claude/...`).
  2. Tự kiểm tra (mục 3).
  3. Commit với message tiếng Việt ngắn gọn, nói *cái gì đổi* chứ không phải *cách đổi*.
  4. Mở PR, mô tả ngắn: đổi gì, owner mở tab nào để thấy, cần làm gì thêm trên Firebase console (nếu có).
  5. **Merge ngay vào `main`** (không chờ review). GitHub Pages tự deploy trong 1–2 phút.
  6. Báo owner: link PR, link app, và đúng 1 đoạn "mở app, vào tab X, thấy Y".
- **Toàn bộ trên cloud.** Owner không chạy terminal, không clone, không `npm`. Mọi hướng dẫn cho owner chỉ được là thao tác trên trình duyệt: GitHub, Firebase console, Binance, và chính app. Nếu một việc bắt buộc phải chạy lệnh thì Claude chạy trong session, không giao cho owner.
- **Nhỏ và chạy được, hơn là đủ mà chưa chạy.** Chia pha nhỏ, mỗi pha dùng thật vài ngày rồi mới mở pha sau. Không xây trước những thứ "sau này sẽ cần".
- **Không đổi kiến trúc.** Single-file `index.html`, inline CSS + JS, không framework, không build step, không bundler, không TypeScript. Thư viện ngoài chỉ qua CDN và chỉ khi thật sự cần (hiện chưa dùng gì ngoài Firebase SDK).
- **Ngôn ngữ:** UI, commit, PR, tài liệu đều tiếng Việt. Tên biến/hàm tiếng Anh như code hiện có.

---

## 2. Kiến trúc hiện có (đọc để không phá)

Mọi thứ nằm trong `index.html` (~1.900 dòng). Thứ tự trong file:

| Khối | Tìm bằng | Ghi chú |
|---|---|---|
| `CONFIG` | `const CONFIG =` | Firebase config. Trống → chế độ thử cục bộ (localStorage). |
| Hằng số | `PRICE_KEYS`, `LIVE_KEYS`, `DEFAULT_*` | priceKey có `live:true` là crypto (usdt, btc, eth, ada). |
| Store | `COLLECTIONS`, `makeLocalStore`, `makeFirestoreStore` | Hai adapter cùng API: `loadAll, set, update, remove, batch, clearAll`. **Thêm collection mới = thêm tên vào `COLLECTIONS` và vào `loadAll` của cả hai adapter.** |
| State | `const state`, `const D` | Mọi document nạp về `D` lúc đăng nhập. UI render từ `D`, ghi nền qua `bg()`. |
| Calc | `monthTotals`, `debtTotals`, `netWorth`, `attribution`, ... | Hàm thuần, tính từ `D`. Tiền là **nghìn đồng**. |
| Mutation | `addTx`, `addHolding`, `addTransfer`, `setPrice`, `saveSettings`, `closeMonth` | Mẫu chuẩn: sửa `D` → `render()` → `bg(store.set(...))`. |
| Router | `VIEWS`, `VIEW_ALIAS`, `route()`, `render()` | Hash routing `#tong #dongtien #taisan #dca #lichsu #caidat`. `VIEW_ALIAS` giữ hash cũ `#so` và `#congno` chạy được. `render()` gọi đúng một `renderXxx` theo `state.view`. |
| Render | `renderOverview`, `renderCashflow`, `renderHoldings`, `renderDca`, `renderHistory`, `renderSettings` | Mỗi tab một hàm, dựng innerHTML bằng template string, `esc()` mọi chuỗi người dùng. `renderCashflow` gọi `renderLedger` + `renderDebts`. |
| Import | `importInitialData` | Chạy một lần, dữ liệu mục 6 SPEC.md. |

**Thêm hoặc gộp tab** cần đúng 5 chỗ: một `<a data-view>` trong `nav.nav` (sidebar) và trong `nav.tabbar` (mobile), một `<section id="view-xxx" class="view">`, tên trong `VIEWS`, và `renderXxx` trong map của `render()`. Cộng thêm số cột của `.tabbar` (`grid-template-columns:repeat(N,1fr)`, N = số tab) và `VIEW_ALIAS` nếu bỏ một hash cũ. **`testViews()` kiểm tra đủ sáu chỗ này** — chạy nó sau mọi thay đổi điều hướng.

Dữ liệu đã có sẵn và **phải dùng lại** cho DCA:
- `holdings`: có ETH (priceKey `eth`) và USDT (priceKey `usdt`), giá trị = quantity × price, quy về nghìn đồng.
- `transfers`: mỗi lần đổi USDT → ETH là một document `{date, fromId, toId, qtyOut, qtyIn, valueVnd, note}`. `transferImplied()` cho giá ngầm định. Đây chính là lịch sử mua ETH.
- `prices/current`: map priceKey → `{value, source, updatedAt}`, nghìn đồng cho 1 đơn vị. `usdt = (USD/VND + 400)/1000`, `eth = giá USD × usdt`.

---

## 3. Tự kiểm tra trước khi merge

Không có test runner. Tối thiểu mỗi PR làm trong session:

1. Mở `index.html` bằng Chromium có sẵn (Playwright, `executablePath: '/opt/pw-browsers/chromium'`) với `CONFIG` trống → app vào chế độ thử cục bộ, **không có lỗi trong console**.
2. Bấm qua tất cả các tab, kể cả tab vừa thêm, ở cả viewport desktop (1200px) và điện thoại (390px).
3. Gõ `testAttribution()` trong console → phải ra `25 đạt · 0 hỏng`. Nếu thêm hàm tính mới cho DCA thì thêm `testDca()` tương tự: vài ca cố định, in "đạt/hỏng".
4. Chụp màn hình tab vừa làm, gửi cho owner trong phần báo cáo.

Không merge khi console còn lỗi. Không "sửa sau".

---

## 4. Các quyết định đã chốt (2026-09-12)

1. **Repo `coin` và CoinDCA bỏ.** File `SHARED_PRODUCT_ROADMAP.md` đã xoá. FinTrace là sản phẩm duy nhất; DCA là **một tab nhẹ bên trong FinTrace**, không phải engine riêng.
2. **Tài liệu "ETH DCA Operating System V1.0"** là nguồn tham khảo công thức (Buy Score mục 6, cấu trúc vốn mục 8–11, giá vốn mục 24). Không áp kiến trúc backend/Postgres/cron/state machine của tài liệu đó vào repo này.
3. **Dữ liệu 100% trên Firebase, project mới hoàn toàn.** Owner tạo project theo `SETUP.md`, điền `CONFIG` vào `index.html` (apiKey Firebase không phải bí mật, commit được). Không dùng lại project cũ. Sau khi nối, chạy Import dữ liệu ban đầu một lần.
4. **Nguồn dữ liệu thị trường: Binance trước, CoinGecko dự phòng.** Thử Binance trực tiếp từ trình duyệt; chỉ chuyển sang CoinGecko (hoặc Cloudflare Worker) khi Binance không gọi được từ GitHub Pages.
5. **SPEC.md mục 1 ghi "kịch bản DCA" ngoài phạm vi** — dòng đó hết hiệu lực. Các phần còn lại của SPEC.md giữ nguyên.

---

## 5. Pha đang mở: DCA P1 — tab "DCA"

Mục tiêu một câu: mở tab DCA, trong 5 giây biết **ETH đang bao nhiêu, Buy Score bao nhiêu, tháng này còn bao nhiêu vốn phải/được mua, và mình đang giữ bao nhiêu ETH với giá vốn nào**.

Làm theo thứ tự **Khối C → Khối A → Khối B**, mỗi khối một PR, merge xong mới làm khối sau.

### Khối C — Lịch sử mua và giá vốn (chỉ dùng dữ liệu đã có)
- Thêm trường tuỳ chọn `source` vào `transfers`: `BASE | SMART | OPPORTUNITY | MANUAL`. Form chuyển đổi hiện thêm select này **chỉ khi** holding nhận có priceKey `eth`. Mặc định `MANUAL`.
- Tab DCA hiện: Tổng ETH, Tổng vốn (nghìn đồng), Giá vốn trung bình (USD và nghìn đồng), Giá hiện tại, Giá trị hiện tại, Lãi/lỗ và %. Ưu tiên ETH tích luỹ và giá vốn hơn PnL.
- Bảng lịch sử: Ngày, Giá ETH (USD ngầm định), Số tiền, ETH nhận, Nguồn, Buy Score lúc mua (nếu có), Giá vốn TB sau lần mua. Lọc theo nguồn.
- Giá vốn tính từ `transfers` có `toId` là holding ETH; USD = `valueVnd / usdt tại thời điểm đó`. Nếu chưa lưu tỷ giá lúc mua thì dùng `usdt` hiện tại và ghi rõ "ước tính".

### Khối A — Buy Score và chỉ báo (chỉ đọc, tính lúc mở tab)
- Nút "Cập nhật" gọi Binance public REST (không cần key): `GET /api/v3/klines?symbol=ETHUSDT&interval=1d&limit=400` và `BTCUSDT` tương tự; `GET /api/v3/ticker/price` cho giá hiện tại. Kline có close và volume, đủ cho mọi chỉ báo.
- Tính 7 thành phần đúng bảng điểm mục 6 của tài liệu: Drawdown365 /25, MA200 /20, RSI14 (Wilder) /15, Monthly drawdown /15, Percentile365 /10, Capitulation (7D return + volume ratio) /10, ETH/BTC 30D /5. Tổng clamp 0–100, Market State theo mục 6.8, Confidence theo mục 7.
- Tất cả là **hàm thuần** nhận mảng nến, trả object `{score, components, marketState, confidence}`. Ngưỡng và trọng số để trong một object hằng `BUY_SCORE_V1` ở đầu file, không rải trong code.
- Hiện: hero (giá ETH, Buy Score, Market State, Confidence, thời điểm dữ liệu) và bảng breakdown 7 dòng dạng `x/25`.
- Cache kết quả lần gần nhất vào `prices/current` dưới khoá `dca` (kèm `updatedAt`). Quá 48 giờ → nhãn "dữ liệu cũ". Không lưu lịch sử snapshot.
- Cập nhật DCA cũng cập nhật luôn giá `btc`, `eth` trong bảng giá (source `live`) → bật nút "Cập nhật giá live" ở tab Tài sản đang disabled. `usdt` vẫn nhập tay cho đến khi có nguồn tỷ giá.
- Nếu Binance lỗi (CORS, chặn vùng, 429): hiện toast, giữ cache, **không** ra Buy Score sai. Chỉ khi xác nhận Binance không dùng được từ Pages mới đổi sang CoinGecko `market_chart?days=365`, giữ nguyên hàm tính.

### Khối B — Kế hoạch vốn tháng (suy ra từ cài đặt, không có state riêng)
- Cài đặt thêm: ngân sách tháng (nghìn đồng), tỷ lệ Base/Smart/Opportunity (mặc định 50/30/20), lịch Base (mặc định ngày 3, 13, 23 với 40/30/30), tháng bắt đầu, cap Opportunity (mặc định 6 tháng).
- Tab DCA hiện card "Tháng này": Base đã mua / phải mua và kỳ nào đã tới hạn; Smart unlock % theo Buy Score (mục 10) và số tiền; Opportunity Fund số dư, cap, unlock % theo mục 11 và số tiền.
- Opportunity Fund **không có ledger**: số dư = số tháng từ tháng bắt đầu × đóng góp tháng − Σ transfers `source = OPPORTUNITY`, chặn ở cap. Cùng cách "suy ra từ dữ liệu gốc" như công nợ ròng.
- Một dòng gợi ý tĩnh, ví dụ: "Score 72 · Smart mở 100% (3.000k) · Base kỳ 13 chưa mua (1.500k)". Không phải lệnh, không có trạng thái.

### Đồng bộ tài sản từ Binance — ❌ ĐÃ GỠ, ĐỪNG LÀM LẠI
Thử hai lần, hỏng vì hai bức tường khác nhau của Binance, cả hai đều không sửa được từ phía mình:
1. **Ký thẳng trong trình duyệt** → Binance chặn CORS với endpoint đã ký (cố ý: không muốn secret nằm trong trang web).
2. **Qua Cloudflare Worker** → Binance trả HTTP 403 kèm trang HTML của WAF, chặn theo dải IP trung tâm dữ liệu.

Owner đã chốt gỡ bỏ 2026-09-13. `binance-worker.js` và `BINANCE.md` đã xoá; nút Đồng bộ, mục cài đặt khoá, `binanceDiff`, `syncBinance`, `testBinance` đã gỡ khỏi `index.html`. `normalizeSettings` xoá luôn khoá `binance` để lần lưu cài đặt tới gỡ khoá API cũ khỏi Firestore.

**Đường duy nhất còn khả thi** (chưa làm, chỉ ghi lại): serverless **chọn được vùng** ở châu Á — Vercel `sin1`, Google Cloud Run `asia-southeast1` — hoặc một máy có IP dân dụng. Đổi lại là một thứ nữa phải nuôi. Với vài lần nhập tay mỗi tháng thì không đáng. Chỉ mở lại khi owner yêu cầu rõ.

Endpoint **công khai** của Binance (klines, ticker) vẫn gọi thẳng từ trình duyệt bình thường — Buy Score và giá live chạy tốt, không đụng gì tới phần đã gỡ.

### Quy đổi USD và WBETH (thêm 2026-09-13, owner yêu cầu)
- Nhập tay chỉ nhập **số lượng**; giá trị nghìn đồng và quy đổi USD app tự tính. Bảng Danh mục hiện `≈ $…` dưới cột Giá trị cho mọi tài sản có khoá giá live; Bảng giá có cột **USD** riêng; đầu Danh mục có tổng `crypto ≈ $…`.
- Chưa có giá `usdt` thì mọi chỗ quy đổi trả `null` và **không hiện gì** — không bao giờ đoán tỷ giá.
- `wbeth` là một khoá giá live như các khoá khác. Binance có thể không niêm yết cặp `WBETHUSDT`, nên `LIVE_SYMBOLS` cho khai cặp dự phòng `via` (`WBETHETH` × giá ETH). `resolveLiveUsd` là hàm thuần ghép hai nguồn đó.
- Giá live hỏi **từng mã một** chứ không gộp một lệnh: Binance trả lỗi cho cả lô nếu chỉ một mã không tồn tại. Mã nào hỏng thì bỏ mã đó, toast nói rõ mã nào không lấy được.

### Khối E — ETH và BTC song song (thêm 2026-09-13, owner yêu cầu)
- Tab DCA có bộ chọn coin **ETH / BTC** áp cho cả bốn phần: Buy Score, kế hoạch vốn tháng, giá vốn, lịch sử mua.
- Cùng một thuật toán, không có chiến lược riêng cho từng coin. Thành phần điểm thứ 7 soi gương nhau: ETH chấm theo ETH/BTC, BTC chấm theo BTC/ETH (`DCA_COINS[].ref`).
- Mỗi coin một khối cài đặt riêng: `settings.dca = {eth:{...}, btc:{...}}`. Cài đặt bản cũ (một khối phẳng) tự chuyển thành khối ETH qua `migrateDcaSettings`.
- Cache điểm đổi thành `prices/current.dca = {usd, coins:{eth, btc}}`; bản cache cũ vẫn đọc được cho ETH.
- Một lần bấm Cập nhật chấm điểm cả hai coin, **không** thêm lệnh gọi mạng nào (ETH và BTC vốn đã tải sẵn để tính thành phần thứ 7).
- Thêm coin thứ ba = thêm một dòng vào `DCA_COINS` và một holding có `priceKey` tương ứng. Không đụng hàm tính.

### Tab Dòng tiền (gộp 2026-09-13, owner yêu cầu)
Sổ tháng + Công nợ gộp thành một tab `#dongtien`, bốn card ngang chia đều: **Chi | Thu | Họ nợ mình | Mình nợ**.

- **Thu chi theo tháng đang xem; công nợ luôn là số dư hôm nay** (owner chốt), có nhãn `số dư hôm nay` trên card và trên ô thống kê. Lùi tháng thì cột thu/chi đổi, hai cột nợ giữ nguyên.
- Hàng thống kê 5 ô: Thu · Chi · Chênh lệch · Công nợ ròng · Mục tiêu.
- **Thu chưa nhận** trước đây hiện đủ ở cả hai tab. Giờ: khoản của tháng đang xem gộp thành một dòng tổng trong "Họ nợ mình" (đã thấy đầy đủ ở cột Thu ngay cạnh), khoản của tháng khác vẫn liệt kê từng dòng vì không nhìn thấy ở đâu khác.
- **Nhóm chi "Trả nợ" giữ nguyên, chỉ là ghi chú** (owner chốt). Trả nợ thật đi qua nút Tất toán — ghi một Chuyển đổi, tài sản ròng không đổi, không vào sổ tháng. Card "Chi theo nhóm" có một dòng nhắc khi tháng đó có chi nhóm này.
- **Ngưỡng bố cục đo bằng Playwright, không đoán:** 4 card vừa khít tới 1050px (card 193px, không bảng nào phải cuộn, không ô nhập nào tràn). Đặt ngưỡng 1040px → 2 card, 820px → 1 card. Muốn đổi bố cục thì đo lại, đừng ước lượng.
- **Card "Thống kê" + "Chi theo nhóm" (owner yêu cầu 2026-09-13):** 5 ô Thu/Chi/Chênh lệch/Công nợ ròng/Mục tiêu gộp vào một `.card.pad.statcard` (vẫn dùng chung `monthStatsHtml`/`debtTileHtml` với Tổng quan — chỉ đổi CSS trình bày trong phạm vi `.statcard`, không đụng hàm render dùng chung). Đặt trong `.grid2` cạnh card "Chi theo nhóm", **phía trên** `.ledger4`.
  - `.statcard .stats.five` dùng `flex-wrap` co giãn theo **bề rộng thật của card** (không dùng media query theo bề rộng màn hình như `.stats.five` gốc, vì card này giờ hẹp hơn cả trang).
  - "Chi theo nhóm" đổi từ bảng-mỗi-nhóm-một-thanh sang **một thanh ngang gộp theo tỉ trọng** (`.catstack`, màu theo `SHADES`, lọc nhóm 0đ giống `donutHtml()`) + chú giải dạng chip wrap (`.catlegend`) — để card này tự nhiên ngắn gọn, không cần giới hạn chiều cao bằng cuộn.
  - **Hai card này luôn bằng chiều cao khi đứng cạnh nhau**: bỏ hẳn `align-items:start`, dùng mặc định `stretch` của `.grid2`. Dưới 1100px content width, `.grid2` tự xếp dọc (không còn "cạnh nhau" nên không cần so bằng).
- `main` **không còn `max-width`** (trước là 1380px, làm màn 1920 thừa 356px bên phải). Nội dung giãn hết bề ngang màn hình ở mọi tab; đã soi cả 6 tab ở 1920px và 2560px, không tab nào tràn hay vỡ.
- **Mỗi dòng trong 4 bảng dùng icon thay cho nút chữ** (owner yêu cầu 2026-09-13): sửa (bút chì), xoá (thùng rác), đã nhận/tất toán (dấu tick trong khung, class `.tag`), mở lại (mũi tên xoay ngược). Icon SVG để trong hằng `IC_EDIT/IC_DEL/IC_CHECK/IC_UNDO`, dựng qua `rowBtn(act, icon, title, cls)`. `data-act` giữ nguyên (`edit/del/received/settle/reopen`) nên các handler click không đổi.
- **Icon thẳng cột thật (owner yêu cầu 2026-09-13, sửa lại lần đầu vì flexbox làm icon lệch theo độ dài tên):** mỗi hàng dùng **cột `<td>` thật** (`name` → `act` → `n`), không gộp vào một ô flex — trình duyệt tự tính độ rộng cột bằng nội dung rộng nhất trong cả bảng nên icon và số tiền luôn thẳng hàng dọc. `.ledger4 .tbl{table-layout:fixed}` với `.d/.act/.n` có độ rộng cố định (đo bằng Playwright: 42/66/70px), cột `name` nhận hết phần còn lại. Bên trong `td.name` có `<div class="rn">` cắt gọn bằng ellipsis (không dùng `max-width:0` trực tiếp trên `td` — đã thử, làm cả cột co về gần 0 trong bảng auto-layout, sai). Tx-row (Chi/Thu) có icon "Đã nhận" tuỳ trạng thái pending; dùng `ROW_SP` (span rỗng cùng kích thước icon) làm chỗ giữ khi vắng mặt, để sửa/xoá luôn ở đúng slot 2-3 bất kể dòng có pending hay không — nếu không có spacer này, sửa/xoá sẽ lệch cột giữa dòng pending và dòng thường.
- **Giá WBETH sai, sửa lại nguồn (owner báo 2026-09-13):** `LIVE_SYMBOLS` cũ thử cặp trực tiếp `WBETHUSDT` trước, chỉ suy qua `WBETHETH` khi cặp trực tiếp không trả về gì — nên một cặp trực tiếp thanh khoản mỏng/giá cũ vẫn thắng. Sửa: bỏ hẳn `symbol` trực tiếp của `wbeth`, luôn suy qua tỉ giá neo `WBETHETH × giá ETH`. Đồng thời đổi mọi lệnh lấy giá từ `/ticker/price` (giá khớp lệnh gần nhất, có thể cũ với cặp ít giao dịch) sang `/ticker/bookTicker` (trung bình bid/ask, luôn mới). *Chưa gọi được Binance thật để kiểm chứng số cuối cùng do sandbox chặn mạng ra ngoài — đây là sửa theo review code + kiến thức WBETH neo giá theo ETH, owner tự soi số thật sau khi lên Pages.*
- **Bảng giá hiện đơn vị USDT rõ ràng + tỉ suất quy đổi (owner yêu cầu 2026-09-13):** cột "USD" đổi tên "USDT", giá trị qua `fmtUsdt()` (hậu tố `USDT`, không lẫn với `$` của quy đổi VNĐ). Giá suy qua tỉ giá neo (như WBETH) có thêm dòng nhỏ `1 WBETH ≈ 1,0538 ETH` ngay dưới, lấy từ `rate`/`rateOf` lưu trên `D.prices[key]` lúc `refreshDca()` chạy.
- **Xem trước Chuyển đổi tài sản hiện thêm USDT tương đương (owner yêu cầu 2026-09-13):** `updateXferLabels()` nối thêm `(≈ $…)` sau giá trị nghìn đồng, dùng lại đúng `toUsd()`/`fmtUsd()` đã có ở Danh mục — không thêm quy ước hiển thị mới.
- **Giá WBETH vẫn bằng hệt giá ETH sau khi sửa nguồn — nguyên nhân thật là data, không phải fetch (owner báo lại 2026-09-13):** holding WBETH của owner được thêm **trước khi khoá giá `wbeth` tồn tại**, nên `priceKey` bị ghi tạm là `eth` — Danh mục đọc đúng `h.priceKey` nên hiện y hệt giá ETH, không liên quan gì tới việc lấy giá live đã sửa hôm trước. Bảng Danh mục **không có ô sửa `priceKey`** sau khi tạo, nên owner không tự sửa được. Thêm `wbethMismatches(holdings)` (hàm thuần, khớp `priceKey!=='wbeth'` + tên chứa "wbeth") và `fixWbethPriceKey()` chạy tự động trong `applyLoaded()` mỗi lần đăng nhập/khôi phục — tự sửa priceKey về `wbeth` và ghi lại Firestore, owner không cần làm gì thêm. Nhân tiện làm tròn cột "Giá" ở Danh mục về số nguyên (`fmtK` bỏ tham số `,4`) cho gọn — số lượng (`fmtQty`, 6 chữ số) và tỉ suất quy đổi (4 chữ số) giữ nguyên vì cần độ chính xác.
- **Cột "Giá" của Danh mục nói bằng USDT cho coin (owner yêu cầu 2026-09-13):** dòng coin (khoá giá live) đổi cột Giá thành **tổng chỗ đang giữ quy ra USDT** (dòng đậm) + **tỉ giá 1 đơn vị** ngay dưới (`1 ETH ≈ 2.452,51 USDT`). Dòng `usdt` bỏ tỉ giá vì `1 USDT ≈ 1 USDT` là thừa. Tài sản không phải coin (tiền, vàng, bạc, chứng khoán) **giữ nguyên** ô nhập giá nghìn đồng sửa tay được tại chỗ. Cột "Giá trị" bỏ dòng `≈ $…` ở đúng những dòng đã hiện USDT bên cạnh — tránh hai cột cùng một con số.
- **Vùng giá mua trong tab DCA (owner hỏi 2026-09-13: "giá nào là rẻ để mua?"):** card mới giữa hero và "Tháng này", một dòng cho mỗi Market State (≥25/45/65/80) kèm giá coin cần về, % chênh so với giá hiện tại, và Smart/Opportunity mở bao nhiêu ở đúng ngưỡng đó.
  - **Không có thuật toán mới:** `priceForScore()` gọi lại chính `buyScore()` với `price` giả định rồi **chia đôi khoảng**. Hợp lệ vì điểm giảm đơn điệu khi giá tăng — cả 5 thành phần phụ thuộc giá (giảm từ đỉnh 365/30, lệch MA200, percentile, lợi suất 7 ngày) đều vậy; RSI, khối lượng và ETH/BTC không đổi theo giá giả định nên có ngưỡng **không bao giờ tới được** (hiện đúng chữ "không tới được", không bịa số).
  - Giá trả về là mức **cao nhất còn đạt ngưỡng**, và **cắt xuống** 2 số lẻ chứ không làm tròn — làm tròn lên sẽ vượt qua đúng ngưỡng vừa dò, khiến số trên bảng không còn đạt ngưỡng ghi bên cạnh.
  - Tính một lần lúc bấm Cập nhật, lưu vào `prices/current.dca.coins[coin].bands` (4 object nhỏ). Cache cũ chưa có `bands` thì card báo "bấm Cập nhật", không cần migration.
  - Đây **không phải** ladder/buy zones của P2: không có anchor lưu lại, không có state, không có cooldown — chỉ là bảng tra cứu tính lại mỗi lần cập nhật.
- **Bảng giá thiếu tỉ giá USDT dưới mỗi dòng (owner báo lại 2026-09-13, đã bỏ sót ở lần làm trước):** lần trước chỉ thêm dòng tỉ suất neo (`1 WBETH ≈ … ETH`) cho riêng WBETH, còn tỉ giá USDT/VND dùng để quy đổi thì không hiện ở đâu cho các coin khác. Sửa: mọi dòng có giá USDT (trừ chính `usdt`) giờ có thêm dòng nhỏ `1 USDT ≈ 26,4855k` ngay dưới — dùng `fmtK(uRate,4)` (giữ 4 số lẻ, **không** dùng mặc định làm tròn nguyên như cột "Giá" vì tỉ giá quanh mức hàng chục cần số lẻ mới có nghĩa). WBETH có cả hai dòng: tỉ giá USDT chung + tỉ suất neo riêng.
- **Coin dồn hẳn về tab DCA, mua nhanh không cần rời tab (owner yêu cầu 2026-09-13):**
  - **Danh mục (tab Tài sản) không còn liệt kê từng coin.** Mọi holding có `priceKey` thuộc `LIVE_KEYS` (usdt/btc/eth/wbeth/ada) gộp thành **một dòng "Coin"** (giá trị = tổng, kèm `≈ $…`), link "xem ở DCA". Form "Thêm tài sản" ở đây bỏ nhóm `Crypto` và mọi `priceKey` live khỏi lựa chọn — thêm coin mới chỉ còn làm được ở tab DCA, tránh hai chỗ cùng sửa một dữ liệu.
  - **Tab DCA có card "Ví Coin"** (`renderDcaWallet`): bảng đầy đủ từng coin (tên/số lượng sửa tay như Danh mục cũ, giá dùng lại `coinPriceCell()` — cột Giá nói bằng USDT + tỉ giá 1 đơn vị), cộng một thanh tỉ trọng (`coinAllocation()`, tái dùng đúng `.catstack`/`.catlegend` của "Chi theo nhóm") và form thêm coin mới ngay dưới. `dcaWalletTable` dùng chung `commitInline` với `holdTable`/`priceTable` (thêm vào danh sách đăng ký sự kiện) nên không viết lại logic sửa tay.
  - **Card "Mua nhanh" trong tab DCA:** form riêng (`formDcaBuy`, dựng lại mỗi lần render vào khung tĩnh `#dcaBuyBody`, sự kiện gắn delegation trên khung đó — không gắn thẳng lên `<form>` vì nó bị thay mới liên tục) — đích **luôn khoá** vào coin đang chọn (ETH hoặc BTC), không có ô chọn đích như form Chuyển đổi tài sản gốc (vẫn giữ nguyên, không đụng, ở tab Tài sản cho các nhu cầu khác). Chọn "Nguồn vốn" (Base/Smart/Opportunity/Tay) — mỗi lựa chọn ghi kèm số còn được mua tháng này lấy thẳng từ `dcaPlanNow()` — **tự điền** số lượng gửi bằng đúng phần còn lại, quy đổi qua giá của tài sản nguồn; gõ số lượng gửi thì **tự tính** số coin nhận theo giá hiện tại; cả hai đều sửa tay được sau khi tự điền. Bấm Mua gọi thẳng `addTransfer()` — cùng một hàm mà form Chuyển đổi tài sản gốc dùng, nên "Tháng này", Ví Coin, Danh mục (dòng Coin gộp), Cơ cấu và giá vốn DCA **tự cập nhật ngay**, không cần thao tác gì thêm.
  - Nếu coin đang chọn chưa có holding nào (mới thêm coin thứ ba chẳng hạn), card Mua nhanh chỉ hiện dòng nhắc thêm ở Ví Coin trước — không tự tạo holding ngầm.
- **Nạp lịch sử mua coin từ file Excel theo dõi cũ (owner cung cấp 2026-09-13):** owner tự ghi tay 29 lần mua BTC/ETH/ADA trước khi có FinTrace nên tab DCA chưa có gì để tính giá vốn. Hằng số `DCA_HISTORY_IMPORT` (trong `index.html`, cạnh `dcaState()`) chép nguyên 29 dòng `[ngày, số lượng, tổng USD, tỷ giá VNĐ/USDT]`; USD coi 1:1 với USDT; tỷ giá lấy từ đúng lần nạp USDT gần ngày mua nhất trong cùng file cũ (sai số xa nhất ~nửa tháng, dưới 0,5%).
  - **Chỉ ghi lịch sử Chuyển đổi để tính giá vốn, không đụng số lượng coin đang có.** Nút "Nạp lịch sử mua coin (file cũ)" ở Cài đặt → Nâng cao gọi `importDcaHistory()`, ghi thẳng `store.batch()` vào `transfers` — **không** gọi `addTransfer()`/`applyXfer()` vì hàm đó cộng dồn vào số lượng holding, sẽ nhân đôi số dư đang đúng (holdings đã khớp số dư thật, độc lập với sổ mua này).
  - `dcaHistoryOps(data, ids, batch)` là hàm thuần dựng danh sách document, tách riêng để test: thiếu id coin hoặc thiếu USDT thì bỏ qua dòng đó (không lỗi, không bịa). Số lượng âm trong file gốc là một lần **bán** — tự đổi chiều (from=coin, to=USDT) và **không gắn `source`** vì không phải một lần mua nên không tính vào Base/Smart/Opportunity; dòng bán này cũng tự động không lọt vào "Lịch sử mua" hay giá vốn (hàm `coinPurchases()` chỉ lọc transfer có đích là chính coin đó).
  - Đánh dấu mỗi document `historyBatch:'xlsx-2026-09'` để chặn nạp trùng — nút tự khoá (`disabled`) và đổi nhãn "Đã nạp rồi" sau khi nạp thành công, đọc lại trong `renderSettings()`.
  - **Chưa nạp** lịch sử nạp/rút USDT (Vietcombank ↔ USDT, 39 dòng khác trong cùng file) vì không cần cho giá vốn coin — chỉ mở lại nếu owner muốn có đủ audit trail dòng tiền vào sàn.
- **Giá vốn USD bị thổi lệch + WBETH chưa được tính là ETH (owner báo 2026-09-13, sổ tay ra 2143 mà app ra 2252):**
  - **Lỗi gốc:** `dcaSummary` lấy `avgCostVnd / tỷ giá USDT hôm nay`. Vốn được bỏ ra hồi tỷ giá 26.600–28.072 nhưng chia lại theo 25.756 của hôm nay ⇒ thổi giá vốn lên ~5%. Sửa: cộng USD **theo tỷ giá từng lần mua** (`transferUsd()` → `basis.totalCostUsd` → `avgCostUsd`). Đây là loại lỗi phải nhớ: **mọi con số USD lịch sử đều phải quy đổi tại thời điểm phát sinh, không bao giờ quy đổi cả cục theo tỷ giá hiện tại.**
  - **Bán ra giờ trừ vào vốn ròng**, đúng cách sổ tay owner tính: giá vốn = tiền ròng đã bỏ ra / số coin còn giữ (mức hoà vốn), không phải giá vốn kế toán bình quân gia quyền. Mua/bán trộn theo đúng thứ tự thời gian nên cột "giá vốn TB sau" của lần mua cuối bằng đúng ô tổng kết.
  - **`COIN_FAMILY = {eth:['eth','wbeth']}`** — WBETH là chính ETH đã stake, chỉ khác vỏ. `coinQtyHeld()` quy WBETH về ETH theo tỉ giá hiện tại, `coinValueHeld()` cộng cả hai ví, `coinLedger()` tách mua/bán và **bỏ qua chuyển nội bộ trong họ** (ETH → WBETH không phải bán, WBETH ← ETH không phải mua). Thêm coin có nhiều vỏ về sau = thêm một dòng vào `COIN_FAMILY`, không đụng hàm tính.
  - Ô đầu tab DCA đổi từ "Tổng ETH" (suy từ sổ mua) sang **"Đang giữ (ETH)"** = số dư thật gồm cả WBETH, dòng nhỏ ghi rõ `1,387511 ETH + 0,591049 WBETH`. Lãi/lỗ so giá trị thật của cả hai ví với vốn ròng.
  - Kiểm chứng với đúng số của owner: vốn ròng $4.356,54 · giá vốn TB **$2.142,81** (sổ tay: 2.142,805) · đang giữ 2,040686 ETH (mua ròng 2,0331 + lãi stake).
- **Dồn bố cục tab DCA + theo dõi cả ADA và USDT (owner yêu cầu 2026-09-13):**
  - **`DCA_COINS` giờ có 4 coin, chia hai hạng** bằng cờ trong chính cấu hình, không rẽ nhánh rải rác: `basisOnly` (ADA, USDT) chỉ theo dõi giá vốn — giấu hẳn hero, Vùng giá mua, Tháng này và Phân rã điểm thay vì hiện ô rỗng. `DCA_SCORED` là nhóm có Buy Score + kế hoạch vốn (ETH, BTC) và cũng chính là `DCA_COIN_KEYS`. Cài đặt chỉ có ngân sách cho nhóm scored nên `settingsCoin()` kẹp lại, chọn ADA ở tab DCA không làm mục Cài đặt đọc vào khối không tồn tại.
  - **Bộ chọn coin chuyển vào trong card "Giá vốn"** (không còn ở thanh tiêu đề), và card đó **lên hàng đầu ngang với hero**. Bỏ ô "Giá hiện tại" khỏi hàng thống kê vì hero đã có — chỉ coin `basisOnly` (không có hero) mới ghi giá hiện tại vào tiêu đề card.
  - **Vùng giá mua và Tháng này thu lại thành hai card vuông đặt cạnh nhau** (`.grid2.eq`). Vùng giá bỏ hai cột Smart/Opportunity mở (đã có nguyên vẹn ở card Tháng này ngay bên cạnh); Tháng này đổi từ `.plan3` ba cột ngang sang `.planc` ba dòng dọc, lịch Base gộp thành một dòng ngắn.
  - **Mua nhanh thành nút cạnh "Cập nhật", mở popup** thay vì card cố định. `showModal` được nới: `onOk` trả về `false` thì giữ popup mở — để số nhập sai không làm mất cả form.
  - **USDT có hai cờ riêng.** `fiatOnly`: chỉ tính lần đổi với tiền mặt/tài khoản, đem USDT đi mua coin là luân chuyển trong ví chứ không phải bán nên không kéo tỷ giá vốn đi. `pnlRate`: lãi/lỗ = số đang giữ × chênh tỷ giá, vì đã nạp 6.194 nhưng chỉ còn giữ 565 (phần kia đã thành coin) nên so với cả cục vốn đã nạp là vô nghĩa. `vndFirst`: ô giá vốn lấy nghìn đồng làm số chính và cột giá trong bảng lịch sử đổi thành tỷ giá — quy USDT ra USD thì lần nào cũng bằng 1.
  - **Nạp thêm 39 dòng nạp/rút USDT** từ cùng file cũ (`USDT_HISTORY_IMPORT`), ghi thành Vietcombank ↔ USDT. Hai mẻ có khoá riêng (`HISTORY_BATCHES`) nên ai đã nạp mẻ mua coin từ trước vẫn nạp được mẻ USDT thêm sau. Kết quả khớp sổ tay: đã nạp ròng 6.194,81 USDT · tỷ giá vốn TB 26,9545k.
  - Số kiểm chứng lại với sổ tay của owner: ETH $2.142,81 · BTC $91.314 (sổ: 91.314,4586) · ADA $0,77 (sổ: 0,7697628).
- **Tab DCA gom về hai hàng card + ba popup, kích thước card KHÔNG đổi khi đổi coin (owner yêu cầu 2026-09-13):**
  - **Hàng 1 ba cột `.grid3`** (1.15fr / .72fr / 1.13fr): hero (giá + Buy Score + **Phân rã điểm ngay dưới**) | Giá vốn (bộ chọn coin xếp dưới tiêu đề, 4 nút chia đều; 3 ô xếp dọc) | Ví Coin. Card Phân rã điểm, Ví Coin, Lịch sử mua và form Thêm coin rời **không còn**. Hàng 2 vẫn là Vùng giá mua | Tháng này.
  - **Ba nút ở góc trên phải: Lịch sử · Thêm coin · Mua nhanh** (cạnh Cập nhật), đều mở popup. `showModal` nhận thêm `opts {wide, noCancel}`; popup Lịch sử dùng `wide` (980px) + `noCancel`, bộ lọc nguồn nằm trong popup và chỉ hiện với coin có kế hoạch vốn. `.dialog{min-width:0}` + `#mdBody{min-width:0}` để bảng rộng cuộn ngang bên trong thay vì đẩy popup tràn màn hình điện thoại (đo: 518px → 350px ở màn 390).
  - **Nguyên tắc "đổi coin không đổi hình":** ADA/USDT **không giấu card** nữa (giấu là hàng card đổi hình) — hero vẫn hiện giá, điểm ghi "—", phân rã/vùng giá/tháng này ghi rõ "không chấm/không có kế hoạch" trong đúng khung. Chiều cao pin bằng `min-height` **đo ở trạng thái đầy nhất** (ETH có điểm + có ngân sách): `.hero` 87px, `#dcaHeroMeta` 42px (2 dòng), `.bkbox` 342px (7 thành phần + tổng), `.planbox` 340px (338,x làm tròn lên để ETH và coin khác bằng nhau tuyệt đối). Kết quả đo: 5 card giữ nguyên pixel ở cả 4 coin (595 / 416). **Đổi nội dung các khối này thì đo lại, đừng sửa số tay.**
  - **Ô thống kê `.stats.col`:** nhãn một dòng, **số và chú thích cùng một hàng** (grid `auto 1fr`, baseline), chú thích và nhãn `nowrap + ellipsis`, `min-height:62px` ⇒ ô cao bằng nhau ở mọi coin. Thành phần họ coin (`1,388 ETH + 0,591 WBETH`, 3 số lẻ — 4 số lẻ thiếu đúng 2px) nằm trên **nhãn** ô Đang giữ, hàng số chỉ còn "vốn ròng" nên không bị cắt. Bỏ ô "Giá hiện tại" (hero đã có).
  - **Ví Coin trong 440px:** `table-layout:fixed` + `colgroup` 20/22/33/15/10% (đo: nội dung tự do phình 502px trong khung 402px; Số lượng 22% vì 19% làm ô nhập cắt số cuối của "0,004712"). Bỏ hai nút ↑↓ (chỉ giữ xoá), tên coin ellipsis, dòng tỉ giá nhỏ bỏ hậu tố "USDT" vì dòng đậm ngay trên đã ghi đơn vị. `coinPriceCell()` giờ chỉ còn Ví Coin dùng.
  - Nút Lịch sử hiện số lần mua ngay trên nhãn (`Lịch sử (23)`) để biết có gì bên trong trước khi bấm.

### Không làm trong P1
State machine, cooldown, crash mode, ACTION_PENDING, ladder/buy zones, backtest, decision log, versioning nhiều thuật toán, **chiến lược riêng cho từng coin**, tự động mua, thông báo.

---

## 6. P2 (chưa mở, chỉ ghi để không quên)

Mở khi P1 đã dùng thật ít nhất một tháng. Thứ tự dự kiến: Ladder + buy zones (lưu một document `ladders/active`, anchor cố định, zone không bao giờ dịch lên) → cooldown + override → state machine rút gọn (WAIT / BASE_DUE / SMART_READY / OPPORTUNITY_READY / MONTH_END) → crash mode → ACTION_PENDING. Tất cả vẫn tính lúc mở tab, không có tiến trình nền.

---

## 7. Nhật ký quyết định

| Ngày | Quyết định |
|---|---|
| 2026-09-12 | Bỏ roadmap Finance × CoinDCA và repo `coin`. DCA thành tab nhẹ trong FinTrace. Firebase project mới. Binance trước, CoinGecko dự phòng. P1 = 3 khối C/A/B; state machine, ladder... để P2. |
| 2026-09-13 | Owner yêu cầu theo dõi BTC đầy đủ như ETH. Mở Khối E: tab DCA thành đa coin (ETH/BTC), cùng thuật toán, mỗi coin một ngân sách. "Nhiều coin" ra khỏi mục Không làm; thay bằng "chiến lược riêng cho từng coin". |
| 2026-09-13 | Owner thử trên app thật: Binance chặn CORS endpoint đã ký, endpoint công khai vẫn chạy. Đã hỏi và owner chốt **dựng Cloudflare Worker**. Thêm `binance-worker.js` + `BINANCE.md`; khoá API rời Firestore, chuyển vào biến bí mật của Worker. |
| 2026-09-13 | **Gỡ hẳn đồng bộ số dư Binance.** Worker bị Binance trả 403 (chặn IP trung tâm dữ liệu) — bức tường thứ hai sau CORS. Owner chốt dừng. Đổi lại: nhập tay chỉ nhập số lượng, app tự quy ra nghìn đồng và USD; thêm khoá giá `wbeth` với cặp dự phòng `WBETHETH` vì Binance có thể không có `WBETHUSDT`. |
| 2026-09-13 | Đổi nút chữ (sửa/xoá/Đã nhận/Tất toán/mở lại) trong 4 bảng của tab Dòng tiền thành icon nằm ngay sau tên khoản, cùng dòng với số tiền. Mỗi hàng gộp về một `<td>` để chiều cao hàng bằng nhau ở cả 4 card. |
| 2026-09-13 | Owner phản hồi icon "lộn xộn" (lệch cột do gộp vào một ô flex). Đổi lại: quay về cột `<td>` thật + `table-layout:fixed` + ô giữ chỗ cho icon tuỳ trạng thái — icon giờ thẳng cột tuyệt đối, kể cả xen giữa dòng pending/thường. |
| 2026-09-13 | Gộp 5 ô thống kê Dòng tiền vào một card, đặt cạnh "Chi theo nhóm" phía trên 4 card Chi/Thu/Nợ. "Chi theo nhóm" đổi từ nhiều thanh (mỗi nhóm một dòng) sang một thanh ngang gộp theo tỉ trọng, để hai card tự nhiên cao bằng nhau — không cần giới hạn cuộn. |
| 2026-09-13 | **Sửa giá WBETH sai.** Bỏ cặp trực tiếp `WBETHUSDT` khỏi `LIVE_SYMBOLS`, luôn suy qua tỉ giá neo `WBETHETH`; đổi mọi lệnh ticker sang `bookTicker` (bid/ask) thay vì `ticker/price` (khớp lệnh gần nhất) cho mọi coin. Thêm cột USDT rõ đơn vị trong Bảng giá kèm dòng tỉ suất quy đổi cho giá suy qua tỉ giá neo; xem trước Chuyển đổi tài sản hiện thêm USDT tương đương. Chưa kiểm chứng được với Binance thật do sandbox chặn mạng ra ngoài. |
| 2026-09-13 | **Giá WBETH vẫn bằng ETH — hoá ra là do data, không phải fetch.** Holding WBETH của owner thêm trước khi khoá giá `wbeth` tồn tại nên `priceKey` kẹt ở `eth`; Danh mục không có ô sửa `priceKey` nên owner không tự sửa được. Thêm `fixWbethPriceKey()` tự chạy trong `applyLoaded()` mỗi lần đăng nhập, sửa và ghi lại Firestore không cần thao tác gì thêm. Làm tròn cột "Giá" Danh mục về số nguyên cho gọn. |
| 2026-09-13 | **Danh mục nói bằng USDT cho coin + thêm card "Vùng giá mua".** Cột Giá của dòng coin đổi thành tổng quy ra USDT kèm tỉ giá 1 đơn vị ngay dưới; tài sản khác giữ ô nhập nghìn đồng. Owner hỏi "giá nào là rẻ để mua" ⇒ thêm bảng tra cứu: dò ngược `buyScore()` bằng chia đôi khoảng để ra giá ứng với từng ngưỡng Market State. Không phải ladder P2 — không anchor, không state, tính lại mỗi lần Cập nhật. |
| 2026-09-13 | **Bảng giá bị bỏ sót tỉ giá USDT/VND.** Owner báo lại lần làm trước chỉ thêm dòng tỉ suất neo riêng cho WBETH, thiếu đúng cái được yêu cầu ban đầu: tỉ giá USDT dùng để quy đổi hiện dưới MỌI coin. Thêm dòng `1 USDT ≈ 26,4855k` dưới cột USDT cho mọi dòng có giá, giữ 4 số lẻ (không làm tròn nguyên như cột "Giá" vì mất hết ý nghĩa ở mức tỉ giá này). |
| 2026-09-13 | **Coin dồn hẳn về tab DCA.** Owner muốn mua Base/Smart/Opportunity không cần rời tab DCA, và Danh mục chỉ cần ghi gộp "Coin" thay vì từng dòng. Thêm card "Ví Coin" (bảng từng coin + tỉ trọng, tái dùng `.catstack` của Chi theo nhóm) và "Mua nhanh" (form riêng, đích khoá vào coin đang chọn, nguồn vốn tự điền số còn lại từ `dcaPlanNow()`) — cả hai gọi lại đúng `addTransfer()`/`updateHolding()` nên mọi nơi khác tự cập nhật, không thêm state riêng. Danh mục bớt hẳn nhóm Crypto khỏi form thêm tài sản. |
| 2026-09-13 | **Nạp lịch sử mua coin từ file Excel cũ.** Owner gửi 29 lần mua BTC/ETH/ADA tự ghi tay trước khi có FinTrace — tab DCA chưa có gì để tính giá vốn/giá trung bình. Thêm `DCA_HISTORY_IMPORT` (dữ liệu chép từ file) + `importDcaHistory()`, ghi thẳng `store.batch()` vào `transfers` chứ không qua `addTransfer()` để khỏi cộng dồn nhầm vào số lượng coin đang có (đã đúng số dư thật, độc lập với sổ mua cũ). Tỷ giá VNĐ/USDT từng dòng lấy từ đúng lần nạp USDT gần ngày mua nhất trong cùng file. Một dòng bán (số lượng âm) tự đổi chiều, không tính vào giá vốn. Nút ở Cài đặt → Nâng cao, tự khoá sau khi nạp một lần. |
| 2026-09-13 | **Sửa giá vốn USD tính sai + gộp WBETH vào ETH.** Owner đối chiếu sổ tay: TB giá 2143 mà app ra 2252. Nguyên nhân: lấy giá vốn VNĐ chia tỷ giá USDT **hôm nay** trong khi vốn bỏ ra hồi tỷ giá cao hơn — giờ cộng USD theo tỷ giá từng lần mua. Đồng thời trừ lần bán vào vốn ròng (đúng cách sổ tay tính) và thêm `COIN_FAMILY` để WBETH được tính là ETH đã stake (chuyển ETH↔WBETH là nội bộ, không phải mua/bán). Kết quả khớp đúng sổ tay: $2.142,81. |
| 2026-09-13 | **Tab DCA gom lại một màn + theo dõi ADA và USDT.** Bộ chọn coin vào trong card Giá vốn, card đó lên ngang hàng hero, bỏ ô Giá hiện tại trùng với hero. Vùng giá mua và Tháng này thu thành hai card vuông cạnh nhau. Mua nhanh thành nút mở popup. ADA/USDT thêm vào bộ chọn ở dạng `basisOnly` (chỉ giá vốn). USDT có `fiatOnly` + `pnlRate` vì đem USDT mua coin không phải là bán. Nạp thêm 39 dòng nạp/rút USDT, tỷ giá vốn TB ra 26,9545k đúng sổ tay. |
| 2026-09-13 | **Tab DCA gom về 2 hàng card + 3 popup, cố định kích thước.** Phân rã điểm nhập vào hero; Ví Coin lên hàng đầu bên phải Giá vốn (card này hẹp lại); Lịch sử, Thêm coin, Mua nhanh thành ba nút mở popup. ADA/USDT không giấu card nữa mà ghi "không chấm" trong đúng khung; chiều cao pin bằng min-height đo ở trạng thái đầy nhất ⇒ 5 card giữ nguyên pixel khi đổi coin. Ô thống kê: số và chú thích cùng hàng, cắt gọn, cao cố định. |
| 2026-09-13 | **Gộp Sổ tháng + Công nợ thành tab Dòng tiền.** Bốn card ngang chia đều. Công nợ giữ nguyên là số dư hôm nay dù xem tháng nào. Bỏ trùng lặp "thu chưa nhận". Nhóm chi "Trả nợ" giữ nguyên như ghi chú. Ngưỡng bố cục đo thật chứ không đoán. Thêm `testViews()`. |
| 2026-09-13 | **Sự cố mất dữ liệu.** Owner khôi phục file cũ lên Firebase và mất dữ liệu cả tháng 9. Firestore không có đường hoàn tác: `getFirestore()` mặc định là cache trong RAM nên không còn bản sao trong IndexedDB, và PITR phải bật trước (Blaze). Hai việc đã làm: (1) nút **Tìm dữ liệu cũ trong trình duyệt này** đọc lại `localStorage` còn sót từ thời chế độ thử cục bộ — chế độ Firebase không bao giờ đụng vào chỗ đó; (2) `restoreBackup` và `importInitialData({force})` giờ **tự tải một bản sao lưu về máy trước khi gọi `clearAll()`**. Mọi thao tác xoá sạch về sau phải giữ chốt này. |
