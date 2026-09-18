# HƯỚNG DẪN ĐỌC CHỈ BÁO — DCA · CHỨNG KHOÁN · TRADING

Tài liệu này giải thích **mọi con số** trong ba tab đầu tư của FinTrace, viết cho người **chưa từng
đọc chỉ báo kỹ thuật**. Không cần biết gì trước.

Tài liệu ghi thu chi hằng ngày là `HUONGDAN.md`, đọc riêng.

---

## ĐỌC PHẦN NÀY TRƯỚC KHI ĐỌC GÌ KHÁC

Công cụ này là một **cái thước đo**, không phải máy dự đoán.

Nó trả lời được: *"Giá hôm nay rẻ hay đắt so với chính mã đó một năm qua?"*

Nó **không** trả lời được: *"Mua bây giờ có lãi không?"*

Đã đo thật trên 102 cổ phiếu trong 2 năm 4 tháng. Kết quả trung thực: **chưa cách chơi nào thắng
được việc cứ mua rồi giữ**. Chi tiết ở Phần 12. Vì vậy:

> Điểm cao **không** phải tín hiệu mua. Nó chỉ nghĩa là "đang rẻ so với quá khứ của chính nó".
> Rẻ rồi vẫn rẻ thêm được. Rất nhiều thứ rẻ vì đáng rẻ.

Dùng công cụ này để **hỏi đúng câu hỏi** và **ghi lại quyết định**, đừng dùng để tìm lệnh chắc thắng.

---

## MỤC LỤC

| Phần | Nội dung |
|---|---|
| 1 | Một ý tưởng duy nhất cần hiểu |
| 2 | Buy Score và 7 thành phần, giải thích từng cái |
| 3 | Bảng điểm chi tiết: coin và cổ phiếu khác nhau chỗ nào |
| 4 | Trạng thái thị trường: Bán tháo, Giảm sâu, Tích luỹ, Trung tính, Đắt |
| 5 | Nhãn "Dữ liệu" |
| 6 | Nghịch lý quan trọng nhất: điểm cao không có nghĩa là nên mua |
| 7 | Cột "Hồi" — dấu hiệu đã ngừng rơi |
| 8 | "Rẻ kiểu gì" — cấu trúc hay hoảng loạn |
| 9 | Vùng giá mua |
| 10 | Bộ lọc "Gợi ý" |
| 11 | Popup Tính PnL: tĩnh và động |
| 12 | Popup Backtest: đọc bốn bảng, và kết quả thật |
| 13 | Tab DCA: kế hoạch vốn Base, Smart, Opportunity |
| 14 | Sổ lệnh trong tab Trading |
| 15 | Quy trình dùng hằng tháng |
| 16 | Mười sai lầm cần tránh |
| 17 | Bảng tra nhanh |

---

# PHẦN 1 — MỘT Ý TƯỞNG DUY NHẤT CẦN HIỂU

Mọi chỉ báo trong app đều xoay quanh một ý: **so một mã với chính nó trong quá khứ.**

Hãy tưởng tượng bạn theo dõi giá một chiếc điện thoại suốt một năm. Bạn biết nó từng bán 30 triệu,
có lúc xuống 22 triệu, giờ đang 24 triệu. Bạn không cần biết gì về ngành điện tử cũng nói được:
"đang ở vùng thấp của năm".

Buy Score làm đúng việc đó, bằng số, cho 100 cổ phiếu và 100 coin cùng lúc.

**Ba điều nó KHÔNG làm, nhớ kỹ:**

| Nó không biết | Vì sao |
|---|---|
| Doanh nghiệp làm ăn tốt hay xấu | Nó chỉ nhìn giá, không đọc báo cáo tài chính |
| Mã này tốt hơn mã kia | Nó so mỗi mã với chính nó, không so mã với nhau |
| Giá sắp lên hay xuống | Nó mô tả hiện tại, không dự đoán tương lai |

Một công ty sắp phá sản sẽ có điểm rất cao, vì giá của nó rơi thê thảm so với năm ngoái. Điểm cao
**đúng** về mặt số học và **vô dụng** về mặt quyết định. Đây là lý do app có thêm các bộ lọc ở
Phần 7 đến Phần 10.

---

# PHẦN 2 — BUY SCORE VÀ 7 THÀNH PHẦN

Buy Score là một con số từ **0 đến 100**. Càng cao càng rẻ so với quá khứ của chính mã đó.

Nó được cộng từ 7 thành phần. Mỗi thành phần nhìn giá từ một góc khác nhau, và có trọng số khác
nhau. Bảng dưới là toàn bộ:

| # | Thành phần | Điểm tối đa | Nó đo cái gì |
|---|---|---|---|
| 1 | Giảm từ đỉnh 1 năm | **25** | Giá hiện tại thấp hơn đỉnh cao nhất trong một năm bao nhiêu phần trăm |
| 2 | Lệch so với MA200 | **20** | Giá đang ở trên hay dưới mức trung bình 200 phiên gần nhất |
| 3 | RSI14 | **15** | Áp lực bán gần đây mạnh tới đâu |
| 4 | Giảm từ đỉnh 1 tháng | **15** | Cú giảm gần đây sâu bao nhiêu |
| 5 | Percentile giá trong 1 năm | **10** | Giá hôm nay đứng ở vị trí nào nếu xếp cả năm từ thấp tới cao |
| 6 | Bán tháo | **10** | Vừa rơi nhanh có kèm khối lượng bán lớn bất thường không |
| 7 | So với chỉ số tham chiếu | **5** | Mã này tụt hậu so với thị trường chung tới đâu |
| | **Tổng** | **100** | |

Mở tab và bấm vào một mã, bảng "Phân rã điểm" hiện đúng 7 dòng này kèm số điểm từng dòng. Nhờ vậy
bạn biết **điểm cao đến từ đâu**, chứ không chỉ biết mỗi con số tổng.

## 2.1. Giảm từ đỉnh 1 năm — 25 điểm, nặng nhất

Câu hỏi: *giá hôm nay đã rơi bao nhiêu so với mức cao nhất trong một năm qua?*

Ví dụ: một mã từng lên 100k, giờ còn 60k. Nó đã giảm 40% từ đỉnh.

Đây là thành phần nặng nhất vì nó trả lời trực tiếp nhất câu "có rẻ không".

