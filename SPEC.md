# SPEC — Công cụ kiểm soát tài chính cá nhân (FinTrace v1)

Tài liệu này mô tả chính xác thứ cần xây, để Claude Code triển khai. Nó thay thế hoàn toàn bản demo `index.html` hiện tại (bản đó chỉ dùng lại phần CSS nếu muốn, còn logic và dữ liệu bỏ).

## 0. Bối cảnh và nguyên tắc

- Người dùng (Vinh) đã theo dõi tài chính cá nhân bằng Google Sheets liên tục 19 tháng. App phải **phản chiếu đúng workflow đó**, chỉ bớt ma sát, không thêm khái niệm mới.
- Đơn vị tiền trong toàn app: **nghìn đồng** (nhập `86` = 86.000đ). Hiển thị dạng `86k`, `2.635k`, và `31,74 tr` cho số lớn.
- Một người dùng, có mật khẩu. Nhập chủ yếu trên máy tính; phải dùng được trên điện thoại nhưng không tối ưu cho điện thoại.
- Không có "nguồn tiền" theo giao dịch. Số dư tài khoản/tài sản **nhập tay**.
- Làm theo pha. Không làm pha sau khi pha trước chưa được dùng thật.

## 1. Phạm vi

Trong phạm vi (pha 1–2):
1. Sổ thu/chi theo tháng, có phân loại, có ngày tự gắn.
2. Khoản thu "chưa nhận" (tạm tính) — cơ chế thay cho việc bôi vàng trong sheet.
3. Công nợ: người khác nợ mình / mình nợ, có thể tính bằng **VND hoặc chỉ vàng**.
4. Tài sản: danh sách tài sản theo *số lượng × giá*, giá nhập tay hoặc live.
5. Chốt tháng: lưu snapshot thu, chi, chi theo nhóm, tài sản ròng; xem lịch sử và biểu đồ.
6. Mục tiêu thu nhập tháng và tốc độ cần đạt mỗi ngày.

Ngoài phạm vi (không làm): sổ lô coin/vàng (giá vốn, lãi lỗ từng lô), nhắc lịch đáo thẻ, gán tài khoản cho từng giao dịch, đối soát số dư, ngân sách theo nhóm, nhiều người dùng, kịch bản DCA.

## 2. Kỹ thuật

- **Single-file HTML** (`index.html`, inline CSS + JS, không build step), deploy GitHub Pages.
- **Firebase**: Firestore để lưu dữ liệu, Firebase Auth (email/password) để khoá app. Rule Firestore: chỉ uid của chủ app được đọc/ghi. Cấu hình Firebase đặt trong một object `CONFIG` ở đầu file.
- Giá crypto/USD lấy qua **Cloudflare Worker** (proxy tới CoinGecko hoặc tương đương) để tránh CORS và giấu key; nếu Worker lỗi thì dùng giá nhập tay gần nhất và hiện cảnh báo. Pha 1 có thể chỉ nhập tay.
- Mọi tính toán (tổng, tài sản ròng, tốc độ/ngày) làm phía client từ dữ liệu Firestore; không có backend logic.
- Không dùng framework. Có thể dùng Chart.js từ CDN cho biểu đồ.

## 3. Mô hình dữ liệu (Firestore)

Tất cả collection nằm dưới `users/{uid}/`.

### 3.1 `transactions`
| Trường | Kiểu | Ghi chú |
|---|---|---|
| `type` | `"thu"` \| `"chi"` | |
| `name` | string | "Nước", "Hạ Long", "Tâm Anh" |
| `amount` | number | nghìn đồng, luôn dương. Nếu có `parts` thì `amount = sum(parts)` |
| `parts` | number[] (tuỳ chọn) | các khoản con của một dòng gộp, ví dụ chuyến Hạ Long `[10,190,1700,300,...]` |
| `category` | string | với `chi`: một trong danh sách nhóm chi. Với `thu`: `"Lương"`, `"Hoa hồng"`, `"Khác"` |
| `date` | string `YYYY-MM-DD` | **tự gắn = hôm nay lúc tạo**, sửa được |
| `month` | string `YYYY-MM` | suy ra từ `date`, dùng để query |
| `pending` | boolean | chỉ với `thu`: `true` = chưa nhận tiền (tạm tính). Mặc định `false` |
| `note` | string (tuỳ chọn) | |
| `createdAt` | timestamp | |

