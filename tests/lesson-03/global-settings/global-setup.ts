import { chromium, webkit, firefox, type FullConfig } from '@playwright/test';
import { LoginPage } from '../../../pom/e-commerce-web/admin/login-page';

async function globalSetup(config: FullConfig) {
    const { browserName, storageState } = config.projects[0].use;
    let browser: any;
    switch (browserName) {
        case "chromium": browser = await chromium.launch();
        case "webkit": browser = await webkit.launch();
        case "firefox": browser = await firefox.launch();
    }
    const page = await browser.newPage();
    const loginPage = new LoginPage(page);
    loginPage.loginPass();
    await page.context().storageState({ path: storageState });
}

export default globalSetup;