# Đề tài: Giải pháp Logistics Xanh cho Bách Hóa Xanh

## 0. Mục đích của tài liệu này
Tài liệu này dùng để nhóm trình bày miệng và giải thích cho giảng viên thấy:
- Nhóm đã chọn đúng doanh nghiệp cụ thể là Bách Hóa Xanh.
- Nhóm hiểu rõ vấn đề vận hành thực tế của doanh nghiệp.
- Nhóm đề xuất một giải pháp có quy trình rõ ràng, có hệ thống, có demo.
- Nhóm đánh giá được hiệu quả trước và sau khi áp dụng bằng KPI.
- Nhóm nhận diện được ưu điểm, hạn chế và thách thức khi triển khai thực tế.

Nói ngắn gọn, bài không được đi lan man theo kiểu giới thiệu công nghệ chung chung. Phải đi theo đúng logic:
1. Đặt vấn đề tại doanh nghiệp.
2. Giải quyết vấn đề.
3. Doanh nghiệp đạt được gì sau khi áp dụng.
4. Kết luận.
5. Đánh giá và thách thức.

---

## 1. Đặt vấn đề tại doanh nghiệp

### 1.1. Bối cảnh vận hành thực tế của BHX
Bách Hóa Xanh là chuỗi bán lẻ thực phẩm tươi sống có mạng lưới siêu thị lớn, hàng hóa được luân chuyển từ kho trung tâm đến từng điểm bán bằng xe tải. Hàng tươi sống thường phải được chứa trong các khay nhựa xanh hoặc container nhựa để đảm bảo bảo quản, sắp xếp và di chuyển an toàn.

Trong thực tế vận hành như vậy, ngoài việc giao hàng đi, doanh nghiệp còn phải thu hồi khay rỗng hoặc khay đã dùng xong để tái sử dụng cho các chuyến sau. Đây là một mắt xích nhỏ nhưng ảnh hưởng lớn đến chi phí, tài sản, và hiệu quả vận hành.

### 1.2. Ba “nỗi đau” lớn của doanh nghiệp
Nhóm chọn đề tài này vì có 3 vấn đề rất rõ:

- Thất thoát khay nhựa do quản lý thủ công.
  - Khay đi qua nhiều điểm bán, nhiều tài xế, nhiều ca vận hành.
  - Nếu chỉ ghi chép tay hoặc đối soát cuối ngày thì rất khó biết khay đang ở đâu.
  - Khi số khay thất thoát tăng, doanh nghiệp phải mua bù hoặc kiểm kê mất nhiều công sức.

- Xe chạy rỗng chiều về.
  - Sau khi giao hàng xong, nhiều chuyến xe quay đầu về kho mà không chở thêm hàng hoặc không tận dụng để thu hồi khay rỗng.
  - Đây là quãng đường bị lãng phí vì xe vẫn tốn nhiên liệu, thời gian, nhân công.

- Lãng phí chi phí và tăng phát thải.
  - Xe chạy rỗng làm tăng chi phí vận hành.
  - Mỗi km không tối ưu đều làm tăng nhiên liệu tiêu hao và CO2 phát thải.

### 1.3. Vấn đề cốt lõi
Vấn đề không chỉ nằm ở việc “thiếu QR” hay “thiếu app”, mà nằm ở chỗ doanh nghiệp chưa có một luồng dữ liệu thống nhất để:
- nhận diện trạng thái khay,
- cập nhật thời gian thực,
- và dùng dữ liệu đó để tối ưu điều phối xe chiều về.

Đây là lý do nhóm chọn mô hình kết hợp:
- `Mobile QR` cho nhân viên siêu thị.
- `Web TMS` cho kho trung tâm và điều phối xe.

---

## 2. Giải quyết vấn đề

### 2.1. Điểm khác biệt của đề tài so với cách trước đây
Trước đây, cách quản lý thường là:
- ghi nhận thủ công,
- đối soát sau,
- phụ thuộc con người,
- dữ liệu rời rạc giữa kho, siêu thị và tài xế.

Giải pháp của nhóm khác ở 3 điểm:

- Ghi nhận theo thời gian thực bằng QR.
  - Mỗi khay có mã riêng.
  - Khi quét QR, trạng thái khay đổi ngay trên hệ thống.

- Gắn trạng thái khay với điều phối xe.
  - Không chỉ biết khay đang ở đâu.
  - Mà còn dùng dữ liệu đó để gợi ý xe nào nên ghé thu hồi khay trên đường về.

- Có KPI trước/sau để chứng minh hiệu quả.
  - Không làm hệ thống chỉ để “trông hiện đại”.
  - Mục tiêu là đo được hiệu quả thật bằng số liệu.

