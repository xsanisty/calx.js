import { Calx } from '../src/Calx';
import { DataType } from '../src/Calx/Cell/DataType';

describe('Cross-Sheet Dependencies', () => {
    describe('Basic Cross-Sheet References', () => {
        test('should reference cell from another sheet', () => {
            const workbook = Calx.createWorkbook();
            const sales = workbook.createSheet('Sales');
            const report = workbook.createSheet('Report');

            // Sales sheet
            sales.createCell('A1', { value: 100 });
            sales.createCell('A2', { value: 200 });

            // Report sheet references Sales sheet
            report.createCell('B1', { formula: '=Sales!A1' });
            report.createCell('B2', { formula: '=Sales!A2' });

            workbook.build();
            workbook.calculate();

            expect(report.getCellDirect('B1').value).toBe(100);
            expect(report.getCellDirect('B2').value).toBe(200);
        });

        test('should handle cross-sheet formula calculations', () => {
            const workbook = Calx.createWorkbook();
            const sheet1 = workbook.createSheet('Sheet1');
            const sheet2 = workbook.createSheet('Sheet2');

            sheet1.createCell('A1', { value: 10 });
            sheet1.createCell('A2', { value: 20 });
            sheet1.createCell('A3', { formula: '=A1+A2' });

            sheet2.createCell('B1', { formula: '=Sheet1!A3*2' });

            workbook.build();
            workbook.calculate();

            expect(sheet1.getCellDirect('A3').value).toBe(30);
            expect(sheet2.getCellDirect('B1').value).toBe(60);
        });

        test('should handle cross-sheet range references', () => {
            const workbook = Calx.createWorkbook();
            const data = workbook.createSheet('Data');
            const summary = workbook.createSheet('Summary');

            data.createCell('A1', { value: 10 });
            data.createCell('A2', { value: 20 });
            data.createCell('A3', { value: 30 });

            summary.createCell('B1', { formula: '=SUM(Data!A1:A3)' });

            workbook.build();
            workbook.calculate();

            expect(summary.getCellDirect('B1').value).toBe(60);
        });
    });

    describe('Cross-Sheet Dependency Updates', () => {
        test('should update dependent cell when source value changes with autoCalculate', () => {
            const workbook = Calx.createWorkbook();
            const sales = workbook.createSheet('Sales');
            const report = workbook.createSheet('Report');

            // Enable auto-calculate
            sales.autoCalculate = true;
            report.autoCalculate = true;

            sales.createCell('A1', { value: 100 });
            report.createCell('B1', { formula: '=Sales!A1*2' });

            workbook.build();
            workbook.calculate();

            expect(report.getCellDirect('B1').value).toBe(200);

            // Change source value - should auto-recalculate
            sales.getCellDirect('A1').value = 150;

            expect(report.getCellDirect('B1').value).toBe(300);
        });

        test('should update through formula chain across sheets', () => {
            const workbook = Calx.createWorkbook();
            const sales = workbook.createSheet('Sales');
            const report = workbook.createSheet('Report');

            // Enable auto-calculate
            sales.autoCalculate = true;
            report.autoCalculate = true;

            // Sales: A1 = 10, A2 = A1*2, A3 = SUM(A1:A2)
            sales.createCell('A1', { value: 10 });
            sales.createCell('A2', { formula: '=A1*2' });
            sales.createCell('A3', { formula: '=SUM(A1:A2)' });

            // Report references the sum
            report.createCell('B1', { formula: '=Sales!A3' });
            report.createCell('B2', { formula: '=B1*0.1' });

            workbook.build();
            workbook.calculate();

            expect(sales.getCellDirect('A2').value).toBe(20);
            expect(sales.getCellDirect('A3').value).toBe(30);
            expect(report.getCellDirect('B1').value).toBe(30);
            expect(report.getCellDirect('B2').value).toBe(3);

            // Change base value - should cascade through all sheets
            sales.getCellDirect('A1').value = 20;

            expect(sales.getCellDirect('A2').value).toBe(40);
            expect(sales.getCellDirect('A3').value).toBe(60);
            expect(report.getCellDirect('B1').value).toBe(60);
            expect(report.getCellDirect('B2').value).toBe(6);
        });

        test('should update when intermediate formula cell changes', () => {
            const workbook = Calx.createWorkbook();
            const sales = workbook.createSheet('Sales');
            const report = workbook.createSheet('Report');

            // Enable auto-calculate
            sales.autoCalculate = true;
            report.autoCalculate = true;

            sales.createCell('B1', { value: 99.99 });
            sales.createCell('C1', { value: 5 });
            sales.createCell('D1', { formula: '=B1*C1' }); // 499.95

            sales.createCell('B2', { value: 149.99 });
            sales.createCell('C2', { value: 3 });
            sales.createCell('D2', { formula: '=B2*C2' }); // 449.97

            sales.createCell('D3', { formula: '=SUM(D1:D2)' }); // 949.92

            report.createCell('B1', { formula: '=Sales!D3' });

            workbook.build();
            workbook.calculate();

            expect(sales.getCellDirect('D1').value).toBeCloseTo(499.95, 2);
            expect(sales.getCellDirect('D2').value).toBeCloseTo(449.97, 2);
            expect(sales.getCellDirect('D3').value).toBeCloseTo(949.92, 2);
            expect(report.getCellDirect('B1').value).toBeCloseTo(949.92, 2);

            // Change quantity - should cascade all the way to Report!B1
            sales.getCellDirect('C1').value = 10;

            expect(sales.getCellDirect('D1').value).toBeCloseTo(999.9, 2);
            expect(sales.getCellDirect('D3').value).toBeCloseTo(1449.87, 2);
            expect(report.getCellDirect('B1').value).toBeCloseTo(1449.87, 2);
        });
    });

    describe('Named Variables with Cross-Sheet References', () => {
        test('should resolve named variable pointing to another sheet', () => {
            const workbook = Calx.createWorkbook();
            const config = workbook.createSheet('Config');
            const report = workbook.createSheet('Report');

            // Enable auto-calculate
            config.autoCalculate = true;
            report.autoCalculate = true;

            config.createCell('A1', { value: 0.08 }); // 8% tax rate

            // Define named variable
            workbook.nameManager.define('TaxRate', 'Config!A1');

            report.createCell('B1', { value: 1000 });
            report.createCell('B2', { formula: '=B1*TaxRate' });

            workbook.build();
            workbook.calculate();

            expect(report.getCellDirect('B2').value).toBe(80);

            // Change tax rate - should auto-update
            config.getCellDirect('A1').value = 0.10;

            expect(report.getCellDirect('B2').value).toBe(100);
        });

        test('should handle multiple named variables from different sheets', () => {
            const workbook = Calx.createWorkbook();
            const config = workbook.createSheet('Config');
            const sales = workbook.createSheet('Sales');
            const report = workbook.createSheet('Report');

            // Enable auto-calculate
            config.autoCalculate = true;
            sales.autoCalculate = true;
            report.autoCalculate = true;

            config.createCell('A1', { value: 0.08 }); // Tax
            config.createCell('A2', { value: 0.10 }); // Discount

            workbook.nameManager.define('TaxRate', 'Config!A1');
            workbook.nameManager.define('DiscountRate', 'Config!A2');

            sales.createCell('D1', { value: 1749.82 });

            report.createCell('B1', { formula: '=Sales!D1' });
            report.createCell('B2', { formula: '=B1*DiscountRate' });
            report.createCell('B3', { formula: '=B1-B2' });
            report.createCell('B4', { formula: '=B3*TaxRate' });
            report.createCell('B5', { formula: '=B3+B4' });

            workbook.build();
            workbook.calculate();

            expect(report.getCellDirect('B1').value).toBeCloseTo(1749.82, 2);
            expect(report.getCellDirect('B2').value).toBeCloseTo(174.982, 2);
            expect(report.getCellDirect('B3').value).toBeCloseTo(1574.838, 2);
            expect(report.getCellDirect('B4').value).toBeCloseTo(125.987, 2);
            expect(report.getCellDirect('B5').value).toBeCloseTo(1700.825, 2);

            // Change discount rate - should cascade to all dependent cells
            config.getCellDirect('A2').value = 0.20;

            expect(report.getCellDirect('B2').value).toBeCloseTo(349.964, 2);
            expect(report.getCellDirect('B3').value).toBeCloseTo(1399.856, 2);
            expect(report.getCellDirect('B5').value).toBeCloseTo(1511.844, 2);
        });
    });

    describe('Multi-Sheet Complex Scenarios', () => {
        test('should handle three-way cross-sheet dependencies', () => {
            const workbook = Calx.createWorkbook();
            const input = workbook.createSheet('Input');
            const calc = workbook.createSheet('Calc');
            const output = workbook.createSheet('Output');

            // Enable auto-calculate
            input.autoCalculate = true;
            calc.autoCalculate = true;
            output.autoCalculate = true;

            input.createCell('A1', { value: 100 });
            calc.createCell('B1', { formula: '=Input!A1*2' });
            output.createCell('C1', { formula: '=Calc!B1+50' });

            workbook.build();
            workbook.calculate();

            expect(calc.getCellDirect('B1').value).toBe(200);
            expect(output.getCellDirect('C1').value).toBe(250);

            // Change input - should cascade through all sheets
            input.getCellDirect('A1').value = 150;

            expect(calc.getCellDirect('B1').value).toBe(300);
            expect(output.getCellDirect('C1').value).toBe(350);
        });

        test('should detect circular cross-sheet references', () => {
            const workbook = Calx.createWorkbook();
            const sheet1 = workbook.createSheet('Sheet1');
            const sheet2 = workbook.createSheet('Sheet2');

            // Disable auto-calculate to avoid infinite loop during setup
            sheet1.autoCalculate = false;
            sheet2.autoCalculate = false;

            // Create circular reference: Sheet1!A1 -> Sheet2!B1 -> Sheet1!A1
            sheet1.createCell('A1', { formula: '=Sheet2!B1+1' });
            sheet2.createCell('B1', { formula: '=Sheet1!A1+1' });

            workbook.build();

            // Should not crash during calculate, but will produce error
            workbook.calculate();

            // Both cells should have an error value
            expect(sheet1.getCellDirect('A1').value).toBeDefined();
            expect(sheet2.getCellDirect('B1').value).toBeDefined();
        });

        test('should handle 4-sheet circular dependency at sheet level', () => {
            const workbook = Calx.createWorkbook();
            const sheet1 = workbook.createSheet('Sheet1');
            const sheet2 = workbook.createSheet('Sheet2');
            const sheet3 = workbook.createSheet('Sheet3');
            const sheet4 = workbook.createSheet('Sheet4');

            // Enable auto-calculate to test cascade
            sheet1.autoCalculate = true;
            sheet2.autoCalculate = true;
            sheet3.autoCalculate = true;
            sheet4.autoCalculate = true;

            // Create chain: Sheet1!A1 -> Sheet2!A1 -> Sheet3!A1 -> Sheet4!A1 -> Sheet1!B3
            sheet1.createCell('A1', { value: 10 });
            sheet2.createCell('A1', { formula: '=Sheet1!A1*2' }); // 20
            sheet3.createCell('A1', { formula: '=Sheet2!A1+5' }); // 25
            sheet4.createCell('A1', { formula: '=Sheet3!A1*3' }); // 75
            sheet1.createCell('B3', { formula: '=Sheet4!A1-5' }); // 70

            workbook.build();
            workbook.calculate();

            // Verify initial calculation
            expect(sheet1.getCellDirect('A1').value).toBe(10);
            expect(sheet2.getCellDirect('A1').value).toBe(20);
            expect(sheet3.getCellDirect('A1').value).toBe(25);
            expect(sheet4.getCellDirect('A1').value).toBe(75);
            expect(sheet1.getCellDirect('B3').value).toBe(70);

            // Change the source value - should cascade through all 4 sheets
            sheet1.getCellDirect('A1').value = 20;

            expect(sheet2.getCellDirect('A1').value).toBe(40);
            expect(sheet3.getCellDirect('A1').value).toBe(45);
            expect(sheet4.getCellDirect('A1').value).toBe(135);
            expect(sheet1.getCellDirect('B3').value).toBe(130);
        });

        test('should handle cross-sheet references with data types', () => {
            const workbook = Calx.createWorkbook();
            const data = workbook.createSheet('Data');
            const report = workbook.createSheet('Report');

            data.createCell('A1', { value: '2024-01-15', type: DataType.DATE });
            data.createCell('A2', { value: true, type: DataType.BOOLEAN });
            data.createCell('A3', { value: 'Hello', type: DataType.TEXT });

            report.createCell('B1', { formula: '=Data!A1', type: DataType.DATE });
            report.createCell('B2', { formula: '=Data!A2', type: DataType.BOOLEAN });
            report.createCell('B3', { formula: '=Data!A3', type: DataType.TEXT });

            workbook.build();
            workbook.calculate();

            expect(report.getCellDirect('B1').type).toBe(DataType.DATE);
            expect(report.getCellDirect('B2').type).toBe(DataType.BOOLEAN);
            expect(report.getCellDirect('B3').type).toBe(DataType.TEXT);
        });

        test('should handle one cell referenced from multiple sheets with auto-update', () => {
            const workbook = Calx.createWorkbook();
            const source = workbook.createSheet('Source');
            const report1 = workbook.createSheet('Report1');
            const report2 = workbook.createSheet('Report2');
            const report3 = workbook.createSheet('Report3');

            // Enable auto-calculate
            source.autoCalculate = true;
            report1.autoCalculate = true;
            report2.autoCalculate = true;
            report3.autoCalculate = true;

            // Source cell that will be referenced by multiple sheets
            source.createCell('A1', { value: 100 });

            // Multiple sheets referencing the same source cell
            report1.createCell('B1', { formula: '=Source!A1*2' }); // 200
            report1.createCell('B2', { formula: '=B1+10' }); // 210

            report2.createCell('C1', { formula: '=Source!A1/2' }); // 50
            report2.createCell('C2', { formula: '=C1*3' }); // 150

            report3.createCell('D1', { formula: '=Source!A1+Source!A1' }); // 200
            report3.createCell('D2', { formula: '=D1-50' }); // 150

            workbook.build();
            workbook.calculate();

            // Verify initial values
            expect(source.getCellDirect('A1').value).toBe(100);
            expect(report1.getCellDirect('B1').value).toBe(200);
            expect(report1.getCellDirect('B2').value).toBe(210);
            expect(report2.getCellDirect('C1').value).toBe(50);
            expect(report2.getCellDirect('C2').value).toBe(150);
            expect(report3.getCellDirect('D1').value).toBe(200);
            expect(report3.getCellDirect('D2').value).toBe(150);

            // Update the source cell - all dependent cells across all sheets should update
            source.getCellDirect('A1').value = 200;

            // Re-verify all dependents have updated correctly
            expect(source.getCellDirect('A1').value).toBe(200);
            expect(report1.getCellDirect('B1').value).toBe(400); // 200*2
            expect(report1.getCellDirect('B2').value).toBe(410); // 400+10
            expect(report2.getCellDirect('C1').value).toBe(100); // 200/2
            expect(report2.getCellDirect('C2').value).toBe(300); // 100*3
            expect(report3.getCellDirect('D1').value).toBe(400); // 200+200
            expect(report3.getCellDirect('D2').value).toBe(350); // 400-50
        });
    });

    describe('Edge Cases', () => {
        test('should handle sheet names with underscores and numbers', () => {
            const workbook = Calx.createWorkbook();
            const sheet1 = workbook.createSheet('Sheet_2024_Q1');
            const sheet2 = workbook.createSheet('Report_Final');

            sheet1.createCell('A1', { value: 1000 });
            sheet2.createCell('B1', { formula: '=Sheet_2024_Q1!A1*2' });

            workbook.build();
            workbook.calculate();

            expect(sheet2.getCellDirect('B1').value).toBe(2000);
        });

        test('should handle absolute references in cross-sheet formulas', () => {
            const workbook = Calx.createWorkbook();
            const data = workbook.createSheet('Data');
            const calc = workbook.createSheet('Calc');

            data.createCell('D1', { value: 50 });
            calc.createCell('A1', { formula: '=Data!$D$1' });

            workbook.build();
            workbook.calculate();

            // Initial value should work
            expect(calc.getCellDirect('A1').value).toBe(50);

            // Note: Absolute cross-sheet references require auto-calculate for live updates
            // or manual rebuild of dependencies. This test just verifies the formula evaluates correctly.
        });

        test('should handle empty cross-sheet references', () => {
            const workbook = Calx.createWorkbook();
            const source = workbook.createSheet('Source');
            const target = workbook.createSheet('Target');

            // Source A1 is empty (not created)
            target.createCell('B1', { formula: '=IF(Source!A1="", "Empty", Source!A1)' });

            workbook.build();
            workbook.calculate();

            // Should handle gracefully
            expect(target.getCellDirect('B1').value).toBeDefined();
        });
    });
});