Nhóm chi cố định (theo sheet): `Ăn uống, Dịch vụ, Giải trí, Mua sắm, Sửa chữa, Sức khoẻ, Trả nợ, Xã giao`. Cho phép thêm nhóm trong Cài đặt nhưng không xoá nhóm đã có giao dịch.

### 3.2 `debts`
| Trường | Kiểu | Ghi chú |
|---|---|---|
| `party` | string | tên người / đối tượng |
| `direction` | `"receivable"` \| `"payable"` | họ nợ mình / mình nợ |
| `unit` | `"VND"` \| `"GOLD_CHI"` | đơn vị |
| `quantity` | number | với VND là nghìn đồng, với vàng là số chỉ |
| `priceKey` | string (tuỳ chọn) | khoá giá dùng để định giá khi `unit = GOLD_CHI`, ví dụ `"gold_pd"` |
| `note` | string | |
| `settled` | boolean | đã tất toán thì ẩn khỏi tổng, giữ lịch sử |
| `createdAt`, `settledAt` | timestamp | |

Giá trị VND của một khoản nợ = `quantity` nếu VND, = `quantity × price[priceKey]` nếu vàng.

### 3.3 `holdings` (tài sản)
| Trường | Kiểu | Ghi chú |
|---|---|---|
| `name` | string | "Vietcombank", "ETH", "Vàng Phi Đoan" |
| `group` | `"Tiền"` \| `"Crypto"` \| `"Vàng"` \| `"Bạc"` \| `"Chứng khoán"` \| `"Khác"` | dùng cho biểu đồ cơ cấu |
| `quantity` | number | số lượng (VND thì là nghìn đồng, coin là số coin, vàng là chỉ) |
| `priceKey` | string \| null | `null` = giá trị = quantity (tiền mặt, ngân hàng, VCBS nhập tay) |
| `order` | number | thứ tự hiển thị |

Giá trị = `quantity × (priceKey ? price[priceKey] : 1)`.

### 3.4 `prices` (một document `current`)
Map `priceKey → { value, source: "manual"|"live", updatedAt }`, giá tính bằng **nghìn đồng cho 1 đơn vị**.

Khoá giá ban đầu và cách tính:
- `usdt`: `(tỷ giá USD/VND + 400) / 1000` — giữ đúng công thức của sheet (cộng 400đ chênh lệch mua USDT).
- `btc`, `eth`, `ada`: `giá USD × usdt`.
- `gold_pd` (vàng Phi Đoan), `gold_acr` (vàng Ancarat), `silver_acr` (bạc ACR), `silver_pq` (bạc PQ), `hoa_khai_acr`: **nhập tay**, giá 1 chỉ.

### 3.5 `months` (chốt tháng)
Document id = `YYYY-MM`.
| Trường | Ghi chú |
|---|---|
| `income` | tổng thu (gồm cả pending, theo cách người dùng đang làm) |
| `expense` | tổng chi |
| `byCategory` | map nhóm chi → số tiền |
| `netWorth` | tài sản ròng tại thời điểm chốt |
| `note` | ghi chú tự do (ví dụ "có thưởng Tết") |
| `closedAt` | timestamp |

Chốt tháng là hành động thủ công (nút "Chốt tháng"), có thể chốt lại (ghi đè) nếu sửa số. Các tháng import từ sheet chỉ có `income/expense/byCategory/netWorth`, không có giao dịch chi tiết.

### 3.6 `settings` (một document)
`incomeTarget` (nghìn đồng/tháng, ban đầu 50.000), danh sách nhóm chi, danh sách nhóm thu.

