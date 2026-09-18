# HƯỚNG DẪN CÁC CÁCH CHƠI — CÁCH TÍNH, KẾT QUẢ ĐO, PHƯƠNG ÁN ĐANG CHỌN

Tài liệu này trả lời đúng ba câu hỏi:

1. **App đã thử những cách chơi nào**, và mỗi cách tính chính xác ra sao.
2. **Kết quả đo thật là gì** — số nào trên dữ liệu nào, mẫu bao nhiêu.
3. **Đang chọn cách nào để dùng thật**, và vì sao không chọn những cách còn lại.

Hai tài liệu kia bổ trợ: `HUONGDAN.md` dạy thao tác ghi thu chi hằng ngày, `HUONGDAN-CHIBAO.md`
giải thích từng chỉ báo cho người chưa từng đọc chỉ báo. File này nói về **cách chơi**, tức là
luật mua và luật bán.

---

## ĐỌC BA CÂU NÀY TRƯỚC

**Một.** Không có cách chơi nào trong tài liệu này đã chứng minh được là thắng việc "cứ mua rồi
giữ". Cách tốt nhất hiện có thắng 66–76% số lệnh, nhưng lợi nhuận toàn kỳ vẫn kém VN-Index trong
những năm thị trường tăng.

**Hai.** Mọi con số đẹp trên 80% trong lịch sử làm app đều đến từ mẫu nhỏ hoặc từ một quãng thị
trường tăng, và đều tụt xuống khi đo lại trên 5 năm có mùa gấu 2022. Tài liệu này giữ cả hai con
số cạnh nhau để thấy chênh lệch đó.

**Ba.** Cách chơi duy nhất đang dùng bằng tiền thật là **mua tích luỹ theo lịch (DCA)**. Mọi thứ
còn lại đang ở mức theo dõi và ghi sổ.

---

## MỤC LỤC

| Phần | Nội dung |
|---|---|
| 1 | Luật mô phỏng dùng chung — dữ liệu, khớp lệnh, phí, mốc so sánh |
| 2 | Bốn khối xây dựng mà mọi cách chơi đều dùng |
| 3 | Chín cách chơi: cách tính và kết quả từng cách |
| 4 | Bảng tổng hợp, xếp theo tỉ lệ thắng |
| 5 | Phương án đang chọn, hai phương án A/B đang nghiên cứu, sổ lệnh giả, quy trình hằng tháng |
| 6 | Bảy cạm bẫy khi đọc những con số trên |
| 7 | Nhật ký các lần đo |

---

# PHẦN 1 — LUẬT MÔ PHỎNG DÙNG CHUNG

Mọi con số trong tài liệu này đều chạy qua cùng một bộ luật. Nếu hai cách chơi khác nhau về kết
quả, đó là vì luật mua bán khác nhau, không phải vì cách mô phỏng khác nhau.

## 1.1. Hai kho dữ liệu

| Kho | Số mã | Số phiên mỗi mã | Chuỗi điểm chấm được | Dùng cho |
|---|---|---|---|---|
| `data/vn100.json` | 102 | 800 | 21/05/2024 → 17/09/2026 (2,3 năm) | Chính app đọc, backtest trong popup |
| `data/vn100-deep.json` | 102 | 1.191–1.505 | 08/07/2021 → 17/09/2026 (5,2 năm) | Chỉ nghiên cứu, app không đọc |

Kho sâu có mùa gấu 2022 thật: VN-Index từ 1.529 xuống 912 (−40%), nằm dưới đường trung bình 200
phiên liên tục 279 phiên. Kho ngắn không có mùa gấu nào — đó là lý do mọi số đo trên nó đẹp hơn.

Vì sao chuỗi điểm ngắn hơn số phiên: cần 220 phiên đầu để khởi động các cửa sổ tính (đỉnh 1 năm,
MA200), nên 1.500 phiên chỉ chấm điểm được từ phiên thứ 221.

## 1.2. Cách khớp lệnh

- Tín hiệu tính ở **giá đóng cửa phiên t**, lệnh khớp ở **giá mở cửa phiên t+1**. Không có cách
  nào mua được ở giá đóng của chính phiên ra tín hiệu.
- Không mua khi phiên mở cửa sát giá trần (±6,9%), không bán khi mở cửa sát giá sàn.
- Luật **T+2**: mua hôm nay thì sớm nhất phiên thứ ba mới bán được. Tính từ lần mua **cuối**, nên
  nếu mua thêm nhịp hai thì thời gian chờ tính lại.
- Vị thế còn mở ở phiên cuối kỳ **không bị ép bán**. Nó tính vào tài sản theo giá cuối, nhưng
  không đếm vào tỉ lệ thắng — vì chưa biết kết cục.

## 1.3. Phí

| Thị trường | Mua | Bán | Một vòng |
|---|---|---|---|
| Cổ phiếu | 0,15% | 0,15% + thuế 0,1% | **0,40%** |
| Coin spot | 0,1% | 0,1% | 0,20% |
| Coin futures 1x | 0,05% | 0,05% + funding 0,01%/8 giờ | 0,10% + funding |

Funding của futures được giả định **trả ở cả hai chiều**, tức là bất lợi có chủ ý. Thực tế bên
này trả thì bên kia nhận, nhưng app không tải lịch sử funding nên chọn giả định xấu hơn.

## 1.4. Mốc so sánh — đo trên kho 5 năm

Một cách chơi chỉ đáng gọi là có lợi thế khi vượt được những mốc này:

| Mốc | Tỉ lệ dương sau 63 phiên | Riêng 2022 |
|---|---|---|
| Mua VN-Index vào một phiên bất kỳ | **62,3%** (1.222 phiên) | 28,1% |
| Mua một mã bất kỳ trong 102 mã, vào một phiên bất kỳ | **51,6%** (123.794 lần) | 34,8% |

Và mốc lợi nhuận: VN-Index mua giữ **+32,6%** trong 5,2 năm, **+9,1%** trong 12 tháng gần nhất.
Trên kho ngắn 2,3 năm con số là +42,7% và +9,1%.

Đọc đúng mốc thứ hai: **mua ngẫu nhiên một mã rồi giữ ba tháng đã thắng 51,6%.** Một cách chơi
thắng 55% chưa nói lên gì cả.

---

# PHẦN 2 — BỐN KHỐI XÂY DỰNG

Mọi cách chơi dưới đây ghép từ bốn khối này. Chi tiết từng khối ở `HUONGDAN-CHIBAO.md`; đây là
bản tóm tắt vừa đủ để hiểu công thức.

## 2.1. Buy Score — đo độ rẻ, 0 đến 100

Bảy thành phần, cộng lại tối đa 100 điểm:

