import * as formulajs from '@formulajs/formulajs';
import { SharedContext } from '../Parser/SharedContext';
import { ArrayResult } from '../Cell/ArrayResult';

/**
 * FormulaJS Wrapper for Calx Environment
 *
 * This wrapper provides access to FormulaJS functions in the Calx context.
 * It handles type conversions and provides a consistent interface.
 */
export class FormulaJSWrapper {
    private context: SharedContext;

    constructor(context: SharedContext) {
        this.context = context;
    }

    /**
     * Get a FormulaJS function by name
     */
    getFunction(name: string): Function | undefined {
        const upperName = name.toUpperCase();

        // Check for custom user functions first (registered via Calx.setFormula)
        // Access via require to avoid circular dependency
        try {
            const { Calx } = require('../../Calx');
            if (Calx.formulae && Calx.formulae[upperName]) {
                return Calx.formulae[upperName];
            }
        } catch (e) {
            // Ignore if Calx is not available yet
        }

        // Check for custom implementations
        if (upperName === 'SEQUENCE') {
            return this.sequenceFunction.bind(this);
        }
        if (upperName === 'SORT') {
            return this.sortFunction.bind(this);
        }
        if (upperName === 'FILTER') {
            return this.filterFunction.bind(this);
        }
        if (upperName === 'UNIQUE') {
            return this.uniqueFunction.bind(this);
        }

        // Check if function exists in formulajs
        let fn = (formulajs as any)[upperName];

        // Some functions like STDEV are objects with sub-functions (STDEV.S, STDEV.P)
        // For backward compatibility, use STDEV.S as default
        if (fn && typeof fn === 'object' && !Array.isArray(fn)) {
            // Try .S first (sample standard deviation, most common)
            if (typeof fn.S === 'function') {
                fn = fn.S;
            }
            // Then try .P (population standard deviation)
            else if (typeof fn.P === 'function') {
                fn = fn.P;
            }
        }

        if (typeof fn === 'function') {
            return fn;
        }

        return undefined;
    }

    /**
     * Custom SEQUENCE function (Excel 365 dynamic array function)
     * SEQUENCE(rows, [columns], [start], [step])
     */
    private sequenceFunction(rows: number, columns: number = 1, start: number = 1, step: number = 1): any {
        const result: number[][] = [];
        let value = start;

        for (let r = 0; r < rows; r++) {
            const row: number[] = [];
            for (let c = 0; c < columns; c++) {
                row.push(value);
                value += step;
            }
            result.push(row);
        }

        // If single column, return as 1D array
        if (columns === 1) {
            return result.map(row => row[0]);
        }

        return result;
    }

    /**
     * Custom SORT function (Excel 365 dynamic array function)
     * SORT(array, [sort_index], [sort_order], [by_col])
     */
    private sortFunction(array: any, sortIndex: number = 1, sortOrder: number = 1, byCol: boolean = false): any {
        // Convert array to 2D if needed
        let arr2D: any[][];
        if (!Array.isArray(array)) {
            arr2D = [[array]];
        } else if (!Array.isArray(array[0])) {
            // 1D array - convert to column
            arr2D = array.map(val => [val]);
        } else {
            arr2D = array;
        }

        // Make a copy to avoid mutating original
        const sorted = arr2D.map(row => [...row]);

        // Sort by column (default) or by row
        if (!byCol) {
            // Sort rows based on the specified column index (1-based)
            const colIdx = sortIndex - 1;
            sorted.sort((a, b) => {
                const aVal = a[colIdx];
                const bVal = b[colIdx];

                // Handle nulls/undefined
                if (aVal == null && bVal == null) return 0;
                if (aVal == null) return sortOrder === 1 ? 1 : -1;
                if (bVal == null) return sortOrder === 1 ? -1 : 1;

                // Compare values
                if (aVal < bVal) return sortOrder === 1 ? -1 : 1;
                if (aVal > bVal) return sortOrder === 1 ? 1 : -1;
                return 0;
            });
        }

        // Return as 1D array if it was originally 1D
        if (!Array.isArray(array[0])) {
            return sorted.map(row => row[0]);
        }

        return sorted;
    }

