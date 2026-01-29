import { describe, test, expect } from '@jest/globals';
import { Calx } from '../src/Calx';

describe('Named Ranges', () => {
    describe('Basic Named Range Operations', () => {
        test('should define and resolve a named range for single cell', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 100 });

            // Define named range
            const success = workbook.nameManager.define('TaxRate', 'A1');
            expect(success).toBe(true);

            // Resolve named range
            const value = workbook.nameManager.resolve('TaxRate');
            expect(value).toBe(100);
        });

        test('should define and resolve a named range for cell range', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });

            // Define named range
            workbook.nameManager.define('SalesData', 'A1:A3');

            // Resolve named range (should return array of values)
            const values = workbook.nameManager.resolve('SalesData');
            expect(Array.isArray(values)).toBe(true);
            expect(values.length).toBe(3);
        });

        test('should use named range in formulas', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 100 });
            sheet.createCell('A2', { value: 200 });
            sheet.createCell('A3', { value: 300 });

            // Define named range
            workbook.nameManager.define('Sales', 'A1:A3');

            // Use named range in formula
            sheet.createCell('B1', { formula: '=SUM(Sales)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(600);
        });

        test('should use named range for single cell in formulas', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 0.15 });
            sheet.createCell('B1', { value: 1000 });

            // Define named range for tax rate
            workbook.nameManager.define('TaxRate', 'A1');

            // Use named range in formula
            sheet.createCell('C1', { formula: '=B1*TaxRate' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe(150);
        });

        test('should support multiple named ranges', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 1000 });
            sheet.createCell('A2', { value: 0.15 });

            workbook.nameManager.define('Price', 'A1');
            workbook.nameManager.define('TaxRate', 'A2');

            sheet.createCell('A3', { formula: '=Price*TaxRate' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A3')).toBe(150);
        });
    });

    describe('Named Range Validation', () => {
        test('should validate named range names', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 100 });

            // Valid names
            expect(workbook.nameManager.define('Sales', 'A1')).toBe(true);
            expect(workbook.nameManager.define('Tax_Rate', 'A1')).toBe(true);
            expect(workbook.nameManager.define('_Total', 'A1')).toBe(true);
            expect(workbook.nameManager.define('Q1_2024', 'A1')).toBe(true);

            // Invalid names - cell reference
            expect(workbook.nameManager.define('A1', 'A1')).toBe(false);
            expect(workbook.nameManager.define('B10', 'A1')).toBe(false);

            // Invalid names - starts with number
            expect(workbook.nameManager.define('1Sales', 'A1')).toBe(false);

            // Invalid names - reserved keywords
            expect(workbook.nameManager.define('TRUE', 'A1')).toBe(false);
            expect(workbook.nameManager.define('FALSE', 'A1')).toBe(false);
            expect(workbook.nameManager.define('NULL', 'A1')).toBe(false);
        });

        test('should return #NAME? for undefined named range', () => {
            const workbook = Calx.createWorkbook();
            const value = workbook.nameManager.resolve('UndefinedName');
            expect(value).toBe('#NAME?');
        });

        test('should check if named range exists', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 100 });

            expect(workbook.nameManager.has('TaxRate')).toBe(false);

            workbook.nameManager.define('TaxRate', 'A1');

            expect(workbook.nameManager.has('TaxRate')).toBe(true);
        });
    });

    describe('Named Range Management', () => {
        test('should get named range definition', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 100 });

            workbook.nameManager.define('TaxRate', 'A1', undefined, 'Standard tax rate');

            const definition = workbook.nameManager.get('TaxRate');
            expect(definition).toBeDefined();
            expect(definition?.name).toBe('TaxRate');
            expect(definition?.reference).toBe('A1');
            expect(definition?.comment).toBe('Standard tax rate');
        });

        test('should get all named ranges', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 100 });
            sheet.createCell('A2', { value: 200 });

            workbook.nameManager.define('First', 'A1');
            workbook.nameManager.define('Second', 'A2');

            const all = workbook.nameManager.getAll();
            expect(all.length).toBe(2);
            expect(all.some(nr => nr.name === 'First')).toBe(true);
            expect(all.some(nr => nr.name === 'Second')).toBe(true);
        });

        test('should remove named range', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 100 });

            workbook.nameManager.define('TaxRate', 'A1');
            expect(workbook.nameManager.has('TaxRate')).toBe(true);

            const removed = workbook.nameManager.remove('TaxRate');
            expect(removed).toBe(true);
            expect(workbook.nameManager.has('TaxRate')).toBe(false);
        });

        test('should return false when removing non-existent named range', () => {
            const workbook = Calx.createWorkbook();
            const removed = workbook.nameManager.remove('NonExistent');
            expect(removed).toBe(false);
        });

        test('should clear all named ranges', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 100 });
            sheet.createCell('A2', { value: 200 });

            workbook.nameManager.define('First', 'A1');
            workbook.nameManager.define('Second', 'A2');

            expect(workbook.nameManager.getAll().length).toBe(2);

            workbook.nameManager.clear();

            expect(workbook.nameManager.getAll().length).toBe(0);
            expect(workbook.nameManager.has('First')).toBe(false);
            expect(workbook.nameManager.has('Second')).toBe(false);
        });

        test('should update named range by redefining', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 100 });
            sheet.createCell('A2', { value: 200 });

            workbook.nameManager.define('Value', 'A1');
            expect(workbook.nameManager.resolve('Value')).toBe(100);

            // Redefine to point to A2
            workbook.nameManager.define('Value', 'A2');
            expect(workbook.nameManager.resolve('Value')).toBe(200);
        });
    });

    describe('Named Range with Formulas', () => {
        test('should support named range in complex formulas', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 1000 });
            sheet.createCell('A2', { value: 2000 });
            sheet.createCell('A3', { value: 3000 });
            sheet.createCell('B1', { value: 0.1 });

            workbook.nameManager.define('Prices', 'A1:A3');
            workbook.nameManager.define('Discount', 'B1');

            sheet.createCell('C1', { formula: '=SUM(Prices)*Discount' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe(600); // (1000+2000+3000)*0.1
        });

        test('should support nested functions with named ranges', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });

            workbook.nameManager.define('Numbers', 'A1:A3');

            sheet.createCell('B1', { formula: '=AVERAGE(Numbers)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(20);
        });

        test('should support arithmetic operations with named ranges', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 100 });
            sheet.createCell('A2', { value: 50 });

            workbook.nameManager.define('Price', 'A1');
            workbook.nameManager.define('Cost', 'A2');

            sheet.createCell('A3', { formula: '=Price-Cost' });
            sheet.createCell('A4', { formula: '=(Price-Cost)/Cost' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A3')).toBe(50);
            expect(sheet.getCellValue('A4')).toBe(1);
        });
    });

    describe('Named Range with 2D Ranges', () => {
        test('should support 2D named ranges', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 1 });
            sheet.createCell('B1', { value: 2 });
            sheet.createCell('A2', { value: 3 });
            sheet.createCell('B2', { value: 4 });

            workbook.nameManager.define('Matrix', 'A1:B2');

            sheet.createCell('C1', { formula: '=SUM(Matrix)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe(10);
        });
    });

    describe('Named Range Auto-Recalculation', () => {
        test('should auto-recalculate when named range source changes', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 100 });
            workbook.nameManager.define('Price', 'A1');

            sheet.createCell('B1', { formula: '=Price*2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(200);

            // Change the source value
            const cellA1 = sheet.getCell('A1');
            cellA1.value = 150;

            expect(sheet.getCellValue('B1')).toBe(300);
        });

        test('should auto-recalculate with named range in complex dependency', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });

            workbook.nameManager.define('Data', 'A1:A3');

            sheet.createCell('B1', { formula: '=SUM(Data)' });
            sheet.createCell('B2', { formula: '=B1*2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(60);
            expect(sheet.getCellValue('B2')).toBe(120);

            // Change a value in the named range
            const cellA2 = sheet.getCell('A2');
            cellA2.value = 50;

            expect(sheet.getCellValue('B1')).toBe(90);
            expect(sheet.getCellValue('B2')).toBe(180);
        });
    });

    describe('Named Range Priority', () => {
        test('named ranges should take priority over sheet variables', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 100 });

            // Set a sheet variable
            sheet.setVariable('MyValue', 50);

            // Define named range with same name
            workbook.nameManager.define('MyValue', 'A1');

            sheet.createCell('B1', { formula: '=MyValue' });

            workbook.build();
            workbook.calculate();

            // Should use named range value (100) not variable (50)
            expect(sheet.getCellValue('B1')).toBe(100);
        });
    });

    describe('Named Range Error Handling', () => {
        test('should return #NAME? when using undefined named range in formula', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { formula: '=UndefinedName*2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A1')).toBe('#NAME?');
        });

        test('should handle named range pointing to empty cells', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create empty cells (or don't create them at all)
            workbook.nameManager.define('EmptyRange', 'A1:A3');

            sheet.createCell('B1', { formula: '=SUM(EmptyRange)' });

            workbook.build();
            workbook.calculate();

            // SUM of empty cells should be 0
            expect(sheet.getCellValue('B1')).toBe(0);
        });
    });
});
