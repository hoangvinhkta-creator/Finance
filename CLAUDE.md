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
- **Bảng giá thiếu tỉ giá USDT dưới mỗi dòng (owner báo lại 2026-09-13, đã bỏ sót ở lần làm trước):** lần trước chỉ thêm dòng tỉ suất neo (`1 WBETH ≈ … ETH`) cho riêng WBETH, còn tỉ giá USDT/VND dùng để quy đổi thì không hiện ở đâu cho các coin khác. Sửa: mọi dòng có giá USDT (trừ chính `usdt`) giờ có thêm dòng nhỏ `1 USDT ≈ 26,4855k` ngay dưới — dùng `fmtK(uRate,4)` (giữ 4 số lẻ, **không** dùng mặc định làm tròn nguyên như cột "Giá" vì tỉ giá quanh mức hàng chục cần số lẻ mới có nghĩa). WBETH có cả hai dòng: tỉ giá USDT chung + tỉ suất neo riêng.

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
| 2026-09-13 | **Bảng giá bị bỏ sót tỉ giá USDT/VND.** Owner báo lại lần làm trước chỉ thêm dòng tỉ suất neo riêng cho WBETH, thiếu đúng cái được yêu cầu ban đầu: tỉ giá USDT dùng để quy đổi hiện dưới MỌI coin. Thêm dòng `1 USDT ≈ 26,4855k` dưới cột USDT cho mọi dòng có giá, giữ 4 số lẻ (không làm tròn nguyên như cột "Giá" vì mất hết ý nghĩa ở mức tỉ giá này). |
| 2026-09-13 | **Gộp Sổ tháng + Công nợ thành tab Dòng tiền.** Bốn card ngang chia đều. Công nợ giữ nguyên là số dư hôm nay dù xem tháng nào. Bỏ trùng lặp "thu chưa nhận". Nhóm chi "Trả nợ" giữ nguyên như ghi chú. Ngưỡng bố cục đo thật chứ không đoán. Thêm `testViews()`. |
| 2026-09-13 | **Sự cố mất dữ liệu.** Owner khôi phục file cũ lên Firebase và mất dữ liệu cả tháng 9. Firestore không có đường hoàn tác: `getFirestore()` mặc định là cache trong RAM nên không còn bản sao trong IndexedDB, và PITR phải bật trước (Blaze). Hai việc đã làm: (1) nút **Tìm dữ liệu cũ trong trình duyệt này** đọc lại `localStorage` còn sót từ thời chế độ thử cục bộ — chế độ Firebase không bao giờ đụng vào chỗ đó; (2) `restoreBackup` và `importInitialData({force})` giờ **tự tải một bản sao lưu về máy trước khi gọi `clearAll()`**. Mọi thao tác xoá sạch về sau phải giữ chốt này. |
