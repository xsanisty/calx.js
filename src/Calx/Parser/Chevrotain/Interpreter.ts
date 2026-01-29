import { CstNode } from 'chevrotain';
import { CalxLexer, CalxParser } from './Parser';
import { SharedContext } from '../SharedContext';
import { ErrorType } from '../../Cell/ErrorType';
import { ArrayResult } from '../../Cell/ArrayResult';

const parserInstance = new CalxParser();

export class CalxInterpreter extends parserInstance.getBaseCstVisitorConstructorWithDefaults() {
    private context?: SharedContext;
    public yy?: SharedContext;

    constructor() {
        super();
        this.validateVisitor();
    }

    setContext(context: SharedContext) {
        this.context = context;
        this.yy = context;
    }

    getContext(): SharedContext | undefined {
        return this.context;
    }

    expression(ctx: any) {
        if (ctx.arrayFormula && ctx.arrayFormula.length > 0) {
            return this.visit(ctx.arrayFormula[0]);
        }
        return this.visit(ctx.comparisonExpression[0]);
    }

    arrayFormula(ctx: any) {
        // Array formula with curly braces: {1,2,3} or {1;2;3} or {1,2;3,4}

        // Check if we have the ArrayRowSep (semicolon) which indicates multiple rows
        const hasRowSeparator = ctx.ArrayRowSep && ctx.ArrayRowSep.length > 0;

        if (hasRowSeparator) {
            // Multi-row array: {1,2;3,4} creates [[1,2],[3,4]]
            // Need to figure out which separator comes after each expression

            // Build a map of separator positions
            const separators: Array<{offset: number, type: 'comma' | 'semicolon'}> = [];

            if (ctx.Comma) {
                ctx.Comma.forEach((token: any) => {
                    separators.push({ offset: token.startOffset, type: 'comma' });
                });
            }

            if (ctx.ArrayRowSep) {
                ctx.ArrayRowSep.forEach((token: any) => {
                    separators.push({ offset: token.startOffset, type: 'semicolon' });
                });
            }

            // Sort separators by offset
            separators.sort((a, b) => a.offset - b.offset);

            // Build rows by grouping expressions based on separator types
            const rows: any[][] = [];
            let currentRow: any[] = [];

            for (let i = 0; i < ctx.expression.length; i++) {
                currentRow.push(this.visit(ctx.expression[i]));

                // Check what separator comes after this expression (if any)
                if (i < separators.length) {
                    if (separators[i].type === 'semicolon') {
                        // Semicolon means end of current row
                        rows.push(currentRow);
                        currentRow = [];
                    }
                    // Comma means continue in the same row, so do nothing
                }
            }

            // Add last row if not empty
            if (currentRow.length > 0) {
                rows.push(currentRow);
            }

            return ArrayResult.from2DArray(rows);
        }

        // Single row array: {1,2,3} or single value {5}
        const expressions = ctx.expression.map((exp: any) => this.visit(exp));

        if (expressions.length === 1) {
            const result = expressions[0];

            // If already an ArrayResult, return it
            if (result instanceof ArrayResult) {
                return result;
            }

            // If array, convert to ArrayResult
            if (Array.isArray(result)) {
                return ArrayResult.fromHorizontalArray(result);
            }

            // Single value
            return ArrayResult.fromSingleValue(result);
        }

        // Multiple expressions separated by commas = horizontal array
        return ArrayResult.fromHorizontalArray(expressions);
    }

    comparisonExpression(ctx: any) {
        const left = this.visit(ctx.lhs[0]);

        // If there's no comparison operator, just return the left value
        if (!ctx.rhs || ctx.rhs.length === 0) {
            return left;
        }

        const right = this.visit(ctx.rhs[0]);

        // Handle different comparison operators
        if (ctx.GreaterThan) {
            return left > right;
        } else if (ctx.LessThan) {
            return left < right;
        } else if (ctx.GreaterThanEqual) {
            return left >= right;
        } else if (ctx.LessThanEqual) {
            return left <= right;
        } else if (ctx.Equal) {
            return left === right;
        } else if (ctx.NotEqual) {
            return left !== right;
        }

        return left; // Fallback
    }

