import Sheet from './Sheet';

export enum CellDataType {
    TEXT    = 'text',
    NUMBER  = 'number',
    DATE    = 'date',
}

export enum CellErrorType {
    DIV_BY_ZERO  = '#DIV/0!',
    INVALID_NAME = '#NAME?',
    INVALID_REF  = '#REF!',
    INVALID_VAL  = '#VALUE!',
    INVALID_NUM  = '#NUM!',
    NA           = '#N/A!',
    NULL         = '#NULL!'
}

export enum CellEvent {
    VALUE_CHANGED       = 'value.changed',
    FORMULA_CHANGED     = 'fomula.changed',
    FORMULA_CALCULATED  = 'formula.calculated',
}

export interface CellFormatter {
    format(rawValue : any) : string;
}

export default class Cell {
    private _value : any;           //Cell original value
    private _address : string       //Cell address
    private _formula : string;      //Cell formula
    private _computed : any;        //Result of the computed formula

    protected precedents :Record<string, Cell> = {}; //Cells registry required by the formula
    protected dependents :Record<string, Cell> = {}; //Cells registry that depend on this cell

    /** Flags */
    private _affected : boolean = false;
    private _calculated : boolean = false;
    private _hasDynamicPrecedents : boolean = false;

    protected format : string;
    protected formatter : CellFormatter;
    protected el ?: HTMLElement;

    constructor(
        address : string,
        protected sheet : Sheet,
        protected _type : string = CellDataType.TEXT
    ) {
        this.address = address;
        this.init();
    }

    public init() {

    }

    /** Mount cell object into specific element */
    public mount(el: HTMLElement) {
        this.el = el;
    }

    /** Check if cell has error value */
    public isError() {
        return Object.values(CellErrorType).includes(this.value as CellErrorType);
    }

    /** Check if cell has empty-able value, like null, empty string, undefined */
    public isEmpty() {

    }

    /** Check if cell is calculated already */
    public isCalculated() : boolean {
        return this._calculated
    }

    /** Check if cell is affected by changes on other cells */
    public isAffected() : boolean {
        return this._affected
    }

    /** Check if the current is numeric */
    public isNumeric() : boolean {
        return !isNaN(this.value - parseFloat(this.value));
    }

    public get address() : string {
        return this._address;
    }

    public set address(address : string) {
        const rule = /^[A-Z]+[0-9]+$/

        if (address.match(rule)) {
            this._address = address;
        }

        throw new Error("Cell address should follow spreadsheet like address rule");
    }
    
    /** 
     * Get cell formula 
     */
    public get formula() : string {
        return this._formula;
    }

    /** 
     * Set cell formula, and notify the parent sheet
     */
    public set formula(formula : string) {
        const oldFormula = this._formula;
        this._formula = formula;

        this.sheet.dispatcher.dispatch(
            CellEvent.FORMULA_CHANGED, 
            {
                cell : this.address, 
                oldFormula : oldFormula, 
                newFormula : formula
            }
        )
    }

    /** 
     * Get the value of the cell, if it has formula, return the computed value 
     */
    public get value() : any {
        return this.formula ? this._computed : this._value;
    }

    /** 
     * Set cell value, this will reset the formula 
     */
    public set value(value : any) {
        this._value = value;
        this._formula = null;

        this.sheet.dispatcher.dispatch(CellEvent.VALUE_CHANGED, {cell : this.address, value : value});
    }
}
