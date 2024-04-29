import Workbook from './Workbook';
import Cell from './Cell';
import EventDispatcher from './Utility/EventDispatcher';
import { SheetEvent, SheetState } from './Sheet/SheetEvent';
import CellRegistry from './Sheet/CellRegistry';
import DependencyTree from './Workbook/DependencyTree';
import DependencyBuilder from './Workbook/DependencyBuilder';

export default class Sheet {
    private _el : HTMLElement;
    private _id : string;
    private _cells : CellRegistry;
    private _states : Record<string, any> = {
        calculation : SheetState.CALCULATION_IDLE,
    };

    public needCalculate : Array<string>;
    public needRender : Array<HTMLElement>;

    constructor(
        private workbook : Workbook,
        public name : string,
        public dispatcher : EventDispatcher = new EventDispatcher
    ) {
        this._id = this._generateId();
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
     * Set element where sheet should be mounted (optional)
     */
    public set element(el : HTMLElement) {
        el.setAttribute('data-calx-id', this.id);

        this._el = el;

        this.dispatcher.dispatch(SheetEvent.ELEMENT_ATTACHED, {sheet : this, el : el});
    }

    /**
     * Get element where sheet is mounted
     */
    public get element() : HTMLElement {
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
     * Calculate the entire sheet
     *
     * @param options calculation option
     */
    public calculate(options : {withoutEvent : boolean} = {withoutEvent : false}) {
        if (options.withoutEvent) {
            this.dispatcher.pauseListener();
        }


        this.dispatcher.resumeListener();
    }

    /**
     * Request particular cell to be calculated.
     *
     * @param address cell address
     */
    public requestCalculate(address : string) {

    }

    /**
     * Get specified cell object
     */
    public getCell(address : string) : Cell {
        return this._cells.get(address);
    }

    public getCellValue(cellAddr : string) : any {
        return this.getCell(cellAddr).value;
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

    }
}
