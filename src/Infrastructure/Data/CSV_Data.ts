
import Papa from 'papaparse';
import * as fs from 'fs';
import path from 'path';

export class CSVData {
    private _readCSVFromFile<T>(filePath: string): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const fileContent = fs.readFileSync(filePath, 'utf-8');

            Papa.parse<T>(fileContent, {
                header: true,           // Primera fila como headers
                dynamicTyping: true,    // Convierte números/booleans automáticamente
                skipEmptyLines: true,   // Ignora líneas vacías
                transformHeader: (header) => {
                    // Limpia espacios en blanco de los headers
                    return header.trim().toLowerCase().replace(/\s+/g, '_');
                },
                complete: (results) => {
                    if (results.errors.length > 0) {
                        console.error('Errores al parsear CSV:', results.errors);
                    }
                    resolve(results.data);
                },
                error: (error: any) => {
                    reject(error);
                }
            });
        });
    }

    async getVulneablePasswordsData(): Promise<string[]> {
        const csvPath = path.join(__dirname, 'VulneablePasswords.csv');
        const data = await this._readCSVFromFile<{ rank: number, password: string }>(csvPath);
        const formatData = data.map(item => `${item.password}`);
        return formatData;
    }
}