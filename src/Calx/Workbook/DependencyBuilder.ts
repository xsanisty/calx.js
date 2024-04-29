import Cell from "../Cell";
import CellRegistry from "../Sheet/CellRegistry";
import EventDispatcher from "../Utility/EventDispatcher";
import DependencyTree from "./DependencyTree";

export default class DependencyBuilder {
    private patterns : Record<string, RegExp> = {
        remoteColumnRange   : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+\s*:\s*[A-Za-z]+/g,
        remoteRowRange      : /\#[A-Za-z0-9_]+\s*!\s*[0-9]+\s*:\s*[0-9]+/g,
        remoteCellRange     : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+[0-9]+\s*:\s*[A-Za-z]+[0-9]+/g,
        remoteCell          : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+[0-9]+/g,
        columnRange         : /[A-Za-z]+\s*:\s*[A-Za-z]+/g,
        rowRange            : /[0-9]+\s*:\s*[0-9]+/g,
        cellRange           : /[A-Za-z]+[0-9]+\s*:\s*[A-Za-z]+[0-9]+/g,
        cell                : /[A-Z]+[0-9]+/g
    };

    constructor() {

    }

    build(cells : CellRegistry) : DependencyTree {
        cells.each((cell : Cell) => {
            const dependencies = this.getFormulaDependencies(cell.formula);

            cell.setDependents(dependencies);
        });

        return new DependencyTree(cells, new EventDispatcher, this);
    }

    private getFormulaDependencies(formula : string) : Record<string, Cell> {
        return {};
    }
}