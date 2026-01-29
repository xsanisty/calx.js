import { Calx } from '../src/Calx';

describe('Debug Auto Calculate', () => {
    it('should debug dependency setup', () => {
        const workbook = Calx.createWorkbook();
        const sheet = workbook.createSheet('Sheet1');

        sheet.createCell('A1', { value: 10 });
        sheet.createCell('A2', { value: 20 });
        sheet.createCell('B1', { formula: '=A1+A2' });

        workbook.build();
        workbook.calculate();

        const cellA1 = sheet.getCell('A1');
        const cellB1 = sheet.getCell('B1');

        console.log('A1 dependents:', Object.keys(cellA1.getDependents()));
        console.log('B1 precedents:', cellB1.getPrecedents() ? Object.keys(cellB1.getPrecedents()) : null);
        console.log('B1 value before:', sheet.getCellValue('B1'));
        console.log('Sheet autoCalculate:', sheet.autoCalculate);

        cellA1.value = 15;

        console.log('A1 dependents after change:', Object.keys(cellA1.getDependents()));
        console.log('B1 value after:', sheet.getCellValue('B1'));
        console.log('B1 is dirty:', (cellB1 as any)._dirty);
        console.log('B1 is calculated:', (cellB1 as any)._calculated);
    });
});
