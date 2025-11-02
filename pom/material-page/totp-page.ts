import { Page } from "@playwright/test";
import { BasePage } from "../base-page"; 

export class TOTPPage extends BasePage {
    totpPageUrl = "https://material.playwrightvn.com/028-totp.html";
    secretKeyXpath = "//div[@class='secret-key']";
    nameInputXpath = "//input[@id='name']";
    totpInputXpath = "//input[@id='totp']";
    submitBtnXpath = "//button[@id='submit-totp']";
    submissionListXpath = "//tbody[@id='submission-list']/tr";

    constructor(page: Page) {
        super(page);
    }

    async submit(name: string, totp: string) {
        await this.page.fill(this.nameInputXpath, name);
        await this.page.fill(this.totpInputXpath, totp);
        await this.page.click(this.submitBtnXpath);
    }

    async getNewestSubmission() {
        return await this.page.locator("(//tbody[@id='submission-list']/tr)[1]/td[2]").textContent();
    }
}