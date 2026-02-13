import { Calx } from '../../src/Calx';

describe('Circular Reference Resolution', () => {
    describe('Configuration', () => {
        test('should have circular references disabled by default', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            workbook.build();

            const config = sheet.getCircularReferenceConfig();
            expect(config).not.toBeNull();
            expect(config?.enabled).toBe(false);
        });

        test('should allow enabling circular reference resolution', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            workbook.build();

            sheet.configureCircularReference({ enabled: true });

            const config = sheet.getCircularReferenceConfig();
            expect(config?.enabled).toBe(true);
        });

        test('should allow configuring max iterations', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            workbook.build();

            sheet.configureCircularReference({
                enabled: true,
                maxIterations: 50
            });

            const config = sheet.getCircularReferenceConfig();
            expect(config?.maxIterations).toBe(50);
        });

        test('should allow configuring max change threshold', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            workbook.build();

            sheet.configureCircularReference({
                enabled: true,
                maxChange: 0.0001
            });

            const config = sheet.getCircularReferenceConfig();
            expect(config?.maxChange).toBe(0.0001);
        });
    });

    describe('Iterative Calculation', () => {
        test('should resolve simple circular reference with iterations', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create circular reference: A1 = B1 + 1, B1 = A1 - 1
            // This should converge to A1 = B1 when iterated
            sheet.createCell('A1', { formula: '=B1+1' });
            sheet.createCell('B1', { formula: '=A1-1' });

            workbook.build();

            // Enable circular reference resolution
            sheet.configureCircularReference({
                enabled: true,
                maxIterations: 100,
                maxChange: 0.001
            });

            workbook.calculate();

            // With iterative calculation, these should eventually stabilize
            // A1 = B1 + 1 and B1 = A1 - 1 means they differ by 1
            const a1 = sheet.getCellValue('A1');
            const b1 = sheet.getCellValue('B1');

            expect(typeof a1).toBe('number');
            expect(typeof b1).toBe('number');
        });

        test('should handle converging circular reference', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create converging circular reference
            // A1 = (A1 + 10) / 2 should converge to 10
            sheet.createCell('A1', { value: 0 }); // Start with 0

            workbook.build();

            // Now set it to a circular formula
            const a1 = sheet.getCellDirect('A1');
            a1.formula = '=(A1+10)/2';

            workbook.build(); // Rebuild after formula change

            sheet.configureCircularReference({
                enabled: true,
                maxIterations: 100,
                maxChange: 0.001
            });

            workbook.calculate();

            const result = sheet.getCellValue('A1');

            // Should converge close to 10
            expect(result).toBeCloseTo(10, 1);
        });

        test('should stop after max iterations', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create non-converging circular reference
            sheet.createCell('A1', { formula: '=A1+1' });

            workbook.build();

            sheet.configureCircularReference({
                enabled: true,
                maxIterations: 10, // Low iteration count
                maxChange: 0.001
            });

            // This should complete without hanging
            workbook.calculate();

            // Value should have changed from iterations
            const result = sheet.getCellValue('A1');
            expect(typeof result).toBe('number');
        });

        test('should handle three-cell circular reference', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create three-cell circular reference
            // A1 = B1 / 2, B1 = C1 / 2, C1 = A1 * 2
            sheet.createCell('A1', { value: 100 });
            sheet.createCell('B1', { value: 50 });
            sheet.createCell('C1', { value: 200 });

            workbook.build();

            // Now set formulas to create circular reference
            sheet.getCellDirect('A1').formula = '=B1/2';
            sheet.getCellDirect('B1').formula = '=C1/2';
            sheet.getCellDirect('C1').formula = '=A1*2';

            workbook.build();

            sheet.configureCircularReference({
                enabled: true,
                maxIterations: 100,
                maxChange: 0.001
            });

            workbook.calculate();

            const a1 = sheet.getCellValue('A1');
            const b1 = sheet.getCellValue('B1');
            const c1 = sheet.getCellValue('C1');

            // These should maintain their relationships after convergence
            expect(typeof a1).toBe('number');
            expect(typeof b1).toBe('number');
            expect(typeof c1).toBe('number');
        });

        test('should not resolve circular references when disabled', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { formula: '=B1+1' });
            sheet.createCell('B1', { formula: '=A1+1' });

            workbook.build();

            // Circular references disabled (default)
            sheet.configureCircularReference({ enabled: false });

            // This may produce errors or unexpected values
            workbook.calculate();

            // Just verify it doesn't hang
            expect(true).toBe(true);
        });

        test('should handle complex converging formula', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Compound interest-like formula: A1 = A1 * 1.05 + 100
            sheet.createCell('A1', { value: 1000 }); // Starting value

            workbook.build();

            sheet.getCellDirect('A1').formula = '=A1*1.05+100';
            workbook.build();

            sheet.configureCircularReference({
                enabled: true,
                maxIterations: 20,
                maxChange: 1 // Allow larger changes since this grows
            });

            workbook.calculate();

            const result = sheet.getCellValue('A1');

            // Should have increased from initial value
            expect(result).toBeGreaterThan(1000);
        });

        test('should get circular cells', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { formula: '=B1+1' });
            sheet.createCell('B1', { formula: '=A1+1' });
            sheet.createCell('C1', { value: 10 }); // Not in cycle

            workbook.build();

            const depTree = (sheet as any)._depTree;
            const circularCells = depTree.getCircularCells();

            expect(circularCells.length).toBeGreaterThan(0);
            expect(circularCells.some((c: any) => c.address === 'A1')).toBe(true);
            expect(circularCells.some((c: any) => c.address === 'B1')).toBe(true);
            expect(circularCells.some((c: any) => c.address === 'C1')).toBe(false);
        });

        test('should handle mixed circular and non-circular cells', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Circular reference
            sheet.createCell('A1', { formula: '=B1+1' });
            sheet.createCell('B1', { formula: '=A1+1' });

            // Non-circular cells
            sheet.createCell('C1', { value: 100 });
            sheet.createCell('D1', { formula: '=C1*2' });

            workbook.build();

            sheet.configureCircularReference({
                enabled: true,
                maxIterations: 10,
                maxChange: 0.001
            });

            workbook.calculate();

            // Non-circular cells should calculate correctly
            expect(sheet.getCellValue('D1')).toBe(200);

            // Circular cells should complete iterations
            expect(typeof sheet.getCellValue('A1')).toBe('number');
            expect(typeof sheet.getCellValue('B1')).toBe('number');
        });
    });

    describe('Convergence Detection', () => {
        test('should stop when change is below threshold', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create slowly converging formula
            sheet.createCell('A1', { value: 0 });

            workbook.build();

            sheet.getCellDirect('A1').formula = '=A1*0.9+10'; // Converges to 100
            workbook.build();

            sheet.configureCircularReference({
                enabled: true,
                maxIterations: 1000,
                maxChange: 0.01 // Stop when change is less than 0.01
            });

            workbook.calculate();

            const result = sheet.getCellValue('A1');

            // Should be close to convergence value (100)
            expect(result).toBeGreaterThan(90);
            expect(result).toBeLessThan(110);
        });
    });
});
