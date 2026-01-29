# jQuery Calx Plugin - Backward Compatibility

This is a jQuery plugin wrapper for Calx.js v3.0, providing backward compatibility with the legacy jquery-calx API while leveraging the modern, TypeScript-based calculation engine.

## Installation

### Using npm/yarn

```bash
npm install @xsanisty/calxjs
# or
yarn add @xsanisty/calxjs
```

### Using CDN or Download

1. Include jQuery (required)
2. Include the jQuery Calx plugin

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="dist/jquery.calx.js"></script>
```

## Basic Usage

The simplest way to use jQuery Calx is with data attributes in your HTML:

```html
<form id="calx_form">
    <input data-cell="A1" value="10">
    <input data-cell="A2" value="20">
    <input data-cell="A3" value="30">

    <input data-cell="B1" data-formula="SUM(A1:A3)" readonly>
    <input data-cell="B2" data-formula="AVERAGE(A1:A3)" readonly>
    <input data-cell="B3" data-formula="(A1+A2)*A3" readonly>
</form>

<script>
    $('#calx_form').calx();
</script>
```

## Advanced Usage with Data Configuration

You can define formulas and cell configurations in JavaScript:

```html
<form id="calx_form">
    <input data-cell="A1">
    <input data-cell="A2">
    <input data-cell="A3">
    
    <input data-cell="B1" readonly>
    <input data-cell="B2" readonly>
    <input data-cell="B3" readonly>
</form>

<script>
    $('#calx_form').calx({
        data: {
            B1: { formula: 'SUM(A1:A3)' },
            B2: { formula: 'AVERAGE(A1:A3)' },
            B3: { formula: 'MAX(A1:A3)' }
        }
    });
</script>
```

## Hidden Cells

You can create cells that don't have HTML elements (useful for intermediate calculations):

```html
<form id="calx_form">
    <input data-cell="D1" readonly>
</form>

<script>
    $('#calx_form').calx({
        data: {
            A1: { value: 100 },           // Hidden cell with value
            A2: { value: 200 },           // Hidden cell with value
            A3: { formula: 'A1+A2' },     // Hidden cell with formula
            D1: { formula: 'A3*2' }       // Visible cell using hidden cells
        }
    });
</script>
```

## Configuration Options

```javascript
$('#calx_form').calx({
    data: {
        // Cell configurations
        'A1': {
            value: 100,              // Cell value
            formula: '=SUM(B1:B10)', // Cell formula
            format: '$ 0,0.00',      // Number format
            type: 'number'           // Data type: 'number', 'text', 'date', etc.
        }
    },
    autoCalculate: true              // Auto-recalculate on value changes (default: true)
});
```

## Methods

Once initialized, you can call methods on the Calx instance:

```javascript
// Get a cell object
var cell = $('#calx_form').calx('getCell', 'A1');

// Get cell value
var value = $('#calx_form').calx('getCellValue', 'A1');

// Set cell value
$('#calx_form').calx('setCellValue', 'A1', 100);

// Set cell formula
$('#calx_form').calx('setCellFormula', 'B1', '=A1*2');

// Manually trigger calculation
$('#calx_form').calx('calculate');

// Rebuild dependency tree
$('#calx_form').calx('build');

// Get the workbook instance
var workbook = $('#calx_form').calx('getWorkbook');

// Get the sheet instance
var sheet = $('#calx_form').calx('getSheet');

// Destroy the Calx instance
$('#calx_form').calx('destroy');
```

## Supported Formulas

jQuery Calx supports all Excel formulas from FormulaJS, plus custom functions:

### Math Functions
- `SUM`, `AVERAGE`, `MIN`, `MAX`, `COUNT`
- `ROUND`, `FLOOR`, `CEIL`, `ABS`
- `POWER`, `SQRT`, `EXP`, `LOG`
- And many more...

### Date Functions
- `DATE`, `YEAR`, `MONTH`, `DAY`
- `TODAY`, `NOW`
- Date arithmetic: `=DATE(2024,1,1)+30`

### Dynamic Array Functions (Excel 365)
- `SEQUENCE(rows, [cols], [start], [step])`
- `SORT(array, [index], [order])`
- `UNIQUE(array)`
- `FILTER(array, include, [if_empty])`

### Text Functions
- `CONCATENATE`, `LEFT`, `RIGHT`, `MID`
- `UPPER`, `LOWER`, `TRIM`
- And more...

### Logical Functions
- `IF`, `AND`, `OR`, `NOT`
- `IFERROR`, `IFNA`

## Examples

### Simple Calculator

```html
<form id="calculator">
    <input type="number" data-cell="A1" placeholder="Number 1">
    <input type="number" data-cell="A2" placeholder="Number 2">
    
    <input data-cell="B1" data-formula="A1+A2" readonly placeholder="Sum">
    <input data-cell="B2" data-formula="A1-A2" readonly placeholder="Difference">
    <input data-cell="B3" data-formula="A1*A2" readonly placeholder="Product">
    <input data-cell="B4" data-formula="A1/A2" readonly placeholder="Quotient">
</form>

<script>
    $('#calculator').calx();
</script>
```

### Invoice Calculator

```html
<form id="invoice">
    <input type="number" data-cell="A1" placeholder="Price">
    <input type="number" data-cell="A2" placeholder="Quantity">
    <input type="number" data-cell="A3" placeholder="Tax %">
    
    <input data-cell="B1" readonly> <!-- Subtotal -->
    <input data-cell="B2" readonly> <!-- Tax -->
    <input data-cell="B3" readonly> <!-- Total -->
</form>

<script>
    $('#invoice').calx({
        data: {
            B1: { formula: 'A1*A2' },           // Subtotal
            B2: { formula: 'B1*(A3/100)' },     // Tax amount
            B3: { formula: 'B1+B2' }            // Total
        }
    });
</script>
```

## Migration from Legacy jQuery Calx

This plugin maintains API compatibility with jquery-calx 2.x. Most code should work without changes:

```javascript
// Legacy jquery-calx code (still works!)
$('#form').calx({
    data: {
        'B1': { formula: 'SUM(A1:A3)' }
    }
});
```

### Key Differences

1. **Modern engine**: Uses TypeScript-based Calx.js v3.0 engine
2. **Better performance**: Optimized dependency tracking and calculation
3. **More formulas**: Includes Excel 365 dynamic array functions
4. **Type safety**: NUMBER is now the default cell type
5. **Date handling**: Improved date support with Excel serial dates

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- IE11+ (with polyfills)

## License

MIT License

## Links

- [GitHub Repository](https://github.com/xsanisty/calx.js)
- [Documentation](https://xsanisty.com/project/calxjs)
- [Examples](./examples/)

## Support

For issues and feature requests, please use the [GitHub issue tracker](https://github.com/xsanisty/calx.js/issues).
