import { test, expect } from "@playwright/test";
import { LoginPage } from "./pom/admin/login-page";
import { AddProductPage } from "./pom/admin/add-product-page";
import { AllProductPage } from "./pom/admin/all-product-page";
import { HomePage } from "./pom/user/home-page";
import { JSONDataReader } from "../lesson-02/utils/json-reader";

test.describe("PRODUCT Module", async () => {
    let loginPage: LoginPage;
    let addProductPage: AddProductPage;
    let homePage: HomePage;
    let allProductPage: AllProductPage;
    const testData = JSONDataReader(`tests/lesson-02/data/${process.env.ENV}-data.json`);
    let newPage: any;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        addProductPage = new AddProductPage(page);
        await loginPage.loginPass();
        await addProductPage.navigateToAddProductPage();
    })

    test.afterEach(async () => {
        loginPage = new LoginPage(newPage);
        await loginPage.loginPass();
        allProductPage = new AllProductPage(newPage);
        await allProductPage.navigateToAllProductPage();
        await allProductPage.deleteProduct(testData["Product name"]);
        await expect(await allProductPage.getLocatorByXpath(allProductPage.deleteSuccessMsgXpath)).toBeVisible();
    })

    test("Add product successfully", { annotation: { type: "Module ID", description: "PRODUCT" }, tag: ["@PRODUCT_001", "@PRODUCT"] }, async ({ browser }) => {
        await test.step("Step 1: Fill product info, then click Publish", async () => {
            await addProductPage.addNewProduct(testData["Product name"], testData["Product price"]["Regular price"], testData["Product price"]["Sale price"]);
            await expect(await addProductPage.getLocatorByXpath(addProductPage.addSuccessMsgXpath)).toBeVisible();
        })

        await test.step("Step 2: Navigate to Product page, then verify product info", async () => {
            const context = await browser.newContext();
            newPage = await context.newPage();
            homePage = new HomePage(newPage);
            await homePage.navigateToHomePage();
            const productList = await homePage.getProductList();
            const containProduct = productList.some(product => product.productName === testData["Product name"]);
            expect(containProduct).toBe(true);
            const actualProduct = productList.find(product => product.productName === testData["Product name"]);
            expect(actualProduct?.productRegularPrice).toContain(`${testData["Product price"]["Regular price"]}`);
            expect(actualProduct?.productSalePrice).toContain(`${testData["Product price"]["Sale price"]}`);
        })
    })
})