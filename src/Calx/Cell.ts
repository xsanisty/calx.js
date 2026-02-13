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
    private _dateValue?: Date;                          //Internal UTC Date object for DATE cells
    private _address!: string;                          //Cell address
    private _formula!: string;                          //Cell formula
    private _computed : any;                            //Result of the computed formula
    private _rules : Record<string, RegExp> = {
        address : /^\$?[A-Z]+\$?[0-9]+$/,               //Cell address validation rule (allows $ for absolute refs)
    };

    protected precedents : Record<string, Cell> = {};   //Cells registry required by the formula
    protected dependents : Record<string, Cell> = {};   //Cells registry that depend on this cell

    protected remotePrecedents : Record<string, Cell> = {}; //Cells registry required by the formula from other sheets
    protected remoteDependents : Record<string, Cell> = {}; //Cells registry that depend on this cell from other sheets

    /** Dynamic precedents (column/row ranges) */
    private dynamicPrecedents: {
        columnRanges?: string[];  // e.g., ["A:A", "B:C"]
        rowRanges?: string[];     // e.g., ["1:1", "5:10"]
    } = {};

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

            // Check if value changed to mark dependents as dirty
            const oldValue = this._computed;
            const valueChanged = oldValue !== result;

            this._computed = result;

            // For date type cells, sync internal _dateValue with computed result
            if ((this._type === DataType.DATE || this._type === DataType.DATETIME || this._type === DataType.TIME) &&
                typeof result === 'number' && DateUtil.isValidSerialDate(result)) {
                const date = DateUtil.serialToDate(result);
                const utcDate = new Date(Date.UTC(
                    date.getUTCFullYear(),
                    date.getUTCMonth(),
                    date.getUTCDate(),
                    0, 0, 0, 0
                ));
                this._dateValue = utcDate;
            }

            this._calculated = true;
            this._dirty = false;

            // Dispatch calculation complete event
            this.sheet.dispatcher.dispatch(CellEvent.CALCULATED, {
                cell : this.address,
                value : this._computed
            });

            // If value changed, mark dependents as dirty and recalculate if auto-calculate is enabled
            // However, skip auto-recalculation if this cell is part of a circular reference
            // Circular cells are handled separately via resolveCircularReferences()
            if (valueChanged) {
                this._markDependentsAsDirty();

                // Only auto-recalculate if not part of a circular reference
                if (this.sheet.autoCalculate && !this.sheet.isInCircularReference(this)) {
                    this._recalculateDependents();
                }
            }

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

        // Try to spill using the Sheet's spill method
        const spillSuccess = this.sheet.spill(this.address, arrayResult.values);

        if (!spillSuccess) {
            // Return SPILL error
            this._computed = ErrorType.SPILL;
            this._calculated = true;
            this._dirty = false;
            return this._computed;
        }

        // Return the value for this anchor cell (first element)
        this._computed = arrayResult.getValue(0, 0);
        this._calculated = true;
        this._dirty = false;

        return this._computed;
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

        // Detect and store dynamic precedents (column/row ranges)
        this.updateDynamicPrecedents(formula);

        this.sheet.dispatcher.dispatch(
            CellEvent.FORMULA_CHANGED,
            {
                cell : this.address,
                oldFormula : oldFormula,
                newFormula : formula
            }
        );

        // When formula changes, we need to rebuild dependencies
        // Remove old precedents
        const oldPrecedents = this.getPrecedents();
        if (oldPrecedents) {
            for (const addr in oldPrecedents) {
                const precedent = oldPrecedents[addr];
                if (precedent) {
                    precedent.removeDependent(this);
                }
            }
        }

        // Clear precedents - they will be rebuilt on next calculation
        this.precedents = {};

        // Mark as dirty so it recalculates and rebuilds dependencies on next calculate()
        this.markAsDirty();

        // Trigger immediate dependency rebuild if workbook has been built
        if (this.sheet.workbook && formula) {
            this.sheet.rebuildCellDependencies(this);
        }
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
                // For date types with internal dateValue, convert to Excel serial number
                if (this._dateValue instanceof Date) {
                    return DateUtil.dateToSerial(this._dateValue);
                }
                // Otherwise return the stored value (for backward compatibility)
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
        // Convert boolean strings to actual booleans for BOOLEAN type cells
        if (this._type === DataType.BOOLEAN && typeof value === 'string') {
            const upperValue = value.trim().toUpperCase();
            if (upperValue === 'TRUE') {
                value = true;
            } else if (upperValue === 'FALSE') {
                value = false;
            }
        }

        // Convert date strings/objects to UTC Date for DATE type cells
        if (this._type === DataType.DATE || this._type === DataType.DATETIME) {
            if (typeof value === 'string' && value.trim() !== '') {
                try {
                    // Try to parse as ISO date string (YYYY-MM-DD)
                    const parts = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
                    if (parts) {
                        const year = parseInt(parts[1], 10);
                        const month = parseInt(parts[2], 10) - 1; // Month is 0-based
                        const day = parseInt(parts[3], 10);
                        // Create UTC date
                        const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
                        this._dateValue = date;
                        value = DateUtil.dateToSerial(date);
                    } else {
                        // Fallback to default Date parsing
                        const date = new Date(value);
                        if (!isNaN(date.getTime())) {
                            // Convert to UTC (use UTC methods to avoid timezone shifts)
                            const utcDate = new Date(Date.UTC(
                                date.getUTCFullYear(),
                                date.getUTCMonth(),
                                date.getUTCDate(),
                                0, 0, 0, 0
                            ));
                            this._dateValue = utcDate;
                            value = DateUtil.dateToSerial(utcDate);
                        }
                    }
                } catch (e) {
                    // If parsing fails, keep original value
                }
            } else if (value instanceof Date) {
                // Convert to UTC
                // When given a Date object, interpret its local date components as the intended date
                const utcDate = new Date(Date.UTC(
                    value.getFullYear(),
                    value.getMonth(),
                    value.getDate(),
                    0, 0, 0, 0
                ));
                this._dateValue = utcDate;
                value = DateUtil.dateToSerial(utcDate);
            } else if (typeof value === 'number' && DateUtil.isValidSerialDate(value)) {
                // Convert serial date to UTC Date object
                const date = DateUtil.serialToDate(value);
                const utcDate = new Date(Date.UTC(
                    date.getUTCFullYear(),
                    date.getUTCMonth(),
                    date.getUTCDate(),
                    0, 0, 0, 0
                ));
                this._dateValue = utcDate;
            }
        }

        this._value = value;
        this._formula = '';

        this.sheet.dispatcher.dispatch(CellEvent.VALUE_CHANGED, {cell : this.address, value : value});

        // Mark dependents as dirty regardless of autoCalculate setting
        this._markDependentsAsDirty();

        // Also invalidate any formulas that reference this cell through column/row ranges
        this.sheet.invalidateDynamicDependents(this.address);

        // Auto-recalculate dependents if autoCalculate is enabled
        if (this.sheet.autoCalculate) {
            this._recalculateDependents();
            // After recalculating explicit dependents, recalculate cells with dynamic precedents
            this.sheet.recalculateDirtyCells();
        }
    }

    /**
     * Mark all dependent cells as dirty
     * Uses a visited set to prevent infinite recursion in circular references
     */
    private _markDependentsAsDirty(visited: Set<string> = new Set()) {
        // Prevent infinite recursion - if we've already visited this cell in this traversal, skip it
        if (visited.has(this.address)) {
            return;
        }
        visited.add(this.address);

        const dependents = this.getDependents();
        for (const address in dependents) {
            const dependent = dependents[address];
            dependent.markAsDirty();
            // Recursively mark their dependents as dirty with the same visited set
            dependent._markDependentsAsDirty(visited);
        }
    }

    /**
     * Recalculate all dependent cells
     * Uses a visited set to prevent infinite recursion in circular references
     */
    private _recalculateDependents(visited: Set<string> = new Set()) {
        // Prevent infinite recursion - if we've already calculated this cell in this traversal, skip it
        if (visited.has(this.address)) {
            return;
        }
        visited.add(this.address);

        const dependents = this.getDependents();
        for (const address in dependents) {
            const dependent = dependents[address];
            dependent.calculate();
            // Recursively recalculate their dependents with the same visited set
            dependent._recalculateDependents(visited);
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

        // Return internal UTC Date object if available
        if (this._dateValue instanceof Date) {
            return this._dateValue;
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
        // Store as UTC Date object
        // When given a Date object, interpret its local date components as the intended date
        // (e.g., Jan 15 local time should be Jan 15 UTC, not shifted by timezone)
        const utcDate = new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            0, 0, 0, 0
        ));
        this._dateValue = utcDate;
        this.value = DateUtil.dateToSerial(utcDate);
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
        // Convert to UTC Date object and store
        const date = DateUtil.serialToDate(serialDate);
        const utcDate = new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            0, 0, 0, 0
        ));
        this._dateValue = utcDate;
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
        // Combine local and remote dependents
        return {...this.dependents, ...this.remoteDependents};
    }

    public setDependents(dependents : Record<string, Cell>) {
        this.dependents = dependents;
    }

    public addDependent(cell : Cell) {
        this.dependents[cell.address] = cell;
    }

    public removeDependent(cell : Cell) {
        delete this.dependents[cell.address];
    }

    public addRemoteDependent(cell : Cell) {
        // Use sheet name + address as key to differentiate cells from different sheets
        const key = cell.sheet.name + '!' + cell.address;
        this.remoteDependents[key] = cell;
        this._hasRemoteDependents = true;
    }

    public addRemotePrecedent(cell : Cell) {
        // Use sheet name + address as key to differentiate cells from different sheets
        const key = cell.sheet.name + '!' + cell.address;
        this.remotePrecedents[key] = cell;
    }

    /**
     * Update dynamic precedents by parsing formula for column/row ranges
     */
    private updateDynamicPrecedents(formula: string): void {
        if (!formula) {
            this.dynamicPrecedents = {};
            this._hasDynamicPrecedents = false;
            return;
        }

        const columnRanges: string[] = [];
        const rowRanges: string[] = [];

        // Match column ranges: A:A, B:C, etc.
        const columnPattern = /\b([A-Z]+)\s*:\s*([A-Z]+)\b/g;
        let match;
        while ((match = columnPattern.exec(formula)) !== null) {
            columnRanges.push(match[0]);
        }

        // Match row ranges: 1:1, 5:10, etc. (but not cell ranges like A1:B2)
        const rowPattern = /\b(\d+)\s*:\s*(\d+)\b/g;
        while ((match = rowPattern.exec(formula)) !== null) {
            // Make sure it's not part of a cell range (no letter before the number)
            const beforeMatch = formula[match.index - 1];
            if (!beforeMatch || !/[A-Z]/i.test(beforeMatch)) {
                rowRanges.push(match[0]);
            }
        }

        this.dynamicPrecedents = {};
        if (columnRanges.length > 0) {
            this.dynamicPrecedents.columnRanges = columnRanges;
        }
        if (rowRanges.length > 0) {
            this.dynamicPrecedents.rowRanges = rowRanges;
        }

        this._hasDynamicPrecedents = columnRanges.length > 0 || rowRanges.length > 0;
    }

    /**
     * Check if this cell has dynamic precedents
     */
    public hasDynamicPrecedents(): boolean {
        return this._hasDynamicPrecedents;
    }

    /**
     * Check if this cell depends on a specific column
     */
    public dependsOnColumn(column: string): boolean {
        if (!this._hasDynamicPrecedents || !this.dynamicPrecedents.columnRanges) {
            return false;
        }

        const colNum = this.columnToNumber(column);
        return this.dynamicPrecedents.columnRanges.some(range => {
            const [start, end] = range.split(':').map(c => this.columnToNumber(c.trim()));
            return colNum >= start && colNum <= end;
        });
    }

    /**
     * Check if this cell depends on a specific row
     */
    public dependsOnRow(row: number): boolean {
        if (!this._hasDynamicPrecedents || !this.dynamicPrecedents.rowRanges) {
            return false;
        }

        return this.dynamicPrecedents.rowRanges.some(range => {
            const [start, end] = range.split(':').map(r => parseInt(r.trim()));
            return row >= start && row <= end;
        });
    }

    /**
     * Convert column letter to number (A=1, B=2, etc.)
     */
    private columnToNumber(col: string): number {
        let num = 0;
        for (let i = 0; i < col.length; i++) {
            num = num * 26 + (col.charCodeAt(i) - 64);
        }
        return num;
    }

    // ========== Array Formula / Spill Methods ==========

    /**
     * Mark this cell as an array formula anchor
     */
    public setArrayAnchor(isAnchor: boolean): void {
        this._isArrayAnchor = isAnchor;
    }

    /**
     * Check if this cell is an array formula anchor
     */
    public isArrayAnchor(): boolean {
        return this._isArrayAnchor;
    }

    /**
     * Set the spill range for this array anchor
     */
    public setSpillRange(range: string): void {
        this._spillRange = range;
    }

    /**
     * Get the spill range if this is an array anchor
     */
    public getSpillRange(): string | undefined {
        return this._spillRange;
    }

    /**
     * Mark this cell as a spill result from an anchor cell
     * Spill result cells don't have formulas, they just display values
     * @param anchorAddress The address of the array formula anchor
     * @param value The value for this spill cell
     */
    public setAsSpillResult(anchorAddress: string, value: any): void {
        // Store reference to anchor
        this._arrayResult = ArrayResult.fromSingleValue(anchorAddress as any); // Hack: store anchor address
        this._value = value;
        this._computed = value;
        this._calculated = true;
        this._formula = ''; // Spill results don't have their own formulas
        this._dirty = false;

        // Store anchor address separately since we're misusing ArrayResult
        (this._arrayResult as any).anchorAddress = anchorAddress;
    }

    /**
     * Check if this cell is a spill result
     */
    public isSpillResult(): boolean {
        return this._arrayResult !== undefined && (this._arrayResult as any).anchorAddress !== undefined;
    }

    /**
     * Get the anchor address if this is a spill result
     */
    public getSpillAnchor(): string | null {
        if (this._arrayResult && (this._arrayResult as any).anchorAddress) {
            return (this._arrayResult as any).anchorAddress;
        }
        return null;
    }

    /**
     * Clear spill result status
     */
    public clearSpillResult(): void {
        this._arrayResult = undefined;
    }
}

