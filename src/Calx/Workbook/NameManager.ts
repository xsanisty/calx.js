import { Workbook } from "../Workbook";

/**
 * Named range definition
 */
export interface NamedRange {
    name: string;
    reference: string;
    sheetName?: string;
    comment?: string;
}

/**
 * Manage named cell or cell range
 */
export class NameManager {
    private _workbook : Workbook
    private _nameRegistry : Record<string, NamedRange> = {};

    public setContext(workbook : Workbook) {
        this._workbook = workbook;
    }

    /**
     * Define named cell or cell range.
     *
     * @param name the alias name (e.g., "SalesData", "TaxRate")
     * @param reference the cell or cell range to be aliased (e.g., "A1", "A1:B10", "Sheet1!A1:B10")
     * @param sheetName optional sheet name to scope this name to a specific sheet
     * @param comment optional comment describing the named range
     * @returns true if defined successfully, false if name is invalid
     */
    public define(name : string, reference : string, sheetName?: string, comment?: string): boolean {
        // Validate name: must start with letter or underscore, can contain letters, numbers, underscores
        // Cannot be a cell reference (e.g., "A1")
        if (!this.isValidName(name)) {
            return false;
        }

        this._nameRegistry[name] = {
            name,
            reference,
            sheetName,
            comment
        };
        return true;
    }

    /**
     * Check if a name is valid for a named range
     * - Must start with letter or underscore
     * - Can contain letters, numbers, underscores, dots
     * - Cannot be a cell reference (A1, B2, etc.)
     * - Cannot be a reserved keyword
     */
    private isValidName(name: string): boolean {
        // Must start with letter or underscore
        if (!/^[a-zA-Z_]/.test(name)) {
            return false;
        }

        // Can only contain letters, numbers, underscores, dots
        if (!/^[a-zA-Z_][a-zA-Z0-9_\.]*$/.test(name)) {
            return false;
        }

        // Cannot be a cell reference
        if (/^[A-Z]+[0-9]+$/.test(name)) {
            return false;
        }

        // Reserved keywords
        const reserved = ['TRUE', 'FALSE', 'NULL'];
        if (reserved.includes(name.toUpperCase())) {
            return false;
        }

        return true;
    }

    /**
     * Get the reference string for a named range
     *
     * @param name the alias name
     * @returns the reference string or undefined if not found
     */
    public getReference(name: string): string | undefined {
        const namedRange = this._nameRegistry[name];
        return namedRange?.reference;
    }

    /**
     * Resolve a named range to its value(s)
     *
     * @param name the alias name
     * @returns target cell value or array of values
     */
    public resolve(name : string) {
        const namedRange = this._nameRegistry[name];
        if (!namedRange) {
            return '#NAME?';
        }

        // Find the first sheet to use as context if no active sheet
        let targetSheet = this._workbook.getActiveSheet();
        if (!targetSheet) {
            const sheets = this._workbook.getSheets();
            const sheetNames = Object.keys(sheets);
            if (sheetNames.length > 0) {
                targetSheet = sheets[sheetNames[0]];
            }
        }

        // Set active sheet temporarily
        if (targetSheet) {
            this._workbook.setActiveSheet(targetSheet);
        }

        // If the reference includes sheet name, parse it as-is
        // Otherwise, prepend with "=" to make it a formula
        const formula = namedRange.reference.startsWith('=')
            ? namedRange.reference
            : `=${namedRange.reference}`;

        return this._workbook.parser.parse(formula);
    }

    /**
     * Check if a named range exists
     *
     * @param name the alias name
     * @returns true if the named range exists
     */
    public has(name: string): boolean {
        return name in this._nameRegistry;
    }

    /**
     * Get all named ranges
     *
     * @returns array of all named range definitions
     */
    public getAll(): NamedRange[] {
        return Object.values(this._nameRegistry);
    }

    /**
     * Get a named range definition
     *
     * @param name the alias name
     * @returns the named range definition or undefined
     */
    public get(name: string): NamedRange | undefined {
        return this._nameRegistry[name];
    }

    /**
     * Remove the alias
     *
     * @param name the alias name
     * @returns true if removed, false if not found
     */
    public remove(name : string): boolean {
        if (name in this._nameRegistry) {
            delete this._nameRegistry[name];
            return true;
        }
        return false;
    }

    /**
     * Clear all named ranges
     */
    public clear(): void {
        this._nameRegistry = {};
    }
}