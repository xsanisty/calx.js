import { Calx } from '../src/Calx';

describe('Workbook.exportJSON()', () => {
    it('should export empty workbook', () => {
        const workbook = Calx.createWorkbook();
        workbook.createSheet('Sheet1');

        const data = workbook.exportJSON();

        expect(data).toHaveProperty('sheets');
        expect(data.sheets).toHaveProperty('Sheet1');
        expect(data.sheets.Sheet1.cells).toEqual({});
    });

    it('should export workbook with values', () => {
        const workbook = Calx.createWorkbook();
        const sheet = workbook.createSheet('Sheet1');

        sheet.createCell('A1', { value: 10 });
        sheet.createCell('A2', { value: 20 });
        sheet.createCell('B1', { value: 'Hello' });

        const data = workbook.exportJSON();

        expect(data.sheets.Sheet1.cells.A1.value).toBe(10);
        expect(data.sheets.Sheet1.cells.A2.value).toBe(20);
        expect(data.sheets.Sheet1.cells.B1.value).toBe('Hello');
    });

    it('should export workbook with formulas', () => {
        const workbook = Calx.createWorkbook();
        const sheet = workbook.createSheet('Sheet1');

        sheet.createCell('A1', { value: 10 });
        sheet.createCell('A2', { value: 20 });
        sheet.createCell('A3', { formula: '=A1+A2' });

        const data = workbook.exportJSON();

        expect(data.sheets.Sheet1.cells.A1.value).toBe(10);
        expect(data.sheets.Sheet1.cells.A2.value).toBe(20);
        expect(data.sheets.Sheet1.cells.A3.formula).toBe('=A1+A2');
    });

    it('should export and reload workbook correctly', () => {
        // Create original workbook
        const workbook1 = Calx.createWorkbook();
        const sheet1 = workbook1.createSheet('Sheet1');

        sheet1.createCell('A1', { value: 10 });
        sheet1.createCell('A2', { value: 20 });
        sheet1.createCell('A3', { formula: '=A1+A2' });
        sheet1.createCell('B1', { formula: '=A1*2' });

        workbook1.build();
        workbook1.calculate();

        // Export to JSON
        const data = workbook1.exportJSON();

        // Create new workbook from exported data
        const workbook2 = Calx.createWorkbookFromData(data);
        const sheet2 = workbook2.getSheet('Sheet1') as any;

        workbook2.build();
        workbook2.calculate();

        // Verify values match
        expect(sheet2.getCellValue('A1')).toBe(10);
        expect(sheet2.getCellValue('A2')).toBe(20);
        expect(sheet2.getCellValue('A3')).toBe(30);
        expect(sheet2.getCellValue('B1')).toBe(20);

        // Verify formulas match
        expect(sheet2.getCell('A3').formula).toBe('=A1+A2');
        expect(sheet2.getCell('B1').formula).toBe('=A1*2');
    });

    it('should export multiple sheets', () => {
        const workbook = Calx.createWorkbook();
        const sheet1 = workbook.createSheet('Sheet1');
        const sheet2 = workbook.createSheet('Sheet2');

        sheet1.createCell('A1', { value: 10 });
        sheet2.createCell('A1', { value: 20 });

        const data = workbook.exportJSON();

        expect(data.sheets.Sheet1.cells.A1.value).toBe(10);
        expect(data.sheets.Sheet2.cells.A1.value).toBe(20);
    });

    it('should use Calx.exportJSON static method', () => {
        const workbook = Calx.createWorkbook();
        const sheet = workbook.createSheet('Sheet1');

        sheet.createCell('A1', { value: 42 });

        const data = Calx.exportJSON(workbook);

        expect(data.sheets.Sheet1.cells.A1.value).toBe(42);
    });

    it('should handle complex scenario with formulas and dependencies', () => {
        const workbook1 = Calx.createWorkbook();
        const sheet1 = workbook1.createSheet('Sales');

        sheet1.createCell('A1', { value: 100 });
        sheet1.createCell('A2', { value: 200 });
        sheet1.createCell('A3', { value: 150 });
        sheet1.createCell('A4', { formula: '=SUM(A1:A3)' });
        sheet1.createCell('B1', { formula: '=A1*0.1' });
        sheet1.createCell('B2', { formula: '=A2*0.1' });
        sheet1.createCell('B3', { formula: '=A3*0.1' });
        sheet1.createCell('B4', { formula: '=SUM(B1:B3)' });

        workbook1.build();
        workbook1.calculate();

        const originalTotal = sheet1.getCellValue('A4');
        const originalTax = sheet1.getCellValue('B4');

        // Export and reload
        const data = workbook1.exportJSON();
        const workbook2 = Calx.createWorkbookFromData(data);
        const sheet2 = workbook2.getSheet('Sales') as any;

        workbook2.build();
        workbook2.calculate();

        // Verify calculations match
        expect(sheet2.getCellValue('A4')).toBe(originalTotal);
        expect(sheet2.getCellValue('B4')).toBe(originalTax);
        expect(sheet2.getCellValue('A4')).toBe(450);
        expect(sheet2.getCellValue('B4')).toBe(45);
    });
});
