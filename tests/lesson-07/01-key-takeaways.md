# 1. Authentication T-OTP
## Authentication TOTP:
### TOTP là gì? 
- TOTP (Time-based One-Time Password) là một thuật toán tạo mật khẩu một lần dựa trên thời gian, thường được sử dụng trong xác thực hai yếu tố (2FA)
- TOTP hoạt động theo cách sau: 
    -  Tạo ra một mã số (thường là 6 chữ số) thay đổi theo chu kỳ thời gian cố định (thường là 30 giây)
    -  Dựa trên một khóa bí mật (secret key) được chia sẻ giữa server và client
    -  Sử dụng thuật toán HMAC-SHA1 kết hợp với timestamp hiện tại
    -  Phổ biến trong các ứng dụng như Google Authenticator, Microsoft Authenticator, Authy

### Các thành phần chính TOTP:
- Shared Secret:
    - Đây là một chuỗi ký tự ngẫu nhiên (random seed) được chia sẻ giữa server và client
    - Secret này được tạo khi người dùng thiết lập 2FA và phải được giữ an toàn
    - Ví dụ: JBSWY3DPEHPK3PXP
- Thời gian hiện tại:
    - TOTP sử dụng thời gian hệ thống (thường theo chuẩn Unix Epoch, tính bằng giây kể từ 01/01/1970)
    - Thời gian được chia thành các khoảng (thường là 30 giây), gọi là time step. Mỗi time step tạo ra một mã TOTP mới
- Thuật toán HMAC-SHA1:
    - HMAC (Hash-based Message Authentication Code) kết hợp secret và thời gian để tạo ra một chuỗi băm (hash)
    - Thuật toán SHA1 được sử dụng để đảm bảo tính bảo mật và tính duy nhất của mã
>**Note**: có thể hỏi dev/ app teams để lấy Shared Secret

### Quá trình tạo mã TOTP diễn ra như sau:
1. Tính thời gian hiện tại: 
    - Lấy thời gian hiện tại (Unix timestamp) và chia cho độ dài time step (thường là 30 giây) để lấy số nguyên gọi là counter
    - Công thức: counter = floor(current_time / time_step)
    - Ví dụ: Nếu thời gian hiện tại là 1625097600 giây, với time step 30 giây, thì counter = floor(1625097600 / 30) = 54169920
2. Kết hợp secret và counter: 
    - Counter được chuyển thành chuỗi byte
    - Secret cũng được chuyển thành byte (thường dạng Base32)
    - Cả hai được đưa vào thuật toán HMAC-SHA1 để tạo một chuỗi băm
    - Công thức: hash = HMAC-SHA1(secret, counter)
3. Rút gọn chuỗi băm: 
    - Chuỗi băm (thường dài 20 byte) được cắt ngắn để tạo mã số gồm 6-8 chữ số
    - Một kỹ thuật gọi là dynamic truncation được sử dụng: 
        - Lấy 4 byte cuối của chuỗi băm (vị trí được chọn động dựa trên byte cuối)
        - Chuyển 4 byte này thành số nguyên
        - Lấy modulo 10^6 (hoặc 10^8 nếu dùng 8 chữ số) để có mã TOTP
        - Ví dụ: Nếu số nguyên là 123456789, mã TOTP sẽ là 123456 (6 chữ số)
4. Kết quả: Mã TOTP (ví dụ: 123456) được tạo ra và có hiệu lực trong suốt time step (30 giây)

### Quy trình xác thực:
- Client: Người dùng nhập mã TOTP từ ứng dụng Authenticator vào hệ thống
- Server:
    - Sử dụng cùng secret và thời gian hiện tại để tạo mã TOTP theo cách tương tự
    - So sánh mã TOTP từ client với mã TOTP tự tạo
    - Nếu khớp, xác thực thành công
- Khoảng dung sai: Để xử lý lệch thời gian nhỏ giữa client và server, server có thể kiểm tra mã TOTP ở các time step gần kề (ví dụ: ±30 giây)

### Test TOTP trong Playwright:
- Sử dụng thư viện otplib
- Ví dụ sử dụng:
```
import { test } from "@playwright/test";
import { authenticator } from "otplib";

test("TOTP", async ({ page }) => {
    await page.goto("example.com");
    const secret = "XSVI3RJSW...";
    const code = authenticator.generate(secret);
    console.log(code);
});
```


## Login gmail:
### Login gmail:
- Gmail của google thường chặn case auto -> sử dụng initscript để bypass

