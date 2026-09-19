# HƯỚNG DẪN SỬ DỤNG FINTRACE

Tài liệu này dành cho **người mới hoàn toàn**, kể cả trợ lý được giao việc ghi chép thu chi hằng ngày.
Đọc hết mất khoảng 20 phút. Không cần biết gì về lập trình, tài chính hay chứng khoán.

**Link app:** <https://hoangvinhkta-creator.github.io/Finance/>

> Nếu bạn là **trợ lý** và chỉ được giao việc ghi thu chi: đọc **Phần 1, 2, 3, 4** và **Phần 9**.
> Bốn phần đó là toàn bộ việc bạn cần làm. Các phần còn lại để tham khảo, **không tự thao tác**.

---

## MỤC LỤC

| Phần | Nội dung | Ai cần đọc |
|---|---|---|
| 1 | FinTrace là gì, mở ở đâu, đăng nhập thế nào | Mọi người |
| 2 | **Quy ước bắt buộc nhớ: tiền tính bằng NGHÌN ĐỒNG** | Mọi người |
| 3 | **Việc hằng ngày: ghi một khoản chi, một khoản thu** | Trợ lý |
| 4 | **Công nợ: ai nợ mình, mình nợ ai** | Trợ lý |
| 5 | Cuối tháng: Chốt tháng | Chủ tài khoản |
| 6 | Bảy tab trong app, mỗi tab để làm gì | Tham khảo |
| 7 | Cài đặt: mục tiêu, nhóm chi, nhóm thu | Chủ tài khoản |
| 8 | Sao lưu và khôi phục dữ liệu | Chủ tài khoản |
| 9 | **Việc trợ lý KHÔNG được làm** | Trợ lý |
| 10 | Sự cố thường gặp và cách xử lý | Mọi người |
| 11 | Bảng tra nhanh | Mọi người |

---

# PHẦN 1 — FinTrace là gì

FinTrace là một **sổ tài chính cá nhân chạy trên trình duyệt**. Nó ghi lại:

- Tiền thu và tiền chi từng tháng.
- Ai đang nợ mình, mình đang nợ ai.
- Mình đang có những tài sản gì: tiền mặt, vàng, coin, cổ phiếu.
- Tài sản ròng tăng hay giảm, vì lý do gì.

Dữ liệu lưu trên Firebase của Google, **không lưu trong máy**. Nghĩa là: ghi trên điện thoại thì mở
máy tính cũng thấy, và không sợ mất khi đổi máy.

### 1.1. Mở app

**Trên máy tính:** mở trình duyệt, vào <https://hoangvinhkta-creator.github.io/Finance/>

**Trên điện thoại:** cũng vào link đó bằng Safari hoặc Chrome. Nên bấm **Chia sẻ → Thêm vào màn
hình chính** để lần sau mở như một ứng dụng thật, không phải gõ lại link.

### 1.2. Đăng nhập

Lần đầu app hiện ô **Email** và **Mật khẩu**. Dùng đúng tài khoản chủ tài khoản đưa cho bạn.
Đăng nhập một lần, những lần sau app tự nhớ.

Nếu thấy dòng chữ **"Chế độ thử cục bộ — chưa nối Firebase"** ở góc dưới bên trái thì **dừng lại và
báo chủ tài khoản**. Chế độ đó ghi vào bộ nhớ tạm của trình duyệt, đóng trình duyệt là mất, ghi vào
đó là công cốc.

### 1.3. Nhìn màn hình một lần cho quen

**Trên máy tính:** cột trái là danh sách tab. Sáu tab chính nằm trên: **Tổng quan · Dòng tiền ·
Tài sản · DCA · Chứng khoán · Trading**. Tab **Cài đặt** nằm riêng ở đáy cột trái. Bấm vào tên tab
để chuyển.

**Trên điện thoại:** cả 7 tab nằm thành một hàng ở đáy màn hình.

Việc ghi thu chi hằng ngày **chỉ nằm ở tab Dòng tiền**. Sáu tab kia bạn không cần đụng tới.

