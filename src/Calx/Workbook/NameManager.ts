import Workbook from "../Workbook";

/**
 * Manage named cell or cell range
 */
export class NameManager {
    private _workbook : Workbook
    private _nameRegistry : Record<string, string> = {};

    public setContext(workbook : Workbook) {
        this._workbook = workbook;
    }

    /**
     * Define named cell or cell range.
     *
     * @param name the alias name
     * @param target the cell or cell range to be aliased
     */
    public define(name : string, target : string) {
        this._nameRegistry[name] = target;
    }

    /**
     *
     * @param name the alias name
     *
     * @returns target cell value or list of cell address and value
     */
    public resolve(name : string) {
        return this._workbook.parser.parse(this._nameRegistry[name]);
    }

    /**
     * Remove the alias
     *
     * @param name the alias name
     */
    public remove(name : string) {
        delete this._nameRegistry[name];
    }
}