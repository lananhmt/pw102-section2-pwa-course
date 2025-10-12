# Overview các kiến thức cơ bản
## Cài đặt thư viện:
Dùng lệnh: npm install -D <library_name>

Trong đó: -D (--save-dev): 
- Thêm vào phần "devDependencies" trong package.json
- Chỉ cần khi develop hoặc chạy test
- Không cần thiết khi deploy production


## Init & configuration:
- Khởi tạo project: 2 cách:
    - npm init playwright@latest
    - npm init playwright@latest <folder_name>: init project trong <folder_name>

- Sửa config mặc định cho project
    - worker = 1
    - retries = 1
    - trace = ‘on’
    - keep only 1 project - chromium


## Basic syntax: 
- page.locator(“”).action(data)
- page.action(locator, data);
- expect().non-retrying
- await expect(element).auto-retrying


## Tương tác với phần tử:
- Navigate: page.goto(url)
- Text Input, Textarea: page.fill(selector, value)
- Radio Button & Checkbox: page.check(selector) / page.uncheck(selector)
- Button: page.click(selector)
- Focus: page.focus(selector)
- Hover: page.hover(selector)
- Drag and Drop: page.dragAndDrop(sourceSelector, targetSelector)
- Upload Files: page.setInputFiles(selector, filePath)
- Iframe: page.frameLocator(selector).locator(childSelector)


## Suite:
- test.describe
- test
- test.step: luôn có await


## Hooks:
- beforeAll: Chạy 1 lần trước cả suite
- beforeEach: Chạy trước mỗi test
- afterEach: Chạy sau mỗi test
- afterAll: Chạy 1 lần sau cả suite



# Biến môi trường
## Môi trường:
- Tập hợp các điều kiện, cấu hình và tài nguyên mà ứng dụng chạy trên đó
- Mỗi môi trường có mục đích riêng, có cấu hình riêng
- Môi trường phổ biến:
    - Dev: Dùng để dev, test, debug
    - Staging: Môi trường mô phỏng gần giống sản phẩm thực tế
    - Production: Môi trường thực tế, ứng dụng được triển khai cho người dùng cuối


## Biến môi trường:
- Là các giá trị động được lưu trữ trong hệ thống hoặc ứng dụng
- Cung cấp thông tin cấu hình cho chương trình mà không cần “hard-code”
- Tác dụng: 
    - Bảo mật thông tin
    - Linh hoạt thay đổi cấu hình cho từng môi trường
    - Dễ tái sử dụng trên nhiều môi trường


## Sử dụng biến môi trường:
- Cài đặt thư viện dotenv: npm install -D dotenv
- Import thư viện: 
import dotenv from 'dotenv';
    - Nếu chỉ có 1 file .env: dotenv.config();
    - Nếu có nhiều file .env: dotenv.config({ path: path.resolve(__dirname, `.env.${process.env.ENV}`) }); (sẽ detect xem hiện máy sử dụng đang ở môi trường nào, sau đó trả về tên file tương ứng)
- Tạo file .env: *(file .env nằm trong file .gitignore)*
    - Format: KEY=”value”
    - Comment: sử dụng #
- Cấp độ biến môi trường:
    - Config ngắn → đưa ra file env
    - Config dài (test config) (tạo 1 file json đi kèm với test file)



# Quản lý test với annotations và tags
- Annotation: Các đánh dấu đặc biệt được thêm vào code để cung cấp thông tin bổ sung hoặc kiểm soát hành vi của các test case
- Tag: Các nhãn được gắn vào test case để phân loại và nhóm các test case theo các tiêu chí nhất định

## Annotation:
- test.skip: đánh dấu 1 test là bỏ qua (chưa cần fix):
    
    ```
    test.skip("Test 01", async () => {//Test content});
- Conditional skip: chỉ skip nếu đạt điều kiện:

    ```
    test("Test 01", async ({ browserName }) => {test.skip(browserName === 'chromium', "Chromium: not supported");});