---

# PHẦN 2 — QUY ƯỚC BẮT BUỘC NHỚ

## 2.1. Mọi số tiền đều tính bằng NGHÌN ĐỒNG

Đây là quy ước quan trọng nhất của app. Ghi sai chỗ này là sai toàn bộ số liệu.

| Số tiền thật | Gõ vào app |
|---|---|
| 50.000 đồng | `50` |
| 150.000 đồng | `150` |
| 1.000.000 đồng (1 triệu) | `1000` |
| 2.500.000 đồng | `2500` |
| 15.000.000 đồng (15 triệu) | `15000` |
| 100.000.000 đồng (100 triệu) | `100000` |

**Mẹo nhớ: bỏ ba số 0 cuối.** Một trăm nghìn đồng thì bỏ ba số 0 thành `100`.

Trên màn hình app hiện chữ **k** phía sau, ví dụ `1.500k` nghĩa là một triệu rưỡi. Số lớn app tự
đổi sang **tr** (triệu), ví dụ `15,5 tr`.

> ⚠️ **Lỗi phổ biến nhất:** gõ `50000` khi định ghi 50 nghìn. App sẽ hiểu là **50 triệu**.
> Gõ xong nhìn lại con số trên dòng vừa thêm, thấy sai thì sửa ngay.

## 2.2. Gõ được phép cộng trừ

Ô số tiền nhận cả biểu thức. Ba lần chi trong ngày, mỗi lần 10k, 40k, 450k thì gõ thẳng:

```
10+40+450
```

App tự cộng thành 500 và **nhớ lại từng phần**, sau này mở ra sửa vẫn thấy `10+40+450`. Trừ cũng
được: `15739-1087`.

Số lẻ dùng dấu **phẩy**: `26,5` là hai mươi sáu nghìn rưỡi.

## 2.3. Đang xem tháng nào

Ở đầu tab **Dòng tiền** có tên tháng, hai mũi tên hai bên, và chữ **tháng này**.

- Mũi tên trái: lùi về tháng trước.
- Mũi tên phải: tiến tới tháng sau.
- Chữ **tháng này**: nhảy về tháng hiện tại.

**Luôn kiểm tra tên tháng trước khi ghi.** Ghi khoản của tháng 9 trong lúc màn hình đang ở tháng 8
thì số liệu tháng 8 bị sai.

Lưu ý: hai cột **Họ nợ mình** và **Mình nợ** luôn hiện **số dư hôm nay**, không đổi theo tháng
đang xem. Lùi tháng chỉ đổi cột Chi và cột Thu.

---

# PHẦN 3 — VIỆC HẰNG NGÀY: GHI THU CHI

Đây là phần quan trọng nhất với trợ lý. Vào tab **Dòng tiền**.

Màn hình có bốn cột ngang: **Chi · Thu · Họ nợ mình · Mình nợ**. Mỗi cột có một form nhỏ ở trên và
danh sách ở dưới.

## 3.1. Ghi một khoản CHI

Ví dụ: hôm nay 17/09 đi ăn trưa hết 85 nghìn.

Trong cột **Chi**, điền lần lượt:

| Ô | Điền gì | Ví dụ |
|---|---|---|
| **Tên** | Chi cho việc gì, viết ngắn gọn dễ hiểu | `Ăn trưa` |
| **Số tiền** | Nghìn đồng (xem Phần 2.1) | `85` |
| **Nhóm** | Chọn trong danh sách sẵn có (ô bên trái) | `Ăn uống` |
| **Trừ vào** | Tiền ra từ đâu (ô bên phải) — **bắt buộc chọn** | `Vietcombank` |
| **Ngày** | Mặc định là hôm nay, đúng rồi thì để nguyên | `17/09/2026` |

Bấm **Thêm**. Dòng mới hiện ngay bên dưới. Xong.

### Ô "Trừ vào" — tiền ra từ đâu