| Thành phần | Điểm tối đa | Đo gì |
|---|---|---|
| Giảm từ đỉnh 1 năm | 25 | Rớt 45% ⇒ đủ 25 điểm |
| Lệch so với MA200 | 20 | Dưới MA200 25% ⇒ đủ 20 điểm |
| RSI14 (Wilder) | 15 | RSI ≤ 20 ⇒ đủ 15 điểm |
| Giảm từ đỉnh 21 phiên | 15 | Rớt 18% ⇒ đủ 15 điểm |
| Percentile giá trong 1 năm | 10 | Nằm ở 5% thấp nhất ⇒ đủ 10 điểm |
| Bán tháo (5 phiên + khối lượng) | 10 | Rớt 14% kèm khối lượng gấp 2 ⇒ đủ 10 |
| So với VN-Index 21 phiên | 5 | Tụt hậu 12% so chỉ số ⇒ đủ 5 |

Số trên là ngưỡng cổ phiếu (`STOCK_SCORE_V1`). Coin dùng ngưỡng rộng hơn (`BUY_SCORE_V1`: rớt
60% mới đủ 25 điểm) vì coin biến động mạnh hơn. Khung swing H4 dùng ngưỡng hẹp hơn nữa.

Trạng thái theo điểm: ≥ 80 Bán tháo · ≥ 65 Giảm sâu · ≥ 45 Tích luỹ · ≥ 25 Trung tính · dưới 25 Đắt.

**Điều quan trọng nhất về Buy Score:** nó đo **rẻ**, không đo **đã ngừng rớt**. Giá càng rớt điểm
càng cao, nên điểm cao nhất thường xuất hiện ở giữa đường xuống, không phải ở đáy.

## 2.2. Cột Hồi — đo đã ngừng rớt chưa, 0 đến 3 dấu

Ba dấu hiệu độc lập hoàn toàn với điểm, tính trên giá và khối lượng:

| Dấu | Điều kiện |
|---|---|
| 1 | Giá đóng trên MA20 **và** MA20 của hôm nay cao hơn MA20 ba phiên trước |
| 2 | Đáy thấp nhất 10 phiên gần đây cao hơn đáy thấp nhất 10 phiên trước đó |
| 3 | Giá 5 phiên gần nhất tăng **và** khối lượng những phiên tăng nhiều hơn những phiên giảm |

`Hồi ≥ 2/3` nghĩa là đạt ít nhất hai trong ba dấu. Đây là ngưỡng mặc định của app.

## 2.3. Nhãn kiểu rẻ — rẻ vì rớt dài hay rẻ vì hoảng loạn

Chia bảy thành phần làm hai nhóm:

- **Nhóm chậm** (tối đa 55 điểm): giảm từ đỉnh 1 năm + lệch MA200 + percentile.
- **Nhóm nhanh** (tối đa 40 điểm): giảm từ đỉnh tháng + bán tháo + RSI.

So **tỉ lệ đạt** của hai nhóm. Nhóm nhanh cao hơn từ 0,15 trở lên ⇒ nhãn **hoảng loạn**. Nhóm
chậm cao hơn từ 0,15 ⇒ nhãn **cấu trúc**. Còn lại ⇒ **hỗn hợp**.

## 2.4. Bộ lọc chất lượng — loại trước khi xét mua

Áp cho mọi cách chơi, cả khi backtest lẫn khi app hiện gợi ý:

| Loại vì | Ngưỡng |
|---|---|
| Dữ liệu cũ | Kho chưa cào quá 30 giờ |
| Dữ liệu thiếu | Không đủ 220 phiên, hoặc thiếu chỉ số tham chiếu |
| Rớt quá sâu | Rớt hơn 65% từ đỉnh 1 năm — rẻ có thể vì doanh nghiệp hỏng, điểm không biết |
| Đang giữ | Đã có mã này trong danh mục |

---

# PHẦN 3 — CHÍN CÁCH CHƠI

Mỗi cách trình bày theo cùng một khuôn: **ý tưởng → cách tính từng bước → kết quả đo → đọc kết quả**.

---

## 3.1. Mua tích luỹ theo lịch (DCA Base / Smart / Opportunity) — ĐANG DÙNG THẬT

**Ý tưởng.** Chia tiền hằng tháng làm ba phần. Một phần mua đều theo lịch bất kể giá. Một phần
chỉ mở khi điểm cao. Một phần dồn lại chờ những lần thật rẻ.

**Cách tính.**

Ngân sách tháng chia theo tỉ lệ mặc định **Base 50% · Smart 30% · Opportunity 20%**.

*Base* mua theo lịch cố định: ngày 3, 13, 23 với tỉ lệ 40% / 30% / 30% của phần Base. Không xét
điểm. Kỳ nào đã qua ngày mà chưa mua thì app ghi "đến hạn".

*Smart* mở theo Buy Score, tra bảng từ trên xuống:

| Điểm | Được mua |
|---|---|
| ≥ 75 | 100% phần Smart |
| ≥ 60 | 75% |
| ≥ 45 | 50% |
| ≥ 30 | 25% |
| dưới 30 | 0% |

*Opportunity* dè dặt hơn hẳn, và tiền không dùng thì dồn lại:

| Điểm | Được mua |
|---|---|
| ≥ 85 | 100% số dư quỹ |
| ≥ 75 | 50% |
| ≥ 65 | 25% |
| dưới 65 | 0% |

Số dư quỹ Opportunity = số tháng kể từ tháng bắt đầu × phần đóng góp mỗi tháng − những lần đã
mua bằng nguồn Opportunity, chặn ở mức tối đa 6 tháng đóng góp. Không có sổ riêng, app suy ra từ
dữ liệu gốc.

Nếu điểm cũ hơn 48 giờ, app **không mở** Smart và Opportunity, chỉ nhắc bấm Cập nhật. Điểm cũ
không được phép mở tiền.

**Kết quả đo.** **Chưa backtest.** Đây là cách chơi duy nhất trong tài liệu này chưa có số đo,
và đó là chủ ý: nó không phải một cược vào thị trường mà là một quy tắc kỷ luật chi tiêu. Mua
đều đặn thì lợi nhuận bằng lợi nhuận của tài sản, trừ đi phần chênh do mua rải rác.

**Đọc kết quả.** Giá trị của cách này không nằm ở tỉ lệ thắng mà ở hai chỗ: không bao giờ dồn
hết tiền vào một lần, và không cần đoán đáy. Trong năm 2022, đây là cách duy nhất trong tài liệu
này không phụ thuộc vào việc tín hiệu đúng hay sai.

---

## 3.2. Bắt dao rơi từng phần — 50% ngay, 30% nhịp 1, 20% nhịp 2

**Ý tưởng.** Khi một mã rớt sâu tới mức điểm ≥ 85, chia tiền làm ba: vào ngay một nửa, thêm 30%
khi có dấu hồi đầu tiên, 20% cuối khi có đủ hai dấu hồi.

**Cách tính.**

1. Sự kiện bắt đầu khi điểm vượt lên ≥ 85. Phải tụt xuống dưới 75 rồi mới tính lần mới.
2. Mua 50% vốn ở giá mở phiên sau.
3. Theo dõi 42 phiên. Phiên đầu có **≥ 1/3 dấu Hồi** gọi là nhịp 1 ⇒ mua thêm 30%.
4. Phiên đầu có **≥ 2/3 dấu Hồi** gọi là nhịp 2 ⇒ mua 20% còn lại.
5. Đánh giá tại phiên thứ 105 sau sự kiện, so với hai cách khác dùng cùng số tiền.

