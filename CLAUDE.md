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
| Router | `VIEWS`, `route()`, `render()` | Hash routing `#tong #so #congno #taisan #lichsu #caidat`. `render()` gọi đúng một `renderXxx` theo `state.view`. |
| Render | `renderOverview`, `renderLedger`, `renderDebts`, `renderHoldings`, `renderHistory`, `renderSettings` | Mỗi tab một hàm, dựng innerHTML bằng template string, `esc()` mọi chuỗi người dùng. |
| Import | `importInitialData` | Chạy một lần, dữ liệu mục 6 SPEC.md. |

**Thêm một tab mới** cần đúng 5 chỗ: một `<a data-view>` trong `nav.nav` (sidebar) và trong `nav.tabbar` (mobile), một `<section id="view-xxx" class="view">`, thêm tên vào `VIEWS`, thêm `renderXxx` vào map trong `render()`. Mobile tabbar đang là `grid-template-columns:repeat(6,1fr)` — thêm tab thì đổi thành 7 hoặc gộp bớt.

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

### Đồng bộ tài sản từ Binance (làm sau khi 3 khối chạy)
- Mục đích: kéo số dư ETH/USDT/BTC/ADA từ tài khoản Binance về `holdings` thay vì nhập tay.
- Chỉ dùng **API key read-only**, tắt withdraw và trade. Key lưu trong `settings/main` trên Firestore (rules đã chặn mọi uid khác), **không bao giờ** commit vào repo.
- Endpoint `GET /api/v3/account` cần ký HMAC-SHA256 bằng Web Crypto ngay trong trình duyệt. Nếu Binance chặn CORS với endpoint đã ký thì dừng, báo owner, không tự dựng proxy khi chưa hỏi.
- Đồng bộ là nút bấm, không tự chạy. Có bảng đối chiếu "Binance / FinTrace / lệch" trước khi ghi đè quantity.

### Khối E — ETH và BTC song song (thêm 2026-09-13, owner yêu cầu)
- Tab DCA có bộ chọn coin **ETH / BTC** áp cho cả bốn phần: Buy Score, kế hoạch vốn tháng, giá vốn, lịch sử mua.
- Cùng một thuật toán, không có chiến lược riêng cho từng coin. Thành phần điểm thứ 7 soi gương nhau: ETH chấm theo ETH/BTC, BTC chấm theo BTC/ETH (`DCA_COINS[].ref`).
- Mỗi coin một khối cài đặt riêng: `settings.dca = {eth:{...}, btc:{...}}`. Cài đặt bản cũ (một khối phẳng) tự chuyển thành khối ETH qua `migrateDcaSettings`.
- Cache điểm đổi thành `prices/current.dca = {usd, coins:{eth, btc}}`; bản cache cũ vẫn đọc được cho ETH.
- Một lần bấm Cập nhật chấm điểm cả hai coin, **không** thêm lệnh gọi mạng nào (ETH và BTC vốn đã tải sẵn để tính thành phần thứ 7).
- Thêm coin thứ ba = thêm một dòng vào `DCA_COINS` và một holding có `priceKey` tương ứng. Không đụng hàm tính.

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
