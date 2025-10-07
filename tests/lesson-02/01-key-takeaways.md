# 1. Fixture: Khái niệm, built-in fixture, tạo mới fixture
## Khái niệm:
- Là một concept trong Playwright
- Dùng để khởi tạo các environment khác nhau cho các test
- Fixture là isolate giữa các test
- Fixture giúp nhóm các test dựa trên ý nghĩa, thay vì common setup

## Built-in fixtures:
| Fixture | Type | Mô tả |
|----------|----------|----------|
| page | Page | Tạo một page riêng biệt cho test |
| context | BrowserContext | Tạo một context riêng biệt cho test. Fixture page phía trên cũng cùng context với context này |
| browser | Browser | Browser được dùng chung giữa các test để tối ưu tài nguyên |
| browserName | string | Tên browser đang chạy: chromium, firefox, webkit |
| request | APIRequestContext | Một APIRequestContext instance độc lập |

## Tạo mới 1 fixture:
Ví dụ:
```
import { test as base } from "@playwright/test";

export const test = base.extend<{ demo: string }>({
    demo: async ({ page }, use) => { 
        console.log("Start demo");
        await use("Demo fixture);
        console.log("End demo");
    }
});
```
Trong đó: 
- demo là tên fixture
- test.extend (hay base.extend: đặt alias): để tạo mới 1 test object
- Trước từ khoá use: giống beforeEach/ beforeAll: chạy trước test/ hook
- use: chạy code trong test
- Sau từ khoá use: giống như afterEach/ afterAll: chạy sau test/ hook

## Merge fixture:
Ví dụ:
```
import { mergeTests } from '@playwright/test';
import { test as dbTest } from 'database-test-utils';
import { test as a11yTest } from 'a11y-test-utils';

export const test = mergeTests(dbTest, a11yTest);
```

# 2. Fixture: Overriding
- Overriding cho phép thay đổi hành vi fixture có sẵn (built-in hoặc custom)
- Ví dụ: Ghi đè built-in fixture page:
```
import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ baseURL, page }, use) => {
    await page.goto(baseURL);
    await use(page);
  },
});
```


# 3. Fixture: Scope
- Test Scope (Mặc định): 
    - Tạo/ hủy cho mỗi test
    - Đảm bảo cô lập hoàn toàn
    - Phù hợp cho UI test
- Worker Scope: 
    - Tạo/hủy một lần cho mỗi worker 
    - Tái sử dụng tài nguyên trong worker, tiết kiệm thời gian
    - Phù hợp cho setup tốn kém
    - Cách dùng: bổ sung thêm scope value: { scope: 'worker' }
    - Khi tạo fixture với scope worker, ta có thể lấy ra thứ tự (index) của worker thông qua parameter **workerInfo**: workerInfo.workerIndex -> giúp tạo ra các data unique cho từng worker


# 4. Fixture: Timeout
- Thay đổi giá trị timeout mặc định
- Cách dùng: bổ sung thêm timeout value: { timeout: 60000 }


# 5. Fixture: Custom title
- Thay đổi tiêu đề mặc định của fixture -> sẽ hiển thị trong report, error message
- Cách dùng: bổ sung thêm title value: { title: 'my fixture' }


# 6. Fixture: Box option
- Tuỳ chọn ẩn fixture khỏi report
- Cách dùng: bổ sung thêm box value: { box: true } (true: ẩn fixture)


# 7. Fixture: Execution order
- Dependencies: Nếu fixture A phụ thuộc B: thì B setup trước A, teardown sau A
- Lazy Execution (Non-automatic fixture): chỉ setup khi được test/ hook yêu cầu
- Automatic Fixtures: { auto: true } fixtures setup trước, bất kể có được yêu cầu hay không, setup trước test/ hook
- Scope:
    - Test-scoped: Setup/ teardown chạy mỗi test (teardown sau khi test hoàn thành)
    - Worker-scoped: Setup/ teardown mỗi worker (tất cả worker-scoped teardown cuối cùng)
- Hooks: 
    - beforeEach/ afterEach: chạy mỗi test
    - beforeAll/ afterAll: chạy một lần mỗi worker
- Teardown: Chạy sau khi fixture không còn cần, theo thứ tự ngược phụ thuộc

# 8. Fixture và POM
Là 2 concept khác nhau, có thể kết hợp với nhau:
- Fixture:
    - Setup test context
    - Dựa theo cấp độ test
    - Setup chia sẻ qua nhiều test
- POM:
    - Gói gọn logic test UI vào class
    - Dựa theo trang/ logic nghiệp vụ
    - Hàm tương tác chia sẻ qua test


# 9. Mở nhiều tab
- Để mở nhiều tab có thể sử dụng fixture context
- Ví dụ:
``` 
test('Multiple tab', async ({ page, context }) => {
    await page.goto('https://playwright.dev/');
    const page = await context.newPage(); 
    await page.goto('https://playwright.dev/');
});
```


# 10. Mở nhiều browser (nhiều trình duyệt) 
- Để mở nhiều browser có thể sử dụng fixture browser
- Ví dụ:
```
test('Multiple browser', async ({ browser }) => {  
    const context1 = await browser.newContext(); 
    const page1 = await context1.newPage(); 
    await page1.goto('https://playwright.dev/');

    const context2 = await browser.newContext(); 
    const page2 = await context2.newPage(); 
    await page2.goto('https://example.com');
}); 
```


# 11. Global beforeEach, afterEach
- Sử dụng test-scoped automatic fixture
- Ví dụ:
```
import { test as base } from '@playwright/test';

export const test = base.extend<{ forEachTest: void }>({
    forEachTest: [async ({ page }, use) => {
        // Đoạn code này sẽ chạy trước mỗi test
        await page.goto('http://playwrightvn.com');

        await use();

        // Đoạn code này sẽ chạy sau mỗi test 
        console.log('Last URL:', page.url());
    }, { auto: true }],  // Tự động chạy cho mỗi test
});
```


# 12. Global beforeAll, afterAll 
- Sử dụng worker-scoped automatic fixture 
- Ví dụ:
```
import { test as base } from '@playwright/test';

export const test = base.extend<{}, { forEachWorker: void }>({
    forEachWorker: [async ({}, use) => {
        // Đoạn code này sẽ chạy trước khi tất cả các test, khi worker khởi động 
        console.log(`Starting test worker ${test.info().workerIndex}`);

        await use();

        // Đoạn code này sẽ chạy sau khi tất cả các test chạy xong, khi worker teardown 
        console.log(`Stopping test worker ${test.info().workerIndex}`);
    }, { scope: 'worker', auto: true }],  // Tự động chạy cho mỗi worker
});
```