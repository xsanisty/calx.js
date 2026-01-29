import { Calx } from '../src/Calx';

describe('Dependency Topology', () => {
    describe('Flatten to Topology', () => {
        it('should flatten dependency graph into topological order', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create a dependency chain: A1 -> B1 -> C1 -> D1
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { formula: '=A1*2' });
            sheet.createCell('C1', { formula: '=B1+5' });
            sheet.createCell('D1', { formula: '=C1^2' });

            workbook.build();

            // Get flattened topology
            const topology = (sheet as any)._depTree.flattenToTopology();

            // Topology should contain cells in calculation order
            expect(topology.length).toBe(3); // B1, C1, D1 (A1 has no formula)

            // Get addresses in order
            const addresses = topology.map((cell: any) => cell.address);

            // B1 should come before C1, and C1 before D1
            expect(addresses.indexOf('B1')).toBeLessThan(addresses.indexOf('C1'));
            expect(addresses.indexOf('C1')).toBeLessThan(addresses.indexOf('D1'));
        });

        it('should handle parallel branches in topology', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create a tree structure:
            //     A1
            //    /  \
            //   B1  B2
            //    \  /
            //     C1
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('B1', { formula: '=A1*2' });
            sheet.createCell('B2', { formula: '=A1*3' });
            sheet.createCell('C1', { formula: '=B1+B2' });

            workbook.build();

            const topology = (sheet as any)._depTree.flattenToTopology();

            expect(topology.length).toBe(3); // B1, B2, C1

            const addresses = topology.map((cell: any) => cell.address);

            // B1 and B2 should both come before C1
            expect(addresses.indexOf('B1')).toBeLessThan(addresses.indexOf('C1'));
            expect(addresses.indexOf('B2')).toBeLessThan(addresses.indexOf('C1'));
        });

        it('should handle complex dependency graph', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            // Create complex graph:
            //   A1   A2
            //    \  / \
            //     B1  B2
            //      \ /
            //      C1
            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { value: 20 });
            sheet.createCell('B1', { formula: '=A1+A2' });
            sheet.createCell('B2', { formula: '=A2*2' });
            sheet.createCell('C1', { formula: '=B1+B2' });

            workbook.build();

            const topology = (sheet as any)._depTree.flattenToTopology();

            expect(topology.length).toBe(3); // B1, B2, C1

            const addresses = topology.map((cell: any) => cell.address);

            // Both B1 and B2 must come before C1
            expect(addresses.indexOf('B1')).toBeLessThan(addresses.indexOf('C1'));
            expect(addresses.indexOf('B2')).toBeLessThan(addresses.indexOf('C1'));
        });
    });
});
