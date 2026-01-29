import { Calx } from '../src/Calx';
import { DataType } from '../src/Calx/Cell/DataType';

describe('Cell', () => {
    let workbook: any;
    let sheet: any;

    beforeEach(() => {
        workbook = Calx.createWorkbook();
        sheet = workbook.createSheet('TestSheet');
    });

    describe('Cell Creation', () => {
        test('should create cell with value', () => {
            sheet.createCell('A1', { value: 100, type: DataType.NUMBER });
            const cell = sheet.getCellDirect('A1');

            expect(cell).toBeDefined();
            expect(cell.value).toBe(100);
            expect(cell.address).toBe('A1');
        });

        test('should create cell with formula', () => {
            sheet.createCell('A1', { formula: '=1+1', type: DataType.NUMBER });
            const cell = sheet.getCellDirect('A1');

            expect(cell.formula).toBe('=1+1');
        });

        test('should create cells of different types', () => {
            sheet.createCell('A1', { value: 100, type: DataType.NUMBER });
            sheet.createCell('A2', { value: 'Hello', type: DataType.TEXT });
            sheet.createCell('A3', { value: true, type: DataType.BOOLEAN });

            expect(sheet.getCellDirect('A1').value).toBe(100);
            expect(sheet.getCellDirect('A2').value).toBe('Hello');
            expect(sheet.getCellDirect('A3').value).toBe(true);
        });
    });

    describe('Cell Values', () => {
        test('should get and set value', () => {
            sheet.createCell('A1', { value: 100 });
            const cell = sheet.getCellDirect('A1');

            expect(cell.value).toBe(100);

            cell.value = 200;
            expect(cell.value).toBe(200);
        });

        test('should handle empty cells', () => {
            sheet.createCell('A1', { value: null });
            const cell = sheet.getCellDirect('A1');

            expect(cell.isEmpty()).toBe(true);
        });

        test('should check if cell is numeric', () => {
            sheet.createCell('A1', { value: 100 });
            sheet.createCell('A2', { value: 'Hello' });

            expect(sheet.getCellDirect('A1').isNumeric()).toBe(true);
            expect(sheet.getCellDirect('A2').isNumeric()).toBe(false);
        });
    });

    describe('Cell Formulas', () => {
        test('should calculate simple formula', () => {
            sheet.createCell('A1', { formula: '=1+1' });

            workbook.build();
            sheet.calculate();

            expect(sheet.getCellDirect('A1').value).toBe(2);
        });

        test('should calculate formula with cell reference', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { formula: '=A1*2' });

            workbook.build();
            sheet.calculate();

            expect(sheet.getCellDirect('A2').value).toBe(20);
        });

        test('should handle formula errors', () => {
            sheet.createCell('A1', { formula: '=1/0' });

            workbook.build();
            sheet.calculate();

            expect(sheet.getCellDirect('A1').value).toContain('DIV');
        });
    });

    describe('Cell State', () => {
        test('should track if cell is calculated', () => {
            sheet.createCell('A1', { formula: '=1+1' });
            const cell = sheet.getCellDirect('A1');

            expect(cell.isCalculated()).toBe(false);

            cell.calculate();

            expect(cell.isCalculated()).toBe(true);
        });

        test('should mark cell as dirty', () => {
            sheet.createCell('A1', { value: 100 });
            const cell = sheet.getCellDirect('A1');

            expect(cell.isDirty()).toBe(false);

            cell.markAsDirty();

            expect(cell.isDirty()).toBe(true);
        });
    });

    describe('Cell Dependencies', () => {
        test('should track precedents', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { formula: '=A1*2' });

            workbook.build();

            const cell = sheet.getCellDirect('A2');
            const precedents = cell.getPrecedents();

            expect(precedents).toBeDefined();
        });

        test('should track dependents', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { formula: '=A1*2' });

            workbook.build();

            const cell = sheet.getCellDirect('A1');
            const dependents = cell.getDependents();

            expect(dependents).toBeDefined();
        });
    });
});
