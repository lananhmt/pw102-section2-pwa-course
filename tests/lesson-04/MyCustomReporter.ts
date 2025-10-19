import { Reporter, FullConfig, FullResult, Suite, TestCase, TestResult } from "@playwright/test/reporter"
import DiscordReporter from "./DiscordReporter";
import SlackReporter from "./SlackReporter";
import TelegramReporter from "./TelegramReporter";

export default class MyCustomReporter implements Reporter {
    private reporters: Reporter[];

    constructor() {
        this.reporters = [];
        const reportChannels: string[] = (process.env.REPORT_CHANNELS || 'slack').split(',');
        for (const channel of reportChannels) {
            switch (channel) {
                case "discord": {
                    this.reporters.push(new DiscordReporter());
                    break;
                }
                case "slack": {
                    this.reporters.push(new SlackReporter());
                    break;
                }
                case "telegram": {
                    this.reporters.push(new TelegramReporter());
                    break;
                }
            }
        }
    }

    async onBegin(config: FullConfig, suite: Suite) {
        for (const reporter of this.reporters) {
            if (reporter.onBegin) reporter.onBegin(config, suite);
        }
    }

    onTestEnd(test: TestCase, result: TestResult) {
        for (const reporter of this.reporters) {
            if (reporter.onTestEnd) reporter.onTestEnd(test, result);
        }
    }

    async onEnd(result: FullResult) {
        for (const reporter of this.reporters) {
            if (reporter.onEnd) await reporter.onEnd(result);
        }
    }
}