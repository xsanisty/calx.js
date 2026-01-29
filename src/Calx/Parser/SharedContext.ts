import { Sheet } from "../Sheet"
import { Workbook } from "../Workbook"
import { FormulaJSWrapper, createFormulaJSWrapper } from "../Formula/FormulaJSWrapper";

export type SharedContextInterface = {
    /**
     * The workbook as main context of the parser
     */
    workbook ?: Workbook,

    /**
     * Collection of sheets in the workbook
     */
    sheets : Record<string, Sheet>,

    /**
     * Current active sheet which the parser will refer to when parsing formula
     */
    activeSheet ?: Sheet,

    /**
     * Utility that can be used inside the parser
     */
    utility : object,

    /**
     * Default comparator for comparing cell and value
     */
    comparator ?: {
        equal : (a : any, b : any) => boolean,
        notEqual : (a : any, b : any) => boolean,
        lessThan : (a : any, b : any) => boolean,
        greaterThan : (a : any, b : any) => boolean,
        lessEqualThan : (a : any, b : any) => boolean,
        greaterEqualThan : (a : any, b : any) => boolean,
    }

    /**
     * Methods for getting values from the workbook
     */
    getFunction?: (name: string) => Function | undefined;
    getVariable?: (name: string, sheetName?: string) => any;
    getCellValue?: (ref: string, sheetName?: string) => any;
    getCellRange?: (range: string, sheetName?: string) => any[];
    getRowRange?: (range: string, sheetName?: string) => any[];
    getColumnRange?: (range: string, sheetName?: string) => any[];
    getNamedRange?: (name: string) => any;
}

export class SharedContext implements SharedContextInterface {

    public workbook ?: Workbook;

    public sheets : Record<string, Sheet> = {};

    public activeSheet ?: Sheet;

    public utility!: object;

    private _formulaJSWrapper?: FormulaJSWrapper;

    public comparator ?: {
        equal : (a : any, b : any) => boolean,
        notEqual : (a : any, b : any) => boolean,
        lessThan : (a : any, b : any) => boolean,
        greaterThan : (a : any, b : any) => boolean,
        lessEqualThan : (a : any, b : any) => boolean,
        greaterEqualThan : (a : any, b : any) => boolean,
    };

    constructor(init ?: Partial<SharedContextInterface>) {
        Object.assign(this, init);
        this._formulaJSWrapper = createFormulaJSWrapper(this);
    }

    setActiveSheet(sheet : Sheet) {
        this.activeSheet = sheet;
    }

    setWorkbook(workbook : Workbook) {
        this.workbook = workbook;
    }

    addSheet(sheet : Sheet) {
        this.sheets[sheet.id] = sheet;
    }

    callFunction(name : string, args : any[]) : any {
        // Use FormulaJS wrapper
        if (this._formulaJSWrapper) {
            return this._formulaJSWrapper.callFunction(name, args);
        }
        return '#NAME?';
    }

    getFunction(name: string): Function | undefined {
        // Check FormulaJS first (workbook custom functions can be added later)
        if (this._formulaJSWrapper) {
            return this._formulaJSWrapper.getFunction(name);
        }

        return undefined;
    }

    getVariable(name: string, sheetName?: string): any {
        const sheet = sheetName ? this.sheets[sheetName] : this.activeSheet;
        if (sheet) {
            // Variables are managed by the sheet
            return sheet.getVariable(name);
        }
        return "#NAME?";
    }

    getCellValue(ref: string, sheetName?: string): any {
        let sheet = this.activeSheet;

        if (sheetName) {
            // Try to find sheet by name or id
            sheet = this.sheets[sheetName] || Object.values(this.sheets).find(s => s.name === sheetName);
        }

        if (sheet) {
            return sheet.getCellValue(ref);
        }
        return "#REF!";
    }

    getCellRange(range: string, sheetName?: string): any[] {
        const sheet = sheetName ? this.sheets[sheetName] : this.activeSheet;
        if (sheet) {
            // Parse range like "A1:B2"
            const [start, end] = range.split(':');
            return sheet.getCellRangeValues(start, end);
        }
        return [];
    }

    getRowRange(range: string, sheetName?: string): any[] {
        const sheet = sheetName ? this.sheets[sheetName] : this.activeSheet;
        if (sheet) {
            // Parse range like "1:3" (rows 1 to 3)
            return sheet.getRowRangeValues(range);
        }
        return [];
    }

    getColumnRange(range: string, sheetName?: string): any[] {
        const sheet = sheetName ? this.sheets[sheetName] : this.activeSheet;
        if (sheet) {
            // Parse range like "A:C" (columns A to C)
            return sheet.getColumnRangeValues(range);
        }
        return [];
    }

    getNamedRange(name: string): any {
        if (this.workbook) {
            return this.workbook.nameManager.resolve(name);
        }
        return "#NAME?";
    }
}