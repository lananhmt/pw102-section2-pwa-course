import { APIRequestContext, request } from "@playwright/test";

export class ProductAPI {
    protected requestContext: APIRequestContext;
    baseUrl = `${process.env.BASE_URL}wp-json/wc/v3/products`;

    constructor(requestContext: APIRequestContext) {
        this.requestContext = requestContext;
    }

    async createNewContext() {
        this.requestContext = await request.newContext({
            baseURL: this.baseUrl,
            extraHTTPHeaders: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${process.env.API_KEY}`
            }
        });
        return this.requestContext;
    }

    async createProduct(productName: string, regularPrice: string, salePrice: string) {
        const request = await this.createNewContext();
        const response = await request.post(this.baseUrl, {
            data: {
                "name": productName,
                "regular_price": regularPrice,
                "sale_price": salePrice
            }
        });
        return response;
    }

    async addReview(productId: number, review: string, reviewer: string, email: string) {
        const request = await this.createNewContext();
        const response = await request.post(`${this.baseUrl}/reviews`, {
            data: {
                "product_id": productId,
                "review": review,
                "reviewer": reviewer,
                "reviewer_email": email,
                "status": "hold"
            }
        });
        return response;
    }

    async approveReview(reviewId: number) {
        const request = await this.createNewContext();
        const response = await request.put(`${this.baseUrl}/reviews/${reviewId}`, {
            data: {
                "status": "approved"
            }
        });
        return response;
    }
    
    async deleteProduct(productId: number) {
        const request = await this.createNewContext();
        const response = await request.delete(`${this.baseUrl}/${productId}`, {
            data: {
                "force": true
            }
        });
        return response;
    }
}