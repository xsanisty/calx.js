# ESM Examples

This directory contains examples of using Calx.js with ES modules, without jQuery.

## Files

- **index.html** - Landing page with navigation and overview
- **esm-basic.html** - Basic calculator with price, quantity, and tax
- **esm-datatypes.html** - Data type examples (number, text, date, boolean)
- **esm-formatters.html** - Manual formatting examples with currency display
- **esm-dynamic-form.html** - Dynamic form with add/remove rows functionality
- **esm-multisheet.html** - Multiple sheets with cross-sheet references
- **esm-mortgage.html** - Mortgage calculator using PMT formula
- **esm-advanced.html** - Advanced features: named variables, array formulas, metrics

## Key Features

### Automatic Event Handling

Both the ESM and jQuery versions now provide automatic functionality out of the box:
- ✅ Reads `data-*` attributes from DOM elements
- ✅ Reads initial values from inputs and elements
- ✅ Sets up input event listeners automatically
- ✅ Parses formatted inputs (currency, percent, etc.)
- ✅ Calculates on changes
- ✅ Updates DOM with formatted results
- ✅ Applies style formatters conditionally

### Built-in Formatters

The following formatters are available globally:
- **currency** - Formats as `$1,234.56` with automatic parsing
- **percent** - Formats as `25.00%` with automatic parsing
- **number** - Formats with 2 decimal places
- **integer** - Rounds to whole numbers
- **text** - Plain text formatting

### Built-in Style Formatters

- **negative** - Colors negative numbers red
- **positive** - Colors positive numbers green
- **zero** - Colors zero values gray

## Key Differences from jQuery Version

### 1. Module Import
```javascript
// ESM version
import { Calx } from '../dist/calx.esm.js';

// jQuery version
<script src="jquery.js"></script>
<script src="jquery-calx.js"></script>
```

### 2. Initialization
```javascript
// ESM version
const workbook = Calx.createWorkbookFromElement(element, data);

// jQuery version
$('#element').calx(data);
```

Both now handle everything automatically!

### 3. API Access
```javascript
// ESM version - Direct API
const sheet = workbook.getSheet('SheetName');
const value = sheet.getCellValue('A1');
workbook.calculate();
// jQuery version - Through jQuery
const value = $('#element').calx('getCell', 'A1');
$('#element').calx('calculate');
```

### 4. Automatic Updates
**Both versions automatically handle:**
- Input event listeners on `data-cell` elements
- Auto-calculation when input values change
- DOM updates with calculated results

**For custom formatting, hook into calculate:**
```javascript
// ESM version
const originalCalculate = workbook.calculate.bind(workbook);
workbook.calculate = function() {
    originalCalculate();
    // Your custom formatting here
    updateCustomDisplays();
};

// jQuery version has similar extension points
```

### 5. Lifecycle Management
```javascript
// ESM version - Explicit cleanup
workbook.destroy();

// jQuery version - Managed by jQuery
$('#element').calx('destroy');
```

### 6. Formatters
ESM version requires manual formatting:

```javascript
function formatCurrency(value) {
    if (value == null || isNaN(value)) return '$0.00';
    return '$' + Number(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const value = sheet.getCellValue('A1');
element.textContent = formatCurrency(value);
```

jQuery version has built-in formatter with input-mask behavior.

## Features Demonstrated

### Basic (esm-basic.html)
- Data attributes: `data-cell`, `data-formula`
- Simple arithmetic formulas
- Auto-calculation on input

### Data Types (esm-datatypes.html)
- `data-type="number|text|date|boolean"`
- Type casting and conversion
- Multiple independent workbooks

### Formatters (esm-formatters.html)
- Manual currency formatting
- Custom display elements
- Programmatic value updates

### Dynamic Form (esm-dynamic-form.html)
- Adding/removing rows dynamically
- Workbook rebuild on DOM changes
- SUM with dynamic ranges

### Multisheet (esm-multisheet.html)
- Multiple sheets in one workbook
- Cross-sheet references: `SheetName!CellRef`
- Sheet-specific processing

### Mortgage Calculator (esm-mortgage.html)
- Named variables with `data-var`
- PMT formula for loan calculations
- Complex formulas with multiple dependencies

### Advanced (esm-advanced.html)
- Named variables for business logic
- Array formulas (SUM, AVERAGE, MAX, MIN)
- Complex nested formulas
- Percentage calculations

## Usage Pattern

```html
<!DOCTYPE html>
<html>
<head>
    <title>Calx.js ESM Example</title>
</head>
<body>
    <form id="calculator">
        <input type="number" data-cell="A1" value="10">
        <input type="number" data-cell="A2" value="20">
        <span data-cell="A3" data-formula="=A1+A2"></span>
    </form>

    <script type="module">
        import { Calx } from '../dist/calx.esm.js';

        // One line - everything works automatically!
        const workbook = Calx.createWorkbookFromElement(
            document.getElementById('calculator')
        );

        // Automatically:
        // ✓ Reads data-cell, data-formula, data-var attributes
        // ✓ Sets up input event listeners
        // ✓ Calculates on input changes
        // ✓ Updates DOM with results

        // Optional: Access calculated values
        const sheet = workbook.getSheet('calculator');
        console.log('Sum:', sheet.getCellValue('A3'));

        // Optional: Cleanup when done
- ES6 modules (`<script type="module">`)
- ES6+ JavaScript features
- Native DOM APIs

Supported browsers:
- Chrome/Edge 61+
- Firefox 60+
- Safari 11+
- Opera 48+
