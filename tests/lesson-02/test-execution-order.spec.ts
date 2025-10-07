import { test } from "./fixture/fixtures-execution";

test.describe("Create fixture execution order", () => {
    test.beforeAll(async () => {
        console.log("Before All");
    })

    test.beforeEach(async () => {
        console.log("Before Each");
    })

    test.afterEach(async () => {
        console.log("After Each");
    })

    test.afterAll(async () => {
        console.log("After All");
    })

    test("First test", async ({ page }) => {
        console.log("First test");
    })

    test("Second test", async ({ loggedInPage }) => {
        console.log("Second test");
    })
})