**Kết quả đo** — kho 5 năm, 362 sự kiện điểm ≥ 85, trong đó 239 sự kiện thuộc năm 2022:

| Cách dùng 100 đồng | Có lãi | Trung vị | 10% xấu nhất | Sụt tối đa trung vị | 2022: có lãi / sụt |
|---|---|---|---|---|---|
| Vào ngay 100% | 53,3% | +3,9% | −33% | −16,8% | 37,7% / −28,0% |
| Chờ đủ 2/3 dấu hồi rồi vào 100% | 55,2% | +3,0% | −29% | **−7,4%** | 42,3% / −13,6% |
| **50% ngay · 30% nhịp 1 · 20% nhịp 2** | 55,0% | +4,8% | −30% | −15,2% | 40,2% / −24,7% |

Các số phụ trợ, cùng kho:

- Nhịp 1 xuất hiện ở **100%** số sự kiện, trung vị sau 6 phiên. Nhịp 2 ở **94%**, trung vị 15 phiên.
- Từ lúc chạm 85 tới **đáy thật**: rớt thêm trung vị **−12%**, sau 4 phiên. Năm 2022 là −17,2%.
- Từ đáy lên **đỉnh cao nhất trong 126 phiên sau**: trung bình **+58%**, trung vị +49,5%, mất
  trung bình **73 phiên**. Con số này là **nhìn lại** — phải mua đúng đáy và bán đúng đỉnh.
- Nếu mua ở nhịp 2: đỉnh trong 63 phiên tiếp theo cao hơn giá mua trung vị **+19%**; sau 63 phiên
  có lãi **64%** số lần, trung vị +7,4%.

**Đọc kết quả.** Chia nhịp **không đổi được xác suất thắng** — cả ba cách đều quanh 53–55% toàn
kỳ và cùng tụt về ~40% trong 2022. Nó chỉ đổi **hình dạng** của cú lỗ. Cách 50/30/20 giữ gần hết
phần lên của việc vào ngay, nhưng vì một nửa tiền đã nằm trong cú rớt thêm −12% nên mức sụt gần
như không đỡ được. Chờ đủ 2/3 dấu hồi cắt sụt được một nửa nhưng bỏ lỡ phần bật từ đáy.

---

## 3.3. Kế hoạch chọn mã — luật vào "điểm ≥ 75"

**Ý tưởng.** Chọn mã điểm cao nhất, mua, giữ tới khi điểm về thấp rồi bán. Đây là luật đơn giản
nhất và là bản đầu tiên app mô phỏng.

**Cách tính.**

1. Danh mục tối đa **2 vị thế**, mỗi tháng mua tối đa **2 lệnh mới**, chia đều tiền cho chỗ trống.
2. Xét mua khi **điểm hôm nay ≥ 75**, qua được bộ lọc chất lượng ở mục 2.4.
3. Bán khi **điểm về ≤ X** (thử X = 65, 55, 25), sau khi đã qua T+2.
4. Bán bắt buộc nếu giữ quá hạn (thử 21, 42, 63 phiên).
5. Hai nhịp xét mua: **đầu tháng** (chỉ nhìn phiên đầu mỗi tháng) hoặc **từng phiên**.

**Kết quả đo.**

Kho 2,3 năm, xét đầu tháng — VN-Index cùng kỳ +42,7% / 12 tháng +9,1%:

| Ngưỡng bán | Lệnh | Thắng | Toàn kỳ | 12 tháng | Sụt tối đa |
|---|---|---|---|---|---|
| ≤ 65 | 15 | 53% | +19,2% | +27,6% | 25,6% |
| ≤ 25 | 8 | — | +42,2% | +25,2% | 22,3% |

Kho 2,3 năm, xét từng phiên: **32 lệnh, −18,4% toàn kỳ, sụt 32%.**

Kho 5 năm, xét từng phiên, giữ tối đa 42 phiên — VN-Index cùng kỳ +32,6%:

| Ngưỡng bán | Lệnh | Thắng | Toàn kỳ | 12 tháng | Sụt tối đa |
|---|---|---|---|---|---|
| ≤ 65 | 69 | 56,5% | **−60,5%** | −10,7% | **72,0%** |
| ≤ 25 | 41 | 48,8% | −44,6% | +13,1% | 68,0% |

**Đọc kết quả.** Luật này là **định nghĩa của bắt dao rơi**: mỗi lần điểm chạm 75 là mua, mà điểm
75 thường xuất hiện ở giữa đường xuống. Trên kho ngắn nó còn dương nhờ không có mùa gấu. Thêm
2022 vào thì mất 60% vốn. Xét đầu tháng ra ít lệnh hơn nên đỡ hơn, nhưng đó là may mắn về nhịp
chứ không phải lợi thế. **Đã loại.**

---

## 3.4. Kế hoạch chọn mã — luật vào "điểm + Hồi" — ĐANG DÙNG ĐỂ LỌC GỢI Ý

**Ý tưởng.** Vẫn chờ rẻ, nhưng không mua lúc đang rơi. Chờ tới khi giá có dấu hiệu ngừng rơi mới
vào.

**Cách tính.** Giống mục 3.3, chỉ đổi điều kiện vào. Một mã được mua khi **cả ba** đúng:

1. Đã chạm điểm ≥ 75 trong **21 phiên gần nhất**.
2. Điểm hôm nay vẫn còn **≥ 65**.
3. Cột Hồi đạt **≥ 2/3 dấu**.

Vì sao không đòi "điểm ≥ 75 và Hồi ≥ 2/3 cùng một phiên": giá hồi thì điểm tụt, nên hai điều kiện
đó gần như loại trừ nhau. Bản đầu viết như vậy và ra **0 lệnh** trong 2,3 năm. Cách viết hiện tại
là "đã từng rẻ, chưa hết rẻ, và đã ngừng rơi".

**Kết quả đo.**

Kho 2,3 năm, từng phiên, bán ≤ 65: **10 lệnh, thắng 90%, +14,6% toàn kỳ, 12 tháng +0,2%, sụt 5,2%.**
Đây là con số 90% từng được nhắc tới. Mẫu 10 lệnh.

Kho 5 năm, từng phiên — đây là bảng đầy đủ nhất trong tài liệu này:

