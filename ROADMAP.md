# ROADMAP — FinTrace

Bản đồ đường đi từ hôm nay đến khi FinTrace có tab DCA dùng được hàng ngày.
Cập nhật: 2026-09-12. Cách làm việc xem `CLAUDE.md`, đặc tả 5 tab tài chính xem `SPEC.md`.

Nguyên tắc xuyên suốt: **mỗi việc nhỏ, làm xong merge lên `main` ngay, owner mở app kiểm tra bằng cách dùng.**
Không mở pha sau khi pha trước chưa dùng thật.

---

## Toàn cảnh

| Pha | Nội dung | Trạng thái |
|---|---|---|
| **P0** | Dữ liệu lên Firebase | **xong** |
| **P1** | Tab DCA — nhìn là biết nên làm gì | đang làm |
| **P2** | Tự động hoá quyết định (ladder, cooldown, state machine) | chờ P1 dùng thật 1 tháng |
| **P3** | Về sau — chưa cam kết | — |

```text
P0  dữ liệu an toàn trên Firebase — xong
 └─ P1  C: giá vốn ETH → A: Buy Score → B: kế hoạch vốn → D: đồng bộ Binance
     └─ P2  ladder → cooldown → state machine → crash mode
```

---

## P0 — Dữ liệu lên Firebase ✅ xong

**Mục tiêu:** dữ liệu FinTrace nằm trên Firebase, mở máy nào cũng thấy, không còn phụ thuộc localStorage của một trình duyệt.

| # | Việc | Ai làm | Trạng thái |
|---|---|---|---|
| P0.1 | Sao lưu và khôi phục bằng file JSON | Claude | xong — PR #5 |
| P0.2 | Tạo project Firebase mới (`fintrace-353f4`), bật Auth, tạo user, tạo Firestore, publish rules | Owner | xong |
| P0.3 | Điền `CONFIG` vào `index.html`, merge lên `main` | Claude | xong — PR #7 |
| P0.4 | Bật GitHub Pages, thêm authorized domain | Owner | xong |
| P0.5 | Nạp dữ liệu và nghiệm thu | Owner | **xong — nghiệm thu đầy đủ 2026-09-13** |

**Nghiệm thu P0:** đăng nhập trên máy tính, nhập một khoản chi, mở app trên điện thoại thấy ngay khoản đó. Tổng tài sản ≈ 347.350k, công nợ ròng ≈ −30.330k, tài sản ròng ≈ 317.030k.

---

## P1 — Tab DCA (đang làm)

**Mục tiêu một câu:** mở tab DCA, trong 5 giây biết ETH đang bao nhiêu, Buy Score bao nhiêu, tháng này còn bao nhiêu vốn được mua, và mình đang giữ bao nhiêu ETH với giá vốn nào.

Làm đúng thứ tự C → A → B → D, mỗi khối một PR, merge xong mới làm khối sau.

### P1.C — Lịch sử mua và giá vốn ETH ✅ xong — PR #9

Chỉ dùng dữ liệu đã có, không gọi mạng. Làm trước vì có ích ngay và rủi ro thấp nhất.

- Thêm nhãn nguồn vốn (`BASE` / `SMART` / `OPPORTUNITY` / `MANUAL`) vào mỗi lần chuyển đổi sang ETH.
- Tab DCA hiện: tổng ETH, tổng vốn, giá vốn trung bình, giá hiện tại, giá trị, lãi lỗ.
- Bảng lịch sử mua, lọc theo nguồn.

**Nghiệm thu:** giá vốn trung bình khớp với con số owner tự tính tay từ 2 đến 3 lần mua gần nhất. Owner kiểm tra tab DCA trên app thật sau khi có vài lần chuyển đổi USDT → ETH.

### P1.A — Buy Score và chỉ báo ✅ xong — PR #11

- Nút Cập nhật gọi Binance lấy 400 ngày nến ETH và BTC, tính 7 thành phần điểm.
- Hiện điểm tổng 0–100, Market State, Confidence, bảng phân rã 7 dòng.
- Cập nhật luôn giá ETH và BTC trong bảng giá, bật nút "Cập nhật giá live" ở tab Tài sản đang khoá.
- Binance lỗi thì giữ số cũ và báo "dữ liệu cũ", không bao giờ ra điểm sai.

