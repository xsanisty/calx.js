import Cell from "../Cell";
import Sheet from "../Sheet";
import EventDispatcher from "../Utility/EventDispatcher";
import { CellData } from "../Workbook/Data";
import { SheetEvent } from "./SheetEvent";

export default class CellRegistry {
    private cells : Record<string, Cell> = {};
    private sheet : Sheet;

    constructor(
        private event : EventDispatcher
    ) {

    }

    public add (cell : Cell) {
        this.cells[cell.address] = cell;

        this.event.dispatch(SheetEvent.CELL_ADDED, {cell : cell});
    }

    public remove (cell : Cell) {
        delete this.cells[cell.address];

        this.event.dispatch(SheetEvent.CELL_REMOVED, {cell : cell});
    }

    public get (address : string) : Cell {
        if (this.cells.hasOwnProperty(address)) {
            return this.cells[address];
        } else {
            // create new cell
            const cell = new Cell(address, this.sheet );
        }
    }

    public has (address : string) : boolean {
        return this.cells.hasOwnProperty(address);
    }

    public create (address : string, data : CellData) : Cell {
        if (this.has(address)) {
            throw new Error(`Cell ${address} already exists`);
        }

        const cell = new Cell(address, this.sheet, data);

        this.cells[cell.address] = cell;

        this.event.dispatch(SheetEvent.CELL_CREATED, {cell : cell});

        return cell;
    }

    public all () : Record<string, Cell> {
        return this.cells;
    }

    public count () : number {
        return Object.keys(this.cells).length;
    }

    public clear () {
        this.cells = {};
    }

    public each (callback : (cell : Cell) => void) {
        for (const address in this.cells) {
            callback(this.cells[address]);
        }
    }

    public filter (callback : (cell : Cell) => boolean) : Record<string, Cell> {
        const filtered : Record<string, Cell> = {};

        for (const address in this.cells) {
            if (callback(this.cells[address])) {
                filtered[address] = this.cells[address];
            }
        }

        return filtered;
    }
}