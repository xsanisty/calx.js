import { Sheet } from './Sheet';
import { CellEvent } from './Cell/CellEvent';
import { DataType } from './Cell/DataType';
import { ErrorType } from './Cell/ErrorType';
import { FormatterInterface } from './Cell/Formatter';
import { ArrayResult } from './Cell/ArrayResult';
import { DateUtil } from './Utility/DateUtil';

/**
 * Cell object, hold single value or formula
 */
export class Cell {
    private _value : any;                               //Cell original value
    private _address!: string;                          //Cell address
    private _formula!: string;                          //Cell formula
    private _computed : any;                            //Result of the computed formula
    private _rules : Record<string, RegExp> = {
        address : /^[A-Z]+[0-9]+$/,                     //Cell address validation rule
    };

    protected precedents : Record<string, Cell> = {};   //Cells registry required by the formula
    protected dependents : Record<string, Cell> = {};   //Cells registry that depend on this cell

    protected remotePrecedents : Record<string, Cell> = {}; //Cells registry required by the formula from other sheets
    protected remoteDependents : Record<string, Cell> = {}; //Cells registry that depend on this cell from other sheets

    /** Flags */
    private _dirty : boolean = false;
    private _calculated : boolean = false;
    private _hasRemotePrecedents : boolean = false;
    private _hasRemoteDependents : boolean = false;
    private _hasDynamicPrecedents : boolean = false;

    /** Array formula properties */
    private _isArrayAnchor : boolean = false;           // Is this the anchor cell of an array formula?
    private _arrayResult ?: ArrayResult;                 // Array result if this is anchor
    private _spillRange ?: string;                       // Range that this array spills into (e.g., "A1:C3")

    protected format!: string;
    protected formatter!: FormatterInterface;
    protected el ?: any;

    constructor(
        address : string,
        protected sheet : Sheet,
        protected _type : DataType = DataType.NUMBER
    ) {
        this.address = address;
        this.init();
    }

    public init() {

    }

    /** Mount cell object into specific element */
    public mount(el: any) {
        this.el = el;

        this.sheet.dispatcher.dispatch(CellEvent.ELEMENT_MOUNTED, {cell : this.address, el : el});
    }

    /** Check if cell has error value */
    public isError() {
        return Object.values(ErrorType).includes(this.value as ErrorType);
    }

    /** Check if cell has empty-able value, like null, empty string, undefined */
    public isEmpty() {
        // Check the raw value, not the processed value (which may convert null to 0 for NUMBER type)
        const rawValue = this.formula ? this._computed : this._value;
        return rawValue === null || rawValue === undefined || rawValue === '';
    }

    /**
     * Calculate the cell value based on its formula
     */
    public calculate() {
        // If no formula, nothing to calculate
        if (!this._formula) {
            this._calculated = true;
            this._dirty = false;
            return this._value;
        }

        try {
            // Use the sheet's eval method which sets the active sheet context
            const result = this.sheet.eval(this._formula);

            // Check if result is an ArrayResult
            if (result instanceof ArrayResult) {
                return this.handleArrayResult(result);
            }

            this._computed = result;
            this._calculated = true;
            this._dirty = false;

            // Dispatch calculation complete event
            this.sheet.dispatcher.dispatch(CellEvent.CALCULATED, {
                cell : this.address,
                value : this._computed
            });

            return this._computed;
        } catch (error) {
            console.error(`Error calculating cell ${this.address}:`, error);
            this._computed = ErrorType.ERROR;
            this._calculated = true;
            this._dirty = false;
            return this._computed;
        }
    }

    /**
     * Handle array formula result - spill into multiple cells
     */
    private handleArrayResult(arrayResult: ArrayResult): any {
        // Mark this as array anchor
        this._isArrayAnchor = true;
        this._arrayResult = arrayResult;

        // If single value, just return it
        if (arrayResult.isSingleValue()) {
            this._computed = arrayResult.getSingleValue();
            this._calculated = true;
            this._dirty = false;
            return this._computed;
        }

        // Check if we can spill
        const canSpill = this.checkSpillRange(arrayResult);

        if (!canSpill) {
            // Return SPILL error
            this._computed = ErrorType.SPILL;
            this._calculated = true;
            this._dirty = false;
            return this._computed;
        }

        // Spill the array into cells
        this.spillArray(arrayResult);

        // Return the value for this anchor cell
        this._computed = arrayResult.getValue(0, 0);
        this._calculated = true;
        this._dirty = false;

        return this._computed;
    }

