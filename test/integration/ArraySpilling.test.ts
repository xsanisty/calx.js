import { Calx } from '../../src/Calx';
import { Workbook } from '../../src/Calx/Workbook';
import { Sheet } from '../../src/Calx/Sheet';
import { ArrayResult } from '../../src/Calx/Cell/ArrayResult';
import { ErrorType } from '../../src/Calx/Cell/ErrorType';

describe('Array Formula Spilling', () => {
    let workbook: Workbook;
    let sheet: Sheet;

    beforeEach(() => {
        workbook = Calx.createWorkbook();
        sheet = workbook.createSheet('Sheet1');
    });

    describe('Basic Spilling Infrastructure', () => {
        test('should handle programmatic array result - horizontal', () => {
            const cell = sheet.createCell('A1', { value: 0 });

            // Simulate a formula that returns an array
            const arrayResult = ArrayResult.fromHorizontalArray([10, 20, 30]);

            // Build and manually trigger spilling
            workbook.build();
            const success = sheet.spill('A1', arrayResult.values);

            expect(success).toBe(true);
            expect(sheet.getCellValue('A1')).toBe(10);
            expect(sheet.getCellValue('B1')).toBe(20);
            expect(sheet.getCellValue('C1')).toBe(30);
        });

        test('should handle programmatic array result - vertical', () => {
            const cell = sheet.createCell('A1', { value: 0 });

            // Simulate a formula that returns a vertical array
            const arrayResult = ArrayResult.fromVerticalArray([10, 20, 30]);

            workbook.build();
            const success = sheet.spill('A1', arrayResult.values);

            expect(success).toBe(true);
            expect(sheet.getCellValue('A1')).toBe(10);
            expect(sheet.getCellValue('A2')).toBe(20);
            expect(sheet.getCellValue('A3')).toBe(30);
        });

        test('should handle programmatic 2D array result', () => {
            const cell = sheet.createCell('A1', { value: 0 });

            // Create a 2x3 array
            const arrayResult = ArrayResult.from2DArray([
                [1, 2, 3],
                [4, 5, 6]
            ]);

            workbook.build();
            const success = sheet.spill('A1', arrayResult.values);

            expect(success).toBe(true);
            expect(sheet.getCellValue('A1')).toBe(1);
            expect(sheet.getCellValue('B1')).toBe(2);
            expect(sheet.getCellValue('C1')).toBe(3);
            expect(sheet.getCellValue('A2')).toBe(4);
            expect(sheet.getCellValue('B2')).toBe(5);
            expect(sheet.getCellValue('C2')).toBe(6);
        });
    });

    describe('Blocked Spill Detection', () => {
        test('should detect blocked spill - horizontal array', () => {
            sheet.createCell('A1', { value: 0 });
            sheet.createCell('B1', { value: 'BLOCKING' }); // Blocks the spill

            const arrayResult = ArrayResult.fromHorizontalArray([10, 20, 30]);

            workbook.build();
            const success = sheet.spill('A1', arrayResult.values);

            expect(success).toBe(false);
            expect(sheet.getCellValue('B1')).toBe('BLOCKING'); // Original value preserved
        });

        test('should detect blocked spill - vertical array', () => {
            sheet.createCell('A1', { value: 0 });
            sheet.createCell('A3', { value: 'BLOCKING' }); // Blocks the spill at A3

            const arrayResult = ArrayResult.fromVerticalArray([10, 20, 30, 40]);

            workbook.build();
            const success = sheet.spill('A1', arrayResult.values);

            expect(success).toBe(false);
            expect(sheet.getCellValue('A3')).toBe('BLOCKING'); // Original value preserved
        });

        test('should detect blocked spill - 2D array', () => {
            sheet.createCell('A1', { value: 0 });
            sheet.createCell('B2', { value: 'BLOCKING' }); // Blocks at B2

            const arrayResult = ArrayResult.from2DArray([
                [1, 2, 3],
                [4, 5, 6]
            ]);

            workbook.build();
            const success = sheet.spill('A1', arrayResult.values);

            expect(success).toBe(false);
            expect(sheet.getCellValue('B2')).toBe('BLOCKING'); // Original value preserved
        });

        test('should allow overwriting previous spill from same anchor', () => {
            sheet.createCell('A1', { value: 0 });

            // First spill
            const arrayResult1 = ArrayResult.fromHorizontalArray([10, 20, 30]);
            workbook.build();
            let success = sheet.spill('A1', arrayResult1.values);
            expect(success).toBe(true);

            // Second spill from same anchor - should overwrite
            const arrayResult2 = ArrayResult.fromHorizontalArray([100, 200, 300]);
            success = sheet.spill('A1', arrayResult2.values);

            expect(success).toBe(true);
            expect(sheet.getCellValue('A1')).toBe(100);
            expect(sheet.getCellValue('B1')).toBe(200);
            expect(sheet.getCellValue('C1')).toBe(300);
        });

        test('should not overwrite spill from different anchor', () => {
            sheet.createCell('A1', { value: 0 });
            sheet.createCell('A2', { value: 0 });

            // First spill from A1 - horizontal [10, 20, 30] goes to A1, B1, C1
            const arrayResult1 = ArrayResult.fromHorizontalArray([10, 20, 30]);
            workbook.build();
            let success = sheet.spill('A1', arrayResult1.values);
            expect(success).toBe(true);

            // Try to spill from A2 horizontally [100, 200] which would overlap at B2, C2 (no overlap actually)
            // Let's spill vertically from B1 instead, which would overlap at B2
            const arrayResult2 = ArrayResult.fromVerticalArray([100, 200, 300]);
            success = sheet.spill('B1', arrayResult2.values); // B1 is already part of first spill

            expect(success).toBe(false); // Should fail because B1 has spill result from A1
            // Original spill from A1 should be intact
            expect(sheet.getCellValue('B1')).toBe(20);
        });
    });

    describe('Spill Cell Properties', () => {
        test('anchor cell should have correct properties', () => {
            const cell = sheet.createCell('A1', { value: 0 });

            const arrayResult = ArrayResult.fromHorizontalArray([10, 20, 30]);
            workbook.build();
            sheet.spill('A1', arrayResult.values);

            expect(cell.isArrayAnchor()).toBe(true);
            const spillRange = cell.getSpillRange();
            expect(spillRange).toBe('A1:C1');
        });

        test('spill result cells should have correct properties', () => {
            sheet.createCell('A1', { value: 0 });

            const arrayResult = ArrayResult.fromHorizontalArray([10, 20, 30]);
            workbook.build();
            sheet.spill('A1', arrayResult.values);

            const spillCell = sheet.getCellIfExists('B1');
            expect(spillCell).toBeDefined();
            expect(spillCell!.isSpillResult()).toBe(true);
            expect(spillCell!.getSpillAnchor()).toBe('A1');
        });

        test('should query spill range from sheet', () => {
            sheet.createCell('A1', { value: 0 });

            const arrayResult = ArrayResult.from2DArray([
                [1, 2],
                [3, 4],
                [5, 6]
            ]);
            workbook.build();
            sheet.spill('A1', arrayResult.values);

            const spillRange = sheet.getSpillRange('A1');
            expect(spillRange).toBe('A1:B3');
        });

        test('should find spill anchor from result cell', () => {
            sheet.createCell('A1', { value: 0 });

            const arrayResult = ArrayResult.fromVerticalArray([10, 20, 30]);
            workbook.build();
            sheet.spill('A1', arrayResult.values);

            expect(sheet.findSpillAnchor('A2')).toBe('A1');
            expect(sheet.findSpillAnchor('A3')).toBe('A1');
            expect(sheet.findSpillAnchor('A1')).toBeNull(); // Anchor itself
        });
    });

    describe('Clearing Spills', () => {
        test('should clear spill results when requested', () => {
            sheet.createCell('A1', { value: 0 });

            const arrayResult = ArrayResult.fromHorizontalArray([10, 20, 30]);
            workbook.build();
            sheet.spill('A1', arrayResult.values);

            // Verify spill exists
            expect(sheet.getCellValue('B1')).toBe(20);

            // Clear spill
            sheet.clearSpillResults('A1');

            // Spill cells should be removed
            expect(sheet.getCellIfExists('B1')).toBeNull();
            expect(sheet.getCellIfExists('C1')).toBeNull();

            // Anchor should still exist but not marked as anchor
            const anchorCell = sheet.getCellIfExists('A1');
            expect(anchorCell).toBeDefined();
            expect(anchorCell!.isArrayAnchor()).toBe(false);
        });

        test('should handle shrinking spill range', () => {
            sheet.createCell('A1', { value: 0 });

            // First spill - 3 cells
            const arrayResult1 = ArrayResult.fromHorizontalArray([10, 20, 30]);
            workbook.build();
            sheet.spill('A1', arrayResult1.values);
            expect(sheet.getCellValue('C1')).toBe(30);

            // Second spill - only 2 cells
            const arrayResult2 = ArrayResult.fromHorizontalArray([100, 200]);
            sheet.spill('A1', arrayResult2.values);

            // Third cell should be removed
            expect(sheet.getCellIfExists('C1')).toBeNull();
            expect(sheet.getCellValue('A1')).toBe(100);
            expect(sheet.getCellValue('B1')).toBe(200);
        });

        test('should handle growing spill range', () => {
            sheet.createCell('A1', { value: 0 });

            // First spill - 2 cells
            const arrayResult1 = ArrayResult.fromHorizontalArray([10, 20]);
            workbook.build();
            sheet.spill('A1', arrayResult1.values);
            expect(sheet.getCellIfExists('C1')).toBeNull();

            // Second spill - 4 cells
            const arrayResult2 = ArrayResult.fromHorizontalArray([100, 200, 300, 400]);
            const success = sheet.spill('A1', arrayResult2.values);

            expect(success).toBe(true);
            expect(sheet.getCellValue('A1')).toBe(100);
            expect(sheet.getCellValue('B1')).toBe(200);
            expect(sheet.getCellValue('C1')).toBe(300);
            expect(sheet.getCellValue('D1')).toBe(400);
        });
    });

    describe('Multiple Spills on Same Sheet', () => {
        test('should handle multiple non-overlapping spills', () => {
            sheet.createCell('A1', { value: 0 });
            sheet.createCell('A5', { value: 0 });

            const arrayResult1 = ArrayResult.fromHorizontalArray([10, 20]);
            const arrayResult2 = ArrayResult.fromVerticalArray([100, 200]);

            workbook.build();
            const success1 = sheet.spill('A1', arrayResult1.values);
            const success2 = sheet.spill('A5', arrayResult2.values);

            expect(success1).toBe(true);
            expect(success2).toBe(true);

            expect(sheet.getCellValue('A1')).toBe(10);
            expect(sheet.getCellValue('B1')).toBe(20);
            expect(sheet.getCellValue('A5')).toBe(100);
            expect(sheet.getCellValue('A6')).toBe(200);
        });

        test('should prevent overlapping spills from different anchors', () => {
            // Don't create B1 with a value - A1's spill will create it
            sheet.createCell('A1', { value: 0 });

            const arrayResult1 = ArrayResult.fromHorizontalArray([10, 20, 30]);
            const arrayResult2 = ArrayResult.fromHorizontalArray([100, 200]);

            workbook.build();
            const success1 = sheet.spill('A1', arrayResult1.values); // A1, B1, C1

            // Now try to spill from B1 - but B1 is already a spill result from A1
            const success2 = sheet.spill('B1', arrayResult2.values); // Would try B1, C1

            expect(success1).toBe(true);
            expect(success2).toBe(false); // Should fail - B1 is a spill result, can't be anchor

            // First spill should remain intact
            expect(sheet.getCellValue('C1')).toBe(30);
        });
    });

    describe('Edge Cases', () => {
        test('should handle single value array (no spilling needed)', () => {
            sheet.createCell('A1', { value: 0 });

            const arrayResult = ArrayResult.fromSingleValue(42);

            workbook.build();
            const success = sheet.spill('A1', arrayResult.values);

            expect(success).toBe(true);
            expect(sheet.getCellValue('A1')).toBe(42);
            // Should not create additional cells
            expect(sheet.getCellIfExists('B1')).toBeNull();
        });

        test('should handle empty values in array', () => {
            sheet.createCell('A1', { value: 0 });

            const arrayResult = ArrayResult.fromHorizontalArray([10, null, 30]);

            workbook.build();
            const success = sheet.spill('A1', arrayResult.values);

            expect(success).toBe(true);
            expect(sheet.getCellValue('A1')).toBe(10);
            expect(sheet.getCellValue('B1')).toBe(0); // null becomes 0 (empty cell value)
            expect(sheet.getCellValue('C1')).toBe(30);
        });

        test('should handle large arrays', () => {
            sheet.createCell('A1', { value: 0 });

            // Create 10x10 array
            const values = Array.from({ length: 10 }, (_, row) =>
                Array.from({ length: 10 }, (_, col) => row * 10 + col)
            );
            const arrayResult = ArrayResult.from2DArray(values);

            workbook.build();
            const success = sheet.spill('A1', arrayResult.values);

            expect(success).toBe(true);
            expect(sheet.getCellValue('A1')).toBe(0);
            expect(sheet.getCellValue('J10')).toBe(99);
            expect(sheet.getCellValue('E5')).toBe(44);
        });

        test('should not allow spilling from non-existent anchor', () => {
            // Don't create A1 cell
            const arrayResult = ArrayResult.fromHorizontalArray([10, 20]);

            workbook.build();
            const success = sheet.spill('A1', arrayResult.values);

            // Should still work - spill creates cells as needed
            expect(success).toBe(true);
            expect(sheet.getCellValue('A1')).toBe(10);
            expect(sheet.getCellValue('B1')).toBe(20);
        });
    });

    describe('Cross-Sheet Array References (Future)', () => {
        test('should prepare for cross-sheet array formulas', () => {
            const sheet2 = workbook.createSheet('Sheet2');

            // Create array in Sheet1
            sheet.createCell('A1', { value: 0 });
            const arrayResult = ArrayResult.fromVerticalArray([10, 20, 30]);
            workbook.build();
            sheet.spill('A1', arrayResult.values);

            // In the future, Sheet2 could reference Sheet1's spilled array
            // For now, just verify the spill is accessible
            expect(sheet.getCellValue('A1')).toBe(10);
            expect(sheet.getCellValue('A2')).toBe(20);
            expect(sheet.getCellValue('A3')).toBe(30);

            // This is a placeholder for future cross-sheet array references
            // e.g., Sheet2!A1 = SUM(Sheet1!A1#)
        });
    });
});
