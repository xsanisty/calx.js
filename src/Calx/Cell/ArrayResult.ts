/**
 * Represents the result of an array formula evaluation
 * Array formulas can spill into multiple cells
 */
export class ArrayResult {
    /**
     * Creates an ArrayResult
     * @param values 2D array of values [row][col]
     * @param rows Number of rows
     * @param cols Number of columns
     */
    constructor(
        public values: any[][],
        public rows: number,
        public cols: number
    ) {}

    /**
     * Get value at specific position
     */
    getValue(row: number, col: number): any {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return this.values[row][col];
        }
        return undefined;
    }

    /**
     * Check if this is a single value (1x1 array)
     */
    isSingleValue(): boolean {
        return this.rows === 1 && this.cols === 1;
    }

    /**
     * Get the single value if this is a 1x1 array
     */
    getSingleValue(): any {
        if (this.isSingleValue()) {
            return this.values[0][0];
        }
        return undefined;
    }

    /**
     * Convert to flat array
     */
    toFlatArray(): any[] {
        const result: any[] = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                result.push(this.values[row][col]);
            }
        }
        return result;
    }

    /**
     * Create ArrayResult from 1D array (vertical)
     */
    static fromVerticalArray(values: any[]): ArrayResult {
        return new ArrayResult(
            values.map(v => [v]),
            values.length,
            1
        );
    }

    /**
     * Create ArrayResult from 1D array (horizontal)
     */
    static fromHorizontalArray(values: any[]): ArrayResult {
        return new ArrayResult(
            [values],
            1,
            values.length
        );
    }

    /**
     * Create ArrayResult from 2D array
     */
    static from2DArray(values: any[][]): ArrayResult {
        const rows = values.length;
        const cols = rows > 0 ? Math.max(...values.map(row => row.length)) : 0;

        // Normalize to ensure all rows have same length
        const normalized = values.map(row => {
            const newRow = [...row];
            while (newRow.length < cols) {
                newRow.push(undefined);
            }
            return newRow;
        });

        return new ArrayResult(normalized, rows, cols);
    }

    /**
     * Create ArrayResult from single value
     */
    static fromSingleValue(value: any): ArrayResult {
        return new ArrayResult([[value]], 1, 1);
    }
}
