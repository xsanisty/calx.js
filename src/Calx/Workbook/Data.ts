import { DataType } from "../Cell/DataType";

export type Data = {
    sheets: Record<string, {
        element?: HTMLElement;
        cells: MixedCells;
        variables: Record<string, string>;
    }>;
};

// Define a union type for mixed cells
type MixedCells = Record<string, IndividualCell | GroupedCells>;

// Define types for individual cells and grouped cells
type IndividualCell = Record<string, CellData>;
type GroupedCells = Record<string, IndividualCell>;

// Define the Cell type
export type CellData = {
    formula?: string;
    value?: any;
    format?: string;
    type?: DataType;
    formatter?: Function;
};