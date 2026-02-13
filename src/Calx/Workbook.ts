import { Sheet } from "./Sheet";
import { Cell } from "./Cell";
import { CalxInterpreter } from "./Parser/Chevrotain/Interpreter";
import { CalxParser } from "./Parser/Chevrotain/Parser";
import { SharedContext } from "./Parser/SharedContext";
import * as Utility from './Utility/Utility';
import { EventDispatcher } from "./Utility/EventDispatcher";
import { NameManager } from "./Workbook/NameManager";
import { CellData, Data } from "./Workbook/Data";
import { Comparator } from "./Utility/Comparator";
import { DependencyTree } from "./Workbook/DependencyTree";
import { DependencyBuilder } from "./Workbook/DependencyBuilder";
import type { CalxElement } from "./Workbook/CalxElement";

/**
 * Create parser instance with shared context
 */
function createParser(context: SharedContext): CalxInterpreter {
    const interpreter = new CalxInterpreter();
    interpreter.setContext(context);
    return interpreter;
}

export class Workbook {
    private _sheets : Record<string, Sheet>;
    private _functions!: Record<string, Function>;
    private _parser : CalxInterpreter;
    private _dispatcher : EventDispatcher;
    private _nameManager : NameManager
    private _autoCalculate : boolean = true;
    private _element?: CalxElement;

    private _deps!: DependencyTree;
    private _dependencyBuilder: DependencyBuilder;
    private _built: boolean = false;

    /** Set of cell addresses that are part of circular references (format: "SheetName!Address") */
    private _circularCells: Set<string> = new Set();

    private constructor(
        parser      : CalxInterpreter,
        nameManager : NameManager,
        dispatcher  : EventDispatcher,
    ) {
        this._sheets        = {};
        this._parser        = parser;
        this._dispatcher    = dispatcher;
        this._nameManager   = nameManager;
        this._dependencyBuilder = new DependencyBuilder();
        this._dependencyBuilder.setWorkbook(this);

        this._nameManager.setContext(this);
    }

    public get parser() {
        return this._parser;
    }

    public get dispatcher() {
        return this._dispatcher;
    }

    /**
     * Get the name manager for managing named ranges
     */
    public get nameManager(): NameManager {
        return this._nameManager;
    }

    /**
     * Get the dependency builder for this workbook
     */
    public get dependencyBuilder(): DependencyBuilder {
        return this._dependencyBuilder;
    }

    /**
     * Get the CalxElement instance if the workbook has been mounted to a DOM element
     */
    public getElement(): CalxElement | undefined {
        return this._element;
    }

    /**
     * Mount the workbook to a DOM element
     * Creates a CalxElement instance to bind the workbook to DOM elements
     *
     * @param element - DOM element ID string or HTMLElement to mount
     */
    public mount(element: string | HTMLElement): void {
        // Import CalxElement dynamically to avoid circular dependency
        const { CalxElement } = require("./Workbook/CalxElement");

        // Create CalxElement with this workbook instance
        this._element = new CalxElement(element, this);
    }

    /**
     * Get autoCalculate option
     */
    public get autoCalculate(): boolean {
        return this._autoCalculate;
    }

    /**
     * Set autoCalculate option
     * When true, changes to cell values automatically trigger recalculation of all sheets
     * When false, manual calculation is required
     * This also updates all sheets' autoCalculate settings
     */
    public set autoCalculate(value: boolean) {
        this._autoCalculate = value;
        // Propagate to all sheets
        for (const sheetName in this._sheets) {
            this._sheets[sheetName].autoCalculate = value;
        }
    }

    public setActiveSheet(sheet : Sheet) {
        if (this._parser) {
            const context = this._parser.getContext();
            if (context) {
                context.activeSheet = sheet;
                context.setActiveSheet(sheet);
            }
        }
    }

    public getActiveSheet() {
        return this._parser.getContext()?.activeSheet;
    }

    public isValidCellAddress(address : string) {
        return address.match(/^[A-Z]+\d+$/);
    }

    /**
     * Calculate the whole workbook
     */
    public calculate() {
        // Build dependency tree if not already built
        if (!this._deps) {
            this.build();
        }

        // Calculate all sheets in dependency order
        for (const sheetName in this._sheets) {
            this._sheets[sheetName].calculate();
        }
    }