**Nghiệm thu:** bấm Cập nhật ra điểm trong 3 giây; tự tính tay MA200 và RSI14 từ dữ liệu khác cho ra cùng kết quả; tắt mạng vẫn mở được tab và thấy nhãn dữ liệu cũ.

**Rủi ro:** Binance có thể chặn gọi thẳng từ trình duyệt (CORS hoặc chặn vùng). Nếu vậy chuyển sang CoinGecko, hàm tính điểm giữ nguyên. Không đội thêm việc.

**Còn chờ owner:** sandbox của session Claude chặn mọi kết nối ra ngoài nên chưa gọi được Binance thật; hàm tính đã kiểm bằng nến tự tạo (`testBuyScore()` — 34 ca). Owner bấm Cập nhật trên app thật để xác nhận Binance gọi được từ GitHub Pages.

### P1.B — Kế hoạch vốn tháng ✅ xong — PR #13

- Cài đặt thêm: ngân sách tháng, tỷ lệ Base/Smart/Opportunity (mặc định 50/30/20), lịch Base (ngày 3, 13, 23).
- Tab DCA hiện: Base đã mua trên tổng và kỳ nào tới hạn, Smart mở bao nhiêu theo điểm, Opportunity Fund còn bao nhiêu.
- Một dòng gợi ý tĩnh, ví dụ "Score 72 · Smart mở 100% (3.000k) · Base kỳ 13 chưa mua (1.500k)".

**Nghiệm thu:** đổi ngân sách trong Cài đặt thì mọi con số trên tab DCA đổi theo đúng tỷ lệ.

### P1.D — Đồng bộ tài sản từ Binance

- Kéo số dư ETH, USDT, BTC, ADA từ tài khoản Binance về tab Tài sản thay vì nhập tay.
- API key **chỉ đọc**, tắt rút tiền và giao dịch, lưu trên Firestore, không bao giờ vào repo.
- Là nút bấm, không tự chạy. Có bảng đối chiếu Binance / FinTrace / lệch trước khi ghi đè.

**Rủi ro:** endpoint cần ký chữ ký có thể bị chặn CORS. Nếu vậy dừng và hỏi owner, không tự dựng proxy.

---

## P2 — Tự động hoá quyết định

Mở khi P1 đã dùng thật ít nhất một tháng. Tất cả vẫn tính lúc mở tab, không có gì chạy nền.

1. **Ladder và buy zones** — thang giá mua, neo cố định, vùng giá không bao giờ dịch lên.
2. **Cooldown** — 48 giờ sau mỗi lần mua, phá lệ khi giá giảm thêm 7%.
3. **State machine rút gọn** — WAIT / BASE_DUE / SMART_READY / OPPORTUNITY_READY / MONTH_END.
4. **Crash mode** — thang riêng khi giảm sâu.
5. **ACTION_PENDING** — tách khuyến nghị khỏi giao dịch đã thực hiện.

---

## P3 — Về sau, chưa cam kết

Backtest so sánh chiến lược, nhật ký quyết định, xu hướng chi theo nhóm 6 tháng, xuất CSV, thông báo. Chỉ mở khi dùng thật thấy thiếu.

---

## Không làm

Tự động đặt lệnh mua bán, đòn bẩy, dự đoán giá, nhiều coin có chiến lược riêng, nhiều người dùng, kế toán thuế, đổi kiến trúc sang framework hay có build step.

---

## Nhật ký

| Ngày | Việc |
|---|---|
| 2026-09-12 | Bỏ roadmap CoinDCA và repo `coin`. Thêm `CLAUDE.md`. Xong P0.1 sao lưu và khôi phục. Mở P0. |
| 2026-09-13 | Nối project Firebase `fintrace-353f4` (PR #7). Owner nghiệm thu đầy đủ P0. Mở P1, bắt đầu Khối C. |
| 2026-09-13 | Xong Khối C: tab DCA, nguồn vốn trên transfers, giá vốn ETH (PR #9). Tiếp theo: Khối A — Buy Score. |
| 2026-09-13 | Xong Khối A: Buy Score 7 thành phần, nút Cập nhật gọi Binance, giá ETH/BTC/ADA thành live (PR #11). Tiếp theo: Khối B — kế hoạch vốn tháng. |
| 2026-09-13 | Xong Khối B: cài đặt ngân sách DCA, card "Tháng này" với Base/Smart/Opportunity Fund và dòng gợi ý (PR #13). Tiếp theo: Khối D — đồng bộ tài sản từ Binance. |
