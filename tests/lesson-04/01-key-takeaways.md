# 1. Understand the hooks
- Playwright Reporter: là cơ chế cho phép custom cách báo cáo test result. Các reporter mặc định (như HTML, JSON, Dot) có thể được mở rộng hoặc thay thế bằng custom reporter để hiển thị kết quả theo nhu cầu (ex: gửi thông báo Slack, Discord).
- Hooks = các thời điểm đặc biệt trong quá trình chạy test:

**onBegin:**
- Trước khi tất cả các test chạy
- Thường dùng để: 
    - Đánh dấu thời điểm bắt đầu chạy
    - Đếm xem có bao nhiêu test, tên test là gì

**onTestBegin:**
- Trước khi 1 test cụ thể chạy
- Thường dùng để:
    - Đánh dấu thời điểm bắt đầu chạy của 1 test

**onTestEnd:**
- Sau khi 1 test cụ thể chạy
- Thường dùng để:
    - Đánh dấu thời điểm kết thúc của 1 test
    - Tính thời gian chạy
    - Lấy kết quả chạy

**onEnd:**
- Sau khi tất cả các test chạy
- Thường dùng để:
    - Đánh dấu thời điểm kết thúc  của lần chạy
    - Bắn kết quả về slack, discord, ...

    
# 2. Create a simple custom reporter
- Implement Reporter
- Định nghĩa các hooks:
    - onBegin
    - onTestBegin
    - onTestEnd
    - onEnd
- Custom reporter:
Ví dụ:
```
Kết quả: 
- Passed: x/y (z%)
    - Test 1: Login with wrong password (10s)
- Failed: x/y (z%)
- Skipped: x/y (z%)
- TimedOut: x/y (z%)
```
- Một số function sẽ dùng:
    - Lấy thời gian format sẵn: 
        ```const reportingTime = new Date(Date.now()).toLocaleString();```
    - Gọi API:
        ```
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: "str"
        });
        ```


# 3. Integrate with Discord
- Create hooks: tại Edit channels > Integration > Webhook > New webhook
- Send message to hooks:
    - Method: POST
    - URL: hook URL
    - Body: {“content”: “content muốn gửi”}


# 4. Integrate with Slack
- Create app: https://api.slack.com/apps
- Create hook: tại Incoming Webhooks > Create channels
- Send message to hook
    - Method: POST
    - URL: hook URL
    - Body: {“text”: “content muốn gửi”}


# 5. Integrate with Telegram
- Create bot: @BotFather -> get TOKEN 
- Call API getUpdates: ```https://api.telegram.org/bot<TOKEN>/getUpdates```
- Create group chat
- Invite bot to chat group
- Tag bot
- Call API getUpdates again to get chat_id
- Call API sendMessage:
    - Method: POST
    - URL: ```https://api.telegram.org/bot<TOKEN>/sendMessage```
    - Body: ```{chat_id=<chat_id>, text=<text>, parse_mode: "Markdown"}```


# 6. Kiến thức đọc thêm: Mention member trong Slack và Discord
- Để mention member trong Slack và Discord, ta sử dụng cú pháp:
<@member_id>
Ví dụ:
{
"text": "Please check report <@U095K4HUV7C>"
}
- Lấy id trong slack:
1. Click vào tên member muốn lấy
2. Click dấu ...
3. Click Copy memberID
- Lấy id trong discord:
1. Click vào icon “member”
2. Click chuột phải vào member muốn copy id
3. Chọn “Copy user ID”