    /**
     * Build the workbook, create dependency tree, and other necessary things
     */
    public build() {
        // Mark as built
        this._built = true;

        // Build dependency trees for each sheet
        for (const sheetName in this._sheets) {
            this._sheets[sheetName].buildDependencyTree();
        }

        // Check for circular references across all sheets
        this.checkCircularReference();

        // Build workbook-level dependency tree (for cross-sheet dependencies)
        // This will be implemented when we have a complete cell registry
    }

    /**
     * Check for circular references in the workbook
     * Must be called after build() to ensure dependency trees are constructed
     * Marks circular cells for tracking instead of throwing errors
     */
    public checkCircularReference(): void {
        // Ensure workbook has been built
        if (!this._built) {
            throw new Error('Workbook must be built before checking for circular references. Call build() first.');
        }

        // Clear existing circular cells
        this._circularCells.clear();

        // Check each sheet for circular references
        for (const sheetName in this._sheets) {
            const sheet = this._sheets[sheetName];

            // Get all cells from the sheet
            const allCells = sheet.cells;

            // Iterate through all cells in the sheet
            for (const address in allCells) {
                const cell = allCells[address];
                if (cell.formula) {
                    // Check for circular reference starting from this cell
                    const visited = new Set<string>();
                    const path: string[] = [];

                    this._checkCellForCircularReference(cell, sheetName, visited, path);
                }
            }
        }
    }

    /**
     * Recursively check a cell for circular references
     * Marks all cells in circular chains for tracking
     * @private
     */
    private _checkCellForCircularReference(
        cell: Cell,
        sheetName: string,
        visited: Set<string>,
        path: string[]
    ): void {
        const fullAddress = `${sheetName}!${cell.address}`;

        // If we've seen this cell in the current path, we have a circular reference
        if (path.includes(fullAddress)) {
            // Mark all cells in the circular chain as circular
            const startIndex = path.indexOf(fullAddress);
            for (let i = startIndex; i < path.length; i++) {
                this._circularCells.add(path[i]);
            }
            this._circularCells.add(fullAddress);
            return; // Don't continue exploring this path
        }

        // If we've already fully explored this cell in another path, skip it
        if (visited.has(fullAddress)) {
            return;
        }

        // Add to current path
        path.push(fullAddress);

        // Get precedents (cells this cell depends on)
        const precedents = cell.getPrecedents();

        if (precedents) {
            // Check local precedents (same sheet)
            for (const address in precedents) {
                const precedent = precedents[address];
                if (precedent && precedent.formula) {
                    this._checkCellForCircularReference(precedent, sheetName, visited, path);
                }
            }
        }

        // Check remote precedents (cross-sheet references)
        // We need to access the workbook's sheets to find the cell's sheet
        const cellSheet = this._findCellSheet(cell);
        if (cellSheet) {
            // Access remote precedents through type assertion since it's protected
            const remotePrecedents = (cell as any).remotePrecedents as Record<string, Cell>;
            if (remotePrecedents) {
                for (const key in remotePrecedents) {
                    const precedent = remotePrecedents[key];
                    if (precedent && precedent.formula) {
                        // Find which sheet this precedent belongs to
                        const precedentSheet = this._findCellSheet(precedent);
                        if (precedentSheet) {
                            this._checkCellForCircularReference(precedent, precedentSheet.name, visited, path);
                        }
                    }
                }
            }
        }

        // Remove from current path (backtrack)
        path.pop();

        // Mark as fully visited
        visited.add(fullAddress);
    }

    /**
     * Check if a cell is part of a circular reference (cross-sheet or within-sheet)
     * @param cell The cell to check (Cell object)
     * @param sheetName The sheet name containing the cell
     * @returns true if the cell is in a circular reference chain
     */
    public isInCircularReference(cell: Cell, sheetName: string): boolean {
        const fullAddress = `${sheetName}!${cell.address}`;

        // Check workbook-level circular references (cross-sheet)
        if (this._circularCells.has(fullAddress)) {
            return true;
        }

        // Check sheet-level circular references (within-sheet)
        const sheet = this._sheets[sheetName];
        if (sheet && sheet.isInCircularReference(cell)) {
            return true;
        }

        return false;
    }

    /**
     * Find which sheet a cell belongs to
     * @private
     */
    private _findCellSheet(cell: Cell): Sheet | null {
        for (const sheetName in this._sheets) {
            const sheet = this._sheets[sheetName];
            const cells = sheet.cells;
            if (cells[cell.address] === cell) {
                return sheet;
            }
        }
        return null;
    }

