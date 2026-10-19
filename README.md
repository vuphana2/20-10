# Pixel 20/10 — bản thử 2

## Chạy thử
1. Giải nén ZIP.
2. Mở thư mục bằng VS Code.
3. Mở `index.html` bằng Live Server.

## Bản 2 đã sửa
- Nyan Cat: dùng GIF nguyên tác được nhúng từ `nyan.cat`. Cần Internet; nếu nguồn ảnh không tải được sẽ hiện hình thay thế CSS.
- Mèo hướng dẫn: dùng meme mèo cầm hoa hồng; nếu ảnh ngoài không tải được sẽ có emoji dự phòng.
- Hướng dẫn lần lượt: “Hãy nhập tên của bạn” → sau khi nhập tên: “Hãy chọn giới tính của bạn” → sau khi chọn giới tính: “Hãy click vào ô dưới nhé”.
- Font: chuyển sang Pixelify Sans cho chữ tiếng Việt dễ đọc hơn, kết hợp Silkscreen cho tiêu đề/nút.
- Bộ đếm: localStorage đếm số lần mở trang trên cùng trình duyệt/thiết bị.

## Quan trọng về bộ đếm
Bộ đếm hiện tại KHÔNG phải số lượt truy cập toàn cầu. GitHub Pages chỉ host trang tĩnh; localStorage chỉ đếm trên trình duyệt hiện tại. Muốn đếm tất cả khách trên website, hoặc lưu tên/giới tính/IP để chủ website xem riêng, cần thêm backend/database hoặc dịch vụ analytics. Không nên thu thập IP âm thầm; hãy thông báo và chỉ lưu dữ liệu cần thiết.
