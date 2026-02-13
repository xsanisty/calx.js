import { Calx } from '../src/Calx';

describe('IF Debug', () => {
    test('debug array IF', () => {
        const workbook = Calx.createWorkbook();
        const sheet = workbook.createSheet('Test');

        sheet.createCell('B1', { formula: '=IF({TRUE,TRUE,TRUE}, "High", 1/0)' });

        workbook.build();
        workbook.calculate();

        console.log('B1:', sheet.getCellValue('B1'));
        console.log('C1:', sheet.getCellValue('C1'));
        console.log('D1:', sheet.getCellValue('D1'));
    });
});
