// Demo: Date Handling in Calx.js
import { Calx, DateUtil } from '../src/Calx';
import { DataType } from '../src/Calx/Cell/DataType';

console.log('=== Calx.js Date Handling Demo ===\n');

// 1. DateUtil Basics
console.log('1. DateUtil Basics:');
const serialDate = 45292; // January 1, 2024
const date = DateUtil.serialToDate(serialDate);
console.log(`   Serial ${serialDate} = ${date.toLocaleDateString()}`);

const jsDate = new Date(2024, 5, 15); // June 15, 2024
const serial = DateUtil.dateToSerial(jsDate);
console.log(`   ${jsDate.toLocaleDateString()} = Serial ${serial}`);

// 2. Date Components
console.log('\n2. Date Components:');
const components = DateUtil.toComponents(45292);
console.log(`   Year: ${components.year}, Month: ${components.month}, Day: ${components.day}`);

// 3. ISO Formatting
console.log('\n3. ISO Formatting:');
const isoString = DateUtil.toISOString(45292);
console.log(`   ISO String: ${isoString}`);
const backToSerial = DateUtil.fromISOString(isoString);
console.log(`   Back to Serial: ${backToSerial}`);

// 4. Today and Now
console.log('\n4. Current Date/Time:');
const today = DateUtil.today();
const now = DateUtil.now();
console.log(`   Today (date only): ${today} = ${DateUtil.toISOString(today)}`);
console.log(`   Now (with time): ${now.toFixed(5)}`);

// 5. Cell Date Methods
console.log('\n5. Cell Date Methods:');
const workbook = Calx.createWorkbook();
const sheet = workbook.createSheet('DateDemo');

// Create a cell and set date value
const cell = sheet.createCell('A1', {});
cell.setDateValue(new Date(2024, 0, 15)); // January 15, 2024
console.log(`   A1 set to: ${cell.getFormattedDate()}`);
console.log(`   As Date: ${cell.getDateValue()?.toLocaleDateString()}`);
console.log(`   As Serial: ${cell.getSerialDateValue()}`);
console.log(`   Is Date: ${cell.isDate()}`);

// 6. Date Arithmetic
console.log('\n6. Date Arithmetic:');
sheet.createCell('B1', { value: 45292, type: DataType.DATE }); // Jan 1, 2024
sheet.createCell('C1', { formula: '=B1+30' }); // Add 30 days
sheet.createCell('D1', { formula: '=B1-7' }); // Subtract 7 days

workbook.build();
workbook.calculate();

console.log(`   B1 (Jan 1, 2024): ${sheet.getCellValue('B1')}`);
console.log(`   B1 + 30 days: ${sheet.getCellValue('C1')} = ${DateUtil.toISOString(sheet.getCellValue('C1'))}`);
console.log(`   B1 - 7 days: ${sheet.getCellValue('D1')} = ${DateUtil.toISOString(sheet.getCellValue('D1'))}`);

// 7. Date Differences
console.log('\n7. Date Differences:');
sheet.createCell('E1', { value: 45292, type: DataType.DATE }); // Jan 1, 2024
sheet.createCell('E2', { value: 45323, type: DataType.DATE }); // Feb 1, 2024
sheet.createCell('E3', { formula: '=E2-E1' }); // Days between

workbook.build();
workbook.calculate();

console.log(`   Start Date: ${DateUtil.toISOString(sheet.getCellValue('E1'))}`);
console.log(`   End Date: ${DateUtil.toISOString(sheet.getCellValue('E2'))}`);
console.log(`   Days Between: ${sheet.getCellValue('E3')} days`);

// 8. DATE Function
console.log('\n8. DATE Function:');
sheet.createCell('F1', { formula: '=DATE(2024, 12, 25)' }); // Christmas 2024

workbook.build();
workbook.calculate();

const christmasSerial = sheet.getCellValue('F1');
const cellF1 = sheet.getCell('F1');
cellF1.type = DataType.DATE;
console.log(`   DATE(2024, 12, 25) = Serial ${christmasSerial}`);
console.log(`   Formatted: ${cellF1.getFormattedDate()}`);
console.log(`   As Date: ${cellF1.getDateValue()?.toLocaleDateString()}`);

// 9. YEAR, MONTH, DAY Functions
console.log('\n9. Date Component Functions:');
sheet.createCell('G1', { value: 45292, type: DataType.DATE }); // Jan 1, 2024
sheet.createCell('G2', { formula: '=YEAR(G1)' });
sheet.createCell('G3', { formula: '=MONTH(G1)' });
sheet.createCell('G4', { formula: '=DAY(G1)' });

workbook.build();
workbook.calculate();

console.log(`   Date: ${DateUtil.toISOString(sheet.getCellValue('G1'))}`);
console.log(`   YEAR: ${sheet.getCellValue('G2')}`);
console.log(`   MONTH: ${sheet.getCellValue('G3')}`);
console.log(`   DAY: ${sheet.getCellValue('G4')}`);

// 10. Validation
console.log('\n10. Validation:');
console.log(`   Is 45292 valid? ${DateUtil.isValidSerialDate(45292)}`);
console.log(`   Is NaN valid? ${DateUtil.isValidSerialDate(NaN)}`);
console.log(`   Is 9999999 valid? ${DateUtil.isValidSerialDate(9999999)} (too far in future)`);

try {
    const badCell = sheet.createCell('H1', {});
    badCell.setDateValue('not a date' as any);
} catch (error: any) {
    console.log(`   Invalid date error: ${error.message}`);
}

console.log('\n=== Demo Complete ===');
