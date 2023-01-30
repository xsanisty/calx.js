import Workbook from './Workbook';
import Cell from './Cell';
import EventDispatcher from './Utility/EventDispatcher';
import { Event } from './Sheet/Event';

export default class Sheet {
    private _el : HTMLElement;
    private _id : string;
    private _cells : Record<string, Cell> = {};
    private _eventPaused : boolean = false;

    public needCalculate : Array<string>;
    public needRender : Array<HTMLElement>;

    constructor(
        private workbook : Workbook,
        public name : string,
        public dispatcher : EventDispatcher = new EventDispatcher
    ) {
        this._id = this._generateId();
    }

    private _generateId() : string {
        return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, (c) => {
            const random = Math.floor(Math.random() * 16);
            return random.toString(16);
        });
    }

    /**
     * Set element where sheet should be mounted (optional)
     */
    public set element(el : HTMLElement) {
        el.setAttribute('data-calx-id', this.id);

        this._el = el;

        !this._eventPaused && this.dispatcher.dispatch(Event.ELEMENT_ATTACHED, {sheet : this, el : el});
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

    /**
     * Calculate the entire sheet
     *
     * @param options calculation option
     */
    public calculate(options : {withoutEvent : boolean} = {withoutEvent : false}) {
        if (options.withoutEvent) {
            this.pauseEvent();
        }


        this.resumeEvent();
    }

    /**
     * Get specified cell object
     */
    public getCell(address : string) : Cell {
        if (!this._cells[address]) {
            const cell = new Cell(address, this);
            this._cells[address] = cell;
        }

        return this._cells[address];
    }

    /**
     * Evaluate the given formula.
     */
    public eval(formula : string) : any {
        this.workbook.parser.yy.activeSheet = this;

        return this.workbook.parser.parse(formula);
    }

    public pauseEvent() {
        this._eventPaused = true;
    }

    public resumeEvent() {
        this._eventPaused = false;
    }

    /**
     * Build dependency graph for all registered cells
     */
    public buildDependencyGraph() : void {

    }
}