Nằm ngay cạnh ô Nhóm, chiếm nửa còn lại của dòng. Chọn đúng nơi tiền thực sự đi ra:
`Vietcombank`, `Tiền mặt`, `Tiền tại VCBS`, hoặc vàng/bạc nếu bán vàng ra để tiêu.

Chọn xong bấm Thêm thì **app tự trừ đúng khoản đó** ở tab Tài sản. Không phải vào Tài sản sửa số dư
bằng tay nữa.

- **Bắt buộc chọn**, không để trống được. Không chắc tiền ra từ đâu thì hỏi chủ tài khoản rồi mới ghi.
- Ghi nhầm nơi thì bấm ✏️ sửa lại — app tự cộng trả chỗ cũ và trừ chỗ mới.
- Xoá dòng thì app tự hoàn lại tiền vào đúng chỗ đã trừ.
- Chọn **vàng hoặc bạc** thì có một dòng chữ nhỏ hiện ngay dưới, ví dụ `Vàng Phi Đoan −0,5 (giá
  14.300k/đơn vị)` — đọc dòng đó để chắc chắn số chỉ vàng bị trừ là đúng ý.
- Trong danh sách **không có coin và cổ phiếu**: hai thứ đó mua bán ở tab DCA và tab Chứng khoán,
  ghi ở đây sẽ làm sai giá vốn bên kia.

### Các nhóm chi có sẵn

`Ăn uống` · `Dịch vụ` · `Giải trí` · `Mua sắm` · `Sửa chữa` · `Sức khoẻ` · `Trả nợ` · `Xã giao`

Không biết chọn nhóm nào thì chọn nhóm gần nhất, đừng bỏ trống. Chủ tài khoản có thể thêm nhóm mới
trong tab Cài đặt.

> **Riêng nhóm "Trả nợ":** chỉ dùng để **ghi chú** cho những khoản trả nợ nhỏ lẻ. Việc trả hết một
> khoản nợ lớn có cách làm riêng, xem Phần 4.4. Không tự ý dùng nhóm này cho khoản nợ lớn.

### Ô tick "bất thường"

Dưới form Chi có một ô tick nhỏ ghi **bất thường**. Tick vào khi khoản chi đó là **một lần duy nhất,
không lặp lại hằng tháng**: sửa xe, viện phí, mua điện thoại mới, cưới hỏi.

Tác dụng: khoản đó không bị tính vào mức chi trung bình, nên app không tưởng nhầm rằng tháng nào
cũng tiêu nhiều như vậy.

Không chắc thì **không tick**. Tick nhầm dễ sửa, bỏ sót cũng không sao.

## 3.2. Ghi một khoản THU

Ví dụ: nhận lương tháng 9 là 18 triệu.

Trong cột **Thu**:

| Ô | Điền gì | Ví dụ |
|---|---|---|
| **Tên** | Tiền từ đâu | `Lương tháng 9` |
| **Số tiền** | Nghìn đồng | `18000` |
| **Nhóm** | `Lương`, `Hoa hồng` hoặc `Khác` (ô bên trái) | `Lương` |
| **Vào** | Tiền về đâu (ô bên phải) — **bắt buộc chọn** | `Vietcombank` |
| **Ngày** | Ngày nhận tiền | `05/09/2026` |

Bấm **Thêm**. App tự **cộng** vào đúng khoản đã chọn, giống như ô "Trừ vào" của cột Chi.

### Ô tick "chưa nhận" — rất quan trọng

Dưới form Thu có ô tick **chưa nhận**. Tick vào khi **đã chắc chắn có khoản tiền này nhưng chưa cầm
được tiền**: hoa hồng tháng này công ty trả tháng sau, khách đã chốt đơn nhưng chưa chuyển khoản.

Tick vào thì:
- Khoản đó vẫn tính vào cột Thu của tháng.
- Đồng thời hiện thêm bên cột **Họ nợ mình**, vì thực chất đó là tiền người ta còn giữ.
- **Ô "Vào" bị khoá lại** (xám đi, không chọn được). Đúng như vậy: tiền chưa về tay thì chưa cộng
  vào tài khoản nào cả.

