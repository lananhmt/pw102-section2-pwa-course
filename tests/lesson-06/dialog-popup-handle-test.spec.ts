import { test, expect } from "@playwright/test";
import { AlertDemoPage } from "../../pom/material-page/alert-demo-page";

test.describe("Handle dialog and popup suite", async () => {
    let alertDemoPage: AlertDemoPage;
    const name = "PWA102-Lan Anh";

    test("Handle dialog and popup", async ({ page }) => {
        await test.step("Step 1: Navigate to Alert Demo page", async () => {
            alertDemoPage = new AlertDemoPage(page);
            await alertDemoPage.navigateToUrl(alertDemoPage.alertDemoPageUrl);
            expect(await page.locator("//h1").textContent()).toBe("Hiển Thị Hộp Thoại");

            // Close ad popup
            const adLocator = page.locator(alertDemoPage.courseAddCloseXpath);
            await page.addLocatorHandler(adLocator, async () => {
                await adLocator.click();
            })
        })

        await test.step("Step 2: Click button 'Hiển thị Alert' then click Ok", async () => {
            page.once('dialog', async dialog => {
                await dialog.accept();
            })
            await page.click(alertDemoPage.alertBtnXpath);
        })

        await test.step("Step 3: Click button 'Hiển thị Confirm' then click Cancel", async () => {
            page.once('dialog', async dialog => {
                await dialog.dismiss();
            })
            await page.click(alertDemoPage.confirmBtnXpath);
            expect(await page.locator(alertDemoPage.notifXpath).textContent()).toBe("Confirm result: Không đồng ý");
        })

        await test.step("Step 4: Click button 'Hiển thị Prompt' then fill name", async () => {
            page.once('dialog', async dialog => {
                await dialog.accept(name);
            })
            await page.click(alertDemoPage.promtBtnXpath);
            expect(await page.locator(alertDemoPage.notifXpath).textContent()).toBe(`Prompt result: ${name}`);
        })
    })
})