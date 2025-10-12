import { Page } from "@playwright/test";
import { BasePage } from "../..//base-page";

export class AddProductPage extends BasePage {
    addProductPageUrl = `${process.env.BASE_URL}wp-admin/post-new.php?post_type=product`;
    productNameXpath = "//input[@id='title']";
    regularPriceXpath = "//input[@id='_regular_price']";
    salePriceXpath = "//input[@id='_sale_price']";
    catalogVisibilityEditXpath = "//a[contains(@class,'edit-catalog-visibility')]";
    catalogVisibilityOkXpath = "//a[@href='#catalog-visibility' and text()='OK']";
    publishBtnXpath = "//input[@id='publish']";
    addSuccessMsgXpath = "//p[text()='Product published. ']";

    constructor(page: Page) {
        super(page);
    }

    async navigateToAddProductPage() {
        await this.navigateToUrl(this.addProductPageUrl);
    }

    async addNewProduct(productName: string, regularPrice: number, salePrice: number) {
        await this.page.fill(this.productNameXpath, productName);
        await this.page.fill(this.regularPriceXpath, `${regularPrice}`);
        await this.page.fill(this.salePriceXpath, `${salePrice}`);
        await this.page.click(this.publishBtnXpath);
    }

    async addNewProductWithCatalogOption(productName: string, regularPrice: number, salePrice: number, catalogVisibilityOption: string) {
        await this.page.fill(this.productNameXpath, productName);
        await this.page.fill(this.regularPriceXpath, `${regularPrice}`);
        await this.page.fill(this.salePriceXpath, `${salePrice}`);
        await this.page.click(this.catalogVisibilityEditXpath);
        await this.page.check(`//input[@data-label='${catalogVisibilityOption}']`);
        await this.page.click(this.catalogVisibilityOkXpath);
        await this.page.click(this.publishBtnXpath, { delay: 3000 });
    }
}