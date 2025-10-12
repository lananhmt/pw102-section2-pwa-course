import * as fs from 'fs';

export function JSONReader(jsonFilePath: string) {
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    return JSON.parse(jsonData);
}