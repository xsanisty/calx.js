import { Workbook } from "../Workbook";
import { Data } from "./Data";
import { Sheet } from "../Sheet";
import { FormatterInterface } from "../Cell/Formatter";
import { DataType } from "../Cell/DataType";
import { Calx } from "../../calx";
import { CellEvent } from "../Cell/CellEvent";

interface SheetData {
    [cellAddress: string]: CellConfig;
}

interface CellConfig {
    value?: any;
    formula?: string;
    format?: string;
    type?: DataType;
}

type StyleFormatterFunction = (value: any, element: HTMLElement) => Record<string, string> | void;

/**
 * CalxElement - Vanilla JavaScript Workbook-to-DOM Binding
 *
 * Similar to the jQuery plugin but without jQuery dependency.
 *
 * Performance Optimization:
 * - Initial mount: Updates all cells after first calculation
 * - After mount: Only cells with VALUE_CHANGED events are updated automatically
 * - recalculate(): Only updates cells that were dirty before calculation
 * - updateAll(): Forces update of all cells (useful for manual value changes)
 *
 * This approach minimizes unnecessary DOM updates, only rendering cells that actually changed.
 */

export class CalxElement {
    private _workbook: Workbook;
    private _mountedElement?: HTMLElement;
    private _isMounted: boolean = false;
    private _config?: Data;
    private _calxCounter: number = 1;
    private _eventListeners: Array<{ element: HTMLElement | Document, event: string, handler: EventListener }> = [];
    private _sheetElementMap: Map<string, HTMLElement> = new Map();

