export async function slackReporter(bodyReport: string) {
    const slackWebHook = process.env.SLACK_WEBHOOK as string;
    const bodyReportMention = new String(`Please check my report <@${process.env.MENTOR_SLACK_ID}>\n`).concat(bodyReport);
    await fetch(slackWebHook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "text": bodyReportMention })
    });
}