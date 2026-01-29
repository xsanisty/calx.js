# Migration Guide: v2.x → v3.0

This guide helps you migrate from the legacy jQuery-based Calx.js (v2.x) to the new TypeScript-based version (v3.0).

## Breaking Changes

### 1. Top-Level API Change

**v2.x (jQuery/Sheet-based)**
```javascript
// Sheet was the main entry point
var sheet = new calx.Sheet('#myTable');
sheet.set('A1', 100);
sheet.calculate();
```

**v3.0 (Workbook-based)**
```typescript
// Workbook is now the main entry point
import { Calx } from '@xsanisty/calxjs';

const workbook = Calx.createWorkbook();
const sheet = workbook.createSheet('MySheet');
sheet.createCell('A1', { value: 100 });
workbook.build();
workbook.calculate();
```

### 2. Cell Creation

**v2.x**
```javascript
// Simple setter
sheet.set('A1', 100);
sheet.set('A2', '=A1*2');
```

**v3.0**
```typescript
import { DataType } from '@xsanisty/calxjs/Cell/DataType';

// Explicit cell creation with metadata
sheet.createCell('A1', {
    value: 100,
    type: DataType.NUMBER
});

sheet.createCell('A2', {
    formula: '=A1*2',
    type: DataType.NUMBER
});
```

### 3. Getting Cell Values

**v2.x**
```javascript
var value = sheet.get('A1');
var computedValue = sheet.getCell('A2').value;
```

**v3.0**
```typescript
const value = sheet.getCellValue('A1');
// or
const value = sheet.getCell('A1').value;
```

### 4. Calculation

**v2.x**
```javascript
// Calculate entire sheet
sheet.calculate();

// Calculate specific cell
sheet.calculateCell('A1');
```

**v3.0**
```typescript
// Build dependencies first
workbook.build();

// Calculate entire workbook
workbook.calculate();

// Or calculate specific sheet
sheet.calculate();

// Or request calculation for specific cell
sheet.requestCalculate('A1');
```

### 5. Cross-Sheet References

**v2.x**
```javascript
// Use sheet registry (buggy)
calx.sheetRegistry['sheet1'] = sheet1;
calx.sheetRegistry['sheet2'] = sheet2;

// In formula
sheet2.set('A1', '=#sheet1!B1');
```

**v3.0**
```typescript
// All sheets managed by workbook
const workbook = Calx.createWorkbook();
const sheet1 = workbook.createSheet('Sheet1');
const sheet2 = workbook.createSheet('Sheet2');

// Cross-sheet reference (syntax remains similar)
sheet2.createCell('A1', {
    formula: '=#Sheet1!B1'
});

workbook.build();
workbook.calculate();
```

### 6. Events

**v2.x**
```javascript
// jQuery events
$(sheet.element).on('calculated', function() {
    console.log('Calculated');
});

// Custom callbacks
sheet.onCalculate = function() {
    console.log('Done');
};
```

**v3.0**
```typescript
import { SheetEvent } from '@xsanisty/calxjs/Sheet/SheetEvent';
import { CellEvent } from '@xsanisty/calxjs/Cell/CellEvent';

// Unified event system
sheet.dispatcher.listen(SheetEvent.CALCULATION_COMPLETE, (event) => {
    console.log('Calculated');
});

sheet.dispatcher.listen(CellEvent.VALUE_CHANGED, (event) => {
    console.log(`Cell ${event.cell} changed to ${event.value}`);
});
```

### 7. Custom Functions

**v2.x**
```javascript
// Extend sheet.fx
sheet.fx.CUSTOM = function(a, b) {
    return a + b;
};
```

**v3.0**
```typescript
// Use static Calx API
Calx.setFormula('CUSTOM', (a: number, b: number) => {
    return a + b;
});

// Or set multiple at once
Calx.setFormulae({
    CUSTOM1: (a, b) => a + b,
    CUSTOM2: (a, b) => a * b
});
```

## Step-by-Step Migration

### Step 1: Install v3.0

```bash
npm install @xsanisty/calxjs@3.0.0
```

### Step 2: Update Imports

**Before**
```html
<script src="jquery.js"></script>
<script src="jquery-calx-2.2.8.js"></script>
```

**After**
```typescript
import { Calx } from '@xsanisty/calxjs';
import { DataType } from '@xsanisty/calxjs/Cell/DataType';
```

### Step 3: Update Initialization

