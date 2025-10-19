import { Reporter, FullConfig, FullResult, Suite, TestCase, TestResult } from "@playwright/test/reporter"

export default class SlackReporter implements Reporter {
    totalTest: number = 0;

    // Collect test case by status 
    totalPassed: number = 0;
    totalFailed: number = 0;
    totalSkipped: number = 0;
    totalTimeout: number = 0;
    totalInterrupt: number = 0;

    // Collect test result by status (title + duration)
    passedCase: string[] = [];
    failedCase: string[] = [];
    skippedCase: string[] = [];
    timeoutCase: string[] = [];
    interruptCase: string[] = [];

    // Save last report
    content: string[] = [];

    async onBegin(config: FullConfig, suite: Suite): Promise<void> {
        this.totalTest = suite.allTests().length;
    }

    onTestBegin(test: TestCase, result: TestResult): void {

    }

    onTestEnd(test: TestCase, result: TestResult): void {
        switch (result.status) {
            case "passed": {
                this.totalPassed++;
                this.passedCase.push(`${test.title} (${result.duration / 1000}s)`);
                break;
            }
            case "failed": {
                this.totalFailed++;
                this.failedCase.push(`${test.title} (${result.duration / 1000}s)`);
                break;
            }
            case "skipped": {
                this.totalSkipped++;
                this.skippedCase.push(`${test.title} (${result.duration / 1000}s)`);
                break;
            }
            case "timedOut": {
                this.totalTimeout++;
                this.timeoutCase.push(`${test.title} (${result.duration / 1000}s)`);
                break;
            }
            case "interrupted": {
                this.totalInterrupt++;
                this.interruptCase.push(`${test.title} (${result.duration / 1000}s)`);
                break;
            }
        }
    }

    async onEnd(result: FullResult): Promise<void | { status?: FullResult["status"]; } | undefined> {
        const reportingTime = new Date(Date.now()).toLocaleString();
        this.content.push(`Reporting time: ${reportingTime}`);
        this.content.push(`- Total tests: ${this.totalTest}`)
        this.content.push(`- Failed tests: ${this.totalFailed}/${this.totalTest} (${(this.totalFailed / this.totalTest * 100).toFixed(2)}%)`);
        this.failedCase = this.failedCase.sort();
        for (let i = 0; i < this.failedCase.length; i++) {
            this.content.push(`  - ${this.failedCase[i]}`);

        }
        this.content.push(`- Passed tests: ${this.totalPassed}/${this.totalTest} (${(this.totalPassed / this.totalTest * 100).toFixed(2)}%)`);
        this.content.push(`- Timed out test: ${this.totalTimeout}/${this.totalTest} (${(this.totalTimeout / this.totalTest * 100).toFixed(2)}%)`);
        const bodyReport = this.content.join("\n");  
 
        // Slack reporting
        const slackWebHook = process.env.SLACK_WEBHOOK as string;
        const bodyReportMention = new String(`Please check my report <${process.env.MENTOR_SLACKID}>\n`).concat(bodyReport);
        await fetch(slackWebHook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "text": bodyReportMention })
        });
    }
}