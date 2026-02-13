import { Calx } from '../../src/Calx';

describe('IF Short-Circuit Evaluation', () => {
    let workbook: any;
    let sheet: any;

    beforeEach(() => {
        workbook = Calx.createWorkbook();
        sheet = workbook.createSheet('TestSheet');
    });

    describe('Scalar Conditions', () => {
        test('should NOT evaluate false branch when condition is TRUE', () => {
            sheet.createCell('A1', { value: 10 });
            // If short-circuit works, 1/0 in false branch should never be evaluated
            sheet.createCell('B1', { formula: '=IF(TRUE, 100, 1/0)' });

            workbook.build();
            workbook.calculate();

            // Should return 100 without division by zero error
            expect(sheet.getCellValue('B1')).toBe(100);
        });

        test('should NOT evaluate true branch when condition is FALSE', () => {
            sheet.createCell('A1', { value: 10 });
            // If short-circuit works, 1/0 in true branch should never be evaluated
            sheet.createCell('B1', { formula: '=IF(FALSE, 1/0, 200)' });

            workbook.build();
            workbook.calculate();

            // Should return 200 without division by zero error
            expect(sheet.getCellValue('B1')).toBe(200);
        });

        test('should NOT evaluate false branch when condition is truthy number', () => {
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('B1', { formula: '=IF(A1, "Yes", 1/0)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe('Yes');
        });

        test('should NOT evaluate true branch when condition is 0', () => {
            sheet.createCell('A1', { value: 0 });
            sheet.createCell('B1', { formula: '=IF(A1, 1/0, "No")' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe('No');
        });

        test('should NOT evaluate false branch when condition expression is TRUE', () => {
            sheet.createCell('A1', { value: 15 });
            sheet.createCell('B1', { formula: '=IF(A1>10, "High", 1/0)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe('High');
        });

        test('should NOT evaluate true branch when condition expression is FALSE', () => {
            sheet.createCell('A1', { value: 5 });
            sheet.createCell('B1', { formula: '=IF(A1>10, 1/0, "Low")' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe('Low');
        });
    });

    describe('Array Conditions', () => {
        test('should only evaluate needed branch for simple array with all TRUE', () => {
            // Using array constant {TRUE,TRUE,TRUE} to avoid spilling issues
            sheet.createCell('B1', { formula: '=IF({TRUE,TRUE,TRUE}, "High", 1/0)' });

            workbook.build();
            workbook.calculate();

            // Should return "High" for all three elements without evaluating 1/0
            expect(sheet.getCellValue('B1')).toBe('High');
            expect(sheet.getCellValue('C1')).toBe('High');
            expect(sheet.getCellValue('D1')).toBe('High');
        });

        test('should only evaluate needed branch for simple array with all FALSE', () => {
            // Using array constant {FALSE,FALSE,FALSE} to avoid spilling issues
            sheet.createCell('B1', { formula: '=IF({FALSE,FALSE,FALSE}, 1/0, "Low")' });

            workbook.build();
            workbook.calculate();

            // Should return "Low" for all three elements without evaluating 1/0
            expect(sheet.getCellValue('B1')).toBe('Low');
            expect(sheet.getCellValue('C1')).toBe('Low');
            expect(sheet.getCellValue('D1')).toBe('Low');
        });

        test('should evaluate both branches when conditions are mixed', () => {
            // Using array constant {FALSE,TRUE,TRUE} - mixed conditions
            sheet.createCell('B1', { formula: '=IF({FALSE,TRUE,TRUE}, "High", "Low")' });

            workbook.build();
            workbook.calculate();

            // Both branches must be evaluated since we have mixed conditions
            expect(sheet.getCellValue('B1')).toBe('Low');
            expect(sheet.getCellValue('C1')).toBe('High');
            expect(sheet.getCellValue('D1')).toBe('High');
        });
    });

    describe('Nested IF Short-Circuit', () => {
        test('should short-circuit nested IF statements', () => {
            sheet.createCell('A1', { value: 1 });
            // Outer IF is FALSE, so inner IF(TRUE, 1/0, 5) should never be evaluated
            sheet.createCell('B1', { formula: '=IF(A1>10, IF(TRUE, 1/0, 5), 100)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(100);
        });

        test('should short-circuit inner IF when outer condition is TRUE', () => {
            sheet.createCell('A1', { value: 15 });
            // Outer IF is TRUE, inner IF is FALSE, so 1/0 in inner true branch not evaluated
            sheet.createCell('B1', { formula: '=IF(A1>10, IF(FALSE, 1/0, 50), 100)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(50);
        });
    });

    describe('IF with missing false branch', () => {
        test('should return FALSE when condition is false and no false branch provided', () => {
            sheet.createCell('A1', { value: 5 });
            sheet.createCell('B1', { formula: '=IF(A1>10, "High")' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(false);
        });

        test('should NOT evaluate true branch when condition is FALSE and no false branch', () => {
            sheet.createCell('A1', { value: 5 });
            sheet.createCell('B1', { formula: '=IF(A1>10, 1/0)' });

            workbook.build();
            workbook.calculate();

            // Should return false without evaluating 1/0
            expect(sheet.getCellValue('B1')).toBe(false);
        });
    });
});