    /**
     * Check if the array can spill without blocking
     */
    private checkSpillRange(arrayResult: ArrayResult): boolean {
        const {row: startRow, col: startCol} = this.getCellCoordinates(this.address);

        // Check each cell in the spill range
        for (let r = 0; r < arrayResult.rows; r++) {
            for (let c = 0; c < arrayResult.cols; c++) {
                // Skip the anchor cell
                if (r === 0 && c === 0) continue;

                const targetAddress = this.coordinatesToAddress(startRow + r, startCol + c);
                const targetCell = this.sheet.getCell(targetAddress);

                // If cell exists and has value or formula, it's blocking
                if (targetCell && (!targetCell.isEmpty() || targetCell.formula)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Spill array values into cells
     */
    private spillArray(arrayResult: ArrayResult): void {
        const {row: startRow, col: startCol} = this.getCellCoordinates(this.address);
        const endRow = startRow + arrayResult.rows - 1;
        const endCol = startCol + arrayResult.cols - 1;

        // Store spill range
        this._spillRange = `${this.address}:${this.coordinatesToAddress(endRow, endCol)}`;

        // Spill values into cells
        for (let r = 0; r < arrayResult.rows; r++) {
            for (let c = 0; c < arrayResult.cols; c++) {
                // Skip the anchor cell
                if (r === 0 && c === 0) continue;

                const targetAddress = this.coordinatesToAddress(startRow + r, startCol + c);
                const value = arrayResult.getValue(r, c);

                // Get or create the cell and set its value
                const cell = this.sheet.getCell(targetAddress);
                cell.value = value;
            }
        }
    }

    /**
     * Convert cell address to row/col coordinates
     */
    private getCellCoordinates(address: string): {row: number, col: number} {
        const match = address.match(/^([A-Z]+)(\d+)$/);
        if (!match) throw new Error(`Invalid cell address: ${address}`);

        const colStr = match[1];
        const row = parseInt(match[2]);

        // Convert column letters to number
        let col = 0;
        for (let i = 0; i < colStr.length; i++) {
            col = col * 26 + (colStr.charCodeAt(i) - 64);
        }

        return {row, col};
    }

    /**
     * Convert row/col coordinates to cell address
     */
    private coordinatesToAddress(row: number, col: number): string {
        let colStr = '';
        let c = col;

        while (c > 0) {
            const remainder = (c - 1) % 26;
            colStr = String.fromCharCode(65 + remainder) + colStr;
            c = Math.floor((c - 1) / 26);
        }

        return colStr + row;
    }

    /**
     * Check if this cell is an array anchor
     */
    public isArrayAnchor(): boolean {
        return this._isArrayAnchor;
    }

    /**
     * Get the spill range if this is an array anchor
     */
    public getSpillRange(): string | undefined {
        return this._spillRange;
    }

    /**
     * Set cell format
     */
    public setFormat(format: string) {
        this.format = format;
    }

    /**
     * Set cell formatter
     */
    public setFormatter(formatter: any) {
        this.formatter = formatter;
    }

    /**
     * Get formatted value
     */
    public getFormattedValue(): string {
        if (this.formatter) {
            return this.formatter.format(this.value);
        }
        return this.value?.toString() || '';
    }

    /** Check if cell is calculated already */
    public isCalculated() : boolean {
        return this._calculated
    }

    /** Check if cell is affected by changes on other cells and need recalculation */
    public isDirty() : boolean {
        return this._dirty
    }

    public markAsDirty() {
        this._dirty = true;
    }

    /** Check if the current is numeric */
    public isNumeric() : boolean {
        return !isNaN(this.value - parseFloat(this.value));
    }

    public get address() : string {
        return this._address;
    }

    public set address(address : string) {
        if (address.match(this._rules.address)) {
            this._address = address;
            return;
        }

        throw new Error("Cell address should follow spreadsheet like address rule");
    }

    /**
     * Get cell data type
     */
    public get type() : DataType {
        return this._type;
    }

    /**
     * Set cell data type
     */
    public set type(type : DataType) {
        this._type = type;
    }

    /**
     * Get cell formula
     */
    public get formula() : string {
        return this._formula;
    }

    /**
     * Set cell formula, and notify the parent sheet
     */
    public set formula(formula : string) {
        const oldFormula = this._formula;
        this._formula = formula;

        this.sheet.dispatcher.dispatch(
            CellEvent.FORMULA_CHANGED,
            {
                cell : this.address,
                oldFormula : oldFormula,
                newFormula : formula
            }
        )
    }

    /**
     * Get the value of the cell, if it has formula, return the computed value
     */
    public get value() : any | ErrorType {
        let value : any | ErrorType = this.formula ? this._computed : this._value;

        // Check if it's an error value first, return as-is
        if (typeof value === 'string' && Object.values(ErrorType).includes(value as ErrorType)) {
            return value;
        }

        switch (this._type) {
            case DataType.NUMBER:
                // Handle null, undefined, or empty string as 0 for calculations
                if (value === null || value === undefined || value === '') {
                    return 0;
                }
                // Only parse as number if it's not already a number
                if (typeof value === 'number') {
                    return value;
                }
                // Parse to number, but check if result is NaN
                const parsed = parseFloat(value);
                // Return the original value if it can't be parsed (like text)
                // This allows text values to remain text even in NUMBER cells
                return isNaN(parsed) ? value : parsed;
            case DataType.BOOLEAN:
                return !!value;
            case DataType.DATE:
            case DataType.DATETIME:
            case DataType.TIME:
                // For date types, return the Excel serial number (not converted to Date object)
                // Users can call getDateValue() to get a JavaScript Date object
                return value;
            case DataType.ERROR:
                return ErrorType[value as keyof typeof ErrorType];
            default:
                return value;
        }
    }

    /**
     * Set cell value, this will reset the formula
     */
    public set value(value : any) {
        this._value = value;
        this._formula = '';

        this.sheet.dispatcher.dispatch(CellEvent.VALUE_CHANGED, {cell : this.address, value : value});

        // Mark dependents as dirty regardless of autoCalculate setting
        this._markDependentsAsDirty();

        // Auto-recalculate dependents if autoCalculate is enabled
        if (this.sheet.autoCalculate) {
            this._recalculateDependents();
        }
    }

    /**
     * Mark all dependent cells as dirty
     */
    private _markDependentsAsDirty() {
        const dependents = this.getDependents();
        for (const address in dependents) {
            const dependent = dependents[address];
            dependent.markAsDirty();
            // Recursively mark their dependents as dirty
            dependent._markDependentsAsDirty();
        }
    }

    /**
     * Recalculate all dependent cells
     */
    private _recalculateDependents() {
        const dependents = this.getDependents();
        for (const address in dependents) {
            const dependent = dependents[address];
            dependent.calculate();
            // Recursively recalculate their dependents
            dependent._recalculateDependents();
        }
    }

    public getStringValue() : string {
        return this.value.toString();
    }

    public getNumericValue() : number {
        return isNaN (parseFloat(this.value)) ? 0 : parseFloat(this.value);
    }

    /**
     * Get cell value as JavaScript Date object
     * Works for DATE, TIME, and DATETIME types
     * @returns JavaScript Date object if cell contains a date, null otherwise
     */
    public getDateValue(): Date | null {
        // Check if cell is a date type
        if (this._type !== DataType.DATE && this._type !== DataType.DATETIME && this._type !== DataType.TIME) {
            return null;
        }

        const val = this.value;

        // If already a Date object, return it
        if (val instanceof Date) {
            return val;
        }

        // If it's a number (Excel serial date), convert it
        if (typeof val === 'number' && DateUtil.isValidSerialDate(val)) {
            return DateUtil.serialToDate(val);
        }

        // Try parsing as date string
        if (typeof val === 'string') {
            const date = new Date(val);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }

        return null;
    }

    /**
     * Get cell value as Excel serial date number
     * Works for DATE, TIME, and DATETIME types
     * @returns Excel serial date number if cell contains a date, null otherwise
     */
    public getSerialDateValue(): number | null {
        // Check if cell is a date type
        if (this._type !== DataType.DATE && this._type !== DataType.DATETIME && this._type !== DataType.TIME) {
            return null;
        }

        const val = this.value;

        // If it's already a number and valid, return it
        if (typeof val === 'number' && DateUtil.isValidSerialDate(val)) {
            return val;
        }

        // If it's a Date object, convert it
        if (val instanceof Date) {
            return DateUtil.dateToSerial(val);
        }

        // Try parsing as date string and converting
        if (typeof val === 'string') {
            try {
                return DateUtil.fromISOString(val);
            } catch {
                return null;
            }
        }

        return null;
    }

    /**
     * Set cell value from a JavaScript Date object
     * Automatically sets the cell type to DATE and stores as Excel serial number
     * @param date JavaScript Date object
     */
    public setDateValue(date: Date): void {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new Error('Invalid date: must be a valid Date object');
        }

        this._type = DataType.DATE;
        this.value = DateUtil.dateToSerial(date);
    }

    /**
     * Set cell value from Excel serial date number
     * Automatically sets the cell type to DATE
     * @param serialDate Excel serial date number
     */
    public setSerialDateValue(serialDate: number): void {
        if (!DateUtil.isValidSerialDate(serialDate)) {
            throw new Error('Invalid serial date: must be a valid number');
        }

        this._type = DataType.DATE;
        this.value = serialDate;
    }

    /**
     * Get formatted date string (ISO format: YYYY-MM-DD)
     * @returns ISO date string if cell contains a date, null otherwise
     */
    public getFormattedDate(): string | null {
        const serialDate = this.getSerialDateValue();
        if (serialDate === null) {
            return null;
        }

        return DateUtil.toISOString(serialDate);
    }

    /**
     * Check if this cell contains a date value
     * @returns True if cell has DATE, TIME, or DATETIME type
     */
    public isDate(): boolean {
        return this._type === DataType.DATE ||
               this._type === DataType.DATETIME ||
               this._type === DataType.TIME;
    }

    public getPrecedents() : Record<string, Cell>|null {
        if (this._hasDynamicPrecedents) {
            return null;
        } else {
            return this.precedents;
        }
    }

    public setPrecedents(precedents : Record<string, Cell>) {
        this.precedents = precedents;
    }

    public addPrecedent(cell : Cell) {
        this.precedents[cell.address] = cell;
    }

    public getDependents() : Record<string, Cell> {
        return this.dependents;
    }

    public setDependents(dependents : Record<string, Cell>) {
        this.dependents = dependents;
    }

    public addDependent(cell : Cell) {
        this.dependents[cell.address] = cell;
    }
}