- test.fixme: đánh dấu 1 test là bỏ qua (cần fix nhưng chưa có thời gian, đánh dấu để test không fail nữa):

    ```
    test.fixme("Test 01", async () => {//Test content});
- test.slow(): đánh dấu test này là chậm và Playwright sẽ tăng 3 lần thời gian timeout của test:

    ```
    test("Test 01", async () => {test.slow();});
- Tạo thêm 1 object nữa trong function test -> Annotation sẽ được hiển thị trong report:
    - type: loại annotation
    - description: mô tả
    ```
    test("Test 01", {
    annotation: {
        type: 'lesson',
        description: 'lesson-01'}
    }, async ({ page }, testInfo) => {
    //Test content
    });
- Khai báo 1 mảng annotation:
    ```
    test("Test 01", { 
    annotation: [ 
        { 
        type: 'lesson', 
        description: 'lesson-01' 
        }, 
        { 
        type: 'class', 
        description: 'Playwright Advanced' 
        } 
    ] 
    }, 
    async ({}) => { 
    //Test content 
    } 
    );
- Khai báo annotation dynamic: 
    ```
    test("Test 01", 
    async ({ }, testInfo) => { 
        // Thêm thông qua object test 
        test.info().annotations.push({ 
            type: 'class', 
            description: 'Playwright Advanced', 
        }); 
        // Thêm thông qua object testInfo 
        testInfo.annotations.push({ 
            type: 'lesson', 
            description: 'lesson-01' 
        }); 
        } 
    );
# Emulation, clock và accessibility testing
## Emulation (giả lập):
- Devices: Config trong projects: use: {...devices['Desktop Chrome']}
- Viewport: Config trong projects: use: {viewport: {width: 1280, height: 720}}
- Locale & Timezone: Config trong defineConfig: use: {locale: 'en-GB', timezoneId: 'Europe/Paris'}
- Permissions: Config trong defineConfig: use: {permissions: ['camera']}


## Clock:
- Clock API giúp thay đổi hành vi mặc định của đồng hồ, phục vụ cho các test cần “chờ”
### Một số function:
- setFixedTime(): Đặt Date.now() thành giá trị cố định: 
    
    Ví dụ: await page.clock.setFixedTime(new Date('2024-02-02T10:00:00'));
- install: Khởi tạo clock -> Kiểm soát toàn bộ thời gian -> Lưu ý gọi trước tất cả các function khác:

    Ví dụ: await page.clock.install({ time: new Date('2024-02-02T08:00:00') });
- fastForward: Tua nhanh thời gian

    Ví dụ: await page.clock.fastForward('05:00'); // 5 phút

    await page.clock.fastForward(5000); // 5 giây
- pauseAt: Tạm dừng thời gian tại thời điểm:

    Ví dụ: await page.clock.pauseAt(new Date('2024-02-02T10:00:00'));
- runFor: Tick "thủ công" -> Điều khiển thời gian từng milisecond

    Ví dụ: await page.clock.runFor(2000); // Tick 2 giây


## Accessibility testing (test khả năng truy cập):
- Accessibility testing đảm bảo website dễ sử dụng cho mọi người, bao gồm người khuyết tật.
- Playwright tích hợp với **axe-core** để phát hiện tự động các vấn đề accessibility theo tiêu chuẩn WCAG (Web Content Accessibility Guidelines).
- Axe-core có thể phát hiện khoảng 57% các vấn đề accessibility, còn lại cần test manual.
- Cài đặt thư viện: npm install -D @axe-core/playwright
- Ví dụ sử dụng:
```
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright'; 
test.describe('homepage', () => { 
    test('should not have any automatically detectable accessibility issues', async ({ page }, testInfo) => {
        await page.goto('https://www.visionaustralia.org/'); 
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
        await testInfo.attach('accessibility-scan-results', {
            body: JSON.stringify(accessibilityScanResults, null, 2),
            contentType: 'application/json'
        });
        expect(accessibilityScanResults.violations).toEqual([]); // Kiểm tra không có lỗi accessibility nào
    });
});