    // Global formatter registry
    private static formatterRegistry: Record<string, FormatterInterface> = {
        currency: {
            format: (value: any): string => {
                if (value == null || isNaN(value)) return '';
                return '$' + Number(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            parse: (input: string): any => {
                const cleaned = String(input).replace(/[$,\s]/g, '');
                const num = parseFloat(cleaned);
                return isNaN(num) ? null : num;
            }
        },
        percent: {
            format: (value: any): string => {
                if (value == null || isNaN(value)) return '';
                return (Number(value) * 100).toFixed(2) + '%';
            },
            parse: (input: string): any => {
                const inputStr = String(input).trim();
                const hasPercent = inputStr.includes('%');
                const cleaned = inputStr.replace(/[%\s]/g, '');
                const num = parseFloat(cleaned);
                if (isNaN(num)) return null;
                return hasPercent ? num / 100 : num;
            }
        },
        number: {
            format: (value: any): string => {
                if (value == null || isNaN(value)) return '';
                return Number(value).toFixed(2);
            },
            parse: (input: string): any => {
                const num = parseFloat(String(input));
                return isNaN(num) ? null : num;
            }
        },
        integer: {
            format: (value: any): string => {
                if (value == null || isNaN(value)) return '';
                return Math.round(Number(value)).toString();
            },
            parse: (input: string): any => {
                const num = parseFloat(String(input));
                return isNaN(num) ? null : Math.round(num);
            }
        },
        text: {
            format: (value: any): string => {
                return value != null ? String(value) : '';
            },
            parse: (input: string): any => {
                return input;
            }
        }
    };

    // Global style formatter registry
    private static styleFormatterRegistry: Record<string, StyleFormatterFunction> = {
        negative: (value: any, element: HTMLElement) => {
            if (value < 0) {
                return { color: 'red' };
            }
            return { color: '' };
        },
        positive: (value: any, element: HTMLElement) => {
            if (value > 0) {
                return { color: 'green' };
            }
            return { color: '' };
        },
        zero: (value: any, element: HTMLElement) => {
            if (value === 0) {
                return { color: 'gray' };
            }
            return { color: '' };
        }
    };

    constructor(
        element: HTMLElement | string,
        workbook: Workbook,
        config?: Data
    ) {
        this._workbook = workbook;
        this._config = config;

        this.mount(element);
    }

    /**
     * Register a custom formatter
     */
    public static registerFormatter(name: string, formatter: FormatterInterface): void {
        CalxElement.formatterRegistry[name] = formatter;
    }

    /**
     * Register a custom style formatter
     */
    public static registerStyleFormatter(name: string, formatter: StyleFormatterFunction): void {
        CalxElement.styleFormatterRegistry[name] = formatter;
    }

    /**
     * Get a formatter by name
     */
    public static getFormatter(name: string): FormatterInterface | undefined {
        return CalxElement.formatterRegistry[name];
    }

    /**
     * Get the workbook instance
     */
    public get workbook(): Workbook {
        return this._workbook;
    }

    /**
     * Get the mounted element
     */
    public get element(): HTMLElement | undefined {
        return this._mountedElement;
    }

    /**
     * Check if the workbook is mounted
     */
    public get isMounted(): boolean {
        return this._isMounted;
    }

    /**
     * Mounts the workbook into specified element.
     * - it will traverse the element, looking for any element with 'data-sheet' attribute,
     *   and attach event listeners to handle cell editing and updates.
     * - it will look for elements with 'data-formula', 'data-cell' attribute to display computed values.
     * - it will setup the necessary bindings to ensure that changes in the workbook
     * - are reflected in the DOM and vice versa.
     * - it then merges any provided configuration data and data gathered from the DOM into the workbook.
     *
     * @param {String|HTMLElement} element   The element or its ID where the workbook should be mounted.
     *
     * @returns true if mounted successfully, false otherwise.
     */
    public mount(element: string | HTMLElement): boolean {
        try {
            // Resolve element
            const rootElement = typeof element === 'string'
                ? document.getElementById(element) || document.querySelector(element)
                : element;

            if (!rootElement) {
                console.error('CalxElement: Element not found');
                return false;
            }

            this._mountedElement = rootElement as HTMLElement;

            // Find all sheet containers
            const sheetElements = this.findSheetElements(rootElement as HTMLElement);

            if (sheetElements.length === 0) {
                // No explicit sheets found, treat root as single sheet
                this._sheetElementMap.set('Sheet1', rootElement as HTMLElement);
                this.mountSheet(rootElement as HTMLElement, 'Sheet1');
            } else {
                // Mount each sheet
                sheetElements.forEach((sheetEl, index) => {
                    const sheetName = sheetEl.getAttribute('data-sheet') ||
                                     sheetEl.id ||
                                     `Sheet${index + 1}`;
                    this._sheetElementMap.set(sheetName, sheetEl);
                    this.mountSheet(sheetEl, sheetName);
                });
            }

            // Build and calculate workbook
            this._workbook.build();

            // Mark all cells as dirty for initial calculation
            const sheetNames = Object.keys(this._workbook.getSheets());
            for (const sheetName of sheetNames) {
                const sheet = this._workbook.getSheet(sheetName);
                if (!sheet) continue;
                const cells = sheet.cells;
                for (const address in cells) {
                    cells[address].markAsDirty();
                }
            }

            this._workbook.calculate();

            // For initial mount, update all cells (after first calculation)
            // After this, only VALUE_CHANGED events and recalculate() will trigger updates
            this.updateAllCells();

            this._isMounted = true;
            return true;

        } catch (error) {
            console.error('CalxElement: Failed to mount', error);
            return false;
        }
    }

    /**
     * Unmount the workbook and clean up event listeners
     */
    public unmount(): void {
        // Remove all event listeners
        this._eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this._eventListeners = [];

        this._mountedElement = undefined;
        this._isMounted = false;
    }

    /**
     * Recalculate and update only dirty cells
     */
    public recalculate(): void {
        // Collect cells that are currently dirty before calculation
        const dirtyCellsBefore = this.collectDirtyCells();

        this._workbook.calculate();

        // Update only cells that were dirty and potentially changed
        this.updateSpecificCells(dirtyCellsBefore);
    }

    /**
     * Force update all cells regardless of dirty state
     */
    public updateAll(): void {
        this.updateAllCells();
    }

    /**
     * Find all elements with data-sheet attribute
     */
    private findSheetElements(root: HTMLElement): HTMLElement[] {
        const sheets: HTMLElement[] = [];

        // Check if root itself is a sheet
        if (root.hasAttribute('data-sheet')) {
            sheets.push(root);
        }

        // Find child sheets
        const childSheets = root.querySelectorAll('[data-sheet]');
        childSheets.forEach(el => sheets.push(el as HTMLElement));

        return sheets;
    }

    /**
     * Mount a single sheet
     */
    private mountSheet(element: HTMLElement, sheetName: string): void {
        // Get or create sheet
        let sheet: Sheet;
        try {
            const s = this._workbook.getSheet(sheetName);
            if (!s) throw new Error('Sheet not found');
            sheet = s;
        } catch (e) {
            sheet = this._workbook.createSheet(sheetName);
            sheet.autoCalculate = true;
        }

        // Process data attributes
        this.processDataAttributes(element, sheet);

        // Setup event listeners for this sheet
        this.setupEventListeners(element, sheet);

        // Listen to sheet value changes
        this.setupValueChangeListener(element, sheet);
    }

    /**
     * Process data attributes on HTML elements
     */
    private processDataAttributes(element: HTMLElement, sheet: Sheet): void {
        // First pass: Auto-assign CALX addresses to elements with data-formula but no data-cell
        const formulaElements = element.querySelectorAll('[data-formula]:not([data-cell])');
        formulaElements.forEach(el => {
            const autoAddress = `CALX${this._calxCounter}`;
            el.setAttribute('data-cell', autoAddress);
            this._calxCounter++;
        });

        // Second pass: Process all elements with data-cell
        const cellElements = element.querySelectorAll('[data-cell]');
        cellElements.forEach(el => {
            const htmlEl = el as HTMLElement;
            const cellAddress = htmlEl.getAttribute('data-cell');
            if (!cellAddress) return;

            // Register named variable if data-var is specified
            const varName = htmlEl.getAttribute('data-var');
            if (varName) {
                this._workbook.nameManager.define(varName, cellAddress);
            }

            // Get cell configuration
            const formula = htmlEl.getAttribute('data-formula');
            const format = htmlEl.getAttribute('data-format');
            const dataType = htmlEl.getAttribute('data-type');

            // Get initial value
            let initialValue: any = null;
            const tagName = htmlEl.tagName.toLowerCase();

            if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
                initialValue = (htmlEl as HTMLInputElement).value;
            } else {
                initialValue = htmlEl.textContent?.trim();
            }

            // Parse initial value if formatter is present
            if (initialValue && format && CalxElement.formatterRegistry[format]?.parse) {
                initialValue = CalxElement.formatterRegistry[format].parse(initialValue);
            }

            // Get or create cell
            const cell = sheet.getCell(cellAddress);

            // Set type FIRST if specified
            if (dataType) {
                const typeEnum = dataType.toUpperCase() as keyof typeof DataType;
                if (DataType[typeEnum]) {
                    cell.type = DataType[typeEnum];
                }
            }

            // Set formula or value
            if (formula) {
                cell.formula = formula;
            } else if (initialValue !== null && initialValue !== '') {
                cell.value = initialValue;
            }

            // Note: format is stored but accessed internally by Cell
            // The formatter will be applied in updateAllCells and VALUE_CHANGED listener
        });
    }

    /**
     * Setup event listeners for a sheet
     */
    private setupEventListeners(element: HTMLElement, sheet: Sheet): void {
        // Handle focus on formatted inputs: show raw value
        const focusHandler = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.hasAttribute('data-format') &&
                (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
                const cellAddress = target.getAttribute('data-cell') || target.getAttribute('data-formula');
                if (cellAddress) {
                    const cell = sheet.getCellDirect(cellAddress);
                    if (cell) {
                        (target as HTMLInputElement).value = String(cell.value ?? '');
                    }
                }
            }
        };

        // Handle blur on formatted inputs: parse and format
        const blurHandler = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.hasAttribute('data-format') &&
                (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
                const cellAddress = target.getAttribute('data-cell') || target.getAttribute('data-formula');
                if (cellAddress) {
                    const cell = sheet.getCellDirect(cellAddress);
                    if (cell) {
                        const formatName = target.getAttribute('data-format');
                        const formatter = formatName ? CalxElement.formatterRegistry[formatName] : null;

                        if (formatter?.format) {
                            const formattedValue = formatter.format(cell.value);
                            (target as HTMLInputElement).value = formattedValue;
                        }
                    }
                }
            }
        };