**Khi nhận được tiền thật:** tìm đúng dòng đó trong cột Thu, bấm **biểu tượng dấu tích ✓** ở cuối
dòng. App hiện một ô nhỏ hỏi **tiền vào đâu** — chọn nơi nhận (`Vietcombank`, `Tiền mặt`…) rồi bấm
**Đã nhận**. App vừa bỏ trạng thái chưa nhận, vừa cộng tiền vào đúng chỗ. Không cần xoá rồi ghi lại,
cũng không cần vào tab Tài sản sửa số dư.

## 3.3. Sửa và xoá một dòng

Mỗi dòng trong bốn cột đều có các biểu tượng nhỏ nằm giữa tên và số tiền:

| Biểu tượng | Ý nghĩa | Bấm khi nào |
|---|---|---|
| ✏️ cây bút | Sửa | Gõ nhầm số, nhầm tên, nhầm ngày |
| 🗑️ thùng rác | Xoá | Ghi nhầm hoàn toàn, hoặc ghi trùng hai lần |
| ✓ dấu tích | Đã nhận / Tất toán | Khoản thu chưa nhận giờ đã nhận (app hỏi tiền vào đâu); khoản nợ đã trả xong |
| ↩️ mũi tên quay lại | Mở lại | Bấm tất toán nhầm, muốn quay lại |

Bấm **✏️** thì nội dung dòng đó nhảy lên form phía trên để sửa. Sửa xong bấm **Thêm** (lúc này nút
đổi thành lưu). Muốn bỏ giữa chừng thì bấm **Huỷ**.

Bấm **🗑️** thì app hỏi lại một lần trước khi xoá.

## 3.4. Quy trình ghi chép hằng ngày cho trợ lý

Cuối mỗi ngày, làm đúng bốn bước này:

1. Mở app, vào tab **Dòng tiền**, kiểm tra tên tháng ở đầu trang đúng là tháng hiện tại.
2. Ghi lần lượt từng khoản chi trong ngày vào cột **Chi**, nhớ chọn đúng ô **Trừ vào**.
3. Ghi lần lượt từng khoản thu trong ngày vào cột **Thu**, nhớ chọn đúng ô **Vào**.
4. Nhìn hàng thống kê phía trên: ô **Thu**, ô **Chi**, ô **Chênh lệch**. Nếu con số trông lạ
   (ví dụ chi 50 triệu trong một ngày) thì gần như chắc chắn là gõ dư số 0 — kiểm tra lại ngay.

Cách gộp nhiều khoản nhỏ cùng loại trong một ngày: gõ vào một dòng bằng phép cộng, ví dụ tên
`Ăn uống trong ngày`, số tiền `35+85+120`. Nhưng nếu các khoản khác nhóm nhau, **hoặc ra từ hai nơi
khác nhau** (một phần tiền mặt, một phần chuyển khoản), thì phải tách dòng.

## 3.5. Đọc hàng thống kê

Phía trên bốn cột là một dải năm ô:

| Ô | Nghĩa |
|---|---|
| **Thu** | Tổng thu của tháng đang xem |
| **Chi** | Tổng chi của tháng đang xem |
| **Chênh lệch** | Thu trừ Chi. Số âm màu đỏ nghĩa là tháng này tiêu nhiều hơn kiếm |
| **Công nợ ròng hôm nay** | Người ta nợ mình trừ mình nợ người ta. Luôn là số **hôm nay**, dù đang xem tháng cũ |
| **Mục tiêu** | Mức thu nhập mong muốn mỗi tháng, và đã đạt bao nhiêu phần trăm |

Bên cạnh có card **Chi theo nhóm**: một thanh ngang chia theo tỉ trọng, nhìn là biết tháng này tiền
đi đâu nhiều nhất.

---

# PHẦN 4 — CÔNG NỢ

Hai cột **Họ nợ mình** và **Mình nợ** ghi các khoản nợ đang còn. Chúng luôn hiện số dư **hôm nay**,
không phụ thuộc tháng đang xem.

## 4.1. Ghi khoản người ta nợ mình

