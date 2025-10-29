import { Page } from "@playwright/test";
import { BasePage } from "../base-page";

export class AlertDemoPage extends BasePage {
    alertDemoPageUrl = "https://material.playwrightvn.com/020-alert-confirm-prompt.html";
    courseAddCloseXpath = "//button[@onclick='closeCoursePopup()']";
    alertBtnXpath = "//button[@id='alertButton']";
    confirmBtnXpath = "//button[@id='confirmButton']";
    promtBtnXpath = "//button[@id='promptButton']";
    notifXpath = "//div[@id='resultDisplay']";

    constructor(page: Page) {
        super(page);
    }
}