**Điểm yếu cần biết:** đỉnh sẽ **trôi mất theo thời gian**. Nếu đỉnh 100k xảy ra cách đây 11 tháng,
thì sang tháng sau nó ra khỏi cửa sổ một năm, đỉnh mới có thể chỉ còn 70k, và mã đang 60k bỗng
dưng "chỉ giảm 14%" thay vì 40%. **Giá không đổi một đồng nào mà điểm tụt.** Đây là một chuyện
thật, không phải lỗi, và Phần 11 có công cụ đo riêng cho nó.

## 2.2. Lệch so với MA200 — 20 điểm

MA200 nghĩa là **giá trung bình của 200 phiên gần nhất**. Nó là một đường trơn, đi chậm, thể hiện
mặt bằng giá dài hạn.

Giá nằm **dưới** đường này nhiều thì được điểm cao. Nằm **trên** thì ít hoặc không được điểm.

Cách hiểu đơn giản: MA200 là "giá quen thuộc" của mã đó. Đang bán rẻ hơn giá quen thuộc 25% thì
đúng là đang rẻ.

## 2.3. RSI14 — 15 điểm

RSI là một con số từ 0 đến 100, đo **trong 14 phiên gần đây, phiên tăng và phiên giảm bên nào
mạnh hơn**.

| RSI | Nghĩa |
|---|---|
| Trên 70 | Bên mua đang áp đảo, giá bị đẩy lên nhanh |
| Quanh 50 | Cân bằng |
| Dưới 30 | Bên bán đang áp đảo, giá bị dìm xuống |

App cho điểm cao khi RSI **thấp**, vì bán tháo mạnh thường đi cùng giá rẻ.

Chữ "Wilder" trong tên chỉ là cách tính trung bình của người phát minh ra RSI, không cần quan tâm.

## 2.4. Giảm từ đỉnh 1 tháng — 15 điểm

Giống thành phần 1 nhưng chỉ nhìn **một tháng gần đây**, nên bắt được cú rơi mới xảy ra.

Tách riêng với thành phần 1 là có chủ ý. Hai mã cùng giảm 40% so với đỉnh năm, nhưng một mã rơi
xong đã nằm im nửa năm, mã kia vừa rơi tuần trước. Chúng khác hẳn nhau, và thành phần 4 phân biệt
được điều đó.

## 2.5. Percentile giá trong 1 năm — 10 điểm

Lấy toàn bộ giá của một năm xếp từ thấp lên cao, rồi hỏi: **giá hôm nay đứng ở vị trí thứ mấy?**

Percentile 5% nghĩa là cả năm chỉ có 5% số phiên rẻ hơn hôm nay. Đó là vùng rất thấp.

Khác với thành phần 1 chỗ nào? Thành phần 1 chỉ so với **một điểm duy nhất là đỉnh**. Percentile so
với **toàn bộ cả năm**. Một mã dập dềnh quanh mức thấp cả năm sẽ có percentile cao nhưng "giảm từ
đỉnh" không lớn.

## 2.6. Bán tháo — 10 điểm, gồm hai vế

Đây là thành phần duy nhất nhìn **khối lượng giao dịch**, không chỉ nhìn giá.

| Vế | Điểm tối đa | Đo gì |
|---|---|---|
| Lợi suất vài phiên gần nhất | 6 | Giá rơi nhanh cỡ nào trong 5 tới 7 phiên |
| Tỉ lệ khối lượng | 4 | Khối lượng gần đây gấp mấy lần mức bình thường |

Ý nghĩa: rơi nhanh **kèm** khối lượng lớn bất thường thường là lúc nhiều người bán tháo trong hoảng
loạn. Rơi từ từ không ai giao dịch lại là chuyện khác hẳn.

## 2.7. So với chỉ số tham chiếu — 5 điểm, nhẹ nhất

Mã này so với mặt bằng chung ra sao:

| Đang xem | So với |
|---|---|
| Cổ phiếu | VN-Index, 21 phiên |
| ETH | BTC, 30 ngày |
| BTC | ETH, 30 ngày |
| Coin khác | BTC, 30 ngày |

Tụt hậu so với thị trường thì được điểm. Trọng số chỉ 5 vì tụt hậu là con dao hai lưỡi: có thể do
bị bỏ quên oan, cũng có thể do đúng là đang có vấn đề.

---

# PHẦN 3 — BẢNG ĐIỂM CHI TIẾT

Hai bảng dưới là **toàn bộ ngưỡng** app dùng. Bạn không cần thuộc, nhưng khi muốn biết "tại sao mã
này được 18 điểm ở dòng đầu" thì tra ở đây.

**Cổ phiếu nhạy hơn coin** vì sàn Việt Nam giới hạn biên độ 7% một phiên, trong khi coin có thể rơi
30% một đêm. Nên cùng một mức giảm, cổ phiếu được nhiều điểm hơn.

## 3.1. Cổ phiếu (cửa sổ tính bằng phiên: 250 phiên ≈ 1 năm, 21 phiên ≈ 1 tháng)

| Thành phần | Mức đạt → điểm |
|---|---|
| Giảm từ đỉnh 1 năm (25) | −45% → 25 · −35% → 22 · −27% → 18 · −20% → 14 · −13% → 9 · −7% → 4 |
| Lệch MA200 (20) | −25% → 20 · −17% → 17 · −10% → 13 · −4% → 9 · bằng → 5 · +8% → 2 |
| RSI14 (15) | 20 → 15 · 25 → 13 · 30 → 11 · 35 → 8 · 45 → 5 · 55 → 2 |
| Giảm từ đỉnh 21 phiên (15) | −18% → 15 · −13% → 12 · −9% → 9 · −6% → 6 · −3% → 3 |
| Percentile (10) | 5% → 10 · 10% → 8 · 20% → 6 · 35% → 4 · 50% → 2 |
| Bán tháo (10) | 5 phiên −14% → 6 · −10% → 5 · −6,5% → 3 · −3,5% → 2 · khối lượng ×2 → 4 · ×1,6 → 3 · ×1,3 → 2 · ×1,1 → 1 |
| So VN-Index 21 phiên (5) | −12% → 5 · −8% → 4 · −4% → 3 · bằng → 2 · +6% → 1 |

## 3.2. Coin (cửa sổ tính bằng ngày: 365 ngày, 30 ngày)

| Thành phần | Mức đạt → điểm |
|---|---|
| Giảm từ đỉnh 365 ngày (25) | −60% → 25 · −50% → 22 · −40% → 18 · −30% → 14 · −20% → 9 · −10% → 4 |
| Lệch MA200 (20) | −30% → 20 · −20% → 17 · −12% → 13 · −5% → 9 · bằng → 5 · +10% → 2 |
| RSI14 (15) | giống cổ phiếu |
| Giảm từ đỉnh 30 ngày (15) | −25% → 15 · −18% → 12 · −12% → 9 · −8% → 6 · −4% → 3 |
| Percentile (10) | giống cổ phiếu |
| Bán tháo (10) | 7 ngày −20% → 6 · −14% → 5 · −9% → 3 · −5% → 2 · khối lượng như trên |
| So với BTC 30 ngày (5) | −15% → 5 · −10% → 4 · −5% → 3 · bằng → 2 · +8% → 1 |