    /**
     * Custom FILTER function (Excel 365 dynamic array function)
     * FILTER(array, include, [if_empty])
     */
    private filterFunction(array: any, include: any, ifEmpty: any = '#N/A'): any {
        // Convert arrays to 2D if needed
        let arr2D: any[][];
        if (!Array.isArray(array)) {
            arr2D = [[array]];
        } else if (!Array.isArray(array[0])) {
            arr2D = array.map(val => [val]);
        } else {
            arr2D = array;
        }

        let include1D: any[];
        if (!Array.isArray(include)) {
            include1D = [include];
        } else if (Array.isArray(include[0])) {
            // 2D include array - flatten to 1D
            include1D = include.map(row => row[0]);
        } else {
            include1D = include;
        }

        // Filter rows based on include array
        const filtered = arr2D.filter((row, idx) => {
            const includeVal = include1D[idx];
            // In Excel, any non-zero/non-false value is truthy
            return includeVal !== false && includeVal !== 0 && includeVal != null;
        });

        // Return if_empty if no matches
        if (filtered.length === 0) {
            return ifEmpty;
        }

        // Return as 1D array if original was 1D
        if (!Array.isArray(array[0])) {
            return filtered.map(row => row[0]);
        }

        return filtered;
    }

    /**
     * Custom UNIQUE function (Excel 365 dynamic array function)
     * UNIQUE(array, [by_col], [exactly_once])
     */
    private uniqueFunction(array: any, byCol: boolean = false, exactlyOnce: boolean = false): any {
        // Convert to 2D array if needed
        let arr2D: any[][];
        let was1D = false;

        if (!Array.isArray(array)) {
            arr2D = [[array]];
            was1D = true;
        } else if (!Array.isArray(array[0])) {
            arr2D = array.map(val => [val]);
            was1D = true;
        } else {
            arr2D = array;
        }

        const unique: any[][] = [];
        const seen = new Map<string, number>();

        // Process each row
        for (const row of arr2D) {
            const key = JSON.stringify(row);
            const count = seen.get(key) || 0;
            seen.set(key, count + 1);

            if (count === 0) {
                unique.push(row);
            }
        }

        // If exactly_once is true, filter to only values that appear once
        if (exactlyOnce) {
            const result = unique.filter(row => {
                const key = JSON.stringify(row);
                return seen.get(key) === 1;
            });

            if (result.length === 0) {
                return '#N/A';
            }

            return was1D ? result.map(row => row[0]) : result;
        }

        // Return as 1D array if original was 1D
        return was1D ? unique.map(row => row[0]) : unique;
    }

    /**
     * Call a FormulaJS function with arguments
     */
    callFunction(name: string, args: any[]): any {
        const fn = this.getFunction(name);

        if (!fn) {
            throw new Error(`Function ${name} not found`);
        }

        try {
            // Convert Range objects to arrays if needed
            const convertedArgs = args.map(arg => this.convertArg(arg));

            // Call the function
            let result = fn(...convertedArgs);

            // Handle Date objects - convert to Excel serial number
            if (result instanceof Date) {
                // Excel's epoch is December 30, 1899
                const excelEpoch = new Date(1899, 11, 30).getTime();
                const msPerDay = 24 * 60 * 60 * 1000;
                result = Math.floor((result.getTime() - excelEpoch) / msPerDay);
            }

            // Handle array results from dynamic array functions (SEQUENCE, SORT, UNIQUE, etc.)
            // Convert to ArrayResult for spilling behavior
            if (Array.isArray(result) && this.isDynamicArrayFunction(name)) {
                // Check if it's a 2D array
                if (result.length > 0 && Array.isArray(result[0])) {
                    return ArrayResult.from2DArray(result);
                } else {
                    // 1D array - return as vertical array for spilling
                    return ArrayResult.fromVerticalArray(result);
                }
            }

            // Handle error results
            if (result && typeof result === 'object' && result.error) {
                return '#ERROR!';
            }

            return result;
        } catch (error) {
            console.error(`Error calling function ${name}:`, error);
            return '#ERROR!';
        }
    }

