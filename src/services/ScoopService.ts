import { Treatment } from '~/formulas/models/Treatment';
import { FormulaService } from './FormulaService';
import { Util as FormulaUtils } from '~/formulas/util';


export class ScoopService {
    static getAllTreatments = async (): Promise<Treatment[]> => {
        const formulas = FormulaService.getAllFormulas();
        let treatments: Treatment[] = [];
        formulas.forEach((formula) => {
            // TODO: this but more reasonably
            const allTreatments = FormulaUtils.getAllTreatmentsForFormula(formula);
            allTreatments.forEach((t) => {
                // The "var" property must be unique... we might eventually need to define a formal tie-breaker
                if (!treatments.find((existingTreatment) => existingTreatment.id === t.id)) {
                    treatments.push(t);
                }
            });
        });
        return treatments;
    };
}