    additionExpression(ctx: any) {
        let result = this.visit(ctx.lhs[0]);

        // Process all additions/subtractions from left to right
        if (ctx.rhs && ctx.rhs.length > 0) {
            // Build array of operators in order they appear
            const operators: Array<{type: 'plus' | 'minus', offset: number}> = [];

            if (ctx.Plus) {
                ctx.Plus.forEach((token: any) => {
                    operators.push({ type: 'plus', offset: token.startOffset });
                });
            }

            if (ctx.Minus) {
                ctx.Minus.forEach((token: any) => {
                    operators.push({ type: 'minus', offset: token.startOffset });
                });
            }

            // Sort operators by offset to get correct order
            operators.sort((a, b) => a.offset - b.offset);

            for (let i = 0; i < ctx.rhs.length; i++) {
                const rightValue = this.visit(ctx.rhs[i]);
                const operator = operators[i];

                if (operator.type === 'plus') {
                    result = this.arrayOperation(result, rightValue, (a, b) => a + b);
                } else if (operator.type === 'minus') {
                    result = this.arrayOperation(result, rightValue, (a, b) => a - b);
                }
            }
        }

        return result;
    }

    /**
     * Perform array operation - applies operation element-wise if either operand is an array
     */
    private arrayOperation(left: any, right: any, operation: (a: any, b: any) => any): any {
        // Check for error values first
        if (this.isError(left)) return left;
        if (this.isError(right)) return right;

        // If neither is an array, just perform the operation
        if (!Array.isArray(left) && !Array.isArray(right)) {
            return operation(left, right);
        }

        // Convert to arrays if needed
        const leftArray = Array.isArray(left) ? left : [left];
        const rightArray = Array.isArray(right) ? right : [right];

        // Determine the result size
        const resultLength = Math.max(leftArray.length, rightArray.length);
        const result = [];

        for (let i = 0; i < resultLength; i++) {
            const leftVal = leftArray[Math.min(i, leftArray.length - 1)];
            const rightVal = rightArray[Math.min(i, rightArray.length - 1)];
            result.push(operation(leftVal, rightVal));
        }

        // Return as ArrayResult if it's an array
        return ArrayResult.fromVerticalArray(result);
    }

    /**
     * Check if a value is an Excel error
     */
    private isError(value: any): boolean {
        if (typeof value !== 'string') return false;
        return /^#[A-Z\/!]+\??$/.test(value); // Matches #NAME?, #REF!, #DIV/0!, etc.
    }

    concatenationExpression(ctx: any) {
        let result = this.visit(ctx.lhs[0]);

        // Process all concatenations from left to right
        if (ctx.rhs && ctx.rhs.length > 0) {
            for (let i = 0; i < ctx.rhs.length; i++) {
                const rightValue = this.visit(ctx.rhs[i]);
                // Convert both sides to strings for concatenation
                result = String(result) + String(rightValue);
            }
        }

        return result;
    }

    multiplicationExpression(ctx: any) {
        let result = this.visit(ctx.lhs[0]);

        // Process all multiplications/divisions from left to right
        if (ctx.rhs && ctx.rhs.length > 0) {
            // Build array of operators in order they appear
            const operators: Array<{type: 'mult' | 'div', offset: number}> = [];

            if (ctx.Mult) {
                ctx.Mult.forEach((token: any) => {
                    operators.push({ type: 'mult', offset: token.startOffset });
                });
            }

            if (ctx.Div) {
                ctx.Div.forEach((token: any) => {
                    operators.push({ type: 'div', offset: token.startOffset });
                });
            }

            // Sort operators by offset to get correct order
            operators.sort((a, b) => a.offset - b.offset);

            for (let i = 0; i < ctx.rhs.length; i++) {
                const rightValue = this.visit(ctx.rhs[i]);
                const operator = operators[i];

                if (operator.type === 'mult') {
                    result = this.arrayOperation(result, rightValue, (a, b) => a * b);
                } else if (operator.type === 'div') {
                    result = this.arrayOperation(result, rightValue, (a, b) => {
                        // Check for division by zero
                        if (b === 0) {
                            return "#DIV/0!";
                        }
                        return a / b;
                    });
                }
            }
        }

        return result;
    }

    exponentiationExpression(ctx: any) {
        let result = this.visit(ctx.lhs[0]);

        // Process all exponentiations from left to right
        if (ctx.rhs && ctx.rhs.length > 0) {
            for (let i = 0; i < ctx.rhs.length; i++) {
                const rightValue = this.visit(ctx.rhs[i]);
                result = this.arrayOperation(result, rightValue, (a, b) => Math.pow(a, b));
            }
        }

        return result;
    }

    unaryExpression(ctx: any) {
        if (ctx.Minus) {
            // Handle unary minus (negation)
            const value = this.visit(ctx.unaryExpression[0]);
            return -value;
        } else {
            // Otherwise, process the atomic expression
            return this.visit(ctx.atomicExpression[0]);
        }
    }

