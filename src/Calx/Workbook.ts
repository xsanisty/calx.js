import { Sheet } from "./Sheet";
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

    private _deps!: DependencyTree;
    private _depsBuilder!: DependencyBuilder;

    private constructor(
        parser      : CalxInterpreter,
        nameManager : NameManager,
        dispatcher  : EventDispatcher,
    ) {
        this._sheets        = {};
        this._parser        = parser;
        this._dispatcher    = dispatcher;
        this._nameManager   = nameManager;

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
        return this._parser.yy?.activeSheet;
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
        // Initialize dependency builder
        this._depsBuilder = new DependencyBuilder();

        // Build dependency trees for each sheet
        for (const sheetName in this._sheets) {
            this._sheets[sheetName].buildDependencyTree();
        }

        // Build workbook-level dependency tree (for cross-sheet dependencies)
        // This will be implemented when we have a complete cell registry
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
        if (this._parser && this._parser.yy) {
            this._parser.yy.sheets[name] = sheet;
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
     */
    public static createFromElement(element : any, data ?: Data) {
        const parser = createParser(new SharedContext({
            sheets : {},
            utility : Utility,
            comparator : null,
        }));

        const dispatcher    = new EventDispatcher();
        const nameManager   = new NameManager();
        const workbook      = new Workbook(parser, nameManager, dispatcher);

        /** TODO : traverse element and read the configuration and configure the workbook */

        if (data) {
            workbook.loadData(data);
        }

        return workbook;
    }
}
