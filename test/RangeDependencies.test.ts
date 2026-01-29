import { Calx } from '../src/Calx';

describe('Range Dependencies', () => {
    describe('Cell Range Dependencies', () => {
        it('should track dependencies for SUM with cell range (A1:A3)', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });
            sheet.createCell('B1', { formula: '=SUM(A1:A3)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(60);

            // Change A2 - should automatically update B1 because A2 is in the A1:A3 range
            const cellA2 = sheet.getCell('A2');
            cellA2.value = 50;

            expect(sheet.getCellValue('B1')).toBe(90); // 10 + 50 + 30
        });

        it('should track dependencies for AVERAGE with cell range', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });
            sheet.createCell('B1', { formula: '=AVERAGE(A1:A3)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(20);

            const cellA1 = sheet.getCell('A1');
            cellA1.value = 40;

            expect(sheet.getCellValue('B1')).toBe(30); // (40 + 20 + 30) / 3
        });

        it('should track dependencies for 2D cell ranges', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 1 });
            sheet.createCell('A2', { value: 2 });
            sheet.createCell('B1', { value: 3 });
            sheet.createCell('B2', { value: 4 });
            sheet.createCell('C1', { formula: '=SUM(A1:B2)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe(10); // 1+2+3+4

            // Change B2
            const cellB2 = sheet.getCell('B2');
            cellB2.value = 10;

            expect(sheet.getCellValue('C1')).toBe(16); // 1+2+3+10
        });

        it('should handle multiple cells in range changing', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });
            sheet.createCell('B1', { formula: '=SUM(A1:A3)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(60);

            // Change multiple cells
            sheet.getCell('A1').value = 5;
            expect(sheet.getCellValue('B1')).toBe(55);

            sheet.getCell('A3').value = 15;
            expect(sheet.getCellValue('B1')).toBe(40);
        });
    });

    describe('Complex Range Formulas', () => {
        it('should handle formulas with multiple ranges', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('B1', { value: 5 });
            sheet.createCell('B2', { value: 15 });
            sheet.createCell('C1', { formula: '=SUM(A1:A2)+SUM(B1:B2)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe(50); // (10+20) + (5+15)

            sheet.getCell('A2').value = 30;
            expect(sheet.getCellValue('C1')).toBe(60); // (10+30) + (5+15)

            sheet.getCell('B1').value = 10;
            expect(sheet.getCellValue('C1')).toBe(65); // (10+30) + (10+15)
        });

        it('should handle ranges in arithmetic operations', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('B1', { formula: '=SUM(A1:A2)*2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(60); // (10+20)*2

            sheet.getCell('A1').value = 15;
            expect(sheet.getCellValue('B1')).toBe(70); // (15+20)*2
        });
    });

    describe('Dependency Detection', () => {
        it('should properly detect all cells in range as precedents', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });
            sheet.createCell('B1', { formula: '=SUM(A1:A3)' });

            workbook.build();

            const cellB1 = sheet.getCell('B1');
            const precedents = cellB1.getPrecedents();

            // B1 should have A1, A2, and A3 as precedents
            expect(precedents).not.toBeNull();
            expect(Object.keys(precedents!).length).toBe(3);
            expect(precedents!['A1']).toBeDefined();
            expect(precedents!['A2']).toBeDefined();
            expect(precedents!['A3']).toBeDefined();
        });

        it('should set dependent relationship from range cells to formula cell', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('B1', { formula: '=SUM(A1:A2)' });

            workbook.build();

            // A1 should have B1 as a dependent
            const cellA1 = sheet.getCell('A1');
            const dependents = cellA1.getDependents();
            expect(dependents['B1']).toBeDefined();
            expect(dependents['B1'].address).toBe('B1');

            // A2 should also have B1 as a dependent
            const cellA2 = sheet.getCell('A2');
            const dependentsA2 = cellA2.getDependents();
            expect(dependentsA2['B1']).toBeDefined();
        });
    });
});