    atomicExpression(ctx: any) {
        // Handle literals
        if (ctx.NumberLiteral) {
            return Number(ctx.NumberLiteral[0].image);
        } else if (ctx.StringLiteral) {
            // Remove quotes from string literals
            const str = ctx.StringLiteral[0].image;
            return str.substring(1, str.length - 1);
        } else if (ctx.TrueKeyword) {
            return true;
        } else if (ctx.FalseKeyword) {
            return false;
        } else if (ctx.NullKeyword) {
            return null;
        } else if (ctx.ErrorConstant) {
            // Return error constants as is
            return ctx.ErrorConstant[0].image;
        }

        // Handle cell references and variables
        if (ctx.Variable || ctx.CellRef || ctx.CellRange || ctx.RowRange || ctx.ColumnRange) {
            let ref;
            let sheetName = '';

            // Extract sheet name if present
            if (ctx.SheetName && ctx.SheetName.length > 0) {
                sheetName = ctx.SheetName[0].image;
                // Remove the trailing '!'
                sheetName = sheetName.substring(0, sheetName.length - 1);
            }

            if (ctx.Variable && ctx.Variable.length > 0) {
                ref = ctx.Variable[0].image;
                return this.resolveVariable(ref, sheetName);
            } else if (ctx.CellRef && ctx.CellRef.length > 0) {
                ref = ctx.CellRef[0].image;
                return this.resolveCellReference(ref, sheetName);
            } else if (ctx.CellRange && ctx.CellRange.length > 0) {
                ref = ctx.CellRange[0].image;
                return this.resolveCellRange(ref, sheetName);
            } else if (ctx.RowRange && ctx.RowRange.length > 0) {
                ref = ctx.RowRange[0].image;
                return this.resolveRowRange(ref, sheetName);
            } else if (ctx.ColumnRange && ctx.ColumnRange.length > 0) {
                ref = ctx.ColumnRange[0].image;
                return this.resolveColumnRange(ref, sheetName);
            }
        }

        // Handle function calls
        if (ctx.ifFunctionCall) {
            return this.visit(ctx.ifFunctionCall[0]);
        } else if (ctx.functionCall) {
            return this.visit(ctx.functionCall[0]);
        } else if (ctx.ifErrorFunctionCall) {
            return this.visit(ctx.ifErrorFunctionCall[0]);
        } else if (ctx.ifsFunctionCall) {
            return this.visit(ctx.ifsFunctionCall[0]);
        } else if (ctx.switchFunctionCall) {
            return this.visit(ctx.switchFunctionCall[0]);
        }

        // Handle parenthesized expressions
        if (ctx.LParen) {
            return this.visit(ctx.expression[0]);
        }

        // Fallback
        console.warn("Unhandled atomic expression:", ctx);
        return null;
    }

    ifFunctionCall(ctx: any) {
        const condition = this.visit(ctx.condition[0]);

        if (this.isTruthy(condition)) {
            return this.visit(ctx.whenTrue[0]);
        } else if (ctx.whenFalse && ctx.whenFalse.length > 0) {
            return this.visit(ctx.whenFalse[0]);
        }

        // If condition is false and no false branch, Excel returns FALSE
        return false;
    }

    functionCall(ctx: any) {
        const funcName = ctx.FunctionName[0].image.toUpperCase();
        const args = [];

        // Collect all arguments
        if (ctx.expression) {
            for (const expr of ctx.expression) {
                args.push(this.visit(expr));
            }
        }

        // Prioritize callFunction to ensure ArrayResult wrapping for dynamic arrays
        if (this.context && typeof this.context.callFunction === 'function') {
            try {
                let result = this.context.callFunction(funcName, args);

                // Handle Date objects - convert to Excel serial number
                if (result instanceof Date) {
                    const excelEpoch = new Date(1899, 11, 30).getTime();
                    const msPerDay = 24 * 60 * 60 * 1000;
                    result = Math.floor((result.getTime() - excelEpoch) / msPerDay);
                }

                return result;
            } catch (e) {
                console.warn(`Function ${funcName} not found in callFunction, trying getFunction`);
            }
        }

        // Fallback to getFunction for custom/user-defined functions
        if (this.context && typeof this.context.getFunction === 'function') {
            const func = this.context.getFunction(funcName);
            if (typeof func === 'function') {
                try {
                    let result = func(...args);

                    // Handle Date objects - convert to Excel serial number
                    if (result instanceof Date) {
                        const excelEpoch = new Date(1899, 11, 30).getTime();
                        const msPerDay = 24 * 60 * 60 * 1000;
                        result = Math.floor((result.getTime() - excelEpoch) / msPerDay);
                    }

                    return result;
                } catch (e) {
                    console.error(`Error executing function ${funcName}:`, e);
                    return "#ERROR!";
                }
            }
        }

        // Handle common Excel functions directly as fallback
        return this.executeBuiltInFunction(funcName, args);
    }