## 3.3. Cần bao nhiêu dữ liệu mới ra điểm

| | Cổ phiếu | Coin |
|---|---|---|
| Tối thiểu để có điểm | 220 phiên | 200 ngày |
| Đủ để nhãn Dữ liệu là "đủ" | 300 phiên | 365 ngày |
| Quá hạn thì coi là cũ | 30 giờ | 48 giờ |

Thiếu dữ liệu thì app **không ra điểm** và ghi lý do, chứ không đoán bừa.

---

# PHẦN 4 — TRẠNG THÁI THỊ TRƯỜNG

Điểm số được quy thành năm cái tên dễ nhớ. Đây chỉ là cách gọi, không thêm thông tin gì:

| Điểm | Tên | Nghĩa nôm na |
|---|---|---|
| 80 đến 100 | **Bán tháo** | Rẻ hiếm thấy, thường đi kèm hoảng loạn |
| 65 đến 79 | **Giảm sâu** | Rẻ rõ rệt so với một năm qua |
| 45 đến 64 | **Tích luỹ** | Dưới mặt bằng, chưa rẻ hẳn |
| 25 đến 44 | **Trung tính** | Quanh mặt bằng quen thuộc |
| 0 đến 24 | **Đắt** | Trên mặt bằng, đang ở vùng cao của năm |

Nhắc lại lần nữa vì rất nhiều người hiểu nhầm chỗ này: **"Bán tháo" mô tả giá, không phải lời
khuyên mua.**

---

# PHẦN 5 — NHÃN "DỮ LIỆU"

Cạnh trạng thái có một nhãn nhỏ ghi **Dữ liệu: …**. Nó nói về **chất lượng số liệu**, không nói gì
về khả năng lời lỗ.

| Nhãn | Nghĩa | Nên làm gì |
|---|---|---|
| **đủ** | Đủ số phiên, dữ liệu còn mới, có chỉ số tham chiếu | Đọc điểm bình thường |
| **thiếu tham chiếu** | Đủ nến nhưng thiếu VN-Index hoặc BTC để so | Điểm vẫn dùng được, thiếu 5 điểm thành phần 7 |
| **thiếu hoặc cũ** | Chưa đủ số phiên, hoặc dữ liệu đã quá hạn | **Đừng tin điểm này**. Bấm Cập nhật |

Trước đây nhãn này tên là "Độ tin cậy", đã đổi tên vì gây hiểu nhầm là "khả năng thắng cao".

Nếu hero có thêm huy hiệu vàng **dữ liệu cũ**, nghĩa là mã đó chưa được cập nhật đúng hạn. Với cổ
phiếu, cuối tuần không tính, nên sáng thứ Hai vẫn được coi là mới.

---

# PHẦN 6 — NGHỊCH LÝ QUAN TRỌNG NHẤT

Đây là phần đáng đọc kỹ nhất của cả tài liệu.

## 6.1. Vấn đề

Buy Score chỉ nhìn giá. Nên:

**Giá càng rơi thì điểm càng cao.** Một mã rơi 70% sẽ có điểm gần chạm trần 100.

Nhưng điểm **chỉ tối đa là 100**. Rơi 70% hay rơi 90% đều cho gần như cùng một con số. Điểm **bão
hoà**. Từ đó trở đi nó không còn phân biệt được "đã chạm đáy" với "vẫn đang rơi".

Ngược lại: khi giá **bắt đầu hồi phục**, điểm **tụt xuống**. Nghĩa là đúng lúc có dấu hiệu tích cực
thì chỉ báo lại nói "kém hấp dẫn hơn".

Gộp hai điều trên:

> **Điểm cao nhất rơi vào đúng lúc rủi ro cao nhất.** Còn lúc an toàn hơn thì điểm đã giảm.

## 6.2. Con số thật

Đo trên 102 cổ phiếu trong 2 năm 4 tháng. Mỗi lần một mã có điểm vượt lên 75 gọi là một "sự kiện",
được 235 sự kiện. Mua ngay tại thời điểm đó thì sau đó xảy ra gì:

| | Mua ngay khi điểm chạm 75 |
|---|---|
| Số sự kiện | 235 |
| Giá còn rơi thêm bao nhiêu nữa, mức giữa | **−7,3%** |
| 10% trường hợp xấu nhất rơi thêm | **−22,5%** |
| Sau 63 phiên có lãi | 73% số lần |
| Sau 63 phiên, mức lãi giữa | +9,3% |

Đọc hàng thứ ba: **một nửa số lần, mua xong còn phải chịu rơi thêm hơn 7% nữa.** Và cứ 10 lần thì
có 1 lần rơi thêm hơn 22%.

Đó chính là cái mà dân trong nghề gọi là "bắt dao rơi".

Con số này đo trên quãng thị trường tăng. Kéo dài về 2020 để gồm mùa gấu 2022 thì tệ hơn hẳn —
xem mục cuối Phần 8.

## 6.3. Cách giải quyết của app

Không nhồi thêm vào Buy Score. Thay vào đó **tách thành một cột riêng**, vì hai việc này kéo ngược
chiều nhau, gộp lại thì triệt tiêu nhau.

| Câu hỏi | Trả lời bởi |
|---|---|
| Đủ rẻ chưa? | **Buy Score** |
| Đã ngừng rơi chưa? | **Cột Hồi** (Phần 7) |

---

# PHẦN 7 — CỘT "HỒI"

Trong bảng xếp hạng ở tab Trading có một cột tên **Hồi**, hiện dạng `✓ 2/3` hoặc `0/3`.

Đây là **ba dấu hiệu kỹ thuật**, hoàn toàn độc lập với Buy Score. Mỗi dấu đạt được tính 1 điểm.
Đạt từ 2 trên 3 thì có dấu tích đậm.

## Ba dấu hiệu

**Dấu 1 — Giá vượt lên trên đường trung bình 20 phiên, và đường đó đang đi lên.**

Đường trung bình 20 phiên là mặt bằng giá ngắn hạn. Giá vượt lên trên nó nghĩa là hiện tại đang
mạnh hơn mặt bằng gần đây. Kèm điều kiện chính đường đó cũng phải đang dốc lên, để loại trường hợp
bật nhẹ một phiên trong xu hướng vẫn đang xuống.

