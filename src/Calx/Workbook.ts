import Sheet from "./Sheet";
import createParser from "./Parser/ParserFactory";
import { SharedContext } from "./Parser/SharedContext";
import * as utility from './Utility/Utility';

export type WorkbookConfig = {
    sheets : Record<string, {
        element ?: HTMLElement,
        cells   : Record<string, {}>
    }>
}

export default class Workbook {
    private _sheets : Record<string, Sheet>;
    private _parser : any

    constructor(
        sheets : Record<string, Sheet> = {}
    ) {
        this._sheets = sheets;

        this.parser = createParser({
            sheets : this.getSheets(),
            utility : utility
        } as SharedContext);
    }

    public get parser() {
        return this._parser;
    }

    public set parser(parser) {
        this._parser = parser;
    }

    /** Create new sheet object and register it */
    public createSheet(name: string, element ?: HTMLElement) :Sheet
    {
        const sheet = new Sheet(this, name);

        if (element) {
            sheet.element = element;
        }

        this._sheets[sheet.id] = sheet;

        return sheet;
    }

    /** Get sheets collection from the workbook */
    public getSheets() : Record<string, Sheet> {
        return this._sheets;
    }

    /** Get particular sheet in the registry */
    public getSheet(name : string) : Sheet | void {
        if (name in this._sheets) {
            return this._sheets[name];
        }
    }

    /** Create workbook object from given config */
    public static createFromConfig(config : WorkbookConfig) {
        const workbook = new Workbook();

        workbook.parser = createParser({
            sheets : workbook.getSheets(),
            utility : utility
        } as SharedContext);

        /** TODO : read the configuration and configure the workbook */

        return workbook;
    }

    /** Create workbook object from given element */
    public static createFromElement(element : HTMLElement, config ?: WorkbookConfig) {
        const workbook = new Workbook();

       workbook.parser = createParser({
            sheets : workbook.getSheets(),
            utility : utility
        } as SharedContext);

        /** TODO : scan the element and merge the configuration for configuring the workbook */

        return workbook;
    }
}
