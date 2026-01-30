# Formatter and Event Handling Refactoring

## Overview

This document describes the refactoring that moved all DOM processing, event handling, and formatter logic from the jQuery wrapper (`jquery.calx.ts`) into the core Workbook class. This makes jQuery a thin wrapper and enables the same functionality in both ESM and jQuery versions.

## Changes Made

### 1. Moved Formatters to Workbook Core

**Before:** Formatters were defined in `jquery.calx.ts`
**After:** Formatters are defined in `Workbook.ts` as global and instance registries

#### Global Formatters (Built-in)
```typescript
- currency: Formats as $1,234.56 with comma separators
- percent: Formats as 25.00% (stores as 0.25)
- number: Formats with 2 decimal places
- integer: Rounds to whole numbers
- text: Plain text formatting
```

#### Global Style Formatters (Built-in)
```typescript
- negative: Colors negative values red
- positive: Colors positive values green
- zero: Colors zero values gray
```

### 2. Added Formatter Registration API

#### Instance Methods
```typescript
workbook.registerFormatter(name, formatter);
workbook.registerStyleFormatter(name, formatter);
workbook.getFormatter(name);
workbook.getStyleFormatter(name);
```

#### Static Methods
```typescript
Workbook.registerGlobalFormatter(name, formatter);
Workbook.registerGlobalStyleFormatter(name, formatter);
Workbook.getGlobalFormatter(name);
```

### 3. Enhanced DOM Processing

The `_processDataAttributes()` method now:
- ✅ Reads initial values from DOM elements (input.value, element.textContent)
- ✅ Parses formatted values (e.g., "25%" → 0.25, "$1,000" → 1000)
- ✅ Sets data type BEFORE setting value (important for type coercion)
- ✅ Respects data config precedence over DOM values
- ✅ Registers named variables via data-var attribute

### 4. Enhanced Event Handling

The `_setupEventListeners()` method now handles:

#### Formatted Inputs (with data-format attribute)
- **focus**: Shows raw value for editing (0.25 instead of 25.00%)
- **blur**: Formats the displayed value (0.25 → 25.00%)
- **change**: Parses input, updates cell, recalculates, updates DOM

#### Non-formatted Inputs
- **input**: Updates cell value in real-time
- **change**: Triggers calculation and DOM update

#### Input Mask Behavior
When a user types into a formatted input:
1. User types "30" in percent field
2. On blur: Shows "30.00%"
3. On focus: Shows raw value "0.30" for editing
4. On change: Parses "30%" → 0.30, calculates, updates dependents

### 5. Enhanced DOM Updates

The `_updateAllCells()` method now:
- Applies formatters (data-format attribute takes precedence over cell.format)
- Skips updating the active/focused element (prevents cursor jumping)
- Applies style formatters via `_applyStyleFormatter()`
- Updates both input values and element textContent appropriately

### 6. Simplified jQuery Wrapper

**Before:** 700+ lines with duplicate logic
**After:** ~150 lines that delegate to Workbook

The jQuery wrapper now:
1. Delegates formatter registration to `Workbook.registerGlobalFormatter()`
2. Delegates function registration to `Calx.setFormula()`
3. Uses `Workbook.createFromElement()` for all initialization
4. Maintains method call API for backward compatibility

## API Usage

### ESM Version

```javascript
import { Calx } from './dist/calx.esm.js';

// Create workbook with automatic event handling
const element = document.getElementById('calculator');
const workbook = Calx.createWorkbookFromElement(element, {
    autoCalculate: true  // default
});

// Register custom formatter
workbook.registerFormatter('phone', {
    format: (value) => {
        const digits = String(value).replace(/\D/g, '');
        return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
    },
    parse: (input) => input.replace(/\D/g, '')
});

// Register custom style formatter
workbook.registerStyleFormatter('warning', (value, element) => {
    if (value > 1000) {
        return { backgroundColor: 'yellow', fontWeight: 'bold' };
    }
    return {};
});
```

### jQuery Version

