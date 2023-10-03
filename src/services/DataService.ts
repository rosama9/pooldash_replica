import { LogEntry } from '~/models/logs/LogEntry';
import {  Pool } from '~/models/Pool';
import { Database } from '~/repository/Database';
import { jsonToCSV } from 'react-native-csv';

import { ConversionUtil } from './ConversionsUtil';
import { Util } from './Util';
import { ReadingEntryV2 } from '~/models/logs/ReadingEntry/ReadingEntryV2';
import { TreatmentEntryV2 } from '~/models/logs/TreatmentEntry/TreatmentEntryV2';

export namespace DataService {
    /// Returns the base64 encoded file data.
    /// Really, this should stream to a file & not happen on the main thread.
    /// But, Android file-sharing is tedious, and idk if multi-threading in RN or js even works.
    export const generateCsvFileForAllPools = (): string => {
        let dataString = 'pool_dash,export\n';

        dataString += Database.loadPools()
            .map((pool) => generateCSVEntriesForPool(pool))
            .join('\n**************\n');

        return dataString;
    };

    export const newGenerateCsvFileForAllPools = () => {
      const data = {
        // Maybe not needed.
          dataString: 'pool_dash,export',
          data: Database.loadPools().map((pool) => {
              return generateJSONForPool(pool);
          }),
      };

      const json = JSON.stringify(data);

      const csv = jsonToCSV(json);

      return csv;

    };

    export const generateJSONForPool = (pool: Pool): any => {
      const logsToJson = Database.loadLogEntriesForPool(pool.objectId, null, true).map((log: any): LogEntry => {
        return newGetRowsForEntry(log);
      });

      const data = {
        name: pool.name,
        gallons: pool.gallons,
        liters: ConversionUtil.usGallonsToLiters(pool.gallons),
        imperialGallons: ConversionUtil.usGallonsToImpGallon(pool.gallons),
        waterType: pool.waterType,
        wallType: pool.wallType,
        formulaId: pool.formulaId,
        objectId: pool.objectId,
        logs: JSON.stringify(logsToJson),
      };

      return data;
    };


    const newGetRowsForEntry = (entry: any): LogEntry => {

      const readingEntries = entry.readingEntries.map((reading: ReadingEntryV2): ReadingEntryV2 => {
        return {
          readingName: reading.readingName,
          id: reading.id,
          value: reading.value,
          units: reading.units,
        };
      });

      const treatmentEntries = entry.treatmentEntries.map((treatment: TreatmentEntryV2): TreatmentEntryV2  => {
        return {
          type: treatment.type,
          treatmentName: Util.getDisplayNameForTreatment({ name: treatment.treatmentName, concentration: treatment.concentration }),
          id: treatment.id,
          displayAmount: treatment.displayAmount,
          displayUnits: treatment.displayUnits || '',
          ounces: treatment.ounces,
        };});

      const data = {
        type: 'log_entry',
        userTS: entry.userTS,
        clientTS: entry.clientTS,
        formulaId: entry.formulaId,
        objectId: entry.objectId,
        poolId: entry.poolId,
        readingEntries: readingEntries,
        treatmentEntries: treatmentEntries,
      };

      return data;

    };


    /// Returns the base64 encoded file data
    export const generateCsvFileForPool = (pool: Pool): string => {
        let dataString = 'pool_dash,export\n';

        dataString += generateCSVEntriesForPool(pool);

        return dataString;
    };

    const generateCSVEntriesForPool = (pool: Pool): string => {
        let result = `\npool,\
            ${pool.name},\
            ${pool.gallons},\
            us gallons,\
            ${ConversionUtil.usGallonsToLiters(pool.gallons)},\
            liters,\
            ${ConversionUtil.usGallonsToImpGallon(pool.gallons)},\
            imperial gallons,\
            ${pool.waterType},\
            ${pool.wallType},\
            ${pool.formulaId ?? ''},\
            ${pool.objectId}`;
        const logs = Database.loadLogEntriesForPool(pool.objectId, null, true);
        logs.forEach((entry) => {
            result += `${getRowsForEntry(entry)}\n`;
        });
        return result;
    };

    const getRowsForEntry = (logEntry: LogEntry): string => {
        let result = `\nlog_entry,\
            ${new Date(logEntry.userTS).toISOString()},\
            ${logEntry.notes ?? '---'},\
            ${logEntry.formulaId},\
            ${logEntry.objectId}`;
        logEntry.readingEntries.forEach((re) => {
            result += `\nreading,\
                ${re.readingName},\
                ${re.id},\
                ${re.value},\
                ${re.units ?? ''}`;
        });
        logEntry.treatmentEntries.forEach((te) => {
            result += `\ntreatment,\
                ${Util.getDisplayNameForTreatment({ name: te.treatmentName, concentration: te.concentration })},\
                ${te.id},\
                ${te.displayAmount},\
                ${te.displayUnits ?? ''},\
                ${te.ounces},\
                ounces`;
        });
        return result;
    };
}
