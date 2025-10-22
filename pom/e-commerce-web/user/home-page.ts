import { Page } from "@playwright/test";
import { BasePage } from "../..//base-page";

export class HomePage extends BasePage {
    homePageUrl = `${process.env.BASE_URL}`;
    searchFieldXpath = "//input[@id='woocommerce-product-search-field-0']";
    searchBtnXpath = "//button[@value='Search']";
    itemCountXpath = "//li[contains(@class,'type-product')]";
    pageCountXpath = "//ul[@class='page-numbers']/li";

    constructor(page: Page) {
        super(page);
    }

    async navigateToHomePage() {
        await this.navigateToUrl(this.homePageUrl);
    }

    async getProductList() {
        const productList = [];
        const pageCount = await this.page.locator(this.pageCountXpath).count();
        for (let i = 1; i < pageCount; i++) {
            await this.page.locator(`//ul[@class='page-numbers']/li/*[text()='${i}']`).click();
            let itemCount = await this.page.locator(this.itemCountXpath).count();
            for (let j = 1; j <= itemCount; j++) {
                let productName = await this.page.locator(`//li[contains(@class,'type-product')][${j}]//h2[contains(@class,'product__title')]`).textContent();
                let productRegularPrice, productSalePrice: any;
                if (await this.page.locator(`(//li[contains(@class,'type-product')][${j}]//bdi)[2]`).isVisible()) {
                    productSalePrice = await this.page.locator(`(//li[contains(@class,'type-product')][${j}]//bdi)[2]`).textContent();
                    productRegularPrice = await this.page.locator(`(//li[contains(@class,'type-product')][${j}]//bdi)[1]`).textContent();
                } else if (await this.page.locator(`(//li[contains(@class,'type-product')][${j}]//bdi)[1]`).isVisible()) {
                    productRegularPrice = await this.page.locator(`(//li[contains(@class,'type-product')][${j}]//bdi)[1]`).textContent();
                    productSalePrice = await this.page.locator(`(//li[contains(@class,'type-product')][${j}]//bdi)[1]`).textContent();
                } else {
                    productRegularPrice = '0';
                    productSalePrice = '0';
                }
                let productItem = {
                    productName,
                    productRegularPrice,
                    productSalePrice
                }
                productList.push(productItem);
            }
        }
        return productList;
    }

    async searchProduct(productName: string) {
        await this.page.fill(this.searchFieldXpath, productName);
        await this.page.click(this.searchBtnXpath);
    }
}