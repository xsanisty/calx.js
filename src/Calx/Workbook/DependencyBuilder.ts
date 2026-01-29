import { Cell } from "../Cell";
import { CellRegistry } from "../Sheet/CellRegistry";
import { EventDispatcher } from "../Utility/EventDispatcher";
import { DependencyTree } from "./DependencyTree";
import { Workbook } from "../Workbook";

export class DependencyBuilder {
    private patterns : Record<string, RegExp> = {
        remoteColumnRange   : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+\s*:\s*[A-Za-z]+/g,
        remoteRowRange      : /\#[A-Za-z0-9_]+\s*!\s*[0-9]+\s*:\s*[0-9]+/g,
        remoteCellRange     : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+[0-9]+\s*:\s*[A-Za-z]+[0-9]+/g,
        remoteCell          : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+[0-9]+/g,
        columnRange         : /[A-Za-z]+\s*:\s*[A-Za-z]+/g,
        rowRange            : /[0-9]+\s*:\s*[0-9]+/g,
        cellRange           : /[A-Za-z]+[0-9]+\s*:\s*[A-Za-z]+[0-9]+/g,
        cell                : /[A-Z]+[0-9]+/g,
        namedRange          : /[A-Za-z_][A-Za-z0-9_\.]*/g
    };

    private workbook?: Workbook;

    constructor() {

    }

    setWorkbook(workbook: Workbook) {
        this.workbook = workbook;
    }

    build(cells : CellRegistry) : DependencyTree {
        // Build dependencies for each cell
        cells.each((cell : Cell) => {
            if (cell.formula) {
                const dependencyAddresses = this.getFormulaDependencies(cell.formula);

                // Resolve addresses to actual Cell objects
                const dependencies: Record<string, Cell> = {};
                for (const address in dependencyAddresses) {
                    const precedentCell = cells.get(address);
                    if (precedentCell) {
                        dependencies[address] = precedentCell;
                    }
                }

                // Set precedents for this cell
                cell.setPrecedents(dependencies);

                // Set this cell as dependent for each precedent
                for (const address in dependencies) {
                    const precedentCell = dependencies[address];
                    if (precedentCell) {
                        precedentCell.addDependent(cell);
                    }
                }
            }
        });

        return new DependencyTree(cells, new EventDispatcher, this);
    }

