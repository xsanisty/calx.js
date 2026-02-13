import { Cell } from "../Cell";
import { CellEvent } from "../Cell/CellEvent";
import { EventDispatcher } from "../Utility/EventDispatcher";
import { DependencyBuilder } from "./DependencyBuilder";
import { CellRegistry } from "../Sheet/CellRegistry";
import { CircularReferenceConfig } from "./CircularReferenceConfig";

export class DependencyTree {

    protected depTree : Record<string, Cell> = {};
    protected cellRegistry : CellRegistry;
    protected circularConfig: CircularReferenceConfig = {
        enabled: false,
        maxIterations: 100,
        maxChange: 0.001
    };

    /** Set of cell addresses that are part of circular references */
    private circularCells: Set<string> = new Set();

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
        const visiting = new Set<string>(); // Track cells being visited to detect cycles

        // Clear the circular cells set before recalculating
        this.circularCells.clear();

        // Calculate level for each cell based on its precedents
        const calculateLevel = (cell: Cell): number => {
            if (cellLevels.has(cell.address)) {
                return cellLevels.get(cell.address)!;
            }

            // Check for circular reference
            if (visiting.has(cell.address)) {
                // Circular reference detected - assign a special level
                // If circular references are enabled, we'll handle these separately
                this.circularCells.add(cell.address); // Cache this cell as circular
                cellLevels.set(cell.address, -1); // Mark as circular
                return -1;
            }

            visiting.add(cell.address);

            const precedents = cell.getPrecedents();
            if (!precedents || Object.keys(precedents).length === 0) {
                // No precedents, this is a leaf node (level 0)
                cellLevels.set(cell.address, 0);
                visiting.delete(cell.address);
                return 0;
            }

            // Find the maximum level among precedents
            let maxLevel = -1;
            for (const address in precedents) {
                const precedent = precedents[address];
                if (precedent) {
                    const precedentLevel = calculateLevel(precedent);
                    if (precedentLevel >= 0 && precedentLevel > maxLevel) {
                        maxLevel = precedentLevel;
                    }
                }
            }

            const level = maxLevel + 1;
            cellLevels.set(cell.address, level);
            visiting.delete(cell.address);
            return level;
        };

        // Calculate levels for all cells with formulas
        this.cellRegistry.each((cell: Cell) => {
            if (cell.formula && !visited.has(cell.address)) {
                calculateLevel(cell);
            }
        });

