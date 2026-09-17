# IOS.md — Cài FinTrace lên iPhone bằng Xcode

Thư mục `ios-app/` là **vỏ iOS** (Capacitor) cho FinTrace. Vỏ này **không chứa mã web**: khi mở, app tải thẳng bản đang chạy trên GitHub Pages
(`https://hoangvinhkta-creator.github.io/Finance/`). Vì vậy **mỗi lần merge lên `main`, app trên điện thoại tự có bản mới**, không phải build lại.
Dữ liệu vẫn nằm trên Firebase như khi dùng Safari — đăng nhập cùng tài khoản là thấy cùng dữ liệu.

Chỉ cần làm lại các bước dưới đây khi: **muốn cài lên máy mới**, hoặc **hết hạn 7 ngày** (xem mục 5), hoặc **đổi icon / tên app**.

---

## 1. Chuẩn bị trên Mac (một lần)

1. Mở **App Store** trên Mac → tìm **Xcode** → Cài (khoảng 8–12 GB, chờ lâu). Mở Xcode một lần để nó cài thêm thành phần, đồng ý điều khoản.
2. Tải mã nguồn về Mac **không cần terminal**: mở https://github.com/hoangvinhkta-creator/Finance → nút xanh **Code** → **Download ZIP** → giải nén. (Hoặc dùng GitHub Desktop nếu đã quen.)
3. Trên iPhone: **Cài đặt → Quyền riêng tư & Bảo mật → Chế độ nhà phát triển** → bật, máy khởi động lại. (iOS 16 trở lên; mục này chỉ xuất hiện sau khi cắm iPhone vào Mac có Xcode lần đầu.)

## 2. Mở dự án và ký tên

1. Trong thư mục vừa giải nén, mở `ios-app/ios/App/App.xcodeproj` (bấm đôi). **Không** có file `.xcworkspace` — dự án dùng Swift Package Manager, Xcode tự tải Capacitor về khi mở lần đầu (cần mạng, chờ vài phút ở góc trên: *Resolving Package Graph*).
2. Cột trái, bấm vào mục trên cùng **App** (icon xanh) → tab **Signing & Capabilities**.
3. Tick **Automatically manage signing**. Ô **Team**: chọn **Add an Account…** → đăng nhập Apple ID thường dùng trên iPhone → quay lại chọn team vừa hiện (tên owner, kèm chữ *Personal Team*).
4. Nếu Xcode báo đỏ ở **Bundle Identifier** (`vn.fintrace.app` đã có người dùng), đổi thành thứ gì đó riêng, ví dụ `vn.fintrace.<tên owner>`. Chỉ đổi ở đúng ô này.

## 3. Chạy lên iPhone

1. Cắm iPhone vào Mac bằng cáp. Trên iPhone bấm **Tin cậy** máy tính này nếu được hỏi.
2. Thanh trên cùng của Xcode, chỗ chọn thiết bị (mặc định là một iPhone giả lập) → chọn **iPhone thật của owner**.
3. Bấm nút **▶ Run** (hoặc ⌘R). Lần đầu mất 2–5 phút. Xcode có thể hỏi mật khẩu Mac để dùng keychain — nhập và chọn *Always Allow*.
4. Lần đầu app không mở được và iPhone báo "Nhà phát triển không tin cậy": vào **Cài đặt → Cài đặt chung → VPN & Quản lý thiết bị** → bấm vào Apple ID của owner → **Tin cậy**. Mở lại app.

Xong. Icon **FinTrace** nằm trên màn hình chính, mở toàn màn hình, không thanh địa chỉ. Rút cáp dùng bình thường.

## 4. Kiểm tra sau khi cài

- Mở app → thấy đúng màn đăng nhập FinTrace (hoặc vào thẳng nếu Safari trước đó chưa đăng nhập thì ở đây phải đăng nhập lại — app và Safari là hai "trình duyệt" khác nhau, không dùng chung phiên).
- Tắt Wi-Fi và 4G rồi mở app → hiện trang "Không tải được FinTrace" với nút Thử lại. Bật mạng, bấm Thử lại là vào.
- Phần trên cùng không bị tai thỏ che, thanh tab dưới không bị vạch Home che (đã chừa `safe-area` trong `index.html`).

## 5. Giới hạn của Apple ID miễn phí — và cách bỏ giới hạn

- App ký bằng **Personal Team** chỉ chạy **7 ngày**, sau đó mở lên báo không tin cậy. Cắm iPhone vào Mac, bấm ▶ Run lại là xong (dữ liệu không mất, vì nằm trên Firebase). Tối đa **3 app** kiểu này trên một máy.
- Muốn cài một lần dùng cả năm, hoặc gửi cho người khác qua **TestFlight**, hoặc lên **App Store**: cần **Apple Developer Program** (99 USD/năm) tại https://developer.apple.com/programs/. Sau khi có, chỉ đổi Team trong Xcode; dự án không cần sửa gì.

## 6. Khi cần đổi gì trong vỏ

| Muốn | Sửa ở đâu | Cần build lại? |
|---|---|---|
| Sửa giao diện, tính năng FinTrace | `index.html` như mọi khi, merge lên `main` | **Không** — app tự tải bản mới |
| Đổi icon | `ios-app/ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png` (1024×1024) | Có |
| Đổi tên hiện dưới icon | `CFBundleDisplayName` trong `ios-app/ios/App/App/Info.plist` | Có |
| Đổi địa chỉ web app tải | `server.url` trong `ios-app/capacitor.config.json` **và** `ios-app/ios/App/App/capacitor.config.json` (hai file phải giống nhau) | Có |
| Trang báo mất mạng | `ios-app/www/error.html` rồi chép sang `ios-app/ios/App/App/public/error.html` | Có |

Việc "build lại" luôn chỉ là: tải ZIP mới → mở `App.xcodeproj` → ▶ Run.

## 7. Ghi chú kỹ thuật (cho session Claude sau)

- Capacitor 8, iOS 15+, gói native lấy từ `https://github.com/ionic-team/capacitor-swift-pm` qua SPM ⇒ **Mac không cần Node, npm hay CocoaPods**. `node_modules` chỉ cần trong sandbox khi chạy `npx cap sync`, và đã gitignore.
- `ios/.gitignore` được sửa so với mẫu để **giữ** `App/App/public`, `App/App/capacitor.config.json` và `capacitor-cordova-ios-plugins` trong git — chính vì owner không chạy `cap sync`.
- `server.url` trỏ Pages ⇒ origin của WKWebView là `hoangvinhkta-creator.github.io`, nên cấu hình Firebase (authorized domains) dùng lại nguyên. Đăng nhập là email/mật khẩu (`signInWithEmailAndPassword`) — chạy trong WKWebView; **không** đổi sang popup Google vì popup không mở được trong vỏ này.
- `ios.contentInset = never` + `viewport-fit=cover` + CSS `env(safe-area-inset-*)` ở `main` (mobile) và `.tabbar`.
- Chưa có: khoá Face ID khi mở app, widget, thông báo. Mỗi thứ là một plugin Capacitor riêng — chỉ thêm khi owner cần rõ.
