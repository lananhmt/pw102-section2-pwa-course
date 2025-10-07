import { test } from "./fixture/account.fixture";

test.describe("Creating fixture variants", async () => {
    test("Test 1", async ({ account }) => {
        console.log("Test 1 account: ", account);
    })

    test("Test 2", async ({ account }) => {
        console.log("Test 2 account: ", account);
    })

    test("Test 3", async ({ account }) => {
        console.log("Test 3 account: ", account);
    })
})