    ifErrorFunctionCall(ctx: any) {
        try {
            const value = this.visit(ctx.value[0]);
            // Check if the result is an error value
            if (this.isErrorValue(value)) {
                return this.visit(ctx.valueIfError[0]);
            }
            return value;
        } catch (e) {
            // If any exception occurs during evaluation, return the valueIfError
            return this.visit(ctx.valueIfError[0]);
        }
    }

    ifsFunctionCall(ctx: any) {
        const conditions = ctx.condition;
        const values = ctx.value;

        for (let i = 0; i < conditions.length; i++) {
            const condition = this.visit(conditions[i]);
            if (this.isTruthy(condition)) {
                return this.visit(values[i]);
            }
        }

        // If no conditions are true, return #N/A
        return "#N/A";
    }

    switchFunctionCall(ctx: any) {
        const expression = this.visit(ctx.expression[0]);
        const values = ctx.value;
        const results = ctx.result;

        for (let i = 0; i < values.length; i++) {
            const value = this.visit(values[i]);
            if (expression === value) {
                return this.visit(results[i]);
            }
        }

        // If no match and default is provided, return default
        if (ctx.default && ctx.default.length > 0) {
            return this.visit(ctx.default[0]);
        }

        // If no match and no default, return #N/A
        return "#N/A";
    }

    arrayExpression(ctx: any) {
        // Process array expressions as 2D arrays
        const rows = [];
        rows.push(this.visit(ctx.arrayRow[0]));

        if (ctx.arrayRow.length > 1) {
            for (let i = 1; i < ctx.arrayRow.length; i++) {
                rows.push(this.visit(ctx.arrayRow[i]));
            }
        }

        return rows;
    }

    arrayRow(ctx: any) {
        // Process array rows as arrays
        const row = [];
        row.push(this.visit(ctx.expression[0]));

        if (ctx.expression.length > 1) {
            for (let i = 1; i < ctx.expression.length; i++) {
                row.push(this.visit(ctx.expression[i]));
            }
        }

        return row;
    }

    // Helper methods
    private resolveVariable(name: string, sheetName: string = ''): any {
        // First check if it's a named range (priority over sheet variables)
        if (this.context && typeof this.context.getNamedRange === 'function') {
            // Check if the workbook has this named range
            if (this.context.workbook?.nameManager.has(name)) {
                return this.context.getNamedRange(name);
            }
        }

        // Fall back to sheet variables
        if (this.context && typeof this.context.getVariable === 'function') {
            return this.context.getVariable(name, sheetName);
        }
        return "#NAME?"; // Excel's error for undefined names
    }

    private resolveCellReference(ref: string, sheetName: string = ''): any {
        if (this.context && typeof this.context.getCellValue === 'function') {
            return this.context.getCellValue(ref, sheetName);
        }
        return "#REF!"; // Excel's error for invalid cell references
    }

    private resolveCellRange(range: string, sheetName: string = ''): any {
        if (this.context && typeof this.context.getCellRange === 'function') {
            return this.context.getCellRange(range, sheetName);
        }
        return "#REF!";
    }

    private resolveRowRange(range: string, sheetName: string = ''): any {
        if (this.context && typeof this.context.getRowRange === 'function') {
            return this.context.getRowRange(range, sheetName);
        }
        return "#REF!";
    }

    private resolveColumnRange(range: string, sheetName: string = ''): any {
        if (this.context && typeof this.context.getColumnRange === 'function') {
            return this.context.getColumnRange(range, sheetName);
        }
        return "#REF!";
    }

    private isTruthy(value: any): boolean {
        if (typeof value === 'boolean') {
            return value;
        } else if (typeof value === 'number') {
            return value !== 0;
        } else if (typeof value === 'string') {
            // Excel treats non-empty strings as true except "FALSE"
            return value !== '' && value.toUpperCase() !== 'FALSE';
        } else {
            return value != null;
        }
    }

