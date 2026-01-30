import { CalxInterpreter } from "./Calx/Parser/Chevrotain/Interpreter";
import { CalxParser } from "./Calx/Parser/Chevrotain/Parser";
import { Workbook } from "./Calx/Workbook";
import { Data } from "./Calx/Workbook/Data";
import { DateUtil } from "./Calx/Utility/DateUtil";
import { DataType } from "./Calx/Cell/DataType";

// Export utilities
export { DateUtil };

// Export enums
export { DataType };

// Export types
export type { Data };

export class Calx {

    static formulae : Record<string, Function> = {};

    // Expose DataType enum as a static property for easy access
    static DataType = DataType;

    static setFormula(name : string, formula : Function) {
        Calx.formulae[name] = formula;
    }

    static setFormulae(formulae : Record<string, Function>) {
        Calx.formulae = {
            ...Calx.formulae,
            ...formulae,
        };
    }

    static createWorkbook() {
        const data : Data = {
            sheets : {},
        }

        return Calx.createWorkbookFromData(data);
    }

    static createWorkbookFromData(data : Data) {
        return Workbook.createFromData(data);
    }

    static createWorkbookFromElement(element : any, data ?: Data) {
        return Workbook.createFromElement(element, data);
    }

    static createParser() {
        return new CalxParser();
    }

    static createInterpreter() {
        return new CalxInterpreter();
    }

    static exportJSON(workbook: Workbook): Data {
        return workbook.exportJSON();
    }
}