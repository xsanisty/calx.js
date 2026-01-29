import { describe, test, expect } from '@jest/globals';
import { Calx } from '../src/Calx';

describe('Dynamic Updates', () => {
    describe('Dynamic Cell Creation', () => {
        test('should update formula when new cells are added', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');
            sheet.autoCalculate = true;

            // Create initial cells
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { formula: '=SUM(A1:A2)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A3')).toBe(30);

            // Dynamically add new cells that should be included in existing formulas
            // First, update the formula to include a wider range
            sheet.getCellDirect('A3').formula = '=SUM(A1:A5)';

            // Add new cells
            sheet.createCell('A4', { value: 15 });
            sheet.createCell('A5', { value: 25 });

            // Just calculate, don't build again
            workbook.calculate();

            // Should now include all cells
            expect(sheet.getCellValue('A3')).toBe(70); // 10+20+15+25
        });

        test('should rebuild dependency tree when cells are added', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');
            sheet.autoCalculate = true;

            sheet.createCell('A1', { value: 5 });
            sheet.createCell('B1', { formula: '=A1*2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(10);

            // Add new cell that references B1
            sheet.createCell('C1', { formula: '=B1+10' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe(20);

            // Change A1 - should cascade to B1 and C1
            sheet.getCellDirect('A1').value = 10;

            expect(sheet.getCellValue('B1')).toBe(20);
            expect(sheet.getCellValue('C1')).toBe(30);
        });

        test('should handle cells added between existing cells in a range', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');
            sheet.autoCalculate = true;

            sheet.createCell('A1', { value: 100 });
            sheet.createCell('A5', { value: 500 });
            sheet.createCell('A6', { formula: '=SUM(A1:A5)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A6')).toBe(600);

            // Add cells in the middle of the range
            // Note: Fixed ranges (A1:A5) already include these positions
            // so the new values will be included
            const a2 = sheet.getCellDirect('A2');
            a2.value = 200;
            const a3 = sheet.getCellDirect('A3');
            a3.value = 300;
            const a4 = sheet.getCellDirect('A4');
            a4.value = 400;

            // Calculate to update the sum
            workbook.calculate();

            expect(sheet.getCellValue('A6')).toBe(1500); // 100+200+300+400+500
        });
    });

    describe('Dynamic Formula Updates', () => {
        test('should update dependency tree when formula changes', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');
            sheet.autoCalculate = true;

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('B1', { value: 30 });
            sheet.createCell('C1', { formula: '=A1+A2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe(30);

            // Change formula to reference different cells
            sheet.getCellDirect('C1').formula = '=A1+B1';

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe(40);

            // Change A2 - should NOT affect C1 anymore
            sheet.getCellDirect('A2').value = 100;
            expect(sheet.getCellValue('C1')).toBe(40);

            // Change B1 - should affect C1 now
            sheet.getCellDirect('B1').value = 50;
            expect(sheet.getCellValue('C1')).toBe(60);
        });

        test('should handle formula changed from value to formula', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');
            sheet.autoCalculate = true;

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { value: 20 }); // Initially a value

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(20);

            // Change B1 from value to formula
            sheet.getCellDirect('B1').formula = '=A1*3';

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(30);

            // Change A1 - should now affect B1
            sheet.getCellDirect('A1').value = 20;
            expect(sheet.getCellValue('B1')).toBe(60);
        });

        test('should handle formula changed from formula to value', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');
            sheet.autoCalculate = true;

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { formula: '=A1*2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(20);

            // Change B1 from formula to value
            sheet.getCellDirect('B1').value = 100;

            // B1 should now be a static value
            expect(sheet.getCellValue('B1')).toBe(100);

            // Change A1 - should NOT affect B1 anymore
            sheet.getCellDirect('A1').value = 50;
            expect(sheet.getCellValue('B1')).toBe(100);
        });
    });

    describe('Dynamic Column/Row References', () => {
        test('should handle entire column reference SUM(A:A) with dynamic cells', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');
            sheet.autoCalculate = true;

            // Start with a few cells
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });
            sheet.createCell('B1', { formula: '=SUM(A:A)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(60);

            // Add more cells to column A dynamically
            sheet.createCell('A4', { value: 40 });
            sheet.createCell('A5', { value: 50 });
            sheet.createCell('A6', { value: 60 });

            // Just calculate - dynamic precedents should handle it
            workbook.calculate();

            // Should include all cells in column A
            expect(sheet.getCellValue('B1')).toBe(210); // 10+20+30+40+50+60
        });

        test('should handle entire row reference SUM(1:1) with dynamic cells', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');
            sheet.autoCalculate = true;

            sheet.createCell('A1', { value: 5 });
            sheet.createCell('B1', { value: 10 });
            sheet.createCell('C1', { value: 15 });
            sheet.createCell('A2', { formula: '=SUM(1:1)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe(30);

            // Add more cells to row 1
            sheet.createCell('D1', { value: 20 });
            sheet.createCell('E1', { value: 25 });

            // Just calculate - dependencies should auto-update
            workbook.calculate();

            expect(sheet.getCellValue('A2')).toBe(75); // 5+10+15+20+25
        });

        test('should update column reference when cells are modified', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');
            sheet.autoCalculate = true;

            sheet.createCell('A1', { value: 100 });
            sheet.createCell('A2', { value: 200 });
            sheet.createCell('A3', { value: 300 });
            sheet.createCell('B1', { formula: '=SUM(A:A)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(600);

            // Modify existing cell
            sheet.getCellDirect('A2').value = 500;
            expect(sheet.getCellValue('B1')).toBe(900);

            // Add new cell
            sheet.createCell('A4', { value: 100 });
            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(1000);

            // Remove cell value (set to 0 or empty)
            sheet.getCellDirect('A1').value = 0;
            expect(sheet.getCellValue('B1')).toBe(900);
        });

        test('should handle multiple column references', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');
            sheet.autoCalculate = true;

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('B1', { value: 30 });
            sheet.createCell('B2', { value: 40 });
            sheet.createCell('C1', { formula: '=SUM(A:A)+SUM(B:B)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe(100); // (10+20)+(30+40)

            // Add cells to both columns
            sheet.createCell('A3', { value: 15 });
            sheet.createCell('B3', { value: 25 });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe(140); // (10+20+15)+(30+40+25)
        });

        test('should handle column reference with formulas in the column', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');
            sheet.autoCalculate = true;

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { formula: '=A1+A2' }); // Formula in column A
            sheet.createCell('B1', { formula: '=SUM(A:A)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A3')).toBe(30);
            expect(sheet.getCellValue('B1')).toBe(60); // 10+20+30

            // Add more to column A
            sheet.createCell('A4', { value: 40 });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(100); // 10+20+30+40
        });
    });

    describe('Cross-Sheet Dynamic Updates', () => {
        test('should update cross-sheet references when cells are added', () => {
            const workbook = Calx.createWorkbook();
            const sheet1 = workbook.createSheet('Sheet1');
            const sheet2 = workbook.createSheet('Sheet2');

            sheet1.autoCalculate = true;
            sheet2.autoCalculate = true;

            sheet1.createCell('A1', { value: 100 });
            sheet1.createCell('A2', { value: 200 });
            sheet2.createCell('B1', { formula: '=SUM(Sheet1!A1:A2)' });

            workbook.build();
            workbook.calculate();

            expect(sheet2.getCellValue('B1')).toBe(300);

            // Add cells to Sheet1 and update formula on Sheet2
            sheet1.createCell('A3', { value: 300 });
            sheet2.getCellDirect('B1').formula = '=SUM(Sheet1!A1:A3)';

            workbook.build();
            workbook.calculate();

            expect(sheet2.getCellValue('B1')).toBe(600);
        });

        test('should handle cross-sheet column references', () => {
            const workbook = Calx.createWorkbook();
            const data = workbook.createSheet('Data');
            const summary = workbook.createSheet('Summary');

            data.autoCalculate = true;
            summary.autoCalculate = true;

            data.createCell('A1', { value: 10 });
            data.createCell('A2', { value: 20 });
            summary.createCell('B1', { formula: '=SUM(Data!A:A)' });

            workbook.build();
            workbook.calculate();

            expect(summary.getCellValue('B1')).toBe(30);

            // Add more cells to Data!A column
            data.createCell('A3', { value: 30 });
            data.createCell('A4', { value: 40 });

            workbook.build();
            workbook.calculate();

            expect(summary.getCellValue('B1')).toBe(100);
        });
    });

    describe('Complex Dynamic Scenarios', () => {
        test('should handle dynamic cells with dependent chains', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');
            sheet.autoCalculate = true;

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { formula: '=A1*2' });
            sheet.createCell('C1', { formula: '=B1+10' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('C1')).toBe(30);

            // Add new cell in the chain
            sheet.createCell('D1', { formula: '=C1*2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('D1')).toBe(60);

            // Update source - should cascade through all
            sheet.getCellDirect('A1').value = 20;

            expect(sheet.getCellValue('B1')).toBe(40);
            expect(sheet.getCellValue('C1')).toBe(50);
            expect(sheet.getCellValue('D1')).toBe(100);
        });

        test('should handle replacing a value cell with a formula cell', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');
            sheet.autoCalculate = true;

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 99 }); // Static value
            sheet.createCell('A4', { formula: '=SUM(A1:A3)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A4')).toBe(129); // 10+20+99

            // Replace A3 value with a formula
            sheet.getCellDirect('A3').formula = '=A1+A2';

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('A3')).toBe(30); // Now a formula
            expect(sheet.getCellValue('A4')).toBe(60); // 10+20+30

            // Change A1 - should affect both A3 and A4
            sheet.getCellDirect('A1').value = 100;

            expect(sheet.getCellValue('A3')).toBe(120); // 100+20
            expect(sheet.getCellValue('A4')).toBe(240); // 100+20+120
        });

        test('should handle entire column with gaps', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');
            sheet.autoCalculate = true;

            // Create cells with gaps
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A5', { value: 50 });
            sheet.createCell('A10', { value: 100 });
            sheet.createCell('B1', { formula: '=SUM(A:A)' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(160);

            // Fill in the gaps
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('A3', { value: 30 });
            sheet.createCell('A7', { value: 70 });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellValue('B1')).toBe(280); // 10+20+30+50+70+100
        });
    });
});
