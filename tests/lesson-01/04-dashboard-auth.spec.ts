import { test, expect } from "@playwright/test";
import { LoginPage } from "./pom/login-page";
import { DashboardPage } from "./pom/dashboard-page";

test.describe("DB_AUTH Module", async () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigateToUrl(`${process.env.BASE_URL}wp-admin`);
    })

    test("DB_AUTH_001", { tag: ['@UI', '@SMOKE'] }, async ({ page }) => {
        await test.step("Input correct account", async () => {
            await loginPage.login(process.env.USERNAME as string, process.env.PASSWORD as string);
            dashboardPage = new DashboardPage(page);
            const dashboardText = await dashboardPage.getSelectorByXpath(dashboardPage.dashboardTextXpath);
            await expect(dashboardText).toBeVisible();
        })
    })

    test("DB_AUTH_002", { tag: '@UI' }, async () => {
        await test.step("Input incorrect account", async () => {
            await loginPage.login(`${process.env.USERNAME}incorrect`, `${process.env.PASSWORD}incorrect`);
            expect(await loginPage.getElementText(loginPage.errorMsgXpath)).toBe(`Error: The username ${process.env.USERNAME}incorrect is not registered on this site. If you are unsure of your username, try your email address instead.`)
        })
    })
})