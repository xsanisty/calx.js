import { Calx } from './src/Calx';
import { DataType } from './src/Calx/Cell/DataType';

console.log('=== Example 1: Range-Based API (Single Cell) ===');

const workbook1 = Calx.createWorkbook();
const sheet1 = workbook1.createSheet('Budget');

// Create cells
sheet1.createCell('A1', { value: 100, type: DataType.NUMBER });
sheet1.createCell('A2', { value: 200, type: DataType.NUMBER });
sheet1.createCell('A3', { formula: '=A1+A2', type: DataType.NUMBER });

// Build and calculate
workbook1.build();
workbook1.calculate();

// Get range (Excel-like behavior) - returns Range object
const rangeA3 = sheet1.getRange('A3');
console.log('Range A3 value:', rangeA3.value); // 300
console.log('Is single cell?', rangeA3.isSingleCell()); // true

// You can also modify through range
const rangeA1 = sheet1.getRange('A1');
rangeA1.value = 150;
sheet1.calculate();
console.log('After changing A1, A3 =', sheet1.getRange('A3').value); // 350

console.log('\n=== Example 2: Range-Based API (Multiple Cells) ===');

const workbook2 = Calx.createWorkbook();
const sheet2 = workbook2.createSheet('Data');

// Create a 3x3 grid
for (let row = 1; row <= 3; row++) {
    for (let col = 0; col < 3; col++) {
        const colLetter = String.fromCharCode(65 + col); // A, B, C
        const address = `${colLetter}${row}`;
        sheet2.createCell(address, { value: row * 10 + col, type: DataType.NUMBER });
    }
}

// Get multi-cell range
const range = sheet2.getRange('A1:C3');
console.log('Range address:', range.address); // A1:C3
console.log('Range size:', range.rows, 'x', range.columns); // 3 x 3
console.log('Cell count:', range.count); // 9
console.log('Is single cell?', range.isSingleCell()); // false

// Get values as 2D array
console.log('Values as 2D array:', range.getValues());

// Get values as flat array
console.log('Values as flat array:', range.toArray());

// Iterate over cells
console.log('Iterating over cells:');
range.each((cell, index) => {
    console.log(`  Cell ${index}: ${cell.address} = ${cell.value}`);
});

console.log('\n=== Example 3: Range Operations ===');

const workbook3 = Calx.createWorkbook();
const sheet3 = workbook3.createSheet('Operations');

// Create cells
sheet3.createCell('A1', { value: 0 });
sheet3.createCell('B1', { value: 0 });
sheet3.createCell('A2', { value: 0 });
sheet3.createCell('B2', { value: 0 });

// Get range and set all values at once
const dataRange = sheet3.getRange('A1:B2');
dataRange.setValues([
    [10, 20],
    [30, 40]
]);

console.log('After setValues:');
console.log('A1:', sheet3.getCellValue('A1')); // 10
console.log('B1:', sheet3.getCellValue('B1')); // 20
console.log('A2:', sheet3.getCellValue('A2')); // 30
console.log('B2:', sheet3.getCellValue('B2')); // 40

// Set same value to all cells in range
const newRange = sheet3.getRange('A1:B2');
newRange.value = 99;

console.log('After setting all to 99:');
console.log('Values:', newRange.toArray()); // [99, 99, 99, 99]

console.log('\n=== Example 4: Range with Formulas ===');

const workbook4 = Calx.createWorkbook();
const sheet4 = workbook4.createSheet('Formulas');

// Create data
sheet4.createCell('A1', { value: 10 });
sheet4.createCell('A2', { value: 20 });
sheet4.createCell('A3', { value: 30 });

// Create formula cells
sheet4.createCell('B1', { formula: '=A1*2' });
sheet4.createCell('B2', { formula: '=A2*2' });
sheet4.createCell('B3', { formula: '=A3*2' });

workbook4.build();

// Calculate entire range
const formulaRange = sheet4.getRange('B1:B3');
formulaRange.calculate();

console.log('Formula results:');
formulaRange.each((cell) => {
    console.log(`${cell.address}: ${cell.formula} = ${cell.value}`);
});

