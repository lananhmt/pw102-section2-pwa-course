import { test, expect } from "@playwright/test";
import { WebsocketPage } from "../../pom/websocket/websocket-page";

test.describe("Websocket testing", async () => {
    let websocketPage: WebsocketPage;

    test.beforeEach(async ({ page }) => {
        websocketPage = new WebsocketPage(page);
    })

    test("Websocket testing",
        {
            annotation: {
                type: "Module",
                description: "Websocket"
            },
            tag: ["@Websocket", "@UI"]
        },
        async ({ page }) => {
            let sentFrames: string[] = [];
            let recvFrames: string[] = [];
            page.on('websocket', ws => {
                ws.on('framesent', frame => {
                    sentFrames.push(frame.payload as string);
                })
                ws.on('framereceived', frame => {
                    recvFrames.push(frame.payload as string);
                })
            })

            await test.step("Step 1: Navigate to Websocket page", async () => {
                await websocketPage.navigateToUrl(websocketPage.websocketPageUrl);
                await expect(page.locator(websocketPage.connectedLogXpath)).toBeVisible();
            })

            await test.step("Step 2: Verify send and receive message", async () => {
                const message = "Hello from PWA102";
                await websocketPage.sendMessage(message);
                await expect(page.locator(websocketPage.getSendLogXpath(message))).toBeVisible();
                await expect(page.locator(websocketPage.getRecvLogXpath(message))).toBeVisible();
                expect(sentFrames).toContain(message);
                expect(recvFrames).toContain(message);
            })

            await test.step("Step 3: Verify disconnect", async () => {
                await websocketPage.disconnectServer();
                await expect(page.locator(websocketPage.disconnectedLogXpath)).toBeVisible();
            })
        })
})