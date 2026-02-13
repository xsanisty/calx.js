import { describe, expect, test, beforeEach } from '@jest/globals';
import { Calx, DateUtil } from '../../src/Calx';
import { DataType } from '../../src/Calx/Cell/DataType';

describe('Date Arithmetic', () => {
    let workbook: any;
    let sheet: any;

    beforeEach(() => {
        workbook = Calx.createWorkbook();
        sheet = workbook.createSheet('Sheet1');
    });

    test('should add days to a date cell', () => {
        // V1 = 2024-01-15 (date type)
        sheet.createCell('V1', { value: '2024-01-15', type: DataType.DATE });
        // V2 = 30 (number)
        sheet.createCell('V2', { value: 30, type: DataType.NUMBER });
        // V3 = V1+V2 (should be 2024-02-14)
        sheet.createCell('V3', { formula: '=V1+V2', type: DataType.DATE });

        workbook.build();
        workbook.calculate();

        // Get the result
        const v3Cell = sheet.getCell('V3');
        const resultDate = v3Cell.getDateValue();

        expect(resultDate).not.toBeNull();
        expect(resultDate!.getUTCFullYear()).toBe(2024);
        expect(resultDate!.getUTCMonth()).toBe(1); // February (0-indexed)
        expect(resultDate!.getUTCDate()).toBe(14);

        // Also check the serial date value
        const v1Serial = DateUtil.fromISOString('2024-01-15');
        const expectedSerial = v1Serial + 30;
        expect(v3Cell.value).toBe(expectedSerial);
    });

    test('should subtract dates to get days between', () => {
        // V1 = 2024-01-15
        sheet.createCell('V1', { value: '2024-01-15', type: DataType.DATE });
        // V3 = 2024-02-14
        sheet.createCell('V3', { value: '2024-02-14', type: DataType.DATE });
        // V4 = V3-V1 (should be 30 days)
        sheet.createCell('V4', { formula: '=V3-V1' });

        workbook.build();
        workbook.calculate();

        expect(sheet.getCellValue('V4')).toBe(30);
    });

    test('should handle complex date arithmetic formula', () => {
        // Date: 2024-01-15
        sheet.createCell('A1', { value: '2024-01-15', type: DataType.DATE });
        // Days to add: 30
        sheet.createCell('A2', { value: 30 });
        // Result cell with formula
        sheet.createCell('A3', { formula: '=A1+A2', type: DataType.DATE });
        // Verify by subtracting
        sheet.createCell('A4', { formula: '=A3-A1' });

        workbook.build();
        workbook.calculate();

        // A3 should be 2024-02-14
        const a3Date = sheet.getCell('A3').getDateValue();
        expect(a3Date!.getUTCFullYear()).toBe(2024);
        expect(a3Date!.getUTCMonth()).toBe(1); // February
        expect(a3Date!.getUTCDate()).toBe(14);

        // A4 should be 30
        expect(sheet.getCellValue('A4')).toBe(30);
    });

    test('should handle date arithmetic with negative numbers', () => {
        sheet.createCell('B1', { value: '2024-02-14', type: DataType.DATE });
        sheet.createCell('B2', { value: -30 });
        sheet.createCell('B3', { formula: '=B1+B2', type: DataType.DATE });

        workbook.build();
        workbook.calculate();

        // Should be 2024-01-15
        const resultDate = sheet.getCell('B3').getDateValue();
        expect(resultDate!.getUTCFullYear()).toBe(2024);
        expect(resultDate!.getUTCMonth()).toBe(0); // January
        expect(resultDate!.getUTCDate()).toBe(15);
    });

    test('should maintain UTC consistency in date arithmetic', () => {
        // Create date in V1
        sheet.createCell('V1', { value: '2024-01-15', type: DataType.DATE });
        sheet.createCell('V2', { value: 30 });
        sheet.createCell('V3', { formula: '=V1+V2', type: DataType.DATE });

        workbook.build();
        workbook.calculate();

        // Check that V3 has internal UTC date
        const v3Cell = sheet.getCell('V3');
        const v3Date = v3Cell.getDateValue();

        // Should have a UTC date object stored internally
        expect(v3Date).toBeInstanceOf(Date);

        // Extract components using UTC methods
        expect(v3Date!.getUTCFullYear()).toBe(2024);
        expect(v3Date!.getUTCMonth()).toBe(1); // February
        expect(v3Date!.getUTCDate()).toBe(14);
    });

    test('should handle date arithmetic in dependent cells', () => {
        sheet.createCell('C1', { value: '2024-01-01', type: DataType.DATE });
        sheet.createCell('C2', { formula: '=C1+10', type: DataType.DATE });
        sheet.createCell('C3', { formula: '=C2+10', type: DataType.DATE });
        sheet.createCell('C4', { formula: '=C3-C1' });

        workbook.build();
        workbook.calculate();

        // C2 should be Jan 11
        const c2Date = sheet.getCell('C2').getDateValue();
        expect(c2Date!.getUTCDate()).toBe(11);

        // C3 should be Jan 21
        const c3Date = sheet.getCell('C3').getDateValue();
        expect(c3Date!.getUTCDate()).toBe(21);

        // C4 should be 20 days
        expect(sheet.getCellValue('C4')).toBe(20);
    });

    test('should update date arithmetic when source changes', () => {
        sheet.createCell('D1', { value: '2024-01-15', type: DataType.DATE });
        sheet.createCell('D2', { value: 30 });
        sheet.createCell('D3', { formula: '=D1+D2', type: DataType.DATE });

        workbook.build();
        workbook.calculate();

        // Initial result
        let d3Date = sheet.getCell('D3').getDateValue();
        expect(d3Date!.getUTCDate()).toBe(14); // Feb 14

        // Change D2
        sheet.getCell('D2').value = 45;

        // Recalculate
        workbook.calculate();

        // New result should be Feb 29 (2024 is a leap year)
        d3Date = sheet.getCell('D3').getDateValue();
        expect(d3Date!.getUTCMonth()).toBe(1); // February
        expect(d3Date!.getUTCDate()).toBe(29);
    });

    describe('Edge Cases', () => {
        test('should handle date arithmetic across months', () => {
            // January 15 + 30 days = February 14
            sheet.createCell('E1', { value: '2024-01-15', type: DataType.DATE });
            sheet.createCell('E2', { value: 30 });
            sheet.createCell('E3', { formula: '=E1+E2', type: DataType.DATE });

            workbook.build();
            workbook.calculate();

            const e3Date = sheet.getCell('E3').getDateValue();
            expect(e3Date!.getUTCFullYear()).toBe(2024);
            expect(e3Date!.getUTCMonth()).toBe(1); // February (0-indexed)
            expect(e3Date!.getUTCDate()).toBe(14);
        });

        test('should handle date arithmetic across years', () => {
            // December 15, 2023 + 30 days = January 14, 2024
            sheet.createCell('F1', { value: '2023-12-15', type: DataType.DATE });
            sheet.createCell('F2', { value: 30 });
            sheet.createCell('F3', { formula: '=F1+F2', type: DataType.DATE });

            workbook.build();
            workbook.calculate();

            const f3Date = sheet.getCell('F3').getDateValue();
            expect(f3Date!.getUTCFullYear()).toBe(2024);
            expect(f3Date!.getUTCMonth()).toBe(0); // January
            expect(f3Date!.getUTCDate()).toBe(14);
        });

        test('should handle leap year - February 29, 2024', () => {
            // February 28, 2024 + 1 day = February 29, 2024 (leap year)
            sheet.createCell('G1', { value: '2024-02-28', type: DataType.DATE });
            sheet.createCell('G2', { value: 1 });
            sheet.createCell('G3', { formula: '=G1+G2', type: DataType.DATE });

            workbook.build();
            workbook.calculate();

            const g3Date = sheet.getCell('G3').getDateValue();
            expect(g3Date!.getUTCFullYear()).toBe(2024);
            expect(g3Date!.getUTCMonth()).toBe(1); // February
            expect(g3Date!.getUTCDate()).toBe(29);
        });

        test('should handle leap year - March 1, 2024', () => {
            // February 29, 2024 + 1 day = March 1, 2024
            sheet.createCell('H1', { value: '2024-02-29', type: DataType.DATE });
            sheet.createCell('H2', { value: 1 });
            sheet.createCell('H3', { formula: '=H1+H2', type: DataType.DATE });

            workbook.build();
            workbook.calculate();

            const h3Date = sheet.getCell('H3').getDateValue();
            expect(h3Date!.getUTCFullYear()).toBe(2024);
            expect(h3Date!.getUTCMonth()).toBe(2); // March
            expect(h3Date!.getUTCDate()).toBe(1);
        });

        test('should handle non-leap year - 2023', () => {
            // February 28, 2023 + 1 day = March 1, 2023 (not a leap year)
            sheet.createCell('I1', { value: '2023-02-28', type: DataType.DATE });
            sheet.createCell('I2', { value: 1 });
            sheet.createCell('I3', { formula: '=I1+I2', type: DataType.DATE });

            workbook.build();
            workbook.calculate();

            const i3Date = sheet.getCell('I3').getDateValue();
            expect(i3Date!.getUTCFullYear()).toBe(2023);
            expect(i3Date!.getUTCMonth()).toBe(2); // March (0-indexed)
            expect(i3Date!.getUTCDate()).toBe(1);
        });

        test('should handle end of month - January to February', () => {
            // January 31, 2024 + 1 day = February 1, 2024
            sheet.createCell('J1', { value: '2024-01-31', type: DataType.DATE });
            sheet.createCell('J2', { value: 1 });
            sheet.createCell('J3', { formula: '=J1+J2', type: DataType.DATE });

            workbook.build();
            workbook.calculate();

            const j3Date = sheet.getCell('J3').getDateValue();
            expect(j3Date!.getUTCFullYear()).toBe(2024);
            expect(j3Date!.getUTCMonth()).toBe(1); // February
            expect(j3Date!.getUTCDate()).toBe(1);
        });

        test('should handle large day additions across multiple months', () => {
            // January 1, 2024 + 100 days = April 10, 2024
            sheet.createCell('K1', { value: '2024-01-01', type: DataType.DATE });
            sheet.createCell('K2', { value: 100 });
            sheet.createCell('K3', { formula: '=K1+K2', type: DataType.DATE });

            workbook.build();
            workbook.calculate();

            const k3Date = sheet.getCell('K3').getDateValue();
            expect(k3Date!.getUTCFullYear()).toBe(2024);
            expect(k3Date!.getUTCMonth()).toBe(3); // April (0-indexed)
            expect(k3Date!.getUTCDate()).toBe(10);
        });

        test('should handle date subtraction across months', () => {
            // February 14, 2024 - 30 days = January 15, 2024
            sheet.createCell('L1', { value: '2024-02-14', type: DataType.DATE });
            sheet.createCell('L2', { value: -30 });
            sheet.createCell('L3', { formula: '=L1+L2', type: DataType.DATE });

            workbook.build();
            workbook.calculate();

            const l3Date = sheet.getCell('L3').getDateValue();
            expect(l3Date!.getUTCFullYear()).toBe(2024);
            expect(l3Date!.getUTCMonth()).toBe(0); // January
            expect(l3Date!.getUTCDate()).toBe(15);
        });

        test('should handle date subtraction across years', () => {
            // January 14, 2024 - 30 days = December 15, 2023
            sheet.createCell('M1', { value: '2024-01-14', type: DataType.DATE });
            sheet.createCell('M2', { value: -30 });
            sheet.createCell('M3', { formula: '=M1+M2', type: DataType.DATE });

            workbook.build();
            workbook.calculate();

            const m3Date = sheet.getCell('M3').getDateValue();
            expect(m3Date!.getUTCFullYear()).toBe(2023);
            expect(m3Date!.getUTCMonth()).toBe(11); // December (0-indexed)
            expect(m3Date!.getUTCDate()).toBe(15);
        });

        test('should handle year-end date arithmetic', () => {
            // December 31, 2023 + 1 day = January 1, 2024
            sheet.createCell('N1', { value: '2023-12-31', type: DataType.DATE });
            sheet.createCell('N2', { value: 1 });
            sheet.createCell('N3', { formula: '=N1+N2', type: DataType.DATE });

            workbook.build();
            workbook.calculate();

            const n3Date = sheet.getCell('N3').getDateValue();
            expect(n3Date!.getUTCFullYear()).toBe(2024);
            expect(n3Date!.getUTCMonth()).toBe(0); // January
            expect(n3Date!.getUTCDate()).toBe(1);
        });

        test('should handle exact month difference', () => {
            // January 15, 2024 to February 15, 2024 = 31 days
            sheet.createCell('O1', { value: '2024-01-15', type: DataType.DATE });
            sheet.createCell('O2', { value: '2024-02-15', type: DataType.DATE });
            sheet.createCell('O3', { formula: '=O2-O1' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('O3')).toBe(31);
        });

        test('should handle leap year day count', () => {
            // January 1, 2024 to March 1, 2024 = 60 days (includes Feb 29)
            sheet.createCell('P1', { value: '2024-01-01', type: DataType.DATE });
            sheet.createCell('P2', { value: '2024-03-01', type: DataType.DATE });
            sheet.createCell('P3', { formula: '=P2-P1' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('P3')).toBe(60);
        });

        test('should handle non-leap year day count', () => {
            // January 1, 2023 to March 1, 2023 = 59 days (no Feb 29)
            sheet.createCell('Q1', { value: '2023-01-01', type: DataType.DATE });
            sheet.createCell('Q2', { value: '2023-03-01', type: DataType.DATE });
            sheet.createCell('Q3', { formula: '=Q2-Q1' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('Q3')).toBe(59);
        });
    });
});
