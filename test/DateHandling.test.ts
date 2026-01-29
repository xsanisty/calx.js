import { describe, expect, test, beforeEach } from '@jest/globals';
import { Calx, DateUtil } from '../src/Calx';
import { DataType } from '../src/Calx/Cell/DataType';

describe('Date Handling', () => {
    let workbook: any;
    let sheet: any;

    beforeEach(() => {
        workbook = Calx.createWorkbook();
        sheet = workbook.createSheet('Sheet1');
    });

    describe('DateUtil', () => {
        test('should convert Excel serial date to JavaScript Date', () => {
            // January 1, 2024 = 45292
            const serialDate = 45292;
            const date = DateUtil.serialToDate(serialDate);

            expect(date.getFullYear()).toBe(2024);
            expect(date.getMonth()).toBe(0); // January
            expect(date.getDate()).toBe(1);
        });

        test('should convert JavaScript Date to Excel serial date', () => {
            const date = new Date(2024, 0, 1); // January 1, 2024
            const serialDate = DateUtil.dateToSerial(date);

            expect(serialDate).toBe(45292);
        });

        test('should handle date components', () => {
            const serialDate = DateUtil.fromComponents(2024, 1, 15);
            const components = DateUtil.toComponents(serialDate);

            expect(components.year).toBe(2024);
            expect(components.month).toBe(1);
            expect(components.day).toBe(15);
        });

        test('should format as ISO string', () => {
            const serialDate = 45292; // January 1, 2024
            const isoString = DateUtil.toISOString(serialDate);

            expect(isoString).toBe('2024-01-01');
        });

        test('should parse ISO string', () => {
            const serialDate = DateUtil.fromISOString('2024-01-01');

            expect(serialDate).toBe(45292);
        });

        test('should validate serial dates', () => {
            expect(DateUtil.isValidSerialDate(45292)).toBe(true);
            expect(DateUtil.isValidSerialDate(0)).toBe(true);
            expect(DateUtil.isValidSerialDate(-1000)).toBe(true);
            expect(DateUtil.isValidSerialDate(NaN)).toBe(false);
            expect(DateUtil.isValidSerialDate('not a number' as any)).toBe(false);
            expect(DateUtil.isValidSerialDate(9999999)).toBe(false); // Too far in future
        });

        test('should get today as serial date', () => {
            const today = DateUtil.today();
            const todayDate = DateUtil.serialToDate(today);
            const now = new Date();

            expect(todayDate.getFullYear()).toBe(now.getFullYear());
            expect(todayDate.getMonth()).toBe(now.getMonth());
            expect(todayDate.getDate()).toBe(now.getDate());
        });
    });

    describe('Cell Date Methods', () => {
        test('should set and get date value as JavaScript Date', () => {
            const cell = sheet.createCell('A1', {});
            const date = new Date(2024, 0, 15); // January 15, 2024

            cell.setDateValue(date);

            expect(cell.isDate()).toBe(true);
            expect(cell.type).toBe(DataType.DATE);

            const retrievedDate = cell.getDateValue();
            expect(retrievedDate).not.toBeNull();
            expect(retrievedDate!.getFullYear()).toBe(2024);
            expect(retrievedDate!.getMonth()).toBe(0);
            expect(retrievedDate!.getDate()).toBe(15);
        });

        test('should set and get date value as Excel serial number', () => {
            const cell = sheet.createCell('A1', {});
            const serialDate = 45292; // January 1, 2024

            cell.setSerialDateValue(serialDate);

            expect(cell.isDate()).toBe(true);
            expect(cell.type).toBe(DataType.DATE);
            expect(cell.getSerialDateValue()).toBe(serialDate);
        });

        test('should get formatted date string', () => {
            const cell = sheet.createCell('A1', {});
            cell.setSerialDateValue(45292); // January 1, 2024

            const formatted = cell.getFormattedDate();
            expect(formatted).toBe('2024-01-01');
        });

        test('should convert between Date and serial formats', () => {
            const cell = sheet.createCell('A1', {});
            const date = new Date(2024, 5, 15); // June 15, 2024

            cell.setDateValue(date);

            const serialDate = cell.getSerialDateValue();
            expect(serialDate).not.toBeNull();

            const retrievedDate = cell.getDateValue();
            expect(retrievedDate!.getFullYear()).toBe(2024);
            expect(retrievedDate!.getMonth()).toBe(5);
            expect(retrievedDate!.getDate()).toBe(15);
        });

        test('should return null for non-date cells', () => {
            const cell = sheet.createCell('A1', { value: 42 });

            expect(cell.isDate()).toBe(false);
            expect(cell.getDateValue()).toBeNull();
            expect(cell.getSerialDateValue()).toBeNull();
            expect(cell.getFormattedDate()).toBeNull();
        });

        test('should handle DATE formula results', () => {
            const cell = sheet.createCell('A1', { formula: '=DATE(2024, 1, 15)' });

            workbook.build();
            workbook.calculate();

            // DATE function returns Excel serial number
            const serialDate = cell.value;
            expect(typeof serialDate).toBe('number');
            expect(DateUtil.isValidSerialDate(serialDate)).toBe(true);

            // Manually set type to DATE for date-specific methods
            cell.type = DataType.DATE;
            const date = cell.getDateValue();
            expect(date).not.toBeNull();
            expect(date!.getFullYear()).toBe(2024);
            expect(date!.getMonth()).toBe(0);
            expect(date!.getDate()).toBe(15);
        });

        test('should handle date arithmetic in formulas', () => {
            sheet.createCell('A1', { value: 45292, type: DataType.DATE }); // January 1, 2024
            sheet.createCell('B1', { formula: '=A1+7' }); // Add 7 days

            workbook.build();
            workbook.calculate();

            const resultSerial = sheet.getCellValue('B1');
            expect(resultSerial).toBe(45299); // January 8, 2024

            const resultCell = sheet.getCell('B1');
            resultCell.type = DataType.DATE;
            const resultDate = resultCell.getDateValue();
            expect(resultDate!.getDate()).toBe(8);
        });

        test('should throw error for invalid date', () => {
            const cell = sheet.createCell('A1', {});

            expect(() => {
                cell.setDateValue('not a date' as any);
            }).toThrow();
        });

        test('should throw error for invalid serial date', () => {
            const cell = sheet.createCell('A2', {});

            expect(() => {
                cell.setSerialDateValue(NaN);
            }).toThrow();

            expect(() => {
                cell.setSerialDateValue(9999999); // Too far in future
            }).toThrow();
        });
    });

    describe('Date Integration', () => {
        test('should work with multiple date cells', () => {
            const dates = [
                { address: 'A1', date: new Date(2024, 0, 1) },
                { address: 'A2', date: new Date(2024, 0, 15) },
                { address: 'A3', date: new Date(2024, 0, 31) },
            ];

            dates.forEach(({ address, date }) => {
                const cell = sheet.createCell(address, {});
                cell.setDateValue(date);
            });

            // All cells should be dates
            dates.forEach(({ address }) => {
                const cell = sheet.getCell(address);
                expect(cell.isDate()).toBe(true);
                expect(cell.getDateValue()).not.toBeNull();
            });
        });

        test('should calculate date differences', () => {
            const cell1 = sheet.createCell('A1', {});
            cell1.setSerialDateValue(45292); // Jan 1, 2024

            const cell2 = sheet.createCell('A2', {});
            cell2.setSerialDateValue(45323); // Feb 1, 2024

            sheet.createCell('A3', { formula: '=A2-A1' }); // Days between

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A3')).toBe(31); // 31 days
        });

        test('should use DateUtil in formula calculations', () => {
            // Create a formula that uses YEAR, MONTH, DAY functions
            const cell1 = sheet.createCell('A1', {});
            cell1.setSerialDateValue(45292); // Jan 1, 2024

            sheet.createCell('B1', { formula: '=YEAR(A1)' });
            sheet.createCell('C1', { formula: '=MONTH(A1)' });
            sheet.createCell('D1', { formula: '=DAY(A1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(2024);
            expect(sheet.getCellValue('C1')).toBe(1);
            expect(sheet.getCellValue('D1')).toBe(1);
        });
    });
});
