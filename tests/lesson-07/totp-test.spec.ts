import { test, expect } from "@playwright/test";
import { TOTPPage } from "../../pom/material-page/totp-page";
import { authenticator } from 'otplib';

test.describe("Time-based One-Time Password test suite", async () => {
    let totpPage: TOTPPage;
    let secretKey: string;

    test.beforeEach(async ({ page }) => {
        totpPage = new TOTPPage(page);
    })

    test("TOTP test", async ({ page }) => {
        await test.step("Step 1: Navigate to TOTP page", async () => {
            await totpPage.navigateToUrl(totpPage.totpPageUrl);
            await expect(page.locator(totpPage.secretKeyXpath)).toBeVisible();
            secretKey = await page.locator(totpPage.secretKeyXpath).textContent() as string;
            expect(secretKey).not.toBe(null);
        })

        await test.step("Step 2: Submit and verify", async () => {
            const timestamp = new Date(Date.now()).getTime();
            const name = `Lan Anh - ${timestamp}`;
            const totp = authenticator.generate(secretKey);
            await totpPage.submit(name, totp);
            await totpPage.navigateToUrl(totpPage.totpPageUrl);
            const actualNewestSubmission = await totpPage.getNewestSubmission();
            expect(actualNewestSubmission).toBe(name);
        })
    })
})