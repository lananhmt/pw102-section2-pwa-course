import { test, expect } from "@playwright/test";
import path from "path";
import fs from 'fs/promises';

test.describe("Download file suite", async () => {
    const fileName = "sample.pdf";
    const downloadFilePath = path.join(__dirname, "download-folder/", fileName);
    let fileExists: boolean;

    test.afterEach(async () => {
        // Delete file and verify
        await fs.unlink(downloadFilePath);
        fileExists = await fs.access(downloadFilePath).then(() => true).catch(() => false);
        expect(fileExists).toBe(false);
    })

    test("Download file PDF successful", async ({ page }) => {
        await test.step("Step 1: Navigate to File Download Demo page", async () => {
            await page.goto("https://material.playwrightvn.com/031-download.html");
            await expect(page.locator("//h2[text()='Các phương thức Download File trong Playwright']")).toBeVisible();
        })

        await test.step("Step 2: Click download sample.pdf", async () => {
            // Download file
            const downloadPromise = page.waitForEvent('download');
            await page.click(`//div[@class='file-name' and text()='${fileName}']/following-sibling::button`);
            const download = await downloadPromise;
            await download.saveAs(downloadFilePath);

            // Verify file
            fileExists = await fs.access(downloadFilePath).then(() => true).catch(() => false);
            expect(fileExists).toBe(true);
            expect(download.suggestedFilename()).toBe(fileName);
            const fileStats = await fs.stat(downloadFilePath);
            expect(fileStats.size).toBeGreaterThan(0);
        })
    })
})