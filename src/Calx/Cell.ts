import Sheet from './Sheet';
import { CellEvent } from './Cell/CellEvent';
import { DataType } from './Cell/DataType';
import { ErrorType } from './Cell/ErrorType';
import { FormatterInterface } from './Cell/Formatter';

/**
 * Cell object, hold single value or formula
 */
export default class Cell {
    private _value : any;                               //Cell original value
    private _address : string                           //Cell address
    private _formula : string;                          //Cell formula
    private _computed : any;                            //Result of the computed formula
    private _rules : Record<string, RegExp> = {
        address : /^[A-Z]+[0-9]+$/,                     //Cell address validation rule
    };

    protected precedents : Record<string, Cell> = {};   //Cells registry required by the formula
    protected dependents : Record<string, Cell> = {};   //Cells registry that depend on this cell

    protected remotePrecedents : Record<string, Cell> = {}; //Cells registry required by the formula from other sheets
    protected remoteDependents : Record<string, Cell> = {}; //Cells registry that depend on this cell from other sheets

    /** Flags */
    private _dirty : boolean = false;
    private _calculated : boolean = false;
    private _hasRemotePrecedents : boolean = false;
    private _hasRemoteDependents : boolean = false;
    private _hasDynamicPrecedents : boolean = false;

    protected format : string;
    protected formatter : FormatterInterface;
    protected el ?: HTMLElement;

    constructor(
        address : string,
        protected sheet : Sheet,
        protected _type : DataType = DataType.TEXT
    ) {
        this.address = address;
        this.init();
    }

    public init() {

    }

    /** Mount cell object into specific element */
    public mount(el: HTMLElement) {
        this.el = el;

        this.sheet.dispatcher.dispatch(CellEvent.ELEMENT_MOUNTED, {cell : this.address, el : el});
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

    /** Check if cell is affected by changes on other cells and need recalculation */
    public isDirty() : boolean {
        return this._dirty
    }

    public markAsDirty() {
        this._dirty = true;
    }

    /** Check if the current is numeric */
    public isNumeric() : boolean {
        return !isNaN(this.value - parseFloat(this.value));
    }

    public get address() : string {
        return this._address;
    }

    public set address(address : string) {
        if (address.match(this._rules.address)) {
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
    public get value() : any | ErrorType {
        let value : any | ErrorType = this.formula ? this._computed : this._value;

        switch (this._type) {
            case DataType.NUMBER:
                return parseFloat(value);
            case DataType.BOOLEAN:
                return !!value;
            case DataType.DATE:
                return new Date(value);
            case DataType.ERROR:
                return ErrorType[value as keyof typeof ErrorType];
            default:
                return value;
        }
    }

    /**
     * Set cell value, this will reset the formula
     */
    public set value(value : any) {
        this._value = value;
        this._formula = null;

        this.sheet.dispatcher.dispatch(CellEvent.VALUE_CHANGED, {cell : this.address, value : value});
    }

    public getStringValue() : string {
        return this.value.toString();
    }

    public getNumericValue() : number {
        return isNaN (parseFloat(this.value)) ? 0 : parseFloat(this.value);
    }

    public getPrecedents() : Record<string, Cell>|null {
        if (this._hasDynamicPrecedents) {

        } else {
            return this.precedents;
        }
    }

    public setPrecedents(precedents : Record<string, Cell>) {
        this.precedents = precedents;
    }

    public addPrecedent(cell : Cell) {
        this.precedents[cell.address] = cell;
    }

    public getDependents() : Record<string, Cell> {
        return this.dependents;
    }

    public setDependents(dependents : Record<string, Cell>) {
        this.dependents = dependents;
    }

    public addDependent(cell : Cell) {
        this.dependents[cell.address] = cell;
    }
}