console.log('\n=== Example 5: Range Mapping and Filtering ===');

const workbook5 = Calx.createWorkbook();
const sheet5 = workbook5.createSheet('Analysis');

// Create cells with different values
sheet5.createCell('A1', { value: 5 });
sheet5.createCell('A2', { value: 15 });
sheet5.createCell('A3', { value: 25 });
sheet5.createCell('A4', { value: 35 });
sheet5.createCell('A5', { value: 45 });

const analysisRange = sheet5.getRange('A1:A5');

// Map: double all values
const doubled = analysisRange.map(cell => cell.value * 2);
console.log('Doubled values:', doubled); // [10, 30, 50, 70, 90]

// Filter: get cells with value > 20
const filtered = analysisRange.filter(cell => cell.value > 20);
console.log('Filtered cells (>20):');
filtered.forEach(cell => {
    console.log(`  ${cell.address}: ${cell.value}`);
});

// Find: get first cell with value > 30
const found = analysisRange.find(cell => cell.value > 30);
console.log('First cell > 30:', found ? `${found.address} = ${found.value}` : 'Not found');

console.log('\n=== Example 6: Data-Driven with Ranges ===');

const workbook6 = Calx.createWorkbookFromData({
    sheets: {
        'Sales': {
            cells: {
                'A1': { value: 'Q1', type: DataType.TEXT },
                'B1': { value: 1000, type: DataType.NUMBER },
                'A2': { value: 'Q2', type: DataType.TEXT },
                'B2': { value: 1500, type: DataType.NUMBER },
                'A3': { value: 'Q3', type: DataType.TEXT },
                'B3': { value: 1200, type: DataType.NUMBER },
                'A4': { value: 'Total', type: DataType.TEXT },
                'B4': { formula: '=B1+B2+B3', type: DataType.NUMBER }
            },
            variables: {}
        }
    }
});

workbook6.build();
workbook6.calculate();

const salesSheet = workbook6.getSheet('Sales');
const salesData = salesSheet.getRange('A1:B4');

console.log('Sales data:');
salesData.each((cell, index) => {
    if (index % 2 === 0) {
        // Labels (A column)
        console.log(`${cell.value}:`, salesData.getCellAt(index + 1)?.value);
    }
});

console.log('\n=== Example 7: Range Clear ===');

const workbook7 = Calx.createWorkbook();
const sheet7 = workbook7.createSheet('Clear');

sheet7.createCell('A1', { value: 10 });
sheet7.createCell('A2', { value: 20 });
sheet7.createCell('A3', { formula: '=A1+A2' });

const clearRange = sheet7.getRange('A1:A3');
console.log('Before clear:', clearRange.toArray());

clearRange.clear();
console.log('After clear:', clearRange.toArray()); // [null, null, null]

console.log('\n=== Example 8: Consistent API Demo ===');

const workbook8 = Calx.createWorkbook();
const sheet8 = workbook8.createSheet('Consistent');

// Whether you query for single cell or range, you always get a Range object
// This provides a consistent API, just like Excel

sheet8.createCell('A1', { value: 100 });
sheet8.createCell('A2', { value: 200 });
sheet8.createCell('A3', { value: 300 });

// Single cell - returns Range
const singleCell = sheet8.getRange('A1');
console.log('Single cell type:', singleCell.constructor.name); // Range
console.log('Single cell value:', singleCell.value); // 100

// Multiple cells - also returns Range
const multiCells = sheet8.getRange('A1:A3');
console.log('Multi cells type:', multiCells.constructor.name); // Range
console.log('Multi cells values:', multiCells.toArray()); // [100, 200, 300]

// Consistent interface means you can treat them the same way
const process = (range: any) => {
    console.log(`Processing range ${range.address}:`);
    console.log(`  Count: ${range.count}`);
    console.log(`  Values: ${range.toArray()}`);
};

console.log('\nProcessing with same function:');
process(singleCell);
process(multiCells);

console.log('\n=== All Examples Complete ===');