| Hồi | Giữ tối đa | Bán khi ≤ | Lệnh | Thắng | Toàn kỳ | 12 tháng | Sụt tối đa | Giữ TB |
|---|---|---|---|---|---|---|---|---|
| 2/3 | 21 | 65 | 33 | 66,7% | +11,5% | +0,2% | 22,7% | 6,1 |
| **2/3** | **42** | **65** | **33** | **66,7%** | **+20,6%** | **+0,2%** | **22,7%** | **6,8** |
| 2/3 | 63 | 65 | 33 | 66,7% | +20,6% | +0,2% | 22,7% | 6,8 |
| 2/3 | 21 | 55 | 30 | 70,0% | +3,9% | −0,9% | 31,9% | 12,2 |
| 2/3 | 42 | 55 | 29 | **75,9%** | +45,4% | +3,7% | 31,9% | 14,2 |
| 2/3 | 63 | 55 | 29 | **75,9%** | **+51,2%** | **+7,8%** | 31,9% | 14,3 |
| 2/3 | 21 | 25 | 24 | 58,3% | −9,3% | −12,9% | 23,8% | 22,0 |
| 2/3 | 42 | 25 | 17 | 41,2% | −6,8% | −17,7% | 33,3% | 43,0 |
| 2/3 | 63 | 25 | 13 | 46,2% | +23,8% | −12,9% | 27,6% | 62,6 |
| 1/3 | 21 | 65 | 71 | 59,2% | −6,7% | −8,2% | **57,0%** | 7,8 |
| 1/3 | 42 | 65 | 70 | 61,4% | +29,7% | −11,0% | 44,9% | 7,9 |
| 1/3 | 21 | 55 | 66 | 72,7% | +11,3% | −10,3% | 48,7% | 11,4 |
| 1/3 | 42 | 55 | 61 | 75,4% | +9,5% | −8,5% | 52,4% | 13,4 |
| 1/3 | 63 | 55 | 57 | 75,4% | +45,9% | −0,4% | 47,2% | 14,4 |
| 1/3 | 42 | 25 | 34 | 50,0% | +31,8% | −2,2% | 44,3% | 40,1 |

Dòng in đậm là cấu hình app đang dùng. Tỉ lệ thắng theo năm của cấu hình đó: 2022 **8/12** ·
2023 **5/10** · 2024 **1/2** · 2025 **4/4** · 2026 **4/5**.

Ở mức sự kiện (chạm 75 rồi chờ dấu hồi trong 21 phiên, chưa tính phí):

| Chờ Hồi | Số sự kiện | Chờ trung vị | Dương sau 21 phiên | Sau 42 phiên | Sau 63 phiên |
|---|---|---|---|---|---|
| ≥ 2/3 | 60 | 16 phiên | 73,3% · +7,8% | **76,7% · +12,3%** | 63,3% · +12,1% |
| ≥ 1/3 | 301 | 7 phiên | 53,5% · +1,6% | 64,8% · +5,4% | 63,5% · +7,9% |

Kiểm định ngoài mẫu, chia đôi kỳ tại 05/02/2024 (nửa đầu VN-Index −13,7%, nửa sau +53,7%):

| Cấu hình | Nửa đầu | Nửa sau |
|---|---|---|
| Hồi 2/3 · giữ 42 · bán ≤ 65 | 22 lệnh, 59,1%, +8,9%, sụt 22,7% | 11 lệnh, 81,8%, +10,8%, sụt 5,9% |
| Hồi 2/3 · giữ 42 · bán ≤ 55 | 18 lệnh, 72,2%, +23,2%, sụt 31,9% | 11 lệnh, 81,8%, +18,1%, sụt 18,7% |
| Chọn theo nửa đầu (Hồi 1/3 · giữ 42 · bán ≤ 65, +27,4%) | | **+1,3%** khi VN-Index +53,7% |

**Đọc kết quả.**

- Mức thật của luật này trên 5 năm là **66–76% thắng**, không phải 90%. Khoảng **6 lệnh mỗi năm**.
- Hai cấu hình Hồi 2/3 là những cấu hình duy nhất **dương ở cả hai nửa kỳ** — kể cả nửa đầu có
  mùa gấu. Đây là điều mọi cách chơi khác không làm được.
- Đổi trần giữ **không thay đổi gì** với bán ≤ 65, vì lệnh tự thoát sau 6–8 phiên. Trần chỉ có ý
  nghĩa với ngưỡng bán thấp.
- Nới xuống Hồi 1/3 cho **gấp đôi số lệnh nhưng sụt gấp đôi** và 12 tháng gần đều âm. Không dùng.
- Bán ≤ 55 thắng nhiều nhất và lãi nhiều nhất, nhưng sụt 32% so với 23%, và phần vượt trội đến
  chủ yếu từ 2023. Chưa đủ để đổi mặc định.
- Ngay cả cấu hình tốt nhất vẫn **thua cầm VN-Index** ở nửa kỳ thị trường tăng (+18% so +54%).

---

## 3.5. Kế hoạch chọn mã — luật vào "theo kiểu rẻ"

**Ý tưởng.** Hoảng loạn hồi nhanh, nên vào ngay. Cấu trúc rớt dài, nên chờ dấu hồi. Một luật cho
mỗi nhãn.

**Cách tính.** Giống mục 3.4, chỉ đổi điều kiện vào theo nhãn kiểu rẻ ở mục 2.3:

- Nhãn **hoảng loạn** ⇒ vào ngay khi điểm ≥ 75, không cần dấu hồi.
- Nhãn **cấu trúc** hoặc **hỗn hợp** ⇒ đi theo đúng luật ở mục 3.4 (đã chạm 75 trong 21 phiên,
  còn ≥ 65, Hồi ≥ 2/3).

**Kết quả đo.**

Cơ sở của giả thuyết, kho 2,3 năm, ngưỡng 75, vào ngay:

| Kiểu rẻ | Sự kiện | Rớt thêm trung vị | Dương sau 63 phiên | Trung vị |
|---|---|---|---|---|
| Hoảng loạn | 42 | −6,7% | **90%** | **+24,4%** |
| Hỗn hợp | 102 | — | 75% | +9,0% |
| Cấu trúc | 91 | −9,9% | 57% | +2,5% |

Cùng phép đo trên kho 5 năm:

| Kiểu rẻ | Sự kiện | Dương sau 63 phiên | Trung vị | Rớt thêm | Riêng 2022 |
|---|---|---|---|---|---|
| Hoảng loạn | 57 | 73,7% | +15,5% | −6,8% | **11 sự kiện, 27,3% dương, −12,6%** |
| Hỗn hợp | 248 | 62,0% | +5,7% | −11,9% | 120 sự kiện, 50,0% |
| Cấu trúc | 358 | 60,4% | +4,3% | −10,2% | 191 sự kiện, 53,9% |

Kế hoạch dùng luật này, kho 2,3 năm, từng phiên: 15–16 lệnh, +4,9…6,0% toàn kỳ, 12 tháng
−1,2…−1,8%, sụt 21,6% — **kém hơn luật "điểm + Hồi"** trên cùng dữ liệu.

**Đọc kết quả.** Con số 90% của nhãn hoảng loạn gần như toàn bộ đến từ năm 2025 (34 trong 42 sự
kiện). Trên 5 năm còn 73,7%, và trong 2022 chỉ **3 trong 11 lần** có lãi. Phần "hoảng loạn vào
ngay" chính là phần kéo kết quả xuống. **Không nâng thành luật mặc định.**

---

