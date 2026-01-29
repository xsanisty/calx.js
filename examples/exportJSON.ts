import { Calx } from '../src/Calx';

// Example: Export and reload a workbook

// 1. Create a workbook with data
console.log('Creating workbook...');
const workbook1 = Calx.createWorkbook();
const sheet1 = workbook1.createSheet('Sales');

// Add some data
sheet1.createCell('A1', { value: 100 });
sheet1.createCell('A2', { value: 200 });
sheet1.createCell('A3', { value: 150 });
sheet1.createCell('A4', { formula: '=SUM(A1:A3)' });
sheet1.createCell('B1', { formula: '=A1*0.1' });

workbook1.build();
workbook1.calculate();

console.log('Original workbook values:');
console.log('A1:', sheet1.getCellValue('A1'));
console.log('A4 (SUM):', sheet1.getCellValue('A4'));
console.log('B1 (Tax):', sheet1.getCellValue('B1'));

// 2. Export to JSON
console.log('\nExporting to JSON...');
const data = workbook1.exportJSON();
const jsonString = JSON.stringify(data, null, 2);
console.log('Exported JSON:', jsonString);

// 3. Reload from JSON
console.log('\nReloading from JSON...');
const workbook2 = Calx.createWorkbookFromData(data);
const sheet2 = workbook2.getSheet('Sales') as any;

workbook2.build();
workbook2.calculate();

console.log('Reloaded workbook values:');
console.log('A1:', sheet2.getCellValue('A1'));
console.log('A4 (SUM):', sheet2.getCellValue('A4'));
console.log('B1 (Tax):', sheet2.getCellValue('B1'));

// 4. Verify formulas are preserved
console.log('\nFormulas preserved:');
console.log('A4 formula:', sheet2.getCell('A4').formula);
console.log('B1 formula:', sheet2.getCell('B1').formula);

console.log('\n✓ Export/Import successful!');
