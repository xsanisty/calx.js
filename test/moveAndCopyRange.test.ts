import { Calx } from '../src/Calx';

describe('Sheet.moveRange() and copyRange()', () => {
    let workbook: any;
    let sheet: any;

    beforeEach(() => {
        workbook = Calx.createWorkbook();
        sheet = workbook.createSheet('test');
    });

    describe('moveRange()', () => {
        describe('Basic Move Operations', () => {
            it('should move a single cell', () => {
                sheet.createCell('A1', { value: 100 });

                sheet.moveRange('A1', 'B2');

                expect(sheet.getCellValue('A1')).toBe(0); // Original cell should be empty/0
                expect(sheet.getCellValue('B2')).toBe(100);
            });

            it('should move a range of cells', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('A2', { value: 20 });
                sheet.createCell('B1', { value: 30 });
                sheet.createCell('B2', { value: 40 });

                sheet.moveRange('A1:B2', 'D5');

                // Original cells should be empty
                expect(sheet.getCellValue('A1')).toBe(0);
                expect(sheet.getCellValue('A2')).toBe(0);
                expect(sheet.getCellValue('B1')).toBe(0);
                expect(sheet.getCellValue('B2')).toBe(0);

                // New cells should have the values
                expect(sheet.getCellValue('D5')).toBe(10);
                expect(sheet.getCellValue('D6')).toBe(20);
                expect(sheet.getCellValue('E5')).toBe(30);
                expect(sheet.getCellValue('E6')).toBe(40);
            });

            it('should move cells with mixed data types', () => {
                sheet.createCell('A1', { value: 100 });
                sheet.createCell('A2', { value: 'text' });
                sheet.createCell('B1', { value: true });
                sheet.createCell('B2', { value: 3.14 });

                sheet.moveRange('A1:B2', 'C3');

                expect(sheet.getCellValue('C3')).toBe(100);
                expect(sheet.getCellValue('C4')).toBe('text');
                expect(sheet.getCellValue('D3')).toBe(true);
                expect(sheet.getCellValue('D4')).toBe(3.14);
            });
        });

        describe('Formula Translation in Moved Cells', () => {
            it('should translate simple cell reference in moved formula', () => {
                sheet.createCell('A1', { value: 100 });
                sheet.createCell('B1', { formula: '=A1' });

                workbook.build();
                workbook.calculate();

                expect(sheet.getCellValue('B1')).toBe(100);

                // Move B1 to C3
                sheet.moveRange('B1', 'C3');

                workbook.build();
                workbook.calculate();

                // Formula should be translated: =A1 -> =B3 (offset +2 rows, +1 col)
                expect(sheet.getCell('C3').formula).toBe('=B3');
            });

            it('should translate SUM formula with range in moved cell', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('A2', { value: 20 });
                sheet.createCell('A3', { value: 30 });
                sheet.createCell('B1', { formula: '=SUM(A1:A3)' });

                workbook.build();
                workbook.calculate();

                expect(sheet.getCellValue('B1')).toBe(60);

                // Move B1 to D5
                sheet.moveRange('B1', 'D5');

                workbook.build();
                workbook.calculate();

                // Formula should be translated: =SUM(A1:A3) -> =SUM(C5:C7)
                expect(sheet.getCell('D5').formula).toBe('=SUM(C5:C7)');
            });

            it('should translate formulas in moved range', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('A2', { value: 20 });
                sheet.createCell('B1', { formula: '=A1*2' });
                sheet.createCell('B2', { formula: '=A2*2' });

                workbook.build();
                workbook.calculate();

                expect(sheet.getCellValue('B1')).toBe(20);
                expect(sheet.getCellValue('B2')).toBe(40);

                // Move B1:B2 to D5:D6
                sheet.moveRange('B1:B2', 'D5');

                workbook.build();
                workbook.calculate();

                // Formulas should be translated
                expect(sheet.getCell('D5').formula).toBe('=C5*2');
                expect(sheet.getCell('D6').formula).toBe('=C6*2');
            });

            it('should preserve absolute references in moved formulas', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('B1', { formula: '=$A$1' });

                sheet.moveRange('B1', 'C3');

                // Absolute reference should not change
                expect(sheet.getCell('C3').formula).toBe('=$A$1');
            });

            it('should handle mixed absolute references correctly', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('B1', { formula: '=$A1+A$1' });

                sheet.moveRange('B1', 'D3');

                // $A1 -> $A3 (absolute col, relative row +2)
                // A$1 -> C$1 (relative col +2, absolute row)
                expect(sheet.getCell('D3').formula).toBe('=$A3+C$1');
            });
        });

        describe('Update References to Moved Cells', () => {
            it('should update references to a moved single cell', () => {
                sheet.createCell('A1', { value: 100 });
                sheet.createCell('B1', { formula: '=A1*2' });

                workbook.build();
                workbook.calculate();

                expect(sheet.getCellValue('B1')).toBe(200);

                // Move A1 to C3
                sheet.moveRange('A1', 'C3');

                workbook.build();
                workbook.calculate();

                // B1's formula should now reference C3
                expect(sheet.getCell('B1').formula).toBe('=C3*2');
                expect(sheet.getCellValue('B1')).toBe(200);
            });

            it('should update references to a moved range', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('A2', { value: 20 });
                sheet.createCell('A3', { value: 30 });
                sheet.createCell('B1', { formula: '=SUM(A1:A3)' });

                workbook.build();
                workbook.calculate();

                expect(sheet.getCellValue('B1')).toBe(60);

                // Move A1:A3 to D5:D7
                sheet.moveRange('A1:A3', 'D5');

                workbook.build();
                workbook.calculate();

                // B1's formula should now reference D5:D7
                expect(sheet.getCell('B1').formula).toBe('=SUM(D5:D7)');
                expect(sheet.getCellValue('B1')).toBe(60);
            });

            it('should update multiple formulas that reference moved cells', () => {
                sheet.createCell('A1', { value: 100 });
                sheet.createCell('B1', { formula: '=A1+10' });
                sheet.createCell('C1', { formula: '=A1*2' });
                sheet.createCell('D1', { formula: '=A1-5' });

                workbook.build();
                workbook.calculate();

                expect(sheet.getCellValue('B1')).toBe(110);
                expect(sheet.getCellValue('C1')).toBe(200);
                expect(sheet.getCellValue('D1')).toBe(95);

                // Move A1 to E5
                sheet.moveRange('A1', 'E5');

                workbook.build();
                workbook.calculate();

                // All formulas should be updated
                expect(sheet.getCell('B1').formula).toBe('=E5+10');
                expect(sheet.getCell('C1').formula).toBe('=E5*2');
                expect(sheet.getCell('D1').formula).toBe('=E5-5');

                expect(sheet.getCellValue('B1')).toBe(110);
                expect(sheet.getCellValue('C1')).toBe(200);
                expect(sheet.getCellValue('D1')).toBe(95);
            });

            it('should update references within moved range formulas', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('A2', { value: 20 });
                sheet.createCell('A3', { formula: '=A1+A2' });
                sheet.createCell('B1', { formula: '=A3*2' });

                workbook.build();
                workbook.calculate();

                expect(sheet.getCellValue('A3')).toBe(30);
                expect(sheet.getCellValue('B1')).toBe(60);

                // Move A1:A3 to D5:D7
                sheet.moveRange('A1:A3', 'D5');

                workbook.build();
                workbook.calculate();

                // D7 (moved A3) should reference D5+D6 (moved A1, A2)
                expect(sheet.getCell('D7').formula).toBe('=D5+D6');
                // B1 should reference D7 (moved A3)
                expect(sheet.getCell('B1').formula).toBe('=D7*2');

                expect(sheet.getCellValue('D7')).toBe(30);
                expect(sheet.getCellValue('B1')).toBe(60);
            });
        });

        describe('Dependency Tree Rebuild', () => {
            it('should rebuild dependency tree after move', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('A2', { value: 20 });
                sheet.createCell('A3', { formula: '=A1+A2' });
                sheet.createCell('B1', { formula: '=A3*2' });

                workbook.build();
                workbook.calculate();

                expect(sheet.getCellValue('B1')).toBe(60);

                // Move A1:A3 to D5:D7
                sheet.moveRange('A1:A3', 'D5');

                // Change D5 (moved A1) value
                sheet.getCell('D5').value = 50;

                workbook.calculate();

                // D7 should recalculate: 50 + 20 = 70
                // B1 should recalculate: 70 * 2 = 140
                expect(sheet.getCellValue('D7')).toBe(70);
                expect(sheet.getCellValue('B1')).toBe(140);
            });
        });
    });

    describe('copyRange()', () => {
        describe('Basic Copy Operations', () => {
            it('should copy a single cell', () => {
                sheet.createCell('A1', { value: 100 });

                sheet.copyRange('A1', 'B2');

                // Both cells should have the value
                expect(sheet.getCellValue('A1')).toBe(100);
                expect(sheet.getCellValue('B2')).toBe(100);
            });

            it('should copy a range of cells', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('A2', { value: 20 });
                sheet.createCell('B1', { value: 30 });
                sheet.createCell('B2', { value: 40 });

                sheet.copyRange('A1:B2', 'D5');

                // Original cells should still have values
                expect(sheet.getCellValue('A1')).toBe(10);
                expect(sheet.getCellValue('A2')).toBe(20);
                expect(sheet.getCellValue('B1')).toBe(30);
                expect(sheet.getCellValue('B2')).toBe(40);

                // Copied cells should have the same values
                expect(sheet.getCellValue('D5')).toBe(10);
                expect(sheet.getCellValue('D6')).toBe(20);
                expect(sheet.getCellValue('E5')).toBe(30);
                expect(sheet.getCellValue('E6')).toBe(40);
            });

            it('should copy cells with mixed data types', () => {
                sheet.createCell('A1', { value: 100 });
                sheet.createCell('A2', { value: 'text' });
                sheet.createCell('B1', { value: true });
                sheet.createCell('B2', { value: 3.14 });

                sheet.copyRange('A1:B2', 'C3');

                expect(sheet.getCellValue('C3')).toBe(100);
                expect(sheet.getCellValue('C4')).toBe('text');
                expect(sheet.getCellValue('D3')).toBe(true);
                expect(sheet.getCellValue('D4')).toBe(3.14);
            });
        });

        describe('Formula Translation in Copied Cells', () => {
            it('should translate simple cell reference in copied formula', () => {
                sheet.createCell('A1', { value: 100 });
                sheet.createCell('B1', { formula: '=A1' });

                workbook.build();
                workbook.calculate();

                expect(sheet.getCellValue('B1')).toBe(100);

                // Copy B1 to C3
                sheet.copyRange('B1', 'C3');

                workbook.build();
                workbook.calculate();

                // Original formula should stay the same
                expect(sheet.getCell('B1').formula).toBe('=A1');
                // Copied formula should be translated: =A1 -> =B3 (offset +2 rows, +1 col)
                expect(sheet.getCell('C3').formula).toBe('=B3');
            });

            it('should translate SUM formula with range in copied cell', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('A2', { value: 20 });
                sheet.createCell('A3', { value: 30 });
                sheet.createCell('B1', { formula: '=SUM(A1:A3)' });

                workbook.build();
                workbook.calculate();

                expect(sheet.getCellValue('B1')).toBe(60);

                // Copy B1 to D5
                sheet.copyRange('B1', 'D5');

                workbook.build();
                workbook.calculate();

                // Original formula unchanged
                expect(sheet.getCell('B1').formula).toBe('=SUM(A1:A3)');
                // Copied formula should be translated: =SUM(A1:A3) -> =SUM(C5:C7)
                expect(sheet.getCell('D5').formula).toBe('=SUM(C5:C7)');
            });

            it('should translate formulas in copied range', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('A2', { value: 20 });
                sheet.createCell('B1', { formula: '=A1*2' });
                sheet.createCell('B2', { formula: '=A2*2' });

                workbook.build();
                workbook.calculate();

                // Copy B1:B2 to D5:D6
                sheet.copyRange('B1:B2', 'D5');

                workbook.build();
                workbook.calculate();

                // Original formulas unchanged
                expect(sheet.getCell('B1').formula).toBe('=A1*2');
                expect(sheet.getCell('B2').formula).toBe('=A2*2');

                // Copied formulas should be translated
                expect(sheet.getCell('D5').formula).toBe('=C5*2');
                expect(sheet.getCell('D6').formula).toBe('=C6*2');
            });

            it('should preserve absolute references in copied formulas', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('B1', { formula: '=$A$1' });

                sheet.copyRange('B1', 'C3');

                // Absolute reference should not change
                expect(sheet.getCell('C3').formula).toBe('=$A$1');
            });

            it('should handle mixed absolute references correctly', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('B1', { formula: '=$A1+A$1' });

                sheet.copyRange('B1', 'D3');

                // $A1 -> $A3 (absolute col, relative row +2)
                // A$1 -> C$1 (relative col +2, absolute row)
                expect(sheet.getCell('D3').formula).toBe('=$A3+C$1');
            });
        });

        describe('References to Copied Cells', () => {
            it('should NOT update references to copied cells in other formulas', () => {
                sheet.createCell('A1', { value: 100 });
                sheet.createCell('B1', { formula: '=A1*2' });

                workbook.build();
                workbook.calculate();

                expect(sheet.getCellValue('B1')).toBe(200);

                // Copy A1 to C3
                sheet.copyRange('A1', 'C3');

                workbook.build();
                workbook.calculate();

                // B1's formula should still reference A1, not C3
                expect(sheet.getCell('B1').formula).toBe('=A1*2');
                expect(sheet.getCellValue('B1')).toBe(200);
            });

            it('should NOT update range references when copying', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('A2', { value: 20 });
                sheet.createCell('A3', { value: 30 });
                sheet.createCell('B1', { formula: '=SUM(A1:A3)' });

                workbook.build();
                workbook.calculate();

                expect(sheet.getCellValue('B1')).toBe(60);

                // Copy A1:A3 to D5:D7
                sheet.copyRange('A1:A3', 'D5');

                workbook.build();
                workbook.calculate();

                // B1's formula should still reference A1:A3
                expect(sheet.getCell('B1').formula).toBe('=SUM(A1:A3)');
                expect(sheet.getCellValue('B1')).toBe(60);
            });
        });

        describe('Dependency Tree Rebuild', () => {
            it('should rebuild dependency tree after copy', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('A2', { value: 20 });
                sheet.createCell('A3', { formula: '=A1+A2' });

                workbook.build();
                workbook.calculate();

                expect(sheet.getCellValue('A3')).toBe(30);

                // Copy A1:A3 to D5:D7
                sheet.copyRange('A1:A3', 'D5');

                // Change D5 (copied A1) value
                sheet.getCell('D5').value = 50;

                workbook.calculate();

                // D7 should recalculate: 50 + 20 = 70
                // Original A3 should stay: 10 + 20 = 30
                expect(sheet.getCellValue('D7')).toBe(70);
                expect(sheet.getCellValue('A3')).toBe(30);
            });
        });

        describe('Complex Scenarios', () => {
            it('should handle copying formulas that reference cells outside the range', () => {
                sheet.createCell('A1', { value: 100 });
                sheet.createCell('B1', { value: 10 });
                sheet.createCell('B2', { value: 20 });
                sheet.createCell('C1', { formula: '=A1+B1' });
                sheet.createCell('C2', { formula: '=A1+B2' });

                workbook.build();
                workbook.calculate();

                expect(sheet.getCellValue('C1')).toBe(110);
                expect(sheet.getCellValue('C2')).toBe(120);

                // Copy C1:C2 to E5:E6
                sheet.copyRange('C1:C2', 'E5');

                workbook.build();
                workbook.calculate();

                // Copied formulas should reference C5 (offset from A1) and respective B cells
                expect(sheet.getCell('E5').formula).toBe('=C5+D5');
                expect(sheet.getCell('E6').formula).toBe('=C5+D6');
            });

            it('should copy formulas with complex nested functions', () => {
                sheet.createCell('A1', { value: 10 });
                sheet.createCell('A2', { value: 20 });
                sheet.createCell('A3', { value: 30 });
                sheet.createCell('B1', { formula: '=IF(SUM(A1:A3)>50,MAX(A1:A3),MIN(A1:A3))' });

                workbook.build();
                workbook.calculate();

                expect(sheet.getCellValue('B1')).toBe(30); // SUM=60>50, so MAX=30

                sheet.copyRange('B1', 'D5');

                workbook.build();
                workbook.calculate();

                expect(sheet.getCell('D5').formula).toBe('=IF(SUM(C5:C7)>50,MAX(C5:C7),MIN(C5:C7))');
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle moving range to overlapping location', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });

            // Move A1:A2 to A2:A3 (overlap)
            sheet.moveRange('A1:A2', 'A2');

            expect(sheet.getCellValue('A1')).toBe(0);
            expect(sheet.getCellValue('A2')).toBe(10);
            expect(sheet.getCellValue('A3')).toBe(20);
        });

        it('should handle copying to overlapping location', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });

            // Copy A1:A2 to A2:A3 (overlap)
            sheet.copyRange('A1:A2', 'A2');

            // After copy: A1=10 (unchanged), A2=10 (from A1), A3=20 (from A2)
            expect(sheet.getCellValue('A1')).toBe(10);
            expect(sheet.getCellValue('A2')).toBe(10);
            expect(sheet.getCellValue('A3')).toBe(20);
        });

        it('should handle range with absolute reference markers in address', () => {
            sheet.createCell('A1', { value: 100 });

            sheet.moveRange('$A$1', 'B2');

            expect(sheet.getCellValue('A1')).toBe(0);
            expect(sheet.getCellValue('B2')).toBe(100);
        });

        it('should handle column beyond Z', () => {
            sheet.createCell('Z1', { value: 100 });
            sheet.createCell('AA1', { value: 200 });

            sheet.moveRange('Z1:AA1', 'AB5');

            expect(sheet.getCellValue('AB5')).toBe(100);
            expect(sheet.getCellValue('AC5')).toBe(200);
        });
    });
});
