import { Page } from "@playwright/test";

export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToUrl(url: string) {
        await this.page.goto(url);
    }

    async getElementText(xpath: string) {
        return await this.page.locator(xpath).textContent();
    }

    async getSelectorByXpath(xpath: string) {
        return this.page.locator(xpath);
    }
}