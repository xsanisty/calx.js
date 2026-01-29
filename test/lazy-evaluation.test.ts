import { Calx } from '../src/Calx';
import * as formulajs from '@formulajs/formulajs';

/**
 * Lazy Evaluation Tests
 *
 * These tests verify that Calx uses lazy evaluation for IF statements,
 * meaning only the branch that is taken is actually executed.
 *
 * Two approaches are used to prove lazy evaluation:
 *
 * 1. Function Call Tracking (with Jest spies):
 *    - Uses jest.spyOn() to track function calls
 *    - Verifies that functions in unused branches are never called
 *    - Proves that lazy evaluation prevents wasteful computation
 *
 * 2. Error Prevention Testing:
 *    - Uses error-causing expressions (e.g., division by zero) in unused branches
 *    - If the branch were executed, it would throw an error
 *    - Success proves the branch was never evaluated
 *
 * This is a significant improvement over legacy Calx, which used eager evaluation
 * (evaluating both branches and selecting the result), wasting computation and
 * potentially causing unnecessary errors.
 */

describe('Lazy Evaluation Tests', () => {
    let workbook: any;
    let sheet: any;

    beforeEach(() => {
        workbook = Calx.createWorkbook();
        sheet = workbook.createSheet('lazy_test');
    });

    describe('Proof of Lazy Evaluation with Function Call Tracking', () => {
        it('should only call ABS once when true branch is taken', () => {
            // Spy on the ABS function to track calls
            const absSpy = jest.spyOn(formulajs, 'ABS');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { formula: '=IF(A1>5, ABS(-100), ABS(-200))' });

            workbook.build();
            workbook.calculate();

            // Only ABS(-100) should be called, not ABS(-200)
            expect(absSpy).toHaveBeenCalledTimes(1);
            expect(absSpy).toHaveBeenCalledWith(-100);
            expect(sheet.getCell('A2').value).toBe(100);

            absSpy.mockRestore();
        });

        it('should only call ABS once when false branch is taken', () => {
            // Spy on the ABS function to track calls
            const absSpy = jest.spyOn(formulajs, 'ABS');

            sheet.createCell('A1', { value: 3 });
            sheet.createCell('A2', { formula: '=IF(A1>5, ABS(-100), ABS(-200))' });

            workbook.build();
            workbook.calculate();

            // Only ABS(-200) should be called, not ABS(-100)
            expect(absSpy).toHaveBeenCalledTimes(1);
            expect(absSpy).toHaveBeenCalledWith(-200);
            expect(sheet.getCell('A2').value).toBe(200);

            absSpy.mockRestore();
        });

        it('should only call SQRT for taken branch', () => {
            const sqrtSpy = jest.spyOn(formulajs, 'SQRT');

            sheet.createCell('B1', { value: true });
            sheet.createCell('B2', { formula: '=IF(B1, SQRT(16), SQRT(25))' });

            workbook.build();
            workbook.calculate();

            expect(sqrtSpy).toHaveBeenCalledTimes(1);
            expect(sqrtSpy).toHaveBeenCalledWith(16);
            expect(sheet.getCell('B2').value).toBe(4);

            sqrtSpy.mockRestore();
        });

        it('should prove lazy evaluation prevents wasted expensive calculations', () => {
            const powerSpy = jest.spyOn(formulajs, 'POWER');

            sheet.createCell('C1', { value: 2 });
            sheet.createCell('C2', { formula: '=IF(C1<10, 100, POWER(2, 1000))' });

            workbook.build();
            workbook.calculate();

            // POWER should NEVER be called because condition is true
            expect(powerSpy).not.toHaveBeenCalled();
            expect(sheet.getCell('C2').value).toBe(100);

            powerSpy.mockRestore();
        });

        it('should track multiple ABS calls in nested IF statements', () => {
            const absSpy = jest.spyOn(formulajs, 'ABS');

            sheet.createCell('D1', { value: 7 });
            sheet.createCell('D2', { formula: '=IF(D1>5, IF(D1>8, ABS(-1), ABS(-2)), ABS(-3))' });

            workbook.build();
            workbook.calculate();

            // Only one ABS should be called (ABS(-2) since 7>5 but not >8)
            expect(absSpy).toHaveBeenCalledTimes(1);
            expect(absSpy).toHaveBeenCalledWith(-2);
            expect(sheet.getCell('D2').value).toBe(2);

            absSpy.mockRestore();
        });

        it('should demonstrate the difference from eager evaluation', () => {
            const logSpy = jest.spyOn(formulajs, 'LOG');

            // In eager evaluation, both LOG calls would execute
            // In lazy evaluation, only the taken branch executes
            sheet.createCell('E1', { value: 15 });
            sheet.createCell('E2', { formula: '=IF(E1>10, LOG(100, 10), LOG(1000, 10))' });

            workbook.build();
            workbook.calculate();

            // Only LOG(100, 10) should be called
            expect(logSpy).toHaveBeenCalledTimes(1);
            expect(logSpy).toHaveBeenCalledWith(100, 10);
            expect(sheet.getCell('E2').value).toBe(2);

            logSpy.mockRestore();
        });

        it('should not execute expensive calculation in unused branch', () => {
            const sumSpy = jest.spyOn(formulajs, 'SUM');

            sheet.createCell('F1', { value: 5 });
            sheet.createCell('F2', { formula: '=IF(F1<10, 42, SUM(1,2,3,4,5,6,7,8,9,10))' });

            workbook.build();
            workbook.calculate();

            // SUM should never be called
            expect(sumSpy).not.toHaveBeenCalled();
            expect(sheet.getCell('F2').value).toBe(42);

            sumSpy.mockRestore();
        });

        it('should prove each branch independently with spy counts', () => {
            const roundSpy = jest.spyOn(formulajs, 'ROUND');

            // Test true branch
            sheet.createCell('G1', { value: true });
            sheet.createCell('G2', { formula: '=IF(G1, ROUND(3.7, 0), ROUND(2.3, 0))' });

            workbook.build();
            workbook.calculate();

            expect(roundSpy).toHaveBeenCalledTimes(1);
            expect(roundSpy).toHaveBeenCalledWith(3.7, 0);
            roundSpy.mockClear();

            // Test false branch
            sheet.getCell('G1').value = false;
            workbook.calculate();

            expect(roundSpy).toHaveBeenCalledTimes(1);
            expect(roundSpy).toHaveBeenCalledWith(2.3, 0);

            roundSpy.mockRestore();
        });
    });

    describe('IF Function Lazy Evaluation', () => {
        it('should NOT execute false branch when condition is true', () => {
            // Setup: Create a cell that would cause error if evaluated
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 0 }); // This would cause division by zero

            // IF condition is TRUE, so the false branch (1/A2) should NEVER be executed
            sheet.createCell('B1', { formula: '=IF(A1>5, A1*2, 1/A2)' });

            workbook.build();
            workbook.calculate();

            // Should successfully calculate without division by zero error
            expect(sheet.getCellValue('B1')).toBe(20);
        });

        it('should NOT execute true branch when condition is false', () => {
            // Setup: Create a cell that would cause error if evaluated
            sheet.createCell('A1', { value: 3 });
            sheet.createCell('A2', { value: 0 }); // This would cause division by zero

            // IF condition is FALSE, so the true branch (1/A2) should NEVER be executed
            sheet.createCell('B1', { formula: '=IF(A1>5, 1/A2, A1*2)' });

            workbook.build();
            workbook.calculate();

            // Should successfully calculate without division by zero error
            expect(sheet.getCellValue('B1')).toBe(6);
        });

        it('should handle nested IF with lazy evaluation', () => {
            sheet.createCell('A1', { value: 15 });
            sheet.createCell('A2', { value: 0 });

            // Nested IF - outer condition is TRUE, so inner IF's false branch should never execute
            // Inner IF condition is also TRUE, so its false branch should never execute
            sheet.createCell('B1', { formula: '=IF(A1>10, IF(A1>12, A1*3, 1/A2), 1/A2)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(45);
        });

        it('should only evaluate the taken path in complex nested IF', () => {
            sheet.createCell('A1', { value: 5 });
            sheet.createCell('A2', { value: 0 });
            sheet.createCell('A3', { value: 0 });

            // Complex nested IF - only middle path should execute
            sheet.createCell('B1', {
                formula: '=IF(A1<3, 1/A2, IF(A1<7, A1*10, 1/A3))'
            });

            workbook.build();
            workbook.calculate();

            // Should take the middle path (A1<7 is true) and return 50
            expect(sheet.getCellValue('B1')).toBe(50);
        });

        it('should not evaluate error-causing expressions in unused branches', () => {
            sheet.createCell('A1', { value: 100 });
            sheet.createCell('A2', { value: 10 });
            sheet.createCell('A3', { value: 0 });

            // Multiple potential errors in false branches
            sheet.createCell('B1', {
                formula: '=IF(A1>50, A2*5, IF(A2>0, 1/A3, SQRT(-1)))'
            });

            workbook.build();
            workbook.calculate();

            // First condition is true, so none of the error-causing branches execute
            expect(sheet.getCellValue('B1')).toBe(50);
        });

        it('should handle IF with cell references that do not exist in unused branch', () => {
            sheet.createCell('A1', { value: 20 });
            // Note: B1 and C1 do not exist

            // If condition is true, references to non-existent cells should not be evaluated
            sheet.createCell('D1', { formula: '=IF(A1>10, A1*2, B1+C1)' });

            workbook.build();
            workbook.calculate();

            // Should successfully return 40 without trying to access B1 or C1
            expect(sheet.getCellValue('D1')).toBe(40);
        });

        it('should handle IF with function calls that would fail in unused branch', () => {
            sheet.createCell('A1', { value: 5 });
            sheet.createCell('A2', { value: -10 });

            // SQRT of negative number would fail, but should not be executed
            sheet.createCell('B1', { formula: '=IF(A1>0, A1*3, SQRT(A2))' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(15);
        });

        it('should handle IF with range references in unused branch', () => {
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('A2', { value: 2 });
            sheet.createCell('A3', { value: 3 });
            sheet.createCell('B1', { value: 10 });

            // If condition is true, SUM over non-existent range should not be evaluated
            sheet.createCell('C1', { formula: '=IF(B1>5, SUM(A1:A3), SUM(Z1:Z100))' });

            workbook.build();
            workbook.calculate();

            // Should sum A1:A3 and return 6
            expect(sheet.getCellValue('C1')).toBe(6);
        });

        it('should handle chained IFs with multiple error possibilities', () => {
            sheet.createCell('A1', { value: 25 });
            sheet.createCell('A2', { value: 0 });
            sheet.createCell('A3', { value: 0 });
            sheet.createCell('A4', { value: 0 });

            // Only the first condition should be evaluated
            sheet.createCell('B1', {
                formula: '=IF(A1>20, A1*2, IF(A1>15, 1/A2, IF(A1>10, 1/A3, 1/A4)))'
            });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(50);
        });

        it('should handle IF with AND/OR conditions and lazy evaluation', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 5 });
            sheet.createCell('A3', { value: 0 });

            // Complex condition with error in false branch
            sheet.createCell('B1', {
                formula: '=IF(AND(A1>5, A2>3), A1+A2, 1/A3)'
            });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(15);
        });
    });

    describe('Comparison with Legacy Behavior', () => {
        it('should demonstrate advantage over legacy eager evaluation', () => {
            // In legacy Calx, this would always evaluate both branches and potentially fail
            // In new Calx, only the taken branch is evaluated

            sheet.createCell('A1', { value: 100 });
            sheet.createCell('A2', { value: 0 });

            // Legacy would try to calculate both A1*2 AND 1/A2, causing error
            // New implementation only calculates A1*2
            sheet.createCell('B1', { formula: '=IF(A1>50, A1*2, 1/A2)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(200);

            // Verify no error occurred
            const cell = sheet.getCell('B1');
            expect(cell.error).toBeFalsy();
        });

        it('should handle performance benefit of lazy evaluation with expensive calculations', () => {
            sheet.createCell('A1', { value: 5 });

            // Create a complex calculation that should not execute
            for (let i = 1; i <= 100; i++) {
                sheet.createCell(`C${i}`, { value: i });
            }

            const start = performance.now();

            // If condition is true, expensive SUM should not execute
            sheet.createCell('B1', {
                formula: '=IF(A1<10, A1*2, SUM(C1:C100)*SQRT(C1)*SIN(C2)*COS(C3))'
            });

            workbook.build();
            workbook.calculate();
            const duration = performance.now() - start;

            expect(sheet.getCellValue('B1')).toBe(10);
            console.log(`Lazy evaluation avoided expensive calculation: ${duration.toFixed(2)}ms`);

            // Should be very fast since expensive branch was not evaluated
            expect(duration).toBeLessThan(100);
        });
    });

    describe('Edge Cases', () => {
        it('should handle IF with both branches having potential errors but condition prevents both', () => {
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 0 });
            sheet.createCell('A3', { value: 0 });

            // Even though both branches have errors, the correct one executes based on condition
            sheet.createCell('B1', { formula: '=IF(A1>5, A1, 1/A2)' });
            sheet.createCell('B2', { formula: '=IF(A1<5, 1/A3, A1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(10);
            expect(sheet.getCellValue('B2')).toBe(10);
        });

        it('should handle IF with empty/null values in unused branch', () => {
            sheet.createCell('A1', { value: 20 });
            // B1 intentionally not created

            sheet.createCell('C1', { formula: '=IF(A1>10, A1*2, B1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe(40);
        });

        it('should handle deeply nested IFs with lazy evaluation', () => {
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('A2', { value: 0 });

            // 5 levels deep - only first branch should execute
            sheet.createCell('B1', {
                formula: '=IF(A1=1, 100, IF(A1=2, 1/A2, IF(A1=3, 1/A2, IF(A1=4, 1/A2, 1/A2))))'
            });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(100);
        });
    });

    describe('Documentation Examples', () => {
        it('should demonstrate lazy evaluation benefit in documentation example', () => {
            // Classic example: avoid division by zero
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { value: 0 });

            // Check if B1 is zero before dividing
            sheet.createCell('C1', { formula: '=IF(B1=0, "Cannot divide by zero", A1/B1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe("Cannot divide by zero");

            // Now change B1 to non-zero
            sheet.getCell('B1').value = 2;
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe(5);
        });
    });
});
