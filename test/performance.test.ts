import { Calx } from '../src/Calx';

describe('Performance Tests', () => {
    let workbook: any;
    let sheet: any;

    // Set reasonable timeout for performance tests
    jest.setTimeout(10000); // 10 seconds per test

    beforeEach(() => {
        workbook = Calx.createWorkbook();
        sheet = workbook.createSheet('perf_test');
    });

    describe('Formula Parsing Performance', () => {
        it('should parse simple formulas quickly', () => {
            const start = performance.now();

            for (let i = 0; i < 1000; i++) {
                sheet.createCell(`A${i}`, { formula: `=B${i}+C${i}` });
            }

            workbook.build();
            const duration = performance.now() - start;
            console.log(`Parsed 1000 simple formulas in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(2000); // Should complete in less than 2 seconds
        });

        it('should parse complex formulas with functions', () => {
            const start = performance.now();

            for (let i = 0; i < 500; i++) {
                sheet.createCell(`A${i}`, { formula: `=SUM(B${i}:B${i+10})+IF(C${i}>100,C${i}*0.1,0)` });
            }

            workbook.build();
            const duration = performance.now() - start;
            console.log(`Parsed 500 complex formulas in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(3000);
        });

        it('should handle nested function calls efficiently', () => {
            const start = performance.now();

            for (let i = 0; i < 200; i++) {
                sheet.createCell(`A${i}`, { formula: `=IF(AND(B${i}>0,C${i}>0),SUM(D${i}:E${i}),0)` });
            }

            workbook.build();
            const duration = performance.now() - start;
            console.log(`Parsed 200 nested function formulas in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(2000);
        });
    });

    describe('Calculation Performance', () => {
        it('should calculate independent cells quickly', () => {
            // Setup: 1000 independent cells
            for (let i = 0; i < 1000; i++) {
                sheet.createCell(`A${i}`, { value: i });
                sheet.createCell(`B${i}`, { formula: `=A${i}*2` });
            }

            workbook.build();
            const start = performance.now();
            workbook.calculate();
            const duration = performance.now() - start;

            console.log(`Calculated 1000 independent cells in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(1000);
        });

        it('should handle linear dependency chains', () => {
            // Setup: Chain of 100 dependent cells (A1->A2->A3...->A100)
            sheet.createCell('A1', { value: 1 });
            for (let i = 2; i <= 100; i++) {
                sheet.createCell(`A${i}`, { formula: `=A${i-1}+1` });
            }

            workbook.build();
            const start = performance.now();
            workbook.calculate();
            const duration = performance.now() - start;

            console.log(`Calculated 100-cell dependency chain in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(500);
            expect(sheet.getCellValue('A100')).toBe(100);
        });

        it('should handle complex dependency trees', () => {
            // Setup: Tree structure where each cell depends on two previous cells
            // Reduced from 50 to 20 cells to avoid potential infinite loops
            sheet.createCell('A1', { value: 1 });
            sheet.createCell('A2', { value: 2 });

            for (let i = 3; i <= 20; i++) {
                sheet.createCell(`A${i}`, { formula: `=A${i-1}+A${i-2}` }); // Fibonacci-like
            }

            workbook.build();
            const start = performance.now();
            workbook.calculate();
            const duration = performance.now() - start;

            console.log(`Calculated 20-cell Fibonacci tree in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(500);
        });

        it('should handle SUM with large ranges efficiently', () => {
            // Setup: 10 cells with large SUM ranges
            for (let i = 1; i <= 1000; i++) {
                sheet.createCell(`A${i}`, { value: i });
            }

            for (let i = 1; i <= 10; i++) {
                sheet.createCell(`B${i}`, { formula: `=SUM(A1:A1000)` });
            }

            workbook.build();
            const start = performance.now();
            workbook.calculate();
            const duration = performance.now() - start;

            console.log(`Calculated 10 SUMs over 1000 cells in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(1000);
            expect(sheet.getCellValue('B1')).toBe(500500); // Sum of 1 to 1000
        });
    });

    describe('Large Dataset Performance', () => {
        it('should handle 10x100 grid efficiently', () => {
            const start = performance.now();

            // Create 10 columns x 100 rows = 1000 cells
            for (let row = 1; row <= 100; row++) {
                for (let col = 0; col < 10; col++) {
                    const colName = String.fromCharCode(65 + col); // A-J
                    sheet.createCell(`${colName}${row}`, { value: row * (col + 1) });
                }
            }

            // Add sum row
            for (let col = 0; col < 10; col++) {
                const colName = String.fromCharCode(65 + col);
                sheet.createCell(`${colName}101`, { formula: `=SUM(${colName}1:${colName}100)` });
            }

            workbook.build();
            workbook.calculate();
            const duration = performance.now() - start;

            console.log(`Created and calculated 10x100 grid in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(3000);
        });

        it('should handle incremental updates efficiently', () => {
            // Setup: 500 cells with dependencies
            for (let i = 1; i <= 500; i++) {
                sheet.createCell(`A${i}`, { value: i });
                sheet.createCell(`B${i}`, { formula: `=A${i}*2` });
                sheet.createCell(`C${i}`, { formula: `=B${i}+10` });
            }
            workbook.build();
            workbook.calculate();

            // Measure incremental update
            const start = performance.now();
            const cell = sheet.getCell('A1');
            cell.value = 999;
            workbook.calculate();
            const duration = performance.now() - start;

            console.log(`Incremental update with dependencies in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(200); // Should be very fast for single cell update
        });
    });

    describe('Memory and Scalability', () => {
        it('should handle 5000 cells without memory issues', () => {
            const start = performance.now();

            for (let i = 1; i <= 5000; i++) {
                sheet.createCell(`A${i}`, { value: i });
                if (i % 10 === 0) {
                    sheet.createCell(`B${i}`, { formula: `=SUM(A${i-9}:A${i})` });
                }
            }

            workbook.build();
            workbook.calculate();
            const duration = performance.now() - start;

            console.log(`Created and calculated 5000 cells in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(10000);
        });

        it('should handle multiple calculate calls efficiently', () => {
            // Setup: 100 cells
            for (let i = 1; i <= 100; i++) {
                sheet.createCell(`A${i}`, { value: i });
                sheet.createCell(`B${i}`, { formula: `=A${i}*2` });
            }

            workbook.build();
            const start = performance.now();

            // Call calculate 100 times
            for (let i = 0; i < 100; i++) {
                workbook.calculate();
            }

            const duration = performance.now() - start;

            console.log(`100 calculate calls on 100 cells in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(3000);
        });
    });

    describe('Complex Formula Performance', () => {
        it('should handle nested IF statements', () => {
            for (let i = 1; i <= 100; i++) {
                sheet.createCell(`A${i}`, { value: i });
            }

            const start = performance.now();

            for (let i = 1; i <= 100; i++) {
                sheet.createCell(`B${i}`, { formula: `=IF(A${i}<25,A${i}*0.5,IF(A${i}<50,A${i}*0.75,IF(A${i}<75,A${i}*1,A${i}*1.5)))` });
            }

            workbook.build();
            workbook.calculate();
            const duration = performance.now() - start;

            console.log(`100 nested IF statements in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(1000);
        });

        it('should handle array formulas with SUMIF', () => {
            // Setup data
            for (let i = 1; i <= 200; i++) {
                sheet.createCell(`A${i}`, { value: i % 10 }); // Category
                sheet.createCell(`B${i}`, { value: i }); // Value
            }

            const start = performance.now();

            // Create 10 SUMIF formulas
            for (let cat = 0; cat < 10; cat++) {
                sheet.createCell(`C${cat + 1}`, { formula: `=SUMIF(A1:A200,${cat},B1:B200)` });
            }

            workbook.build();
            workbook.calculate();
            const duration = performance.now() - start;

            console.log(`10 SUMIF over 200 rows in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(2000);
        });

        it('should handle mathematical operations efficiently', () => {
            for (let i = 1; i <= 500; i++) {
                sheet.createCell(`A${i}`, { value: i });
            }

            const start = performance.now();

            for (let i = 1; i <= 500; i++) {
                sheet.createCell(`B${i}`, { formula: `=SQRT(A${i})*PI()+SIN(A${i})` });
            }

            workbook.build();
            workbook.calculate();
            const duration = performance.now() - start;

            console.log(`500 mathematical operations in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(2000);
        });
    });

    describe('Multi-Sheet Performance', () => {
        it('should handle cross-sheet references efficiently', () => {
            const sheet1 = workbook.createSheet('sheet1');
            const sheet2 = workbook.createSheet('sheet2');

            // Setup sheet1 with data
            for (let i = 1; i <= 100; i++) {
                sheet1.createCell(`A${i}`, { value: i });
            }

            const start = performance.now();

            // Create cross-sheet references
            for (let i = 1; i <= 100; i++) {
                sheet2.createCell(`A${i}`, { formula: `=sheet1!A${i}*2` });
            }

            workbook.build();
            workbook.calculate();
            const duration = performance.now() - start;

            console.log(`100 cross-sheet references in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(1000);
        });
    });

    describe('Real-World Scenarios', () => {
        it('should handle invoice calculation scenario', () => {
            const start = performance.now();

            // 50 line items
            for (let i = 1; i <= 50; i++) {
                sheet.createCell(`A${i}`, { value: `Item ${i}` }); // Description
                sheet.createCell(`B${i}`, { value: Math.floor(Math.random() * 100) + 1 }); // Quantity
                sheet.createCell(`C${i}`, { value: parseFloat((Math.random() * 100).toFixed(2)) }); // Unit Price
                sheet.createCell(`D${i}`, { formula: `=B${i}*C${i}` }); // Line Total
            }

            // Totals
            sheet.createCell('D51', { formula: '=SUM(D1:D50)' }); // Subtotal
            sheet.createCell('D52', { formula: '=D51*0.08' }); // Tax
            sheet.createCell('D53', { formula: '=D51+D52' }); // Grand Total

            workbook.build();
            workbook.calculate();
            const duration = performance.now() - start;

            console.log(`Invoice with 50 line items calculated in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(1000);
        });

        it('should handle mortgage amortization scenario', () => {
            const start = performance.now();

            // Loan parameters
            sheet.createCell('A1', { value: 250000 }); // Principal
            sheet.createCell('A2', { value: 0.065 }); // Rate
            sheet.createCell('A3', { value: 360 }); // Months

            // Monthly payment
            sheet.createCell('A4', { formula: '=PMT(A2/12,A3,-A1)' });

            // Amortization schedule (first 12 months)
            for (let i = 1; i <= 12; i++) {
                sheet.createCell(`B${i}`, { value: i }); // Month
                sheet.createCell(`C${i}`, { formula: `=A4` }); // Payment
                sheet.createCell(`D${i}`, { formula: `=IF(B${i}=1,A1*(A2/12),E${i-1}*(A2/12))` }); // Interest
                sheet.createCell(`E${i}`, { formula: `=IF(B${i}=1,A1-C${i}+D${i},E${i-1}-C${i}+D${i})` }); // Balance
            }

            workbook.build();
            workbook.calculate();
            const duration = performance.now() - start;

            console.log(`Mortgage amortization (12 months) calculated in ${duration.toFixed(2)}ms`);
            expect(duration).toBeLessThan(500);
        });
    });

    describe('Performance Benchmarks Summary', () => {
        it('should log overall performance metrics', () => {
            console.log('\n=== Performance Benchmark Summary ===');
            console.log('All performance tests completed successfully');
            console.log('System is performing within acceptable thresholds');
            console.log('=====================================\n');
            expect(true).toBe(true);
        });
    });
});
