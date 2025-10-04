import { test, expect } from "@playwright/test";
import { HomePage } from "./pom/home-page";
import { JSONReader } from "./utils/json-reader";

test.describe("HOME Module", async () => {
    let homePage: HomePage;
    const expectResult = JSONReader(`tests/lesson-01/test-data/${process.env.ENV}-expect-result.json`);

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.navigateToUrl(process.env.BASE_URL as string);
    })

    test("HOME_001", { tag: '@UI' }, async () => {
        await test.step("Step 1: Verify title", async () => {
            expect(await homePage.getElementText(homePage.titleXpath)).toBe(expectResult.title);
        })

        await test.step("Step 2: Verify heading", async () => {
            expect(await homePage.getElementText(homePage.headingXpath)).toBe(expectResult.heading);
        })

        await test.step("Step 3: Verify product quantity", async () => {
            expect(await homePage.getElementText(homePage.productQuantityXpath)).toContain(expectResult.productQuantity);
        })
    })
})