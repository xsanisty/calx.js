import { Cell } from "../Cell";
import { CellEvent } from "../Cell/CellEvent";
import { EventDispatcher } from "../Utility/EventDispatcher";
import { DependencyBuilder } from "./DependencyBuilder";
import { CellRegistry } from "../Sheet/CellRegistry";

export class DependencyTree {

    protected depTree : Record<string, Cell> = {};
    protected cellRegistry : CellRegistry;

    constructor(
        cellRegistry : CellRegistry,
        private dispatcher : EventDispatcher,
        private builder : DependencyBuilder
    ) {
        this.cellRegistry = cellRegistry;
        this.buildTree();
        this.dispatcher.listen(CellEvent.FORMULA_CHANGED, this._updateGraph.bind(this));
    }

    private buildTree() {
        // Build the dependency tree from cell registry
        this.cellRegistry.each((cell: Cell) => {
            if (cell.formula) {
                this.depTree[cell.address] = cell;
            }
        });
    }

    private _updateGraph(event: any)
    {
        // Rebuild the tree when a formula changes
        this.buildTree();
    }

    markAsDirty(cell : Cell) {
        if (this.depTree[cell.address]) {
            this.depTree[cell.address].markAsDirty();

            // Recursively mark dependents as dirty
            const dependents = this.depTree[cell.address].getDependents();
            for (const address in dependents) {
                this.markAsDirty(dependents[address]);
            }
        }
    }

    /**
     * Topologically sort object tree into array based on depth level
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
    topologicalSort() : Array<Array<Cell>> {
        const levels: Array<Array<Cell>> = [];
        const visited = new Set<string>();
        const cellLevels = new Map<string, number>();

        // Calculate level for each cell based on its precedents
        const calculateLevel = (cell: Cell): number => {
            if (cellLevels.has(cell.address)) {
                return cellLevels.get(cell.address)!;
            }

            const precedents = cell.getPrecedents();
            if (!precedents || Object.keys(precedents).length === 0) {
                // No precedents, this is a leaf node (level 0)
                cellLevels.set(cell.address, 0);
                return 0;
            }

            // Find the maximum level among precedents
            let maxLevel = -1;
            for (const address in precedents) {
                const precedent = precedents[address];
                if (precedent) {
                    const precedentLevel = calculateLevel(precedent);
                    if (precedentLevel > maxLevel) {
                        maxLevel = precedentLevel;
                    }
                }
            }

            const level = maxLevel + 1;
            cellLevels.set(cell.address, level);
            return level;
        };

        // Calculate levels for all cells with formulas
        this.cellRegistry.each((cell: Cell) => {
            if (cell.formula && !visited.has(cell.address)) {
                calculateLevel(cell);
            }
        });

        // Group cells by level (only include cells with formulas)
        cellLevels.forEach((level, address) => {
            const cell = this.cellRegistry.get(address);
            // Only include cells that have formulas
            if (cell && cell.formula) {
                if (!levels[level]) {
                    levels[level] = [];
                }
                levels[level].push(cell);
            }
        });

        return levels;
    }

    /**
     * Flatten dependency graph into a flat array in topological order
     * Returns cells in the order they should be calculated
     * @returns Array of cells in topological order
     */
    flattenToTopology(): Cell[] {
        const levels = this.topologicalSort();
        const result: Cell[] = [];

        // Flatten the 2D array of levels into a 1D array
        for (const level of levels) {
            if (level) { // Skip undefined levels
                result.push(...level);
            }
        }

        return result;
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