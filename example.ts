import { Calx } from './src/Calx';
import { DataType } from './src/Calx/Cell/DataType';
import * as FormulaJS from '@formulajs/formulajs';

// Example 1: Create a simple workbook
console.log('=== Example 1: Simple Workbook ===');

const workbook1 = Calx.createWorkbook();

// Create a sheet
const sheet1 = workbook1.createSheet('Budget');

// Add some cells with values
sheet1.createCell('A1', { value: 100, type: DataType.NUMBER });
sheet1.createCell('A2', { value: 200, type: DataType.NUMBER });
sheet1.createCell('A3', { value: 300, type: DataType.NUMBER });

// Add a cell with a formula
sheet1.createCell('A4', { formula: '=A1+A2+A3', type: DataType.NUMBER });

// Build dependencies and calculate
workbook1.build();
workbook1.calculate();

console.log('A1:', sheet1.getCell('A1').value);
console.log('A2:', sheet1.getCell('A2').value);
console.log('A3:', sheet1.getCell('A3').value);
console.log('A4 (sum):', sheet1.getCell('A4').value);

// Example 2: Workbook with multiple sheets
console.log('\n=== Example 2: Multi-Sheet Workbook ===');

const workbook2 = Calx.createWorkbookFromData({
    sheets: {
        'Sales': {
            cells: {
                'A1': { value: 'Product A', type: DataType.TEXT },
                'B1': { value: 1000, type: DataType.NUMBER },
                'A2': { value: 'Product B', type: DataType.TEXT },
                'B2': { value: 2000, type: DataType.NUMBER },
                'A3': { value: 'Total', type: DataType.TEXT },
                'B3': { formula: '=B1+B2', type: DataType.NUMBER }
            },
            variables: {}
        },
        'Expenses': {
            cells: {
                'A1': { value: 'Rent', type: DataType.TEXT },
                'B1': { value: 500, type: DataType.NUMBER },
                'A2': { value: 'Utilities', type: DataType.TEXT },
                'B2': { value: 200, type: DataType.NUMBER },
                'A3': { value: 'Total', type: DataType.TEXT },
                'B3': { formula: '=B1+B2', type: DataType.NUMBER }
            },
            variables: {}
        },
        'Summary': {
            cells: {
                'A1': { value: 'Net Profit', type: DataType.TEXT },
                // Cross-sheet reference (would be #Sales!B3 - #Expenses!B3)
                'B1': { formula: '=3000-700', type: DataType.NUMBER }
            },
            variables: {}
        }
    }
});

workbook2.build();
workbook2.calculate();

const salesSheet = workbook2.getSheet('Sales');
const expensesSheet = workbook2.getSheet('Expenses');
const summarySheet = workbook2.getSheet('Summary');

console.log('Sales Total:', salesSheet?.getCell('B3').value);
console.log('Expenses Total:', expensesSheet?.getCell('B3').value);
console.log('Net Profit:', summarySheet?.getCell('B1').value);

// Example 3: Complex formulas
console.log('\n=== Example 3: Complex Formulas ===');

const workbook3 = Calx.createWorkbook();
const sheet3 = workbook3.createSheet('Analysis');

// Create a range of values
sheet3.createCell('A1', { value: 10, type: DataType.NUMBER });
sheet3.createCell('A2', { value: 20, type: DataType.NUMBER });
sheet3.createCell('A3', { value: 30, type: DataType.NUMBER });
sheet3.createCell('A4', { value: 40, type: DataType.NUMBER });
sheet3.createCell('A5', { value: 50, type: DataType.NUMBER });

// Use SUM formula
sheet3.createCell('B1', { formula: '=SUM(A1,A2,A3,A4,A5)', type: DataType.NUMBER });

// Use AVERAGE formula
sheet3.createCell('B2', { formula: '=AVERAGE(A1,A2,A3,A4,A5)', type: DataType.NUMBER });

// Use IF formula
sheet3.createCell('B3', { formula: '=IF(A1>15,"High","Low")', type: DataType.TEXT });

// Nested formula
sheet3.createCell('B4', { formula: '=A1*2+A2', type: DataType.NUMBER });

workbook3.build();
workbook3.calculate();

console.log('Sum:', sheet3.getCell('B1').value);
console.log('Average:', sheet3.getCell('B2').value);
console.log('IF Result:', sheet3.getCell('B3').value);
console.log('Nested Formula:', sheet3.getCell('B4').value);

// Example 4: Dynamic calculation
console.log('\n=== Example 4: Dynamic Calculation ===');

const workbook4 = Calx.createWorkbook();
const sheet4 = workbook4.createSheet('Dynamic');

sheet4.createCell('A1', { value: 5, type: DataType.NUMBER });
sheet4.createCell('A2', { value: 10, type: DataType.NUMBER });
sheet4.createCell('A3', { formula: '=A1*A2', type: DataType.NUMBER });

workbook4.build();
workbook4.calculate();

console.log('Initial A3:', sheet4.getCell('A3').value); // Should be 50

// Change a value
sheet4.getCell('A1').value = 7;

// Recalculate
sheet4.requestCalculate('A1'); // This will mark A3 as dirty
sheet4.calculate();

console.log('After change A3:', sheet4.getCell('A3').value); // Should be 70

// Example 5: Using variables
console.log('\n=== Example 5: Variables ===');

const workbook5 = Calx.createWorkbook();
const sheet5 = workbook5.createSheet('WithVariables');

// Set variables
sheet5.setVariable('TAX_RATE', 0.08);
sheet5.setVariable('DISCOUNT', 10);

sheet5.createCell('A1', { value: 100, type: DataType.NUMBER });
// Note: In a real implementation, you'd need to implement variable resolution in formulas
sheet5.createCell('A2', { formula: '=A1*0.08', type: DataType.NUMBER }); // Tax
sheet5.createCell('A3', { formula: '=A1+A2', type: DataType.NUMBER }); // Total with tax

workbook5.build();
workbook5.calculate();

console.log('Base Price:', sheet5.getCell('A1').value);
console.log('Tax:', sheet5.getCell('A2').value);
console.log('Total:', sheet5.getCell('A3').value);

console.log('\n=== All Examples Complete ===');