**Dấu 2 — Đáy 10 phiên gần đây cao hơn đáy 10 phiên trước đó.**

Đây là ý quan trọng nhất trong ba dấu. Một mã đang rơi sẽ liên tục tạo đáy mới thấp hơn đáy cũ.
Khi đáy sau **không** thấp hơn đáy trước nữa, đó là dấu hiệu bên bán đã hụt hơi.

**Dấu 3 — Năm phiên gần nhất tăng, và khối lượng phiên tăng nhiều hơn khối lượng phiên giảm.**

Giá tăng thôi chưa đủ, phải tăng có người mua thật. Nếu phiên tăng thì lèo tèo còn phiên giảm thì
khối lượng lớn, đó là dấu hiệu vẫn đang có người thoát hàng.

## Con số thật của việc chờ dấu hồi

Vẫn 235 sự kiện điểm chạm 75, nhưng lần này **chờ tới khi có ít nhất 2 trên 3 dấu** mới vào, chờ
tối đa 21 phiên, không có thì bỏ qua:

| | Mua ngay | Chờ có dấu hồi |
|---|---|---|
| Số lần vào được | 235 | **23** |
| Bỏ qua vì không thấy dấu hồi | 0 | phần lớn |
| Còn rơi thêm, mức giữa | −7,3% | **0,0%** |
| 10% xấu nhất rơi thêm | −22,5% | −12,8% |
| Sau 63 phiên có lãi | 73% | **83%** |
| Sau 63 phiên, mức lãi giữa | +9,3% | **+25,0%** |

Nhìn qua thì tuyệt vời: gần như không còn phải chịu rơi thêm, tỉ lệ thắng và mức lãi đều cao hơn.

**Nhưng phải đọc luôn hai chỗ này:**

1. **235 xuống còn 23.** Chờ dấu hồi khiến bạn bỏ lỡ 90% số cơ hội. Con số đẹp chỉ dựa trên 23 lần.
2. **Có thiên lệch.** Cách đo này chỉ giữ lại những lần mà giá thực sự quay đầu trong vòng 21 phiên.
   Những lần rơi mãi không hồi thì bị loại khỏi thống kê. Nên kết quả tự nhiên đẹp hơn thực tế.

Kết luận đúng mực: **dùng dấu hồi làm điều kiện thứ hai thì hợp lý, nhưng chưa đủ bằng chứng để gọi
là lợi thế đã chứng minh.**

---

# PHẦN 8 — "RẺ KIỂU GÌ"

Hai mã cùng 80 điểm có thể rẻ vì hai lý do hoàn toàn khác nhau. App phân biệt bằng cách chia 7
thành phần thành hai nhóm:

| Nhóm | Gồm | Tổng điểm tối đa | Đặc điểm |
|---|---|---|---|
| **Chậm** | Giảm từ đỉnh 1 năm, lệch MA200, percentile | 55 | Rơi dài ngày, xói mòn từ từ |
| **Nhanh** | Giảm từ đỉnh 1 tháng, bán tháo, RSI | 40 | Rơi gấp, mới xảy ra |

So **tỉ lệ đạt được** của hai nhóm. Lệch nhau từ 15% trở lên thì gắn nhãn:

| Nhãn | Nghĩa | Hình dung |
|---|---|---|
| **cấu trúc** | Nhóm chậm trội hơn hẳn | Rơi suốt nhiều tháng, không có cú sốc nào rõ ràng. Thường là thứ gì đó đang xấu đi thật |
| **hoảng loạn** | Nhóm nhanh trội hơn hẳn | Vừa rơi gấp trong vài phiên, khối lượng lớn. Thường là phản ứng thái quá với một tin |
| **hỗn hợp** | Hai nhóm ngang nhau | Không rõ kiểu nào |

## Con số thật, tách theo nhãn

Vẫn ngưỡng 75, mua ngay khi chạm:

| Kiểu rẻ | Số sự kiện | Rơi thêm, mức giữa | Sau 63 phiên có lãi | Mức lãi giữa |
|---|---|---|---|---|
| **Hoảng loạn** | 42 | −6,7% | **90%** | **+24,4%** |
| **Hỗn hợp** | 102 | — | 75% | +9,0% |
| **Cấu trúc** | 91 | −9,9% (10% xấu nhất −27,1%) | **57%** | **+2,5%** |

Khác biệt rất rõ. Cùng một điểm số, nhưng:

- **Hoảng loạn** hồi phục tốt trong 90% trường hợp.
- **Cấu trúc** gần như tung đồng xu, và khi sai thì sai nặng.

Với kiểu cấu trúc, nếu chờ có dấu hồi rồi mới vào thì tỉ lệ có lãi lên 83% và mức lãi giữa lên
+26,1%, nhưng chỉ còn **11 sự kiện** — quá ít để kết luận.

**Cách dùng nhãn này:** thấy nhãn *cấu trúc* thì hiểu rằng điểm cao đang phản ánh một quá trình rơi
dài, và bạn cần lý do ngoài biểu đồ để mua, ví dụ bạn biết gì đó về doanh nghiệp. Thấy nhãn *hoảng
loạn* thì khả năng đây là phản ứng thái quá cao hơn.

Nhãn này hiện dạng chữ nhỏ cạnh mã trong bộ Gợi ý, và trong dòng mô tả dưới hero của tab Trading.

## Kiểm lại trên 5 năm, gồm mùa gấu 2022 (đo ngày 18/09)

Mọi con số ở trên đo trên 2 năm 4 tháng gần nhất, một quãng **chỉ có thị trường tăng và vài lần
nhúng rồi bật lại**. Để biết chúng có phải tính chất thật hay chỉ là hình dạng của quãng đó, app đã
cào thêm lịch sử về 09/2020 (file nghiên cứu riêng, app không đọc) và đo lại theo từng năm. Năm 2022
VN-Index rơi từ 1.529 xuống 912 (−40%), nằm dưới đường trung bình 200 phiên liên tục 279 phiên —
đó là mùa gấu thật.

| Điểm chạm 75, mua ngay | Số sự kiện | Rơi thêm, mức giữa | Sau 63 phiên có lãi | Mức lãi giữa |
|---|---|---|---|---|
| 2 năm 4 tháng gần nhất (bảng trên) | 235 | −7,3% | 73% | +9,3% |
| **5 năm** | 663 | −10,3% | 62% | +5,9% |
| Riêng **2022** | 322 | **−18,2%** | **52%** | +1,7% |
| Riêng 2023 (hồi sau gấu) | 91 | −5,5% | 77% | +14,3% |
| Riêng 2025 | 92 | −7,0% | 88% | +17,1% |

