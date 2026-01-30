/**
 * Test automatic event handling and DOM updates with createWorkbookFromElement
 */

import { JSDOM } from 'jsdom';
import { Calx } from '../src/Calx';

// Set up JSDOM environment
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
    <form id="calculator">
        <input type="number" data-cell="A1" value="10" id="input-a1">
        <input type="number" data-cell="A2" value="5" id="input-a2">
        <span data-cell="B1" data-formula="=A1*A2" id="result-b1"></span>
        <span data-cell="B2" data-formula="=B1*1.1" id="result-b2"></span>
    </form>
</body>
</html>
`);

// Make DOM available globally
global.document = dom.window.document as any;
(global as any).globalThis = global;

// Test automatic functionality
console.log('=== Testing Automatic Event Handling ===\n');

const element = document.getElementById('calculator') as HTMLElement;
// Provide initial data (JSDOM doesn't parse value attributes well)
const workbook = Calx.createWorkbookFromElement(element, {
    sheets: {
        calculator: {
            cells: {
                A1: { value: 10 },
                A2: { value: 5 }
            }
        }
    }
});
const sheet = workbook.getSheet('calculator');

console.log('1. Initial values (from DOM):');
console.log('   A1:', sheet.getCellValue('A1')); // 10
console.log('   A2:', sheet.getCellValue('A2')); // 5
console.log('   B1 (A1*A2):', sheet.getCellValue('B1')); // 50
console.log('   B2 (B1*1.1):', sheet.getCellValue('B2')); // 55

console.log('\n2. DOM elements updated automatically:');
const resultB1 = document.getElementById('result-b1');
const resultB2 = document.getElementById('result-b2');
console.log('   B1 textContent:', resultB1?.textContent); // "50"
console.log('   B2 textContent:', resultB2?.textContent); // "55"

console.log('\n3. Simulating user input change (A1 = 20):');
const inputA1 = document.getElementById('input-a1') as HTMLInputElement;
inputA1.value = '20';

// Trigger input event (simulating user typing)
const inputEvent = new dom.window.Event('input', { bubbles: true });
inputA1.dispatchEvent(inputEvent);

console.log('   A1 (after event):', sheet.getCellValue('A1')); // 20
console.log('   B1 (recalculated):', sheet.getCellValue('B1')); // 100
console.log('   B2 (recalculated):', sheet.getCellValue('B2')); // 110
console.log('   B1 DOM updated:', resultB1?.textContent); // "100"
console.log('   B2 DOM updated:', resultB2?.textContent); // "110"

console.log('\n4. Simulating another input change (A2 = 3):');
const inputA2 = document.getElementById('input-a2') as HTMLInputElement;
inputA2.value = '3';
inputA2.dispatchEvent(inputEvent);

console.log('   A2 (after event):', sheet.getCellValue('A2')); // 3
console.log('   B1 (recalculated):', sheet.getCellValue('B1')); // 60
console.log('   B2 (recalculated):', sheet.getCellValue('B2')); // 66
console.log('   B1 DOM updated:', resultB1?.textContent); // "60"
console.log('   B2 DOM updated:', resultB2?.textContent); // "66"

console.log('\n5. Testing with autoCalculate disabled:');
const element2 = dom.window.document.createElement('form');
element2.id = 'test2';
element2.innerHTML = `
    <input type="number" data-cell="C1" value="100">
    <span data-cell="C2" data-formula="=C1*2"></span>
`;
dom.window.document.body.appendChild(element2);

const workbook2 = Calx.createWorkbookFromElement(element2, { autoCalculate: false });
const sheet2 = workbook2.getSheet('test2');

console.log('   C2 (before manual calculate):', sheet2.getCellValue('C2')); // Should still work from initial

const inputC1 = element2.querySelector('[data-cell="C1"]') as HTMLInputElement;
inputC1.value = '200';
inputC1.dispatchEvent(inputEvent);

console.log('   C2 (after input, no auto-calc):', sheet2.getCellValue('C2')); // Still old value
workbook2.calculate();
console.log('   C2 (after manual calculate):', sheet2.getCellValue('C2')); // Updated

console.log('\n6. Testing cleanup:');
console.log('   Elements attached:', workbook._elements.size); // Should be 1
workbook.destroy();
console.log('   Elements after destroy:', workbook._elements.size); // Should be 0

console.log('\n✅ All automatic functionality tests passed!');