        // Handle input/change events
        const changeHandler = (e: Event) => {
            const target = e.target as HTMLElement;
            const cellAddress = target.getAttribute('data-cell') || target.getAttribute('data-formula');

            if (cellAddress) {
                const cell = sheet.getCellDirect(cellAddress);
                if (cell) {
                    let newValue: any;
                    const tagName = target.tagName.toLowerCase();

                    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
                        newValue = (target as HTMLInputElement).value;
                    } else {
                        newValue = target.textContent?.trim();
                    }

                    // Parse value if formatter is present
                    const formatName = target.getAttribute('data-format');
                    const formatter = formatName ? CalxElement.formatterRegistry[formatName] : null;

                    if (formatter?.parse) {
                        newValue = formatter.parse(newValue);
                    }

                    // Update cell value
                    cell.value = newValue;

                    // Trigger recalculation if auto-calculate is enabled
                    if (sheet.autoCalculate) {
                        sheet.calculate();
                    }
                }
            }
        };

        // Add event listeners
        element.addEventListener('focus', focusHandler, true);
        element.addEventListener('blur', blurHandler, true);
        element.addEventListener('change', changeHandler, true);
        element.addEventListener('input', changeHandler, true);

        // Store references for cleanup
        this._eventListeners.push(
            { element, event: 'focus', handler: focusHandler },
            { element, event: 'blur', handler: blurHandler },
            { element, event: 'change', handler: changeHandler },
            { element, event: 'input', handler: changeHandler }
        );
    }

    /**
     * Setup listener for value changes from the sheet
     */
    private setupValueChangeListener(element: HTMLElement, sheet: Sheet): void {
        // Handler for updating DOM when cell values change
        const updateCellDOM = (event: any) => {
            // Handle both 'address' and 'cell' property names
            const address = event.address || event.cell;
            const value = event.value;

            const cellElement = element.querySelector(`[data-cell="${address}"]`) as HTMLElement;

            if (cellElement) {
                // Skip updating focused inputs (user is typing)
                if ((cellElement.tagName === 'INPUT' || cellElement.tagName === 'TEXTAREA') &&
                    document.activeElement === cellElement) {
                    return;
                }

                // Apply formatter
                const dataFormat = cellElement.getAttribute('data-format');
                let formattedValue: string;

                if (dataFormat && CalxElement.formatterRegistry[dataFormat]) {
                    formattedValue = CalxElement.formatterRegistry[dataFormat].format(value);
                } else {
                    formattedValue = value != null ? String(value) : '';
                }

                // Update element
                const tagName = cellElement.tagName.toLowerCase();
                if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
                    (cellElement as HTMLInputElement).value = formattedValue;
                } else {
                    cellElement.textContent = formattedValue;
                }

                // Apply style formatter
                this.applyStyleFormatter(value, cellElement);
            }
        };

        // Listen to both VALUE_CHANGED (direct value changes) and CALCULATED (formula results)
        sheet.listen(CellEvent.VALUE_CHANGED, updateCellDOM);
        sheet.listen(CellEvent.CALCULATED, updateCellDOM);
    }

    /**
     * Collect all currently dirty cells across all sheets
     */
    private collectDirtyCells(): Map<string, Set<string>> {
        const dirtyCells = new Map<string, Set<string>>();

        const sheetNames = Object.keys(this._workbook.getSheets());
        for (const sheetName of sheetNames) {
            const sheet = this._workbook.getSheet(sheetName);
            if (!sheet) continue;

            const cells = sheet.cells;
            const dirtyAddresses = new Set<string>();

            for (const address in cells) {
                if (cells[address].isDirty()) {
                    dirtyAddresses.add(address);
                }
            }

            if (dirtyAddresses.size > 0) {
                dirtyCells.set(sheetName, dirtyAddresses);
            }
        }

        return dirtyCells;
    }

    /**
     * Update specific cells in the DOM
     */
    private updateSpecificCells(cellMap: Map<string, Set<string>>): void {
        if (!this._mountedElement) return;

        for (const [sheetName, addresses] of cellMap.entries()) {
            const sheet = this._workbook.getSheet(sheetName);
            if (!sheet) continue;

            const sheetElement = this._sheetElementMap.get(sheetName) || this._mountedElement;

            for (const address of addresses) {
                const cell = sheet.getCellDirect(address);
                if (!cell) continue;

                const cellElement = sheetElement.querySelector(`[data-cell="${address}"]`) as HTMLElement;
                if (cellElement) {
                    this.updateCellElement(cellElement, cell, sheet);
                }
            }
        }
    }

    /**
     * Update only cells that are marked as dirty
     */
    private updateDirtyCells(): void {
        if (!this._mountedElement) return;

        const sheetNames = Object.keys(this._workbook.getSheets());
        for (const sheetName of sheetNames) {
            const sheet = this._workbook.getSheet(sheetName);
            if (!sheet) continue;

            const sheetElement = this._sheetElementMap.get(sheetName) || this._mountedElement;
            const cells = sheet.cells;

            // Only update cells that are dirty
            for (const address in cells) {
                const cell = cells[address];
                if (!cell.isDirty()) continue; // Skip non-dirty cells

                const cellElement = sheetElement.querySelector(`[data-cell="${address}"]`) as HTMLElement;
                if (cellElement) {
                    this.updateCellElement(cellElement, cell, sheet);
                }
            }
        }
    }

    /**
     * Update all cell elements with their current values
     */
    private updateAllCells(): void {
        if (!this._mountedElement) return;

        const cellElements = this._mountedElement.querySelectorAll('[data-cell]');

        cellElements.forEach(el => {
            const htmlEl = el as HTMLElement;
            const cellAddress = htmlEl.getAttribute('data-cell');
            if (!cellAddress) return;

            // Find the sheet containing this cell
            let sheet: Sheet | null = null;
            const sheetContainer = htmlEl.closest('[data-sheet]') as HTMLElement;

            if (sheetContainer) {
                const sheetName = sheetContainer.getAttribute('data-sheet') ||
                                 sheetContainer.id;
                if (sheetName) {
                    try {
                        const s = this._workbook.getSheet(sheetName);
                        if (s) sheet = s;
                    } catch (e) {
                        // Sheet not found
                    }
                }
            } else {
                // Try first sheet or Sheet1
                const sheetNames = Object.keys(this._workbook.getSheets());
                if (sheetNames.length > 0) {
                    const s = this._workbook.getSheet(sheetNames[0]);
                    if (s) sheet = s;
                }
            }

            if (!sheet) return;

            const cell = sheet.getCellDirect(cellAddress);
            if (!cell) return;

            this.updateCellElement(htmlEl, cell, sheet);
        });
    }

    /**
     * Update a single cell element with its current value
     */
    private updateCellElement(element: HTMLElement, cell: any, sheet: Sheet): void {
        const value = cell.value;

        // Don't update if this is the active element (user is typing)
        if (document.activeElement === element) return;

        // Apply formatter
        const dataFormat = element.getAttribute('data-format');
        let formattedValue: string;

        if (dataFormat && CalxElement.formatterRegistry[dataFormat]) {
            formattedValue = CalxElement.formatterRegistry[dataFormat].format(value);
        } else {
            formattedValue = value != null ? String(value) : '';
        }

        const tagName = element.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
            (element as HTMLInputElement).value = formattedValue;
        } else {
            element.textContent = formattedValue;
        }

        // Apply style formatter
        this.applyStyleFormatter(value, element);
    }

    /**
     * Apply conditional styling to a cell element
     */
    private applyStyleFormatter(value: any, element: HTMLElement): void {
        const styleFormatterName = element.getAttribute('data-style-if');

        if (styleFormatterName && CalxElement.styleFormatterRegistry[styleFormatterName]) {
            const css = CalxElement.styleFormatterRegistry[styleFormatterName](value, element);
            if (css && typeof css === 'object') {
                Object.keys(css).forEach(prop => {
                    (element.style as any)[prop] = css[prop];
                });
            }
        }
    }
}