    /**
     * Hydrate object using data from the workbook recusively
     *
     * {
     *   someKey : '#sheet1!A1',
     *   anotherKey : '#sheet2!B2',
     *   nested : {
     *    key : '#sheet3!C3'
     *   }
     * }
     *
     * @param obj
     */
    public hydrateObj(obj : any) {
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                this.hydrateObj(obj[key]);
            } else {
                if (typeof obj[key] === 'string' && obj[key].startsWith('#')) {
                    const [sheetName, address] = obj[key].split('!');

                    if (sheetName in this._sheets) {
                        obj[key] = this._sheets[sheetName].getCell(address).value;
                    }
                }
            }
        }
    }

    /**
     * Create new sheet object and register it to workbook sheet registry and parser shared context.
     */
    public createSheet(name: string, element ?: any) :Sheet
    {
        if (!name) {
            throw new Error('Sheet should have a name');
        }

        if (this._sheets[name]) {
            throw new Error(`Sheet with the name "${name}" is already exists`);
        }

        const sheet = new Sheet(this, name);

        // Inherit workbook's autoCalculate setting
        sheet.autoCalculate = this._autoCalculate;

        if (element) {
            sheet.element = element;
        }

        this._sheets[name] = sheet;
        const context = this._parser?.getContext();
        if (context) {
            context.sheets[name] = sheet;
        }

        return sheet;
    }

    /**
     * Get sheets collection from the workbook
     */
    public getSheets() : Record<string, Sheet> {
        return this._sheets;
    }

    /**
     * Get particular sheet in the workbook sheet registry
     */
    public getSheet(name : string) : Sheet | void {
        if (name in this._sheets) {
            return this._sheets[name];
        }

        throw Error(`Sheet not found with name ${name}`);
    }


    /**
     * Load configuration to workbook
     */
    public loadData(data : Data) {
        for (const sheetName in data.sheets) {
            const sheet = this.createSheet(sheetName, data.sheets[sheetName]?.element);

            for (const cellKey in data.sheets[sheetName].cells) {
                const cellData = data.sheets[sheetName].cells[cellKey];
                sheet.createCell(cellKey, cellData);
            }
        }
    }

    /**
     * Export workbook to JSON Data format
     * Returns a Data object that can be used with createWorkbookFromData()
     */
    public exportJSON(): Data {
        const data: Data = {
            sheets: {}
        };

        for (const sheetName in this._sheets) {
            const sheet = this._sheets[sheetName];
            const allCells = sheet.cells;

            data.sheets[sheetName] = {
                element: sheet.element,
                cells: {},
                variables: {}
            };

            // Export each cell's data
            for (const address in allCells) {
                const cell = allCells[address];
                const cellData: CellData = {};

                if (cell.formula) {
                    cellData.formula = cell.formula;
                } else if (cell.value !== undefined) {
                    cellData.value = cell.value;
                }

                if (cell.type) {
                    cellData.type = cell.type;
                }

                // Only include cells that have data
                if (cellData.formula || cellData.value !== undefined) {
                    data.sheets[sheetName].cells[address] = cellData;
                }
            }
        }

        return data;
    }

    /**
     * Create workbook object from given config
     */
    public static createFromData(data : Data) {
        const sharedContext = new SharedContext({
            sheets : {},
            utility : Utility,
            comparator : Comparator,
        });

        const parser = createParser(sharedContext);
        const dispatcher = new EventDispatcher();
        const nameManager = new NameManager();

        const workbook = new Workbook(parser, nameManager, dispatcher);

        sharedContext.workbook = workbook;

        /** TODO : read the configuration and configure the workbook */
        workbook.loadData(data);

        return workbook;
    }

    /**
     * Create workbook object from given element, and parse related data-tag
     * Creates a new workbook and mounts it to the specified DOM element
     *
     * @param element - DOM element ID string or HTMLElement to mount
     * @param data - Optional initial data configuration
     * @returns Workbook instance with element mounted
     */
    public static createFromElement(element : string | HTMLElement, data ?: Data) {
        // Create workbook from data if provided, otherwise create empty workbook
        const workbook = data ? Workbook.createFromData(data) : Workbook.createFromData({ sheets: {} });

        // Mount the workbook to the element
        workbook.mount(element);

        return workbook;
    }
}
