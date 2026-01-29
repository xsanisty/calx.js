import { describe, test, expect } from '@jest/globals';
import { Calx } from '../src/Calx';

describe('Debug Arithmetic', () => {
    test('should debug complex arithmetic', () => {
        const workbook = Calx.createWorkbook();
        const sheet = workbook.createSheet('Sheet1');

        sheet.createCell('A1', { value: 100 });
        sheet.createCell('A2', { formula: '=(A1*1.2)+50-10' });

        workbook.build();
        workbook.calculate();

        console.log('A1:', sheet.getCellValue('A1'));
        console.log('A2:', sheet.getCellValue('A2'));
        console.log('Expected: 160, got:', sheet.getCellValue('A2'));

        // Test individual parts
        const test1 = sheet.eval('=A1*1.2');
        console.log('A1*1.2:', test1);

        const test2 = sheet.eval('=(A1*1.2)+50');
        console.log('(A1*1.2)+50:', test2);

        const test3 = sheet.eval('=(A1*1.2)+50-10');
        console.log('(A1*1.2)+50-10:', test3);

        const test4 = sheet.eval('=120+50-10');
        console.log('120+50-10:', test4);

        // Test without parentheses
        const test5 = sheet.eval('=100*1.2+50-10');
        console.log('100*1.2+50-10:', test5);

        // Test simpler cases
        const test6 = sheet.eval('=50-10');
        console.log('50-10:', test6);

        const test7 = sheet.eval('=120+50');
        console.log('120+50:', test7);

        const test8 = sheet.eval('=170-10');
        console.log('170-10:', test8);
    });
});
