import Sheet from "./Sheet";
import { Parser } from "./Parser/Parser";
import createParser from "./Parser/ParserFactory";
import { SharedContext } from "./Parser/SharedContext";
import * as Utility from './Utility/Utility';
import EventDispatcher from "./Utility/EventDispatcher";
import { NameManager } from "./Workbook/NameManager";
import { CellData, Data } from "./Workbook/Data";
import Comparator from "./Utility/Comparator";
import Cell from "./Cell";

export default class Workbook {
    private _sheets : Record<string, Sheet>;
    private _functions : Record<string, Function>;
    private _parser : Parser;
    private _dispatcher : EventDispatcher;
    private _nameManager : NameManager

    private _deps : DependencyTree;
    private _depsBuilder : DependencyBuilder;

    private constructor(
        parser : Parser,
        nameManager : NameManager,
        dispatcher : EventDispatcher,
    ) {
        this._sheets = {};
        this._parser = parser;
        this._dispatcher    = dispatcher;
        this._nameManager   = nameManager;

        this._nameManager.setContext(this);

        this._parser.yy.nameManager = this._nameManager;
        this._parser.yy.workbook    = this;
        this._parser.yy.sheets      = this._sheets;
    }

    public get parser() {
        return this._parser;
    }

    public get dispatcher() {
        return this._dispatcher;
    }

    public setActiveSheet(sheet : Sheet) {
        this._parser.yy.activeSheet = sheet;
    }

    public getActiveSheet() {
        return this._parser.yy.activeSheet;
    }

    public isValidCellAddress(address : string) {
        return address.match(/^[A-Z]+\d+$/);
    }

    /**
     * Calculate the whole workbook
     */
    public calculcate() {

    }

    /**
     * Build the workbook, create dependency tree, and other necessary things
     */
    public build() {

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
    public createSheet(name: string, element ?: HTMLElement) :Sheet
    {
        if (!name) {
            throw new Error('Sheet should have a name');
        }

        if (this._sheets[name]) {
            throw new Error(`Sheet with the name "${name}" is already exists`);
        }

        const sheet = new Sheet(this, name);

        if (element) {
            sheet.element = element;
        }

        this._sheets[name] = sheet;
        this._parser.yy.sheets[name] = sheet;

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

                // check if cell is individual cell or grouped cells
                if (cellData.hasOwnProperty('formula')) {
                    sheet.createCell(cellKey, cellData);
                } else {
                    for (const cellKey in cellData) {
                        sheet.createCell(cellKey, cellData[cellKey] as CellData);
                    }
                }
            }
        }
    }

    /**
     * Create workbook object from given config
     */
    public static createFromData(data : Data) {
        const sharedContext = {
            sheets : {},
            utility : Utility,
            comparator : Comparator,
        } as SharedContext;

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
    public static createFromElement(element : HTMLElement, data ?: Data) {
        const parser = createParser({
            sheets : {},
            utility : Utility,
            comparator : null,
        } as SharedContext);

        const dispatcher    = new EventDispatcher();
        const nameManager   = new NameManager();
        const workbook      = new Workbook(parser, nameManager, dispatcher);

        /** TODO : traverse element and read the configuration and configure the workbook */

        workbook.loadData(data);

        return workbook;
    }
}