Ba điều đổ khi kéo dài dữ liệu:

- **"Thị trường chung đang xấu thì cổ phiếu rẻ mua tốt hơn" — sai.** Trên dữ liệu ngắn, sự kiện xảy
  ra khi VN-Index dưới trung bình 200 phiên cho 89% có lãi. Trên 5 năm chỉ còn 65%, và riêng 2022
  là **53%, rơi thêm mức giữa −17%**. Con số 89% là hình dạng của những lần nhúng rồi bật chữ V trong
  thị trường tăng, không phải tính chất của "thị trường xấu". App vì thế **không** thêm điều kiện
  này vào bộ Gợi ý.
- **Nhãn hoảng loạn không còn "90% hồi".** Toàn 5 năm là 74% (57 sự kiện). Riêng 2022: **11 lần, chỉ
  3 lần có lãi**, mức giữa −12,6%, rơi thêm −22,9%. Con số 90% ở bảng trên gần như toàn bộ đến từ
  năm 2025.
- **Chờ dấu hồi vẫn giảm rơi thêm ở mọi năm** (2022: −8,7% thay vì −18,2%) nhưng tỉ lệ có lãi
  năm 2022 chỉ 54%. Nó giúp **mất ít hơn khi sai**, không giúp **đúng nhiều hơn**.

Kết luận thẳng: **không chỉ báo nào trong app phân biệt được "đáy" với "giữa đường xuống" trong một
mùa gấu.** Thứ bảo vệ được vốn trong 2022 là mua từng phần theo nhịp (cách DCA làm) và giữ khối
lượng nhỏ, không phải tín hiệu vào lệnh.

---

# PHẦN 9 — VÙNG GIÁ MUA

Card **Vùng giá mua** có mặt ở cả ba tab, trả lời câu hỏi rất tự nhiên: *"Vậy giá phải về bao nhiêu
thì mới gọi là rẻ?"*

Bảng có 4 dòng, mỗi dòng là một trạng thái:

| Vùng | Giá cần về | Chênh so với hiện tại |
|---|---|---|
| Tích luỹ (45 điểm) | … | … |
| Giảm sâu (65 điểm) | … | … |
| Bán tháo (80 điểm) | … | … |

## Nó được tính thế nào

**Không có công thức mới.** App lấy chính hàm tính Buy Score, thay giá thật bằng một giá giả định,
rồi dò ngược bằng cách chia đôi khoảng cho tới khi tìm ra mức giá vừa đủ đạt ngưỡng.

Điều này hợp lệ vì điểm luôn giảm khi giá tăng. Năm trong bảy thành phần phụ thuộc trực tiếp vào
giá, và cả năm đều đi theo chiều đó.

## Hai chỗ phải hiểu đúng

**1. Có ngưỡng "không tới được".** RSI, khối lượng và thành phần so với chỉ số **không đổi** khi ta
chỉ giả định giá khác đi. Nên có những mã dù giá về bao nhiêu cũng không chạm nổi 80 điểm. App ghi
đúng chữ "không tới được", không bịa ra một con số.

**2. Giá hiển thị luôn được cắt xuống**, không làm tròn lên. Cổ phiếu cắt theo bước 0,05k. Lý do:
làm tròn lên sẽ vượt qua đúng cái ngưỡng vừa dò, khiến con số in ra không còn đạt ngưỡng ghi bên
cạnh.

Bảng này tính lại mỗi lần bấm Cập nhật. Nó là **bảng tra cứu**, không phải lệnh đặt sẵn, không có
trạng thái gì được lưu.

---

# PHẦN 10 — BỘ LỌC "GỢI Ý"

Trong tab Trading, bộ chọn danh sách có mục **Gợi ý** đứng đầu và là mặc định. Đây là nơi app gom
tất cả chỉ báo trên thành một phép lọc.

> Đây là **phép lọc máy móc theo tiêu chí đặt sẵn**, không phải khuyến nghị đầu tư của ai.

## Luật hiện tại

Một mã được vào danh sách xét nếu **điểm ≥ 75**, hoặc **đã từng chạm 75 trong 21 phiên gần đây và
hôm nay vẫn còn ≥ 65**.

Vế thứ hai quan trọng: khi giá hồi thì điểm tụt, nên nếu chỉ xét điểm hôm nay thì mọi mã vừa có dấu
hiệu tích cực đều rơi khỏi danh sách.

Sau đó chia ba nhóm:

| Nhóm | Điều kiện |
|---|---|
| **MUA** | Qua được luật vào (xem dưới) **và** dữ liệu đủ và mới **và** chưa rớt quá 65% từ đỉnh 1 năm |
| **THEO DÕI** | Rẻ nhưng chưa qua luật vào |
| **LOẠI** | Có ghi rõ lý do: đang giữ · dữ liệu thiếu hoặc cũ · rớt quá sâu |

**Luật vào đang dùng là "theo kiểu rẻ":**

- Nhãn **hoảng loạn** → vào ngay khi điểm ≥ 75.
- Nhãn **cấu trúc** hoặc **hỗn hợp** → phải đã chạm 75 trong 21 phiên, hôm nay còn ≥ 65, **và** có
  ít nhất 2 trên 3 dấu hồi.

**Vì sao loại mã rớt quá 65% từ đỉnh:** rơi sâu tới mức đó thường không còn là chuyện định giá nữa.
Buy Score không đọc được báo cáo tài chính nên không biết doanh nghiệp có đang hỏng thật không. App
chọn đứng ngoài và ghi rõ "kiểm tra doanh nghiệp".

## Kết quả thật hôm nay

**0 mã đủ điều kiện mua · 20 mã theo dõi.** Cả 20 mã đều mang nhãn *cấu trúc*, và chưa mã nào có
đủ dấu hồi.

Đây là một kết quả tốt, không phải công cụ bị hỏng. Nó đang nói: *"Có 20 mã rẻ, nhưng tất cả đều
thuộc kiểu rơi dài ngày, và chưa mã nào ngừng rơi."*

---

# PHẦN 11 — POPUP TÍNH PNL

Nút **Tính PnL** ở tab Trading, hoặc bấm lần thứ hai vào dòng đang chọn trong bảng xếp hạng.

Popup trả lời: *"Nếu hôm nay tôi bỏ X tiền mua mã này, rồi bán khi điểm về Z, thì lãi lỗ bao
nhiêu?"*

