import { useEffect, useMemo, useState } from 'react';
import Realm from 'realm';
import { Formula } from '~/formulas/models/Formula';
import { FormulaID } from '~/formulas/models/FormulaID';
import { LogEntry } from '~/models/logs/LogEntry';
import { IPool, Pool } from '~/models/Pool';
import { TargetRangeOverride } from '~/models/Pool/TargetRangeOverride';
import { Database } from '~/repository/Database';
import { FormulaService } from '~/services/FormulaService';
import { Util } from '~/services/Util';

import { RealmUtil } from '../services/RealmUtil';

export const useRealmPoolsHook = (): IPool[] => {
    const [data, setData] = useState<IPool[]>(() => {
        const realmPools = Database.loadPools();
        return RealmUtil.poolsToPojo(realmPools);
    });

    // This runs around the time when ComponentDidMount used to be called
    useEffect(() => {
        const handleChange = (newData: Realm.Collection<Pool>) => {
            const plainPools = RealmUtil.poolsToPojo(newData);
            setData(plainPools);
        };

        const dataQuery = Database.loadPools();
        dataQuery.addListener(handleChange);
        return () => {
            dataQuery.removeAllListeners();
        };
    }, []);

    return data; // this hook will return only the data from realm
};

export const useRealmPoolHistoryHook = (poolId: string | null): LogEntry[] => {
    const [data, setData] = useState<LogEntry[]>([]);

    // This runs around the time when ComponentDidMount used to be called
    useEffect(() => {
        if (!poolId) { return () => {};}

        const handleChange = (newData: Realm.Collection<LogEntry>) => {
            setData(RealmUtil.logEntriesToPojo(newData));
        };

        const logEntryCollection = Database.loadLogEntriesForPool(poolId, null, true);
        setData(RealmUtil.logEntriesToPojo(logEntryCollection));

        logEntryCollection.addListener(handleChange);
        // This will run sort-of like componentWillUnmount or whatever that lifecycle method was called
        return () => {
            logEntryCollection.removeAllListeners();
        };

    }, [poolId]);

    return data; // this hook will return only the data from realm
};

/// This runs once and does NOT listen for any changes.
export const useLastLogEntryHook = (poolId: string): LogEntry | null => {
    const [data] = useState<LogEntry | null>(() => {
        if (!poolId) { return null; }
        const realmLogEntries = Database.loadLastLogEntryForPool(poolId);
        const logEntries = RealmUtil.logEntriesToPojo(realmLogEntries);
        return Util.firstOrNull(logEntries);
    });
    return data;
};

// TODO: make this not a hook anymore.
export const useLoadFormulaHook = (formulaID?: FormulaID): Formula => {
    const id = formulaID ?? FormulaService.defaultFormulaId;
    return useMemo(() => FormulaService.getFormulaById(id), [id]);
};

/// This pulls all target range overrides for a given pool
export const useRealmPoolTargetRangesForPool = (poolId: string | null): TargetRangeOverride[] => {
    const [data, setData] = useState<TargetRangeOverride[]>(() => {
        if (!poolId) { return []; }
        const realmCustomTarget = Database.loadCustomTargets(poolId);
        const parserData = RealmUtil.customTargetToPojo(realmCustomTarget);
        return parserData;
    });

    useEffect(() => {
        if (!poolId) { return () => {}; }

        const handleChange = (newData: Realm.Collection<TargetRangeOverride>) => {
            const parserData = RealmUtil.customTargetToPojo(newData);
            setData(parserData);
        };
        const dataQuery = Database.loadCustomTargets(poolId);
        dataQuery.addListener(handleChange);

        // This will run sort-of like componentWillUnmount or whatever that lifecycle method was called
        return () => {
            dataQuery.removeAllListeners();
        };
    }, [poolId]);

    return data;
};

/// This pulls a single target range override for a given pool & target_id.
export const useRealmPoolTargetRange = (id: string, poolId?: string): TargetRangeOverride | null => {
    const data = useRealmPoolTargetRangesForPool(poolId ?? null);
    return Util.firstOrNull(data.filter((ct) => ct.id === id));
};