    private getFormulaDependencies(formula : string) : Record<string, boolean> {
        const dependencies: Record<string, boolean> = {};

        // Remove leading '=' if present
        let cleanFormula = formula.startsWith('=') ? formula.substring(1) : formula;

        // Process patterns in order, replacing matched portions to prevent overlapping matches
        // Order matters: match more specific patterns first (e.g., ranges before individual cells)

        // 1. Remote column ranges: #Sheet1!A:C
        const remoteColumnMatches = cleanFormula.match(this.patterns.remoteColumnRange);
        if (remoteColumnMatches) {
            remoteColumnMatches.forEach(match => {
                // Extract sheet name and column range
                const [sheetPart, rangePart] = match.split('!');
                // Mark as dependency (will need special handling for remote refs)
                dependencies[match.trim()] = true;
            });
            cleanFormula = cleanFormula.replace(this.patterns.remoteColumnRange, '');
        }

        // 2. Remote row ranges: #Sheet1!1:3
        const remoteRowMatches = cleanFormula.match(this.patterns.remoteRowRange);
        if (remoteRowMatches) {
            remoteRowMatches.forEach(match => {
                dependencies[match.trim()] = true;
            });
            cleanFormula = cleanFormula.replace(this.patterns.remoteRowRange, '');
        }

        // 3. Remote cell ranges: #Sheet1!A1:B3
        const remoteCellRangeMatches = cleanFormula.match(this.patterns.remoteCellRange);
        if (remoteCellRangeMatches) {
            remoteCellRangeMatches.forEach(match => {
                const [sheetPart, rangePart] = match.split('!');
                // Expand range into individual cells
                const addresses = this.expandCellRange(rangePart.trim());
                addresses.forEach(addr => {
                    dependencies[addr] = true;
                });
            });
            cleanFormula = cleanFormula.replace(this.patterns.remoteCellRange, '');
        }

        // 4. Remote cells: #Sheet1!A1
        const remoteCellMatches = cleanFormula.match(this.patterns.remoteCell);
        if (remoteCellMatches) {
            remoteCellMatches.forEach(match => {
                const [sheetPart, cellPart] = match.split('!');
                dependencies[cellPart.trim()] = true;
            });
            cleanFormula = cleanFormula.replace(this.patterns.remoteCell, '');
        }

        // 5. Cell ranges: A1:B3
        const cellRangeMatches = cleanFormula.match(this.patterns.cellRange);
        if (cellRangeMatches) {
            cellRangeMatches.forEach(match => {
                // Expand range into individual cells
                const addresses = this.expandCellRange(match);
                addresses.forEach(addr => {
                    dependencies[addr] = true;
                });
            });
            cleanFormula = cleanFormula.replace(this.patterns.cellRange, '');
        }

        // 6. Individual cells: A1, B2, etc.
        const cellMatches = cleanFormula.match(this.patterns.cell);
        if (cellMatches) {
            cellMatches.forEach(match => {
                // Filter out function names and keywords
                if (!this.isFunctionOrKeyword(match)) {
                    dependencies[match] = true;
                }
            });
        }

        // 7. Named ranges: Resolve named ranges to their underlying cell references
        // After removing all other patterns, check remaining identifiers against named ranges
        if (this.workbook) {
            // Extract potential named range identifiers (words that aren't functions)
            const identifierMatches = cleanFormula.match(/[A-Za-z_][A-Za-z0-9_\.]*/g);
            if (identifierMatches) {
                identifierMatches.forEach(identifier => {
                    // Skip if it's a function or keyword
                    if (this.isFunctionOrKeyword(identifier)) {
                        return;
                    }

                    // Check if it's a named range
                    if (this.workbook!.nameManager.has(identifier)) {
                        const reference = this.workbook!.nameManager.getReference(identifier);
                        if (reference) {
                            // Parse the reference to extract cell addresses
                            if (reference.includes(':')) {
                                // It's a range
                                const addresses = this.expandCellRange(reference);
                                addresses.forEach(addr => {
                                    dependencies[addr] = true;
                                });
                            } else if (/^[A-Z]+[0-9]+$/.test(reference)) {
                                // It's a single cell
                                dependencies[reference] = true;
                            }
                        }
                    }
                });
            }
        }

        // Note: Column ranges (A:A) and row ranges (1:1) are dynamic dependencies
        // and should be handled separately as they don't have fixed precedents

        return dependencies;
    }

    private isFunctionOrKeyword(text: string): boolean {
        const keywords = [
            'SUM', 'AVERAGE', 'MAX', 'MIN', 'COUNT', 'IF', 'AND', 'OR',
            'VLOOKUP', 'HLOOKUP', 'INDEX', 'MATCH', 'CONCATENATE',
            'TRUE', 'FALSE', 'NULL'
        ];
        return keywords.includes(text.toUpperCase());
    }

    /**
     * Extract cell addresses from a cell range (e.g., "A1:B3")
     * Handles reverse ranges like "B2:A1" by normalizing them
     */
    private expandCellRange(range: string): string[] {
        const [start, end] = range.split(':');
        const addresses: string[] = [];

        const startColMatch = start.match(/[A-Z]+/);
        const startRowMatch = start.match(/\d+/);
        const endColMatch = end.match(/[A-Z]+/);
        const endRowMatch = end.match(/\d+/);

        if (!startColMatch || !startRowMatch || !endColMatch || !endRowMatch) {
            return [];
        }

        const startCol = startColMatch[0];
        const startRow = parseInt(startRowMatch[0]);
        const endCol = endColMatch[0];
        const endRow = parseInt(endRowMatch[0]);

        const colToNum = (col: string) => {
            let num = 0;
            for (let i = 0; i < col.length; i++) {
                num = num * 26 + (col.charCodeAt(i) - 64);
            }
            return num;
        };

        const numToCol = (num: number) => {
            let col = '';
            while (num > 0) {
                const remainder = (num - 1) % 26;
                col = String.fromCharCode(65 + remainder) + col;
                num = Math.floor((num - 1) / 26);
            }
            return col;
        };

        const startColNum = colToNum(startCol);
        const endColNum = colToNum(endCol);

        // Normalize range to handle reverse ranges (B2:A1 -> A1:B2)
        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minCol = Math.min(startColNum, endColNum);
        const maxCol = Math.max(startColNum, endColNum);

        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                addresses.push(numToCol(col) + row);
            }
        }

        return addresses;
    }
}