import { Page } from "@playwright/test"
import { BasePage } from "../base-page";

export class WebsocketPage extends BasePage {
    websocketPageUrl = "https://echo.websocket.org/.ws";
    connectedLogXpath = "//div[@class='info' and text()='connected']";
    disconnectedLogXpath = "//div[@class='info' and text()='disconnected']";
    sendMsgTextareaXpath = "//textarea[@id='content']";
    sendMsgBtnXpath = "//button[@id='send']";
    disconnectBtnXpath = "//button[@id='disconnect']";

    constructor(page: Page) {
        super(page);
    }

    async sendMessage(message: string) {
        this.page.fill(this.sendMsgTextareaXpath, message);
        this.page.click(this.sendMsgBtnXpath);
    }

    getSendLogXpath(message: string) {
        return `//div[@class='send' and text()='${message}']`;
    }

    getRecvLogXpath(message: string) {
        return `//div[@class='recv' and text()='${message}']`;
    }

    async disconnectServer() { 
        this.page.click(this.disconnectBtnXpath);
    }
}