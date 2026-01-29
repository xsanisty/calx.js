# jQuery Calx Plugin - v3.0

Backward compatibility wrapper for Calx.js v3.0, providing a jQuery plugin interface with powerful new features including multi-sheet support, variables, custom formatters, and explicit type specifications.

## 🚀 What's New in 3.0

- **Multi-Sheet Workbooks**: Combine multiple HTML elements into one workbook with named sheets
- **Named Variables**: Define variables that reference cells using the Name Manager
- **Data Type Attributes**: Specify cell types explicitly using `data-type` attribute
- **Custom Formatters**: Register custom formatters for displaying cell values
- **Custom Functions**: Register user-defined calculation functions
- **Cross-Sheet References**: Reference cells across sheets using `Sheet!Cell` syntax
- **TypeScript Support**: Full TypeScript implementation with type definitions

## Installation

### Using npm

```bash
npm install @xsanisty/calxjs
```

### Using in Browser

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="node_modules/@xsanisty/calxjs/dist/jquery.calx.js"></script>
```

## Basic Usage

### Simple Form Calculation

```html
<form id="calculator">
    <input data-cell="A1" value="10" />
    <input data-cell="A2" value="20" />
    <input data-cell="A3" data-formula="A1+A2" readonly />
</form>

<script>
    $('#calculator').calx();
</script>
```

### With Data Attributes

```html
<div id="price-calculator">
    <label>Price: <input data-cell="B1" data-type="number" value="99.99" /></label>
    <label>Quantity: <input data-cell="B2" data-type="number" value="5" /></label>
    <label>Tax Rate: <input data-cell="B3" data-type="number" value="0.08" /></label>

    <p>Subtotal: <span data-cell="B4" data-formula="B1*B2" data-format="currency"></span></p>
    <p>Tax: <span data-cell="B5" data-formula="B4*B3" data-format="currency"></span></p>
    <p>Total: <span data-cell="B6" data-formula="B4+B5" data-format="currency"></span></p>
</div>