## 4. Quy tắc tính

- **Thu tháng** = Σ `thu` trong tháng (kể cả `pending = true`). Hiện riêng dòng nhỏ "trong đó chưa nhận: X".
- **Chi tháng** = Σ `chi` trong tháng.
- **Chênh lệch** = thu − chi.
- **Công nợ ròng** = Σ receivable − Σ payable (chưa settled) **+ Σ thu pending của tháng hiện tại** (khoản chưa nhận được coi là người ta đang nợ mình — đúng như sheet ghi lặp ở cột công nợ). Nhờ vậy một khoản chỉ nhập một lần.
- **Tổng tài sản** = Σ giá trị holdings.
- **Tài sản ròng** = tổng tài sản + công nợ ròng.
- **Tốc độ cần đạt mỗi ngày** = `(incomeTarget − thu tháng) / (số ngày còn lại trong tháng, tính cả hôm nay)`. Nếu đã đạt mục tiêu, hiện "Đã đạt".
- **Tăng trưởng tháng** (màn lịch sử) = `netWorth[t] − netWorth[t−1]`; hệ số = tăng / (thu − chi); tốc độ = `netWorth[t]/netWorth[t−1] − 1`. Giữ đúng 3 cột Q/R/S của sheet.
- Khi đánh dấu một khoản `pending` thành đã nhận: chỉ đổi cờ, không tạo giao dịch mới.

## 5. Màn hình

Thanh điều hướng 4 mục. Không có "Đối soát", không có "Nguồn tiền".

### 5.1 Sổ tháng (màn mặc định)
- Chọn tháng (mặc định tháng hiện tại). Ba số to: Thu, Chi, Chênh lệch; dưới Thu có "chưa nhận: X"; dưới cùng là "Cần thu thêm X/ngày để đạt mục tiêu 50 tr".
- Hai cột cạnh nhau như sheet: **Chi** (trái) và **Thu** (phải), mỗi cột là bảng gọn: ngày, tên, nhóm, số tiền, nút sửa/xoá. Khoản pending hiển thị nền vàng nhạt và có nút "Đã nhận".
- Ô nhập nhanh ở đầu mỗi cột: tên, số tiền, nhóm; Enter để lưu, ngày tự gắn. Ô số tiền chấp nhận biểu thức `10+40+450` → lưu `parts` và `amount`. Với thu có checkbox "chưa nhận".
- Bảng nhỏ "Chi theo nhóm" của tháng (tương đương SUMIF cột J–K).
- Nút "Chốt tháng" lưu snapshot vào `months`.

### 5.2 Công nợ
- Hai danh sách: "Họ nợ mình" và "Mình nợ". Mỗi dòng: tên, số lượng + đơn vị (`1 chỉ vàng` hoặc `5.000k`), giá trị VND quy đổi, ghi chú, nút "Tất toán".
- Tổng ròng ở đầu trang, kèm dòng "thu chưa nhận tháng này: X" đã cộng vào.
- Tick "Hiện đã tất toán" để xem lịch sử.

### 5.3 Tài sản
- Bảng holdings: tên, nhóm, số lượng, giá, giá trị, sửa inline. Số lượng và giá nhập tay sửa trực tiếp trên bảng, không mở modal.
- Bảng giá: mỗi priceKey một dòng, giá + nguồn + thời điểm cập nhật, nút "Cập nhật giá live" cho các khoá crypto.
- Đầu trang: Tổng tài sản, Công nợ ròng, **Tài sản ròng**; biểu đồ cơ cấu theo `group`.

### 5.4 Lịch sử
- Bảng các tháng đã chốt: tháng, thu, chi, chênh lệch, tài sản ròng, tăng, hệ số, tốc độ, ghi chú.
- Biểu đồ cột thu/chi theo tháng và đường tài sản ròng. Dòng trung bình 12 tháng gần nhất.
- Bảng chi theo nhóm × tháng (tương đương cột T–AA).

