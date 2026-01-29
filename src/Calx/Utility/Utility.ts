import { Cell } from "../Cell";

/**
 * translate numeric to alphabet, like 1 => A, 27 => AA
 * @param  {integer} num    numeric value translated to alphabet
 * @return {string}         alphabet representation of the value
 */
export function numToStr(num: number): string {
    var s = "";
    num = Math.round(num - 1);
    while (num >= 0) {
        s = String.fromCharCode(num % 26 + 97) + s;
        num = Math.floor(num / 26) - 1;
    }
    return s.toUpperCase();
}

/**
 * translate alphabet to numeric, A => 1, B => 2, Z => 26, AA => 27 etc
 * @param  {string} char    Alphabet [A-Z]
 * @return {integer}        Integer representation of the alphabet
 */
export function strToNum(char: string): number {
    const chars = char.toUpperCase().split('');
    const base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    let i, j, result = 0;

    for (i = 0, j = chars.length - 1; i < chars.length; i += 1, j -= 1) {
        result += Math.pow(base.length, j) * (base.indexOf(chars[i]) + 1);
    }

    return result;
}

/**
 * translate cellStart:cellStop to array containing all cell in range
 * e.g A1:B3 => [A1, A2, A3, B1, B2, B3]
 * @return {array} array containing all address in range
 */
export function getCellsInRange(range : string) {
    range = range.toUpperCase();
    const regex = {
            alpha   : /[A-Z]+/,
            num     : /[0-9]+/,
            cellRange   : /^[A-Za-z]+[0-9]+\s*:\s*[A-Za-z]+[0-9]+$/,
        };

    if (!range.match(regex.cellRange)) {
        throw new Error("Invalid range syntax!");
    }

    const rangeStart = range.split(':')[0],
        rangeEnd = range.split(':')[1],
        boundaries = {
            start : {
                col : strToNum(rangeStart.match(regex.alpha)[0]), //alpha part
                row : parseInt(rangeStart.match(regex.num)[0]), //numeric part
            },
            end : {
                col : strToNum(rangeEnd.match(regex.alpha)[0]), //alpha part
                row : parseInt(rangeEnd.match(regex.num)[0]), //numeric part
            }
        },
        cellRange = [];

    for (
        let col = Math.min(boundaries.start.col, boundaries.end.col) ;
        col <= Math.max(boundaries.start.col, boundaries.end.col);
        col++
    ) {
        for (
            let row = Math.min(boundaries.start.row, boundaries.end.row);
            row <= Math.max(boundaries.start.row, boundaries.end.row);
            row++
        ) {
            cellRange.push(numToStr(col) + row + '');
        }
    }

    return cellRange;
}

/**
 * taken from Formula.VALIDBIN of stoic's formula.js (http://www.stoic.com/pages/formula)
 * check if number is in valid binary format
 * @param  {string}  number [the binary number]
 * @return {Boolean}        [true if valid, false if invalid]
 */
export function isValidBinary(number: string) {
    return (/^[01]{1,10}$/).test(number);
}

/**
 * String repeater, taken from underscore string (https://github.com/epeli/underscore.string)
 * @param  {[type]} str [description]
 * @param  {[type]} qty [description]
 * @return {[type]}     [description]
 */
export function strRepeat(str: string, qty: number) {
    if (qty < 1) return '';
    var result = '';
    while (qty > 0) {
        if (qty & 1) result += str;
        qty >>= 1, str += str;
    }
    return result;
}

export function repeat(str: string, qty: number, separator: string) {
    if (str == null) {
        return '';
    }

    qty = ~~qty;

    // using faster implementation if separator is not needed;
    if (separator == null) {
        return strRepeat(String(str), qty);
    }

    // this one is about 300x slower in Google Chrome
    for (var repeat = []; qty > 0; repeat[--qty] = str) { }
    return repeat.join(separator);
}

export function unique(array: Array<any>) {
    return array.reduce(function (p, c) {
        if (p.indexOf(c) < 0) p.push(c);
        return p;
    }, []);
}

export function initial(array: Array<any>, n : any, guard : any) {
    return Array.prototype.slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
}

export function rest(array : Array<any>, n : any, guard : any) {
    return Array.prototype.slice.call(array, n == null || guard ? 1 : n);
}

/** end of underscore func */

export function arrayMerge(args : any) {
    let result : Array<any> = [];

    for (let i = 0; i < args.length; i++) {
        if (typeof (args[i]) == 'object') {
            for (let a in args[i]) {
                if (args[i][a].trim() !== '') {
                    result = result.concat(args[i][a]);
                }
            }
        } else {
            if (result.concat(args[i]).join().trim() !== '') {
                result = result.concat(args[i]);
            }
        }
    }

    return result;
}

export function toArray(args : any) {
    return Array.prototype.slice.call(args, 0);
}

/**
 * Converting object into plain array
 * @param  {object} obj Object need to be converted
 * @return {array}      Plain array
 */
export function objectToArray(obj: any) {
    return Object.values(obj);
}

/**
 * remove empty cell from cell range collection
 * @param  {object} cellRange
 * @return {object} trimmed cellRange
 */
