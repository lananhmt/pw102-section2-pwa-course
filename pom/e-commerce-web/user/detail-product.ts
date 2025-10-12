import { Page } from "@playwright/test";
import { BasePage } from "../..//base-page";

export class DetailProductPage extends BasePage {
    productNameXpath = "//div[contains(@class,'entry-summary')]/h1[contains(@class,'product_title')]";
    productRegularPriceXpath = "//div[contains(@class,'entry-summary')]//span[contains(text(),'Original price')]";
    productSalePriceXpath = "//div[contains(@class,'entry-summary')]//span[contains(text(),'Current price')]";

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
}