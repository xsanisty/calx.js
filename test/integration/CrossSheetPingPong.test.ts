import { Calx } from '../../src/Calx';

/**
 * Tests for complex cross-sheet dependencies with "ping-pong" patterns
 * where dependencies go back and forth between sheets rather than one-way
 */
describe('Cross-Sheet Ping-Pong Dependencies', () => {
    describe('Two-Sheet Bidirectional References', () => {
        test('should handle A→B→A pattern (non-circular)', () => {
            const workbook = Calx.createWorkbook();
            const sheetA = workbook.createSheet('SheetA');
            const sheetB = workbook.createSheet('SheetB');

            sheetA.autoCalculate = true;
            sheetB.autoCalculate = true;

            // SheetA!A1 has a base value
            sheetA.createCell('A1', { value: 10 });

            // SheetB!B1 depends on SheetA!A1
            sheetB.createCell('B1', { formula: '=SheetA!A1 * 2' }); // 20

            // SheetA!A2 depends on SheetB!B1 (back to SheetA)
            sheetA.createCell('A2', { formula: '=SheetB!B1 + 5' }); // 25

            // SheetB!B2 depends on SheetA!A2 (back to SheetB)
            sheetB.createCell('B2', { formula: '=SheetA!A2 * 3' }); // 75

            workbook.build();
            workbook.calculate();

            expect(sheetA.getCellDirect('A1').value).toBe(10);
            expect(sheetB.getCellDirect('B1').value).toBe(20);
            expect(sheetA.getCellDirect('A2').value).toBe(25);
            expect(sheetB.getCellDirect('B2').value).toBe(75);

            // Change base value - should cascade through ping-pong pattern
            sheetA.getCellDirect('A1').value = 20;

            expect(sheetB.getCellDirect('B1').value).toBe(40);
            expect(sheetA.getCellDirect('A2').value).toBe(45);
            expect(sheetB.getCellDirect('B2').value).toBe(135);
        });

        test('should handle multiple ping-pong chains in same sheets', () => {
            const workbook = Calx.createWorkbook();
            const sheetA = workbook.createSheet('SheetA');
            const sheetB = workbook.createSheet('SheetB');

            sheetA.autoCalculate = true;
            sheetB.autoCalculate = true;

            // Chain 1: A1 → B1 → A2 → B2
            sheetA.createCell('A1', { value: 10 });
            sheetB.createCell('B1', { formula: '=SheetA!A1 * 2' });
            sheetA.createCell('A2', { formula: '=SheetB!B1 + 10' });
            sheetB.createCell('B2', { formula: '=SheetA!A2 - 5' });

            // Chain 2: A3 → B3 → A4 → B4
            sheetA.createCell('A3', { value: 5 });
            sheetB.createCell('B3', { formula: '=SheetA!A3 * 4' });
            sheetA.createCell('A4', { formula: '=SheetB!B3 / 2' });
            sheetB.createCell('B4', { formula: '=SheetA!A4 + 100' });

            workbook.build();
            workbook.calculate();

            // Verify chain 1
            expect(sheetA.getCellDirect('A1').value).toBe(10);
            expect(sheetB.getCellDirect('B1').value).toBe(20);
            expect(sheetA.getCellDirect('A2').value).toBe(30);
            expect(sheetB.getCellDirect('B2').value).toBe(25);

            // Verify chain 2
            expect(sheetA.getCellDirect('A3').value).toBe(5);
            expect(sheetB.getCellDirect('B3').value).toBe(20);
            expect(sheetA.getCellDirect('A4').value).toBe(10);
            expect(sheetB.getCellDirect('B4').value).toBe(110);

            // Change both base values
            sheetA.getCellDirect('A1').value = 15;
            sheetA.getCellDirect('A3').value = 10;

            // Verify chain 1 updated
            expect(sheetB.getCellDirect('B1').value).toBe(30);
            expect(sheetA.getCellDirect('A2').value).toBe(40);
            expect(sheetB.getCellDirect('B2').value).toBe(35);

            // Verify chain 2 updated
            expect(sheetB.getCellDirect('B3').value).toBe(40);
            expect(sheetA.getCellDirect('A4').value).toBe(20);
            expect(sheetB.getCellDirect('B4').value).toBe(120);
        });
    });

    describe('Three-Sheet Ping-Pong Patterns', () => {
        test('should handle A→B→C→A→B pattern', () => {
            const workbook = Calx.createWorkbook();
            const sheetA = workbook.createSheet('SheetA');
            const sheetB = workbook.createSheet('SheetB');
            const sheetC = workbook.createSheet('SheetC');

            sheetA.autoCalculate = true;
            sheetB.autoCalculate = true;
            sheetC.autoCalculate = true;

            // Start in SheetA
            sheetA.createCell('A1', { value: 100 });

            // Go to SheetB
            sheetB.createCell('B1', { formula: '=SheetA!A1 * 0.8' }); // 80 (discount)

            // Go to SheetC
            sheetC.createCell('C1', { formula: '=SheetB!B1 * 1.1' }); // 88 (tax)

            // Back to SheetA (different cell)
            sheetA.createCell('A2', { formula: '=SheetC!C1 + 12' }); // 100 (shipping)

            // Back to SheetB (different cell)
            sheetB.createCell('B2', { formula: '=SheetA!A2 * 0.05' }); // 5 (commission)

            // Back to SheetC (different cell)
            sheetC.createCell('C2', { formula: '=SheetB!B2 * 2' }); // 10 (bonus)

            workbook.build();
            workbook.calculate();

            expect(sheetA.getCellDirect('A1').value).toBe(100);
            expect(sheetB.getCellDirect('B1').value).toBe(80);
            expect(sheetC.getCellDirect('C1').value).toBe(88);
            expect(sheetA.getCellDirect('A2').value).toBe(100);
            expect(sheetB.getCellDirect('B2').value).toBe(5);
            expect(sheetC.getCellDirect('C2').value).toBe(10);

            // Change base price
            sheetA.getCellDirect('A1').value = 200;

            expect(sheetB.getCellDirect('B1').value).toBe(160);
            expect(sheetC.getCellDirect('C1').value).toBe(176);
            expect(sheetA.getCellDirect('A2').value).toBe(188);
            expect(sheetB.getCellDirect('B2').value).toBe(9.4);
            expect(sheetC.getCellDirect('C2').value).toBe(18.8);
        });

        test('should handle A→B→A→C→B→C pattern', () => {
            const workbook = Calx.createWorkbook();
            const sheetA = workbook.createSheet('SheetA');
            const sheetB = workbook.createSheet('SheetB');
            const sheetC = workbook.createSheet('SheetC');

            sheetA.autoCalculate = true;
            sheetB.autoCalculate = true;
            sheetC.autoCalculate = true;

            // Complex ping-pong between all three sheets
            sheetA.createCell('A1', { value: 50 });
            sheetB.createCell('B1', { formula: '=SheetA!A1 + 10' }); // 60
            sheetA.createCell('A2', { formula: '=SheetB!B1 * 2' }); // 120
            sheetC.createCell('C1', { formula: '=SheetA!A2 - 20' }); // 100
            sheetB.createCell('B2', { formula: '=SheetC!C1 / 4' }); // 25
            sheetC.createCell('C2', { formula: '=SheetB!B2 + SheetB!B1' }); // 85

            workbook.build();
            workbook.calculate();

            expect(sheetA.getCellDirect('A1').value).toBe(50);
            expect(sheetB.getCellDirect('B1').value).toBe(60);
            expect(sheetA.getCellDirect('A2').value).toBe(120);
            expect(sheetC.getCellDirect('C1').value).toBe(100);
            expect(sheetB.getCellDirect('B2').value).toBe(25);
            expect(sheetC.getCellDirect('C2').value).toBe(85);

            // Change base value
            sheetA.getCellDirect('A1').value = 100;

            expect(sheetB.getCellDirect('B1').value).toBe(110);
            expect(sheetA.getCellDirect('A2').value).toBe(220);
            expect(sheetC.getCellDirect('C1').value).toBe(200);
            expect(sheetB.getCellDirect('B2').value).toBe(50);
            expect(sheetC.getCellDirect('C2').value).toBe(160);
        });
    });

    describe('Four-Sheet Complex Ping-Pong Patterns', () => {
        test('should handle A→B→A→C→B→D→C→A pattern', () => {
            const workbook = Calx.createWorkbook();
            const sheetA = workbook.createSheet('SheetA');
            const sheetB = workbook.createSheet('SheetB');
            const sheetC = workbook.createSheet('SheetC');
            const sheetD = workbook.createSheet('SheetD');

            sheetA.autoCalculate = true;
            sheetB.autoCalculate = true;
            sheetC.autoCalculate = true;
            sheetD.autoCalculate = true;

            // Create complex ping-pong pattern across 4 sheets
            sheetA.createCell('A1', { value: 1000 }); // Base value
            sheetB.createCell('B1', { formula: '=SheetA!A1 * 0.9' }); // 900 (10% off)
            sheetA.createCell('A2', { formula: '=SheetB!B1 + 100' }); // 1000 (add fee)
            sheetC.createCell('C1', { formula: '=SheetA!A2 * 1.05' }); // 1050 (5% tax)
            sheetB.createCell('B2', { formula: '=SheetC!C1 - 50' }); // 1000 (rebate)
            sheetD.createCell('D1', { formula: '=SheetB!B2 / 10' }); // 100 (points)
            sheetC.createCell('C2', { formula: '=SheetD!D1 * 3' }); // 300 (bonus)
            sheetA.createCell('A3', { formula: '=SheetC!C2 + SheetD!D1' }); // 400 (rewards)

            workbook.build();
            workbook.calculate();

            // Verify initial calculations
            expect(sheetA.getCellDirect('A1').value).toBe(1000);
            expect(sheetB.getCellDirect('B1').value).toBe(900);
            expect(sheetA.getCellDirect('A2').value).toBe(1000);
            expect(sheetC.getCellDirect('C1').value).toBe(1050);
            expect(sheetB.getCellDirect('B2').value).toBe(1000);
            expect(sheetD.getCellDirect('D1').value).toBe(100);
            expect(sheetC.getCellDirect('C2').value).toBe(300);
            expect(sheetA.getCellDirect('A3').value).toBe(400);

            // Change base value and verify cascade
            sheetA.getCellDirect('A1').value = 2000;

            expect(sheetB.getCellDirect('B1').value).toBe(1800);
            expect(sheetA.getCellDirect('A2').value).toBe(1900);
            expect(sheetC.getCellDirect('C1').value).toBe(1995);
            expect(sheetB.getCellDirect('B2').value).toBe(1945);
            expect(sheetD.getCellDirect('D1').value).toBe(194.5);
            expect(sheetC.getCellDirect('C2').value).toBe(583.5);
            expect(sheetA.getCellDirect('A3').value).toBe(778);
        });

        test('should handle diamond pattern with ping-pong: A→B,C→D (B↔D, C↔D)', () => {
            const workbook = Calx.createWorkbook();
            const sheetA = workbook.createSheet('SheetA');
            const sheetB = workbook.createSheet('SheetB');
            const sheetC = workbook.createSheet('SheetC');
            const sheetD = workbook.createSheet('SheetD');

            sheetA.autoCalculate = true;
            sheetB.autoCalculate = true;
            sheetC.autoCalculate = true;
            sheetD.autoCalculate = true;

            // SheetA splits to B and C
            sheetA.createCell('A1', { value: 100 });
            sheetB.createCell('B1', { formula: '=SheetA!A1 * 2' }); // 200
            sheetC.createCell('C1', { formula: '=SheetA!A1 * 3' }); // 300

            // SheetD depends on both B and C
            sheetD.createCell('D1', { formula: '=SheetB!B1 + SheetC!C1' }); // 500

            // Ping-pong: B and C both depend on D (different cells)
            sheetB.createCell('B2', { formula: '=SheetD!D1 / 10' }); // 50
            sheetC.createCell('C2', { formula: '=SheetD!D1 / 5' }); // 100

            // More ping-pong: D depends on B2 and C2
            sheetD.createCell('D2', { formula: '=SheetB!B2 + SheetC!C2' }); // 150

            workbook.build();
            workbook.calculate();

            expect(sheetA.getCellDirect('A1').value).toBe(100);
            expect(sheetB.getCellDirect('B1').value).toBe(200);
            expect(sheetC.getCellDirect('C1').value).toBe(300);
            expect(sheetD.getCellDirect('D1').value).toBe(500);
            expect(sheetB.getCellDirect('B2').value).toBe(50);
            expect(sheetC.getCellDirect('C2').value).toBe(100);
            expect(sheetD.getCellDirect('D2').value).toBe(150);

            // Change base value
            sheetA.getCellDirect('A1').value = 50;

            expect(sheetB.getCellDirect('B1').value).toBe(100);
            expect(sheetC.getCellDirect('C1').value).toBe(150);
            expect(sheetD.getCellDirect('D1').value).toBe(250);
            expect(sheetB.getCellDirect('B2').value).toBe(25);
            expect(sheetC.getCellDirect('C2').value).toBe(50);
            expect(sheetD.getCellDirect('D2').value).toBe(75);
        });

        test('should handle cascading updates with ranges across sheets', () => {
            const workbook = Calx.createWorkbook();
            const sales = workbook.createSheet('Sales');
            const taxes = workbook.createSheet('Taxes');
            const totals = workbook.createSheet('Totals');
            const reports = workbook.createSheet('Reports');

            sales.autoCalculate = true;
            taxes.autoCalculate = true;
            totals.autoCalculate = true;
            reports.autoCalculate = true;

            // Sales data
            sales.createCell('A1', { value: 100 });
            sales.createCell('A2', { value: 200 });
            sales.createCell('A3', { value: 300 });

            // Taxes references sales range
            taxes.createCell('B1', { formula: '=SUM(Sales!A1:A3) * 0.1' }); // 60

            // Totals references both (ping-pong to Sales)
            totals.createCell('C1', { formula: '=SUM(Sales!A1:A3) + Taxes!B1' }); // 660
            sales.createCell('A4', { formula: '=Totals!C1 / 100' }); // 6.6

            // Reports references all sheets (including updated Sales!A4)
            reports.createCell('D1', { formula: '=SUM(Sales!A1:A4)' }); // 606.6
            reports.createCell('D2', { formula: '=Reports!D1 + Taxes!B1' }); // 666.6

            // Ping-pong back to Taxes
            taxes.createCell('B2', { formula: '=Reports!D2 * 0.05' }); // 33.33

            workbook.build();
            workbook.calculate();

            expect(sales.getCellDirect('A1').value).toBe(100);
            expect(sales.getCellDirect('A2').value).toBe(200);
            expect(sales.getCellDirect('A3').value).toBe(300);
            expect(taxes.getCellDirect('B1').value).toBe(60);
            expect(totals.getCellDirect('C1').value).toBe(660);
            expect(sales.getCellDirect('A4').value).toBe(6.6);
            expect(reports.getCellDirect('D1').value).toBe(606.6);
            expect(reports.getCellDirect('D2').value).toBe(666.6);
            expect(taxes.getCellDirect('B2').value).toBeCloseTo(33.33, 2);

            // Change one value and verify entire cascade
            sales.getCellDirect('A1').value = 150;

            expect(taxes.getCellDirect('B1').value).toBe(65);
            expect(totals.getCellDirect('C1').value).toBe(715);
            expect(sales.getCellDirect('A4').value).toBe(7.15);
            expect(reports.getCellDirect('D1').value).toBe(657.15);
            expect(reports.getCellDirect('D2').value).toBe(722.15);
            expect(taxes.getCellDirect('B2').value).toBeCloseTo(36.1075, 2);
        });
    });

    describe('Edge Cases and Stress Tests', () => {
        test('should handle very long ping-pong chain (10 hops)', () => {
            const workbook = Calx.createWorkbook();
            const sheetA = workbook.createSheet('SheetA');
            const sheetB = workbook.createSheet('SheetB');

            sheetA.autoCalculate = true;
            sheetB.autoCalculate = true;

            // Create 10-hop ping-pong chain
            sheetA.createCell('A1', { value: 1 });
            sheetB.createCell('B1', { formula: '=SheetA!A1 + 1' }); // 2
            sheetA.createCell('A2', { formula: '=SheetB!B1 + 1' }); // 3
            sheetB.createCell('B2', { formula: '=SheetA!A2 + 1' }); // 4
            sheetA.createCell('A3', { formula: '=SheetB!B2 + 1' }); // 5
            sheetB.createCell('B3', { formula: '=SheetA!A3 + 1' }); // 6
            sheetA.createCell('A4', { formula: '=SheetB!B3 + 1' }); // 7
            sheetB.createCell('B4', { formula: '=SheetA!A4 + 1' }); // 8
            sheetA.createCell('A5', { formula: '=SheetB!B4 + 1' }); // 9
            sheetB.createCell('B5', { formula: '=SheetA!A5 + 1' }); // 10

            workbook.build();
            workbook.calculate();

            expect(sheetA.getCellDirect('A1').value).toBe(1);
            expect(sheetB.getCellDirect('B1').value).toBe(2);
            expect(sheetA.getCellDirect('A2').value).toBe(3);
            expect(sheetB.getCellDirect('B2').value).toBe(4);
            expect(sheetA.getCellDirect('A3').value).toBe(5);
            expect(sheetB.getCellDirect('B3').value).toBe(6);
            expect(sheetA.getCellDirect('A4').value).toBe(7);
            expect(sheetB.getCellDirect('B4').value).toBe(8);
            expect(sheetA.getCellDirect('A5').value).toBe(9);
            expect(sheetB.getCellDirect('B5').value).toBe(10);

            // Change base and verify all cascade
            sheetA.getCellDirect('A1').value = 10;

            expect(sheetB.getCellDirect('B1').value).toBe(11);
            expect(sheetA.getCellDirect('A2').value).toBe(12);
            expect(sheetB.getCellDirect('B2').value).toBe(13);
            expect(sheetA.getCellDirect('A3').value).toBe(14);
            expect(sheetB.getCellDirect('B3').value).toBe(15);
            expect(sheetA.getCellDirect('A4').value).toBe(16);
            expect(sheetB.getCellDirect('B4').value).toBe(17);
            expect(sheetA.getCellDirect('A5').value).toBe(18);
            expect(sheetB.getCellDirect('B5').value).toBe(19);
        });

        test('should handle mixed one-way and ping-pong patterns', () => {
            const workbook = Calx.createWorkbook();
            const input = workbook.createSheet('Input');
            const processing = workbook.createSheet('Processing');
            const output = workbook.createSheet('Output');

            input.autoCalculate = true;
            processing.autoCalculate = true;
            output.autoCalculate = true;

            // One-way: Input → Processing
            input.createCell('A1', { value: 100 });
            processing.createCell('B1', { formula: '=Input!A1 * 2' }); // 200

            // Ping-pong: Processing ↔ Output
            output.createCell('C1', { formula: '=Processing!B1 + 50' }); // 250
            processing.createCell('B2', { formula: '=Output!C1 - 30' }); // 220

            // One-way: Output → Input (different cell, making it non-circular)
            output.createCell('C2', { formula: '=Processing!B2 * 0.5' }); // 110
            input.createCell('A2', { formula: '=Output!C2 + 10' }); // 120

            workbook.build();
            workbook.calculate();

            expect(input.getCellDirect('A1').value).toBe(100);
            expect(processing.getCellDirect('B1').value).toBe(200);
            expect(output.getCellDirect('C1').value).toBe(250);
            expect(processing.getCellDirect('B2').value).toBe(220);
            expect(output.getCellDirect('C2').value).toBe(110);
            expect(input.getCellDirect('A2').value).toBe(120);

            // Change and verify cascade
            input.getCellDirect('A1').value = 200;

            expect(processing.getCellDirect('B1').value).toBe(400);
            expect(output.getCellDirect('C1').value).toBe(450);
            expect(processing.getCellDirect('B2').value).toBe(420);
            expect(output.getCellDirect('C2').value).toBe(210);
            expect(input.getCellDirect('A2').value).toBe(220);
        });
    });

    describe('Circular Ping-Pong Patterns', () => {
        test('should detect simple circular: A→B→A (same cell)', () => {
            const workbook = Calx.createWorkbook();
            const sheetA = workbook.createSheet('SheetA');
            const sheetB = workbook.createSheet('SheetB');

            // NOTE: autoCalculate = false to prevent infinite loops during test
            sheetA.autoCalculate = false;
            sheetB.autoCalculate = false;

            // Create circular reference: A1 → B1 → A1
            sheetA.createCell('A1', { formula: '=SheetB!B1 + 1' });
            sheetB.createCell('B1', { formula: '=SheetA!A1 + 1' });

            workbook.build();

            // Should detect circular reference
            expect(workbook.isInCircularReference(sheetA.getCellDirect('A1'), 'SheetA')).toBe(true);
            expect(workbook.isInCircularReference(sheetB.getCellDirect('B1'), 'SheetB')).toBe(true);
        });

        test('should detect 3-sheet circular ping-pong: A→B→C→A', () => {
            const workbook = Calx.createWorkbook();
            const sheetA = workbook.createSheet('SheetA');
            const sheetB = workbook.createSheet('SheetB');
            const sheetC = workbook.createSheet('SheetC');

            // Disable autoCalculate to prevent infinite loops before build()
            sheetA.autoCalculate = false;
            sheetB.autoCalculate = false;
            sheetC.autoCalculate = false;

            // Create 3-sheet circular: A1 → B1 → C1 → A1
            sheetA.createCell('A1', { formula: '=SheetC!C1 + 1' });
            sheetB.createCell('B1', { formula: '=SheetA!A1 + 1' });
            sheetC.createCell('C1', { formula: '=SheetB!B1 + 1' });

            workbook.build();

            // All should be circular
            expect(workbook.isInCircularReference(sheetA.getCellDirect('A1'), 'SheetA')).toBe(true);
            expect(workbook.isInCircularReference(sheetB.getCellDirect('B1'), 'SheetB')).toBe(true);
            expect(workbook.isInCircularReference(sheetC.getCellDirect('C1'), 'SheetC')).toBe(true);
        });

        test('should detect 4-sheet circular with ping-pong: A→B→A→C→B→D→C→A', () => {
            const workbook = Calx.createWorkbook();
            const sheetA = workbook.createSheet('SheetA');
            const sheetB = workbook.createSheet('SheetB');
            const sheetC = workbook.createSheet('SheetC');
            const sheetD = workbook.createSheet('SheetD');

            // Disable autoCalculate to prevent infinite loops before build()
            sheetA.autoCalculate = false;
            sheetB.autoCalculate = false;
            sheetC.autoCalculate = false;
            sheetD.autoCalculate = false;

            // Complex circular with ping-pong between sheets
            sheetA.createCell('A1', { formula: '=SheetC!C2 + 1' }); // End of circle
            sheetB.createCell('B1', { formula: '=SheetA!A1 + 1' }); // From A
            sheetA.createCell('A2', { formula: '=SheetB!B1 + 1' }); // Back to A (ping-pong)
            sheetC.createCell('C1', { formula: '=SheetA!A2 + 1' }); // To C
            sheetB.createCell('B2', { formula: '=SheetC!C1 + 1' }); // Back to B (ping-pong)
            sheetD.createCell('D1', { formula: '=SheetB!B2 + 1' }); // To D
            sheetC.createCell('C2', { formula: '=SheetD!D1 + 1' }); // Back to C (closes circle)

            workbook.build();

            // All should be detected as circular
            expect(workbook.isInCircularReference(sheetA.getCellDirect('A1'), 'SheetA')).toBe(true);
            expect(workbook.isInCircularReference(sheetB.getCellDirect('B1'), 'SheetB')).toBe(true);
            expect(workbook.isInCircularReference(sheetA.getCellDirect('A2'), 'SheetA')).toBe(true);
            expect(workbook.isInCircularReference(sheetC.getCellDirect('C1'), 'SheetC')).toBe(true);
            expect(workbook.isInCircularReference(sheetB.getCellDirect('B2'), 'SheetB')).toBe(true);
            expect(workbook.isInCircularReference(sheetD.getCellDirect('D1'), 'SheetD')).toBe(true);
            expect(workbook.isInCircularReference(sheetC.getCellDirect('C2'), 'SheetC')).toBe(true);
        });

        test('should detect mixed circular and non-circular ping-pong', () => {
            const workbook = Calx.createWorkbook();
            const sheetA = workbook.createSheet('SheetA');
            const sheetB = workbook.createSheet('SheetB');
            const sheetC = workbook.createSheet('SheetC');

            // Disable autoCalculate to prevent infinite loops in circular cells
            sheetA.autoCalculate = false;
            sheetB.autoCalculate = false;
            sheetC.autoCalculate = false;

            // Non-circular ping-pong chain
            sheetA.createCell('A1', { value: 100 });
            sheetB.createCell('B1', { formula: '=SheetA!A1 * 2' }); // 200
            sheetA.createCell('A2', { formula: '=SheetB!B1 + 10' }); // 210

            // Circular ping-pong chain (separate)
            sheetB.createCell('B2', { formula: '=SheetC!C2 + 1' }); // Circular
            sheetC.createCell('C1', { formula: '=SheetB!B2 + 1' }); // Circular
            sheetB.createCell('B3', { formula: '=SheetC!C1 + 1' }); // Circular (ping-pong)
            sheetC.createCell('C2', { formula: '=SheetB!B3 + 1' }); // Circular (closes loop)

            workbook.build();

            // Manually calculate non-circular cells since autoCalculate is disabled
            sheetB.getCellDirect('B1').calculate();
            sheetA.getCellDirect('A2').calculate();

            // Non-circular should calculate
            expect(sheetA.getCellDirect('A1').value).toBe(100);
            expect(sheetB.getCellDirect('B1').value).toBe(200);
            expect(sheetA.getCellDirect('A2').value).toBe(210);
            expect(workbook.isInCircularReference(sheetA.getCellDirect('A1'), 'SheetA')).toBe(false);
            expect(workbook.isInCircularReference(sheetB.getCellDirect('B1'), 'SheetB')).toBe(false);
            expect(workbook.isInCircularReference(sheetA.getCellDirect('A2'), 'SheetA')).toBe(false);

            // Circular should be detected
            expect(workbook.isInCircularReference(sheetB.getCellDirect('B2'), 'SheetB')).toBe(true);
            expect(workbook.isInCircularReference(sheetC.getCellDirect('C1'), 'SheetC')).toBe(true);
            expect(workbook.isInCircularReference(sheetB.getCellDirect('B3'), 'SheetB')).toBe(true);
            expect(workbook.isInCircularReference(sheetC.getCellDirect('C2'), 'SheetC')).toBe(true);
        });

        test('should detect circular in diamond ping-pong pattern', () => {
            const workbook = Calx.createWorkbook();
            const sheetA = workbook.createSheet('SheetA');
            const sheetB = workbook.createSheet('SheetB');
            const sheetC = workbook.createSheet('SheetC');
            const sheetD = workbook.createSheet('SheetD');

            // Disable autoCalculate to prevent infinite loops in circular cells
            sheetA.autoCalculate = false;
            sheetB.autoCalculate = false;
            sheetC.autoCalculate = false;
            sheetD.autoCalculate = false;

            // Start with base value
            sheetA.createCell('A1', { value: 100 });

            // Split to B and C (non-circular)
            sheetB.createCell('B1', { formula: '=SheetA!A1 * 2' }); // 200
            sheetC.createCell('C1', { formula: '=SheetA!A1 * 3' }); // 300

            // D depends on both (non-circular)
            sheetD.createCell('D1', { formula: '=SheetB!B1 + SheetC!C1' }); // 500

            // Create circular ping-pong: B2 → D2 → C2 → B2
            sheetB.createCell('B2', { formula: '=SheetC!C2 + 1' }); // Circular
            sheetD.createCell('D2', { formula: '=SheetB!B2 + 1' }); // Circular (ping-pong)
            sheetC.createCell('C2', { formula: '=SheetD!D2 + 1' }); // Circular (closes loop)

            workbook.build();
            workbook.calculate();

            // Non-circular should work
            expect(sheetA.getCellDirect('A1').value).toBe(100);
            expect(sheetB.getCellDirect('B1').value).toBe(200);
            expect(sheetC.getCellDirect('C1').value).toBe(300);
            expect(sheetD.getCellDirect('D1').value).toBe(500);
            expect(workbook.isInCircularReference(sheetA.getCellDirect('A1'), 'SheetA')).toBe(false);
            expect(workbook.isInCircularReference(sheetB.getCellDirect('B1'), 'SheetB')).toBe(false);
            expect(workbook.isInCircularReference(sheetC.getCellDirect('C1'), 'SheetC')).toBe(false);
            expect(workbook.isInCircularReference(sheetD.getCellDirect('D1'), 'SheetD')).toBe(false);

            // Circular ping-pong should be detected
            expect(workbook.isInCircularReference(sheetB.getCellDirect('B2'), 'SheetB')).toBe(true);
            expect(workbook.isInCircularReference(sheetD.getCellDirect('D2'), 'SheetD')).toBe(true);
            expect(workbook.isInCircularReference(sheetC.getCellDirect('C2'), 'SheetC')).toBe(true);
        });

        test('should detect indirect circular through ping-pong chain', () => {
            const workbook = Calx.createWorkbook();
            const sheetA = workbook.createSheet('SheetA');
            const sheetB = workbook.createSheet('SheetB');
            const sheetC = workbook.createSheet('SheetC');

            // Disable autoCalculate to prevent infinite loops before build()
            sheetA.autoCalculate = false;
            sheetB.autoCalculate = false;
            sheetC.autoCalculate = false;

            // A1 depends on itself through long ping-pong chain
            // A1 → B1 → A2 → C1 → B2 → A3 → C2 → A1 (circular)
            sheetA.createCell('A1', { formula: '=SheetC!C2 + 1' }); // End of circle
            sheetB.createCell('B1', { formula: '=SheetA!A1 + 1' });
            sheetA.createCell('A2', { formula: '=SheetB!B1 + 1' }); // Ping-pong
            sheetC.createCell('C1', { formula: '=SheetA!A2 + 1' });
            sheetB.createCell('B2', { formula: '=SheetC!C1 + 1' }); // Ping-pong
            sheetA.createCell('A3', { formula: '=SheetB!B2 + 1' }); // Ping-pong
            sheetC.createCell('C2', { formula: '=SheetA!A3 + 1' }); // Closes loop

            workbook.build();

            // All cells in the chain should be circular
            expect(workbook.isInCircularReference(sheetA.getCellDirect('A1'), 'SheetA')).toBe(true);
            expect(workbook.isInCircularReference(sheetB.getCellDirect('B1'), 'SheetB')).toBe(true);
            expect(workbook.isInCircularReference(sheetA.getCellDirect('A2'), 'SheetA')).toBe(true);
            expect(workbook.isInCircularReference(sheetC.getCellDirect('C1'), 'SheetC')).toBe(true);
            expect(workbook.isInCircularReference(sheetB.getCellDirect('B2'), 'SheetB')).toBe(true);
            expect(workbook.isInCircularReference(sheetA.getCellDirect('A3'), 'SheetA')).toBe(true);
            expect(workbook.isInCircularReference(sheetC.getCellDirect('C2'), 'SheetC')).toBe(true);
        });

        test('should handle partial circular with valid branches', () => {
            const workbook = Calx.createWorkbook();
            const sheetA = workbook.createSheet('SheetA');
            const sheetB = workbook.createSheet('SheetB');
            const sheetC = workbook.createSheet('SheetC');

            // Disable autoCalculate to prevent infinite loops in circular cells
            sheetA.autoCalculate = false;
            sheetB.autoCalculate = false;
            sheetC.autoCalculate = false;

            // Base value
            sheetA.createCell('A1', { value: 50 });

            // Valid branch: A1 → B1 → C1
            sheetB.createCell('B1', { formula: '=SheetA!A1 * 2' }); // 100
            sheetC.createCell('C1', { formula: '=SheetB!B1 + 50' }); // 150

            // Circular branch from B1: B2 → A2 → C2 → B2
            sheetB.createCell('B2', { formula: '=SheetC!C2 + 1' }); // Circular
            sheetA.createCell('A2', { formula: '=SheetB!B2 + 1' }); // Circular
            sheetC.createCell('C2', { formula: '=SheetA!A2 + 1' }); // Circular (closes)

            // Another valid branch from A1: A3 → B3
            sheetA.createCell('A3', { formula: '=SheetA!A1 / 2' }); // 25
            sheetB.createCell('B3', { formula: '=SheetA!A3 * 4' }); // 100

            workbook.build();
            workbook.calculate();

            // Valid branches should calculate
            expect(sheetA.getCellDirect('A1').value).toBe(50);
            expect(sheetB.getCellDirect('B1').value).toBe(100);
            expect(sheetC.getCellDirect('C1').value).toBe(150);
            expect(sheetA.getCellDirect('A3').value).toBe(25);
            expect(sheetB.getCellDirect('B3').value).toBe(100);

            // Valid branches should not be circular
            expect(workbook.isInCircularReference(sheetA.getCellDirect('A1'), 'SheetA')).toBe(false);
            expect(workbook.isInCircularReference(sheetB.getCellDirect('B1'), 'SheetB')).toBe(false);
            expect(workbook.isInCircularReference(sheetC.getCellDirect('C1'), 'SheetC')).toBe(false);
            expect(workbook.isInCircularReference(sheetA.getCellDirect('A3'), 'SheetA')).toBe(false);
            expect(workbook.isInCircularReference(sheetB.getCellDirect('B3'), 'SheetB')).toBe(false);

            // Circular branch should be detected
            expect(workbook.isInCircularReference(sheetB.getCellDirect('B2'), 'SheetB')).toBe(true);
            expect(workbook.isInCircularReference(sheetA.getCellDirect('A2'), 'SheetA')).toBe(true);
            expect(workbook.isInCircularReference(sheetC.getCellDirect('C2'), 'SheetC')).toBe(true);
        });
    });
});
