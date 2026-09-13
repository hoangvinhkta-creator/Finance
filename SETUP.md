# SETUP — nối FinTrace với Firebase và đưa lên GitHub Pages

Làm một lần, khoảng 15 phút, **toàn bộ trên trình duyệt**, không cần terminal.
Trước khi làm xong bước 6, app chạy ở **chế độ thử cục bộ** (dữ liệu nằm trong localStorage của
trình duyệt, mở máy khác là mất).

Toàn bộ cấu hình nằm trong object `CONFIG` ở đầu thẻ `<script>` của `index.html`. Owner không tự
sửa file: chép 4 giá trị ở bước 6 gửi cho Claude, Claude điền và merge lên `main`.

> **Nếu bạn đã nhập dữ liệu ở chế độ thử cục bộ** thì trước khi làm gì khác, mở app →
> **Cài đặt → Nâng cao → Tải bản sao lưu**, giữ file JSON đó lại. Bước 8 sẽ nạp nó lên Firebase.
> Không có bước này thì dữ liệu cục bộ mất khi chuyển sang Firebase.

---

## 1. Tạo project Firebase

Tạo **project mới hoàn toàn**, không dùng lại project cũ.

1. Vào <https://console.firebase.google.com> → **Add project**.
2. Đặt tên, ví dụ `fintrace`. Tên thật sẽ thành `fintrace-xxxx`.
3. Google Analytics: **tắt** (không cần).
4. Bấm **Create project**, đợi xong rồi **Continue**.

## 2. Bật đăng nhập Email/Password

1. Menu trái → **Build → Authentication** → **Get started**.
2. Tab **Sign-in method** → chọn **Email/Password** → gạt **Enable** (chỉ dòng trên,
   *Email link* để tắt) → **Save**.

## 3. Tạo user cho mình

1. Vẫn ở Authentication → tab **Users** → **Add user**.
2. Nhập email và mật khẩu (mật khẩu ≥ 6 ký tự). **Add user**.
3. Chỉ tạo đúng một user này. App không có màn đăng ký; ai không có tài khoản thì không vào được.

## 4. Tạo Firestore

1. Menu trái → **Build → Firestore Database** → **Create database**.
2. Chọn location gần nhất (`asia-southeast1` — Singapore).
3. Chọn **Start in production mode** (khoá hết; bước 5 sẽ mở đúng phần cần).
4. **Create**.

## 5. Deploy `firestore.rules`

File `firestore.rules` trong repo chỉ cho uid của chủ app đọc/ghi `users/{uid}/**`, chặn mọi
đường dẫn khác. Dán nó vào console:

1. Firestore Database → tab **Rules**.
2. Xoá hết nội dung có sẵn, dán **toàn bộ** nội dung `firestore.rules`.
3. **Publish**.

Kiểm tra nhanh: tab **Rules playground**, thử `get` đường dẫn `users/abc/transactions/x`
với *Authenticated* tắt → phải **Denied**.

## 6. Điền `CONFIG` vào `index.html`

1. Console → biểu tượng bánh răng cạnh **Project Overview** → **Project settings**.
2. Kéo xuống mục **Your apps** → bấm icon **`</>`** (Web).
3. App nickname: `fintrace`. **Không** tick "Also set up Firebase Hosting". → **Register app**.
4. Firebase in ra một object `firebaseConfig`. Chép **4 giá trị** `apiKey`, `authDomain`,
   `projectId`, `appId` rồi gửi cho Claude. Claude điền vào `index.html` và merge lên `main`:

```js
const CONFIG = {
  firebase: {
    apiKey: "AIza...",                       // apiKey
    authDomain: "fintrace-xxxx.firebaseapp.com",
    projectId: "fintrace-xxxx",
    appId: "1:1234567890:web:abcdef",
  },
  firebaseSdkVersion: "11.6.0",
};
```

Chỉ cần đúng 4 khoá này; `storageBucket`, `messagingSenderId`, `measurementId` bỏ qua.
Gửi cả 4 giá trị trong một tin nhắn là đủ, không cần chụp màn hình.

`apiKey` của Firebase **không phải bí mật** — nó chỉ định danh project. Thứ bảo vệ dữ liệu là
Authentication (bước 2–3) và `firestore.rules` (bước 5). Vẫn để repo private nếu muốn.