Ví dụ: cho anh Hùng mượn 5 triệu ngày hôm nay.

Trong cột **Họ nợ mình**:

| Ô | Điền gì | Ví dụ |
|---|---|---|
| **Tên** | Tên người hoặc công ty nợ | `Anh Hùng` |
| **Số tiền / số chỉ** | Số lượng, xem ô Đơn vị bên cạnh | `5000` |
| **Đơn vị** | `k (nghìn đồng)` nếu nợ tiền | `k (nghìn đồng)` |
| **Ghi chú** | Bối cảnh, ngày hẹn trả | `Mượn 17/09, hẹn cuối tháng 10` |

Bấm **Thêm**.

### Nợ bằng vàng

Ô **Đơn vị** có thêm hai lựa chọn: `chỉ vàng Phi Đoan` và `chỉ vàng Ancarat`. Chọn đúng loại rồi
điền **số chỉ** vào ô số lượng, ví dụ `3` là ba chỉ.

App tự quy ra tiền theo giá vàng đang lưu, nên khi giá vàng lên xuống thì giá trị khoản nợ tự đổi
theo. Đây là điểm mạnh: nợ vàng phải trả bằng vàng, không phải bằng số tiền lúc vay.

## 4.2. Ghi khoản mình nợ người ta

Làm y hệt, chỉ khác là điền vào cột **Mình nợ**. Ví dụ tên `Thẻ tín dụng VP`, số tiền `25000`.

## 4.3. Khi nợ được trả xong

Bấm **✓ (dấu tích)** ở cuối dòng nợ đó. Khoản nợ biến khỏi danh sách và không còn tính vào công nợ ròng.

Muốn xem lại các khoản đã tất toán: tick ô **Hiện nợ đã tất toán** ở góc trên bên phải của tab.
Bấm **↩️** trên dòng đã tất toán để mở lại nếu bấm nhầm.

## 4.4. Điểm dễ hiểu nhầm nhất: trả nợ KHÔNG phải là khoản chi

Nghe lạ nhưng đúng: khi bạn trả 5 triệu tiền nợ, **tài sản của bạn không giảm đi 5 triệu**. Bạn mất
5 triệu tiền mặt nhưng cũng xoá được 5 triệu nghĩa vụ nợ. Tổng tài sản ròng **không đổi**.

Cho nên:

- **Trả hết một khoản nợ:** bấm nút **✓ Tất toán** trên chính dòng nợ đó. Không ghi thêm dòng chi nào.
- **Nhóm chi "Trả nợ"** chỉ dùng cho các khoản lặt vặt mà chủ tài khoản muốn ghi chú lại, kiểu như
  trả lãi. Nếu bạn dùng nó để ghi một khoản trả nợ lớn, app sẽ hiểu nhầm là tháng đó tiêu rất nhiều.
  Nặng hơn: khoản chi bây giờ có ô **Trừ vào** nên tiền sẽ bị trừ khỏi tài khoản **lần thứ hai**
  (lần đầu là lúc bấm Tất toán). Đã bấm Tất toán rồi thì tuyệt đối không ghi thêm dòng chi.

Tương tự: cho vay tiền **không phải là khoản chi**, nhận lại tiền cho vay **không phải là khoản thu**.

---

# PHẦN 5 — CUỐI THÁNG: CHỐT THÁNG

**Việc này của chủ tài khoản. Trợ lý không tự bấm.**

Khi hết một tháng, bấm nút **Chốt tháng** ở góc trên bên phải tab Dòng tiền. App lưu lại một "bức
ảnh" của tháng: tổng thu, tổng chi, tài sản ròng, danh mục tài sản, giá cả tại thời điểm chốt.

Nhờ các bức ảnh này mà tab Tổng quan vẽ được biểu đồ nhiều tháng và tính được tài sản tăng nhờ đâu.

Ba điều cần biết:

- **Chốt nhiều lần an toàn.** Chốt lại thì ghi đè lên bản cũ, không tạo thêm bản trùng.
- **Chốt muộn vài ngày vẫn đúng.** App ghi lại ngày chụp thật nên không đếm nhầm các khoản phát
  sinh sau ngày cuối tháng.
