import { Page } from "@playwright/test";

export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToUrl(url: string) {
        await this.page.goto(url);
    }

    async getLocatorByXpath(xpath: string) {
        return this.page.locator(xpath);
    }

    async getPageUrl() {
        return this.page.url();
    }
}