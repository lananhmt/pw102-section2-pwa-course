import { type FullConfig } from '@playwright/test';
import fs from 'fs';

async function globalTeardown(config: FullConfig) {
    const { browserName, storageState } = config.projects[0].use;
    fs.unlinkSync(storageState as string);
}

export default globalTeardown;