        // Group cells by level (only include cells with formulas and non-circular)
        cellLevels.forEach((level, address) => {
            const cell = this.cellRegistry.get(address);
            // Only include cells that have formulas and are not circular (level >= 0)
            if (cell && cell.formula && level >= 0) {
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

    /**
     * Configure circular reference handling
     * @param config Configuration for iterative calculation
     */
    public configureCircularReference(config: Partial<CircularReferenceConfig>): void {
        this.circularConfig = {
            ...this.circularConfig,
            ...config
        };
    }

    /**
     * Get current circular reference configuration
     */
    public getCircularReferenceConfig(): CircularReferenceConfig {
        return { ...this.circularConfig };
    }

    /**
     * Check if a cell is part of a circular reference
     * @param cell The cell to check (can be Cell object or address string)
     * @returns true if the cell is in a circular reference chain
     */
    public isInCircularReference(cell: Cell | string): boolean {
        const address = typeof cell === 'string' ? cell : cell.address;
        return this.circularCells.has(address);
    }

    /**
     * This will check for circular references in the dependency tree
     * @returns true if circular reference found, false otherwise
     */
    public checkCircularReference() : boolean {
        const visited = new Set<string>();
        const visiting = new Set<string>();

        const hasCycle = (cell: Cell): boolean => {
            if (visiting.has(cell.address)) {
                // Found a cycle - this cell is in the current path
                return true;
            }

            if (visited.has(cell.address)) {
                // Already checked this cell and its descendants
                return false;
            }

            // Mark as currently visiting
            visiting.add(cell.address);

            // Check all precedents (cells this cell depends on)
            const precedents = cell.getPrecedents();
            if (precedents) {
                for (const address in precedents) {
                    const precedent = precedents[address];
                    if (precedent && hasCycle(precedent)) {
                        return true;
                    }
                }
            }

            // Done visiting this cell
            visiting.delete(cell.address);
            visited.add(cell.address);

            return false;
        };

        // Check all cells with formulas for circular references
        for (const address in this.depTree) {
            const cell = this.depTree[address];
            if (hasCycle(cell)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get cells involved in circular references
     * @returns Array of cells that are part of circular reference chains
     */
    public getCircularCells(): Cell[] {
        const circularCells: Cell[] = [];
        const visited = new Set<string>();
        const visiting = new Set<string>();

        const findCycles = (cell: Cell, path: Cell[]): void => {
            if (visiting.has(cell.address)) {
                // Found a cycle - collect all cells in the cycle
                const cycleStart = path.findIndex(c => c.address === cell.address);
                if (cycleStart !== -1) {
                    for (let i = cycleStart; i < path.length; i++) {
                        if (!circularCells.some(c => c.address === path[i].address)) {
                            circularCells.push(path[i]);
                            // Also add to the cached set
                            this.circularCells.add(path[i].address);
                        }
                    }
                }
                return;
            }

            if (visited.has(cell.address)) {
                return;
            }

            visiting.add(cell.address);
            path.push(cell);

            const precedents = cell.getPrecedents();
            if (precedents) {
                for (const address in precedents) {
                    const precedent = precedents[address];
                    if (precedent) {
                        findCycles(precedent, [...path]);
                    }
                }
            }

            visiting.delete(cell.address);
            visited.add(cell.address);
        };

        // Check all cells with formulas
        for (const address in this.depTree) {
            const cell = this.depTree[address];
            findCycles(cell, []);
        }

        return circularCells;
    }

    /**
     * Resolve circular references using iterative calculation
     * @param cells Optional array of cells to calculate. If not provided, calculates all circular cells
     * @returns Number of iterations performed, or -1 if circular references not enabled
     */
    public resolveCircularReferences(cells?: Cell[]): number {
        if (!this.circularConfig.enabled) {
            return -1;
        }

        const cellsToCalculate = cells || this.getCircularCells();
        if (cellsToCalculate.length === 0) {
            return 0;
        }

        let iteration = 0;
        let maxChange = Infinity;

        // Store previous values for change detection
        const previousValues = new Map<string, any>();
        cellsToCalculate.forEach(cell => {
            previousValues.set(cell.address, cell.value);
        });

        while (iteration < this.circularConfig.maxIterations && maxChange > this.circularConfig.maxChange) {
            iteration++;
            maxChange = 0;

            // Calculate all circular cells in this iteration
            for (const cell of cellsToCalculate) {
                const oldValue = cell.value;
                cell.calculate();
                const newValue = cell.value;

                // Calculate change
                const change = this.calculateChange(oldValue, newValue);
                if (change > maxChange) {
                    maxChange = change;
                }
            }

            // Check if we've converged
            if (maxChange <= this.circularConfig.maxChange) {
                break;
            }
        }

        return iteration;
    }

    /**
     * Calculate the absolute change between two values
     */
    private calculateChange(oldValue: any, newValue: any): number {
        // Handle non-numeric values
        if (typeof oldValue !== 'number' || typeof newValue !== 'number') {
            return oldValue === newValue ? 0 : 1;
        }

        // Handle NaN and Infinity
        if (isNaN(oldValue) || isNaN(newValue) || !isFinite(oldValue) || !isFinite(newValue)) {
            return oldValue === newValue ? 0 : 1;
        }

        // Calculate absolute change
        return Math.abs(newValue - oldValue);
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