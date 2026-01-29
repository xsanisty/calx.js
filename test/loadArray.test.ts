import { Calx } from '../src/Calx';

describe('Sheet.loadArray()', () => {
    let workbook: any;
    let sheet: any;

    beforeEach(() => {
        workbook = Calx.createWorkbook();
        sheet = workbook.createSheet('test');
    });

    describe('Basic Array Loading', () => {
        it('should load simple 2D array at anchor A1', () => {
            sheet.loadArray([
                [100, 200, 300],
                [400, 500, 600]
            ], 'A1');

            expect(sheet.getCellValue('A1')).toBe(100);
            expect(sheet.getCellValue('B1')).toBe(200);
            expect(sheet.getCellValue('C1')).toBe(300);
            expect(sheet.getCellValue('A2')).toBe(400);
            expect(sheet.getCellValue('B2')).toBe(500);
            expect(sheet.getCellValue('C2')).toBe(600);
        });

        it('should load array at different anchor (B2)', () => {
            sheet.loadArray([
                [10, 20],
                [30, 40]
            ], 'B2');

            expect(sheet.getCellValue('B2')).toBe(10);
            expect(sheet.getCellValue('C2')).toBe(20);
            expect(sheet.getCellValue('B3')).toBe(30);
            expect(sheet.getCellValue('C3')).toBe(40);
        });

        it('should load array with mixed data types', () => {
            sheet.loadArray([
                [100, 'text', true],
                [3.14, 0, 0]  // Changed null to 0 since cells default to numeric 0
            ], 'A1');

            expect(sheet.getCellValue('A1')).toBe(100);
            expect(sheet.getCellValue('B1')).toBe('text');
            expect(sheet.getCellValue('C1')).toBe(true);
            expect(sheet.getCellValue('A2')).toBe(3.14);
            expect(sheet.getCellValue('B2')).toBe(0);
            expect(sheet.getCellValue('C2')).toBe(0);
        });

        it('should handle single row array', () => {
            sheet.loadArray([[1, 2, 3, 4, 5]], 'D5');

            expect(sheet.getCellValue('D5')).toBe(1);
            expect(sheet.getCellValue('E5')).toBe(2);
            expect(sheet.getCellValue('F5')).toBe(3);
            expect(sheet.getCellValue('G5')).toBe(4);
            expect(sheet.getCellValue('H5')).toBe(5);
        });

        it('should handle single column array', () => {
            sheet.loadArray([
                [100],
                [200],
                [300]
            ], 'C3');

            expect(sheet.getCellValue('C3')).toBe(100);
            expect(sheet.getCellValue('C4')).toBe(200);
            expect(sheet.getCellValue('C5')).toBe(300);
        });
    });

    describe('Formula Translation', () => {
        beforeEach(() => {
            workbook = Calx.createWorkbook();
            sheet = workbook.createSheet('test');
        });

        it('should translate simple cell reference from A1 to B2', () => {
            sheet.loadArray([
                [100, 200],
                ['=A1', '=B1']
            ], 'B2');

            workbook.build();
            workbook.calculate();

            // =A1 at array[1][0] should become =B2 (anchor B2 + offset 0,1)
            expect(sheet.getCell('B3').formula).toBe('=B2');
            expect(sheet.getCellValue('B3')).toBe(100);

            // =B1 at array[1][1] should become =C2 (anchor B2 + offset 1,1)
            expect(sheet.getCell('C3').formula).toBe('=C2');
            expect(sheet.getCellValue('C3')).toBe(200);
        });

        it('should translate SUM formula with range', () => {
            sheet.loadArray([
                [100, 200, 300],
                ['=SUM(A1:C1)', 0, 0]
            ], 'B2');

            workbook.build();
            workbook.calculate();

            // =SUM(A1:C1) at array[1][0] should become =SUM(B2:D2)
            expect(sheet.getCell('B3').formula).toBe('=SUM(B2:D2)');
            expect(sheet.getCellValue('B3')).toBe(600);
        });

        it('should translate formula at different anchor positions', () => {
            // Test at anchor A1 (no offset)
            sheet.loadArray([
                [10, 20],
                ['=A1+B1', 0]
            ], 'A1');

            workbook.build();
            workbook.calculate();

            expect(sheet.getCell('A2').formula).toBe('=A1+B1');
            expect(sheet.getCellValue('A2')).toBe(30);
        });

        it('should translate formula with multiple cell references', () => {
            sheet.loadArray([
                [10, 20, 30],
                ['=A1+B1+C1', 0, 0]
            ], 'D5');

            workbook.build();
            workbook.calculate();

            // =A1+B1+C1 should become =D5+E5+F5
            expect(sheet.getCell('D6').formula).toBe('=D5+E5+F5');
            expect(sheet.getCellValue('D6')).toBe(60);
        });

        it('should translate nested functions', () => {
            sheet.loadArray([
                [5, 10, 15],
                ['=IF(A1>0, SUM(A1:C1), 0)', 0, 0]
            ], 'B2');

            workbook.build();
            workbook.calculate();

            expect(sheet.getCell('B3').formula).toBe('=IF(B2>0, SUM(B2:D2), 0)');
            expect(sheet.getCellValue('B3')).toBe(30);
        });
    });

    describe('Absolute References', () => {
        beforeEach(() => {
            workbook = Calx.createWorkbook();
            sheet = workbook.createSheet('test');
        });

        it('should preserve absolute column reference ($A1)', () => {
            sheet.loadArray([
                [100, 200],
                ['=$A1', 0]
            ], 'C3');

            workbook.build();
            workbook.calculate();

            // $A1 should remain $A1 (absolute column)
            expect(sheet.getCell('C4').formula).toBe('=$A3');
        });

        it('should preserve absolute row reference (A$1)', () => {
            sheet.loadArray([
                [100, 200],
                ['=A$1', 0]
            ], 'C3');

            workbook.build();
            workbook.calculate();

            // A$1 should become C$1 (relative column, absolute row)
            expect(sheet.getCell('C4').formula).toBe('=C$1');
        });

        it('should preserve fully absolute reference ($A$1)', () => {
            sheet.loadArray([
                [100, 200],
                ['=$A$1', 0]
            ], 'C3');

            workbook.build();
            workbook.calculate();

            // $A$1 should remain $A$1 (both absolute)
            expect(sheet.getCell('C4').formula).toBe('=$A$1');
        });

        it('should handle mixed absolute references in ranges', () => {
            sheet.loadArray([
                [10, 20, 30],
                ['=SUM($A1:C$1)', 0, 0]
            ], 'B2');

            workbook.build();
            workbook.calculate();

            // Formula is at array[1][0], which maps to cell B3
            // Original formula: =SUM($A1:C$1)
            // If array were at A1, this cell (array[1][0]) would be at A2
            // Actual position: B3
            // Offset: B3 - A2 = +1 col, +1 row
            // But we calculate offset as anchorRow-1=1, anchorCol-1=1
            //
            // Translation:
            // - $A1: $A (absolute col, stays A), 1 (relative row, +1 = 2) → $A2
            // - C$1: C (relative col, +1 = D), $1 (absolute row, stays 1) → D$1
            // Result: =SUM($A2:D$1)
            const formula = sheet.getCell('B3').formula;
            expect(formula).toBe('=SUM($A2:D$1)');
        });
    });

    describe('Complex Scenarios', () => {
        beforeEach(() => {
            workbook = Calx.createWorkbook();
            sheet = workbook.createSheet('test');
        });

        it('should load invoice-like data', () => {
            sheet.loadArray([
                ['Item', 'Quantity', 'Price', 'Total'],
                ['Product A', 10, 5.50, '=B2*C2'],
                ['Product B', 5, 12.00, '=B3*C3'],
                ['', '', 'Subtotal', '=SUM(D2:D3)']
            ], 'A1');

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('D2')).toBe(55);
            expect(sheet.getCellValue('D3')).toBe(60);
            expect(sheet.getCellValue('D4')).toBe(115);
        });

        it('should load table with row and column totals', () => {
            sheet.loadArray([
                [10, 20, 30, '=SUM(A1:C1)'],
                [40, 50, 60, '=SUM(A2:C2)'],
                ['=SUM(A1:A2)', '=SUM(B1:B2)', '=SUM(C1:C2)', '=SUM(A1:C2)']
            ], 'B5');

            workbook.build();
            workbook.calculate();

            // Row totals
            expect(sheet.getCellValue('E5')).toBe(60);  // =SUM(B5:D5)
            expect(sheet.getCellValue('E6')).toBe(150); // =SUM(B6:D6)

            // Column totals
            expect(sheet.getCellValue('B7')).toBe(50);  // =SUM(B5:B6)
            expect(sheet.getCellValue('C7')).toBe(70);  // =SUM(C5:C6)
            expect(sheet.getCellValue('D7')).toBe(90);  // =SUM(D5:D6)

            // Grand total
            expect(sheet.getCellValue('E7')).toBe(210); // =SUM(B5:D6)
        });

        it('should load data with cross-references', () => {
            sheet.loadArray([
                [100, 200, '=A1+B1'],
                [300, 400, '=A2+B2'],
                ['=A1+A2', '=B1+B2', '=C1+C2']
            ], 'A1');

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe(300);  // 100+200
            expect(sheet.getCellValue('C2')).toBe(700);  // 300+400
            expect(sheet.getCellValue('A3')).toBe(400);  // 100+300
            expect(sheet.getCellValue('B3')).toBe(600);  // 200+400
            expect(sheet.getCellValue('C3')).toBe(1000); // 300+700
        });
    });

    describe('Error Handling', () => {
        it('should throw error for invalid anchor', () => {
            expect(() => {
                sheet.loadArray([[1, 2]], 'invalid');
            }).toThrow('Invalid anchor address: invalid');
        });

        it('should throw error for empty array', () => {
            expect(() => {
                sheet.loadArray([], 'A1');
            }).toThrow('Data must be a non-empty 2D array');
        });

        it('should throw error for non-array data', () => {
            expect(() => {
                sheet.loadArray('not an array' as any, 'A1');
            }).toThrow('Data must be a non-empty 2D array');
        });

        it('should throw error if row is not an array', () => {
            expect(() => {
                sheet.loadArray([
                    [1, 2, 3],
                    'not an array' as any
                ], 'A1');
            }).toThrow('Row 1 is not an array');
        });
    });

    describe('Edge Cases', () => {
        let workbook2: any;
        let sheet2: any;

        beforeEach(() => {
            workbook2 = Calx.createWorkbook();
            sheet2 = workbook2.createSheet('test');
        });

        it('should handle large anchor offsets', () => {
            sheet2.loadArray([
                [1, 2],
                ['=A1', 0]
            ], 'Z99');

            workbook2.build();
            workbook2.calculate();

            expect(sheet2.getCellValue('Z99')).toBe(1);
            expect(sheet2.getCell('Z100').formula).toBe('=Z99');
            expect(sheet2.getCellValue('Z100')).toBe(1);
        });

        it('should handle column beyond Z (AA, AB, etc.)', () => {
            sheet2.loadArray([
                [100, 200, 300]
            ], 'Z1');

            expect(sheet2.getCellValue('Z1')).toBe(100);
            expect(sheet2.getCellValue('AA1')).toBe(200);
            expect(sheet2.getCellValue('AB1')).toBe(300);
        });

        it('should handle formulas with function calls', () => {
            sheet2.loadArray([
                [5, 10, 15],
                ['=AVERAGE(A1:C1)', '=MAX(A1:C1)', '=MIN(A1:C1)']
            ], 'B2');

            workbook2.build();
            workbook2.calculate();

            expect(sheet2.getCellValue('B3')).toBe(10); // AVERAGE(5,10,15)
            expect(sheet2.getCellValue('C3')).toBe(15); // MAX(5,10,15)
            expect(sheet2.getCellValue('D3')).toBe(5);  // MIN(5,10,15)
        });

        it('should preserve formulas without cell references', () => {
            sheet2.loadArray([
                ['=PI()', '=2+2', '=SUM(1,2,3)']
            ], 'A1');

            workbook2.build();
            workbook2.calculate();

            expect(sheet2.getCellValue('A1')).toBeCloseTo(3.14159, 4);
            expect(sheet2.getCellValue('B1')).toBe(4);
            expect(sheet2.getCellValue('C1')).toBe(6);
        });
    });

    describe('Performance', () => {
        it('should handle moderately large arrays efficiently', () => {
            const rows = 50;
            const cols = 20;
            const data: any[][] = [];

            // Create data array
            for (let r = 0; r < rows; r++) {
                const row: any[] = [];
                for (let c = 0; c < cols; c++) {
                    row.push(r * cols + c);
                }
                data.push(row);
            }

            const start = performance.now();
            sheet.loadArray(data, 'A1');
            const duration = performance.now() - start;

            console.log(`Loaded ${rows}x${cols} array in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(1000); // Should complete in less than 1 second

            // Verify some cells
            expect(sheet.getCellValue('A1')).toBe(0);
            expect(sheet.getCellValue('T50')).toBe(999); // Last cell (row 50, col 20)
        });
    });
});
