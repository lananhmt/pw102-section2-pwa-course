import { Page } from "@playwright/test";
import { BasePage } from "../..//base-page";

export class LoginPage extends BasePage {
    loginPageUrl = `${process.env.BASE_URL}wp-admin`;
    usernameXpath = "//input[@id='user_login']";
    passwordXpath = "//input[@id='user_pass']";
    loginBtnXpath = "//input[@id='wp-submit']";

    correctUsername = `${process.env.USERNAME}`;
    correctPassword = `${process.env.PASSWORD}`;

    constructor(page: Page) {
        super(page);
    } 

    async login(username: string, password: string) {
        await this.navigateToUrl(this.loginPageUrl);
        await this.page.fill(this.usernameXpath, username);
        await this.page.fill(this.passwordXpath, password);
        await this.page.click(this.loginBtnXpath);
    }

    async loginPass() {
        await this.login(this.correctUsername, this.correctPassword);
    }
}