import Workbook from "./Calx/Workbook";
import { Config } from "./Calx/Workbook/Config";

export function createWorkbook() {
    const config : Config = {
        sheets : {},
    }

    return createWorkbookFromConfig(config);
}

export function createWorkbookFromConfig(config : Config) {
    return Workbook.createFromConfig(config);
}

export function createWorkbookFromElement(element : HTMLElement, config ?: Config) {
    return Workbook.createFromElement(element, config);
}