```javascript
// Register global formatter (available to all workbooks)
$.calx.registerFormatter('phone', {
    format: (value) => { /* ... */ },
    parse: (input) => { /* ... */ }
});

// Initialize with automatic event handling
$('#calculator').calx({
    autoCalculate: true,
    formatters: {
        // Register instance-specific formatter
        custom: { format: ..., parse: ... }
    }
});

// Access workbook via method call
const workbook = $('#calculator').calx('getWorkbook');
```

## Data Attribute Examples

### Basic Calculator
```html
<div id="calculator">
    <!-- Input with initial value -->
    <input data-cell="A1" value="100">

    <!-- Input with formatter and initial value -->
    <input data-cell="A2" value="25%" data-format="percent">

    <!-- Calculated cell with formatter -->
    <input data-cell="A3" data-formula="A1*A2" data-format="currency" readonly>

    <!-- Named variable -->
    <input data-cell="A4" data-var="taxRate" value="0.08" data-format="percent">

    <!-- Style formatter -->
    <span data-cell="A5" data-formula="A1-A3" data-style-if="negative"></span>
</div>
```

### Data Types
```html
<!-- Set type BEFORE value for proper coercion -->
<input data-cell="A1" data-type="number" value="42">
<input data-cell="A2" data-type="text" value="123">
<input data-cell="A3" data-type="boolean" value="true">
<input data-cell="A4" data-type="date" value="2024-01-01">
```

## Testing

### Test File: `examples/formatters-test.ts`
Comprehensive test suite covering:
- ✅ Initial value reading from DOM
- ✅ Formatter display formatting
- ✅ Formatter input parsing (percent, currency, integer)
- ✅ Custom formatter registration
- ✅ Automatic recalculation after formatted input
- ✅ DOM updates with formatted values

### Run Tests
```bash
npx tsx examples/formatters-test.ts
npx tsx examples/createFromElement-auto.ts
```

## Benefits

### 1. Code Reusability
- Single implementation for ESM and jQuery
- Reduced code duplication (~550 lines eliminated)
- Easier maintenance and bug fixes

### 2. Consistent Behavior
- Same formatters available in both versions
- Same event handling logic
- Same DOM processing

### 3. Better Architecture
- Core functionality in Workbook (framework-agnostic)
- jQuery as thin presentation layer
- Easier to add new frameworks (React, Vue, etc.)

### 4. Enhanced Functionality
- Initial value reading from DOM
- Formatted input parsing
- Style formatters
- Type coercion before value assignment

## Migration Guide

### For ESM Users
No changes needed! The API remains the same.

### For jQuery Users
No changes needed! The jQuery API is backward compatible.

### For Library Developers
If you were directly accessing formatter registries:
```javascript
// Before (jQuery only)
formatterRegistry['myFormatter']

// After (works everywhere)
Workbook.getGlobalFormatter('myFormatter')
workbook.getFormatter('myFormatter')
```

## Implementation Details

### File Structure
```
src/
├── Calx/Workbook.ts          # Core logic (100+ lines added)
│   ├── Global formatter registries
│   ├── Instance formatter registries
│   ├── _processDataAttributes() - enhanced
│   ├── _setupEventListeners() - enhanced
│   ├── _updateAllCells() - enhanced
│   └── _applyStyleFormatter() - new
│
└── jquery.calx.ts            # Thin wrapper (~550 lines removed)
    ├── Delegates to Workbook methods
    └── Maintains backward compatibility
```

### Performance
- No performance regression
- Event handlers are efficiently attached once per element
- Formatters are cached in registries (O(1) lookup)

## Future Enhancements

Potential additions:
- [ ] More built-in formatters (phone, SSN, date formats)
- [ ] Async formatters for external data
- [ ] Formatter options/configuration
- [ ] Formatter validation with error messages
- [ ] React/Vue wrappers using the same core

## Summary

This refactoring successfully:
✅ Moved all formatting logic to Workbook core
✅ Made jQuery a thin wrapper (~78% code reduction)
✅ Enabled same functionality in ESM and jQuery
✅ Improved initial value reading from DOM
✅ Enhanced formatter parsing for input masks
✅ Added style formatter support
✅ Maintained backward compatibility
✅ Improved code maintainability

The Workbook class is now the single source of truth for all DOM-related functionality, making it easier to support multiple frameworks in the future.
