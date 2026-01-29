import { Calx } from '../src/Calx';
import { DataType } from '../src/Calx/Cell/DataType';

describe('Integration Tests', () => {
    describe('Simple Calculations', () => {
        test('should perform basic arithmetic', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { formula: '=A1+A2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A3')).toBe(30);
        });

        test('should handle formula chains', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 5 });
            sheet.createCell('A2', { formula: '=A1*2' });
            sheet.createCell('A3', { formula: '=A2+10' });
            sheet.createCell('A4', { formula: '=A3-5' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe(10);
            expect(sheet.getCellValue('A3')).toBe(20);
            expect(sheet.getCellValue('A4')).toBe(15);
        });
    });

    describe('Range Operations', () => {
        test('should work with single cell ranges', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 100 });
            const range = sheet.getRange('A1');

            expect(range.value).toBe(100);

            range.value = 200;
            expect(sheet.getCellValue('A1')).toBe(200);
        });

        test('should work with multi-cell ranges', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 1 });
            sheet.createCell('B1', { value: 2 });
            sheet.createCell('A2', { value: 3 });
            sheet.createCell('B2', { value: 4 });

            const range = sheet.getRange('A1:B2');

            expect(range.count).toBe(4);
            expect(range.toArray()).toEqual([1, 2, 3, 4]);
        });

        test('should set values to range', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 0 });
            sheet.createCell('B1', { value: 0 });

            const range = sheet.getRange('A1:B1');
            range.setValues([[10, 20]]);

            expect(sheet.getCellValue('A1')).toBe(10);
            expect(sheet.getCellValue('B1')).toBe(20);
        });
    });

    describe('Dynamic Recalculation', () => {
        test('should recalculate when cell value changes', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { formula: '=A1*2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe(20);

            // Change A1
            sheet.getCellDirect('A1').value = 15;
            sheet.requestCalculate('A1');
            sheet.calculate();

            expect(sheet.getCellValue('A2')).toBe(30);
        });

        test('should recalculate dependent chain', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 5 });
            sheet.createCell('A2', { formula: '=A1*2' });
            sheet.createCell('A3', { formula: '=A2+10' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A3')).toBe(20);

            // Change A1
            sheet.getCellDirect('A1').value = 10;
            sheet.requestCalculate('A1');
            sheet.calculate();

            expect(sheet.getCellValue('A2')).toBe(20);
            expect(sheet.getCellValue('A3')).toBe(30);
        });
    });

    describe('Multi-Sheet Operations', () => {
        test('should handle multiple sheets', () => {
            const workbook = Calx.createWorkbook();
            const sheet1 = workbook.createSheet('Sales');
            const sheet2 = workbook.createSheet('Expenses');

            sheet1.createCell('A1', { value: 1000 });
            sheet2.createCell('A1', { value: 300 });

            workbook.build();
            workbook.calculate();

            expect(sheet1.getCellValue('A1')).toBe(1000);
            expect(sheet2.getCellValue('A1')).toBe(300);
        });
    });

    describe('Complex Formulas', () => {
        test('should handle nested functions', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });
            sheet.createCell('A4', { formula: '=IF(SUM(A1,A2,A3)>50,"High","Low")' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A4')).toBe('High');
        });

        test('should handle complex arithmetic', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 100 });
            sheet.createCell('A2', { formula: '=(A1*1.2)+50-10' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe(160);
        });
    });

    describe('Data-Driven Workbook', () => {
        test('should create workbook from data', () => {
            const workbook = Calx.createWorkbookFromData({
                sheets: {
                    'Budget': {
                        cells: {
                            'A1': { value: 'Income', type: DataType.TEXT },
                            'B1': { value: 5000, type: DataType.NUMBER },
                            'A2': { value: 'Expenses', type: DataType.TEXT },
                            'B2': { value: 3000, type: DataType.NUMBER },
                            'A3': { value: 'Net', type: DataType.TEXT },
                            'B3': { formula: '=B1-B2', type: DataType.NUMBER }
                        },
                        variables: {}
                    }
                }
            });

            workbook.build();
            workbook.calculate();

            const sheet = workbook.getSheet('Budget');
            if (sheet) {
                expect(sheet.getCellValue('B3')).toBe(2000);
            }
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty formulas', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: null });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellDirect('A1').isEmpty()).toBe(true);
        });

        test('should handle circular references gracefully', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // This would create a circular reference
            // A1 = A2, A2 = A1
            // For now, just ensure it doesn't crash
            sheet.createCell('A1', { formula: '=A2' });
            sheet.createCell('A2', { formula: '=A1' });

            expect(() => {
                workbook.build();
            }).not.toThrow();
        });
    });

    describe('Performance Tests', () => {
        test('should handle large number of cells', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create 1000 cells
            for (let i = 1; i <= 1000; i++) {
                sheet.createCell(`A${i}`, { value: i });
            }

            workbook.build();

            expect(() => {
                workbook.calculate();
            }).not.toThrow();
        });

        test('should handle complex dependency chains', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 1 });

            // Create chain: A2=A1+1, A3=A2+1, ..., A100=A99+1
            for (let i = 2; i <= 100; i++) {
                sheet.createCell(`A${i}`, { formula: `=A${i-1}+1` });
            }

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A100')).toBe(100);
        });
    });
});
