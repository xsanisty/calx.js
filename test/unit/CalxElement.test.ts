/**
 * CalxElement Tests
 * Tests for the vanilla JavaScript element mounting functionality
 */

import { CalxElement } from '../../src/Calx/Workbook/CalxElement';
import { Calx } from '../../src/Calx';
import { Workbook } from '../../src/Calx/Workbook';

describe('CalxElement', () => {
    let container: HTMLElement;

    beforeEach(() => {
        // Create a container for our tests
        container = document.createElement('div');
        container.id = 'test-container';
        document.body.appendChild(container);
    });

    afterEach(() => {
        // Clean up
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });

    describe('Static API (Calx class)', () => {
        test('Calx.createWorkbookFromElement should return Workbook with element mounted', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="10">
                <span data-cell="B1" data-formula="A1 * 2"></span>
            `;

            const workbook = Calx.createWorkbookFromElement('test-container');

            expect(workbook).toBeDefined();
            expect(workbook.getElement()).toBeDefined();
            expect(workbook.getElement()?.isMounted).toBe(true);

            const sheet = workbook.getSheet('Sheet1');
            if (!sheet) throw new Error('Sheet not found');

            expect(sheet.getCell('A1').value).toBe(10);
            expect(sheet.getCell('B1').value).toBe(20);
        });

        test('Workbook.createFromElement should return Workbook with element mounted', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="5">
                <span data-cell="B1" data-formula="A1 * 3"></span>
            `;

            const workbook = Workbook.createFromElement('test-container');

            expect(workbook).toBeInstanceOf(Workbook);
            expect(workbook.getElement()).toBeDefined();
            expect(workbook.getElement()?.isMounted).toBe(true);

            const sheet = workbook.getSheet('Sheet1');
            if (!sheet) throw new Error('Sheet not found');

            expect(sheet.getCell('A1').value).toBe(5);
            expect(sheet.getCell('B1').value).toBe(15);
        });

        test('Workbook.mount() should mount to an element', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="7">
                <span data-cell="B1" data-formula="A1 * 4"></span>
            `;

            const workbook = Calx.createWorkbook();
            workbook.mount('test-container');

            expect(workbook.getElement()).toBeDefined();
            expect(workbook.getElement()?.isMounted).toBe(true);

            const sheet = workbook.getSheet('Sheet1');
            if (!sheet) throw new Error('Sheet not found');

            expect(sheet.getCell('A1').value).toBe(7);
            expect(sheet.getCell('B1').value).toBe(28);
        });
    });

    describe('Basic Mounting', () => {
        test('should mount to an element by ID', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="10">
                <span data-cell="B1" data-formula="A1 * 2"></span>
            `;

            const workbook = Workbook.createFromElement('test-container');
            const calxElement = workbook.getElement();

            expect(calxElement?.isMounted).toBe(true);
            expect(workbook).toBeDefined();
        });

        test('should mount to an element reference', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="10">
            `;

            const workbook = Workbook.createFromElement(container);
            const calxElement = workbook.getElement();

            expect(calxElement?.isMounted).toBe(true);
            expect(calxElement?.element).toBe(container);
        });

        test('should return false when element not found', () => {
            const workbook = Calx.createWorkbook();
            workbook.mount('non-existent-id');
            const calxElement = workbook.getElement();

            expect(calxElement?.isMounted).toBe(false);
        });
    });

    describe('Cell Processing', () => {
        test('should process data-cell attributes', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="10">
                <input type="text" data-cell="A2" value="20">
            `;

            const workbook = Workbook.createFromElement(container);
            const sheet = workbook.getSheet('Sheet1');

            if (!sheet) throw new Error('Sheet not found');

            expect(sheet.getCell('A1').value).toBe(10);
            expect(sheet.getCell('A2').value).toBe(20);
        });

        test('should process data-formula attributes', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="10">
                <span data-cell="B1" data-formula="A1 * 2"></span>
            `;

            const workbook = Workbook.createFromElement(container);
            const sheet = workbook.getSheet('Sheet1');

            if (!sheet) throw new Error('Sheet not found');

            expect(sheet.getCell('B1').value).toBe(20);
        });

        test('should auto-assign CALX addresses to elements with data-formula but no data-cell', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="10">
                <span data-formula="A1 * 2"></span>
            `;

            const workbook = Workbook.createFromElement(container);

            const formulaElement = container.querySelector('[data-formula]');
            expect(formulaElement?.getAttribute('data-cell')).toMatch(/^CALX\d+$/);
        });

        test('should update DOM when values change', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="10">
                <span data-cell="B1" data-formula="A1 * 2"></span>
            `;

            const workbook = Workbook.createFromElement(container);
            const sheet = workbook.getSheet('Sheet1');

            if (!sheet) throw new Error('Sheet not found');

            const outputSpan = container.querySelector('[data-cell="B1"]') as HTMLElement;

            expect(outputSpan.textContent).toBe('20');

            // Change value
            sheet.getCell('A1').value = 15;

            expect(outputSpan.textContent).toBe('30');
        });
    });

    describe('Formatters', () => {
        test('should apply currency formatter', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="25.50">
                <span data-cell="B1" data-formula="A1 * 2" data-format="currency"></span>
            `;

            const workbook = Workbook.createFromElement(container);
            const outputSpan = container.querySelector('[data-cell="B1"]') as HTMLElement;

            expect(outputSpan.textContent).toBe('$51.00');
        });

        test('should apply percent formatter', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="0.085">
                <span data-cell="B1" data-formula="A1" data-format="percent"></span>
            `;

            const workbook = Workbook.createFromElement(container);
            const outputSpan = container.querySelector('[data-cell="B1"]') as HTMLElement;

            expect(outputSpan.textContent).toBe('8.50%');
        });

        test('should apply number formatter', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="10">
                <span data-cell="B1" data-formula="A1 * 3.333" data-format="number"></span>
            `;

            const workbook = Workbook.createFromElement(container);
            const outputSpan = container.querySelector('[data-cell="B1"]') as HTMLElement;

            expect(outputSpan.textContent).toBe('33.33');
        });

        test('should parse formatted input values', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" data-format="currency" value="$1,234.56">
            `;

            const workbook = Workbook.createFromElement(container);
            const sheet = workbook.getSheet('Sheet1');

            if (!sheet) throw new Error('Sheet not found');

            expect(sheet.getCell('A1').value).toBe(1234.56);
        });

        test('should parse percent input values', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" data-format="percent" value="8.5%">
            `;

            const workbook = Workbook.createFromElement(container);
            const sheet = workbook.getSheet('Sheet1');

            if (!sheet) throw new Error('Sheet not found');

            expect(sheet.getCell('A1').value).toBe(0.085);
        });
    });

    describe('Style Formatters', () => {
        test('should apply negative style formatter', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="-10">
                <span data-cell="B1" data-formula="A1" data-style-if="negative"></span>
            `;

            const workbook = Workbook.createFromElement(container);
            const outputSpan = container.querySelector('[data-cell="B1"]') as HTMLElement;

            expect(outputSpan.style.color).toBe('red');
        });

        test('should apply positive style formatter', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="10">
                <span data-cell="B1" data-formula="A1" data-style-if="positive"></span>
            `;

            const workbook = Workbook.createFromElement(container);
            const outputSpan = container.querySelector('[data-cell="B1"]') as HTMLElement;

            expect(outputSpan.style.color).toBe('green');
        });

        test('should apply zero style formatter', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="0">
                <span data-cell="B1" data-formula="A1" data-style-if="zero"></span>
            `;

            const workbook = Workbook.createFromElement(container);
            const outputSpan = container.querySelector('[data-cell="B1"]') as HTMLElement;

            expect(outputSpan.style.color).toBe('gray');
        });
    });

    describe('Named Variables', () => {
        test('should register named variables with data-var', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" data-var="Price" value="25.50">
                <span data-cell="B1" data-formula="Price * 2"></span>
            `;

            const workbook = Workbook.createFromElement(container);
            const sheet = workbook.getSheet('Sheet1');

            if (!sheet) throw new Error('Sheet not found');

            expect(sheet.getCell('B1').value).toBe(51);
        });
    });

    describe('Multiple Sheets', () => {
        test('should handle multiple sheets with data-sheet attribute', () => {
            container.innerHTML = `
                <div data-sheet="Sheet1">
                    <input type="text" data-cell="A1" value="10">
                </div>
                <div data-sheet="Sheet2">
                    <input type="text" data-cell="A1" value="20">
                </div>
            `;

            const workbook = Workbook.createFromElement(container);

            const sheet1 = workbook.getSheet('Sheet1');
            const sheet2 = workbook.getSheet('Sheet2');

            if (!sheet1 || !sheet2) throw new Error('Sheets not found');

            expect(sheet1.getCell('A1').value).toBe(10);
            expect(sheet2.getCell('A1').value).toBe(20);
        });

        test('should handle cross-sheet references', () => {
            container.innerHTML = `
                <div data-sheet="Sheet1">
                    <input type="text" data-cell="A1" value="10">
                </div>
                <div data-sheet="Sheet2">
                    <span data-cell="A1" data-formula="Sheet1!A1 * 2"></span>
                </div>
            `;

            const workbook = Workbook.createFromElement(container);
            const sheet2 = workbook.getSheet('Sheet2');

            if (!sheet2) throw new Error('Sheet not found');

            expect(sheet2.getCell('A1').value).toBe(20);
        });
    });

    describe('Event Handling', () => {
        test('should update cell value on input change', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="10">
                <span data-cell="B1" data-formula="A1 * 2"></span>
            `;

            const workbook = Workbook.createFromElement(container);
            const input = container.querySelector('[data-cell="A1"]') as HTMLInputElement;
            const output = container.querySelector('[data-cell="B1"]') as HTMLElement;
            const sheet = workbook.getSheet('Sheet1');

            if (!sheet) throw new Error('Sheet not found');

            // Initial values
            expect(output.textContent).toBe('20');

            // Change input value and trigger change event
            input.value = '15';
            input.dispatchEvent(new Event('change', { bubbles: true }));

            // Sheet cell should be updated (string will be parsed to number)
            expect(Number(sheet.getCell('A1').value)).toBe(15);

            // Output should be updated via VALUE_CHANGED event
            expect(output.textContent).toBe('30');
        });
    });

    describe('Unmount', () => {
        test('should clean up event listeners on unmount', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="10">
            `;

            const workbook = Workbook.createFromElement(container);
            expect(workbook.getElement()?.isMounted).toBe(true);

            workbook.getElement()?.unmount();
            expect(workbook.getElement()?.isMounted).toBe(false);
        });
    });

    describe('Custom Formatters', () => {
        test('should allow registering custom formatters', () => {
            CalxElement.registerFormatter('custom', {
                format: (value: any) => `Custom: ${value}`,
                parse: (input: string) => input.replace('Custom: ', '')
            });

            container.innerHTML = `
                <input type="text" data-cell="A1" value="Test">
                <span data-cell="B1" data-formula="A1" data-format="custom"></span>
            `;

            const workbook = Workbook.createFromElement(container);
            const output = container.querySelector('[data-cell="B1"]') as HTMLElement;

            expect(output.textContent).toBe('Custom: Test');
        });

        test('should allow registering custom style formatters', () => {
            CalxElement.registerStyleFormatter('custom-style', (value: any) => {
                if (value === 'special') {
                    return { backgroundColor: 'yellow' };
                }
                return {};
            });

            container.innerHTML = `
                <input type="text" data-cell="A1" value="special">
                <span data-cell="B1" data-formula="A1" data-style-if="custom-style"></span>
            `;

            const workbook = Workbook.createFromElement(container);
            const output = container.querySelector('[data-cell="B1"]') as HTMLElement;

            expect(output.style.backgroundColor).toBe('yellow');
        });
    });

    describe('Recalculation', () => {
        test('should recalculate on demand', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="10">
                <span data-cell="B1" data-formula="A1 * 2"></span>
            `;

            const workbook = Workbook.createFromElement(container);
            const sheet = workbook.getSheet('Sheet1');

            if (!sheet) throw new Error('Sheet not found');

            const output = container.querySelector('[data-cell="B1"]') as HTMLElement;

            // Initial value should be 20 (10 * 2)
            expect(output.textContent).toBe('20');

            // Change value directly on cell (bypassing DOM)
            sheet.getCell('A1').value = 20;

            // When changing values directly (not through DOM), dependents aren't auto-marked dirty
            // So we need to manually mark them or use updateAll()
            sheet.getCell('B1').markAsDirty();

            // Recalculate to update dependent cells
            workbook.getElement()?.recalculate();

            // Should now be 40 (20 * 2)
            expect(output.textContent).toBe('40');
        });

        test('should force update all cells with updateAll()', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="10">
                <span data-cell="B1" data-formula="A1 * 2"></span>
            `;

            const workbook = Workbook.createFromElement(container);
            const sheet = workbook.getSheet('Sheet1');

            if (!sheet) throw new Error('Sheet not found');

            const output = container.querySelector('[data-cell="B1"]') as HTMLElement;

            // Initial value should be 20 (10 * 2)
            expect(output.textContent).toBe('20');

            // Change value directly on cell (bypassing DOM)
            sheet.getCell('A1').value = 20;
            sheet.calculate(); // Recalculate formulas

            // Use updateAll() to force-update all DOM elements
            workbook.getElement()?.updateAll();

            // Should now be 40 (20 * 2)
            expect(output.textContent).toBe('40');
        });

        test('should only update dirty cells during recalculation (optimization)', () => {
            container.innerHTML = `
                <input type="text" data-cell="A1" value="10">
                <input type="text" data-cell="A2" value="5">
                <span data-cell="B1" data-formula="A1 * 2"></span>
                <span data-cell="B2" data-formula="A2 * 3"></span>
            `;

            const workbook = Workbook.createFromElement(container);
            const sheet = workbook.getSheet('Sheet1');

            if (!sheet) throw new Error('Sheet not found');

            const outputB1 = container.querySelector('[data-cell="B1"]') as HTMLElement;
            const outputB2 = container.querySelector('[data-cell="B2"]') as HTMLElement;

            // Initial values
            expect(outputB1.textContent).toBe('20');
            expect(outputB2.textContent).toBe('15');

            // Change only A1
            sheet.getCell('A1').value = 15;

            // Mark B1 as dirty (it depends on A1)
            sheet.getCell('B1').markAsDirty();

            // Recalculate - should only update B1 (dirty), not B2
            workbook.getElement()?.recalculate();

            // B1 should be updated, B2 should remain the same
            expect(outputB1.textContent).toBe('30');
            expect(outputB2.textContent).toBe('15');
        });
    });
});
