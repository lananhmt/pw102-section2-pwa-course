import { expect } from "@playwright/test";
import { ProductCategoryAPI } from "../../pom/product-category-API/product-category-api";
import data from "./product-data.json";
import { test } from "./db-fixture";

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

    test("DB integration testing - optimize with DB fixture",
        {
            annotation: {
                type: "Module",
                description: "DB integration"
            },
            tag: ["@DBIntegration", "@database", "@API"]
        },
        async ({ dbIntegration }) => {
            // Update product
            const updateProductResponse = await productCategoryAPI.updateProduct(product_id, productData["newName"], productData["newPrice"]);
            expect(updateProductResponse.status()).toBe(200);

            // Connect DB and verify
            const result = await dbIntegration.query('SELECT * FROM product WHERE id = ?', [product_id]);
            const productFromDB = result[0];
            expect(productFromDB.name).toBe(productData["newName"]);
            expect(productFromDB.price).toBe(productData["newPrice"].toString().concat(".00"));
        })
})