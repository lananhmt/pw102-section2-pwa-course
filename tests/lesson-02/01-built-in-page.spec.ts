import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pom/e-commerce-web/admin/login-page";
import { AddProductPage } from "../../pom/e-commerce-web/admin/add-product-page";
import { AllProductPage } from "../../pom/e-commerce-web/admin/all-product-page";
import { HomePage } from "../../pom/e-commerce-web/user/home-page";
import { JSONDataReader } from "../lesson-02/utils/json-reader";

test.describe("PRODUCT Module", async () => {
    let loginPage: LoginPage;
    let addProductPage: AddProductPage;
    let homePage: HomePage;
    let allProductPage: AllProductPage;
    const testData = JSONDataReader(`tests/lesson-02/data/${process.env.ENV}-data.json`);

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        addProductPage = new AddProductPage(page);
        await loginPage.loginPass();
        await addProductPage.navigateToAddProductPage();
    })

    test.afterEach(async ({ page }) => {
        allProductPage = new AllProductPage(page);
        await allProductPage.navigateToAllProductPage();
        await allProductPage.deleteProduct(testData["Product name"]);
        await expect(await allProductPage.getLocatorByXpath(allProductPage.deleteSuccessMsgXpath)).toBeVisible();
    })

    test("Add product successfully", { annotation: { type: "Module ID", description: "PRODUCT" }, tag: ["@PRODUCT_001", "@PRODUCT"] }, async ({ page }) => {
        await test.step("Step 1: Fill product info, then click Publish", async () => {
            await addProductPage.addNewProduct(testData["Product name"], testData["Product price"]["Regular price"], testData["Product price"]["Sale price"]);
            await expect(await addProductPage.getLocatorByXpath(addProductPage.addSuccessMsgXpath)).toBeVisible();
        })

        await test.step("Step 2: Navigate to home page, then verify product info", async () => {
            homePage = new HomePage(page);
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