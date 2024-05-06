import Workbook from "./Calx/Workbook";
import { Data } from "./Calx/Workbook/Data";

export function createWorkbook() {
    const data : Data = {
        sheets : {},
    }

    return createWorkbookFromData(data);
}

export function createWorkbookFromData(data : Data) {
    return Workbook.createFromData(data);
}

export function createWorkbookFromElement(element : HTMLElement, data ?: Data) {
    return Workbook.createFromElement(element, data);
}
