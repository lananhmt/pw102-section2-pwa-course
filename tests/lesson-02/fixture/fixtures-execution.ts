import { test as base } from "@playwright/test";

export type MyFixtures = {
    autoMockServer: string,
    userCredentials: string,
    loggedInPage: string,
    autoLogApi: string
}

export const test = base.extend<{}, MyFixtures>({
    autoMockServer: [async ({ }, use) => {
        console.log("Start mock server");
        await use("autoMockServer");
        console.log("Stop mock server");
    }, { scope: 'worker', auto: true }],
    userCredentials: [async ({ browser }, use) => {
        console.log("Create user credentials")
        await use("userCredentials");
        console.log("Delete user credentials");
    }, { scope: 'worker', auto: false }],
    loggedInPage: [async ({ userCredentials }, use) => {
        console.log("Login as admin");
        await use("loggedInPage");
        console.log("Logout")
    }, { scope: 'test' }],
    autoLogApi: [async ({ }, use) => {
        console.log("Start logging API");
        await use("autoLogApi");
        console.log("Stop logging API");
    }, { scope: 'test', auto: true }]
})