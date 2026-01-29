import { Calx } from '../src/Calx';
import { DataType } from '../src/Calx/Cell/DataType';

describe('Array Formulas', () => {
    let workbook: any;
    let sheet: any;

    beforeEach(() => {
        workbook = Calx.createWorkbook();
        sheet = workbook.createSheet('Test');
    });

    describe('Array Constants', () => {
        test('should handle horizontal array constant', () => {
            sheet.createCell('A1', { formula: '={1,2,3}' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A1')).toBe(1);
            expect(sheet.getCellValue('B1')).toBe(2);
            expect(sheet.getCellValue('C1')).toBe(3);
        });

        test('should handle vertical array constant', () => {
            sheet.createCell('A1', { formula: '={1;2;3}' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A1')).toBe(1);
            expect(sheet.getCellValue('A2')).toBe(2);
            expect(sheet.getCellValue('A3')).toBe(3);
        });

        test('should handle 2D array constant', () => {
            sheet.createCell('A1', { formula: '={1,2,3;4,5,6}' });

            workbook.build();
            workbook.calculate();

            // First row
            expect(sheet.getCellValue('A1')).toBe(1);
            expect(sheet.getCellValue('B1')).toBe(2);
            expect(sheet.getCellValue('C1')).toBe(3);

            // Second row
            expect(sheet.getCellValue('A2')).toBe(4);
            expect(sheet.getCellValue('B2')).toBe(5);
            expect(sheet.getCellValue('C2')).toBe(6);
        });
    });

    describe('Array Range Operations', () => {
        test('should multiply range by scalar', () => {
            sheet.createCell('A1', { value: 2 });
            sheet.createCell('A2', { value: 3 });
            sheet.createCell('A3', { value: 4 });

            sheet.createCell('B1', { formula: '=A1:A3*10' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(20);
            expect(sheet.getCellValue('B2')).toBe(30);
            expect(sheet.getCellValue('B3')).toBe(40);
        });

        test('should add two ranges', () => {
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('A2', { value: 2 });
            sheet.createCell('A3', { value: 3 });

            sheet.createCell('B1', { value: 10 });
            sheet.createCell('B2', { value: 20 });
            sheet.createCell('B3', { value: 30 });

            sheet.createCell('C1', { formula: '=A1:A3+B1:B3' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe(11);
            expect(sheet.getCellValue('C2')).toBe(22);
            expect(sheet.getCellValue('C3')).toBe(33);
        });

        test('should handle range squared', () => {
            sheet.createCell('A1', { value: 2 });
            sheet.createCell('A2', { value: 3 });
            sheet.createCell('A3', { value: 4 });

            sheet.createCell('B1', { formula: '=A1:A3^2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(4);
            expect(sheet.getCellValue('B2')).toBe(9);
            expect(sheet.getCellValue('B3')).toBe(16);
        });
    });

    describe('Dynamic Array Functions', () => {
        test('should spill SEQUENCE results', () => {
            sheet.createCell('A1', { formula: '=SEQUENCE(3)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A1')).toBe(1);
            expect(sheet.getCellValue('A2')).toBe(2);
            expect(sheet.getCellValue('A3')).toBe(3);
        });

        test('should spill SORT results', () => {
            sheet.createCell('A1', { value: 3 });
            sheet.createCell('A2', { value: 1 });
            sheet.createCell('A3', { value: 2 });

            sheet.createCell('B1', { formula: '=SORT(A1:A3)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(1);
            expect(sheet.getCellValue('B2')).toBe(2);
            expect(sheet.getCellValue('B3')).toBe(3);
        });

        test('should spill UNIQUE results', () => {
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('A2', { value: 2 });
            sheet.createCell('A3', { value: 1 });
            sheet.createCell('A4', { value: 3 });

            sheet.createCell('B1', { formula: '=UNIQUE(A1:A4)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(1);
            expect(sheet.getCellValue('B2')).toBe(2);
            expect(sheet.getCellValue('B3')).toBe(3);
        });
    });

    describe('SPILL Errors', () => {
        test('should return #SPILL! when blocked by data', () => {
            sheet.createCell('A1', { formula: '={1,2,3}' });
            sheet.createCell('B1', { value: 'BLOCKING' }); // This blocks the spill

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A1')).toBe('#SPILL!');
        });

        test('should return #SPILL! when vertical array is blocked', () => {
            sheet.createCell('A1', { formula: '={1;2;3;4;5}' });
            sheet.createCell('A3', { value: 'BLOCKING' }); // This blocks the spill

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A1')).toBe('#SPILL!');
        });

        test('should return #SPILL! when 2D array is blocked', () => {
            sheet.createCell('A1', { formula: '={1,2;3,4}' });
            sheet.createCell('B2', { value: 'BLOCKING' }); // This blocks the spill

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A1')).toBe('#SPILL!');
        });

        test('should not spill when blocked but show error only in anchor', () => {
            sheet.createCell('A1', { formula: '={1,2,3}' });
            sheet.createCell('C1', { value: 'BLOCKING' }); // This blocks C1

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A1')).toBe('#SPILL!');
            expect(sheet.getCellValue('C1')).toBe('BLOCKING'); // Original value preserved
        });
    });

    describe('Spill Range Reference', () => {
        test('should reference spilled range with # operator', () => {
            sheet.createCell('A1', { formula: '={1;2;3}' });
            sheet.createCell('B1', { formula: '=SUM(A1#)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A1')).toBe(1);
            expect(sheet.getCellValue('A2')).toBe(2);
            expect(sheet.getCellValue('A3')).toBe(3);
            expect(sheet.getCellValue('B1')).toBe(6); // Sum of spilled range
        });

        test('should use implicit intersection for non-array formula', () => {
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('A2', { value: 2 });
            sheet.createCell('A3', { value: 3 });

            sheet.createCell('B1', { formula: '=A1:A3' }); // Should return 1 (implicit intersection)

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(1);
        });
    });

    describe('Array Formula with Functions', () => {
        test('should apply function to each array element', () => {
            sheet.createCell('A1', { formula: '=SQRT({4,9,16})' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A1')).toBe(2);
            expect(sheet.getCellValue('B1')).toBe(3);
            expect(sheet.getCellValue('C1')).toBe(4);
        });

        test('should handle IF with array', () => {
            sheet.createCell('A1', { value: 5 });
            sheet.createCell('A2', { value: 15 });
            sheet.createCell('A3', { value: 25 });

            sheet.createCell('B1', { formula: '=IF(A1:A3>10,"High","Low")' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe('Low');
            expect(sheet.getCellValue('B2')).toBe('High');
            expect(sheet.getCellValue('B3')).toBe('High');
        });
    });

    describe('Mixed Array Operations', () => {
        test('should handle complex array expression', () => {
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('A2', { value: 2 });
            sheet.createCell('A3', { value: 3 });

            sheet.createCell('B1', { formula: '=(A1:A3*2)+10' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(12);
            expect(sheet.getCellValue('B2')).toBe(14);
            expect(sheet.getCellValue('B3')).toBe(16);
        });

        test('should handle array constant in expression', () => {
            sheet.createCell('A1', { formula: '={1,2,3}*2+{10,20,30}' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A1')).toBe(12);  // 1*2+10
            expect(sheet.getCellValue('B1')).toBe(24);  // 2*2+20
            expect(sheet.getCellValue('C1')).toBe(36);  // 3*2+30
        });
    });
});
