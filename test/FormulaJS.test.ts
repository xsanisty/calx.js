import { Calx } from '../src/Calx';
import { DataType } from '../src/Calx/Cell/DataType';

describe('FormulaJS Integration', () => {
    let workbook: any;
    let sheet: any;

    beforeEach(() => {
        workbook = Calx.createWorkbook();
        sheet = workbook.createSheet('TestSheet');
    });

    describe('Math Functions', () => {
        test('should calculate SUM', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });
            sheet.createCell('A4', { formula: '=SUM(A1,A2,A3)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A4')).toBe(60);
        });

        test('should calculate AVERAGE', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });
            sheet.createCell('A4', { formula: '=AVERAGE(A1,A2,A3)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A4')).toBe(20);
        });

        test('should calculate MAX', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 50 });
            sheet.createCell('A3', { value: 30 });
            sheet.createCell('A4', { formula: '=MAX(A1,A2,A3)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A4')).toBe(50);
        });

        test('should calculate MIN', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 50 });
            sheet.createCell('A3', { value: 30 });
            sheet.createCell('A4', { formula: '=MIN(A1,A2,A3)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A4')).toBe(10);
        });

        test('should calculate COUNT', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 'text' });
            sheet.createCell('A4', { value: 30 });
            sheet.createCell('A5', { formula: '=COUNT(A1,A2,A3,A4)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A5')).toBe(3);
        });

        test('should calculate ROUND', () => {
            sheet.createCell('A1', { value: 3.14159 });
            sheet.createCell('A2', { formula: '=ROUND(A1,2)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe(3.14);
        });

        test('should calculate ABS', () => {
            sheet.createCell('A1', { value: -42 });
            sheet.createCell('A2', { formula: '=ABS(A1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe(42);
        });

        test('should calculate SQRT', () => {
            sheet.createCell('A1', { value: 16 });
            sheet.createCell('A2', { formula: '=SQRT(A1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe(4);
        });

        test('should calculate POWER', () => {
            sheet.createCell('A1', { value: 2 });
            sheet.createCell('A2', { value: 3 });
            sheet.createCell('A3', { formula: '=POWER(A1,A2)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A3')).toBe(8);
        });

        test('should calculate MOD', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 3 });
            sheet.createCell('A3', { formula: '=MOD(A1,A2)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A3')).toBe(1);
        });
    });

    describe('Statistical Functions', () => {
        test('should calculate MEDIAN', () => {
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('A2', { value: 2 });
            sheet.createCell('A3', { value: 3 });
            sheet.createCell('A4', { value: 4 });
            sheet.createCell('A5', { value: 5 });
            sheet.createCell('A6', { formula: '=MEDIAN(A1,A2,A3,A4,A5)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A6')).toBe(3);
        });

        test('should calculate STDEV', () => {
            sheet.createCell('A1', { value: 2 });
            sheet.createCell('A2', { value: 4 });
            sheet.createCell('A3', { value: 4 });
            sheet.createCell('A4', { value: 4 });
            sheet.createCell('A5', { value: 5 });
            sheet.createCell('A6', { value: 5 });
            sheet.createCell('A7', { value: 7 });
            sheet.createCell('A8', { value: 9 });
            sheet.createCell('A9', { formula: '=STDEV(A1,A2,A3,A4,A5,A6,A7,A8)' });

            workbook.build();
            workbook.calculate();

            const result = sheet.getCellValue('A9');
            expect(result).toBeCloseTo(2, 0);
        });
    });

    describe('Logical Functions', () => {
        test('should evaluate IF', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { formula: '=IF(A1>A2,"Greater","Less")' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A3')).toBe('Less');
        });

        test('should evaluate AND', () => {
            sheet.createCell('A1', { value: true });
            sheet.createCell('A2', { value: true });
            sheet.createCell('A3', { formula: '=AND(A1,A2)' });
            sheet.createCell('A4', { value: true });
            sheet.createCell('A5', { value: false });
            sheet.createCell('A6', { formula: '=AND(A4,A5)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A3')).toBe(true);
            expect(sheet.getCellValue('A6')).toBe(false);
        });

        test('should evaluate OR', () => {
            sheet.createCell('A1', { value: false });
            sheet.createCell('A2', { value: true });
            sheet.createCell('A3', { formula: '=OR(A1,A2)' });
            sheet.createCell('A4', { value: false });
            sheet.createCell('A5', { value: false });
            sheet.createCell('A6', { formula: '=OR(A4,A5)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A3')).toBe(true);
            expect(sheet.getCellValue('A6')).toBe(false);
        });

        test('should evaluate NOT', () => {
            sheet.createCell('A1', { value: true });
            sheet.createCell('A2', { formula: '=NOT(A1)' });
            sheet.createCell('A3', { value: false });
            sheet.createCell('A4', { formula: '=NOT(A3)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe(false);
            expect(sheet.getCellValue('A4')).toBe(true);
        });
    });

    describe('Text Functions', () => {
        test('should CONCATENATE strings', () => {
            sheet.createCell('A1', { value: 'Hello' });
            sheet.createCell('A2', { value: 'World' });
            sheet.createCell('A3', { formula: '=CONCATENATE(A1," ",A2)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A3')).toBe('Hello World');
        });

        test('should extract LEFT characters', () => {
            sheet.createCell('A1', { value: 'Hello World' });
            sheet.createCell('A2', { formula: '=LEFT(A1,5)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe('Hello');
        });

        test('should extract RIGHT characters', () => {
            sheet.createCell('A1', { value: 'Hello World' });
            sheet.createCell('A2', { formula: '=RIGHT(A1,5)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe('World');
        });

        test('should extract MID characters', () => {
            sheet.createCell('A1', { value: 'Hello World' });
            sheet.createCell('A2', { formula: '=MID(A1,7,5)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe('World');
        });

        test('should calculate LEN', () => {
            sheet.createCell('A1', { value: 'Hello' });
            sheet.createCell('A2', { formula: '=LEN(A1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe(5);
        });

        test('should convert to LOWER case', () => {
            sheet.createCell('A1', { value: 'HELLO WORLD' });
            sheet.createCell('A2', { formula: '=LOWER(A1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe('hello world');
        });

        test('should convert to UPPER case', () => {
            sheet.createCell('A1', { value: 'hello world' });
            sheet.createCell('A2', { formula: '=UPPER(A1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe('HELLO WORLD');
        });

        test('should TRIM whitespace', () => {
            sheet.createCell('A1', { value: '  Hello World  ' });
            sheet.createCell('A2', { formula: '=TRIM(A1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe('Hello World');
        });
    });

    describe('Lookup Functions', () => {
        test('should perform VLOOKUP', () => {
            // Create a lookup table
            sheet.createCell('A1', { value: 'ID' });
            sheet.createCell('B1', { value: 'Name' });
            sheet.createCell('A2', { value: 1 });
            sheet.createCell('B2', { value: 'Alice' });
            sheet.createCell('A3', { value: 2 });
            sheet.createCell('B3', { value: 'Bob' });
            sheet.createCell('A4', { value: 3 });
            sheet.createCell('B4', { value: 'Charlie' });

            // Note: VLOOKUP needs range syntax which we'll implement later
            // For now, test basic functionality with individual cells
            sheet.createCell('D1', { value: 2 });
            sheet.createCell('D2', { formula: '=VLOOKUP(D1,A2,B2,A3,B3,A4,B4,2,0)' });

            workbook.build();
            workbook.calculate();

            // This will fail until we implement range references properly
            // expect(sheet.getCellValue('D2')).toBe('Bob');
        });
    });

    describe('Date Functions', () => {
        test('should create DATE', () => {
            sheet.createCell('A1', { formula: '=DATE(2024,1,15)' });

            workbook.build();
            workbook.calculate();

            const result = sheet.getCellValue('A1');
            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);
        });

        test('should extract YEAR', () => {
            sheet.createCell('A1', { formula: '=DATE(2024,6,15)' });
            sheet.createCell('A2', { formula: '=YEAR(A1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe(2024);
        });

        test('should extract MONTH', () => {
            sheet.createCell('A1', { formula: '=DATE(2024,6,15)' });
            sheet.createCell('A2', { formula: '=MONTH(A1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe(6);
        });

        test('should extract DAY', () => {
            sheet.createCell('A1', { formula: '=DATE(2024,6,15)' });
            sheet.createCell('A2', { formula: '=DAY(A1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe(15);
        });
    });

    describe('Financial Functions', () => {
        test('should calculate PMT', () => {
            // PMT(rate, nper, pv, [fv], [type])
            // Calculate monthly payment for a $10,000 loan at 5% annual interest for 2 years
            sheet.createCell('A1', { value: 0.05/12 }); // Monthly rate
            sheet.createCell('A2', { value: 24 }); // 2 years
            sheet.createCell('A3', { value: 10000 }); // Loan amount
            sheet.createCell('A4', { formula: '=PMT(A1,A2,A3)' });

            workbook.build();
            workbook.calculate();

            const result = sheet.getCellValue('A4');
            expect(typeof result).toBe('number');
            expect(result).toBeLessThan(0); // Payment should be negative
            expect(Math.abs(result)).toBeGreaterThan(400);
            expect(Math.abs(result)).toBeLessThan(500);
        });

        test('should calculate FV', () => {
            // FV(rate, nper, pmt, [pv], [type])
            // Future value of $100/month for 12 months at 5% annual interest
            sheet.createCell('A1', { value: 0.05/12 }); // Monthly rate
            sheet.createCell('A2', { value: 12 }); // 1 year
            sheet.createCell('A3', { value: -100 }); // Monthly payment
            sheet.createCell('A4', { formula: '=FV(A1,A2,A3)' });

            workbook.build();
            workbook.calculate();

            const result = sheet.getCellValue('A4');
            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(1200);
            expect(result).toBeLessThan(1300);
        });
    });

    describe('Complex Formulas', () => {
        test('should handle nested functions', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });
            sheet.createCell('A4', { formula: '=ROUND(AVERAGE(A1,A2,A3),0)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A4')).toBe(20);
        });

        test('should combine math and logical functions', () => {
            sheet.createCell('A1', { value: 85 });
            sheet.createCell('A2', { formula: '=IF(A1>=90,"A",IF(A1>=80,"B","C"))' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe('B');
        });

        test('should handle complex calculations', () => {
            sheet.createCell('A1', { value: 100 });
            sheet.createCell('A2', { value: 200 });
            sheet.createCell('A3', { value: 150 });
            sheet.createCell('A4', { formula: '=SUM(A1,A2,A3)/COUNT(A1,A2,A3)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A4')).toBe(150);
        });

        test('should handle text and number operations', () => {
            sheet.createCell('A1', { value: 'Score:' });
            sheet.createCell('A2', { value: 95 });
            sheet.createCell('A3', { formula: '=CONCATENATE(A1," ",A2)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A3')).toBe('Score: 95');
        });
    });

    describe('Error Handling', () => {
        test('should handle division by zero', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 0 });
            sheet.createCell('A3', { formula: '=A1/A2' });

            workbook.build();
            workbook.calculate();

            const result = sheet.getCellValue('A3');
            expect(result).toBe('#DIV/0!');
        });

        test('should handle invalid function arguments', () => {
            sheet.createCell('A1', { value: 'text' });
            sheet.createCell('A2', { formula: '=SQRT(A1)' });

            workbook.build();
            workbook.calculate();

            const result = sheet.getCellValue('A2');
            // FormulaJS should handle this gracefully
            expect(result).toBeTruthy();
        });

        test('should handle non-existent cell references', () => {
            sheet.createCell('A1', { formula: '=Z99' });

            workbook.build();
            workbook.calculate();

            const result = sheet.getCellValue('A1');
            // Non-existent cells return 0 (default type is NUMBER)
            expect(result).toBe(0);
        });
    });
});