## 6. Dữ liệu khởi tạo (import từ sheet)

Viết một script/nút "Import dữ liệu ban đầu" chạy một lần, tạo đúng các bản ghi dưới đây. Số tiền: nghìn đồng.

### 6.1 Lịch sử chốt tháng (`months`)
Cột trong sheet: M = chi, N = thu (lưu ý: Codex đã hiểu ngược).

| Tháng | Chi | Thu | Tài sản ròng cuối kỳ |
|---|---|---|---|
| 2025-01 | 28.821 | 66.210 | — |
| 2025-02 | 26.534 | 13.548 | — |
| 2025-03 | 33.707 | 26.870 | — |
| 2025-04 | 19.313 | 33.346 | — |
| 2025-05 | 24.347 | 63.539 | — |
| 2025-06 | 25.950 | 22.831 | — |
| 2025-07 | 22.327 | 32.355 | — |
| 2025-08 | 19.988 | 23.419 | — |
| 2025-09 | 26.110 | 31.615 | — |
| 2025-10 | 45.816 | 29.481 | — |
| 2025-11 | 25.709 | 41.122 | — |
| 2025-12 | 42.109 | 44.518 | 170.888 |
| 2026-01 | 32.293 | 89.965 | 219.042 |
| 2026-02 | 36.124 | 119.030 | 289.962 |
| 2026-03 | 38.921 | 31.930 | 284.339 |
| 2026-04 | 32.531 | 56.960 | 291.850 |
| 2026-05 | 38.146 | 49.197 | 304.826 |
| 2026-06 | 41.181 | 54.737 | 271.960 |
| 2026-07 | 31.453 | 43.111 | 300.421 |

Chi theo nhóm (Ăn uống, Dịch vụ, Giải trí, Mua sắm, Sửa chữa, Sức khoẻ, Trả nợ, Xã giao):

| Tháng | Ăn uống | Dịch vụ | Giải trí | Mua sắm | Sửa chữa | Sức khoẻ | Trả nợ | Xã giao |
|---|---|---|---|---|---|---|---|---|
| 2025-02 | 2.922 | 2.109 | 3.153 | 2.956 | 1.000 | 1.632 | 5.840 | 6.922 |
| 2025-03 | 5.513 | 11.449 | 270 | 880 | 1.000 | 4.718 | 6.175 | 3.702 |
| 2025-04 | 4.064 | 2.094 | 0 | 4.575 | 0 | 1.255 | 4.990 | 2.335 |
| 2025-05 | 5.094 | 1.935 | 70 | 1.050 | 250 | 2.915 | 5.820 | 7.213 |
| 2025-06 | 6.201 | 10.630 | 171 | 1.114 | 0 | 1.209 | 3.950 | 2.675 |
| 2025-07 | 8.584 | 1.827 | 325 | 4.632 | 0 | 380 | 3.911 | 2.668 |
| 2025-08 | 6.847 | 3.032 | 440 | 928 | 180 | 160 | 4.089 | 4.391 |
| 2025-09 | 4.533 | 10.858 | 1.120 | 1.957 | 225 | 350 | 750 | 6.317 |
| 2025-10 | 7.797 | 2.078 | 1.587 | 22.600 | 195 | 375 | 2.972 | 8.212 |
| 2025-11 | 6.979 | 1.695 | 1.184 | 4.177 | 0 | 0 | 5.900 | 5.774 |
| 2025-12 | 6.203 | 9.678 | 1.910 | 5.550 | 0 | 380 | 8.961 | 9.427 |
| 2026-01 | 4.534 | 1.059 | 1.730 | 7.254 | 0 | 350 | 8.815 | 7.741 |
| 2026-02 | 10.682 | 588 | 5.000 | 361 | 0 | 2.218 | 9.185 | 8.090 |
| 2026-03 | 1.707 | 10.948 | 3.280 | 5.145 | 630 | 1.916 | 7.998 | 7.297 |
| 2026-04 | 5.243 | 2.018 | 2.163 | 3.329 | 0 | 30 | 9.275 | 10.473 |
| 2026-05 | 5.065 | 1.543 | 4.526 | 3.006 | 0 | 350 | 13.122 | 10.534 |
| 2026-06 | 6.222 | 10.845 | 0 | 2.152 | 160 | 2.620 | 12.003 | 7.179 |
| 2026-07 | 6.285 | 673 | 1.311 | 1.906 | 0 | 350 | 11.286 | 9.642 |