### Xác thực qua Mail/SMS:
- Mail: Sử dụng dịch vụ email cung cấp API như Mailinator, Gmail API hoặc
MailSlurp
- SMS: Sử dụng dịch vụ số điện thoại thực hoặc API như Twilio, Mailosaur
- Link blog tham khảo: [mail_sms_authen_blog](https://academy.betterbytesvn.com/blog/bai-dich-4-cach-de-xu-ly-test-yeu-cau-verify-email-sms-va-xac-thuc-hai-buoc-trong-automation-testing/)



# 2. Playwright MCP
## MCP là gì? 
- MCP: Model Context Protocol 
- Một giao thức chuẩn mở phát triển bởi Anthropic 
    - Cho phép ứng dụng AI LLM (Large Language Models) kết nối và tương tác với các hệ thống bên ngoài một cách an toàn và hiệu quả
    - MCP hoạt động như một cầu nối giữa AI và các công cụ, dịch vụ, hoặc nguồn dữ liệu khác nhau

### Đặc điểm chính của MCP:
- Tích hợp AI với hành động thực tế: MCP cho phép AI điều khiển các
công cụ automation như Playwright để thực hiện các tác vụ phức tạp
- Tính linh hoạt: MCP hỗ trợ tích hợp AI với nhiều công cụ như Playwright
hoặc cơ sở dữ liệu
- Bảo mật: MCP cung cấp cơ chế kiểm soát dữ liệu, bảo vệ thông tin nhạy
cảm khi AI truy cập
- Khả năng mở rộng: MCP cho phép nhiều client chia sẻ một phiên trình
duyệt, giảm tiêu tốn tài nguyên

### Tại sao cần MCP?  
1. Tăng cường khả năng của AI:
- Cho phép AI truy cập vào các công cụ và dữ liệu thực tế
- Mở rộng phạm vi hoạt động của AI từ việc chỉ xử lý văn bản sang thực hiện các tác vụ phức tạp
2. Tích hợp linh hoạt:
- Kết nối với nhiều loại hệ thống khác nhau (databases, APIs, tools)
- Không cần phải train lại model khi thêm công cụ mới
3. Kiểm soát và bảo mật:
- Quản lý quyền truy cập chi tiết
- Theo dõi và giám sát các hoạt động của AI
4. Tiêu chuẩn hóa:
- Tạo ra một cách thức chung cho việc tích hợp công cụ
- Giảm thiểu sự phức tạp khi phát triển

### Các loại MCP:
1. Database MCP:
- Kết nối với các cơ sở dữ liệu (MySQL, PostgreSQL, MongoDB)
- Cho phép AI query và thao tác với dữ liệu
2. File System MCP:
- Truy cập và quản lý hệ thống file
- Đọc, ghi, và thao tác với các file và thư mục
3. API MCP:
- Tương tác với các REST APIs và GraphQL
- Gửi requests và xử lý responses
4. Tool MCP:
- Tích hợp với các công cụ phát triển (Git, Docker, npm)
- Run các lệnh và scripts
5. Browser MCP:
- Điều khiển trình duyệt web
- Thực hiện automation testing và web scraping


## Playwright MCP là gì?
- Playwright MCP là một MCP server được thiết kế đặc biệt để tích hợp Playwright (framework automation testing) với các AI models thông qua giao thức MCP
- Khả năng chính:
    - Viết test scripts: Tự động generate code test Playwright
    - Debug tests: Phân tích và sửa lỗi trong test cases
    - Chạy tests: Execute tests và xem kết quả trực tiếp
    - Tương tác với browser: Điều khiển browser thông qua Playwright API
    - Analyze pages: Phân tích cấu trúc và elements của web pages
- Lợi ích:
    - Tăng tốc phát triển: AI có thể nhanh chóng viết test cases
    - Giảm lỗi: AI hiểu context và viết test chính xác hơn
    - Hỗ trợ debug: AI có thể phân tích lỗi và đề xuất fix
    - Learning curve thấp: Không cần expert Playwright vẫn viết được test tốt
- Ứng dụng thực tế:
    - Generate code
    - Fix bugs
    - Crawl data

### Các lỗi thường gặp:
- MCP server không start được: **"Failed to start MCP server"**
-> Giải pháp:
    - Kiểm tra Node.js đã được cài đặt: node --version
    - Đảm bảo path trong config đúng
    - Check logs: View > Output > Claude
- Playwright browsers chưa được cài: **"browserType.launch: Executable doesn't exist"**
-> Giải pháp:
    - Cài đặt browsers: npx playwright install
    - Hoặc cài browser cụ thể: npx playwright install chromium
- Permission denied: **"EACCES: permission denied"**
-> Giải pháp:
    - Trên macOS/Linux: Sử dụng sudo cho global install
    - Hoặc cài local trong project: sudo npm install @modelcontextprotocol/server-playwright
- Port already in use: **"Address already in use"**
-> Giải pháp:
    - Tìm process đang dùng port: lsof -i :PORT
    - Kill process: kill -9 PID
    - Hoặc config port khác trong settings