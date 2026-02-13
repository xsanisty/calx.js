/**
 * Quick debug test for CalxElement
 */

import { Workbook } from '../../src/Calx/Workbook';

describe('CalxElement Debug', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'test-container';
        document.body.appendChild(container);
    });

    afterEach(() => {
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });

    test('debug simple formula calculation', () => {
        container.innerHTML = `
            <input type="text" data-cell="A1" value="10">
            <span data-cell="B1" data-formula="A1 * 2"></span>
        `;

        console.log('Before mount:');
        console.log('A1 element:', container.querySelector('[data-cell="A1"]'));
        console.log('B1 element:', container.querySelector('[data-cell="B1"]'));
        console.log('B1 text:', container.querySelector('[data-cell="B1"]')?.textContent);

        const workbook = Workbook.createFromElement(container);

        console.log('After mount:');
        console.log('Workbook:', workbook);
        console.log('Element:', workbook.getElement());
        console.log('Mounted?:', workbook.getElement()?.isMounted);

        const sheet = workbook.getSheet('Sheet1');
        console.log('Sheet:', sheet);

        if (sheet) {
            const cellA1 = sheet.getCellDirect('A1');
            const cellB1 = sheet.getCellDirect('B1');

            console.log('Cell A1:', cellA1);
            console.log('Cell A1 value:', cellA1?.value);
            console.log('Cell B1:', cellB1);
            console.log('Cell B1 value:', cellB1?.value);
            console.log('Cell B1 formula:', cellB1?.formula);
        }

        const outputSpan = container.querySelector('[data-cell="B1"]') as HTMLElement;
        console.log('B1 element after mount:', outputSpan);
        console.log('B1 textContent:', outputSpan?.textContent);

        expect(outputSpan.textContent).toBe('20');
    });
});
