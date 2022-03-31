import Workbook, { WorkbookConfig } from "./Calx/Workbook";

export function createWorkbook (name: string) {
    return new Workbook();
}

export function createWorkbookFromConfig(config : WorkbookConfig) {
    return Workbook.createFromConfig(config);
}

export function createWorkbookFromElement(element : HTMLElement, config ?: WorkbookConfig) {
    return Workbook.createFromElement(element, config);
}
