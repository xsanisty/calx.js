const { Calx } = require('./dist/Calx.js');

const workbook = Calx.createWorkbook();
const sheet = workbook.createSheet('Sheet1');

sheet.createCell('A1', { value: 10 });
sheet.createCell('A2', { value: 20 });
sheet.createCell('A3', { formula: '=A1+A2' });
sheet.createCell('B1', { formula: '=SUM(A:A)' });

workbook.build();
workbook.calculate();

console.log('A1:', sheet.getCellValue('A1')); // Should be 10
console.log('A2:', sheet.getCellValue('A2')); // Should be 20
console.log('A3:', sheet.getCellValue('A3')); // Should be 30
console.log('B1:', sheet.getCellValue('B1')); // Should be 60

// Check if B1 has dynamic precedents
const b1Cell = sheet.getCellDirect('B1');
console.log('B1 hasDynamicPrecedents:', b1Cell.hasDynamicPrecedents());
console.log('B1 dynamicPrecedents:', b1Cell.dynamicPrecedents);
console.log('B1 depends on column A:', b1Cell.dependsOnColumn('A'));
