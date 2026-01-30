import { describe, expect, test, beforeEach } from '@jest/globals';
import { Calx } from '../src/Calx';
import { DataType } from '../src/Calx/Cell/DataType';

describe('Date UTC Storage and Formula Integration', () => {
    let workbook: any;
    let sheet: any;

    beforeEach(() => {
        workbook = Calx.createWorkbook();
        sheet = workbook.createSheet('Sheet1');
    });

    test('should store dates as UTC Date objects in cells', () => {
        const cell = sheet.createCell('A1', {
            value: '2024-01-15',
            type: DataType.DATE
        });

        // Internal date value should be UTC Date object
        const dateValue = cell.getDateValue();
        expect(dateValue).toBeInstanceOf(Date);
        expect(dateValue!.getUTCFullYear()).toBe(2024);
        expect(dateValue!.getUTCMonth()).toBe(0);
        expect(dateValue!.getUTCDate()).toBe(15);
    });

    test('should use UTC dates in YEAR formula', () => {
        sheet.createCell('A1', { value: 45292, type: DataType.DATE }); // Jan 1, 2024
        sheet.createCell('B1', { formula: '=YEAR(A1)' });

        workbook.build();
        workbook.calculate();

        expect(sheet.getCellValue('B1')).toBe(2024);
    });

    test('should use UTC dates in MONTH formula', () => {
        sheet.createCell('A1', { value: 45292, type: DataType.DATE }); // Jan 1, 2024
        sheet.createCell('B1', { formula: '=MONTH(A1)' });

        workbook.build();
        workbook.calculate();

        expect(sheet.getCellValue('B1')).toBe(1);
    });

    test('should use UTC dates in DAY formula', () => {
        sheet.createCell('A1', { value: 45292, type: DataType.DATE }); // Jan 1, 2024
        sheet.createCell('B1', { formula: '=DAY(A1)' });

        workbook.build();
        workbook.calculate();

        expect(sheet.getCellValue('B1')).toBe(1);
    });

    test('should create UTC dates with DATE formula', () => {
        sheet.createCell('A1', { formula: '=DATE(2024, 6, 15)' });

        workbook.build();
        workbook.calculate();

        const serialDate = sheet.getCellValue('A1');
        expect(typeof serialDate).toBe('number');

        // Verify the date is correct when converted back
        const cell = sheet.getCell('A1');
        cell.type = DataType.DATE;
        const date = cell.getDateValue();
        expect(date!.getUTCFullYear()).toBe(2024);
        expect(date!.getUTCMonth()).toBe(5); // June (0-indexed)
        expect(date!.getUTCDate()).toBe(15);
    });

    test('should handle DATEVALUE with ISO string', () => {
        sheet.createCell('A1', { formula: '=DATEVALUE("2024-03-15")' });

        workbook.build();
        workbook.calculate();

        const serialDate = sheet.getCellValue('A1');
        expect(typeof serialDate).toBe('number');

        const cell = sheet.getCell('A1');
        cell.type = DataType.DATE;
        const date = cell.getDateValue();
        expect(date!.getUTCFullYear()).toBe(2024);
        expect(date!.getUTCMonth()).toBe(2); // March (0-indexed)
        expect(date!.getUTCDate()).toBe(15);
    });

    test('should handle date arithmetic with UTC dates', () => {
        // Create a date cell
        sheet.createCell('A1', { value: 45292, type: DataType.DATE }); // Jan 1, 2024

        // Add 30 days
        sheet.createCell('B1', { formula: '=A1+30' });

        // Extract components
        sheet.createCell('C1', { formula: '=YEAR(B1)' });
        sheet.createCell('D1', { formula: '=MONTH(B1)' });
        sheet.createCell('E1', { formula: '=DAY(B1)' });

        workbook.build();
        workbook.calculate();

        // Jan 1 + 30 days = Jan 31, 2024
        expect(sheet.getCellValue('C1')).toBe(2024);
        expect(sheet.getCellValue('D1')).toBe(1);
        expect(sheet.getCellValue('E1')).toBe(31);
    });

    test('should maintain UTC consistency across cell updates', () => {
        const cell = sheet.createCell('A1', {
            value: '2024-01-15',
            type: DataType.DATE
        });

        const date1 = cell.getDateValue();
        expect(date1!.getUTCDate()).toBe(15);

        // Update the value
        cell.value = '2024-02-20';

        const date2 = cell.getDateValue();
        expect(date2!.getUTCFullYear()).toBe(2024);
        expect(date2!.getUTCMonth()).toBe(1); // February
        expect(date2!.getUTCDate()).toBe(20);
    });

    test('should handle dates in formulas referencing date cells', () => {
        // Create multiple date cells
        sheet.createCell('A1', { value: 45292, type: DataType.DATE }); // Jan 1, 2024
        sheet.createCell('A2', { value: 45323, type: DataType.DATE }); // Feb 1, 2024

        // Calculate difference
        sheet.createCell('B1', { formula: '=A2-A1' });

        // Create new date from calculation
        sheet.createCell('C1', { formula: '=DATE(YEAR(A1), MONTH(A1)+2, DAY(A1))' });

        workbook.build();
        workbook.calculate();

        // 31 days between Jan 1 and Feb 1
        expect(sheet.getCellValue('B1')).toBe(31);

        // March 1, 2024
        const resultCell = sheet.getCell('C1');
        resultCell.type = DataType.DATE;
        const resultDate = resultCell.getDateValue();
        expect(resultDate!.getUTCMonth()).toBe(2); // March
    });
});
