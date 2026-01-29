import { Calx } from '../src/Calx';

describe('Debug Topology', () => {
    it('should debug topology', () => {
        const workbook = Calx.createWorkbook();
        const sheet = workbook.createSheet('Sheet1');

        sheet.createCell('A1', { value: 10 });
        sheet.createCell('B1', { formula: '=A1*2' });
        sheet.createCell('C1', { formula: '=B1+5' });
        sheet.createCell('D1', { formula: '=C1^2' });

        workbook.build();

        const topology = (sheet as any)._depTree.flattenToTopology();

        console.log('Topology length:', topology.length);
        console.log('Topology addresses:', topology.map((c: any) => c.address));
        console.log('Has formula:');
        topology.forEach((c: any) => {
            console.log(`  ${c.address}: ${c.formula || '(no formula)'}`);
        });
    });
});
