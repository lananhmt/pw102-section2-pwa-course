import { expect } from "@playwright/test";
import { AddProductPage } from "./pom/admin/add-product-page";
import { AllProductPage } from "./pom/admin/all-product-page";
import { HomePage } from "./pom/user/home-page";
import { DetailProductPage } from "./pom/user/detail-product";
import { test } from "../lesson-02/fixture/login.fixture";
import { JSONDataReader } from "../lesson-02/utils/json-reader";

test.describe("PRODUCT Module", async () => {
    let addProductPage: AddProductPage;
    let homePage: HomePage;
    let detailProductPage: DetailProductPage;
    let allProductPage: AllProductPage;
    const testData = JSONDataReader(`tests/lesson-02/data/${process.env.ENV}-data.json`);

    test.afterEach(async ({ page }) => {
        allProductPage = new AllProductPage(page);
        await allProductPage.navigateToAllProductPage();
        await allProductPage.deleteProduct(testData["Product name"]);
        await expect(await allProductPage.getLocatorByXpath(allProductPage.deleteSuccessMsgXpath)).toBeVisible();
    })

    test("Add product successfully with visibility 'Search results only'", { annotation: { type: "Module ID", description: "PRODUCT" }, tag: ["@PRODUCT_002", "@PRODUCT", "@UI"] }, async ({ page, login }) => {
        await test.step("Step 1: Fill product info, then click Publish", async () => {
            addProductPage = new AddProductPage(page);
            await addProductPage.navigateToAddProductPage();
            await addProductPage.addNewProductWithCatalogOption(testData["Product name"], testData["Product price"]["Regular price"], testData["Product price"]["Sale price"], testData["Catalog visibility"]);
            await expect(await addProductPage.getLocatorByXpath(addProductPage.addSuccessMsgXpath)).toBeVisible();
        })

        await test.step("Step 2: Navigate to Product page, then verify product info", async () => {
            homePage = new HomePage(page);
            await homePage.navigateToHomePage();
            const productList = await homePage.getProductList();
            const containProduct = productList.some(product => product.productName === testData["Product name"]);
            expect(containProduct).toBe(false);
        })

        await test.step("Step 3: Search product", async () => {
            await homePage.searchProduct(testData["Product name"]);
            detailProductPage = new DetailProductPage(page);
            const expectUrl = await detailProductPage.getDetailProductPageUrl(testData["Product name"]);
            expect(await homePage.getPageUrl()).toBe(expectUrl);
            expect((await detailProductPage.getProductInfo()).productNameInfo).toBe(testData["Product name"]);
            expect((await detailProductPage.getProductInfo()).productRegularPriceInfo).toContain(`${testData["Product price"]["Regular price"]}`);
            expect((await detailProductPage.getProductInfo()).productSalePriceInfo).toContain(`${testData["Product price"]["Sale price"]}`);
        })
    })
})