(2025-01 không có chi tiết theo nhóm.)

### 6.2 Sổ tháng hiện tại (tháng 08/2026, `transactions`)
Ngày: gán `2026-08-01` cho tất cả vì sheet không có ngày.

Chi:
Nước 86 (Ăn uống) · Nghi Sơn parts `[10,40,450,910,45,80,170,550]` = 2.255 (Giải trí) · Trường 2.635 (Xã giao) · Taxi 76 (Dịch vụ) · Momo 3.422 (Trả nợ) · AI 35 (Dịch vụ) · Nước 110 (Xã giao) · Cổng 120 (Mua sắm) · Tạp hoá 38 (Ăn uống) · Bia 400 (Xã giao) · Đổ xăng 120 (Dịch vụ) · Aeon 36 (Ăn uống) · Coffee 110 (Ăn uống) · Cắt tóc 80 (Dịch vụ) · Hạ Long parts `[10,190,1700,300,100,270,175,220,360,100,500,20,140]` = 4.085 (Giải trí) · Trường 1.500 (Xã giao) · Tiền nước 59 (Dịch vụ) · Zalo 200 (Dịch vụ) · Đáo thẻ 410 (Trả nợ) · Zalo 490 (Dịch vụ) · Đổ xăng 130 (Dịch vụ) · Thịt 100 (Ăn uống) · MacMini parts `[21990,396]` = 22.386 (Mua sắm) · Bàn phím 589 (Mua sắm) · Dây 50 (Mua sắm) · Bàn phím 452 (Mua sắm) · Bánh 181 (Ăn uống) · Bóng đèn 75 (Mua sắm).

Thu (nhóm `Hoa hồng` trừ khi ghi khác):
Tâm Anh 900 · Thủ đô 1.450 · Xuân Biển 4.000 · Lương parts `[15739,-1087]` = 14.652 (Lương) · Tiến 500 · Hương PL 1.000 · Xuân Biển 1.100 · Khôi 250 · Giảng Võ 100 · RU12 376 · MR24 250 · Tâm Anh 400 · LVS 4.800 **pending** (parts `[1200,1200,1200,1200]`) · Giảng Võ 100 · Thủ đô 400 · Xuân Biển 100 · Sinh nhật 300 (Khác) · Thủ đô 150 · Xuân Biển 450 (parts `[9600,-9150]`) · Giảng Võ 165.

Các dòng F24–F29 trong sheet (LVS 4.800, Tâm Anh 900, Xuân Biển 1.100, Thủ đô 150, Xuân Biển 300, Xuân Biển 450) là khoản thu **chưa nhận**: đánh `pending = true` cho các giao dịch thu tương ứng, **không** tạo bản ghi `debts`. Lưu ý sheet có "Xuân Biển 300" ở cột thu là 300 và ở công nợ cũng 300 — đánh pending cho giao dịch Xuân Biển 300.

### 6.3 Công nợ (`debts`)
Họ nợ mình (receivable): Hiệp 1 chỉ vàng (`gold_pd`) · Thắng 1 chỉ vàng · Thắng 1.300 · Trường 1 chỉ vàng · Trường 5.000 · Thi 1.000 · Việt 2.000 · Cường TP 1.000 · Cường PH 2.000 · Hà My 1.000 · Trung 1.000 · Huyền 1 chỉ vàng · Tú 1 chỉ vàng **settled** (sheet ghi `K13−K13`) · "Mừng / Gửi" (không có số, tạo với quantity 0, note "chưa rõ").

