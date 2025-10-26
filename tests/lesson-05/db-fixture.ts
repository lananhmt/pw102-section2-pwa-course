import { test as base } from "@playwright/test";
import { DataSource } from "typeorm";

export const test = base.extend<{ dbIntegration: DataSource }>({
    dbIntegration: async ({ }, use) => {
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
            await use(db);
        } catch (err) {
            console.error('Failed to initialize DB:', err);
            throw err;
        } finally {
            await db.destroy();
        }
    }
})