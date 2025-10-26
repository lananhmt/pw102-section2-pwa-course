export async function discordReporter(bodyReport: string) {
    const discordWebHook = process.env.DISCORD_WEBHOOK as string;
    const bodyReportMention = new String(`Please check my report <@${process.env.MENTOR_DISCORD_ID}>\n`).concat(bodyReport);
    await fetch(discordWebHook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "content": bodyReportMention })
    });
}