Kéo thanh trượt để đổi điểm bán Z, ba ô số cập nhật ngay: số cổ phiếu mua được, giá lúc điểm về Z,
và lãi lỗ sau phí.

## Hai cách tính, phải phân biệt

Đây là chỗ dễ nhầm nhất trong cả app.

### Cách TĨNH — phần bảng và ba ô số

Giả định **mọi thứ khác đứng yên**, chỉ có giá thay đổi. Đỉnh một năm giữ nguyên, MA200 giữ nguyên,
RSI giữ nguyên.

Trả lời: *"Giá phải lên tới đâu thì điểm mới tụt xuống Z?"*

### Cách ĐỘNG — dòng chữ riêng phía dưới

Giả định **giá đứng yên hoàn toàn**, chỉ có thời gian trôi.

Trả lời: *"Nếu giá không nhúc nhích, thì bao lâu nữa điểm tự tụt xuống Z?"*

Nghe vô lý nhưng điểm **sẽ** tụt, vì ba lý do đã nói ở Phần 2: đỉnh cũ trôi ra khỏi cửa sổ một năm,
MA200 hạ dần xuống theo, và RSI bò về mức trung tính 50.

## Ví dụ thật, đo trên mã CII ngày 17/09

Điểm hiện tại 84. Nếu giá đứng yên tuyệt đối:

| Sau | Điểm còn |
|---|---|
| 10 phiên | 77 |
| 21 phiên | 62 |
| 63 phiên | 58 |

Và app ghi: *về ≤ 65 sau 17 phiên*.

**Ý nghĩa cực kỳ thực tế:** nếu kế hoạch của bạn là "mua rồi bán khi điểm về 65", thì với mã này,
**chỉ cần chờ 17 phiên là điểm tự về 65 mà giá không cần lên một đồng nào**. Bán lúc đó bạn không
lãi gì, chỉ mất phí.

Không có dòng này, rất dễ tưởng rằng điểm về 65 nghĩa là đã lãi.

---

# PHẦN 12 — POPUP BACKTEST

Nút **Backtest** ở tab Trading. Đây là nơi app tự kiểm tra xem các cách chơi trên có thật sự hiệu
quả trong quá khứ hay không.

"Backtest" nghĩa là: lấy dữ liệu quá khứ, giả vờ chơi theo một luật, xem cuối cùng lãi lỗ ra sao.

Popup có bốn bảng.

## 12.1. Bảng 9 bộ quy tắc mua bán

Thử 9 cách kết hợp: ba ngưỡng vào (55, 65, 75) nhân ba thang chốt lời và cắt lỗ:

| Thang | Chốt lời dần | Cắt lỗ dần |
|---|---|---|
| L1 | +5% bán nửa, +10% bán hết | −3% bán nửa, −6% bán hết |
| L2 | +8% bán nửa, +15% bán hết | −4% bán nửa, −8% bán hết |
| L3 | +10% bán nửa, +20% bán hết | −5% bán nửa, −10% bán hết |

Mọi bộ đều vào làm **hai nhịp**: mua một nửa ngay, nửa còn lại nếu giá rớt thêm 3% mà điểm vẫn đủ.
Ăn được bậc chốt lời đầu thì phần còn lại dời cắt lỗ về giá vốn.

Mô phỏng có tính đúng luật Việt Nam: phí mua bán 0,15%, thuế bán 0,1%, T+2 mới được bán, không bán
được phiên sàn, không mua được phiên trần, giữ tối đa 15 phiên.

**Kết quả thật:** bộ tốt nhất là 75/L3, lãi trung bình **+4,5%** toàn kỳ và **+0,6%** trong 12
tháng gần. Trong khi cứ mua rồi giữ được **+15,9%**. Chỉ 22 trên 102 mã là bộ này thắng được cả
tiền mặt lẫn mua-giữ ở cả hai kỳ.

App in thẳng kết luận: *"Không bộ nào thắng mua-giữ trung bình ở cả hai kỳ ⇒ chưa đáng trade."*

## 12.2. Bảng kế hoạch chọn mã hằng tháng

Mô phỏng chính cách chơi tự nhiên nhất: **mỗi tháng chọn tối đa 2 mã điểm cao, bán khi điểm tụt
xuống X hoặc quá 42 phiên.** So bốn cách vào:

| Cách vào | Bán ≤ | Lệnh | Thắng | Toàn kỳ | 12 tháng gần | Sụt tối đa |
|---|---|---|---|---|---|---|
| Điểm ≥ 75, chọn đầu tháng (cũ) | 25 | 8 | 63% | **+42,2%** | +25,2% | 22,3% |
| Điểm ≥ 75, chọn đầu tháng (cũ) | 65 | 15 | 53% | +19,2% | +27,6% | 25,6% |
| Điểm ≥ 75, soi từng phiên | 65 | 32 | 53% | **−18,4%** | −10,7% | 32,3% |
| Điểm + Hồi, soi từng phiên | 65 | 10 | **90%** | +14,6% | +0,2% | **5,2%** |
| Điểm + Hồi, soi từng phiên | 55 | 10 | 80% | +17,3% | +3,7% | 18,7% |
| Theo kiểu rẻ, soi từng phiên | 65 | 16 | 69% | +4,9% | −1,2% | 21,6% |
| **VN-Index mua rồi giữ** | | | | **+42,7%** | **+9,1%** | |

**Ba điều đọc ra được:**

1. **Vào ngay mỗi khi điểm chạm 75 là tệ nhất** (−18,4%). Đó chính là bắt dao rơi, lặp đi lặp lại
   32 lần.
2. **Thêm điều kiện dấu hồi cải thiện rõ rệt**: thắng 9 trên 10 lệnh, và sụt tối đa chỉ 5,2% thay
   vì 32%. Nhưng chỉ có 10 lệnh trong hơn 2 năm, và 12 tháng gần gần như hoà vốn.
3. **Không cách nào thắng VN-Index toàn kỳ.** Cách tốt nhất (+42,2%) chỉ ngang chỉ số (+42,7%), mà
   cách đó thực chất là "mua rồi giữ 42 phiên" chứ không phải bán theo điểm.

## 12.3. Bảng "Sau khi điểm chạm mốc"

Chính là các con số đã dùng ở Phần 6 và Phần 8. Ba ngưỡng 75, 80, 85 nhân hai cách vào.

Chú ý mấy chỗ ghi trong ngoặc:

