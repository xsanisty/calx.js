import { Workbook } from './Workbook';
import { Cell } from './Cell';
import { Range } from './Range';
import { EventDispatcher } from './Utility/EventDispatcher';
import { SheetEvent, SheetState } from './Sheet/SheetEvent';
import { CellRegistry } from './Sheet/CellRegistry';
import { DependencyTree } from './Workbook/DependencyTree';
import { DependencyBuilder } from './Workbook/DependencyBuilder';
import { CellData } from './Workbook/Data';
import { strToNum, numToStr, translateFormula, updateMovedReferences, getCellsInRange } from './Utility/Utility';

export class Sheet {
    private _el!: any;
    private _id : string;
    private _cells! : CellRegistry;
    private _states : Record<string, any> = {
        calculation : SheetState.CALCULATION_IDLE,
    };
    private _variables : Record<string, any> = {};
    private _depTree!: DependencyTree;
    private _autoCalculate : boolean = true;

    public needCalculate!: Array<string>;
    public needRender!: Array<any>;
    public workbook: Workbook;
    public name: string;
    public dispatcher: EventDispatcher;

    constructor(
        workbook : Workbook,
        name : string,
        dispatcher : EventDispatcher = new EventDispatcher()
    ) {
        this.workbook = workbook;
        this.name = name;
        this.dispatcher = dispatcher;
        this._id = this._generateId();
        this._cells = new CellRegistry(this, this.dispatcher);
    }