- **Chưa hết tháng thì đừng chốt sớm.** Muốn xem tình hình giữa chừng, dùng kỳ 7 ngày hoặc 30 ngày
  trong tab Tổng quan.

---

# PHẦN 6 — BẢY TAB TRONG APP

Phần này để tham khảo. Trợ lý chỉ cần thao tác ở tab Dòng tiền.

## 6.1. Tổng quan — bức tranh chung

Xem nhanh: tài sản ròng hiện tại, thu chi tháng này, còn cách mốc mục tiêu bao xa.

Ba nút ở góc trên mở ba bảng:
- **Bảng tháng:** danh sách các tháng đã chốt.
- **Chi theo nhóm:** tháng này chi từng nhóm bao nhiêu, so với trung bình 6 tháng.
- **Thu theo nguồn:** tiền vào từ những nguồn nào.

Card **Phân rã tăng trưởng** trả lời câu "tháng này giàu thêm nhờ đâu": nhờ để dành được tiền, hay
nhờ giá vàng và coin lên. Nó chỉ chạy khi đã có ít nhất hai lần chốt tháng trong app.

## 6.2. Dòng tiền — sổ thu chi hằng ngày

Đã hướng dẫn kỹ ở Phần 3 và 4.

## 6.3. Tài sản — mình đang có gì

Danh mục chia theo nhóm: Tiền, Vàng, Bạc, Chứng khoán, Khác. Bấm vào tên nhóm để mở ra xem chi tiết
từng khoản. Coin gộp chung một dòng tên **Binance**, cổ phiếu gộp một dòng.

Hai việc thường làm ở đây:
- **Sửa số dư tiền mặt hoặc tài khoản ngân hàng:** bấm vào ô số của khoản đó, gõ số mới, bấm ra ngoài.
  Việc này giờ **ít khi cần**: mỗi khoản chi/thu ghi ở tab Dòng tiền đã tự trừ/cộng đúng khoản rồi.
  Chỉ sửa tay khi số dư thật lệch với app (ví dụ phí ngân hàng chưa ai ghi).
- **Cập nhật giá vàng:** trong bảng Bảng giá bên phải, sửa giá một chỉ vàng.

Nút **Chuyển đổi** dùng khi đổi tài sản này thành tài sản kia, ví dụ rút tiền ngân hàng mua vàng.
Đây không phải khoản chi, chỉ là tiền đổi hình dạng.

Card **Lịch sử chuyển đổi** ở dưới là sổ gốc ghi lại mọi lần đổi tài sản, và là nơi duy nhất xoá
được một dòng chuyển đổi.

## 6.4. DCA — theo dõi coin đang giữ

Xem giá ETH, BTC, giá vốn trung bình đã mua, đang lãi hay lỗ, và mỗi tháng theo kế hoạch còn được
mua bao nhiêu.

Chỉ số **Buy Score** từ 0 đến 100 đo mức **rẻ** của coin so với chính nó một năm qua. Điểm cao
nghĩa là đang rẻ so với quá khứ, **không có nghĩa là chắc chắn lời**.

## 6.5. Chứng khoán — cổ phiếu đang giữ

Danh mục cổ phiếu với giá vốn và lãi lỗ từng mã, đối chiếu được với app công ty chứng khoán.
Dữ liệu giá được máy tự cào mỗi ngày lúc 15h40, sau khi sàn đóng cửa.

## 6.6. Trading — bảng theo dõi 100 cổ phiếu và 100 coin

Bảng xếp hạng theo độ rẻ, bộ lọc gợi ý, công cụ tính lãi lỗ giả định, và sổ ghi lệnh mua bán.

Đây là tab nghiên cứu. Bộ lọc **Gợi ý** là một phép lọc máy móc theo tiêu chí đặt sẵn,
**không phải lời khuyên đầu tư**.

## 6.7. Cài đặt — xem Phần 7

---

