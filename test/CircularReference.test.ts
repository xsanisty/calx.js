import { Calx } from '../src/Calx';

describe('Circular Reference Detection', () => {
    describe('checkCircularReference()', () => {
        test('should throw error if build() is not called first', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { formula: '=B1+1' });

            expect(() => {
                workbook.checkCircularReference();
            }).toThrow('Workbook must be built before checking for circular references');
        });

        test('should not throw error when no circular references exist', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { formula: '=A1+1' });
            sheet.createCell('C1', { formula: '=B1+1' });

            workbook.build();

            expect(() => {
                workbook.checkCircularReference();
            }).not.toThrow();
        });

        test('should detect simple circular reference', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { formula: '=B1+1' });
            sheet.createCell('B1', { formula: '=A1+1' });

            workbook.build();

            expect(() => {
                workbook.checkCircularReference();
            }).toThrow(/Circular reference detected/);
        });

        test('should detect three-cell circular reference', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { formula: '=B1+1' });
            sheet.createCell('B1', { formula: '=C1+1' });
            sheet.createCell('C1', { formula: '=A1+1' });

            workbook.build();

            expect(() => {
                workbook.checkCircularReference();
            }).toThrow(/Circular reference detected.*Sheet1!A1.*Sheet1!B1.*Sheet1!C1.*Sheet1!A1/);
        });

        test('should detect self-referencing cell', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { formula: '=A1+1' });

            workbook.build();

            expect(() => {
                workbook.checkCircularReference();
            }).toThrow(/Circular reference detected.*Sheet1!A1.*Sheet1!A1/);
        });

        test('should detect circular reference in complex dependency graph', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create a diamond pattern with circular ref at the bottom
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { formula: '=A1*2' });
            sheet.createCell('C1', { formula: '=A1*3' });
            sheet.createCell('D1', { formula: '=B1+C1' });
            sheet.createCell('E1', { formula: '=D1+1' });
            sheet.createCell('F1', { formula: '=E1+B1' }); // Circular: F1 -> E1 -> D1 -> B1 -> F1 (if we add it)

            // No circular ref yet
            workbook.build();
            expect(() => {
                workbook.checkCircularReference();
            }).not.toThrow();

            // Now add circular reference
            sheet.getCellDirect('B1').formula = '=F1+A1';
            workbook.build();

            expect(() => {
                workbook.checkCircularReference();
            }).toThrow(/Circular reference detected/);
        });

        test('should detect cross-sheet circular reference', () => {
            const workbook = Calx.createWorkbook();
            const sheet1 = workbook.createSheet('Sheet1');
            const sheet2 = workbook.createSheet('Sheet2');

            // Create cross-sheet circular reference
            sheet1.createCell('A1', { formula: '=#Sheet2!B1+1' });
            sheet2.createCell('B1', { formula: '=#Sheet1!A1+1' });

            workbook.build();

            expect(() => {
                workbook.checkCircularReference();
            }).toThrow(/Circular reference detected/);
        });

        test('should handle multiple independent formulas without false positives', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create independent chains
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { formula: '=A1+1' });
            sheet.createCell('A3', { formula: '=A2+1' });

            sheet.createCell('B1', { value: 20 });
            sheet.createCell('B2', { formula: '=B1*2' });
            sheet.createCell('B3', { formula: '=B2*2' });

            workbook.build();

            expect(() => {
                workbook.checkCircularReference();
            }).not.toThrow();
        });

        test('should work with cells that have no formulas', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });

            workbook.build();

            expect(() => {
                workbook.checkCircularReference();
            }).not.toThrow();
        });
    });
});