<script>
    // Register custom formatter
    $.calx.registerFormatter('currency', {
        format: function(value) {
            return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    });

    $('#price-calculator').calx({ autoCalculate: true });
</script>
```

## Advanced Features

### Multiple Sheets in One Workbook

Combine multiple HTML elements into a single workbook with cross-sheet references:

```html
<div id="Sales">
    <input data-cell="A1" value="1000" />
    <input data-cell="A2" value="2000" />
    <span data-cell="A3" data-formula="SUM(A1:A2)"></span>
</div>

<div id="Tax">
    <input data-cell="A1" value="0.08" />
</div>

<div id="Report">
    <p>Sales Total: <span data-cell="B1" data-formula="Sales!A3"></span></p>
    <p>Tax: <span data-cell="B2" data-formula="Sales!A3*Tax!A1"></span></p>
    <p>Grand Total: <span data-cell="B3" data-formula="B1+B2"></span></p>
</div>

<script>
    // All three elements share one workbook
    $('#Sales, #Tax, #Report').calx({
        autoCalculate: true
    });
</script>
```

### Named Variables

Use named variables for better readability and maintainability:

```html
<div id="Config">
    <input data-cell="A1" value="0.08" /> <!-- Tax Rate -->
    <input data-cell="A2" value="0.10" /> <!-- Discount Rate -->
</div>

<div id="Order">
    <input data-cell="B1" value="1000" /> <!-- Order Amount -->
    <span data-cell="B2" data-formula="B1*DiscountRate"></span> <!-- Discount -->
    <span data-cell="B3" data-formula="(B1-B2)*TaxRate"></span> <!-- Tax -->
    <span data-cell="B4" data-formula="B1-B2+B3"></span> <!-- Total -->
</div>

<script>
    $('#Config, #Order').calx({
        autoCalculate: true,
        variables: {
            TaxRate: 'Config!A1',
            DiscountRate: 'Config!A2'
        }
    });
</script>
```

### Data Type Specifications

Use `data-type` attribute to explicitly specify cell types:

```html
<div id="types-demo">
    <!-- Number type -->
    <input data-cell="A1" data-type="number" value="42" />

    <!-- Text type -->
    <input data-cell="A2" data-type="text" value="Hello" />

    <!-- Date type -->
    <input type="date" data-cell="A3" data-type="date" value="2024-01-15" />

    <!-- Boolean type -->
    <input data-cell="A4" data-type="boolean" value="true" />

    <!-- Formula with date calculation -->
    <span data-cell="A5" data-formula="A3+30"></span> <!-- 30 days after A3 -->
</div>

<script>
    $('#types-demo').calx({ autoCalculate: true });
</script>
```

### Custom Formatters

Register and use custom formatters for displaying values:

```javascript
// Register formatters
$.calx.registerFormatter('currency', {
    format: function(value) {
        if (typeof value === 'number') {
            return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return '$0.00';
    }
});

$.calx.registerFormatter('percentage', {
    format: function(value) {
        if (typeof value === 'number') {
            return (value * 100).toFixed(1) + '%';
        }
        return '0%';
    }
});

$.calx.registerFormatter('date', {
    format: function(value) {
        if (typeof value === 'number') {
            const baseDate = new Date(1899, 11, 30);
            const date = new Date(baseDate.getTime() + value * 24 * 60 * 60 * 1000);
            return date.toLocaleDateString();
        }
        return '-';
    }
});
```

Use formatters in HTML:

```html
<span data-cell="A1" data-formula="1234.56" data-format="currency"></span>
<span data-cell="A2" data-formula="0.085" data-format="percentage"></span>
<span data-cell="A3" data-formula="DATE(2024,1,15)" data-format="date"></span>
```

### Custom Functions

Register custom calculation functions:

```javascript
// Register custom function
$.calx.registerFunction('DOUBLE', function(value) {
    return value * 2;
});

$.calx.registerFunction('GREET', function(name) {
    return 'Hello, ' + name + '!';
});

// Use in formulas
$('#sheet').calx({
    data: {
        A1: { value: 42 },
        A2: { formula: 'DOUBLE(A1)' }, // Results in 84
        B1: { value: 'World' },
        B2: { formula: 'GREET(B1)' }   // Results in "Hello, World!"
    }
});
```

### Hidden Cells (Data-Only Cells)

Define cells that don't have HTML representations:

```javascript
$('#form').calx({
    data: {
        // Visible cells (attached to HTML elements)
        A1: { value: 100 },
        A2: { value: 200 },

        // Hidden cells (calculations only, no HTML element)
        H1: { formula: 'A1+A2' },
        H2: { formula: 'H1*0.08' },

        // Use hidden cells in formulas
        A3: { formula: 'H1+H2' }
    }
});
```

## Options

### Configuration Object

```javascript
$('#element').calx({
    // Enable/disable automatic recalculation
    autoCalculate: true,

    // Cell data configuration
    data: {
        A1: {
            value: 100,
            formula: 'B1+B2',
            format: 'currency',
            type: 'number'
        }
    },

    // Named variable definitions
    variables: {
        TaxRate: 'Sheet1!A1',
        DiscountRate: 'Sheet1!A2'
    },

    // Custom function definitions
    functions: {
        TRIPLE: function(x) { return x * 3; }
    },

    // Custom formatter definitions
    formatters: {
        custom: {
            format: function(value) { return '>> ' + value; }
        }
    }
});
```

### Cell Configuration

Each cell can have the following properties:

- `value`: Initial cell value
- `formula`: Calculation formula (e.g., `"SUM(A1:A10)"`)
- `format`: Format function or formatter name
- `type`: Data type (`"number"`, `"text"`, `"date"`, `"boolean"`)

## Data Attributes

### Available Attributes

- `data-cell="A1"`: Cell address
- `data-formula="SUM(A1:A10)"`: Cell formula
- `data-format="currency"`: Formatter name
- `data-type="number"`: Cell data type (`number`, `text`, `date`, `boolean`)
- `data-sheet="SheetName"`: Explicit sheet name (alternative to using element ID)

### Example

```html
<input
    data-cell="B5"
    data-type="number"
    data-formula="B1*B2"
    data-format="currency"
    value="0"
/>
```

## Methods

### Programmatic API

Call methods on initialized Calx instances:

```javascript
// Get a cell object
var cell = $('#form').calx('getCell', 'A1');

// Get cell value
var value = $('#form').calx('getCellValue', 'A1');

// Set cell value
$('#form').calx('setCellValue', 'A1', 100);

// Set cell formula
$('#form').calx('setCellFormula', 'A1', 'SUM(B1:B10)');

// Trigger calculation
$('#form').calx('calculate');

// Rebuild dependency tree
$('#form').calx('build');

// Get workbook instance
var workbook = $('#form').calx('getWorkbook');

// Get sheet instance
var sheet = $('#form').calx('getSheet', 'SheetName');

// Destroy instance
$('#form').calx('destroy');
```

## Formulas

Calx supports 300+ Excel functions including:

### Math Functions
- `SUM(range)`, `AVERAGE(range)`, `MIN(range)`, `MAX(range)`
- `ROUND(value, decimals)`, `FLOOR(value)`, `CEILING(value)`
- `ABS(value)`, `SQRT(value)`, `POWER(base, exponent)`

### Statistical Functions
- `COUNT(range)`, `COUNTA(range)`, `COUNTIF(range, criteria)`
- `MEDIAN(range)`, `MODE(range)`, `STDEV(range)`

### Logical Functions
- `IF(condition, true_value, false_value)`
- `AND(condition1, condition2, ...)`, `OR(condition1, condition2, ...)`
- `NOT(condition)`, `IFERROR(value, value_if_error)`

### Text Functions
- `CONCATENATE(text1, text2, ...)`, `LEFT(text, num)`, `RIGHT(text, num)`
- `UPPER(text)`, `LOWER(text)`, `TRIM(text)`
- `LEN(text)`, `FIND(find_text, within_text)`

### Date Functions
- `DATE(year, month, day)`, `TODAY()`, `NOW()`
- `YEAR(date)`, `MONTH(date)`, `DAY(date)`
- `DATEDIF(start_date, end_date, unit)`

### Lookup Functions
- `VLOOKUP(lookup_value, table_array, col_index, [range_lookup])`
- `HLOOKUP(lookup_value, table_array, row_index, [range_lookup])`
- `INDEX(array, row, [col])`, `MATCH(lookup_value, lookup_array, [match_type])`

### Array Functions (Dynamic)
- `SEQUENCE(rows, [cols], [start], [step])`: Generate number sequences
- `SORT(array, [sort_index], [sort_order], [by_col])`: Sort arrays
- `UNIQUE(array, [by_col], [exactly_once])`: Extract unique values
- `FILTER(array, include, [if_empty])`: Filter arrays

## Events

Listen to cell changes:

```javascript
// Using workbook
var workbook = $('#form').calx('getWorkbook');
var sheet = workbook.getSheet('Sheet1');

sheet.listen('VALUE_CHANGED', function(event) {
    console.log('Cell changed:', event.address, 'New value:', event.value);
});

sheet.listen('FORMULA_CHANGED', function(event) {
    console.log('Formula changed:', event.address, 'New formula:', event.formula);
});
```

## Migration from v2.x

### Breaking Changes

1. **Workbook Structure**: Multiple elements now share a single workbook by default
2. **Sheet Names**: Element IDs become sheet names
3. **API Methods**: Some method signatures have changed

### Migration Example

**v2.x Code:**
```javascript
$('#form1').calx({ data: { A1: { formula: 'B1+B2' } } });
$('#form2').calx({ data: { A1: { formula: 'B1*2' } } });
```

**v3.0 Code:**
```javascript
// Separate workbooks (v2.x behavior)
$('#form1').calx({ data: { A1: { formula: 'B1+B2' } } });
$('#form2').calx({ data: { A1: { formula: 'B1*2' } } });

// Shared workbook with cross-references (new feature)
$('#form1, #form2').calx({
    data: {
        form1: { A1: { formula: 'B1+B2' } },
        form2: { A1: { formula: 'form1!A1*2' } }
    }
});
```

## Examples

See the `examples/` directory for complete working examples:

- `jquery-basic.html`: Basic calculator
- `jquery-advanced.html`: Advanced features with hidden cells
- `jquery-multisheet.html`: Multiple sheets with cross-references
- `jquery-datatypes.html`: Data type specifications

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import '@xsanisty/calxjs/dist/jquery.calx';

interface JQueryCalxOptions {
    data?: Record<string, any>;
    autoCalculate?: boolean;
    variables?: Record<string, string>;
    functions?: Record<string, Function>;
    formatters?: Record<string, FormatterInterface>;
}

$('#form').calx({
    autoCalculate: true,
    variables: {
        TaxRate: 'Tax!A1'
    }
});
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- IE11: Not supported (use v2.x for IE11 support)

## License

MIT License - See LICENSE file for details

## Support

- GitHub Issues: https://github.com/xsanisty/calx.js/issues
- Documentation: https://github.com/xsanisty/calx.js/blob/main/README.md
