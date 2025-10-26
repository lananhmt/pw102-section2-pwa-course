import { APIRequestContext } from "@playwright/test";

export class ProductCategoryAPI {
    protected readonly request: APIRequestContext;
    baseUrl = "https://betterbytesvn.com/pwa101";

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async createCategory(name: string, description: string) {
        const response = await this.request.post(`${this.baseUrl}/category/create.php`, {
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(
                {
                    "name": name,
                    "description": description
                }
            )
        })
        return response;
    }

    async deleteCategory(category_id: number) {
        const response = await this.request.delete(`${this.baseUrl}/category/delete.php?id=${category_id}`);
        return response;
    }

    async createProduct(name: string, description: string, price: number, quantity: number, category_id: number) {
        const response = await this.request.post(`${this.baseUrl}/product/create.php`, {
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                "name": name,
                "description": description,
                "price": price,
                "quantity": quantity,
                "category_id": category_id,
                "is_active": true
            })
        })
        return response;
    }

    async updateProduct(product_id: number, newName: string, newPrice: number) {
        const response = await this.request.put(`${this.baseUrl}/product/update.php`, {
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                "id": product_id,
                "name": newName,
                "price": newPrice
            })
        })
        return response;
    }

    async deleteProduct(product_id: number) {
        const response = await this.request.delete(`${this.baseUrl}/product/delete.php?id=${product_id}`);
        return response;
    }
}