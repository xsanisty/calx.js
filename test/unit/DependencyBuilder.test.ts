import { Calx } from '../../src/Calx';

describe('DependencyBuilder', () => {
    describe('Function Detection', () => {
        test('should detect functions by pattern (name followed by parenthesis)', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create cells that use various functions
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });

            // SUM is a function, should not be treated as a cell reference
            sheet.createCell('B1', { formula: '=SUM(A1:A3)' });

            // MAX is a function
            sheet.createCell('B2', { formula: '=MAX(A1, A2, A3)' });

            // Custom user-defined function (if supported)
            // sheet.createCell('B3', { formula: '=CUSTOM_FUNC(A1)' }); // Commented out - custom functions not yet supported

            workbook.build();
            workbook.calculate();

            // These should calculate correctly if functions are detected properly
            expect(sheet.getCellValue('B1')).toBe(60);
            expect(sheet.getCellValue('B2')).toBe(30);
        });

        test('should not confuse cell addresses with function names', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create cells including one that could be confused for a function
            sheet.createCell('SUM1', { value: 100 }); // Cell named SUM1
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });

            // Reference to cell SUM1 (not function SUM)
            sheet.createCell('B1', { formula: '=SUM1+A1' });

            // Actual SUM function
            sheet.createCell('B2', { formula: '=SUM(A1:A2)' });

            workbook.build();

            // Check that precedents are set correctly
            const b1Cell = sheet.getCellDirect('B1');
            const precedents = b1Cell.getPrecedents();

            // B1 should have SUM1 and A1 as precedents (not SUM function)
            expect(precedents).toBeDefined();
            expect(Object.keys(precedents)).toContain('SUM1');
            expect(Object.keys(precedents)).toContain('A1');
            expect(Object.keys(precedents).length).toBe(2);
        });

        test('should handle keywords (TRUE, FALSE, NULL) correctly', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { formula: '=IF(TRUE, 1, 0)' });
            sheet.createCell('A2', { formula: '=IF(FALSE, 1, 0)' });

            workbook.build();

            // Check that TRUE/FALSE are not added as cell dependencies
            const a1Cell = sheet.getCellDirect('A1');
            const precedents = a1Cell.getPrecedents();

            // Should have no precedents (TRUE is a keyword, not a cell)
            expect(precedents).toBeDefined();
            expect(Object.keys(precedents).length).toBe(0);
        });

        test('should detect any function by parenthesis pattern', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 5 });
            sheet.createCell('A2', { value: 10 });

            // Even unknown functions should be detected by pattern
            sheet.createCell('B1', { formula: '=UNKNOWN_FUNCTION(A1, A2)' });
            sheet.createCell('B2', { formula: '=ANOTHER_FUNC(A1)' });
            sheet.createCell('B3', { formula: '=YET_ANOTHER(A1, A2)' });

            workbook.build();

            // Check that function names are not treated as cell dependencies
            const b1Cell = sheet.getCellDirect('B1');
            const precedents = b1Cell.getPrecedents();

            // Should only have A1 and A2 as precedents, not UNKNOWN_FUNCTION
            expect(precedents).toBeDefined();
            expect(Object.keys(precedents)).toContain('A1');
            expect(Object.keys(precedents)).toContain('A2');
            expect(Object.keys(precedents).length).toBe(2);
        });

        test('should work with nested functions', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 5 });
            sheet.createCell('A2', { value: 10 });
            sheet.createCell('A3', { value: 15 });

            // Nested functions: SUM(MAX(A1, A2), A3)
            sheet.createCell('B1', { formula: '=SUM(MAX(A1, A2), A3)' });

            workbook.build();

            const b1Cell = sheet.getCellDirect('B1');
            const precedents = b1Cell.getPrecedents();

            // Should have A1, A2, A3 as precedents
            expect(precedents).toBeDefined();
            expect(Object.keys(precedents)).toContain('A1');
            expect(Object.keys(precedents)).toContain('A2');
            expect(Object.keys(precedents)).toContain('A3');
            expect(Object.keys(precedents).length).toBe(3);
        });
    });
});
