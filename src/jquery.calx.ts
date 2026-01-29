/**
 * jQuery Calx Plugin - Backward Compatibility Wrapper
 * Wraps the modern Calx.js implementation with jQuery plugin API
 */

import { Calx } from './Calx';
import { Workbook } from './Calx/Workbook';
import { Sheet } from './Calx/Sheet';
import { DataType } from './Calx/Cell/DataType';
import { FormatterInterface } from './Calx/Cell/Formatter';

interface JQueryCalxOptions {
    data?: Record<string, SheetData | CellConfig>;
    autoCalculate?: boolean;
    variables?: Record<string, string>;
    functions?: Record<string, Function>;
    formatters?: Record<string, FormatterInterface>;
    styleFormatters?: Record<string, StyleFormatterFunction>;
}

interface SheetData {
    [cellAddress: string]: CellConfig;
}

interface CellConfig {
    value?: any;
    formula?: string;
    format?: string;
    type?: DataType;
    styleFormatter?: StyleFormatterFunction;
}

type StyleFormatterFunction = (value: any, $element: any) => Record<string, string> | void;

interface JQuery {
    calx(options?: JQueryCalxOptions | string, ...args: any[]): any;
}

// Extend jQuery
(function($: any) {
    if (!$) {
        console.warn('jQuery not found. The Calx jQuery plugin requires jQuery to be loaded first.');
        return;
    }

    // Store workbook instances per element group
    const workbooks = new WeakMap<HTMLElement, Workbook>();

    // Global formatter registry with predefined formatters
    // Each formatter has format() and parse() methods for input-mask behavior
    const formatterRegistry: Record<string, FormatterInterface> = {
        currency: {
            format: (value: any): string => {
                if (value == null || isNaN(value)) return '';
                return '$' + Number(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            parse: (input: string): any => {
                // Strip currency symbols, commas, spaces
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
                // Check if input already contains % symbol
                const hasPercent = inputStr.includes('%');
                // Strip % symbol and spaces
                const cleaned = inputStr.replace(/[%\s]/g, '');
                const num = parseFloat(cleaned);
                if (isNaN(num)) return null;
                // If user typed "30%", interpret as 30% (store as 0.30)
                // If user typed "30", interpret as raw value 30 (displays as 3000%)
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

    // Global function registry
    const functionRegistry: Record<string, Function> = {};

    // Global style formatter registry
    const styleFormatterRegistry: Record<string, StyleFormatterFunction> = {
        negative: (value: any, $element: any) => {
            if (value < 0) {
                return { color: 'red' };
            }
            return { color: '' }; // Reset color
        },
        positive: (value: any, $element: any) => {
            if (value > 0) {
                return { color: 'green' };
            }
            return { color: '' }; // Reset color
        },
        zero: (value: any, $element: any) => {
            if (value === 0) {
                return { color: 'gray' };
            }
            return { color: '' }; // Reset color
        }
    };

    /**
     * Register a custom formatter
     */
    $.calx = {
        registerFormatter: function(name: string, formatter: FormatterInterface) {
            formatterRegistry[name] = formatter;
        },

        registerFunction: function(name: string, func: Function) {
            functionRegistry[name.toUpperCase()] = func;
            // Also register with Calx core
            Calx.setFormula(name.toUpperCase(), func);
        },

        registerStyleFormatter: function(name: string, formatter: StyleFormatterFunction) {
            styleFormatterRegistry[name] = formatter;
        },

        getFormatter: function(name: string): FormatterInterface | undefined {
            return formatterRegistry[name];
        }
    };

    $.fn.calx = function(this: any, options?: JQueryCalxOptions | string, ...args: any[]) {
        // Handle method calls
        if (typeof options === 'string') {
            const method = options;
            const element = this[0];
            const workbook = workbooks.get(element);

            if (!workbook) {
                console.error('Calx not initialized on this element');
                return this;
            }

            return handleMethodCall(workbook, element, method, args);
        }

        // Initialize options with defaults
        const opts = $.extend(true, {
            data: {},
            autoCalculate: true,
            variables: {},
            functions: {},
            formatters: {},
            styleFormatters: {}
        }, options);

        // Register custom functions
        if (opts.functions) {
            Object.keys(opts.functions).forEach(name => {
                $.calx.registerFunction(name, opts.functions[name]);
            });
        }

        // Register custom formatters
        if (opts.formatters) {
            Object.keys(opts.formatters).forEach(name => {
                $.calx.registerFormatter(name, opts.formatters[name]);
            });
        }

        // Register custom style formatters
        if (opts.styleFormatters) {
            Object.keys(opts.styleFormatters).forEach(name => {
                styleFormatterRegistry[name] = opts.styleFormatters[name];
            });
        }

        // Determine if data has sheet structure or flat cell structure
        const hasSheetStructure = opts.data && Object.keys(opts.data).some(key => {
            const value = opts.data[key];
            return typeof value === 'object' && !('value' in value || 'formula' in value);
        });

        // Create one workbook for all selected elements
        const workbook = Calx.createWorkbook();

        // Process variables via NameManager
        if (opts.variables) {
            Object.keys(opts.variables).forEach(varName => {
                const reference = opts.variables[varName];
                workbook.nameManager.define(varName, reference);
            });
        }

        // First pass: Create all sheets to avoid race conditions with cross-sheet references
        const sheetElements: Array<{element: any, sheetName: string, sheetData: SheetData}> = [];

        this.each(function(this: HTMLElement, index: number) {
            const $element = $(this);

            // Determine sheet name from element ID or data-sheet attribute
            let sheetName = $element.attr('id') || $element.attr('data-sheet') || `Sheet${index + 1}`;

            // Get sheet-specific data from config if it exists
            const sheetData = hasSheetStructure && opts.data[sheetName]
                ? opts.data[sheetName] as SheetData
                : (hasSheetStructure ? {} : opts.data as SheetData);

            // Try to get existing sheet, create if it doesn't exist
            let sheet;
            try {
                sheet = workbook.getSheet(sheetName);
            } catch (e) {
                sheet = workbook.createSheet(sheetName);
                sheet.autoCalculate = opts.autoCalculate !== false; // Enable by default
            }

            // Store for second pass
            sheetElements.push({
                element: $element,
                sheetName: sheetName,
                sheetData: sheetData
            });

            // Store workbook reference on ALL elements
            workbooks.set(this, workbook);
        });

        // Second pass: Process all sheet data now that all sheets exist
        sheetElements.forEach(({element, sheetName, sheetData}) => {
            const sheet = workbook.getSheet(sheetName);
            if (sheet) {
                processSheetData(workbook, element, sheet, sheetData, opts);
            }
        });

        // Build and calculate
        workbook.build();

        // Mark all cells as dirty to ensure proper calculation on first load
        // This is important for cross-sheet references that may not have been resolved during cell creation
        sheetElements.forEach(({sheetName}) => {
            const sheet = workbook.getSheet(sheetName);
            if (sheet) {
                const cells = sheet.cells;
                for (const address in cells) {
                    const cell = cells[address];
                    if (cell.formula) {
                        cell.markAsDirty();
                    }
                }
            }
        });

        workbook.calculate();

        // Update all cells in all sheets
        this.each(function(this: HTMLElement, index: number) {
            const $element = $(this);
            const sheetName = $element.attr('id') || $element.attr('data-sheet') || `Sheet${index + 1}`;
            const sheet = workbook.getSheet(sheetName);
            if (sheet) {
                updateAllCells(sheet, $element);
            }
        });

        return this;
    };

    /**
     * Process sheet data (cells and formulas) after sheet is created
     */
    function processSheetData(
        workbook: Workbook,
        $element: any,
        sheet: Sheet,
        sheetData: SheetData,
        opts: JQueryCalxOptions
    ): void {
        // Process HTML elements with data-cell/data-formula attributes first
        // This will auto-assign CALX addresses to elements with data-formula but no data-cell
        processDataAttributes($element, sheet);

        // Process data configuration from arguments and merge with HTML attributes
        // Data from arguments takes precedence over HTML attributes
        if (sheetData) {
            Object.keys(sheetData).forEach(cellRef => {
                const config = sheetData[cellRef];
                const cell = sheet.getCell(cellRef);

                // Merge: data from arguments overrides HTML attributes
                if (config.value !== undefined) {
                    cell.value = config.value;
                }
                if (config.formula) {
                    cell.formula = config.formula;
                }
                if (config.format) {
                    cell.format = config.format;
                }
                if (config.type) {
                    cell.type = config.type;
                }
            });
        }

        // Listen to cell value changes to update DOM
        sheet.listen('VALUE_CHANGED', (event: any) => {
            const { address } = event;
            const $cell = $element.find(`[data-cell="${address}"]`);
            if ($cell.length) {
                const cell = sheet.getCell(address);
                const value = cell.value;

                // Skip updating focused inputs (user is typing)
                if ($cell.is('input, textarea') && $cell.is(':focus')) {
                    return;
                }

                // Apply formatter: data-format attribute > cell.format property > raw value
                const dataFormat = $cell.attr('data-format');
                const cellFormat = cell.format;
                let formattedValue: string;

                if (dataFormat && formatterRegistry[dataFormat]) {
                    formattedValue = formatterRegistry[dataFormat].format(value);
                } else if (cellFormat && formatterRegistry[cellFormat]) {
                    formattedValue = formatterRegistry[cellFormat].format(value);
                } else {
                    // Render as-is fallback
                    formattedValue = value != null ? String(value) : '';
                }

                if ($cell.is('input, select, textarea')) {
                    $cell.val(formattedValue);
                } else {
                    $cell.text(formattedValue);
                }

                // Apply conditional styling (style formatter)
                applyStyleFormatter(value, $cell);
            }
        });

        // Handle focus on formatted inputs: show raw value for editing
        $element.on('focus', 'input[data-format], textarea[data-format]', function() {
            const $input = $(this);
            const cellAddress = $input.attr('data-cell') || $input.attr('data-formula');

            if (cellAddress) {
                const cell = sheet.getCellDirect(cellAddress);
                if (cell) {
                    const rawValue = cell.value;
                    $input.val(rawValue != null ? String(rawValue) : '');
                }
            }
        });

        // Handle blur on formatted inputs: parse and format value (input-mask behavior)
        $element.on('blur', 'input[data-format], textarea[data-format]', function(e) {
            const $input = $(this);
            let cellAddress = $input.attr('data-cell') || $input.attr('data-formula');

            if (cellAddress) {
                const cell = sheet.getCellDirect(cellAddress);
                if (cell) {
                    const dataFormat = $input.attr('data-format');
                    const cellFormat = cell.format;

                    // Determine which formatter to use
                    const formatter = (dataFormat && formatterRegistry[dataFormat])
                        || (cellFormat && formatterRegistry[cellFormat]);

                    if (formatter) {
                        // Format for display immediately (legacy calx approach)
                        const formattedValue = formatter.format(cell.value);
                        $input.val(formattedValue);
                    }
                }
            }
        });

        // Handle change on formatted inputs: parse and calculate
        $element.on('change', 'input[data-format], textarea[data-format]', function(e) {
            const $input = $(this);
            let cellAddress = $input.attr('data-cell') || $input.attr('data-formula');

            if (cellAddress) {
                const cell = sheet.getCellDirect(cellAddress);
                if (cell) {
                    // Get the raw input value
                    const rawInput = $input.val();
                    const dataFormat = $input.attr('data-format');
                    const cellFormat = cell.format;

                    // Determine which formatter to use
                    const formatter = (dataFormat && formatterRegistry[dataFormat])
                        || (cellFormat && formatterRegistry[cellFormat]);

                    if (formatter && formatter.parse) {
                        // Parse the input (handles $2, 2, $2.00, etc.) - only for editable cells
                        const isReadonly = $input.prop('readonly');
                        const hasFormula = !!$input.attr('data-formula');

                        if (!isReadonly && !hasFormula) {
                            const parsedValue = formatter.parse(rawInput);

                            // Update the cell value with parsed value
                            if (parsedValue !== null && parsedValue !== cell.value) {
                                cell.value = parsedValue;

                                // Trigger calculation if auto-calculate is enabled
                                if (opts.autoCalculate) {
                                    workbook.calculate();
                                    // Update all cells in workbook
                                    const allElements: HTMLElement[] = [];
                                    $('body').find('*').each(function(this: HTMLElement) {
                                        if (workbooks.get(this) === workbook) {
                                            allElements.push(this);
                                        }
                                    });
                                    updateAllCellsInWorkbook(workbook, $(allElements));
                                }
                            }
                        }
                    }
                }
            }
        });

        // Setup auto-calculation on input changes
        if (opts.autoCalculate) {
            $element.on('input change', '[data-cell], [data-formula]', function() {
                const $input = $(this);
                let cellRef = $input.attr('data-cell') || $input.attr('data-formula');

                if (cellRef) {
                    // Skip inputs with data-format - let blur handler parse them
                    const hasFormat = $input.attr('data-format');
                    if (hasFormat) {
                        return;
                    }

                    const cell = sheet.getCellDirect(cellRef);
                    if (cell) {
                        const newValue = $input.val();
                        if (typeof newValue === 'string' || typeof newValue === 'number') {
                            cell.value = newValue;
                        }

                        workbook.calculate();

                        // Update all sheets in the workbook by finding all elements that share this workbook
                        const allElements: HTMLElement[] = [];
                        $('body').find('*').each(function(this: HTMLElement) {
                            if (workbooks.get(this) === workbook) {
                                allElements.push(this);
                            }
                        });
                        updateAllCellsInWorkbook(workbook, $(allElements));
                    }
                }
            });
        }
    }

    /**
     * Process data attributes on HTML elements
     */
    function processDataAttributes($element: any, sheet: Sheet): void {
        let calxCounter = 1;

        // First pass: Process elements with data-formula but no data-cell (auto-assign addresses)
        $element.find('[data-formula]:not([data-cell])').each(function(this: HTMLElement) {
            const $el = $(this);
            const autoAddress = `CALX${calxCounter}`;
            $el.attr('data-cell', autoAddress);
            calxCounter++;
        });

        // Second pass: Process all elements with data-cell (including auto-assigned ones)
        $element.find('[data-cell]').each(function(this: HTMLElement) {
            const $cell = $(this);
            const cellAddress = $cell.attr('data-cell');

            if (!cellAddress) return;

            // Register named variable if data-var is specified
            const varName = $cell.attr('data-var');
            if (varName) {
                const workbook = sheet.workbook;
                workbook.nameManager.define(varName, cellAddress);
            }

            // Get cell configuration from attributes
            const formula = $cell.attr('data-formula');
            const format = $cell.attr('data-format');
            const dataType = $cell.attr('data-type');

            // Get initial value from input/element
            const tagName = $cell.prop('tagName').toLowerCase();
            let initialValue: any = null;

            if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
                initialValue = $cell.val();
            } else {
                initialValue = $cell.text().trim();
            }

            // Parse initial value if formatter is present (for values like "25%" or "$1000")
            if (initialValue && format && formatterRegistry[format] && formatterRegistry[format].parse) {
                initialValue = formatterRegistry[format].parse(initialValue);
            }

            // Get or create cell
            const cell = sheet.getCell(cellAddress);

            // Set type FIRST if specified (before setting value)
            if (dataType) {
                switch (dataType.toLowerCase()) {
                    case 'number':
                        cell.type = DataType.NUMBER;
                        break;
                    case 'text':
                        cell.type = DataType.TEXT;
                        break;
                    case 'boolean':
                        cell.type = DataType.BOOLEAN;
                        break;
                    case 'date':
                        cell.type = DataType.DATE;
                        break;
                }
            }

            // Set formula if specified
            if (formula) {
                cell.formula = formula;
            } else if (initialValue !== null) {
                cell.value = initialValue;
            }

            // Set format if specified
            if (format) {
                cell.format = format;
            }
        });
    }

    /**
     * Update all cells in all sheets of a workbook
     */
    function updateAllCellsInWorkbook(workbook: Workbook, $elements: any): void {
        $elements.each(function(this: HTMLElement) {
            const $element = $(this);
            const sheetName = $element.attr('id') || $element.attr('data-sheet');
            if (sheetName) {
                try {
                    const sheet = workbook.getSheet(sheetName);
                    if (sheet) {
                        updateAllCells(sheet, $element);
                    }
                } catch (e) {
                    // Sheet might not exist, skip it
                }
            }
        });
    }

    /**
     * Update all cell elements with their current values
     */
    function updateAllCells(sheet: Sheet, $element: any): void {
        $element.find('[data-cell]').each(function(this: HTMLElement) {
            const $cell = $(this);
            const cellAddress = $cell.attr('data-cell');

            if (!cellAddress) return;

            const cell = sheet.getCellDirect(cellAddress);
            if (!cell) return;

            const value = cell.value;

            // Apply formatter: data-format attribute > cell.format property > raw value
            const dataFormat = $cell.attr('data-format');
            const cellFormat = cell.format;
            let formattedValue: string;

            if (dataFormat && formatterRegistry[dataFormat]) {
                formattedValue = formatterRegistry[dataFormat].format(value);
            } else if (cellFormat && formatterRegistry[cellFormat]) {
                formattedValue = formatterRegistry[cellFormat].format(value);
            } else {
                // Render as-is fallback
                formattedValue = value != null ? String(value) : '';
            }

            const tagName = $cell.prop('tagName').toLowerCase();

            // Don't update if this is the active/focused element (user is typing)
            if (document.activeElement === this) {
                return;
            }

            if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
                // Only update if value has changed to avoid cursor jumping
                if ($cell.val() !== formattedValue) {
                    $cell.val(formattedValue);
                }
            } else {
                $cell.text(formattedValue);
            }

            // Apply conditional styling (style formatter)
            applyStyleFormatter(value, $cell);
        });
    }

    /**
     * Apply conditional styling to a cell element
     */
    function applyStyleFormatter(value: any, $element: any): void {
        const styleFormatterName = $element.attr('data-style-if');

        if (styleFormatterName && styleFormatterRegistry[styleFormatterName]) {
            const css = styleFormatterRegistry[styleFormatterName](value, $element);
            if (css && typeof css === 'object') {
                // Always apply CSS to allow resetting styles
                $element.css(css);
            }
        }
    }

    /**
     * Handle method calls on initialized Calx instances
     */
    function handleMethodCall(workbook: Workbook, element: HTMLElement, method: string, args: any[]): any {
        // Determine the sheet name from the element or from the cell address
        let sheetName: string;

        if (args[0] && typeof args[0] === 'string' && args[0].includes('!')) {
            // Cell address includes sheet name (e.g., "Sheet1!A1")
            sheetName = args[0].split('!')[0].replace('#', '');
        } else {
            // Use element's ID or data-sheet attribute as sheet name
            const $element = $(element);
            sheetName = $element.attr('id') || $element.attr('data-sheet') || 'Sheet1';
        }

        const sheet = workbook.getSheet(sheetName);

        if (!sheet) {
            console.error(`Sheet '${sheetName}' not found`);
            return null;
        }

        switch (method) {
            case 'getCell':
                const address = args[0];
                return sheet.getCellDirect(address);

            case 'getCellValue':
                return sheet.getCellValue(args[0]);

            case 'setCellValue':
                const cellToSet = sheet.getCellDirect(args[0]);
                cellToSet.value = args[1];
                workbook.calculate();
                return workbook;

            case 'setCellFormula':
                const cellToSetFormula = sheet.getCellDirect(args[0]);
                cellToSetFormula.formula = args[1];
                workbook.build();
                workbook.calculate();
                return workbook;

            case 'calculate':
                workbook.calculate();
                return workbook;

            case 'build':
                workbook.build();
                return workbook;

            case 'getWorkbook':
                return workbook;

            case 'getSheet':
                const requestedSheet = args[0] ? workbook.getSheet(args[0]) : sheet;
                return requestedSheet;

            case 'destroy':
                // Clean up event listeners and references
                workbooks.delete(element);
                return null;

            default:
                console.warn(`Method '${method}' not found`);
                return workbook;
        }
    }

})(typeof jQuery !== 'undefined' ? jQuery : typeof $ !== 'undefined' ? $ : null);

// Export for module systems
export {};
