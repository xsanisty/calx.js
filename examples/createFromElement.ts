import { Calx } from '../src/Calx';
import { JSDOM } from 'jsdom';

// Create a DOM environment
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
    <div id="calculator">
        <input data-cell="A1" data-var="PRICE" value="100" />
        <input data-cell="A2" data-var="QUANTITY" value="5" />
        <input data-cell="A3" data-formula="=PRICE*QUANTITY" />
        <span data-formula="=A3*0.1"></span>
    </div>
</body>
</html>
`);

// Set up global document
global.document = dom.window.document as any;
global.HTMLElement = dom.window.HTMLElement as any;

const container = dom.window.document.getElementById('calculator');

if (!container) {
    console.error('Container not found!');
    process.exit(1);
}

console.log('Creating workbook from element with data...');

// Provide initial data (best approach when values aren't in DOM)
const data = {
    sheets: {
        calculator: {
            cells: {
                A1: { value: 100 },
                A2: { value: 5 }
            },
            variables: {}
        }
    }
};

const workbook = Calx.createWorkbookFromElement(container as HTMLElement, data);

console.log('\n✓ Workbook created successfully!');

const sheet = workbook.getSheet('calculator') as any;

console.log('\nCell Values:');
console.log('A1 (PRICE):', sheet.getCellValue('A1'));
console.log('A2 (QUANTITY):', sheet.getCellValue('A2'));
console.log('A3 (PRICE*QUANTITY):', sheet.getCellValue('A3'));
console.log('CALX1 (A3*0.1):', sheet.getCellValue('CALX1'));

console.log('\nNamed Variables:');
console.log('PRICE =', sheet.getCellValue('A1'));
console.log('QUANTITY =', sheet.getCellValue('A2'));

console.log('\nExporting to JSON...');
const exportedData = workbook.exportJSON();
console.log(JSON.stringify(exportedData, null, 2));

console.log('\n✓ Testing destroy()...');
workbook.destroy();

try {
    workbook.getSheet('calculator');
    console.log('✗ ERROR: Sheet should not be accessible after destroy');
} catch (e) {
    console.log('✓ Sheet correctly cleaned up after destroy');
}

console.log('\n✓ All operations completed successfully!');