    private isErrorValue(value: any): boolean {
        if (typeof value !== 'string') return false;

        const errorValues = [
            "#DIV/0!", "#N/A", "#NAME?", "#NULL!",
            "#NUM!", "#REF!", "#VALUE!", "#ERROR!"
        ];

        return errorValues.includes(value);
    }

    private executeBuiltInFunction(name: string, args: any[]): any {
        // Implement common Excel functions
        let count = 0;

        switch (name) {
            case "SUM":
                return args.reduce((sum, val) => {
                    if (Array.isArray(val)) {
                        // Handle arrays/ranges
                        return sum + this.flattenAndSum(val);
                    } else if (!isNaN(val)) {
                        return sum + Number(val);
                    }
                    return sum;
                }, 0);

            case "AVERAGE":
                let sum = 0;

                args.forEach(val => {
                    if (Array.isArray(val)) {
                        // Handle arrays/ranges
                        const flattenedArray = this.flattenArray(val);
                        sum += flattenedArray.reduce((s, v) => s + (isNaN(v) ? 0 : Number(v)), 0);
                        count += flattenedArray.filter(v => !isNaN(v)).length;
                    } else if (!isNaN(val)) {
                        sum += Number(val);
                        count++;
                    }
                });

                return count > 0 ? sum / count : "#DIV/0!";

            case "MAX":
                let max = -Infinity;

                args.forEach(val => {
                    if (Array.isArray(val)) {
                        // Handle arrays/ranges
                        const flattenedArray = this.flattenArray(val);
                        const arrayMax = Math.max(...flattenedArray.filter(v => !isNaN(v)).map(Number));
                        if (arrayMax > max) max = arrayMax;
                    } else if (!isNaN(val) && Number(val) > max) {
                        max = Number(val);
                    }
                });

                return max === -Infinity ? 0 : max;

            case "MIN":
                let min = Infinity;

                args.forEach(val => {
                    if (Array.isArray(val)) {
                        // Handle arrays/ranges
                        const flattenedArray = this.flattenArray(val);
                        const arrayMin = Math.min(...flattenedArray.filter(v => !isNaN(v)).map(Number));
                        if (arrayMin < min) min = arrayMin;
                    } else if (!isNaN(val) && Number(val) < min) {
                        min = Number(val);
                    }
                });

                return min === Infinity ? 0 : min;

            case "COUNT":

                args.forEach(val => {
                    if (Array.isArray(val)) {
                        // Handle arrays/ranges
                        const flattenedArray = this.flattenArray(val);
                        count += flattenedArray.filter(v => !isNaN(v)).length;
                    } else if (!isNaN(val)) {
                        count++;
                    }
                });

                return count;

            case "CONCATENATE":
                return args.reduce((result, val) => result + String(val), "");

            case "AND":
                return args.every(val => this.isTruthy(val));

            case "OR":
                return args.some(val => this.isTruthy(val));

            default:
                return "#NAME?"; // Unknown function
        }
    }

    private flattenAndSum(arr: any[]): number {
        if (!Array.isArray(arr)) return isNaN(arr) ? 0 : Number(arr);

        return arr.reduce((sum, val) => {
            if (Array.isArray(val)) {
                return sum + this.flattenAndSum(val);
            }
            return sum + (isNaN(val) ? 0 : Number(val));
        }, 0);
    }

    private flattenArray(arr: any[]): any[] {
        return arr.reduce((flat, val) => {
            if (Array.isArray(val)) {
                return flat.concat(this.flattenArray(val));
            } else {
                return flat.concat(val);
            }
        }, []);
    }

    parseInput(inputText: string) {
        // Strip leading '=' if present
        const cleanInput = inputText.startsWith('=') ? inputText.substring(1) : inputText;

        const lexResult = CalxLexer.tokenize(cleanInput);
        parserInstance.input = lexResult.tokens;

        const cst = parserInstance.expression();

        if (parserInstance.errors.length > 0) {
            console.error('Parser errors:', JSON.stringify(parserInstance.errors, null, 2));
            throw Error('Parsing errors detected');
        }

        return this.visit(cst);
    }

    parseCst(cst: CstNode) {
        return this.visit(cst);
    }

    parse(inputText: string) {
        try {
            const result = this.parseInput(inputText);
            return result;
        } catch (error) {
            console.error("Parsing error for input:", inputText);
            console.error("Error details:", error);
            if (error instanceof Error) {
                console.error("Stack trace:", error.stack);
            }
            return ErrorType.ERROR; // Return a generic error type
        }
    }
}
