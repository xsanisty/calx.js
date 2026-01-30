import { Calx } from '../src/Calx';

const workbook = Calx.createWorkbook();
const sheet = workbook.createSheet('Sheet1');

// Add some cells with potential circular references
sheet.createCell('A1', { formula: '=B1+1' });
sheet.createCell('B1', { formula: '=C1+1' });
sheet.createCell('C1', { formula: '=A1+1' }); // This creates a circular reference

// Build the workbook
workbook.build();

try {
    // This will throw an error if circular references are detected
    workbook.checkCircularReference();
    console.log('No circular references found');
} catch (error: any) {
    console.error('Circular reference error:', error.message);
    // Expected output: Circular reference detected:
    // Sheet1!A1 -> Sheet1!B1 -> Sheet1!C1 -> Sheet1!A1
}
