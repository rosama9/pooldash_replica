import Realm from 'realm';
import { LogEntry } from '~/models/logs/LogEntry';
import { Pool, IPool } from '~/models/Pool';
import { TargetRangeOverride } from '~/models/Pool/TargetRangeOverride';

import { Migrator } from './Migrator';

export class Database {
    static realm: Realm;

    /**
     * Initializes the Realm instance for the app. Also takes the liberty of running version-checks and
     * pre-populating or migrating any necessary data. Maybe that should be de-coupled... meh.
     */
    static prepare = async () => {
        if (Database.realm !== null && Database.realm !== undefined) {
            return Promise.resolve();
        }

        // migrate database
        try {
            Migrator.runMigrations();
        } catch (e) {
            console.warn(e);
        }
        await Realm.open(Migrator.getCurrentSchemaVersion())
            .then((value: Realm) => {
                Database.realm = value;
                return Promise.resolve();
            })
            .catch((e: any) => {
                console.log('error openening database');
                console.error(e);
                return Promise.reject(e);
            });
    };

    static loadPools = (query?: string): Realm.Collection<Pool> => {
        if (Database.realm === undefined) {
            console.error('wait on realm to load');
        }

        let results = Database.realm.objects<Pool>(Pool.schema.name);
        if (query) {
            results = results.filtered(query);
        }
        return results;
    };

    static saveNewPool = (unsavedPool: IPool): IPool | null => {
        const realm = Database.realm;
        const pool: IPool = {
            ...unsavedPool,
        };
        try {
            realm.write(() => {
                realm.create(Pool.schema.name, {
                    gallons: pool.gallons,
                    name: pool.name,
                    waterType: pool.waterType,
                    objectId: pool.objectId,
                    formulaId: pool.formulaId,
                    wallType: pool.wallType,
                    email: pool.email,
                    poolDoctorId: pool.poolDoctorId,
                    importMethod: pool.importMethod,
                });
            });
        } catch (e) {
            console.log(e);
            console.error("Couldn't save pool.");

            return null;
        }
        return pool;
    };

    static saveNewLogEntry = async (entry: LogEntry) => {
        const realm = Database.realm;
        try {
            realm.write(() => {
                realm.create(LogEntry.schema.name, {
                    objectId: entry.objectId,
                    poolId: entry.poolId,
                    readingEntries: entry.readingEntries,
                    treatmentEntries: entry.treatmentEntries,
                    clientTS: entry.clientTS,
                    userTS: entry.userTS,
                    serverTS: entry.serverTS,
                    formulaId: entry.formulaId,
                    formulaName: entry.formulaName,
                    notes: entry.notes,
                    poolDoctorId: entry.poolDoctorId,
                    importMethod: entry.importMethod,
                });
            });
            return Promise.resolve();
        } catch (e) {
            console.log("Couldn't save log entry.");
            console.log(e);
            return null;
        }
    };

    static loadLogEntriesForPool = (
        poolId: string,
        since_ts: number | null,
        recentFirst: boolean,
    ): Realm.Collection<LogEntry> => {
        const realm = Database.realm;
        let query = `poolId = "${poolId}"`;
        if (since_ts) {
            query += `AND userTS > ${since_ts}`;
        }
        if (recentFirst) {
            query += ' SORT(userTS DESC)';
        } else {
            query += ' SORT(userTS ASC)';
        }

        // TODO: reconsider this.
        query += 'LIMIT(100)';

        return realm.objects<LogEntry>(LogEntry.schema.name).filtered(query);
    };

    static doesLogEntryExist = (
        poolId: string,
        poolDoctorLogEntryId: string,
    ): boolean => {
        const realm = Database.realm;
        let query = `poolId = "${poolId}" AND poolDoctorId = "${poolDoctorLogEntryId}"`;
        return realm.objects<LogEntry>(LogEntry.schema.name).filtered(query).length > 0;
    };

    /// returns a Realm collection with either 1 or 0 elements
    static loadLastLogEntryForPool = (
        poolId: string,
    ): Realm.Collection<LogEntry> => {
        const realm = Database.realm;
        const query = `poolId = "${poolId}" SORT(userTS DESC) LIMIT(1)`;
        return realm.objects<LogEntry>(LogEntry.schema.name).filtered(query);
    };

