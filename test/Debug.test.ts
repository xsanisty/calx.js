import { Calx } from '../src/Calx';
import { CalxInterpreter } from '../src/Calx/Parser/Chevrotain/Interpreter';
import { SharedContext } from '../src/Calx/Parser/SharedContext';
import * as Utility from '../src/Calx/Utility/Utility';

describe('Simple Debug', () => {
    test('parser should work with literals', () => {
        const context = new SharedContext({ utility: Utility });
        const interpreter = new CalxInterpreter();
        interpreter.setContext(context);

        const result = interpreter.parse('=5+3');

        expect(result).toBe(8);
    });

    test('should work with direct value', () => {
        const workbook = Calx.createWorkbook();
        const sheet = workbook.createSheet('Test');

        sheet.createCell('A1', { value: 10 });
        sheet.createCell('A2', { formula: '=A1' });

        workbook.build();
        workbook.calculate();

        expect(sheet.getCellValue('A2')).toBe(10);
    });

    test('should work with simple arithmetic', () => {
        const workbook = Calx.createWorkbook();
        const sheet = workbook.createSheet('Test');

        sheet.createCell('A1', { formula: '=5+3' });

        workbook.build();
        workbook.calculate();

        expect(sheet.getCellValue('A1')).toBe(8);
    });
});
