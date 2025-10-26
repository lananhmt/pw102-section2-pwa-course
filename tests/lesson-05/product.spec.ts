import { test, expect } from "@playwright/test";
import { ProductCategoryAPI } from "../../pom/product-category-API/product-category-api";
import { DataSource } from "typeorm";
import data from "./product-data.json";

test.describe("Database integration", async () => {
    let productCategoryAPI: ProductCategoryAPI;
    let category_id: number;
    let product_id: number;
    const categoryData = data["category"];
    const productData = data["product"];

    test.beforeEach(async ({ request }) => {
        productCategoryAPI = new ProductCategoryAPI(request);
        // Create category
        const createCategoryResponse = await productCategoryAPI.createCategory(categoryData["name"], categoryData["description"]);
        expect(createCategoryResponse.status()).toBe(200);
        const createCategoryResponseBody = await createCategoryResponse.json();
        category_id = createCategoryResponseBody["category"]["id"];

        // Create product
        const createProductResponse = await productCategoryAPI.createProduct(productData["name"], productData["description"], productData["price"], productData["quantity"], category_id);
        expect(createProductResponse.status()).toBe(200);
        const createProductResponseBody = await createProductResponse.json();
        product_id = createProductResponseBody["product"]["id"];
    })

    test.afterEach(async () => {
        // Delete product
        const deleteProductResponse = await productCategoryAPI.deleteProduct(product_id);
        expect(deleteProductResponse.status()).toBe(200);

        // Delete category
        const deleteCategoryResponse = await productCategoryAPI.deleteCategory(category_id);
        expect(deleteCategoryResponse.status()).toBe(200);
    })

    test("DB integration testing",
        {
            annotation: {
                type: "Module",
                description: "DB integration"
            },
            tag: ["@DBIntegration", "@database", "@API"]
        },
        async () => {
            // Update product
            const updateProductResponse = await productCategoryAPI.updateProduct(product_id, productData["newName"], productData["newPrice"]);
            expect(updateProductResponse.status()).toBe(200);

            // Connect DB and verify
            const db = new DataSource({
                type: 'mysql',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || "3306"),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            })
            try {
                await db.initialize();
                const result = await db.query('SELECT * FROM product WHERE id = ?', [product_id]);
                const productFromDB = result[0];
                expect(productFromDB.name).toBe(productData["newName"]);
                expect(productFromDB.price).toBe(productData["newPrice"].toString().concat(".00"));
            } catch (err) {
                console.error('Failed to initialize DB:', err);
                throw err;
            } finally {
                await db.destroy();
            }
        })
})