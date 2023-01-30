
export type Config = {
    sheets: Record<string, {
        element?: HTMLElement;
        cells: Record<string, {}>;
    }>;
};
