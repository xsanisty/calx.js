import { Calx } from '../src/Calx';

describe('Debug 2D Array', () => {
    it('should debug 2D array constant', () => {
        const workbook = Calx.createWorkbook();
        const sheet = workbook.createSheet('Test');

        sheet.createCell('A1', { formula: '={1,2,3;4,5,6}' });

        workbook.build();
        workbook.calculate();

        // Check all cells
        console.log('A1:', sheet.getCellValue('A1'));
        console.log('B1:', sheet.getCellValue('B1'));
        console.log('C1:', sheet.getCellValue('C1'));
        console.log('A2:', sheet.getCellValue('A2'));
        console.log('B2:', sheet.getCellValue('B2'));
        console.log('C2:', sheet.getCellValue('C2'));

        // Check if B1 cell exists
        const cellB1 = sheet.getCell('B1');
        console.log('Cell B1 exists:', cellB1 !== null);
        console.log('Cell B1 value:', cellB1?.value);

        // Check A1's spillRange
        const cellA1 = sheet.getCell('A1');
        console.log('A1 spillRange:', (cellA1 as any)._spillRange);
        console.log('A1 arrayResult:', (cellA1 as any)._arrayResult);
    });
});