    /**
     * Generate unique id for sheet.
     *
     * @returns generated id
     */
    private _generateId() : string {
        return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, (c) => {
            const random = Math.floor(Math.random() * 16);
            return random.toString(16);
        });
    }

    /**
     * Get autoCalculate option
     */
    public get autoCalculate(): boolean {
        return this._autoCalculate;
    }

    /**
     * Set autoCalculate option
     * When true, changes to cell values automatically trigger recalculation of dependents
     * When false, manual calculation is required
     */
    public set autoCalculate(value: boolean) {
        this._autoCalculate = value;
    }

    /**
     * Recalculate all dirty cells (used for dynamic precedents)
     */
    public recalculateDirtyCells(): void {
        // Temporarily disable auto-calculate to avoid infinite recursion
        const wasAutoCalculate = this._autoCalculate;
        this._autoCalculate = false;

        this._cells.each((cell: Cell) => {
            if (cell.isDirty()) {
                cell.calculate();
            }
        });

        // Restore auto-calculate setting
        this._autoCalculate = wasAutoCalculate;
    }

    /**
     * Set element where sheet should be mounted (optional)
     */
    public set element(el : any) {
        el.setAttribute('data-calx-id', this.id);

        this._el = el;

        this.dispatcher.dispatch(SheetEvent.ELEMENT_ATTACHED, {sheet : this, el : el});
    }

    /**
     * Get element where sheet is mounted
     */
    public get element() : any {
        return this._el;
    }

    /**
     * Get sheet id
     */
    public get id() : string {
        return this._id;
    }

    /**
     * Get cells collection
     */
    public get cells() : Record<string, Cell> {
        return this._cells.all();
    }

    /**
     * Listen to sheet events
     * Convenience method that delegates to the dispatcher
     */
    public listen(event: string, callback: (data: any) => void): void {
        this.dispatcher.listen(event, callback);
    }

    /**
     * Calculate the entire sheet
     *
     * @param options calculation option
     */
    public calculate(options : {withoutEvent : boolean} = {withoutEvent : false}) {
        if (options.withoutEvent) {
            this.dispatcher.pauseListener();
        }

        // Get calculation order from dependency tree
        if (this._depTree) {
            const calculationOrder = this._depTree.topologicalSort();

            // Calculate cells in order (level by level)
            for (const level of calculationOrder) {
                // Skip undefined levels
                if (!level) continue;

                for (const cell of level) {
                    if (cell.isDirty() || !cell.isCalculated()) {
                        cell.calculate();
                    }
                }
            }

            // After dependency tree calculation, also calculate cells with dynamic precedents
            // that might not be in the tree (e.g., cells with only column/row references)
            this._cells.each((cell: Cell) => {
                if (cell.hasDynamicPrecedents() && (cell.isDirty() || !cell.isCalculated())) {
                    cell.calculate();
                }
            });
        } else {
            // No dependency tree, calculate all cells
            for (const address in this.cells) {
                this.cells[address].calculate();
            }
        }

        this.dispatcher.resumeListener();
    }

    /**
     * Request particular cell to be calculated.
     *
     * @param address cell address
     */
    public requestCalculate(address : string) {
        const cell = this.getCell(address);
        if (cell) {
            cell.markAsDirty();
            cell.calculate();

            // Mark dependents as dirty
            const dependents = cell.getDependents();
            for (const depAddress in dependents) {
                dependents[depAddress].markAsDirty();
            }
        }
    }

    /**
     * Get range (Excel-like behavior)
     * - Single cell: getRange('A1') returns Range containing one cell
     * - Multiple cells: getRange('A1:B10') returns Range containing multiple cells
     */
    public getRange(address: string): Range {
        return new Range(this, address);
    }

    /**
     * Get cell object directly (internal use)
     * For external use, prefer getRange() which is more Excel-like
     */
    public getCellDirect(address: string): Cell {
        return this._cells.get(address);
    }

    /**
     * Alias for getRange (Excel-like)
     * @deprecated Use getRange() instead
     */
    public getCell(address: string): Cell {
        return this._cells.get(address);
    }

    public getCellValue(cellAddr: string): any {
        return this.getRange(cellAddr).value;
    }

    public createCell(address : string, data? : CellData) : Cell {
        const cell = this._cells.create(address, data || {});

        // Mark cells with dynamic precedents that might reference this new cell
        this.invalidateDynamicDependents(address);

        return cell;
    }

    /**
     * Evaluate the given formula.
     */
    public eval(formula : string) : any {
        this.workbook.setActiveSheet(this);

        return this.workbook.parser.parse(formula);
    }

    /**
     * Build dependency tree for all registered cells
     */
    public buildDependencyTree() : void {
        const builder = new DependencyBuilder();
        builder.setWorkbook(this.workbook);
        this._depTree = builder.build(this._cells);
    }

    /**
     * Mark cells with dynamic precedents (column/row ranges) as dirty
     * when a cell at the given address is created or modified
     */
    public invalidateDynamicDependents(address: string): void {
        // Parse the address to get column and row
        const match = address.match(/^([A-Z]+)(\d+)$/);
        if (!match) return;

        const column = match[1];
        const row = parseInt(match[2]);

        // Check all cells in the sheet for dynamic dependencies
        this._cells.each((cell: Cell) => {
            if (cell.hasDynamicPrecedents()) {
                if (cell.dependsOnColumn(column) || cell.dependsOnRow(row)) {
                    cell.markAsDirty();
                }
            }
        });
    }

    /**
     * Get variable value
     */
    public getVariable(name: string): any {
        return this._variables[name] !== undefined ? this._variables[name] : "#NAME?";
    }

    /**
     * Set variable value
     */
    public setVariable(name: string, value: any): void {
        this._variables[name] = value;
    }

    /**
     * Get values from a range of cells
     */
    public getCellRangeValues(start: string, end: string): any[] {
        // Implementation to get range of cells
        // This should parse cell addresses and return array of values
        const startColMatch = start.match(/[A-Z]+/);
        const startRowMatch = start.match(/\d+/);
        const endColMatch = end.match(/[A-Z]+/);
        const endRowMatch = end.match(/\d+/);

        if (!startColMatch || !startRowMatch || !endColMatch || !endRowMatch) {
            throw new Error(`Invalid cell range: ${start}:${end}`);
        }

        const startCol = startColMatch[0];
        const startRow = parseInt(startRowMatch[0]);
        const endCol = endColMatch[0];
        const endRow = parseInt(endRowMatch[0]);

        const result: any[] = [];

        // Convert column letters to numbers
        const colToNum = (col: string) => {
            let num = 0;
            for (let i = 0; i < col.length; i++) {
                num = num * 26 + (col.charCodeAt(i) - 64);
            }
            return num;
        };

        const numToCol = (num: number) => {
            let col = '';
            while (num > 0) {
                const remainder = (num - 1) % 26;
                col = String.fromCharCode(65 + remainder) + col;
                num = Math.floor((num - 1) / 26);
            }
            return col;
        };

        const startColNum = colToNum(startCol);
        const endColNum = colToNum(endCol);

        // Return as flat array for compatibility with functions
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startColNum; col <= endColNum; col++) {
                const address = numToCol(col) + row;
                const cell = this._cells.get(address);
                result.push(cell ? cell.value : null);
            }
        }

        return result;
    }

    /**
     * Get values from a range of rows
     */
    public getRowRangeValues(range: string): any[] {
        // Parse range like "1:3" or "2:2"
        const parts = range.replace(/\$/g, '').split(':');
        const startRow = parseInt(parts[0]);
        const endRow = parseInt(parts[1]);

        const result: any[] = [];
        const allCells = this._cells.all();

        // Find all cells in the row range
        for (const address in allCells) {
            const rowMatch = address.match(/(\d+)$/);
            if (rowMatch) {
                const row = parseInt(rowMatch[1]);
                if (row >= startRow && row <= endRow) {
                    result.push(allCells[address].value);
                }
            }
        }

        return result;
    }

    /**
     * Get values from a range of columns
     */
    public getColumnRangeValues(range: string): any[] {
        // Parse range like "A:C" or "A:A"
        const parts = range.replace(/\$/g, '').split(':');
        const [startCol, endCol] = parts;

        const colToNum = (col: string) => {
            let num = 0;
            for (let i = 0; i < col.length; i++) {
                num = num * 26 + (col.charCodeAt(i) - 64);
            }
            return num;
        };

        const startColNum = colToNum(startCol);
        const endColNum = colToNum(endCol);

        const result: any[] = [];
        const allCells = this._cells.all();

        // Find all cells in the column range
        for (const address in allCells) {
            const colMatch = address.match(/^([A-Z]+)/);
            if (colMatch) {
                const colNum = colToNum(colMatch[1]);
                if (colNum >= startColNum && colNum <= endColNum) {
                    result.push(allCells[address].value);
                }
            }
        }

        return result;
    }

    /**
     * Load data from a 2D array into the sheet, starting at the anchor cell
     * Formulas are automatically translated to the correct cell addresses based on the anchor offset
     *
     * @param data 2D array of values (numbers, strings, or formulas starting with =)
     * @param anchor Cell address where the array should start (e.g., 'B2')
     *
     * @example
     * sheet.loadArray([
     *   [100, 200, 300],
     *   [400, 500, 600],
     *   ['=SUM(A1:C1)', 0, 0]
     * ], 'B2');
     * // Creates cells at B2, C2, D2, B3, C3, D3, B4, C4, D4
     * // Formula '=SUM(A1:C1)' at array[2][0] becomes '=SUM(B2:D2)' at cell B4
     */
    public loadArray(data: any[][], anchor: string): void {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Data must be a non-empty 2D array');
        }

        // Parse anchor address to get column and row
        const anchorMatch = anchor.match(/^([A-Z]+)(\d+)$/i);
        if (!anchorMatch) {
            throw new Error(`Invalid anchor address: ${anchor}`);
        }

        const anchorCol = anchorMatch[1].toUpperCase();
        const anchorRow = parseInt(anchorMatch[2]);
        const anchorColNum = strToNum(anchorCol);

        // Calculate the offset that applies to all formulas in the array
        // This is the offset from the theoretical position (A1) to the actual anchor
        const formulaRowOffset = anchorRow - 1;
        const formulaColOffset = anchorColNum - 1;

        // Iterate through the array and create cells
        for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
            const row = data[rowIdx];
            if (!Array.isArray(row)) {
                throw new Error(`Row ${rowIdx} is not an array`);
            }

            for (let colIdx = 0; colIdx < row.length; colIdx++) {
                const value = row[colIdx];
                const targetCol = numToStr(anchorColNum + colIdx);
                const targetRow = anchorRow + rowIdx;
                const targetAddress = `${targetCol}${targetRow}`;

                // Determine if it's a formula or a value
                if (typeof value === 'string' && value.startsWith('=')) {
                    // Translate formula using the same offset for all cells
                    const translatedFormula = translateFormula(value, formulaRowOffset, formulaColOffset);
                    this.createCell(targetAddress, { formula: translatedFormula });
                } else {
                    // Regular value
                    this.createCell(targetAddress, { value });
                }
            }
        }
    }

    /**
     * Move a range of cells to a new location
     * - Moves cell values and formulas
     * - Translates formulas within the moved cells
     * - Updates references to moved cells in other formulas
     * - Rebuilds dependency tree
     *
     * @param srcRange Source range address (e.g., 'A1:B2' or 'A1')
     * @param dstAddress Destination starting address (e.g., 'C3')
     *
     * @example
     * sheet.moveRange('A1:B2', 'D5');
     * // Moves cells A1, A2, B1, B2 to D5, D6, E5, E6
     * // Formula =SUM(A1:B2) in moved cells becomes =SUM(D5:E6)
     * // Formula =A1+B1 in other cells becomes =D5+E5
     */
    public moveRange(srcRange: string, dstAddress: string): void {
        // Parse source range
        const srcParts = srcRange.includes(':') ? srcRange.split(':') : [srcRange, srcRange];
        const srcStart = srcParts[0].trim().replace(/\$/g, '');
        const srcEnd = srcParts[1].trim().replace(/\$/g, '');

        const srcStartCol = srcStart.match(/[A-Z]+/)?.[0] || 'A';
        const srcStartRow = parseInt(srcStart.match(/\d+/)?.[0] || '1');
        const srcEndCol = srcEnd.match(/[A-Z]+/)?.[0] || srcStartCol;
        const srcEndRow = parseInt(srcEnd.match(/\d+/)?.[0] || srcStartRow.toString());

        // Parse destination
        const dstCleaned = dstAddress.replace(/\$/g, '');
        const dstStartCol = dstCleaned.match(/[A-Z]+/)?.[0] || 'A';
        const dstStartRow = parseInt(dstCleaned.match(/\d+/)?.[0] || '1');

        // Calculate range dimensions
        const srcStartColNum = strToNum(srcStartCol);
        const srcEndColNum = strToNum(srcEndCol);
        const colCount = Math.abs(srcEndColNum - srcStartColNum) + 1;
        const rowCount = Math.abs(srcEndRow - srcStartRow) + 1;

        const dstStartColNum = strToNum(dstStartCol);
        const dstEndColNum = dstStartColNum + colCount - 1;
        const dstEndRow = dstStartRow + rowCount - 1;
        const dstEndCol = numToStr(dstEndColNum);

        // Calculate offset for translating formulas in moved cells
        const rowOffset = dstStartRow - srcStartRow;
        const colOffset = dstStartColNum - srcStartColNum;

        // Get all cells in source range
        const srcCellAddresses = getCellsInRange(
            srcStart === srcEnd ? `${srcStart}:${srcEnd}` : srcRange
        );

        // Store cell data before moving
        const cellData: Array<{ address: string; value: any; formula: string | null }> = [];
        srcCellAddresses.forEach(addr => {
            if (this._cells.has(addr)) {
                const cell = this._cells.get(addr);
                cellData.push({
                    address: addr,
                    value: cell.value,
                    formula: cell.formula
                });
            }
        });

        // Remove source cells FIRST
        srcCellAddresses.forEach(addr => {
            if (this._cells.has(addr)) {
                const cell = this._cells.get(addr);
                this._cells.remove(cell);
            }
        });

        // Create cells at destination with translated formulas
        cellData.forEach((data) => {
            const srcAddr = data.address;
            const srcColMatch = srcAddr.match(/[A-Z]+/)?.[0] || 'A';
            const srcRowMatch = parseInt(srcAddr.match(/\d+/)?.[0] || '1');
            const srcCol = strToNum(srcColMatch);
            const srcRow = srcRowMatch;

            // Calculate destination address
            const dstCol = srcCol + colOffset;
            const dstRow = srcRow + rowOffset;
            const dstAddr = `${numToStr(dstCol)}${dstRow}`;

            // Remove existing cell at destination if it exists
            if (this._cells.has(dstAddr)) {
                const existingCell = this._cells.get(dstAddr);
                this._cells.remove(existingCell);
            }

            // Translate formula if exists
            let newFormula = data.formula;
            if (newFormula) {
                newFormula = translateFormula(newFormula, rowOffset, colOffset);
            }

            // Create new cell
            if (newFormula) {
                this.createCell(dstAddr, { formula: newFormula });
            } else {
                this.createCell(dstAddr, { value: data.value });
            }
        });

        // Update all formulas in the sheet that reference the moved range
        // Do this AFTER creating destination cells so they exist when formulas are updated
        this._cells.each((cell: Cell) => {
            // Skip cells that are at the destination (just moved)
            if (cell.address >= numToStr(dstStartColNum) + dstStartRow &&
                cell.address <= numToStr(dstEndColNum) + dstEndRow) {
                // This is a rough check - could be improved
                return;
            }

            if (cell.formula) {
                const updatedFormula = updateMovedReferences(
                    cell.formula,
                    srcStartCol, srcStartRow, srcEndCol, srcEndRow,
                    dstStartCol, dstStartRow, dstEndCol, dstEndRow
                );
                if (updatedFormula !== cell.formula) {
                    cell.formula = updatedFormula;
                }
            }
        });

        // Rebuild dependency tree
        this.buildDependencyTree();
    }

    /**
     * Copy a range of cells to a new location
     * - Copies cell values and formulas
     * - Translates formulas within the copied cells
     * - Does NOT update references in other formulas (they still point to original)
     * - Rebuilds dependency tree
     *
     * @param srcRange Source range address (e.g., 'A1:B2' or 'A1')
     * @param dstAddress Destination starting address (e.g., 'C3')
     *
     * @example
     * sheet.copyRange('A1:B2', 'D5');
     * // Copies cells A1, A2, B1, B2 to D5, D6, E5, E6
     * // Formula =SUM(A1:B2) in copied cells becomes =SUM(D5:E6)
     * // Other formulas that reference A1:B2 remain unchanged
     */
    public copyRange(srcRange: string, dstAddress: string): void {
        // Parse source range
        const srcParts = srcRange.includes(':') ? srcRange.split(':') : [srcRange, srcRange];
        const srcStart = srcParts[0].trim().replace(/\$/g, '');
        const srcEnd = srcParts[1].trim().replace(/\$/g, '');

        const srcStartCol = srcStart.match(/[A-Z]+/)?.[0] || 'A';
        const srcStartRow = parseInt(srcStart.match(/\d+/)?.[0] || '1');
        const srcEndCol = srcEnd.match(/[A-Z]+/)?.[0] || srcStartCol;
        const srcEndRow = parseInt(srcEnd.match(/\d+/)?.[0] || srcStartRow.toString());

        // Parse destination
        const dstCleaned = dstAddress.replace(/\$/g, '');
        const dstStartCol = dstCleaned.match(/[A-Z]+/)?.[0] || 'A';
        const dstStartRow = parseInt(dstCleaned.match(/\d+/)?.[0] || '1');

        // Calculate offset for translating formulas
        const srcStartColNum = strToNum(srcStartCol);
        const dstStartColNum = strToNum(dstStartCol);
        const rowOffset = dstStartRow - srcStartRow;
        const colOffset = dstStartColNum - srcStartColNum;

        // Get all cells in source range
        const srcCellAddresses = getCellsInRange(
            srcStart === srcEnd ? `${srcStart}:${srcEnd}` : srcRange
        );

        // Collect all source cell data BEFORE writing (important for overlapping ranges)
        const cellData: { srcAddr: string; dstAddr: string; value: any; formula: string }[] = [];

        srcCellAddresses.forEach(srcAddr => {
            if (this._cells.has(srcAddr)) {
                const srcCell = this._cells.get(srcAddr);

                // Calculate destination address
                const srcColMatch = srcAddr.match(/[A-Z]+/)?.[0] || 'A';
                const srcRowMatch = parseInt(srcAddr.match(/\d+/)?.[0] || '1');
                const srcCol = strToNum(srcColMatch);
                const srcRow = srcRowMatch;

                const dstCol = srcCol + colOffset;
                const dstRow = srcRow + rowOffset;
                const dstAddr = `${numToStr(dstCol)}${dstRow}`;

                cellData.push({
                    srcAddr,
                    dstAddr,
                    value: srcCell.value,
                    formula: srcCell.formula
                });
            }
        });

        // Now write all destination cells
        cellData.forEach(data => {
            // Remove existing cell at destination if it exists
            if (this._cells.has(data.dstAddr)) {
                const existingCell = this._cells.get(data.dstAddr);
                this._cells.remove(existingCell);
            }

            // Translate formula if exists
            let newFormula = data.formula;
            if (newFormula) {
                newFormula = translateFormula(newFormula, rowOffset, colOffset);
            }

            // Create new cell at destination
            if (newFormula) {
                this.createCell(data.dstAddr, { formula: newFormula });
            } else {
                this.createCell(data.dstAddr, { value: data.value });
            }
        });

        // Rebuild dependency tree
        this.buildDependencyTree();
    }
}
