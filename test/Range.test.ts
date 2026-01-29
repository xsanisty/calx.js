import { Range } from '../src/Calx/Range';
import { Calx } from '../src/Calx';
import { DataType } from '../src/Calx/Cell/DataType';

describe('Range', () => {
    let workbook: any;
    let sheet: any;

    beforeEach(() => {
        workbook = Calx.createWorkbook();
        sheet = workbook.createSheet('TestSheet');
    });

    describe('Single Cell Range', () => {
        test('should create range for single cell', () => {
            sheet.createCell('A1', { value: 100 });
            const range = sheet.getRange('A1');

            expect(range).toBeDefined();
            expect(range.isSingleCell()).toBe(true);
            expect(range.address).toBe('A1');
            expect(range.count).toBe(1);
        });

        test('should get value from single cell range', () => {
            sheet.createCell('A1', { value: 100 });
            const range = sheet.getRange('A1');

            expect(range.value).toBe(100);
        });

        test('should set value to single cell range', () => {
            sheet.createCell('A1', { value: 0 });
            const range = sheet.getRange('A1');

            range.value = 200;

            expect(range.value).toBe(200);
            expect(sheet.getCellDirect('A1').value).toBe(200);
        });

        test('should get/set formula for single cell range', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { formula: '=A1*2' });

            const range = sheet.getRange('A2');

            expect(range.formula).toBe('=A1*2');

            range.formula = '=A1*3';
            expect(range.formula).toBe('=A1*3');
        });

        test('should calculate single cell range', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { formula: '=A1*2' });

            const range = sheet.getRange('A2');
            workbook.build();
            range.calculate();

            expect(range.value).toBe(20);
        });
    });

    describe('Multi-Cell Range', () => {
        test('should create range for multiple cells', () => {
            const range = sheet.getRange('A1:B2');

            expect(range).toBeDefined();
            expect(range.isSingleCell()).toBe(false);
            expect(range.address).toBe('A1:B2');
            expect(range.count).toBe(4);
            expect(range.rows).toBe(2);
            expect(range.columns).toBe(2);
        });

        test('should get values as 2D array', () => {
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('B1', { value: 2 });
            sheet.createCell('A2', { value: 3 });
            sheet.createCell('B2', { value: 4 });

            const range = sheet.getRange('A1:B2');
            const values = range.getValues();

            expect(values).toEqual([
                [1, 2],
                [3, 4]
            ]);
        });

        test('should set values from 2D array', () => {
            sheet.createCell('A1', { value: 0 });
            sheet.createCell('B1', { value: 0 });
            sheet.createCell('A2', { value: 0 });
            sheet.createCell('B2', { value: 0 });

            const range = sheet.getRange('A1:B2');
            range.setValues([
                [10, 20],
                [30, 40]
            ]);

            expect(sheet.getCellDirect('A1').value).toBe(10);
            expect(sheet.getCellDirect('B1').value).toBe(20);
            expect(sheet.getCellDirect('A2').value).toBe(30);
            expect(sheet.getCellDirect('B2').value).toBe(40);
        });

        test('should set same value to all cells in range', () => {
            sheet.createCell('A1', { value: 0 });
            sheet.createCell('B1', { value: 0 });
            sheet.createCell('A2', { value: 0 });

            const range = sheet.getRange('A1:B2');
            range.value = 99;

            expect(sheet.getCellDirect('A1').value).toBe(99);
            expect(sheet.getCellDirect('B1').value).toBe(99);
            expect(sheet.getCellDirect('A2').value).toBe(99);
        });

        test('should get flat array of values', () => {
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('B1', { value: 2 });
            sheet.createCell('A2', { value: 3 });

            const range = sheet.getRange('A1:B2');
            const array = range.toArray();

            expect(array.length).toBe(4);
            expect(array[0]).toBe(1);
            expect(array[1]).toBe(2);
            expect(array[2]).toBe(3);
        });

        test('should iterate over cells with each()', () => {
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('B1', { value: 2 });

            const range = sheet.getRange('A1:B1');
            const values: any[] = [];

            range.each((cell: any) => {
                values.push(cell.value);
            });

            expect(values).toEqual([1, 2]);
        });

        test('should map over cells', () => {
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('B1', { value: 2 });

            const range = sheet.getRange('A1:B1');
            const doubled = range.map((cell: any) => cell.value * 2);

            expect(doubled).toEqual([2, 4]);
        });

        test('should filter cells', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { value: 20 });
            sheet.createCell('C1', { value: 30 });

            const range = sheet.getRange('A1:C1');
            const filtered = range.filter((cell: any) => cell.value > 15);

            expect(filtered.length).toBe(2);
        });

        test('should calculate all cells in range', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { formula: '=A1*2' });
            sheet.createCell('C1', { formula: '=B1+5' });

            const range = sheet.getRange('B1:C1');
            workbook.build();
            range.calculate();

            expect(sheet.getCellDirect('B1').value).toBe(20);
            expect(sheet.getCellDirect('C1').value).toBe(25);
        });
    });

    describe('Range Operations', () => {
        test('should clear all values in range', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { value: 20 });

            const range = sheet.getRange('A1:B1');
            range.clear();

            // Empty NUMBER cells return 0 (default type is NUMBER)
            expect(sheet.getCellDirect('A1').value).toBe(0);
            expect(sheet.getCellDirect('B1').value).toBe(0);
        });

        test('should get cell at specific position', () => {
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('B1', { value: 2 });
            sheet.createCell('A2', { value: 3 });

            const range = sheet.getRange('A1:B2');
            const cell = range.getCellAt(2);

            expect(cell?.value).toBe(3);
        });

        test('should get cell at row/col position', () => {
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('B1', { value: 2 });
            sheet.createCell('A2', { value: 3 });
            sheet.createCell('B2', { value: 4 });

            const range = sheet.getRange('A1:B2');
            const cell = range.getCellAtPosition(1, 1);

            expect(cell?.value).toBe(4);
        });

        test('should handle large ranges', () => {
            for (let row = 1; row <= 10; row++) {
                for (let col = 0; col < 10; col++) {
                    const colLetter = String.fromCharCode(65 + col);
                    sheet.createCell(`${colLetter}${row}`, { value: row * 10 + col });
                }
            }

            const range = sheet.getRange('A1:J10');

            expect(range.count).toBe(100);
            expect(range.rows).toBe(10);
            expect(range.columns).toBe(10);
        });
    });

    describe('Edge Cases', () => {
        test('should handle reverse range (B2:A1)', () => {
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('B1', { value: 2 });
            sheet.createCell('A2', { value: 3 });
            sheet.createCell('B2', { value: 4 });

            const range = sheet.getRange('B2:A1');

            // Should still work but might need handling
            expect(range.count).toBeGreaterThan(0);
        });

        test('should handle non-existent cells', () => {
            const range = sheet.getRange('Z99');

            expect(range).toBeDefined();
            expect(range.value).toBeDefined();
        });

        test('should handle toString()', () => {
            const singleRange = sheet.getRange('A1');
            const multiRange = sheet.getRange('A1:C3');

            expect(singleRange.toString()).toContain('A1');
            expect(multiRange.toString()).toContain('A1:C3');
            expect(multiRange.toString()).toContain('3x3');
        });
    });
});