    /**
     * Check if a function is a dynamic array function that should spill
     */
    private isDynamicArrayFunction(name: string): boolean {
        const dynamicArrayFunctions = [
            'SEQUENCE', 'SORT', 'UNIQUE', 'FILTER', 'RANDARRAY',
            'SORTBY', 'XLOOKUP', 'XMATCH'
        ];
        return dynamicArrayFunctions.includes(name.toUpperCase());
    }

    /**
     * Convert argument to appropriate type for FormulaJS
     */
    private convertArg(arg: any): any {
        // If it's null or undefined, return as-is
        if (arg == null) {
            return arg;
        }

        // If it's an array, recursively convert elements
        if (Array.isArray(arg)) {
            return arg.map(item => this.convertArg(item));
        }

        // If it's a Range object, convert to value or array
        if (arg && typeof arg === 'object' && typeof arg.toArray === 'function') {
            const values = arg.toArray();
            // If single cell, return single value
            return values.length === 1 ? values[0] : values;
        }

        // If it's a Cell object, return its value
        if (arg && typeof arg === 'object' && 'value' in arg) {
            return arg.value;
        }

        // Return as-is for primitives
        return arg;
    }

    /**
     * Get all available FormulaJS functions
     */
    getAvailableFunctions(): string[] {
        return Object.keys(formulajs).filter(key => {
            return typeof (formulajs as any)[key] === 'function';
        });
    }

    /**
     * Check if a function exists
     */
    hasFunction(name: string): boolean {
        return this.getFunction(name) !== undefined;
    }
}

/**
 * Create a FormulaJS wrapper instance
 */
export function createFormulaJSWrapper(context: SharedContext): FormulaJSWrapper {
    return new FormulaJSWrapper(context);
}

/**
 * Export commonly used FormulaJS functions for convenience
 */
export const FormulaJSFunctions = {
    // Math functions
    SUM: formulajs.SUM,
    AVERAGE: formulajs.AVERAGE,
    MIN: formulajs.MIN,
    MAX: formulajs.MAX,
    COUNT: formulajs.COUNT,
    COUNTA: formulajs.COUNTA,
    ROUND: formulajs.ROUND,
    ROUNDUP: formulajs.ROUNDUP,
    ROUNDDOWN: formulajs.ROUNDDOWN,
    ABS: formulajs.ABS,
    SQRT: formulajs.SQRT,
    POWER: formulajs.POWER,
    MOD: formulajs.MOD,

    // Statistical functions
    MEDIAN: formulajs.MEDIAN,
    MODE: formulajs.MODE,
    STDEV: formulajs.STDEV,
    VAR: formulajs.VAR,

    // Logical functions
    IF: formulajs.IF,
    AND: formulajs.AND,
    OR: formulajs.OR,
    NOT: formulajs.NOT,
    XOR: formulajs.XOR,

    // Text functions
    CONCATENATE: formulajs.CONCATENATE,
    LEFT: formulajs.LEFT,
    RIGHT: formulajs.RIGHT,
    MID: formulajs.MID,
    LEN: formulajs.LEN,
    LOWER: formulajs.LOWER,
    UPPER: formulajs.UPPER,
    TRIM: formulajs.TRIM,
    TEXT: formulajs.TEXT,

    // Lookup functions
    VLOOKUP: formulajs.VLOOKUP,
    HLOOKUP: formulajs.HLOOKUP,
    MATCH: formulajs.MATCH,
    INDEX: formulajs.INDEX,

    // Date functions
    DATE: formulajs.DATE,
    TODAY: formulajs.TODAY,
    NOW: formulajs.NOW,
    YEAR: formulajs.YEAR,
    MONTH: formulajs.MONTH,
    DAY: formulajs.DAY,

    // Financial functions
    PMT: formulajs.PMT,
    FV: formulajs.FV,
    PV: formulajs.PV,
    RATE: formulajs.RATE,
    NPV: formulajs.NPV,
    IRR: formulajs.IRR,
};
