import { expect, test } from "@playwright/test";

test.describe("Test suite", () => {
    test("Test 1: feature A", async() => {
        await test.step("step", () => {
            expect(true).toBe(false);
        })
    })
    test("Test 2: feature B", async() => {
        await test.step("step", () => {
            expect(true).toBe(true);
        })
    })
    test("Test 3: feature C", async() => {
        await test.step("step", () => {
            expect(true).toBe(true);
        })
    })
    test("Test 4: feature D", async() => {
        await test.step("step", () => {
            expect(true).toBe(false);
        })
    })
    test("Test 5: feature E", async() => {
        await test.step("step", () => {
            expect(true).toBe(false);
        })
    })
})