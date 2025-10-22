import { test, expect } from "@playwright/test";
import { DetailProductPage } from "../../pom/e-commerce-web/user/detail-product";
import { JSONDataReader } from "./utils/json-reader";
import { ProductAPI } from "../../pom/e-commerce-API/product-API";
import productDataList from './data/product-data.json';

test.describe("PRODUCT Module", async () => {
    let productData: any;
    let productAPI: ProductAPI;
    let productId: number;
    let productReviewList: any;
    let detailProductPage;

    test.beforeEach(async ({ request }) => {
        const caseConf: string = (test.info().tags[0]).replace('@', '');
        productData = productDataList[caseConf][process.env.ENV];
        productReviewList = JSONDataReader('tests/lesson-03/data/product-reviews.json');

        productAPI = new ProductAPI(request);
        const responseCreateProduct = await productAPI.createProduct(productData.productName, productData.regularPrice, productData.salePrice);
        expect(responseCreateProduct.status()).toBe(201);
        const responseBody = await responseCreateProduct.json();
        productId = responseBody["id"];
    })

    test.afterEach(async () => {
        const responseDeleteProduct = await productAPI.deleteProduct(productId);
        expect(responseDeleteProduct.status()).toBe(200);
    })

    test("Product reviews",
        {
            annotation:
            {
                type: "Module ID",
                description: "PRODUCT"
            },
            tag: ["@PRODUCT_003", "@PRODUCT", "@UI", "@PRODUCT_REVIEW"]
        },
        async ({ page }) => {
            await test.step("Step 1: Add 5 reviews by API", async () => {
                for (let productReview of productReviewList) {
                    const responseAddReview = await productAPI.addReview(productId, productReview.review, productReview.reviewer, productReview.email);
                    expect(responseAddReview.status()).toBe(201);
                    const responseBody = await responseAddReview.json();
                    expect(responseBody["status"]).toBe("hold");
                    productReview.id = responseBody["id"];
                }
            })

            await test.step("Step 2: Navigate to user page: verify review", async () => {
                detailProductPage = new DetailProductPage(page);
                await detailProductPage.navigateToDetailProductPage(productData["productName"]);
                expect(await detailProductPage.getLocatorByXpath(detailProductPage.noReviewMsgXpath)).toBeVisible();
            })

            await test.step("Step 3: Approve reviews then verify in user page", async () => {
                for (let productReview of productReviewList) {
                    const responseApproveReview = await productAPI.approveReview(productReview.id);
                    expect(responseApproveReview.status()).toBe(200);
                }

                detailProductPage = new DetailProductPage(page);
                await detailProductPage.navigateToDetailProductPage(productData["productName"]);
                const actualReviewList = await detailProductPage.getReviewList();
                const expectReviewList = productReviewList.map((item: { reviewer: any; review: any; email: any, id: any }) => ({
                    reviewer: item.reviewer,
                    review: item.review
                }));
                expect(actualReviewList.sort()).toStrictEqual(expectReviewList.sort());
            })
        })
})