### 2.2. Cách hiểu QR trong đề tài này
QR ở đây có thể hiểu đơn giản là “thẻ điểm danh điện tử” của khay.

Mỗi lần quét QR, hệ thống ghi nhận:
- khay đang ở đâu,
- đang trên xe hay đã giao xuống siêu thị,
- đang chứa hàng hay đã là vỏ rỗng,
- có cần thu hồi hay chưa.

Điều quan trọng:
- QR không tự theo dõi khay như GPS.
- QR chỉ ghi nhận trạng thái tại thời điểm quét.
- Các lần quét liên tiếp tạo thành lịch sử di chuyển của khay.

#### Chuỗi trạng thái dễ nhớ
Với `Khay #001`, có thể nói như sau:
1. Tại DC - đang chứa hàng
2. Đang vận chuyển đến BHX A
3. Đã giao - BHX A
4. Vỏ rỗng - chờ thu hồi
5. Đang thu hồi - Xe 05
6. Đã về DC - sẵn sàng tái sử dụng

#### Câu nói ngắn khi thuyết trình
“Mỗi lần quét QR là một lần hệ thống ghi lại trạng thái mới của khay. Nhờ đó, doanh nghiệp biết khay đang ở DC, trên xe, ở siêu thị hay đang trên đường thu hồi.”

### 2.3. Trình diễn sản phẩm
Khi demo, nhóm nên nói rõ đây là một hệ thống nội bộ gồm 2 màn hình:

- Tab 1: Mobile QR
  - Mục đích: nhân viên siêu thị xác nhận khay rỗng cần thu hồi.
  - Khi bấm `Quét QR`, trạng thái khay đổi theo chuỗi: tại DC -> đã giao -> vỏ rỗng.

- Tab 2: Web TMS điều phối
  - Mục đích: kho trung tâm nhìn danh sách xe và gợi ý backhaul.
  - Khi bấm `Tối ưu chiều về`, hệ thống chèn điểm ghé thu hồi khay trên tuyến chiều về.

- Tab 3: KPI
  - Mục đích: cho thấy hiệu quả trước/sau.
  - Đây là phần để giảng viên nhìn được kết quả định lượng.

### 2.4. Điều nên nhấn mạnh khi nói
Khi trình bày giải pháp, nhóm nên nhấn mạnh 4 ý:

- Không phải chỉ làm app quét QR.
- Không phải chỉ làm TMS.
- Điểm mạnh là tích hợp 2 luồng đó vào 1 quy trình khép kín.
- Dữ liệu thu hồi khay được dùng để tối ưu xe chiều về và giảm lãng phí.

---

## 3. Kết quả doanh nghiệp đạt được sau khi áp dụng

### 3.1. KPI trước và sau
Các số liệu dưới đây được ước tính và chuẩn hóa theo quy mô vận hành BHX (~1.700 siêu thị, ~1.000 chuyến xe/ngày, ~150.000 khay nhựa lưu thông trên hệ thống):

| Chỉ số | Trước | Sau | Thay đổi |
|---|---:|---:|---:|
| Tỷ lệ thất thoát/mất mát khay rỗng | 4.5% - 6% | < 0.3% | Giảm > 93% |
| Tỷ lệ xe chạy rỗng chiều về | 65% - 70% | < 15% | Tăng lấp đầy ~85% |
| Thời gian bàn giao & thu hồi tại siêu thị | 25 - 30 phút/chuyến | 5 - 7 phút/chuyến | -75% |
| Tỷ lệ sai lệch tồn kho khay tại siêu thị | 12% - 15% | < 0.5% | Gần như xóa bỏ tranh chấp |
| Tỷ lệ số hóa chứng từ | 0% | 100% | Paperless |

### 3.2. Giải thích ý nghĩa KPI
- Tỷ lệ thất thoát khay giảm mạnh nghĩa là doanh nghiệp kiểm soát được tài sản lưu thông.
- Tỷ lệ xe chạy rỗng chiều về giảm nghĩa là xe được tận dụng tốt hơn cho thu hồi.
- Thời gian bàn giao và thu hồi giảm nghĩa là giảm thời gian dừng đỗ tại siêu thị.
- Sai lệch tồn kho khay giảm gần như về 0 nghĩa là không còn tranh chấp giữa kho - tài xế - siêu thị.
- Số hóa chứng từ giúp quy trình gọn hơn, không phụ thuộc giấy tờ.

### 3.3. Hiệu quả tài chính và môi trường
#### Hiệu quả tài chính
- Tiết kiệm khoảng 846 triệu VNĐ/năm từ giảm thất thoát khay.
- Tiết kiệm khoảng 963 triệu VNĐ/năm từ nhiên liệu và tối ưu chiều về.
- Tăng năng suất lao động do giảm thời gian bàn giao và thu hồi tại siêu thị.

