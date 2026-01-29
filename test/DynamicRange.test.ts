import { Calx } from '../src/Calx';

describe('Dynamic Range Support', () => {
    describe('Full Column References', () => {
        it('should calculate SUM on full column (A:A)', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Fill some values in column A
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });
            sheet.createCell('A5', { value: 50 }); // Note: skipping A4

            // Create formula that references entire column
            sheet.createCell('B1', { formula: '=SUM(A:A)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(110); // 10+20+30+50
        });

        it('should calculate AVERAGE on full column', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });

            sheet.createCell('B1', { formula: '=AVERAGE(A:A)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(20); // (10+20+30)/3
        });

        it('should handle multiple column range (A:C)', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 1 });
            sheet.createCell('B1', { value: 2 });
            sheet.createCell('C1', { value: 3 });
            sheet.createCell('A2', { value: 4 });
            sheet.createCell('B2', { value: 5 });
            sheet.createCell('C2', { value: 6 });

            sheet.createCell('D1', { formula: '=SUM(A:C)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('D1')).toBe(21); // 1+2+3+4+5+6
        });
    });

    describe('Full Row References', () => {
        it('should calculate SUM on full row (1:1)', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Fill some values in row 1
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { value: 20 });
            sheet.createCell('C1', { value: 30 });

            // Create formula that references entire row
            sheet.createCell('A2', { formula: '=SUM(1:1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe(60); // 10+20+30
        });

        it('should calculate AVERAGE on full row', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { value: 20 });
            sheet.createCell('C1', { value: 30 });

            sheet.createCell('A2', { formula: '=AVERAGE(1:1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe(20); // (10+20+30)/3
        });

        it('should handle multiple row range (1:3)', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 1 });
            sheet.createCell('B1', { value: 2 });
            sheet.createCell('A2', { value: 3 });
            sheet.createCell('B2', { value: 4 });
            sheet.createCell('A3', { value: 5 });
            sheet.createCell('B3', { value: 6 });

            sheet.createCell('A4', { formula: '=SUM(1:3)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A4')).toBe(21); // 1+2+3+4+5+6
        });
    });

    describe('Performance', () => {
        it('should handle large column ranges efficiently', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create 100 cells in column A
            for (let i = 1; i <= 100; i++) {
                sheet.createCell(`A${i}`, { value: i });
            }

            sheet.createCell('B1', { formula: '=SUM(A:A)' });

            workbook.build();
            const startTime = Date.now();
            workbook.calculate();
            const endTime = Date.now();

            expect(sheet.getCellValue('B1')).toBe(5050); // Sum of 1 to 100
            expect(endTime - startTime).toBeLessThan(100); // Should be fast
        });
    });
});