export function trimEmptyCell(cellRange : Record<string, any>) {
    var result : Record<string, any> = {};

    for (var a in cellRange) {
        if (cellRange[a].trim() !== '') {
            result[a] = cellRange[a];
        }
    }

    return result;
}

/**
 * convert range {A1: val1, A2: val2, B1: val3, B2: val4} into 2 dimensional table array
 * [
 *     [val1, val2],
 *     [val3, val4]
 * ]
 *
 * @param  {object} cellRange [description]
 * @return {array}            [description]
 */
export function rangeToTable(cellRange: Array<Array<any>>): Array<Array<any>> {
    var cell, col,
        row = 0,
        alphaPattern = /[A-Z]+/,
        numPattern = /[0-9]+/,
        arrayTable = [],
        resultTable = [];

    for (cell in cellRange) {

        col = strToNum(cell.match(alphaPattern)[0]) - 1;
        row = parseInt(cell.match(numPattern)[0], 10) - 1;

        if (typeof arrayTable[row] == 'undefined') {
            arrayTable[row] = [];
        }

        arrayTable[row][col] = cellRange[cell];
    }

    var resultRow = 0, rowLength = arrayTable.length, colLength;
    for (row = 0; row < rowLength; row++) {
        if (typeof (arrayTable[row]) != 'undefined') {
            colLength = arrayTable[row].length;

            if (typeof (resultTable[resultRow]) == 'undefined') {
                resultTable[resultRow] = [];
            }

            for (col = 0; col < colLength; col++) {
                if (typeof (arrayTable[row][col]) != 'undefined') {
                    resultTable[resultRow].push(arrayTable[row][col]);
                }
            }

            resultRow++;
        }
    }

    return resultTable;
};

/**
 * transpose horizontal table to be vertical table, or vice-versa
 * e.g
 *  [
 *      [1,2,3,4],
 *      [1,2,3,4],
 *  ]
 *
 * to be
 *  [
 *      [1,1],
 *      [2,2],
 *      [3,3],
 *      [4,4],
 *  ]
 */
export function transposeTable(table: Array<Array<any>>): Array<Array<any>> {
    var row, col, rowLength, colLength, newTable;

    rowLength = table.length;
    newTable = [];

    for (row = 0; row < rowLength; row++) {
        colLength = table[row].length;

        for (col = 0; col < colLength; col++) {
            if (typeof (newTable[col]) == 'undefined') {
                newTable[col] = [];
            }

            newTable[col].push(table[row][col]);
        }
    }

    return newTable;
}

/**
 * Translate all cell references in a formula by applying row and column offsets.
 * Respects absolute references ($ markers) and translates both individual cells and ranges.
 *
 * @param formula The formula to translate (must start with =)
 * @param cellRowOffset The row offset to apply to relative row references
 * @param cellColOffset The column offset to apply to relative column references
 * @returns The translated formula
 *
 * @example
 * translateFormula('=A1', 1, 1) // Returns '=B2'
 * translateFormula('=SUM(A1:B2)', 1, 1) // Returns '=SUM(B2:C3)'
 * translateFormula('=$A$1', 1, 1) // Returns '=$A$1' (absolute reference unchanged)
 * translateFormula('=A$1', 1, 1) // Returns '=B$1' (absolute row unchanged)
 */
export function translateFormula(formula: string, cellRowOffset: number, cellColOffset: number): string {
    if (!formula.startsWith('=')) return formula;

    // Remove leading =
    let translated = formula.substring(1);

    // First, match and translate cell ranges (A1:B2)
    // We do this first to avoid double-processing individual cells in ranges
    translated = translated.replace(
        /(\$?)([A-Z]+)(\$?)(\d+):(\$?)([A-Z]+)(\$?)(\d+)/gi,
        (match, col1Abs, col1, row1Abs, row1, col2Abs, col2, row2Abs, row2) => {
            // Translate start of range
            const col1Num = strToNum(col1.toUpperCase());
            const row1Num = parseInt(row1);
            const newCol1Num = col1Abs === '$' ? col1Num : col1Num + cellColOffset;
            const newRow1Num = row1Abs === '$' ? row1Num : row1Num + cellRowOffset;
            const newStart = `${col1Abs}${numToStr(newCol1Num)}${row1Abs}${newRow1Num}`;

            // Translate end of range
            const col2Num = strToNum(col2.toUpperCase());
            const row2Num = parseInt(row2);
            const newCol2Num = col2Abs === '$' ? col2Num : col2Num + cellColOffset;
            const newRow2Num = row2Abs === '$' ? row2Num : row2Num + cellRowOffset;
            const newEnd = `${col2Abs}${numToStr(newCol2Num)}${row2Abs}${newRow2Num}`;

            return `${newStart}:${newEnd}`;
        }
    );

    // Then match individual cell references (A1, $A$1, A$1, $A1)
    // Use (?<![A-Z0-9]) to ensure we don't match in the middle of a word or after a colon
    translated = translated.replace(
        /(?<![A-Z0-9:])(\$?)([A-Z]+)(\$?)(\d+)(?![:A-Z0-9])/gi,
        (match, colAbs, col, rowAbs, row) => {
            const colNum = strToNum(col.toUpperCase());
            const rowNum = parseInt(row);

            const newColNum = colAbs === '$' ? colNum : colNum + cellColOffset;
            const newRowNum = rowAbs === '$' ? rowNum : rowNum + cellRowOffset;

            return `${colAbs}${numToStr(newColNum)}${rowAbs}${newRowNum}`;
        }
    );

    return '=' + translated;
}