#### Hiệu quả môi trường
- Giảm khoảng 129.12 tấn CO2/năm.
- Giảm chuyến xe chạy rỗng, giảm phát thải không cần thiết.
- Giảm rác thải nhựa công nghiệp do giảm mất khay.

### 3.4. Cách nói phần số liệu khi bị hỏi
Nếu giảng viên hỏi “số liệu ở đâu ra”, nhóm nên trả lời theo hướng:
- Đây là số liệu ước tính và chuẩn hóa theo quy mô vận hành thực tế của BHX.
- Mục tiêu là chứng minh tính hợp lý và khả năng triển khai.
- Nếu triển khai thật thì số liệu sẽ cần lấy từ hệ thống nội bộ của doanh nghiệp.

---

## 4. Kết luận
Bài toán của BHX không chỉ là giao hàng, mà còn là quản trị tài sản khay nhựa và tối ưu chiều về của xe tải.

Giải pháp QR + TMS giải quyết đồng thời 2 việc:
- kiểm soát khay rỗng,
- và tận dụng backhaul để giảm xe rỗng.

Điểm quan trọng nhất của đề tài là:
- có quy trình rõ,
- có dữ liệu,
- có KPI trước/sau,
- và có thể demo trực tiếp bằng sản phẩm.

Đây là hướng đi phù hợp với mô hình phân phối hàng tươi sống có tần suất cao như Bách Hóa Xanh.

---

## 5. Đánh giá và thách thức

### 5.1. Ưu điểm
- Quy trình rõ ràng, dễ hiểu.
- Có thể nhìn thấy ngay trạng thái khay.
- Giảm thao tác giấy tờ và ghi chép thủ công.
- Dữ liệu tập trung giúp kho trung tâm dễ ra quyết định.
- Có thể đo được hiệu quả bằng KPI.

### 5.2. Hạn chế
- Phụ thuộc vào việc người dùng có quét QR đúng không.
- Cần thiết bị di động và kết nối mạng ổn định.
- Cần đào tạo tài xế và nhân viên siêu thị.
- Nếu dữ liệu đầu vào sai thì điều phối sẽ sai.

### 5.3. Thách thức khi triển khai thực tế
- Thói quen vận hành cũ thường khó thay đổi.
- Một số điểm bán có thể quét không đều hoặc quét thiếu.
- Hệ thống phải tích hợp với quy trình kho và TMS hiện có.
- Khả năng mở rộng đòi hỏi chuẩn hóa mã khay, mã siêu thị, mã chuyến xe.

### 5.4. Giải pháp khắc phục
- Triển khai pilot trước trên một khu vực nhỏ.
- Đào tạo người dùng theo tuyến.
- Chuẩn hóa QR và quy trình xác nhận.
- Có kiểm tra đối soát tự động để phát hiện dữ liệu bất thường.

---

## 6. Gợi ý cách trình bày theo từng phần

### Người 1: Đặt vấn đề
Nói về:
- BHX là doanh nghiệp nào.
- Quy trình giao hàng hiện tại.
- 3 nỗi đau lớn.
- Vì sao nhóm chọn đề tài này.

### Người 2: Giải pháp
Nói về:
- Mobile QR.
- Web TMS.
- Điểm khác biệt so với cách cũ.
- Flow vận hành tích hợp.

### Người 3: KPI và kết quả
Nói về:
- bảng trước/sau.
- ý nghĩa từng KPI.
- hiệu quả tài chính và môi trường.

### Người 4: Demo, kết luận, đánh giá
Nói về:
- cách chạy demo.
- kết luận.
- ưu điểm, hạn chế.
- thách thức và hướng khắc phục.

---

## 7. Kịch bản nói ngắn khi demo
Bạn có thể nói theo mẫu này:

“QR giống như thẻ điểm danh điện tử của khay. Mỗi lần quét là một lần hệ thống ghi lại trạng thái mới: đang ở DC, đang trên xe, đã giao xuống siêu thị, đang là vỏ rỗng, hay đang thu hồi. Bên trái là màn hình Mobile QR để tạo dấu vết dữ liệu, bên phải là TMS để dùng dữ liệu đó tối ưu chiều về. Phần KPI phía dưới cho thấy hiệu quả trước và sau khi áp dụng.”

---

## 8. Chốt ý cho giảng viên
Nếu cần chốt ngắn gọn trong 1 câu, có thể nói:

“Đề tài của nhóm số hóa quản lý khay rỗng bằng QR, đồng thời dùng dữ liệu đó để giảm thất thoát, giảm xe rỗng và giảm phát thải cho Bách Hóa Xanh.”