Lưu file. Chừng nào `apiKey` và `projectId` còn trống thì app tự chạy ở chế độ thử cục bộ.

## 7. Bật GitHub Pages

1. Repo trên GitHub → **Settings** → **Pages**.
2. **Source**: `Deploy from a branch`. **Branch**: `main`, thư mục `/ (root)`. → **Save**.
3. Đợi 1–2 phút, địa chỉ hiện ở đầu trang Pages:
   `https://<tên-github>.github.io/Finance/`.

Quay lại Firebase → **Authentication → Settings → Authorized domains** → **Add domain** →
thêm `<tên-github>.github.io`. Không có bước này thì đăng nhập trên Pages sẽ báo
`auth/unauthorized-domain`.

## 8. Đưa dữ liệu vào Firebase

Đăng nhập bằng tài khoản ở bước 3, vào tab **Cài đặt** → mở **Nâng cao**, rồi chọn **một** trong
hai đường:

**A. Đã có dữ liệu ở chế độ thử cục bộ** → **Khôi phục từ file**, chọn file JSON đã tải ở đầu tài
liệu. App xoá sạch dữ liệu trên Firebase rồi ghi lại toàn bộ từ file, và báo số bản ghi đã ghi.

**B. Bắt đầu từ đầu** → **Import dữ liệu ban đầu**, nạp dữ liệu gốc từ sheet (SPEC mục 6).
Chạy **một lần duy nhất**. Nếu cần làm lại: tick *xoá dữ liệu hiện có trước khi import* rồi bấm lại.

Dù đi đường nào, đối chiếu con số cuối: tổng tài sản ≈ **347.350k**, công nợ ròng ≈ **−30.330k**,
tài sản ròng ≈ **317.030k**. Lệch dưới 1% là đạt.

### Sao lưu về sau

**Cài đặt → Nâng cao → Tải bản sao lưu** cho ra một file JSON chứa toàn bộ dữ liệu. Nên tải một bản
trước mỗi lần làm gì lớn, và thỉnh thoảng tải một bản để phòng thân. File này cũng là cách chuyển
sang một project Firebase khác nếu sau này cần.

---

## Kiểm tra sau khi xong

- Đăng xuất rồi đăng nhập lại → dữ liệu còn nguyên.
- Mở trên điện thoại cùng địa chỉ → đăng nhập được, đọc và nhập được.
- Mở console gõ `testAttribution()` → phải ra `25 đạt · 0 hỏng` (test phân rã tăng trưởng).
- **Cài đặt → Nâng cao → Tải bản sao lưu** → tải được một file `fintrace-YYYY-MM-DD.json`.
- Trong Firestore console, mở `users/<uid>/` → thấy các collection `transactions`, `debts`,
  `holdings`, `transfers`, `months`, `prices`, `settings`.

## Khi có lỗi

| Triệu chứng | Nguyên nhân thường gặp |
|---|---|
| `auth/unauthorized-domain` | chưa thêm domain GitHub Pages ở bước 7 |
| `auth/invalid-credential` | sai email/mật khẩu, hoặc chưa tạo user ở bước 3 |
| `permission-denied` khi ghi | rules chưa publish (bước 5) |
| Vẫn thấy dòng "Chế độ thử cục bộ" | `apiKey` hoặc `projectId` trong `CONFIG` còn trống |
| "Không nạp được Firebase SDK" | mạng chặn `gstatic.com`, hoặc sai `firebaseSdkVersion` |

## Giá crypto

Nút **Cập nhật giá live** ở tab Tài sản lấy giá ETH, BTC, ADA, WBETH thẳng từ Binance, không cần khoá API, không cần cài gì. Tỷ giá `usdt` vẫn nhập tay. Số lượng tài sản nhập tay; giá trị nghìn đồng và quy đổi USD app tự tính.

Đồng bộ số dư thẳng từ tài khoản Binance đã thử và **bỏ** — Binance chặn cả gọi từ trình duyệt lẫn từ máy chủ trung gian. Xem `CLAUDE.md` mục 5.

---

## Chi phí

Gói **Spark** (miễn phí) là đủ: một người dùng, vài nghìn document, dưới 50k lượt đọc/ngày.
Không cần thẻ tín dụng, không cần bật Blaze.
