import { Calx } from '../src/Calx';

describe('Sheet', () => {
    let workbook: any;
    let sheet: any;

    beforeEach(() => {
        workbook = Calx.createWorkbook();
        sheet = workbook.createSheet('TestSheet');
    });

    describe('Sheet Creation', () => {
        test('should create sheet with name', () => {
            expect(sheet).toBeDefined();
            expect(sheet.name).toBe('TestSheet');
        });

        test('should have unique id', () => {
            const sheet2 = workbook.createSheet('Sheet2');

            expect(sheet.id).toBeDefined();
            expect(sheet2.id).toBeDefined();
            expect(sheet.id).not.toBe(sheet2.id);
        });
    });

    describe('Cell Operations', () => {
        test('should create cell', () => {
            const cell = sheet.createCell('A1', { value: 100 });

            expect(cell).toBeDefined();
            expect(cell.value).toBe(100);
        });

        test('should get cell value', () => {
            sheet.createCell('A1', { value: 100 });

            const value = sheet.getCellValue('A1');

            expect(value).toBe(100);
        });

        test('should get range', () => {
            sheet.createCell('A1', { value: 100 });
            const range = sheet.getRange('A1');

            expect(range).toBeDefined();
            expect(range.value).toBe(100);
        });
    });

    describe('Calculation', () => {
        test('should calculate sheet', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { formula: '=A1*2' });

            workbook.build();
            sheet.calculate();

            expect(sheet.getCellValue('A2')).toBe(20);
        });

        test('should request calculate for specific cell', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { formula: '=A1*2' });

            workbook.build();
            sheet.requestCalculate('A2');

            expect(sheet.getCellValue('A2')).toBe(20);
        });

        test('should handle complex dependency chain', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { formula: '=A1*2' });
            sheet.createCell('A3', { formula: '=A2+5' });
            sheet.createCell('A4', { formula: '=A3-3' });

            workbook.build();
            sheet.calculate();

            expect(sheet.getCellValue('A2')).toBe(20);
            expect(sheet.getCellValue('A3')).toBe(25);
            expect(sheet.getCellValue('A4')).toBe(22);
        });
    });

    describe('Formula Evaluation', () => {
        test('should evaluate formula directly', () => {
            sheet.createCell('A1', { value: 10 });

            const result = sheet.eval('=A1*3');

            expect(result).toBe(30);
        });

        test('should evaluate complex formula', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });

            const result = sheet.eval('=(A1+A2)*2');

            expect(result).toBe(60);
        });
    });

    describe('Variables', () => {
        test('should set and get variable', () => {
            sheet.setVariable('TAX_RATE', 0.08);

            const value = sheet.getVariable('TAX_RATE');

            expect(value).toBe(0.08);
        });

        test('should return error for undefined variable', () => {
            const value = sheet.getVariable('UNDEFINED');

            expect(value).toContain('#NAME');
        });
    });

    describe('Dependency Tree', () => {
        test('should build dependency tree', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { formula: '=A1*2' });

            expect(() => {
                sheet.buildDependencyTree();
            }).not.toThrow();
        });
    });
});