## 3.6. Lưới chốt lời dần / cắt lỗ dần — 9 bộ, cổ phiếu

**Ý tưởng.** Không bán một lần. Chốt lời làm hai bậc, cắt lỗ làm hai bậc, và vào làm hai nhịp —
đúng tinh thần DCA nhưng áp cho một lệnh.

**Cách tính.**

Vào lệnh khi điểm ≥ ngưỡng (thử 55, 65, 75):

- **Nhịp 1**: mua 50% khối lượng dự định.
- **Nhịp 2**: 50% còn lại chỉ mua khi giá **rớt thêm 3%** mà điểm vẫn ≥ ngưỡng. Không vào nhịp 2
  cùng phiên với nhịp 1, và không vào sau khi đã bắt đầu thoát.
- Giá vốn là bình quân **theo tiền**, nên hai nhịp bằng tiền ở giá 100 và 97 cho giá vốn 98,48.

Ba thang chốt lời và cắt lỗ, tính trên giá vốn trung bình:

| Thang | Chốt lời bậc 1 | Bậc 2 | Cắt lỗ bậc 1 | Bậc 2 |
|---|---|---|---|---|
| L1 | +5% bán nửa | +10% bán hết | −3% bán nửa | −6% bán hết |
| L2 | +8% bán nửa | +15% bán hết | −4% bán nửa | −8% bán hết |
| L3 | +10% bán nửa | +20% bán hết | −5% bán nửa | −10% bán hết |

Thêm ba luật:

- **Hoà vốn sau chốt lời**: đã ăn bậc chốt lời đầu thì phần còn lại về giá vốn là bán.
- Mốc chốt lời và cắt lỗ soi theo **đáy và đỉnh trong phiên**, không chỉ giá đóng. Một phiên chạm
  cả hai thì tính **cắt lỗ trước** — không biết cái nào xảy ra trước thì chọn bất lợi.
- Hạn giữ 15 phiên. Không có cửa ra theo điểm.

Lưới = 3 ngưỡng vào × 3 thang = **9 bộ**, chạy cho từng mã rồi lấy trung bình.

**Kết quả đo** — kho 2,3 năm, 102 mã, mua giữ trung bình +15,9% toàn kỳ / −13,3% trong 12 tháng:

| | Bộ tốt nhất | Toàn kỳ | 12 tháng | Số mã có lãi | Số mã thắng cả hai kỳ |
|---|---|---|---|---|---|
| Kết quả | 75 / L3 | +4,5% | +0,6% | 64/100 | **28/100** |

Kiểm định ngoài mẫu: chọn bộ tốt nhất trên nửa đầu (55/L3, +4,0%) ⇒ nửa sau **−1,8%**, trong khi
mua giữ trung bình nửa sau −2,3% và bộ tốt nhất nửa sau là 75/L3 với +0,7%.

**Đọc kết quả.** Ngưỡng 75 gần như đứng ngoài thị trường (có lệnh khoảng 8% thời gian) nên năm
giảm thì giữ được vốn, nhưng cả kỳ thua xa việc chỉ cầm cổ phiếu. Ngưỡng 55 tệ nhất vì nhiều
lệnh nghĩa là nhiều phí cộng T+2. Tiêu chí đặt ra ban đầu là "thắng mua giữ ở cả hai kỳ trên ít
nhất 60% số mã" — kết quả 28/100. **Đã loại.**

---

## 3.7. Lưới 9 bộ cho coin, khung 4 giờ

**Ý tưởng.** Cùng thuật toán điểm, đổi nến ngày thành nến 4 giờ, thu hẹp mọi cửa sổ, giữ lệnh
3–14 ngày.

**Cách tính.** Cùng Buy Score nhưng đổi cấu hình: nến 4 giờ, cửa sổ 30 ngày thay 365 ngày, MA50
thay MA200, so với ETH/BTC 7 ngày thay 30 ngày. Tải 5.400 nến (khoảng 2,5 năm) bằng nhiều lượt
gọi lùi. Phí spot 0,1% mỗi chiều. Hạn giữ 84 nến = 14 ngày.

Hai phiên bản:

- **v1**: vào khi điểm ≥ ngưỡng, ra khi lãi ≥ chốt lời, lỗ ≥ cắt lỗ, **hoặc điểm ≤ 25**. Lưới
  3 ngưỡng × 3 cặp (chốt lời, cắt lỗ) = 9 bộ.
- **v2**: bỏ cửa ra theo điểm, dùng đúng cơ chế hai nhịp và hai bậc như mục 3.6.

**Kết quả đo.** v1: **thua mua giữ ở cả 9 bộ, cả ETH và BTC.** v2: cũng thua ở cả hai coin.

**Đọc kết quả.** Chẩn đoán lỗi của v1: cửa ra theo điểm bán đúng lúc sóng mới bắt đầu, vì giá hồi
thì điểm tụt. Sửa được lỗi đó (v2) vẫn không thắng, nghĩa là vấn đề không phải quy tắc thoát mà
là **không có lợi thế trong tín hiệu**. 72 lệnh với phí 0,2% mỗi vòng là khoảng 14% vốn trả cho
sàn. **Đã loại, UI đã gỡ khỏi app.**

---

## 3.8. Futures long/short 1x

**Ý tưởng.** Thị trường xuống thì bán khống ở chỗ đắt, thay vì chỉ mua ở chỗ rẻ.

**Cách tính.**

Điểm short **không có thuật toán mới**: lấy chính Buy Score chấm trên **nến đảo** (giá đóng thành
1 chia giá đóng, khối lượng giữ nguyên). Giảm từ đỉnh thành tăng từ đáy, RSI thành 100 trừ RSI,
percentile lật ngược, ETH/BTC thành BTC/ETH. Cùng ngưỡng, cùng trọng số.

Ba chế độ, cùng lưới 9 bộ:

| Chế độ | Luật | Phí |
|---|---|---|
| Spot | Chỉ mua | 0,1% mỗi chiều |
| L/S 1x | Mua khi điểm mua ≥ ngưỡng, bán khống khi điểm short ≥ ngưỡng | 0,05% + funding |
| Short 1x | Chỉ bán khống | 0,05% + funding |

Không mô phỏng đòn bẩy: nếu 1x không thắng thì đòn bẩy chỉ nhân số lỗ lên.

Mốc so sánh phải **theo chiều của chế độ**: spot so với mua giữ, chỉ short so với **bán khống rồi
giữ**, L/S so với chiều ôm tốt hơn.

**Kết quả đo.** Spot và L/S thua ở cả hai coin. Short 1x trên ETH cho +5,2% toàn kỳ và +15,4%
trong 12 tháng — nhưng **bán khống rồi giữ** cùng kỳ đã cho +20,6% và +46,2% trước funding. Sụt
tối đa 33,9%. Trên 54 bộ ứng viên chỉ **2 bộ** dương.

