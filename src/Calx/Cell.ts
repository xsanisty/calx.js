import Sheet from './Sheet';
import { Event } from './Cell/Event';
import { DataType } from './Cell/DataType';
import { ErrorType } from './Cell/ErrorType';
import { FormatterInterface } from './Cell/Formatter';

export default class Cell {
    private _value : any;           //Cell original value
    private _address : string       //Cell address
    private _formula : string;      //Cell formula
    private _computed : any;        //Result of the computed formula

    protected precedents : Record<string, Cell> = {}; //Cells registry required by the formula
    protected dependents : Record<string, Cell> = {}; //Cells registry that depend on this cell

    /** Flags */
    private _affected : boolean = false;
    private _calculated : boolean = false;
    private _hasDynamicPrecedents : boolean = false;

    protected format : string;
    protected formatter : FormatterInterface;
    protected el ?: HTMLElement;

    constructor(
        address : string,
        protected sheet : Sheet,
        protected _type : string = DataType.TEXT
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
        return Object.values(ErrorType).includes(this.value as ErrorType);
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
            Event.FORMULA_CHANGED, 
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

        this.sheet.dispatcher.dispatch(Event.VALUE_CHANGED, {cell : this.address, value : value});
    }
}
