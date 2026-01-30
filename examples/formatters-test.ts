/**
 * Test formatters in the refactored Workbook implementation
 */

import { JSDOM } from 'jsdom';
import { Calx } from '../src/Calx';

// Setup JSDOM environment
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
    <div id="test_formatters">
        <input type="text" data-cell="A1" value="1000">
        <input type="text" data-cell="A2" value="0.25" data-format="percent">
        <input type="text" data-cell="A3" data-formula="A1*A2" data-format="currency" readonly>
        <input type="text" data-cell="A4" value="42.789" data-format="integer">
        <span data-cell="A5" data-formula="A1+500" data-format="number"></span>
    </div>
</body>
</html>
`);

// Set global document
(global as any).document = dom.window.document;
(global as any).window = dom.window;

console.log('=== Testing Formatters ===\n');

// Create workbook from element
const element = dom.window.document.getElementById('test_formatters');
const workbook = Calx.createWorkbookFromElement(element!);

const sheet = workbook.getSheet('test_formatters')!;

console.log('1. Initial values:');
console.log('   A1 (raw value):', sheet.getCellValue('A1'));
console.log('   A2 (percent):', sheet.getCellValue('A2'));
console.log('   A3 (currency formula):', sheet.getCellValue('A3'));
console.log('   A4 (integer):', sheet.getCellValue('A4'));
console.log('   A5 (number):', sheet.getCellValue('A5'));

console.log('\n2. Check DOM formatting:');
const a2Input = element!.querySelector('[data-cell="A2"]') as HTMLInputElement;
const a3Input = element!.querySelector('[data-cell="A3"]') as HTMLInputElement;
const a4Input = element!.querySelector('[data-cell="A4"]') as HTMLInputElement;
const a5Span = element!.querySelector('[data-cell="A5"]') as HTMLSpanElement;

console.log('   A2 display (should show %):', a2Input.value);
console.log('   A3 display (should show $):', a3Input.value);
console.log('   A4 display (should be integer):', a4Input.value);
console.log('   A5 display (should have .00):', a5Span.textContent);

// Test parsing formatted input
console.log('\n3. Testing formatted input parsing:');
a2Input.value = '30%';
a2Input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

// Give it a moment for events to process
setTimeout(() => {
    console.log('   A2 parsed value (should be 0.30):', sheet.getCellValue('A2'));
    console.log('   A2 display (should show 30.00%):', a2Input.value);
    console.log('   A3 recalculated (1000*0.30):', sheet.getCellValue('A3'));
    console.log('   A3 display (should show $300.00):', a3Input.value);

    // Test currency parsing
    console.log('\n4. Testing currency formatter registration:');
    const currencyFormatter = workbook.getFormatter('currency');
    console.log('   Currency formatter exists:', !!currencyFormatter);
    if (currencyFormatter) {
        console.log('   Format 1234.56:', currencyFormatter.format(1234.56));
        console.log('   Parse "$1,234.56":', currencyFormatter.parse('$1,234.56'));
    }

    // Test integer rounding
    console.log('\n5. Testing integer formatter:');
    const a1Input = element!.querySelector('[data-cell="A1"]') as HTMLInputElement;
    a1Input.value = '42.789';
    a1Input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    setTimeout(() => {
        console.log('   A1 raw value:', sheet.getCellValue('A1'));

        // Change A4 to test integer formatting
        a4Input.value = '99.999';
        a4Input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

        setTimeout(() => {
            console.log('   A4 raw value (should be rounded):', sheet.getCellValue('A4'));
            console.log('   A4 display (should be 100):', a4Input.value);

            // Test custom formatter registration
            console.log('\n6. Testing custom formatter registration:');
            workbook.registerFormatter('uppercase', {
                format: (value: any) => String(value).toUpperCase(),
                parse: (input: string) => input
            });

            const uppercaseFormatter = workbook.getFormatter('uppercase');
            console.log('   Custom formatter exists:', !!uppercaseFormatter);
            if (uppercaseFormatter) {
                console.log('   Format "hello":', uppercaseFormatter.format('hello'));
            }

            console.log('\n✅ All formatter tests completed!');

            // Cleanup
            workbook.destroy();
        }, 50);
    }, 50);
}, 50);
