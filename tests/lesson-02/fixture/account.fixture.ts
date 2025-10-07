import { test as base } from "@playwright/test";

export const test = base.extend<{ account: string }>({
    account: [async ({ }, use, workerInfo) => {
        const newAccount = `customer-${workerInfo.workerIndex}`;
        await use(newAccount);
    }, { scope: 'worker' }]
})