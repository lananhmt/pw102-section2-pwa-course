import { Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class LoginPage extends BasePage {
    usernameInputXpath: string = "//input[@id='user_login']";
    passwordInputXpath: string = "//input[@id='user_pass']";
    loginBtnXpath: string = "//input[@id='wp-submit']";
    errorMsgXpath: string = "//div[@id='login_error']/p";

    constructor(page: Page) {
        super(page);
    }

    async login(username: string, password: string) {
        await this.page.locator(this.usernameInputXpath).fill(username);
        await this.page.locator(this.passwordInputXpath).fill(password);
        await this.page.click(this.loginBtnXpath);
    }
}