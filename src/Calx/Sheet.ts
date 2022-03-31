import Workbook from './Workbook';
import Cell from './Cell';
import EventDispatcher from './Sheet/EventDispatcher';

export default class Sheet {
    private _el : HTMLElement;
    private _id;
    private _cells : Record<string, Cell> = {};
    
    public dispatcher : EventDispatcher;
    public needUpdate : Array<string>;

    constructor(
        private workbook :Workbook,
        public name :string
    ) {
        this._id = this._generateId();
        this.dispatcher = new EventDispatcher;
    }

    private _generateId(): string {
        return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, (c) => {
            const random = Math.floor(Math.random() * 16);
            return random.toString(16);
        });
    }

    /** Set element where sheet should be mounted (optional) */
    public set element(el: HTMLElement) {
        el.setAttribute('data-calx-id', this.id);
        
        this._el = el;
    }

    public get element() : HTMLElement {
        return this._el;
    }

    public get id() : string {
        return this._id;
    }

    public get cells() : Record<string, Cell> {
        return this._cells
    }

    /** Get specified cell object */
    public getCell(address: string) : Cell {
        if (!this._cells[address]) {
            const cell = new Cell(address, this);
            this._cells[address] = cell;
        }

        return this._cells[address];
    }

    public eval(formula : string) : any {
        this.workbook.parser.yy.activeSheet = this;
        
        return this.workbook.parser.parse(formula);
    }

    /** Build dependency graph for all registered cells */
    public buildDependencyGraph() : void {

    }
}
