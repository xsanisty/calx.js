import { Workbook } from './Workbook';
import { Cell } from './Cell';
import { Range } from './Range';
import { EventDispatcher } from './Utility/EventDispatcher';
import { SheetEvent, SheetState } from './Sheet/SheetEvent';
import { CellRegistry } from './Sheet/CellRegistry';
import { DependencyTree } from './Workbook/DependencyTree';
import { DependencyBuilder } from './Workbook/DependencyBuilder';
import { CellData } from './Workbook/Data';
import { strToNum, numToStr, translateFormula } from './Utility/Utility';

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
}
