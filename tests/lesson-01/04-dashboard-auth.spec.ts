import { test, expect } from "@playwright/test";
import { LoginPage } from "./pom/admin/login-page";
import { DashboardPage } from "./pom/admin/dashboard-page";

test.describe("DB_AUTH Module", async () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigateToUrl(loginPage.loginPageUrl);
    })

    test("DB_AUTH_001", { annotation: { type: ' Module ID', description: 'DB_AUTH' }, tag: ['@DB_AUTH_001', '@DB_AUTH', '@UI', '@SMOKE'] }, async ({ page }) => {
        await test.step("Input correct account", async () => {
            await loginPage.login(process.env.USERNAME as string, process.env.PASSWORD as string);
            dashboardPage = new DashboardPage(page);
            const dashboardText = await dashboardPage.getSelectorByXpath(dashboardPage.dashboardTextXpath);
            await expect(dashboardText).toBeVisible();
        })
    })

    test("DB_AUTH_002", { annotation: { type: ' Module ID', description: 'DB_AUTH' }, tag: ['@DB_AUTH_002', '@DB_AUTH', '@UI'] }, async () => {
        await test.step("Input incorrect account", async () => {
            await loginPage.login(`${process.env.USERNAME}incorrect`, `${process.env.PASSWORD}incorrect`);
            expect(await loginPage.getElementText(loginPage.errorMsgXpath)).toBe(`Error: The username ${process.env.USERNAME}incorrect is not registered on this site. If you are unsure of your username, try your email address instead.`)
        })
    })
})