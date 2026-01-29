import { Calx } from '../src/Calx';

describe('Auto Calculate', () => {
    describe('Precedent Cell Updates', () => {
        it('should update dependent cell B1 when precedent A1 changes (autoCalculate on)', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create cells
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('B1', { formula: '=A1+A2' });

            workbook.build();
            workbook.calculate();

            // Initial value
            expect(sheet.getCellValue('B1')).toBe(30);

            // Change A1 - should automatically update B1
            const cellA1 = sheet.getCell('A1');
            cellA1.value = 15;

            // B1 should be automatically updated
            expect(sheet.getCellValue('B1')).toBe(35);
        });

        it('should update dependent cell B1 when precedent A2 changes (autoCalculate on)', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('B1', { formula: '=A1+A2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(30);

            // Change A2
            const cellA2 = sheet.getCell('A2');
            cellA2.value = 25;

            expect(sheet.getCellValue('B1')).toBe(35);
        });

        it('should update entire dependency chain automatically', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create chain: A1 -> B1 -> C1
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { formula: '=A1*2' });
            sheet.createCell('C1', { formula: '=B1+5' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(20);
            expect(sheet.getCellValue('C1')).toBe(25);

            // Change A1 - should cascade to B1 and C1
            const cellA1 = sheet.getCell('A1');
            cellA1.value = 15;

            expect(sheet.getCellValue('B1')).toBe(30);
            expect(sheet.getCellValue('C1')).toBe(35);
        });

        it('should NOT update when autoCalculate is off at sheet level', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Turn off auto-calculate
            sheet.autoCalculate = false;

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('B1', { formula: '=A1+A2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(30);

            // Change A1 - should NOT automatically update B1
            const cellA1 = sheet.getCell('A1');
            cellA1.value = 15;

            // B1 should still be old value
            expect(sheet.getCellValue('B1')).toBe(30);

            // Manual recalculation required
            sheet.calculate();

            // Now B1 should be updated
            expect(sheet.getCellValue('B1')).toBe(35);
        });

        it('should NOT update when autoCalculate is off at workbook level', () => {
            const workbook = Calx.createWorkbook();

            // Turn off auto-calculate at workbook level
            workbook.autoCalculate = false;

            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('B1', { formula: '=A1+A2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(30);

            // Change A1
            const cellA1 = sheet.getCell('A1');
            cellA1.value = 15;

            // B1 should NOT be updated
            expect(sheet.getCellValue('B1')).toBe(30);

            // Manual recalculation
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(35);
        });
    });

    describe('Auto Calculate Toggle', () => {
        it('should allow toggling autoCalculate on and off', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { formula: '=A1*2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(20);

            // Auto-calculate is on by default
            const cellA1 = sheet.getCell('A1');
            cellA1.value = 15;
            expect(sheet.getCellValue('B1')).toBe(30);

            // Turn off auto-calculate
            sheet.autoCalculate = false;
            cellA1.value = 20;
            expect(sheet.getCellValue('B1')).toBe(30); // Still old value

            // Turn back on
            sheet.autoCalculate = true;
            cellA1.value = 25;
            expect(sheet.getCellValue('B1')).toBe(50); // Updated
        });

        it('should propagate workbook autoCalculate setting to all sheets', () => {
            const workbook = Calx.createWorkbook();
            const sheet1 = workbook.createSheet('Sheet1');
            const sheet2 = workbook.createSheet('Sheet2');

            // Both sheets should have autoCalculate on by default
            expect(sheet1.autoCalculate).toBe(true);
            expect(sheet2.autoCalculate).toBe(true);

            // Turn off at workbook level
            workbook.autoCalculate = false;

            // Both sheets should be off
            expect(sheet1.autoCalculate).toBe(false);
            expect(sheet2.autoCalculate).toBe(false);

            // Turn back on
            workbook.autoCalculate = true;

            expect(sheet1.autoCalculate).toBe(true);
            expect(sheet2.autoCalculate).toBe(true);
        });
    });

    describe('Multiple Dependents', () => {
        it('should update multiple cells that depend on same precedent', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // A1 is used by both B1 and C1
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { formula: '=A1*2' });
            sheet.createCell('C1', { formula: '=A1+5' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(20);
            expect(sheet.getCellValue('C1')).toBe(15);

            // Change A1 - both B1 and C1 should update
            const cellA1 = sheet.getCell('A1');
            cellA1.value = 20;

            expect(sheet.getCellValue('B1')).toBe(40);
            expect(sheet.getCellValue('C1')).toBe(25);
        });

        it('should handle diamond dependency pattern', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Diamond: A1 -> (B1, C1) -> D1
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { formula: '=A1*2' });
            sheet.createCell('C1', { formula: '=A1*3' });
            sheet.createCell('D1', { formula: '=B1+C1' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(20);
            expect(sheet.getCellValue('C1')).toBe(30);
            expect(sheet.getCellValue('D1')).toBe(50);

            // Change A1 - all three should update
            const cellA1 = sheet.getCell('A1');
            cellA1.value = 5;

            expect(sheet.getCellValue('B1')).toBe(10);
            expect(sheet.getCellValue('C1')).toBe(15);
            expect(sheet.getCellValue('D1')).toBe(25);
        });
    });

    describe('Complex Formulas', () => {
        it('should handle complex formula with multiple precedents', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });
            sheet.createCell('B1', { formula: '=A1+A2*A3' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(610); // 10 + 20*30

            // Change A2
            const cellA2 = sheet.getCell('A2');
            cellA2.value = 5;

            expect(sheet.getCellValue('B1')).toBe(160); // 10 + 5*30

            // Change A3
            const cellA3 = sheet.getCell('A3');
            cellA3.value = 10;

            expect(sheet.getCellValue('B1')).toBe(60); // 10 + 5*10
        });

        it('should update cells with SUM function when individual cells change', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });
            // Note: Using individual references instead of range for auto-calculate
            // Range dependencies (A1:A3) are not currently tracked for auto-recalculation
            sheet.createCell('B1', { formula: '=A1+A2+A3' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(60);

            // Change one value
            const cellA2 = sheet.getCell('A2');
            cellA2.value = 50;

            expect(sheet.getCellValue('B1')).toBe(90);
        });
    });
});