# PHẦN 7 — CÀI ĐẶT

**Việc của chủ tài khoản.**

| Mục | Dùng để làm gì |
|---|---|
| **Mục tiêu thu nhập tháng** | Con số hiện ở ô "Mục tiêu" trong tab Dòng tiền |
| **Mốc tài sản ròng** | Các mốc muốn đạt, ví dụ `400000, 500000, 1000000` (nghìn đồng) |
| **Mục tiêu dài hạn** | Số tiền muốn có trước một tháng nào đó |
| **Nhóm chi** | Thêm hoặc bớt nhóm chi. Nhóm đã có giao dịch thì không xoá được |
| **Nhóm thu** | Tương tự cho nhóm thu |
| **DCA** | Ngân sách mua coin mỗi tháng |
| **Tài khoản** | Đổi mật khẩu, đăng xuất |
| **Nâng cao** | Sao lưu, khôi phục, các nút nạp dữ liệu một lần |

Thêm một nhóm chi mới: gõ tên vào ô **Thêm nhóm chi**, bấm **Thêm**. Nhóm mới hiện ngay trong danh
sách chọn ở tab Dòng tiền.

---

# PHẦN 8 — SAO LƯU VÀ KHÔI PHỤC

**Việc của chủ tài khoản.**

Vào **Cài đặt → Nâng cao**:

- **Tải bản sao lưu:** tải một file JSON chứa toàn bộ dữ liệu về máy. Nên làm mỗi tháng một lần,
  hoặc trước khi làm gì đó lớn.
- **Khôi phục từ file:** nạp lại từ file sao lưu.

> ⚠️ **Khôi phục sẽ XOÁ SẠCH dữ liệu hiện có rồi ghi lại từ file.** Từng có một lần mất dữ liệu cả
> tháng vì khôi phục nhầm file cũ. App giờ tự tải một bản sao lưu về máy trước khi xoá, nhưng vẫn
> phải **mở file ra xem đúng dữ liệu cần** rồi mới bấm khôi phục.

---

# PHẦN 9 — VIỆC TRỢ LÝ KHÔNG ĐƯỢC LÀM

Phần này ngắn nhưng quan trọng. Nếu bạn là trợ lý ghi thu chi, **không tự ý** làm những việc sau:

| Không làm | Lý do |
|---|---|
| Bấm **Chốt tháng** | Chốt sai thời điểm làm lệch số liệu so sánh giữa các tháng |
| Bấm **Khôi phục từ file** ở Cài đặt | Thao tác này xoá sạch dữ liệu, không hoàn tác được |
| Sửa số dư tài sản ở tab **Tài sản** | Số dư là tiền thật, chỉ chủ tài khoản biết chính xác |
| Bấm **Chuyển đổi** ở tab Tài sản | Dùng khi đổi tài sản, ghi nhầm sẽ sai tài sản ròng |
| Mua bán ở tab **DCA**, **Chứng khoán**, **Trading** | Đây là lệnh giao dịch tiền thật |
| Bấm các nút trong **Cài đặt → Nâng cao** | Nạp dữ liệu một lần, chạy sai rất khó gỡ |
| Đổi mục tiêu, thêm hoặc xoá nhóm chi thu | Hỏi chủ tài khoản trước |

**Việc được làm:** thêm, sửa, xoá dòng trong bốn cột của tab Dòng tiền, và đánh dấu đã nhận hoặc
đã tất toán. Chỉ vậy thôi.

Gặp tình huống không chắc: **ghi lại ra giấy hoặc nhắn tin hỏi, đừng đoán rồi bấm.** Một dòng ghi
thiếu dễ bổ sung sau, một thao tác bấm nhầm khó sửa hơn nhiều.

---

# PHẦN 10 — SỰ CỐ THƯỜNG GẶP

### Gõ số tiền xong bấm Thêm mà không có gì xảy ra

Ô số tiền có ký tự lạ. Chỉ được dùng chữ số, dấu phẩy cho số lẻ, dấu cộng và dấu trừ. Không gõ dấu
chấm ngăn cách nghìn, không gõ chữ "đ" hay "k".