**Đọc kết quả.** Đây là ví dụ rõ nhất về việc chọn sai mốc so sánh. Bản đầu app khen Short 1x
"thắng ở cả hai kỳ" vì so với mua giữ. So đúng chiều thì chiến lược chỉ bắt được một phần nhỏ
của cú rớt mà chịu sụt 34%. Hai bộ dương trong 54 là mức của may rủi. **Đã loại.**

---

## 3.9. Hai giả thuyết đã thử và loại bỏ

### Cổng trạng thái thị trường

**Ý tưởng.** Chỉ mua khi VN-Index đang dưới MA200, hoặc khi độ rộng thị trường thấp — tức là chỉ
bắt dao rơi khi cả thị trường đang rẻ.

**Kết quả đo.** Trên kho 2,3 năm: sự kiện điểm ≥ 75 khi VN-Index dưới MA200 cho **88,7% dương**,
so với 50,7% khi trên MA200. Rất hứa hẹn.

Trên kho 5 năm: dưới MA200 còn **64,9%** (543 sự kiện), trên MA200 48,5%. **Riêng 2022: 52,6%
dương, rớt thêm trung vị −17,4%.** Độ rộng dưới 30% (55,6%) và VN-Index rớt hơn 20% từ đỉnh
(56,7%) cũng không cứu được.

**Đọc kết quả.** Con số 88,7% là **hình dạng của thị trường tăng có nhúng chữ V** (82 trong 162
sự kiện thuộc đợt tháng 4/2025, nhúng −18% rồi bật lại), không phải tính chất của cổng. **Đã
loại, không thêm vào app** — thêm vào sẽ tạo cảm giác an toàn giả.

### Thêm điểm cho mức giảm so với đỉnh lịch sử

**Ý tưởng.** Bổ sung thành phần thứ tám: rớt bao nhiêu so với đỉnh mọi thời đại, để phân biệt mã
rớt 40% từ đỉnh một năm nhưng đã rớt 80% từ đỉnh lịch sử.

**Kết quả đo.** Tương quan với thành phần "giảm từ đỉnh 1 năm" là **0,89**. Lượng thông tin thêm
gần bằng không. Ở những trường hợp hai chỉ số khác nhau, kết cục lại **xấu hơn**.

**Đọc kết quả.** Đỉnh lịch sử càng xa thì càng ít liên quan tới giá hôm nay. **Đã loại.**

---

# PHẦN 4 — BẢNG TỔNG HỢP, XẾP THEO TỈ LỆ THẮNG

Tất cả đo trên kho 5 năm, trừ dòng ghi rõ khác. Hai mốc để so: cầm VN-Index dương **62,3%**, mua
một mã bất kỳ dương **51,6%**.

| # | Cách chơi | Tỉ lệ thắng | Lệnh | Toàn kỳ | Sụt tối đa | 2022 | Trạng thái |
|---|---|---|---|---|---|---|---|
| 1 | Điểm + Hồi 2/3, bán ≤ 55, giữ 63 | **75,9%** | 29 | +51,2% | 31,9% | 5/8 | Ứng viên |
| 2 | Điểm + Hồi 1/3, bán ≤ 55 | 75,4% | 57 | +45,9% | 47,2% | 5/11 | Loại — sụt gấp đôi |
| 3 | Hoảng loạn vào ngay khi ≥ 75 | 73,7% | 57 sự kiện | — | — | **3/11** | Loại |
| 4 | **Điểm + Hồi 2/3, bán ≤ 65, giữ 42** | **66,7%** | 33 | +20,6% | 22,7% | 8/12 | **ĐANG DÙNG** |
| 5 | VN-Index dưới MA200 khi ≥ 75 | 64,9% | 543 sự kiện | — | — | 52,6% | Loại |
| 6 | Điểm ≥ 85, chờ Hồi 2/3 rồi vào | 55,2% | 341 | — | 7,4% | 42,3% | Tham khảo |
| 7 | Điểm ≥ 85, DCA 50/30/20 | 55,0% | 362 | — | 15,2% | 40,2% | Tham khảo |
| 8 | Điểm ≥ 75 vào ngay (bắt dao rơi) | 56,5% | 69 | **−60,5%** | 72,0% | 8/14 | Loại |
| 9 | Lưới 9 bộ cổ phiếu (kho 2,3 năm) | 74% | 2,9/mã | +4,5% | — | — | Loại |
| 10 | Lưới coin H4 v1, v2 (2,5 năm) | — | — | thua mua giữ | — | — | Loại |
| 11 | Futures L/S và Short 1x (2,5 năm) | — | — | thua ôm một chiều | 33,9% | — | Loại |
| 12 | DCA theo lịch Base/Smart/Opp | chưa đo | — | — | — | — | **ĐANG DÙNG THẬT** |

Cột "2022" là số lệnh thắng trên số lệnh trong năm đó, hoặc tỉ lệ dương của sự kiện. Đây là cột
quan trọng nhất: nó cho thấy mọi cách chơi đều tụt trong mùa gấu.

---

# PHẦN 5 — PHƯƠNG ÁN ĐANG CHỌN

## 5.1. Coin — mua tích luỹ theo lịch, không trade

**Chọn:** DCA Base 50% / Smart 30% / Opportunity 20%, bảng mở khoá ở mục 3.1.

**Vì sao:** cả ba bản backtest coin (spot, long/short, chỉ short) đều thua việc cứ cầm coin, ở cả
ETH và BTC. Không có tín hiệu nào đáng đặt tiền vào.

**Thao tác trong app:** tab **DCA** → bấm Cập nhật để lấy giá và điểm mới → card "Tháng này" cho
biết Base kỳ nào đến hạn, Smart mở bao nhiêu, Opportunity mở bao nhiêu → nút **Mua nhanh** ghi
lệnh. Nếu điểm cũ hơn 48 giờ, Smart và Opportunity không mở.

## 5.2. Cổ phiếu — bộ lọc Gợi ý, mỗi tháng tối đa 2 mã

**Chọn:** kế hoạch chọn mã với luật vào "điểm + Hồi", tham số chính xác:

| Tham số | Giá trị |
|---|---|
| Điểm tối thiểu | 75 |
| Điều kiện thứ hai | Hồi ≥ 2/3 dấu |
| Cửa sổ nhớ "đã từng rẻ" | 21 phiên, điểm hôm nay còn ≥ 65 |
| Số vị thế tối đa | 2 |
| Số lệnh mua mới mỗi tháng | 2 |
| Bán khi điểm về | ≤ 65 |
| Hạn giữ tối đa | 42 phiên |
| Chờ tối thiểu trước khi bán | 2 phiên (T+2) |
| Loại nếu rớt từ đỉnh 1 năm hơn | 65% |

**Vì sao chọn cấu hình này thay vì cấu hình thắng nhiều hơn (bán ≤ 55, 75,9%):** cấu hình đang
dùng sụt tối đa 22,7% so với 31,9%, và phần lãi vượt trội của cấu hình kia đến chủ yếu từ một năm
(2023). Cả hai đều dương ở hai nửa kỳ. Giữ cấu hình sụt nhỏ hơn cho tới khi có thêm dữ liệu.

