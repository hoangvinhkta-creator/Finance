# BINANCE — đồng bộ số dư về FinTrace

Hướng dẫn này dành cho owner. **Toàn bộ làm trên trình duyệt**, không cần cài gì, không gõ lệnh.
Mất khoảng 15 phút, làm một lần.

---

## Vì sao phải qua Cloudflare Worker

Binance có hai loại endpoint:

| Loại | Ví dụ | Trình duyệt gọi thẳng được? |
|---|---|---|
| Công khai (giá, nến) | `/api/v3/klines` | **Được** — nút *Cập nhật* ở tab DCA đang dùng, chạy tốt |
| Cần chữ ký (số dư tài khoản) | `/api/v3/account` | **Không** — Binance chặn CORS |

Đã thử trên app thật ngày 2026-09-13: bấm *Đồng bộ Binance* ra lỗi `trình duyệt chặn (CORS)`.
Đó là chính sách của Binance, không sửa được từ phía FinTrace.

Cách đi vòng duy nhất là đặt một "ô trung gian" ở giữa: FinTrace gọi ô đó, ô đó ký rồi gọi Binance.
Cloudflare Worker làm việc này miễn phí (100.000 lượt gọi mỗi ngày — bạn dùng vài lượt một tháng).

**Điểm lợi kèm theo:** khoá API Binance chuyển vào Worker, **không còn nằm trên Firestore nữa**.
Trình duyệt chỉ giữ địa chỉ Worker và một mã truy cập. An toàn hơn cách cũ.

```
FinTrace (GitHub Pages)  ──Bearer <mã truy cập>──▶  Worker (Cloudflare)  ──chữ ký HMAC──▶  Binance
     giữ: URL + mã truy cập                            giữ: API key + secret
```

---

## Phần 1 — Tạo API key trên Binance (chỉ đọc)

Bỏ qua phần này nếu bạn đã tạo key ở lần trước; dùng lại đúng key đó.