Mình nợ (payable): VP (thẻ tín dụng VPBank) 25.000 · Dư đặt hàng 12.791, note "tiền ứng công ty để đặt hàng, chưa đặt hết" · Hiệp 2.000 · Tú 1.000 · Công 5.000 · Giảng Võ 785 · Khôi 3.399 · Phương Dương Xá 7.200 · Xuân Biển 5.000 · Hương PL 27.100 · Xuân Biển 5.950.

### 6.4 Tài sản (`holdings`) và giá (`prices`)
| Tên | Nhóm | Số lượng | priceKey |
|---|---|---|---|
| Vietcombank | Tiền | 531 | null |
| Tiền mặt | Tiền | 150 | null |
| USDT | Crypto | 565,49 | usdt |
| BTC | Crypto | 0,0047116 | btc |
| ETH | Crypto | 1,93213 (= 1,28871 + 0,59104913×1,0886) | eth |
| ADA | Crypto | 1.079,26 | ada |
| Vàng Phi Đoan | Vàng | 3 chỉ | gold_pd |
| Vàng Ancarat | Vàng | 1,8 chỉ | gold_acr |
| Vàng BTMH | Vàng | 1,3 chỉ | gold_acr |
| Hoa khai ACR | Vàng | 1 | hoa_khai_acr |
| Bạc ACR | Bạc | 17 chỉ | silver_acr |
| Bạc PQ | Bạc | 5 chỉ | silver_pq |
| VCBS | Chứng khoán | 28.950 | null |

Giá nhập tay ban đầu (nghìn đồng/đơn vị): gold_pd 14.300 · gold_acr 15.300 · silver_acr 3.000 · silver_pq 3.000 · hoa_khai_acr 3.200 · usdt 26,4855 · btc 2.088.393 · eth 65.996 · ada 5,43.

Kiểm tra sau import: tổng tài sản ≈ 347.350, công nợ ròng ≈ −30.330 (đã cộng pending), tài sản ròng ≈ 317.030 — khớp `I1` của sheet. Nếu lệch quá 1% thì import sai.

## 7. Pha triển khai và tiêu chí nghiệm thu

**Pha 1 — thay thế được sheet (mục tiêu duy nhất: dùng hàng ngày).**
Đăng nhập; Sổ tháng đầy đủ (nhập nhanh, biểu thức cộng, pending, chi theo nhóm, tốc độ/ngày); Công nợ; Tài sản với giá nhập tay; Chốt tháng; Lịch sử với bảng và biểu đồ; Import dữ liệu mục 6.
Nghiệm thu: sau import, các số ở mục 6.4 khớp; nhập 1 khoản chi mất dưới 5 giây bằng bàn phím; đóng trình duyệt mở lại dữ liệu còn nguyên; mở trên điện thoại vẫn đọc và nhập được.

**Pha 2 — giá live.** Worker Cloudflare trả `{usdvnd, btc, eth, ada}`; nút cập nhật giá; hiển thị thời điểm cập nhật; fallback giá tay.
Nghiệm thu: tắt Worker app vẫn chạy và báo "giá cũ".

**Pha 3 — chỉ làm khi pha 1 đã dùng ≥ 1 tháng.** Xu hướng chi theo nhóm 6 tháng, so sánh tháng này với trung bình, export CSV.

## 8. Những gì KHÔNG mang từ bản Codex sang
- Dữ liệu hard-code trong JS và ngày giao dịch bịa từ index.
- Biểu đồ "Năm" lấy dòng 14–23 của sheet (lẫn dòng tổng và dòng trung bình) và đảo thu/chi.
- Khái niệm Nguồn tiền, số dư mở, điều chỉnh đối soát, màn Đối soát.
- Nhóm thu "Tín Phát", "Xã giao".
- Trạng thái "Dự kiến chi" (chỉ có thu mới có pending).