**Thao tác trong app:** tab **Trading** → bộ chọn **Gợi ý** (mặc định khi mở tab) → cột Hồi cho
biết mã nào đã ngừng rơi → nhãn *mua* hoặc *theo dõi* cạnh mã. Tab **Chứng khoán** → card "Tháng
này" nói cùng một điều theo cách ngắn hơn: mua mới mã nào, đang giữ mã nào, mã nào đã về ≤ 65 nên
bán.

## 5.3. Ghi lệnh — luôn bằng tay

Không có gì tự động. Nút **Mua / Bán** ghi một Chuyển đổi tài sản, và số dư, tài sản ròng, danh
mục, sổ lệnh tự cập nhật theo. Phí và thuế **không tự trừ** — con số trong app là giá khớp, không
phải số tiền cuối cùng trên tài khoản.

Ba luật vốn app cảnh báo nhưng không chặn:

- Đang mở từ 2 vị thế trở lên.
- Tháng này đã chốt lỗ từ 10% vốn trade trở lên.
- Mua vượt số dư khoản tiền đang chọn — cái này **chặn**.

## 5.4. Hai phương án đang nghiên cứu — A và B (chốt 18/09)

Owner chốt **chỉ giữ lại hai phương án** để theo dõi tiếp, mọi cách chơi khác trong Phần 3 vẫn tính
nhưng **gấp lại** trong popup Backtest (mục "Các bảng nghiên cứu khác — đang gấp") để bớt số liệu thừa.
Cả hai dùng **cùng luật vào** là mục 3.4 (đã chạm 75 trong 21 phiên, hôm nay còn ≥ 65, Hồi ≥ 2/3,
soi từng phiên, tối đa 2 vị thế và 2 lệnh mua mới mỗi tháng), **chỉ khác ngưỡng bán và hạn giữ**:

| Phương án | Bán khi điểm ≤ | Giữ tối đa | Kho 5 năm (08/07/2021 → 17/09/2026, VN-Index +32,6%) | Kho 2,3 năm (21/05/2024 → 17/09/2026, VN-Index +42,7%) |
|---|---|---|---|---|
| **A** (mặc định) | 65 | 42 phiên | 33 lệnh · thắng **66,7%** · +20,6% · 12 th +0,2% · sụt 22,7% | 10 lệnh · 90% · +14,6% · 12 th +0,2% · sụt 5,2% |
| **B** | 55 | 63 phiên | 29 lệnh · thắng **75,9%** · +51,2% · 12 th +7,8% · sụt **31,9%** | 10 lệnh · 80% · +22% · 12 th +7,8% · sụt 15,4% |

Đọc cạnh nhau: B thắng nhiều hơn và lãi hơn nhưng **sụt sâu hơn gần gấp rưỡi** (31,9% so 22,7%);
trên kho 5 năm B là bộ duy nhất thắng VN-Index toàn kỳ, nhưng ở nửa kỳ thị trường tăng (VN-Index
+53,7%) nó chỉ +18,1%. Chưa đủ để chọn một bỏ một — vì thế mới giữ cả hai để chạy **sổ lệnh giả**
(mục 5.6) song song.

Bộ chọn **A / B** nằm trên card xếp hạng của tab Trading (hàng ngay dưới bộ chọn danh sách). Đổi
phương án **không đổi danh sách Gợi ý** (luật vào chung), chỉ đổi ba chỗ: card "Tháng này" ở tab
Chứng khoán (ngưỡng bán và hạn giữ của mã đang giữ), chip ngưỡng bán trong popup Tính PnL, và sổ
lệnh giả đang hiện.

Popup Backtest cho mỗi phương án **hai dòng**: dòng chuẩn hoá (vốn 1, không lô) và dòng "tài khoản"
(vốn 30.000k, lô 100, dừng mở lệnh mới khi đường vốn sụt ≥ 15% từ đỉnh, mở lại khi còn ≤ 7,5%) —
dòng sau gần cách chơi thật hơn. Kho 17/09: dòng tài khoản của A +14% · +0,3% · sụt 4,7%; của B
+21% · +7,5% · sụt 13,7% — sát dòng chuẩn hoá, tức làm tròn lô và dừng mua chưa đổi kết luận.

**Chia đôi kỳ một lần** (kho 17/09, cắt 19/07/2025): A nửa đầu +14,4% · nửa sau **+0,2%**; B nửa
đầu +13,2% · nửa sau **+7,8%**; VN-Index nửa sau **+22,7%**. Cả hai đều dương nhưng thua xa chỉ
số ở nửa thị trường tăng — đúng tính chất "giữ vốn khi xuống, không thắng khi lên" đã thấy ở 5 năm.

Luật vào của bộ Gợi ý (`SCREEN_V1.entryRule`) đã đổi từ `kind` về **`confirm`** cùng lúc — chỗ
chưa khớp ghi ở bản trước của mục này đã đóng. Luật "theo kiểu rẻ" (mục 3.5) vẫn tính được trong
bảng gấp, không còn là lựa chọn trên giao diện.

## 5.6. Sổ lệnh giả — chạy hai phương án bằng thời gian thật

Card Buy Score của tab Trading có bảng **Sổ lệnh giả** (thay chỗ bảng Phân rã điểm cũ; phân rã giờ
hiện khi di chuột hoặc chạm vào ô Buy Score). Mỗi thị trường × mỗi phương án là một sổ riêng, vốn
ban đầu = "vốn dành cho trade" trong Cài đặt (không có thì 30.000k; coin quy USD theo tỷ giá USDT).

Sổ chạy **đúng luật của phương án** mỗi lần bấm Cập nhật, không có tiến trình nền:

1. Tín hiệu mua lấy từ chính bộ Gợi ý (nhóm MUA) ở **nến cuối** của kho, tối đa 2 vị thế và 2 lệnh
   mua mới mỗi tháng, không mua mã đang giữ thật. Lệnh khớp ở **giá mở phiên đầu tiên sau** tín hiệu
   có trong kho; mở cửa sát trần thì bỏ lệnh. Tiền chia đều cho chỗ trống, làm tròn lô 100 (coin
   số lẻ), phí như Backtest.
2. Bán khi điểm ≤ ngưỡng của phương án **sau T+2** hoặc đã giữ ≥ hạn; khớp ở giá mở phiên sau; mở
   cửa sát sàn thì dời sang phiên sau.
3. Đường vốn sụt ≥ 15% từ đỉnh thì **không mở lệnh mới** tới khi sụt còn ≤ 7,5%.
4. Chỉ xử lý nến mới hơn lần chạy trước, nên bấm Cập nhật nhiều lần một ngày không nhân đôi. Ngày
   không mở app thì tín hiệu mua ngày đó bị bỏ qua (bán vẫn được xét đủ vì chuỗi điểm của mã đang
   giữ được chấm lại cho mọi phiên đã trôi) — sổ này đo "nếu mở app đều" chứ không đo máy chạy 24/7.