1. Đăng nhập [binance.com](https://www.binance.com) trên máy tính.
2. Icon tài khoản góc trên phải → **Account** → **API Management**
   (đường tắt: `https://www.binance.com/en/my/settings/api-management`).
3. **Create API** → chọn **System generated** → đặt nhãn `FinTrace read only` → **Next**.
4. Xác thực 2 lớp (Google Authenticator + mã email, có thể cả SMS).
5. Màn hình hiện **API Key** và **Secret Key**.

   > ⚠️ **Secret Key chỉ hiện đúng một lần.** Đóng trang là mất, phải xoá key và tạo lại.
   > Chép cả hai ra chỗ nào đó trước khi rời trang.

6. Bấm **Edit restrictions** và đặt đúng như sau:

   | Quyền | Đặt |
   |---|---|
   | Enable Reading | ✅ **bật** |
   | Enable Spot & Margin Trading | ❌ tắt |
   | Enable Withdrawals | ❌ tắt |
   | Enable Futures | ❌ tắt |
   | Enable Margin | ❌ tắt |
   | Permits Universal Transfer | ❌ tắt |

7. **IP access restrictions**: chọn **Restrict access to trusted IPs only** nếu Cloudflare cho bạn
   biết IP cố định — nhưng Worker chạy trên nhiều máy chủ khác nhau nên IP không cố định.
   Thực tế phải để **Unrestricted**. Chấp nhận được vì key này chỉ đọc: không đặt lệnh, không rút tiền.
8. **Save**, xác thực lại lần nữa.

---

## Phần 2 — Dựng Cloudflare Worker

### 2.1. Tạo tài khoản

Vào [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up), đăng ký bằng email, xác nhận email.
Không cần thẻ, không cần tên miền.

### 2.2. Tạo Worker

1. Menu trái → **Compute (Workers)** → **Workers & Pages** → **Create** → thẻ **Workers** → **Create Worker**.
2. Đặt tên: `fintrace-binance` (tên này thành địa chỉ, ví dụ `https://fintrace-binance.abc123.workers.dev`).
3. **Deploy** — cứ deploy bản mẫu "Hello World" trước, sửa code ở bước sau.

### 2.3. Dán code

1. Ở trang Worker vừa tạo → **Edit code** (hoặc **</> Edit code** góc trên phải).
2. Xoá sạch nội dung trong khung soạn thảo.
3. Mở file [`binance-worker.js`](binance-worker.js) trong repo này trên GitHub, bấm nút **Copy raw file**,
   rồi dán vào khung soạn thảo của Cloudflare.
4. **Deploy**.

### 2.4. Đặt ba biến bí mật

Quay lại trang Worker → **Settings** → **Variables and Secrets** → **Add**.
Thêm **ba** biến, mỗi biến chọn **Type: Secret** (không phải Text):

| Tên biến | Giá trị |
|---|---|
| `BINANCE_KEY` | API Key chép ở Phần 1 |
| `BINANCE_SECRET` | Secret Key chép ở Phần 1 |
| `ACCESS_TOKEN` | một chuỗi ngẫu nhiên dài do bạn tự đặt — xem bên dưới |

**Cách tạo `ACCESS_TOKEN`:** gõ đại một chuỗi dài, trộn chữ và số, ít nhất 32 ký tự, ví dụ
`ft-9k2mQx7vLp3wRt8sNc4hJb6yZa5dE1g`. Đây là mật khẩu để FinTrace gọi Worker — không phải khoá Binance,
không ai cần biết ngoài bạn. Chép lại để dán vào FinTrace ở Phần 3.

*(Tuỳ chọn, chặt hơn)* thêm biến thứ tư kiểu **Text**, tên `ALLOW_ORIGIN`,
giá trị `https://hoangvinhkta-creator.github.io`. Không đặt thì Worker cho mọi trang gọi,
nhưng vẫn phải có `ACCESS_TOKEN` mới đọc được gì.

Bấm **Deploy** sau khi thêm biến.

### 2.5. Thử Worker

Mở tab mới, dán địa chỉ Worker kèm `/account`, ví dụ:

```
https://fintrace-binance.abc123.workers.dev/account
```

Phải thấy `{"error":"Sai mã truy cập"}`. **Đó là đúng** — nghĩa là Worker sống và đang chặn người lạ.

Nếu thấy `{"error":"Worker chỉ có đường dẫn /account"}` thì bạn quên `/account` ở cuối.
Nếu thấy trang lỗi của Cloudflare thì code chưa deploy xong.

---

## Phần 3 — Nối vào FinTrace

1. Mở app → **Cài đặt** → mục **Binance — đồng bộ số dư**.
2. **Địa chỉ Worker**: dán `https://fintrace-binance.abc123.workers.dev` (dán kèm `/account` cũng được).
3. **Mã truy cập**: dán chuỗi `ACCESS_TOKEN` đã đặt ở bước 2.4.
4. **Lưu**.

Nếu trước đây bạn đã lưu API key thẳng vào FinTrace, sẽ thấy một dòng nhắc màu vàng.
Bấm **Lưu** là khoá cũ bị gỡ khỏi Firestore luôn — không cần làm gì thêm.

---

## Phần 4 — Đồng bộ

Tab **Tài sản** → nút **Đồng bộ Binance** ở góc phải khối *Danh mục*.

Hiện bảng đối chiếu **Binance / FinTrace / Lệch** cho ETH, USDT, BTC, ADA.
Dòng nào lệch thì được tích sẵn. Xem kỹ rồi bấm **Ghi đè số lượng đã chọn**.
Chỉ **số lượng** bị ghi đè; giá và mọi thứ khác giữ nguyên.

Tài sản có trong danh mục nhưng không có trên Binance sẽ hiện *"không có"* và không cho tích —
sẽ không bị ghi đè thành 0.

---

## Khi có lỗi

| Toast trong app | Nghĩa là | Sửa thế nào |
|---|---|---|
| `không gọi được Worker` | Địa chỉ sai, hoặc Worker chưa deploy | Mở địa chỉ đó kèm `/account` trong tab mới, phải ra `{"error":"Sai mã truy cập"}` |
| `Worker từ chối: sai mã truy cập` | `ACCESS_TOKEN` trong Cloudflare khác chuỗi đã dán vào FinTrace | So lại từng ký tự, để ý khoảng trắng thừa khi copy |
| `Worker không có đường dẫn /account` | Code Worker chưa đúng bản | Dán lại `binance-worker.js` rồi Deploy |
| `Worker chưa đặt biến ...` | Thiếu biến bí mật | Settings → Variables and Secrets, kiểm tra đủ 3 biến |
| `Binance từ chối (HTTP 401): Invalid API-key...` | Key sai, đã bị thu hồi, hoặc chưa bật Enable Reading | Xem lại Phần 1 bước 6, hoặc tạo key mới |
| `Binance từ chối (HTTP 418/429)` | Bấm quá nhiều lần trong thời gian ngắn | Đợi vài phút |
| `Worker không trả lời trong 20 giây` | Cloudflare hoặc Binance đang chậm | Bấm lại |

---

## Gỡ bỏ

Muốn dừng hẳn:

1. FinTrace → **Cài đặt** → **Xoá** ở mục Binance.
2. Cloudflare → Worker → **Settings** → cuối trang → **Delete**.
3. Binance → **API Management** → **Delete** cái key `FinTrace read only`.

Làm cả ba bước thì không còn gì sót lại.

---

## Vài điều nên biết

- **Worker chỉ đọc được số dư.** Nó chỉ nhận đúng `GET /account`; mọi đường dẫn khác trả 404,
  mọi method khác trả 405. Không có đường nào đặt lệnh hay rút tiền, kể cả khi ai đó biết mã truy cập.
- **Worker chỉ trả về tài sản có số dư khác 0**, và chỉ ba trường `asset`, `free`, `locked`.
  Không đưa ra ngoài nhiều hơn mức FinTrace cần.
- **Khoá API không bao giờ về tới trình duyệt.** Nó nằm trong biến bí mật của Cloudflare;
  chính bạn mở lại trang Cloudflare cũng chỉ thấy dấu sao.
- **File sao lưu JSON của FinTrace** có chứa địa chỉ Worker và mã truy cập (không chứa khoá Binance).
  Giữ file đó cẩn thận; lỡ lộ thì đổi `ACCESS_TOKEN` trong Cloudflare rồi lưu lại trong FinTrace.
- **Đồng bộ không tự chạy.** Chỉ chạy khi bạn bấm nút, và luôn hỏi trước khi ghi đè.
