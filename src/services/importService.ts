import { TempCsvRepo } from '../repository/TempCsvRepo';
import { readString } from 'react-native-csv';
import { Pool } from '~/models/Pool';
import { LogEntry } from '~/models/logs/LogEntry';


export interface CSVPool extends Pool {
    logs?: LogEntry[];
}

type ConvertCSV_To_JSONProps = {
    data: Array<any>;
    errors: Array<errors>;
    meta: Meta;
};

type errors = {
    type: string;
    code: string;
    message: string;
    row: number;
};

type Meta = {
    aborted: boolean;
    delimiter: string;
    linebreak: string;
    truncated: boolean;
    fields?: Array<string> | undefined;
};

export namespace ImportService {
    export const importFileAsCSV = async (filePath: string) => {
        const csv = await TempCsvRepo.readCSV(filePath);

        return csv;
    };

    export const convertCSV_To_JSON = (csvData: string): ConvertCSV_To_JSONProps => {
        const data = readString(csvData, {
            header: true,
        });

        return data;
    };

    export const convertJSON_To_Pools = (json: any): Array<CSVPool> => {
        const pools = json.map((pool: any): CSVPool => {

            const newPool = {
                objectId: pool.objectId,
                name: pool.name,
                waterType: pool.waterType,
                gallons: parseInt(pool.gallons, 10),
                wallType: pool.wallType,
                formulaId: pool.formulaId ? pool.formulaId : null,
                logs: pool.logs ? JSON.parse(pool.logs) : [],
                imperialGallons: parseInt(pool.imperialGallons, 10),
                liters: parseInt(pool.liters, 10),
            };

            return newPool;
        });

        return pools;
    };
}