Sai: `1.500.000` · `500k` · `hai trăm`
Đúng: `1500` · `500` · `200`

### Ghi xong không thấy dòng mới đâu

Kiểm tra tên tháng ở đầu trang. Rất có thể ngày bạn chọn thuộc tháng khác với tháng đang xem. Lùi
hoặc tiến tháng để tìm.

### Số tiền hiện gấp 1000 lần thực tế

Gõ dư ba số 0. Bấm ✏️ trên dòng đó, sửa lại, bấm lưu.

### App hiện "Chế độ thử cục bộ" ở góc dưới

Chưa nối được Firebase. **Đừng ghi gì thêm**, báo chủ tài khoản ngay. Dữ liệu ghi trong trạng thái
này sẽ mất.

### Điện thoại bị phóng to lung tung khi bấm vào ô nhập

Đã sửa rồi. Nếu vẫn gặp, thử đóng hẳn trình duyệt rồi mở lại app.

### Màn hình trắng hoặc không tải được

Tải lại trang. Trên điện thoại vuốt từ trên xuống để làm mới. Nếu vẫn trắng, chờ vài phút rồi thử
lại, có thể app đang được cập nhật.

### Ghi nhầm mà đã bấm xoá

Không hoàn tác được. Ghi lại dòng đó bằng tay là xong, không mất mát gì nghiêm trọng vì mỗi dòng
đều ghi lại được.

---

# PHẦN 11 — BẢNG TRA NHANH

### Đổi tiền sang đơn vị của app

| Thật | Gõ |
|---|---|
| 20 nghìn | `20` |
| 200 nghìn | `200` |
| 1 triệu | `1000` |
| 10 triệu | `10000` |
| 100 triệu | `100000` |

### Tình huống thì làm gì

| Tình huống | Làm gì |
|---|---|
| Mua đồ ăn, xăng xe, mua sắm | Cột **Chi** |
| Nhận lương, hoa hồng | Cột **Thu** |
| Đã chốt được tiền nhưng chưa nhận | Cột **Thu**, tick **chưa nhận** |
| Tiền đã hẹn giờ đã về tài khoản | Tìm dòng đó ở cột Thu, bấm **✓**, chọn nơi tiền vào |
| Không biết tiền ra từ tài khoản nào | Hỏi chủ tài khoản. Ô **Trừ vào** bắt buộc, không đoán |
| Tiền mặt trong két giảm nhưng không ai ghi | Tab **Tài sản → Tiền**, sửa tay. Việc của chủ tài khoản |
| Cho ai đó mượn tiền | Cột **Họ nợ mình** |
| Vay tiền của ai đó | Cột **Mình nợ** |
| Người ta trả hết nợ cho mình | Bấm **✓** trên dòng ở cột Họ nợ mình |
| Mình trả hết một khoản nợ | Bấm **✓** trên dòng ở cột Mình nợ. **Không ghi thành khoản chi** |
| Sửa xe hết 3 triệu, một lần duy nhất | Cột **Chi**, nhóm `Sửa chữa`, tick **bất thường** |
| Rút tiền ngân hàng mua vàng | Tab **Tài sản → Chuyển đổi**. Việc của chủ tài khoản |
| Không biết xếp vào đâu | Hỏi chủ tài khoản, đừng đoán |

### Ý nghĩa các biểu tượng

| Biểu tượng | Nghĩa |
|---|---|
| ✏️ | Sửa dòng này |
| 🗑️ | Xoá dòng này |
| ✓ | Đánh dấu đã nhận tiền, hoặc đã trả xong nợ |
| ↩️ | Mở lại khoản vừa đánh dấu xong |

---

## Một câu tóm lại

Mỗi ngày mở tab **Dòng tiền**, kiểm tra đúng tháng, ghi các khoản chi vào cột **Chi**, các khoản thu
vào cột **Thu**, **nhớ tiền tính bằng nghìn đồng**. Việc gì khác thì hỏi trước khi bấm.
