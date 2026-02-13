import { Calx } from '../../src/Calx';

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

            // Should mark cells as circular, not throw
            expect(workbook.isInCircularReference(sheet.getCellDirect('A1'), 'Sheet1')).toBe(true);
            expect(workbook.isInCircularReference(sheet.getCellDirect('B1'), 'Sheet1')).toBe(true);
        });

        test('should detect three-cell circular reference', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { formula: '=B1+1' });
            sheet.createCell('B1', { formula: '=C1+1' });
            sheet.createCell('C1', { formula: '=A1+1' });

            workbook.build();

            // All three cells should be marked as circular
            expect(workbook.isInCircularReference(sheet.getCellDirect('A1'), 'Sheet1')).toBe(true);
            expect(workbook.isInCircularReference(sheet.getCellDirect('B1'), 'Sheet1')).toBe(true);
            expect(workbook.isInCircularReference(sheet.getCellDirect('C1'), 'Sheet1')).toBe(true);
        });

        test('should detect self-referencing cell', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { formula: '=A1+1' });

            workbook.build();

            // Self-referencing cell should be marked as circular
            expect(workbook.isInCircularReference(sheet.getCellDirect('A1'), 'Sheet1')).toBe(true);
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
            sheet.createCell('F1', { formula: '=E1+B1' });

            // No circular ref yet
            workbook.build();
            expect(workbook.isInCircularReference(sheet.getCellDirect('B1'), 'Sheet1')).toBe(false);
            expect(workbook.isInCircularReference(sheet.getCellDirect('F1'), 'Sheet1')).toBe(false);

            // Now add circular reference
            sheet.getCellDirect('B1').formula = '=F1+A1';
            workbook.build();

            // B1 and F1 should now be in a circular reference
            expect(workbook.isInCircularReference(sheet.getCellDirect('B1'), 'Sheet1')).toBe(true);
            expect(workbook.isInCircularReference(sheet.getCellDirect('F1'), 'Sheet1')).toBe(true);
        });

        test('should detect cross-sheet circular reference', () => {
            const workbook = Calx.createWorkbook();
            const sheet1 = workbook.createSheet('Sheet1');
            const sheet2 = workbook.createSheet('Sheet2');

            // Create cross-sheet circular reference
            sheet1.createCell('A1', { formula: '=#Sheet2!B1+1' });
            sheet2.createCell('B1', { formula: '=#Sheet1!A1+1' });

            workbook.build();

            // Both cells should be marked as circular
            expect(workbook.isInCircularReference(sheet1.getCellDirect('A1'), 'Sheet1')).toBe(true);
            expect(workbook.isInCircularReference(sheet2.getCellDirect('B1'), 'Sheet2')).toBe(true);
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

            // None should be circular
            expect(workbook.isInCircularReference(sheet.getCellDirect('A1'), 'Sheet1')).toBe(false);
            expect(workbook.isInCircularReference(sheet.getCellDirect('A2'), 'Sheet1')).toBe(false);
            expect(workbook.isInCircularReference(sheet.getCellDirect('A3'), 'Sheet1')).toBe(false);
            expect(workbook.isInCircularReference(sheet.getCellDirect('B1'), 'Sheet1')).toBe(false);
            expect(workbook.isInCircularReference(sheet.getCellDirect('B2'), 'Sheet1')).toBe(false);
            expect(workbook.isInCircularReference(sheet.getCellDirect('B3'), 'Sheet1')).toBe(false);
        });

        test('should work with cells that have no formulas', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });

            workbook.build();

            // Value-only cells should not be marked as circular
            expect(workbook.isInCircularReference(sheet.getCellDirect('A1'), 'Sheet1')).toBe(false);
            expect(workbook.isInCircularReference(sheet.getCellDirect('A2'), 'Sheet1')).toBe(false);
            expect(workbook.isInCircularReference(sheet.getCellDirect('A3'), 'Sheet1')).toBe(false);
        });
    });

    describe('DependencyTree.checkCircularReference()', () => {
        test('should detect direct circular reference (A1 -> B1 -> A1)', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { formula: '=B1+1' });
            sheet.createCell('B1', { formula: '=A1+1' });

            workbook.build();

            const hasCircular = (sheet as any)._depTree.checkCircularReference();
            expect(hasCircular).toBe(true);
        });

        test('should detect indirect circular reference (A1 -> B1 -> C1 -> A1)', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { formula: '=B1+1' });
            sheet.createCell('B1', { formula: '=C1+1' });
            sheet.createCell('C1', { formula: '=A1+1' });

            workbook.build();

            const hasCircular = (sheet as any)._depTree.checkCircularReference();
            expect(hasCircular).toBe(true);
        });

        test('should detect longer circular reference chain', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { formula: '=B1+1' });
            sheet.createCell('B1', { formula: '=C1+1' });
            sheet.createCell('C1', { formula: '=D1+1' });
            sheet.createCell('D1', { formula: '=E1+1' });
            sheet.createCell('E1', { formula: '=A1+1' });

            workbook.build();

            const hasCircular = (sheet as any)._depTree.checkCircularReference();
            expect(hasCircular).toBe(true);
        });

        test('should detect self-reference (A1 -> A1)', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { formula: '=A1+1' });

            workbook.build();

            const hasCircular = (sheet as any)._depTree.checkCircularReference();
            expect(hasCircular).toBe(true);
        });

        test('should return false for linear chain without cycles', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { formula: '=A1*2' });
            sheet.createCell('C1', { formula: '=B1+5' });
            sheet.createCell('D1', { formula: '=C1^2' });

            workbook.build();

            const hasCircular = (sheet as any)._depTree.checkCircularReference();
            expect(hasCircular).toBe(false);
        });

        test('should return false for diamond structure without cycles', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Diamond structure (no cycle):
            //     A1
            //    /  \
            //   B1  B2
            //    \  /
            //     C1
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { formula: '=A1*2' });
            sheet.createCell('B2', { formula: '=A1*3' });
            sheet.createCell('C1', { formula: '=B1+B2' });

            workbook.build();

            const hasCircular = (sheet as any)._depTree.checkCircularReference();
            expect(hasCircular).toBe(false);
        });

        test('should return false with multiple independent chains', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Two independent chains (no cycles)
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { formula: '=A1*2' });
            sheet.createCell('C1', { formula: '=B1+5' });

            sheet.createCell('D1', { value: 20 });
            sheet.createCell('E1', { formula: '=D1*3' });
            sheet.createCell('F1', { formula: '=E1+10' });

            workbook.build();

            const hasCircular = (sheet as any)._depTree.checkCircularReference();
            expect(hasCircular).toBe(false);
        });

        test('should detect circular reference in complex graph with one cycle', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Complex graph with one cycle at the end
            sheet.createCell('A1', { formula: '=B1+1' });
            sheet.createCell('B1', { formula: '=C1+1' });
            sheet.createCell('C1', { formula: '=D1+1' });
            sheet.createCell('D1', { formula: '=A1+1' });

            workbook.build();

            const hasCircular = (sheet as any)._depTree.checkCircularReference();
            expect(hasCircular).toBe(true);
        });

        test('should return false for empty workbook', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            workbook.build();

            const hasCircular = (sheet as any)._depTree.checkCircularReference();
            expect(hasCircular).toBe(false);
        });

        test('should return false with only value cells', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { value: 20 });
            sheet.createCell('C1', { value: 30 });

            workbook.build();

            const hasCircular = (sheet as any)._depTree.checkCircularReference();
            expect(hasCircular).toBe(false);
        });

        test('should detect circular reference with multi-cell references', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create cells in order to avoid auto-creation conflicts
            sheet.createCell('C1', { value: 5 });
            sheet.createCell('D1', { formula: '=A1*2' });
            sheet.createCell('B1', { formula: '=C1+D1' });
            sheet.createCell('A1', { formula: '=B1+C1' });

            workbook.build();

            const hasCircular = (sheet as any)._depTree.checkCircularReference();
            expect(hasCircular).toBe(true);
        });

        test('should handle deep nested dependencies correctly', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create deep chain without cycle
            for (let i = 1; i <= 10; i++) {
                if (i === 1) {
                    sheet.createCell(`A${i}`, { value: i });
                } else {
                    sheet.createCell(`A${i}`, { formula: `=A${i-1}+1` });
                }
            }

            workbook.build();

            const hasCircular = (sheet as any)._depTree.checkCircularReference();
            expect(hasCircular).toBe(false);
        });
    });
});
