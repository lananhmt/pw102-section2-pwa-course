import { test as base } from "@playwright/test";
import { LoginPage } from "../pom/admin/login-page";

export const test = base.extend<{ login: void }>({
    login: async ({ page }, use) => {
        let loginPage = new LoginPage(page);
        await loginPage.loginPass();
        await use();
    }
})