    static deletePool = (pool: {objectId: string}) => {
        const realm = Database.realm;
        try {
            // We have to delete the actual realm object
            realm.write(() => {
                const logEntries = realm.objects<LogEntry>(LogEntry.schema.name).filtered(`poolId = "${pool.objectId}"`);
                realm.delete(logEntries);
                const deletedPool = realm.objectForPrimaryKey<Pool>(Pool.schema.name, pool.objectId);
                if (deletedPool) {
                    realm.delete(deletedPool);
                }
            });
            return Promise.resolve();
        } catch (e) {
            console.log(e);
            console.error('couldnt delete it');
            return Promise.reject(e);
        }
    };

    static deleteLogEntry = async (logEntryId: string) => {
        const realm = Database.realm;
        try {
            // We have to delete the actual realm object
            realm.write(() => {
                const logEntry = realm.objectForPrimaryKey<LogEntry>(LogEntry.schema.name, logEntryId);
                if (logEntry) {
                    realm.delete(logEntry);
                }
            });
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    };

    static updatePool = (pool: Pool) => {
        const realm = Database.realm;
        try {
            realm.write(() => {
                const existingPool = realm.objectForPrimaryKey<Pool>(Pool.schema.name, pool.objectId);
                if (existingPool) {
                    existingPool.name = pool.name;
                    existingPool.gallons = pool.gallons;
                    existingPool.formulaId = pool.formulaId;
                    existingPool.waterType = pool.waterType;
                    existingPool.wallType = pool.wallType;
                    existingPool.email = pool.email;
                    existingPool.poolDoctorId = pool.poolDoctorId;
                }
            });
            return Promise.resolve();
        } catch (error) {
            console.error(error);
            return Promise.reject('Error updating a pool');
        }
    };

    static saveNewCustomTarget = async (customTarget: TargetRangeOverride) => {
        console.log('0');
        const realm = Database.realm;
        try {
            // Delete previous values (if any)
            console.log('1');
            realm.write(() => {
                const previousOverrides = Database.realm
                    .objects<TargetRangeOverride>(TargetRangeOverride.schema.name)
                    .filtered('poolId = $0 AND id = $1', customTarget.poolId, customTarget.id);
                realm.delete(previousOverrides);
            });
            // Store some new values
            realm.write(() => {
                console.log('2');
                realm.create<TargetRangeOverride>(
                    TargetRangeOverride.schema.name,
                    {
                        objectId: customTarget.objectId,
                        poolId: customTarget.poolId,
                        id: customTarget.id,
                        min: customTarget.min,
                        max: customTarget.max,
                    },
                    Realm.UpdateMode.Modified,
                );
                console.log('3');
            });
            return Promise.resolve();
        } catch (error) {
            return Promise.reject('Error saving a customTarget');
        }
    };

    static loadCustomTargets = (poolId: string): Realm.Collection<TargetRangeOverride> => {
        const realm = Database.realm;
        const query = `poolId = "${poolId}"`;
        const data = realm.objects<TargetRangeOverride>(TargetRangeOverride.schema.name).filtered(query);
        return data;
    };

    static deleteCustomTarget = (customTarget: TargetRangeOverride) => {
        const realm = Database.realm;
        try {
            // We have to delete the actual realm object
            realm.write(() => {
                const previousOverrides = Database.realm
                    .objects<TargetRangeOverride>(TargetRangeOverride.schema.name)
                    .filtered('poolId = $0 AND id = $1', customTarget.poolId, customTarget.id);
                realm.delete(previousOverrides);
            });
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    };

    static deletePoolsWithPoolDoctorId = async () => {
        const realm = Database.realm;
        const query = 'poolDoctorId != null';
        const pools = realm.objects<Pool>(Pool.schema.name).filtered(query);

        const poolIdsToDelete = pools.map(p => p.objectId);
        poolIdsToDelete.forEach(id => Database.deletePool({ objectId: id }));

        // cleanup, just in case we missed some of these:
        realm.write(() => {
            realm.delete(
                realm.objects<LogEntry>(LogEntry.schema.name).filtered(query)
            );
        });
    }

    static deletePools = async () => {
        const realm = Database.realm;
        const query = 'importMethod != null';
        const imported = realm.objects<Pool>(Pool.schema.name).filtered(query);
        const importedLogs = realm.objects<LogEntry>(LogEntry.schema.name).filtered(query);

        realm.write(() => {
            realm.delete(importedLogs);
            realm.delete(imported);
        });
    }

    static getCSVImportedPoolCount = async (): Promise<number> => {
        const realm = Database.realm;
        const query = 'importMethod != null';
        const importedCount = realm.objects<Pool>(Pool.schema.name).filtered(query).length;

        return importedCount;
    }
}
