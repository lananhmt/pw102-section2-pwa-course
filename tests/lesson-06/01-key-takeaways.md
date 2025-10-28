# 1. Tích hợp extension trong Playwright
## Chrome Extension:
- Chrome Extension:
    - Các chương trình nhỏ được phát triển để mở rộng chức năng của trình duyệt Chrome
    - Chúng được viết bằng HTML, CSS, JavaScript và có thể tương tác sâu với trang web và trình duyệt
- Tại sao cần dùng Extension khi test:
    - Test ứng dụng có tích hợp Extension
    - Test Extension chính nó
    - Mô phỏng môi trường người dùng thực
    - Test tương tác giữa Extension và Website
    - 1 số scenarios thực tế cần test:
        - Ad Blocker: Website hiển thị như thế nào khi ads bị block?
        - Password Manager: Form login hoạt động với auto-fill?
        - Dark Mode Extension: UI có render đúng không?

## Tích hợp Extension trong Playwright:
- Các bước:
1. Tải extension: https://chromewebstore.google.com/detail/crx-extractordownloader/ajkhmmldknmfjnmeedkbkkojgobmljda?hl=vi
2. Truy cập và tải extension muốn cài (thông qua extension đã cài ở bước 1)
- Ví dụ tích hợp extension:
```
import { test, chromium } from '@playwright/test';
import path from 'path';

test('Load extension and test', async () => {
  // Đường dẫn đến folder extension
  const pathToExtension = path.join(__dirname, "SelectorsHub-Chrome-Web-Store");

  // Khởi tạo context với extension
  const browserContext = await chromium.launchPersistentContext('', {
    headless: false, // Extension chỉ chạy ở headed mode
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
      '--no-sandbox'
    ],
  });

  const page = await browserContext.newPage();
  await page.goto('https://example.com');

  // Test logic here
  
  await browserContext.close();
});
```


# 2. Evaluating javascript, Custom selector, matcher
## Evaluating JavaScript là gì:
- Là khả năng thực thi code JavaScript trực tiếp trong ngữ cảnh của trang web (browser
context)
- Cho phép chúng ta chạy JavaScript code bên trong trang web đang được test, giống như việc mở Developer Tools và chạy code trong Console

## Các phương thức chính:
```
// Thực thi JavaScript trong ngữ cảnh trang
await page.evaluate(() => {
return document.title;
});

// Thực thi với tham số
await page.evaluate((selector) => {
return document.querySelector(selector).textContent;
}, '.my-element'); 

// Thực thi trên element cụ thể
await element.evaluate((el) => {
return el.innerHTML;
});
```

## Tại sao cần Evaluating JavaScript:
- Truy cập thông tin không có sẵn qua Playwright API
```
// Lấy scroll position
const scrollTop = await page.evaluate(() => window.pageYOffset);

// Lấy thông tin từ Local Storage
const userData = await page.evaluate(() => JSON.parse(localStorage.getItem('user')));

// Kiểm tra CSS computed styles
const color = await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    return window.getComputedStyle(element).color;
}, '.my-button'); // rgb(255, 0, 0)
```
- Thao tác phức tạp với DOM
```
// Thay đổi nhiều elements cùng lúc
await page.evaluate(() => {
    document.querySelectorAll('.item').forEach((item, index) => {
        item.dataset.index = index;
        item.style.opacity = '0.5';
    });
});

// Trigger events phức tạp
await page.evaluate(() => {
    const event = new CustomEvent('myCustomEvent', {
        detail: {
            message: 'Hello from test'
        }
    });
    document.dispatchEvent(event);
});
```
- Tương tác với JavaScript frameworks
```
// Tương tác với React components
await page.evaluate(() => {
    // Truy cập React instance (chỉ trong development)
    const reactElement = document.querySelector('#my-component');
    const reactInstance = reactElement._reactInternalInstance;
    return reactInstance.memoizedProps;
});

// Tương tác với Vue.js
await page.evaluate(() => {
    return window.Vue.version;
});
```


# 3. File handling: upload, download
## Upload:
- Gửi file từ local lên server qua input file
- setInputFiles(selector, filePath):
Trong đó: selector là input file; filePath là đường dẫn file local (string hoặc array cho multi-upload)