- Số trong ngoặc sau mỗi ô là **số sự kiện thực sự đo được ô đó**. Sự kiện mới xảy ra chưa đủ 63
  phiên thì không được tính vào cột 63 phiên. Không có con số này rất dễ tưởng mẫu lớn hơn thật.
- Cột chờ xác nhận ghi thêm **bỏ qua N** (số lần không thấy dấu hồi nên không vào) và **vào ±x% so
  lúc chạm** (giá lúc vào đã cao hơn hay thấp hơn lúc điểm chạm mốc, tức chi phí của việc chờ).
- Mức rơi thêm đo theo **giá đóng cửa**, không phải đáy trong phiên. Thực tế có thể xấu hơn.
- Nhiều mã cùng chạm mốc trong một ngày thì **không độc lập với nhau**, vì cả thị trường cùng rơi.

## 12.4. Bảng "Kiểm định ngoài mẫu"

Đây là bảng **quan trọng nhất** và cũng khó chịu nhất.

Vấn đề: ba bảng trên chọn ra cách chơi tốt nhất **và** chấm điểm nó **trên cùng một tập dữ liệu**.
Kiểu như ra đề rồi tự chấm bài mình. Kết quả bao giờ cũng đẹp hơn thực tế.

Bảng này chia đôi thời gian: **chọn cách chơi trên nửa đầu, rồi đem áp lên nửa sau** mà nửa sau
hoàn toàn chưa được nhìn thấy khi chọn.

| Phần | Bộ chọn trên nửa đầu | Nửa đầu | Nửa sau | Mốc nửa sau | Nếu biết trước |
|---|---|---|---|---|---|
| Lưới 9 bộ | 55/L3 | +4,0% | **−1,8%** | mua giữ −2,3% | 75/L3 +0,7% |
| Kế hoạch chọn mã | Điểm + Hồi, bán ≤ 25 | +17,9% | **−17,7%** | VN-Index +22,7% | cũ, bán ≤ 65: +27,6% |

**Đọc thẳng:** cách chơi tốt nhất ở nửa đầu (+17,9%) đem sang nửa sau thì **lỗ 17,7%**, trong khi
chỉ số tăng 22,7%. Nghĩa là nó **không giữ được**.

Cột cuối "nếu biết trước" là cách chơi tốt nhất ở nửa sau, tức thứ chỉ biết được nhờ nhìn trộm
tương lai. Khoảng cách giữa cột "nửa sau" và cột đó chính là **phần lạc quan** của ba bảng phía
trên.

**Một lần chia đôi chỉ là một phép thử, không phải bằng chứng.** Nhưng nó đủ để nói: đừng vội tin
những con số đẹp ở các bảng trên.

---

# PHẦN 13 — TAB DCA: KẾ HOẠCH VỐN

Tab DCA dùng Buy Score theo một cách khác hẳn: không phải để chọn mua gì, mà để **quyết định tháng
này mua nhiều hay ít**.

DCA nghĩa là mua đều đặn theo kế hoạch, thay vì cố đoán đáy.

## Ngân sách tháng chia làm ba phần

Đặt trong Cài đặt, mặc định chia 50 / 30 / 20:

| Phần | Tỉ lệ | Cách hoạt động |
|---|---|---|
| **Base** | 50% | Mua theo lịch cố định, mặc định ngày 3, 13, 23 với tỉ lệ 40/30/30. **Không quan tâm điểm số** |
| **Smart** | 30% | Chỉ mở một phần theo Buy Score |
| **Opportunity** | 20% | Tích luỹ dần, chỉ mở khi thật rẻ |

## Smart mở bao nhiêu theo điểm

| Buy Score | Mở |
|---|---|
| Từ 75 | 100% |
| Từ 60 | 75% |
| Từ 45 | 50% |
| Từ 30 | 25% |
| Dưới 30 | 0% |

## Opportunity mở bao nhiêu — dè dặt hơn hẳn

| Buy Score | Mở |
|---|---|
| Từ 85 | 100% |
| Từ 75 | 50% |
| Từ 65 | 25% |
| Dưới 65 | 0% |

Opportunity không có sổ riêng. Số dư được suy ra: **số tháng đã góp × phần góp mỗi tháng − số đã
tiêu**, chặn trên ở mức cap (mặc định 6 tháng góp).

## Ba điều cần biết

1. **Base vẫn chạy dù điểm thấp.** Đó là chủ ý: phần cốt lõi của DCA là đều đặn, không đoán.
2. **Điểm quá 48 giờ thì Smart và Opportunity không mở.** App coi như chưa có điểm và nhắc bấm Cập
   nhật, thay vì mở vốn dựa trên số cũ.
3. **Card "Tháng này" chỉ là phép tính, không phải lệnh.** Nó nói "theo cài đặt của bạn thì tháng
   này còn được mua bao nhiêu", chứ không bắt bạn mua.

---

# PHẦN 14 — SỔ LỆNH

Card **Sổ lệnh** ở tab Trading ghi lại các lệnh mua bán bạn thực sự làm, qua nút **Mua / Bán**.

Điểm hay: lệnh được ghi thành một **Chuyển đổi tài sản thật**, nên số dư, tài sản ròng, danh mục
cổ phiếu, ví coin đều tự cập nhật. Không có sổ sách nào chạy song song để lệch nhau.

Ba ô thống kê:

| Ô | Nghĩa |
|---|---|
| Đang mở tạm tính | Các vị thế chưa bán, lãi lỗ theo giá hiện tại |
| Đã chốt tháng này | Lãi lỗ thực sự đã hiện thực trong tháng |
| Đã chốt tổng | Cộng dồn từ đầu, kèm tỉ lệ thắng |

**Nếu bán một mã mua ở nơi khác** (không qua nút Mua trong app), sổ này không biết giá vốn nên ghi
"chưa xác định" và **không cộng vào tổng**. Xem lãi lỗ thật của mã đó ở tab Chứng khoán.

**Phí và thuế không tự trừ.** Muốn sổ khớp với công ty chứng khoán thì nhập giá đã gồm phí.

Form Mua sẽ cảnh báo, nhưng không chặn, khi bạn đang mở từ 2 vị thế trở lên hoặc tháng này đã lỗ
quá 10% vốn trade. Đó là hai quy tắc quản trị vốn cài sẵn.

---

# PHẦN 15 — QUY TRÌNH DÙNG HẰNG THÁNG

Gợi ý một nhịp làm việc gọn, khoảng 15 phút mỗi tháng.

**Đầu tháng**

