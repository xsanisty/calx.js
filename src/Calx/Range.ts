import { Cell } from './Cell';
import { Sheet } from './Sheet';
import { DataType } from './Cell/DataType';

/**
 * Range class - Excel-like range that can contain one or more cells
 * This is the lowest unit of work in Calx, mimicking Excel's behavior
 *
 * Examples:
 * - Single cell: Range('A1') contains one cell
 * - Cell range: Range('A1:B10') contains multiple cells
 */
export class Range {
    private _cells: Cell[] = [];
    private _address: string;
    private _startAddress!: string;
    private _endAddress!: string;

    constructor(
        private sheet: Sheet,
        address: string
    ) {
        this._address = address;
        this.parseAddress(address);
        this.loadCells();
    }

    /**
     * Parse address and determine if single cell or range
     */
    private parseAddress(address: string) {
        // Remove $ signs (absolute reference markers) for cell lookup
        const cleanAddress = (addr: string) => addr.replace(/\$/g, '');

        if (address.includes(':')) {
            // Range like "A1:B10" or "$A$1:$B$10"
            const [start, end] = address.split(':');
            this._startAddress = cleanAddress(start.trim());
            this._endAddress = cleanAddress(end.trim());
        } else {
            // Single cell like "A1" or "$A$1"
            this._startAddress = cleanAddress(address.trim());
            this._endAddress = cleanAddress(address.trim());
        }
    }

    /**
     * Load cells from the sheet
     */
    private loadCells() {
        if (this.isSingleCell()) {
            const cell = this.sheet.getCellDirect(this._startAddress);
            this._cells = [cell];
        } else {
            this._cells = this.expandRange();
        }
    }