**Before**
```javascript
$(document).ready(function() {
    var sheet = new calx.Sheet('#myTable');

    sheet.set('A1', 100);
    sheet.set('A2', 200);
    sheet.set('A3', '=A1+A2');

    sheet.calculate();
});
```

**After**
```typescript
// Create workbook
const workbook = Calx.createWorkbook();

// Create sheet
const sheet = workbook.createSheet('MySheet');

// Add cells
sheet.createCell('A1', { value: 100, type: DataType.NUMBER });
sheet.createCell('A2', { value: 200, type: DataType.NUMBER });
sheet.createCell('A3', { formula: '=A1+A2', type: DataType.NUMBER });

// Build and calculate
workbook.build();
workbook.calculate();

// Get result
console.log(sheet.getCell('A3').value); // 300
```

### Step 4: Update Multiple Sheets

**Before**
```javascript
var sheet1 = new calx.Sheet('#table1');
var sheet2 = new calx.Sheet('#table2');

// Register for cross-sheet
calx.sheetRegistry['sheet1'] = sheet1;
calx.sheetRegistry['sheet2'] = sheet2;

sheet1.set('A1', 100);
sheet2.set('A1', '=#sheet1!A1 * 2');

sheet1.calculate();
sheet2.calculate();
```

**After**
```typescript
const workbook = Calx.createWorkbook();

const sheet1 = workbook.createSheet('Sheet1');
const sheet2 = workbook.createSheet('Sheet2');

sheet1.createCell('A1', { value: 100 });
sheet2.createCell('A1', { formula: '=#Sheet1!A1 * 2' });

workbook.build();
workbook.calculate();

console.log(sheet2.getCell('A1').value); // 200
```

### Step 5: Update Event Handlers

**Before**
```javascript
$(sheet.element).on('calculated', function() {
    $('#result').text('Calculation complete!');
});

sheet.onCellChange = function(address, value) {
    console.log('Cell', address, 'changed to', value);
};
```

**After**
```typescript
import { SheetEvent } from '@xsanisty/calxjs/Sheet/SheetEvent';
import { CellEvent } from '@xsanisty/calxjs/Cell/CellEvent';

sheet.dispatcher.listen(SheetEvent.CALCULATION_COMPLETE, () => {
    document.getElementById('result')!.textContent = 'Calculation complete!';
});

sheet.dispatcher.listen(CellEvent.VALUE_CHANGED, (event: any) => {
    console.log('Cell', event.cell, 'changed to', event.value);
});
```

## Common Migration Patterns

### Pattern 1: Simple Calculation

**Before**
```javascript
var sheet = new calx.Sheet();
sheet.set('A1', 10);
sheet.set('A2', 20);
sheet.set('A3', '=A1+A2');
sheet.calculate();
var result = sheet.get('A3');
```

**After**
```typescript
const workbook = Calx.createWorkbook();
const sheet = workbook.createSheet('Sheet1');

sheet.createCell('A1', { value: 10 });
sheet.createCell('A2', { value: 20 });
sheet.createCell('A3', { formula: '=A1+A2' });

workbook.build();
workbook.calculate();

const result = sheet.getCellValue('A3');
```

### Pattern 2: Data-Driven Initialization

**Before**
```javascript
var data = {
    'A1': 100,
    'A2': 200,
    'A3': '=A1+A2'
};

var sheet = new calx.Sheet();
for (var addr in data) {
    sheet.set(addr, data[addr]);
}
sheet.calculate();
```

**After**
```typescript
const data = {
    'A1': { value: 100 },
    'A2': { value: 200 },
    'A3': { formula: '=A1+A2' }
};

const workbook = Calx.createWorkbook();
const sheet = workbook.createSheet('Sheet1');

for (const addr in data) {
    sheet.createCell(addr, data[addr]);
}

workbook.build();
workbook.calculate();
```

Or use the data API:

```typescript
const workbook = Calx.createWorkbookFromData({
    sheets: {
        'Sheet1': {
            cells: {
                'A1': { value: 100 },
                'A2': { value: 200 },
                'A3': { formula: '=A1+A2' }
            },
            variables: {}
        }
    }
});

workbook.build();
workbook.calculate();
```

### Pattern 3: Dynamic Updates

**Before**
```javascript
var sheet = new calx.Sheet();
sheet.set('A1', 10);
sheet.set('A2', '=A1*2');
sheet.calculate();

console.log(sheet.get('A2')); // 20

// Update A1
sheet.set('A1', 15);
sheet.calculate();

console.log(sheet.get('A2')); // 30
```