1. Mở tab **Trading**, bấm **Cập nhật**.
2. Xem bộ **Gợi ý**. Có mã nào vào nhóm MUA không?
3. Với mỗi mã trong nhóm MUA, bấm vào xem:
   - Nhãn rẻ kiểu gì. Là *cấu trúc* thì tự hỏi: mình có biết gì về doanh nghiệp này ngoài biểu đồ
     không? Không biết gì thì cân nhắc bỏ qua.
   - Cột Hồi mấy trên ba.
   - Bảng Phân rã điểm: điểm đến từ thành phần nào?
4. Bấm **Tính PnL**, kéo thanh trượt tới mức điểm bạn định bán. Đọc **cả hai** dòng: giá cần lên
   tới đâu, và bao lâu nữa điểm tự tụt tới đó nếu giá đứng yên.
5. Quyết định. Nếu mua, ghi lệnh qua nút **Mua / Bán** để sổ khớp.

**Trong tháng**

Không cần mở hằng ngày. App tự lấy giá khi bạn mở, và tự chụp lại danh mục mỗi ngày.

**Cuối tháng**

6. Tab **Dòng tiền**, bấm **Chốt tháng**.
7. Tab **Tổng quan**, xem **Phân rã tăng trưởng**: tháng này tài sản tăng nhờ để dành được tiền hay
   nhờ giá lên.

**Mỗi quý một lần**

8. Mở popup **Backtest**, chạy lại, đọc bảng **Kiểm định ngoài mẫu**. Nếu vẫn chưa có cách chơi nào
   thắng được chỉ số ngoài mẫu, thì kết luận vẫn là: mua tích luỹ đều đặn, đừng trade.

---

# PHẦN 16 — MƯỜI SAI LẦM CẦN TRÁNH

| # | Sai lầm | Vì sao sai |
|---|---|---|
| 1 | "Điểm 85, mua ngay" | Điểm đo độ rẻ, không đo khả năng thắng. Đo thật: một nửa số lần còn rơi thêm hơn 7% |
| 2 | "Mã A 80 điểm tốt hơn mã B 60 điểm" | Mỗi mã chỉ so với chính nó. Hai con số này không so được với nhau |
| 3 | "Dữ liệu: đủ nghĩa là an toàn" | Nhãn đó nói về chất lượng số liệu, không nói gì về lời lỗ |
| 4 | "Backtest lãi 42% nên chơi thật được" | Tham số được chọn và chấm trên cùng dữ liệu. Ngoài mẫu thì lỗ 17,7% |
| 5 | "Thắng 90% số lệnh là quá tốt" | Chỉ 10 lệnh trong hơn 2 năm. Mẫu quá nhỏ để kết luận |
| 6 | "Điểm về 65 rồi, bán thôi, chắc lãi" | Điểm tự tụt theo thời gian. Có mã chỉ cần 17 phiên là về 65 dù giá đứng yên |
| 7 | "Bộ lọc không ra mã nào, chắc hỏng" | 0 mã mua là một câu trả lời hợp lệ, nghĩa là chưa mã nào đủ điều kiện |
| 8 | "Mã rớt 70%, rẻ quá" | App cố tình loại mã rớt quá 65%. Rơi sâu thế thường không còn là chuyện định giá |
| 9 | "Vùng giá mua là lệnh đặt sẵn" | Đó là bảng tra cứu, tính lại mỗi lần cập nhật, không lưu trạng thái gì |
| 10 | "Nhãn hoảng loạn nghĩa là chắc hồi" | 90% trong 42 trường hợp của quãng thị trường tăng; năm 2022 chỉ 3/11. App không biết lần này thuộc nhóm nào |

---

# PHẦN 17 — BẢNG TRA NHANH

## Ý nghĩa các con số trên màn hình

| Thấy gì | Nghĩa |
|---|---|
| **Buy Score 78** | Rẻ so với chính mã đó một năm qua, mức "Giảm sâu" |
| **Giảm sâu** | Điểm trong khoảng 65 đến 79 |
| **Dữ liệu: đủ** | Đủ số phiên, còn mới, có chỉ số tham chiếu |
| **✓ 2/3** ở cột Hồi | Có 2 trên 3 dấu hiệu đã ngừng rơi |
| **rẻ kiểu cấu trúc** | Rơi dài ngày, không phải cú sốc. Nhóm rủi ro hơn |
| **rẻ kiểu hoảng loạn** | Vừa rơi gấp kèm khối lượng lớn. Nhóm hồi tốt hơn trong quá khứ |
| **mua** / **theo dõi** | Kết quả của bộ lọc Gợi ý, không phải khuyến nghị |
| **−55,6%** ở cột Đỉnh 1 năm | Đang thấp hơn đỉnh một năm 55,6% |
| **dữ liệu cũ** (huy hiệu vàng) | Mã này chưa được cập nhật đúng hạn, đừng tin điểm |

## Bảy thành phần và trọng số

| Thành phần | Điểm | Một câu |
|---|---|---|
| Giảm từ đỉnh 1 năm | 25 | Rơi bao xa khỏi đỉnh năm |
| Lệch MA200 | 20 | Dưới mặt bằng dài hạn bao nhiêu |
| RSI14 | 15 | Bên bán áp đảo tới đâu |
| Giảm từ đỉnh 1 tháng | 15 | Cú rơi gần đây sâu cỡ nào |
| Percentile 1 năm | 10 | Xếp thứ mấy nếu sắp cả năm từ thấp tới cao |
| Bán tháo | 10 | Rơi nhanh có kèm khối lượng lớn không |
| So chỉ số tham chiếu | 5 | Tụt hậu so với thị trường chung bao nhiêu |

## Năm trạng thái

| Điểm | Tên |
|---|---|
| 80+ | Bán tháo |
| 65 đến 79 | Giảm sâu |
| 45 đến 64 | Tích luỹ |
| 25 đến 44 | Trung tính |
| Dưới 25 | Đắt |

---

## Ba câu tóm lại cả tài liệu

1. **Buy Score đo độ rẻ so với quá khứ của chính mã đó.** Không đo doanh nghiệp, không so mã với
   mã, không dự đoán tương lai.
2. **Điểm cao nhất rơi vào lúc rủi ro cao nhất.** Vì vậy mới có cột Hồi, nhãn kiểu rẻ và bộ lọc
   Gợi ý làm điều kiện thứ hai.
3. **Tới hôm nay, chưa cách chơi nào thắng được việc mua rồi giữ khi kiểm định ngoài mẫu.** Công cụ
   này đang làm tốt việc loại bỏ cách chơi tệ. Nó chưa tìm ra cách chơi tốt, và nó nói thẳng điều
   đó thay vì tô hồng.
