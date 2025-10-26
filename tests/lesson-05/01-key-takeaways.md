# 1. Websocket testing
> Trao đổi data real time
## Khái niệm websocket:
- WebSocket là một giao thức truyền thông hai chiều (bidirectional) cho phép client và server trao đổi dữ liệu real-time thông qua một kết nối TCP duy nhất
- Khác với HTTP truyền thống (request-response), WebSocket cho phép: 
    - Giao tiếp hai chiều: Cả client và server đều có thể chủ động gửi dữ liệu cho nhau bất cứ lúc nào
    - Kết nối liên tục: Sau khi handshake, kết nối được duy trì cho đến khi một bên đóng
    - Hiệu suất cao: Giảm overhead so với HTTP polling do không cần tạo request/response liên tục
    - Real-time: Phù hợp cho ứng dụng cần cập nhật dữ liệu tức thời như chat, live notifications, gaming

## Test websocket trong Playwright:
- Playwright cung cấp API mạnh mẽ để test WebSocket thông qua các sự kiện của Page 
- Ví dụ:
```
test('websocket echo test', async ({ page }) => {
  await page.goto("https://echo.websocket.org/.ws");

  page.on('websocket', ws => {
    console.log('WebSocket connected');
    ws.on('framereceived', data => {
      console.log('Data received:', data.payload);
      expect.poll(() => {
        return data.payload;
      }).toEqual("hello"); // Chờ payload = "hello"
    });
  });

  await page.locator("//textarea[@id='content']").fill("hello");
  await page.click("//button[@id='send']"); // Gửi "hello", chờ echo back
});
```


# 2. Database integration
> Tích hợp với database
## Database testing:
- Xác minh dữ liệu sau khi gọi API (ví dụ: product, order)
- Phát hiện lỗi backend (dữ liệu không khớp giữa API và DB)
- Kết hợp với test automation để đảm bảo toàn bộ flow (UI → API → DB) hoạt động trơn tru

## Database setup:
- Cài đặt thư viện: npm install typeorm mysql2 reflect-metadata dotenv
- Đưa các thông tin Database vào file .env -> Bảo mật thông tin 
- Ví dụ:
```
// import { DataSource } from "typeorm";

const db = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

await db.initialize(); // Mở kết nối
console.log('Connected to database successfully!')

const result = await db.query('SELECT * FROM category WHERE id = ?'[createdId]);
const categoryFromDB = result[0]
console.log('Data from DB:', categoryFromDB);
expect(categoryFromDB.name).toEqual("PWA 102"); /Xác minh tên
expect(categoryFromDB.description).toContain("gadgets"); // Kiểm tra mô tả
 
await db.destroy();
console.log('Database connection closed.');
```


# 3. Parallelism & sharding
> Tối ưu thời gian chạy test
## Parallel Testing (Test Song Song): 
- Là kỹ thuật chạy nhiều test cases đồng thời thay vì chạy tuần tự. Điều này giúp giảm đáng kể thời gian thực thi toàn bộ test suite
- Cấu hình: biến workers trong file playwright.config.ts
- Ví dụ: Thay vì chạy 100 tests mất 10 phút (mỗi test 6 giây), khi chạy parallel với 4 workers có thể giảm xuống còn khoảng 2.5-3 phút

## Sharding (Chia nhỏ test suite):
- Sharding là kỹ thuật chia nhỏ test suite thành nhiều phần (shards) để chạy trên các máy hoặc process khác nhau. Mỗi shard chứa một tập con của toàn bộ tests
- Chia và chạy bằng command line: 
```
// Chia thành 4 shards và chạy lần lượt
npx playwright test --shard=1/4
npx playwright test --shard=2/4
npx playwright test --shard=3/4
npx playwright test --shard=4/4
```
- Ví dụ: Có 1000 tests, chia thành 4 shards: 
  - Shard 1: Test 1-250 
  - Shard 2: Test 251-500 
  - Shard 3: Test 501-750 
  - Shard 4: Test 751-1000