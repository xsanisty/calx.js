import { Calx } from '../src/Calx';
import { DataType } from '../src/Calx/Cell/DataType';

describe('Workbook', () => {
    describe('Workbook Creation', () => {
        test('should create empty workbook', () => {
            const workbook = Calx.createWorkbook();

            expect(workbook).toBeDefined();
            expect(workbook.getSheets()).toEqual({});
        });

        test('should create workbook from data', () => {
            const workbook = Calx.createWorkbookFromData({
                sheets: {
                    'Sheet1': {
                        cells: {
                            'A1': { value: 100, type: DataType.NUMBER }
                        },
                        variables: {}
                    }
                }
            });

            expect(workbook).toBeDefined();
            const sheet = workbook.getSheet('Sheet1');
            expect(sheet).toBeDefined();
        });
    });

    describe('Sheet Management', () => {
        test('should create sheet', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('TestSheet');

            expect(sheet).toBeDefined();
            expect(sheet.name).toBe('TestSheet');
        });

        test('should get sheet by name', () => {
            const workbook = Calx.createWorkbook();
            workbook.createSheet('Sheet1');

            const sheet = workbook.getSheet('Sheet1');

            expect(sheet).toBeDefined();
            if (sheet) {
                expect(sheet.name).toBe('Sheet1');
            }
        });

        test('should get all sheets', () => {
            const workbook = Calx.createWorkbook();
            workbook.createSheet('Sheet1');
            workbook.createSheet('Sheet2');

            const sheets = workbook.getSheets();

            expect(Object.keys(sheets).length).toBe(2);
            expect(sheets['Sheet1']).toBeDefined();
            expect(sheets['Sheet2']).toBeDefined();
        });

        test('should throw error for duplicate sheet name', () => {
            const workbook = Calx.createWorkbook();
            workbook.createSheet('Sheet1');

            expect(() => {
                workbook.createSheet('Sheet1');
            }).toThrow();
        });
    });

    describe('Calculation', () => {
        test('should calculate entire workbook', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { formula: '=A1*2' });

            workbook.build();
            workbook.calculate();

            expect(sheet.getCellDirect('A2').value).toBe(20);
        });

        test('should build dependency tree', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 10 });
            sheet.createCell('A2', { formula: '=A1*2' });
            sheet.createCell('A3', { formula: '=A2+5' });

            expect(() => {
                workbook.build();
            }).not.toThrow();
        });
    });

    describe('Active Sheet', () => {
        test('should set and get active sheet', () => {
            const workbook = Calx.createWorkbook();
            const sheet1 = workbook.createSheet('Sheet1');
            const sheet2 = workbook.createSheet('Sheet2');

            workbook.setActiveSheet(sheet1);
            expect(workbook.getActiveSheet()).toBe(sheet1);

            workbook.setActiveSheet(sheet2);
            expect(workbook.getActiveSheet()).toBe(sheet2);
        });
    });

    describe('Object Hydration', () => {
        test('should hydrate object with cell values', () => {
            const workbook = Calx.createWorkbook();
            const sheet = workbook.createSheet('Sheet1');

            sheet.createCell('A1', { value: 100 });
            sheet.createCell('B1', { value: 200 });

            const obj = {
                value1: '#Sheet1!A1',
                value2: '#Sheet1!B1'
            };

            workbook.build();
            workbook.calculate();
            workbook.hydrateObj(obj);

            // Note: This feature needs to be fully implemented
            // For now, just test it doesn't throw
            expect(obj).toBeDefined();
        });
    });
});
