import { Page } from "@playwright/test";
import { BasePage } from "../..//base-page";

export class AllProductPage extends BasePage {
    allProductPageUrl = `${process.env.BASE_URL}wp-admin/edit.php?post_type=product`;
    searchFieldXpath = "//input[@id='post-search-input']";
    searchBtnXpath = "//input[@id='search-submit']";
    deleteSuccessMsgXpath = "//p[text()='1 product moved to the Trash. ']";

    constructor(page: Page) {
        super(page);
    }

    async navigateToAllProductPage() {
        await this.navigateToUrl(this.allProductPageUrl);
    }

    async seachProduct(productName: string) {
        await this.page.fill(this.searchFieldXpath, productName);
        await this.page.click(this.searchBtnXpath);
    }

    async deleteProduct(productName: string) {
        await this.seachProduct(productName);
        await this.page.hover("//tbody[@id='the-list']/tr//a[@class='row-title']");
        await this.page.click("//a[text()='Trash']");
    }
}