## Download:
Xử lý file download từ server
```
const downloadPromise = page.waitForEvent('download');
await page.click('#download-button');
const download = await downloadPromise;
await download.saveAs('./downloaded-file.pdf');
```


# 4. Xử lý random popup
## Popup là gì:
- Popup là các cửa sổ hoặc phần tử giao diện xuất hiện bất ngờ trên trang web, thường có các đặc điểm: 
    - Xuất hiện không theo kịch bản: Có thể hiện lên bất cứ lúc nào
    - Che phủ nội dung chính: Thường nằm trên layer cao nhất
    - Yêu cầu tương tác: Người dùng phải đóng hoặc thực hiện hành động nào đó
- Các loại popup phổ biến từ chưa biết gì:
    - Cookie consent banners: Thông báo chấp nhận cookie
    - Newsletter subscription: Đăng ký nhận tin
    - Advertisement overlays: Quảng cáo che phủ
    - Age verification: Xác minh tuổi 
    - Location permission: Xin quyền truy cập vị trí
    - Push notification requests: Yêu cầu gửi thông báo
- Lợi ích khi handle popup đúng cách:
    - Test ổn định: Chạy đúng trong mọi trường hợp
    - Giảm maintenance: Ít phải fix test do popup
    - Tăng reliability: Kết quả test đáng tin cậy hơn

## Cách handle:
Ví dụ:
```
const popupLocator = page.locator("//button[contains(text(), 'Allow all')]");
await page.addLocatorHandler(popupLocator, async () => {
    await popupLocator.click();
});
```


# 5. Playwright Browser
## Mối Quan Hệ Giữa Playwright Và Trình Duyệt:
- Mỗi bản release của Playwright thường tương ứng với một phiên bản cụ thể của trình duyệt (Chromium, Firefox, WebKit), đảm bảo tương thích
- Khi cập nhật Playwright, cần tải lại trình duyệt tương ứng vì phiên bản cũ có thể không còn hỗ trợ

## Tải Lại Trình Duyệt:
- Tải tất cả trình duyệt: Cài đặt Chromium, Firefox, WebKit cho dự án: npx playwright install
- Tải trình duyệt cụ thể: Chỉ cài WebKit nếu cần test Safari: npx playwright install webkit
- Cài dependencies hệ thống:
    - Cài thư viện phụ thuộc (như libwebkit) trên máy: npx playwright install-deps
    - Cụ thể cho Chromium: npx playwright install-deps chromium

## Cập Nhật Phiên Bản Playwright:
- Cập nhật Playwright: npm install -D @playwright/test@latest
- Tải lại trình duyệt mới: npx playwright install


# 6. Module fs/promises
- Module fs/promises là một phần của Node.js, cung cấp các phương thức bất đồng bộ dựa trên Promise để thao tác với hệ thống tệp (file system)
- Dùng trong Playwright để verify file tải xuống
- Import thư viện: import fs from 'fs/promises';
- 1 số các method:
    - fs.access(path): Kiểm tra file tồn tại. Ví dụ: 
    ```
    const exists = await fs.access('./sample.pdf').then(() => true).catch(() => false);
    expect(exists).toBe(true);
    ```
    - fs.stat(path): Lấy thông tin file (kích thước, thời gian tạo). Ví dụ:
    ```
    const stats = await fs.stat('./sample.pdf');
    expect(stats.size).toBeGreaterThan(0); // File không rỗng
    ```
    - fs.readFile(path): Đọc nội dung file (dùng với file text hoặc parse PDF)
    - fs.unlink(path): Xóa file để dọn dẹp sau test


# 7. Xử lý dialog
- Alert dialog:
    - Chỉ hiển thị thông báo và nút "OK". Không trả về giá trị
    - Lắng nghe sự kiện dialog và gọi dialog.accept() để đóng
- Confirm Dialog:
    - Yêu cầu xác nhận, trả về true (OK) hoặc false (Cancel)
    - Gọi dialog.accept() để chọn "OK" hoặc dialog.dismiss() để chọn "Cancel"
- Prompt Dialog:
    - Yêu cầu nhập văn bản, trả về giá trị nhập hoặc null nếu hủy
    - Gọi dialog.accept('input') để gửi giá trị nhập và chọn "OK"
    - Gọi dialog.dismiss() để hủy