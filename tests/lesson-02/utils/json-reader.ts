import fs from "fs";

export function JSONDataReader(jsonFilePath: string) {
    const data = fs.readFileSync(jsonFilePath, 'utf-8');
    return JSON.parse(data);
}