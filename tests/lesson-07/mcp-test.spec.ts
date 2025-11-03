import { test, expect } from '@playwright/test';

test.describe('E-commerce Cart Test Suite', () => {
    test(
        'should add multiple products to cart and verify cart items',
        {
            tag: ['@cart', '@UI'],
            annotation: {
                type: 'Module ID',
                description: 'E-commerce cart'
            }
        },
        async ({ page }) => {

            await test.step('Step 1: Navigate to page and verify heading', async () => {
                await page.goto('https://material.playwrightvn.com/02-xpath-product-page.html');
                const heading = page.locator('h1');
                await expect(heading).toHaveText('Simple E-commerce');
            });

            await test.step('Step 2: Add products to cart and verify quantities', async () => {
                // Add Product 1: 2 items
                await page.locator('button.add-to-cart[data-product-id="1"]').click();
                await page.locator('button.add-to-cart[data-product-id="1"]').click();

                // Add Product 2: 3 items
                await page.locator('button.add-to-cart[data-product-id="2"]').click();
                await page.locator('button.add-to-cart[data-product-id="2"]').click();
                await page.locator('button.add-to-cart[data-product-id="2"]').click();

                // Add Product 3: 1 item
                await page.locator('button.add-to-cart[data-product-id="3"]').click();

                // Verify cart items
                const cartItems = page.locator('#cart-items tr');
                await expect(cartItems).toHaveCount(3); // Verify total number of unique products

                // Verify quantities for each product
                const product1Quantity = page.locator('//tr[td[text()="Product 1"]]/td[3]');
                const product2Quantity = page.locator('//tr[td[text()="Product 2"]]/td[3]');
                const product3Quantity = page.locator('//tr[td[text()="Product 3"]]/td[3]');

                await expect(product1Quantity).toHaveText('2');
                await expect(product2Quantity).toHaveText('3');
                await expect(product3Quantity).toHaveText('1');
            });
        });
});