Nút **Đóng** trên mỗi vị thế bán tay ở giá hiện tại (ghi lý do "tay"). Cài đặt → Nâng cao có nút
**Xoá sổ lệnh giả** để bắt đầu lại. Ngày 18/09 cả hai sổ đều trống vì bộ Gợi ý ra 0 mua.

## 5.5. Quy trình hằng tháng

| Khi nào | Làm gì |
|---|---|
| Đầu tháng | Tab DCA, bấm Cập nhật, đọc card "Tháng này", mua phần Base đến hạn |
| Hằng ngày hoặc vài ngày | Tab Trading, bộ Gợi ý. Có mã nhãn *mua* thì xét. Không có thì không làm gì |
| Khi mua | Nút Mua / Bán, ghi đúng giá khớp thật |
| Khi một mã đang giữ về ngưỡng bán của phương án (A: ≤ 65 · B: ≤ 55) hoặc hết hạn giữ | Theo luật thì bán. App nhắc ở card "Tháng này" và sổ lệnh giả tự bán |
| Cuối tháng | Bấm Chốt tháng một lần để có mốc so sánh cho Phân rã tăng trưởng |
| Khi kho dữ liệu cũ | Vào GitHub Actions, bấm Run workflow cho "Cào giá VN100" |

Điều quan trọng nhất trong quy trình: **không có mã nào đủ điều kiện thì không mua gì.** Ngày
17/09 bộ Gợi ý ra **0 mua và 20 theo dõi**. Đó là một kết quả hợp lệ, không phải lỗi.

---

# PHẦN 6 — BẢY CẠM BẪY KHI ĐỌC NHỮNG CON SỐ TRÊN

**Một — mẫu nhỏ.** 10 lệnh thắng 9 thì tỉ lệ là 90%, nhưng đổi một lệnh thành lỗ là 80%. Dưới 30
lệnh thì tỉ lệ thắng gần như không nói được gì. Mọi con số trên 80% trong tài liệu này đều dưới
15 lệnh hoặc dưới 45 sự kiện.

**Hai — chọn và chấm trên cùng dữ liệu.** Chọn ra bộ tốt nhất trong 9 bộ rồi khoe kết quả của
đúng bộ đó là ra đề rồi tự chấm bài mình. Bảng kiểm định ngoài mẫu tồn tại để đo phần lạc quan
đó, và lần nào nó cũng cho thấy khoảng cách lớn.

**Ba — rổ mã theo hôm nay.** Cả 102 mã trong kho là danh sách VN100 **hiện tại**. Những mã rớt
năm 2022 rồi không hồi đã rời rổ, không còn trong phép đo. Mọi kết quả vì thế đẹp hơn thật, và
không có cách sửa vì không có nguồn thành phần rổ theo từng thời điểm.

**Bốn — một quãng thị trường không phải một quy luật.** Cùng một luật cho 4/4 lệnh thắng trong
2025 và 3/5 trong 2026. Tỉ lệ thắng đang phản ánh **năm nào** nhiều hơn **luật nào**.

**Năm — nhìn lại không phải giao dịch được.** "Từ đáy lên đỉnh trung bình +58%" đòi mua đúng đáy
và bán đúng đỉnh. Phần giao dịch được của cùng dữ liệu đó là +19% trung vị, và không biết lúc nào.

**Sáu — tỉ lệ thắng không phải lợi nhuận.** Cấu hình thắng 75,9% lãi +51% với mức sụt 32%. Cấu
hình thắng 66,7% lãi +20,6% với mức sụt 22,7%. Cả hai đều thua cầm VN-Index ở nửa kỳ thị trường
tăng. Tỉ lệ thắng cao mà mỗi lần thua thì thua đậm là một cách mất tiền chậm.

---

**7. Ba chữ dễ đọc nhầm (reaudit R09).** *"Rớt thêm"* trong bảng sự kiện là giá đóng thấp nhất
trong 63 phiên **so với giá vào**, không phải "sụt tối đa" của đường vốn (đo từ đỉnh đường vốn, có
thể xảy ra sau khi đã có lãi). *"Điểm short = 100 − điểm mua"* là cách nói gần đúng: điểm short chấm
trên nến đảo 1/giá, nên RSI thành 100 − RSI đúng, nhưng phần trăm giảm-từ-đỉnh và lệch MA không
đối xứng hoàn toàn. *Funding 0,01%/8 giờ trả ở cả hai chiều* là giả định cố ý bất lợi, thực tế bên
này trả thì bên kia nhận. Và "kiểm định ngoài mẫu" trong app là **một lần chia đôi kỳ**, không phải
walk-forward cuốn nhiều cửa sổ — một phép thử, không phải bằng chứng.

---

# PHẦN 7 — NHẬT KÝ CÁC LẦN ĐO

| Ngày | Đo gì | Kết luận |
|---|---|---|
| 17/09 | Lưới 9 bộ coin H4 v1 | Thua mua giữ ở cả 9 bộ, hai coin |
| 17/09 | v2 — hai nhịp, hai bậc, 2,5 năm | Vẫn thua cả hai coin |
| 17/09 | v3 — Futures long/short 1x | Thua khi so đúng chiều; sửa mốc so sánh |
| 17/09 | Lưới 9 bộ cổ phiếu, 102 mã | Bộ tốt nhất +4,5%, 28/100 mã thắng cả hai kỳ |
| 17/09 | Kế hoạch chọn mã, luật điểm | Đầu tháng +19,2%; từng phiên −18,4% |
| 17/09 | Nghiên cứu sự kiện, cột Hồi | Chờ hồi: rớt thêm từ −7,3% về 0,0%, mẫu 235 → 23 |
| 17/09 | Nhãn kiểu rẻ | Hoảng loạn 90% dương, cấu trúc 57% — mẫu một quãng tăng |
| 17/09 | Ba luật vào so với nhau | Luật kiểu rẻ không hơn luật điểm + Hồi |
| 17/09 | Chia đôi kỳ một lần (kiểm định ngoài mẫu đơn giản) | Luật chọn trên nửa đầu lỗ 17,7% ở nửa sau |
| 18/09 | Cào lịch sử về 2020, đo lại theo năm | Cổng trạng thái thị trường không giữ được qua 2022 |
| 18/09 | Đáy → đỉnh và DCA 50/30/20 khi ≥ 85 | Chia nhịp không đổi xác suất, chỉ đổi hình dạng lỗ |
| 18/09 | Chạy lại điểm + Hồi trên 5 năm | 66,7% thắng, không phải 90%. Hồi 1/3 không tốt hơn |
| 18/09 | Reaudit: engine khớp lại (t−1, T+2 theo lô, không ép bán cuối, lô/dừng sụt) và đo lại A/B trên kho 17/09 | A 10 lệnh 90% +14,6% sụt 5,2% · B 10 lệnh 80% +22% sụt 15,4%; chia đôi kỳ A +0,2% · B +7,8% so VN-Index +22,7% |

Mọi phép đo dùng đúng các hàm mà app dùng để hiện gợi ý, không viết lại công thức riêng. Nếu một
ngưỡng trong app đổi, các con số này phải đo lại.
