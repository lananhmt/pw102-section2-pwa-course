export async function telegramReporter(bodyReport: string) {
    const telegramToken = process.env.TELEGRAM_TOKEN as string;
    const telegramChatId = process.env.TELEGRAM_CHATID as string;
    const telegramWebHook = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
    await fetch(telegramWebHook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: telegramChatId,
            text: bodyReport,
            parse_mode: "Markdown"
        })
    });
}