import Cell from "../Cell";
import {CellEvent} from "../Cell/CellEvent";
import EventDispatcher from "../Utility/EventDispatcher";
import DependencyBuilder from "./DependencyBuilder";

export default class DependencyTree {

    protected depTree : Record<string, Cell> = {};

    constructor(
        private data : any,
        private dispatcher : EventDispatcher,
        private builder : DependencyBuilder
    ) {
        this.dispatcher.listen(CellEvent.FORMULA_CHANGED, this._updateGraph);
    }

    private _updateGraph()
    {

    }

    markAsDirty(cell : Cell) {
        this.depTree[cell.address].markAsDirty();
    }

    /**
     * Group object tree into array based on depth level
     *
     * a -
     *    |- c -
     * b -      | - e -
     *       d -        | - g
     *                  |
     *              f -
     *
     * to
     *
     * a | c | e | g
     * b | d | f |
     */
    flatten() : Array<Array<Cell>> {
        const result : Array<Array<Cell>> = [];
        const depth = this.getDepth();

        for (let i = 0; i < depth; i++) {
            result.push([]);
        }

        this._flatten(this.depTree, result, 0);

        return result;
    }

    private _flatten(tree : Record<string, Cell>, result : Array<Array<Cell>>, level : number) {
        for (const key in tree) {
            const cell = tree[key];

            result[level].push(cell);

            if (cell.getDependents()) {
                this._flatten(cell.getDependents(), result, level + 1);
            }
        }
    }

    /**
     * Get the depth level of the tree
     */
    getDepth() : number {
        return this._getDepth(this.depTree);
    }

    private _getDepth(tree : Record<string, Cell>) : number {
        let max = 0;

        for (const key in tree) {
            const cell = tree[key];

            if (cell.getDependents()) {
                const depth = this._getDepth(cell.getDependents());

                if (depth > max) {
                    max = depth;
                }
            }
        }

        return max + 1;
    }

}