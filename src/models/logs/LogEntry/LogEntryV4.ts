import { ReadingEntry } from '../ReadingEntry';
import { TreatmentEntry } from '../TreatmentEntry';

/**
 * Represents readingEntries and treatmentEntries for a given pool
 */
export class LogEntryV4 {
    // The id of this object
    objectId!: string;

    // The objectID of the corresponding pool
    poolId!: string;

    // The auto-generated client timestamp, in milliseconds
    clientTS!: number;

    // The user-editable timestamp, in milliseconds
    userTS!: number;

    // The server-assigned timestamp when this entry was saved, if any
    serverTS?: number;

    // All the readings taken
    readingEntries!: ReadingEntry[];

    // All the treatments performed
    treatmentEntries!: TreatmentEntry[];

    // The id of the formula used to guide this service
    formulaId?: string;

    // [Deprecated] the id + timestamp of the old-style formula
    legacyFormulaKey?: string;

    // The human-friendly name of the formula
    formulaName?: string;

    // Any special thoughts the user had about this log entry.
    notes?: string;

    // If this log entry was imported.
    poolDoctorId?: string;

    // For Realm purposes
    static schema = {
        name: 'LogEntry',
        primaryKey: 'objectId',
        properties: {
            objectId: 'string',
            poolId: 'string',
            readingEntries: 'ReadingEntry[]',
            treatmentEntries: 'TreatmentEntry[]',
            userTS: 'int',
            clientTS: 'int',
            serverTS: 'int?',
            formulaId: 'string?',
            legacyFormulaKey: 'string?',
            formulaName: 'string?',
            notes: 'string?',
            poolDoctorId: 'string?',
        },
    };
}