    /**
     * Expand range address to array of cells
     */
    private expandRange(): Cell[] {
        const cells: Cell[] = [];

        const startCol = this._startAddress.match(/[A-Z]+/)?.[0] || 'A';
        const startRow = parseInt(this._startAddress.match(/\d+/)?.[0] || '1');
        const endCol = this._endAddress.match(/[A-Z]+/)?.[0] || 'A';
        const endRow = parseInt(this._endAddress.match(/\d+/)?.[0] || '1');

        const startColNum = this.colToNum(startCol);
        const endColNum = this.colToNum(endCol);

        // Normalize the range to handle reverse ranges (e.g., B2:A1 -> A1:B2)
        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minCol = Math.min(startColNum, endColNum);
        const maxCol = Math.max(startColNum, endColNum);

        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                const address = this.numToCol(col) + row;
                cells.push(this.sheet.getCellDirect(address));
            }
        }

        return cells;
    }

    /**
     * Check if this is a single cell range
     */
    public isSingleCell(): boolean {
        return this._startAddress === this._endAddress;
    }

    /**
     * Get the address of this range
     */
    public get address(): string {
        return this._address;
    }

    /**
     * Get all cells in this range
     */
    public get cells(): Cell[] {
        return this._cells;
    }

    /**
     * Get the first cell in the range
     */
    public get cell(): Cell {
        return this._cells[0];
    }

    /**
     * Get value(s) from the range
     * - Single cell: returns single value
     * - Multiple cells: returns 2D array of values
     */
    public get value(): any {
        if (this.isSingleCell()) {
            return this._cells[0]?.value ?? null;
        }

        return this.getValues();
    }

    /**
     * Set value(s) to the range
     * - Single cell: sets the value
     * - Multiple cells: if value is array, distributes values; otherwise sets all to same value
     */
    public set value(val: any) {
        if (this.isSingleCell()) {
            this._cells[0].value = val;
        } else {
            if (Array.isArray(val)) {
                this.setValuesFromArray(val);
            } else {
                // Set all cells to same value
                this._cells.forEach(cell => cell.value = val);
            }
        }
    }

    /**
     * Get formula from the range (only for single cell)
     */
    public get formula(): string | null {
        if (this.isSingleCell()) {
            return this._cells[0].formula;
        }
        return null;
    }

    /**
     * Set formula to the range
     */
    public set formula(formula: string) {
        if (this.isSingleCell()) {
            this._cells[0].formula = formula;
        } else {
            // For range, set formula to all cells (adjusting relative references)
            // For now, set the same formula to all
            this._cells.forEach(cell => cell.formula = formula);
        }
    }

    /**
     * Get values as 2D array
     */
    public getValues(): any[][] {
        const startCol = this._startAddress.match(/[A-Z]+/)?.[0] || 'A';
        const startRow = parseInt(this._startAddress.match(/\d+/)?.[0] || '1');
        const endCol = this._endAddress.match(/[A-Z]+/)?.[0] || 'A';
        const endRow = parseInt(this._endAddress.match(/\d+/)?.[0] || '1');

        const startColNum = this.colToNum(startCol);
        const endColNum = this.colToNum(endCol);

        const result: any[][] = [];
        let cellIndex = 0;

        for (let row = startRow; row <= endRow; row++) {
            const rowData: any[] = [];
            for (let col = startColNum; col <= endColNum; col++) {
                rowData.push(this._cells[cellIndex++].value);
            }
            result.push(rowData);
        }

        return result;
    }

    /**
     * Set values from 2D array
     */
    public setValues(values: any[][]) {
        let cellIndex = 0;
        for (let row = 0; row < values.length; row++) {
            for (let col = 0; col < values[row].length; col++) {
                if (cellIndex < this._cells.length) {
                    this._cells[cellIndex++].value = values[row][col];
                }
            }
        }
    }

    /**
     * Set values from flat array
     */
    private setValuesFromArray(values: any[]) {
        for (let i = 0; i < Math.min(values.length, this._cells.length); i++) {
            this._cells[i].value = values[i];
        }
    }

    /**
     * Get flat array of values
     */
    public toArray(): any[] {
        return this._cells.map(cell => cell.value);
    }

    /**
     * Calculate all cells in the range
     */
    public calculate() {
        this._cells.forEach(cell => {
            if (cell.formula) {
                cell.calculate();
            }
        });
    }

    /**
     * Get count of cells in range
     */
    public get count(): number {
        return this._cells.length;
    }

    /**
     * Get row count
     */
    public get rows(): number {
        const startRow = parseInt(this._startAddress.match(/\d+/)?.[0] || '1');
        const endRow = parseInt(this._endAddress.match(/\d+/)?.[0] || '1');
        return endRow - startRow + 1;
    }

    /**
     * Get column count
     */
    public get columns(): number {
        const startCol = this._startAddress.match(/[A-Z]+/)?.[0] || 'A';
        const endCol = this._endAddress.match(/[A-Z]+/)?.[0] || 'A';
        return this.colToNum(endCol) - this.colToNum(startCol) + 1;
    }

    /**
     * Iterate over each cell
     */
    public each(callback: (cell: Cell, index: number) => void) {
        this._cells.forEach((cell, index) => callback(cell, index));
    }

    /**
     * Map over cells
     */
    public map<T>(callback: (cell: Cell, index: number) => T): T[] {
        return this._cells.map((cell, index) => callback(cell, index));
    }

    /**
     * Filter cells
     */
    public filter(callback: (cell: Cell, index: number) => boolean): Cell[] {
        return this._cells.filter((cell, index) => callback(cell, index));
    }

    /**
     * Find a cell
     */
    public find(callback: (cell: Cell, index: number) => boolean): Cell | undefined {
        return this._cells.find((cell, index) => callback(cell, index));
    }

    /**
     * Get cell at specific position in range (0-based index)
     */
    public getCellAt(index: number): Cell | undefined {
        return this._cells[index];
    }

    /**
     * Get cell at row, col position (0-based)
     */
    public getCellAtPosition(row: number, col: number): Cell | undefined {
        const colCount = this.columns;
        const index = row * colCount + col;
        return this._cells[index];
    }

    /**
     * Convert column letter to number (A=1, Z=26, AA=27)
     */
    private colToNum(col: string): number {
        let num = 0;
        for (let i = 0; i < col.length; i++) {
            num = num * 26 + (col.charCodeAt(i) - 64);
        }
        return num;
    }

    /**
     * Convert number to column letter (1=A, 26=Z, 27=AA)
     */
    private numToCol(num: number): string {
        let col = '';
        while (num > 0) {
            const remainder = (num - 1) % 26;
            col = String.fromCharCode(65 + remainder) + col;
            num = Math.floor((num - 1) / 26);
        }
        return col;
    }

    /**
     * Get a sub-range
     */
    public getRange(address: string): Range {
        return new Range(this.sheet, address);
    }

    /**
     * Clear all values in range
     */
    public clear() {
        this._cells.forEach(cell => {
            cell.value = null;
            cell.formula = '';
        });
    }

    /**
     * Get string representation
     */
    public toString(): string {
        if (this.isSingleCell()) {
            return `Range(${this._address})`;
        }
        return `Range(${this._address}) [${this.rows}x${this.columns}]`;
    }
}
