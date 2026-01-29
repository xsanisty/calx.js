import { DataType } from "../Cell/DataType";

export type Data = {
    sheets: Record<string, {
        element?: any; // Changed from HTMLElement to any for test compatibility
        cells: Record<string, CellData>; // Simplified to direct mapping
        variables: Record<string, string>;
    }>;
};

// Define the Cell type
export type CellData = {
    formula?: string;
    value?: any;
    format?: string;
    type?: DataType;
    formatter?: Function;
};