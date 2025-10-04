import { Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class DashboardPage extends BasePage {
    dashboardTextXpath: string = "//h1[text()='Dashboard']";
    
    constructor(page: Page) {
        super(page);
    }
}