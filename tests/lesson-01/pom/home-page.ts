import { Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class HomePage extends BasePage {
    titleXpath: string = "//title";
    headingXpath: string = "//p[@class='site-title']/a";
    productQuantityXpath: string = "//p[@class='woocommerce-result-count']";

    constructor(page: Page) {
        super(page);
    }
}