**After**
```typescript
const workbook = Calx.createWorkbook();
const sheet = workbook.createSheet('Sheet1');

sheet.createCell('A1', { value: 10 });
sheet.createCell('A2', { formula: '=A1*2' });

workbook.build();
workbook.calculate();

console.log(sheet.getCellValue('A2')); // 20

// Update A1
sheet.getCell('A1').value = 15;
sheet.requestCalculate('A1');
sheet.calculate();

console.log(sheet.getCellValue('A2')); // 30
```

### Pattern 4: HTML Table Binding

**Before**
```javascript
// Bind to HTML table
var sheet = new calx.Sheet('#myTable');

// Cells automatically map to table cells
sheet.calculate();
```

**After**
```typescript
// Create workbook with element binding
const table = document.getElementById('myTable') as HTMLElement;
const workbook = Calx.createWorkbookFromElement(table);

// Manual cell-to-element mapping (or use a binding utility)
const sheet = workbook.createSheet('Sheet1', table);

// ... create cells and calculate
workbook.build();
workbook.calculate();

// TODO: v3.0 needs DOM binding utilities (coming soon)
```

## Feature Comparison

| Feature | v2.x | v3.0 | Notes |
|---------|------|------|-------|
| Basic formulas | ✅ | ✅ | Same syntax |
| Cell references | ✅ | ✅ | Same syntax |
| Cross-sheet refs | ⚠️ | ✅ | Fixed bugs |
| Cell ranges | ✅ | 🚧 | Coming soon |
| Array formulas | ❌ | 🚧 | Coming soon |
| Custom functions | ✅ | ✅ | Better API |
| Events | ⚠️ | ✅ | Unified system |
| HTML binding | ✅ | 🚧 | Coming soon |
| TypeScript | ❌ | ✅ | Full support |
| Circular deps | ❌ | ✅ | Detected |
| Dependency tree | ⚠️ | ✅ | Proper impl |

Legend:
- ✅ Fully supported
- ⚠️ Partially supported or buggy
- 🚧 In development
- ❌ Not supported

## Troubleshooting

### Issue: "Cannot find module '@xsanisty/calxjs'"

**Solution**: Make sure you've installed the package:
```bash
npm install @xsanisty/calxjs
```

### Issue: TypeScript errors with cell data

**Solution**: Import and use the DataType enum:
```typescript
import { DataType } from '@xsanisty/calxjs/Cell/DataType';

sheet.createCell('A1', {
    value: 100,
    type: DataType.NUMBER
});
```

### Issue: Formulas not calculating

**Solution**: Make sure to call `build()` before `calculate()`:
```typescript
workbook.build();  // Build dependency tree
workbook.calculate();  // Then calculate
```

### Issue: Cross-sheet references not working

**Solution**: Make sure both sheets are in the same workbook:
```typescript
const workbook = Calx.createWorkbook();
const sheet1 = workbook.createSheet('Sheet1');
const sheet2 = workbook.createSheet('Sheet2');

// Now cross-sheet references work
sheet2.createCell('A1', { formula: '=#Sheet1!A1' });
```

### Issue: Custom functions not found

**Solution**: Register functions before creating workbook:
```typescript
Calx.setFormula('CUSTOM', (a, b) => a + b);

const workbook = Calx.createWorkbook();
// Now CUSTOM() is available in formulas
```

## Need Help?

- 📚 [TypeScript Documentation](./TYPESCRIPT_README.md)
- 🏗️ [Architecture Comparison](./ARCHITECTURE_COMPARISON.md)
- 💡 [Examples](./example.ts)
- 🐛 [Report Issues](https://github.com/xsanisty/calx.js/issues)

## Gradual Migration Strategy

You can migrate gradually:

1. **Phase 1**: Install v3.0 alongside v2.x
2. **Phase 2**: Migrate one sheet/feature at a time
3. **Phase 3**: Test thoroughly
4. **Phase 4**: Remove v2.x dependency

Example of running both versions:

```javascript
// Legacy code (still works)
var legacySheet = new calx.Sheet('#oldTable');
legacySheet.calculate();

// New code
import { Calx } from '@xsanisty/calxjs';
const workbook = Calx.createWorkbook();
const newSheet = workbook.createSheet('NewSheet');
workbook.calculate();
```

This allows you to migrate at your own pace without breaking existing functionality.
