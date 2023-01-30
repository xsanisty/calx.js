import Sheet from "./Sheet";
import { Parser } from "./Parser/Parser";
import createParser from "./Parser/ParserFactory";
import { SharedContext } from "./Parser/SharedContext";
import * as utility from './Utility/Utility';
import EventDispatcher from "./Utility/EventDispatcher";
import { NameManager } from "./Workbook/NameManager";
import { Config } from "./Workbook/Config";
import Comparator from "./Utility/Comparator";

export default class Workbook {
    private _sheets : Record<string, Sheet>;
    private _parser : Parser;
    private _dispatcher : EventDispatcher;
    private _nameManager : NameManager

    private constructor(
        parser : Parser,
        nameManager : NameManager,
        dispatcher : EventDispatcher,
    ) {
        this._sheets = {};
        this._parser = parser;
        this._dispatcher = dispatcher;
        this._nameManager = nameManager;

        this._nameManager.setContext(this);
    }

    public get parser() {
        return this._parser;
    }

    public get dispatcher() {
        return this._dispatcher;
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
     * Create workbook object from given config 
     */
    public static createFromConfig(config : Config) {
        const sharedContext = {
            sheets : {},
            utility : utility,
            comparator : Comparator,
        } as SharedContext;

        const parser = createParser(sharedContext);
        const dispatcher = new EventDispatcher();
        const nameManager = new NameManager();
        
        const workbook = new Workbook(parser, nameManager, dispatcher);

        sharedContext.workbook = workbook;
        /** TODO : read the configuration and configure the workbook */

        return workbook;
    }

    /** 
     * Create workbook object from given element, and parse related data-tag
     */
    public static createFromElement(element : HTMLElement, config ?: Config) {
        const parser = createParser({
            sheets : {},
            utility : utility,
            comparator : null,
        } as SharedContext);

        const dispatcher = new EventDispatcher();
        const nameManager = new NameManager();
        
        const workbook = new Workbook(parser, nameManager, dispatcher);
        /** TODO : traverse element and read the configuration and configure the workbook */

        return workbook;
    }
}
