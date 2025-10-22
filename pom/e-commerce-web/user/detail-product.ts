import { Page } from "@playwright/test";
import { BasePage } from "../..//base-page";

export class DetailProductPage extends BasePage {
    productNameXpath = "//div[contains(@class,'entry-summary')]/h1[contains(@class,'product_title')]";
    productRegularPriceXpath = "//div[contains(@class,'entry-summary')]//span[contains(text(),'Original price')]";
    productSalePriceXpath = "//div[contains(@class,'entry-summary')]//span[contains(text(),'Current price')]";
    reviewListXpath = "//div[@class='comment_container']";
    noReviewMsgXpath = "//div[@id='comments']//p[text()='There are no reviews yet.']";

    constructor(page: Page) {
        super(page);
    }

    async getDetailProductPageUrl(productName: string) {
        const productNameHandle = productName
            .normalize('NFD') // Convert to Unicode NFD (decomposed)
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[$$\]\/]/g, '') // Remove [ ] and /
            .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
            .trim() // Remove leading/trailing spaces
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .toLowerCase(); // Lowercase
        return `${process.env.BASE_URL}product/${productNameHandle}/`;
    }

    async getProductInfo() {
        const productNameInfo = await this.page.locator(this.productNameXpath).textContent();
        const productRegularPriceInfo = await this.page.locator(this.productRegularPriceXpath).textContent();
        const productSalePriceInfo = await this.page.locator(this.productSalePriceXpath).textContent();
        const productInfo = {
            productNameInfo,
            productRegularPriceInfo,
            productSalePriceInfo
        }
        return productInfo;
    }

    async navigateToDetailProductPage(productName: string) {
        const url = await this.getDetailProductPageUrl(productName);
        await this.navigateToUrl(url);
    }

    async getReviewList() {
        const reviewList = [];
        const reviewNumber = await this.page.locator(this.reviewListXpath).count();
        for (let i = 1; i <= reviewNumber; i++) {
            let rawReviewer = await this.page.locator(`(//div[@class='comment_container'])[${i}]//strong[@class='woocommerce-review__author']`).textContent();
            let rawReview = await this.page.locator(`(//div[@class='comment_container'])[${i}]//div[@class='description']`).textContent();
            let reviewer = rawReviewer ? rawReviewer.trim().replace(/\n$/, '') : '';
            let review = rawReview ? rawReview.trim().replace(/\n$/, '') : '';
            let reviewBlock = {
                reviewer,
                review,
            }
            reviewList.push(reviewBlock);
        }
        return reviewList;
    }
}