/**
 * Update references to a moved range in a formula
 * When a range is moved from oldRange to newRange, all formulas that reference
 * cells in oldRange need to be updated to reference newRange instead
 *
 * @param formula The formula to update
 * @param oldStartCol The starting column of the old range (e.g., 'A')
 * @param oldStartRow The starting row of the old range (e.g., 1)
 * @param oldEndCol The ending column of the old range (e.g., 'B')
 * @param oldEndRow The ending row of the old range (e.g., 2)
 * @param newStartCol The starting column of the new range
 * @param newStartRow The starting row of the new range
 * @param newEndCol The ending column of the new range
 * @param newEndRow The ending row of the new range
 * @returns The updated formula
 *
 * @example
 * updateMovedReferences('=SUM(A1:B2)', 'A', 1, 'B', 2, 'C', 3, 'D', 4)
 * // Returns '=SUM(C3:D4)'
 *
 * updateMovedReferences('=A1+B1', 'A', 1, 'B', 2, 'C', 3, 'D', 4)
 * // Returns '=C3+D3'
 */
export function updateMovedReferences(
    formula: string,
    oldStartCol: string,
    oldStartRow: number,
    oldEndCol: string,
    oldEndRow: number,
    newStartCol: string,
    newStartRow: number,
    newEndCol: string,
    newEndRow: number
): string {
    if (!formula.startsWith('=')) return formula;

    const oldStartColNum = strToNum(oldStartCol);
    const oldEndColNum = strToNum(oldEndCol);
    const newStartColNum = strToNum(newStartCol);
    const newEndColNum = strToNum(newEndCol);

    // Normalize ranges (ensure start <= end)
    const oldMinRow = Math.min(oldStartRow, oldEndRow);
    const oldMaxRow = Math.max(oldStartRow, oldEndRow);
    const oldMinCol = Math.min(oldStartColNum, oldEndColNum);
    const oldMaxCol = Math.max(oldStartColNum, oldEndColNum);

    const newMinRow = Math.min(newStartRow, newEndRow);
    const newMaxRow = Math.max(newStartRow, newEndRow);
    const newMinCol = Math.min(newStartColNum, newEndColNum);
    const newMaxCol = Math.max(newStartColNum, newEndColNum);

    let translated = formula.substring(1);

    // Update range references (A1:B2)
    translated = translated.replace(
        /(?<![A-Z0-9:])(\$?)([A-Z]+)(\$?)(\d+):(\$?)([A-Z]+)(\$?)(\d+)(?![:A-Z0-9])/gi,
        (match, col1Abs, col1, row1Abs, row1, col2Abs, col2, row2Abs, row2) => {
            const col1Num = strToNum(col1.toUpperCase());
            const row1Num = parseInt(row1);
            const col2Num = strToNum(col2.toUpperCase());
            const row2Num = parseInt(row2);

            // Check if this range overlaps with the moved range
            const rangeMinCol = Math.min(col1Num, col2Num);
            const rangeMaxCol = Math.max(col1Num, col2Num);
            const rangeMinRow = Math.min(row1Num, row2Num);
            const rangeMaxRow = Math.max(row1Num, row2Num);

            // If the range matches the old range exactly, update it
            if (rangeMinCol === oldMinCol && rangeMaxCol === oldMaxCol &&
                rangeMinRow === oldMinRow && rangeMaxRow === oldMaxRow) {
                const newCol1 = numToStr(newMinCol);
                const newCol2 = numToStr(newMaxCol);
                return `${col1Abs}${newCol1}${row1Abs}${newMinRow}:${col2Abs}${newCol2}${row2Abs}${newMaxRow}`;
            }

            return match;
        }
    );

    // Update individual cell references
    translated = translated.replace(
        /(?<![A-Z0-9:])(\$?)([A-Z]+)(\$?)(\d+)(?![:A-Z0-9])/gi,
        (match, colAbs, col, rowAbs, row) => {
            const colNum = strToNum(col.toUpperCase());
            const rowNum = parseInt(row);

            // Check if this cell is in the moved range
            if (colNum >= oldMinCol && colNum <= oldMaxCol &&
                rowNum >= oldMinRow && rowNum <= oldMaxRow) {
                // Calculate relative position within old range
                const relCol = colNum - oldMinCol;
                const relRow = rowNum - oldMinRow;

                // Apply to new range
                const newColNum = newMinCol + relCol;
                const newRowNum = newMinRow + relRow;

                return `${colAbs}${numToStr(newColNum)}${rowAbs}${newRowNum}`;
            }

            return match;
        }
    );

    return '=' + translated;
}
