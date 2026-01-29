# Named Ranges Example

This example demonstrates how to use named ranges in Calx.js

```typescript
import { Calx } from './src/Calx';

// Create a workbook
const workbook = Calx.createWorkbook();
const sheet = workbook.createSheet('Sales');

// Set up some data
sheet.createCell('A1', { value: 100 });
sheet.createCell('A2', { value: 200 });
sheet.createCell('A3', { value: 300 });
sheet.createCell('B1', { value: 0.15 }); // Tax rate

// Define named ranges
workbook.nameManager.define('SalesData', 'A1:A3', undefined, 'Q1 Sales figures');
workbook.nameManager.define('TaxRate', 'B1', undefined, 'Standard tax rate');

// Use named ranges in formulas
sheet.createCell('C1', { formula: '=SUM(SalesData)' });
sheet.createCell('C2', { formula: '=SUM(SalesData) * TaxRate' });
sheet.createCell('C3', { formula: '=AVERAGE(SalesData)' });

// Calculate the workbook
workbook.build();
workbook.calculate();

// Get results
console.log('Total Sales:', sheet.getCellValue('C1'));      // 600
console.log('Tax Amount:', sheet.getCellValue('C2'));       // 90
console.log('Average Sale:', sheet.getCellValue('C3'));     // 200

// Named ranges support auto-recalculation
const cellA1 = sheet.getCell('A1');
cellA1.value = 150;

console.log('Updated Total:', sheet.getCellValue('C1'));    // 650
console.log('Updated Tax:', sheet.getCellValue('C2'));      // 97.5

// List all named ranges
const allRanges = workbook.nameManager.getAll();
console.log('Named Ranges:', allRanges.map(nr => `${nr.name} -> ${nr.reference}`));

// Check if a named range exists
console.log('Has TaxRate?', workbook.nameManager.has('TaxRate')); // true
console.log('Has Discount?', workbook.nameManager.has('Discount')); // false

// Remove a named range
workbook.nameManager.remove('TaxRate');
console.log('Has TaxRate?', workbook.nameManager.has('TaxRate')); // false
```

## Features

### Defining Named Ranges

```typescript
// Basic syntax
workbook.nameManager.define('Name', 'Reference');

// With comment
workbook.nameManager.define('Name', 'Reference', undefined, 'Description');

// Single cell
workbook.nameManager.define('TaxRate', 'A1');

// Cell range
workbook.nameManager.define('SalesData', 'A1:A10');

// 2D range
workbook.nameManager.define('Matrix', 'A1:C3');
```

### Name Validation

Named range names must:
- Start with a letter or underscore
- Contain only letters, numbers, underscores, and dots
- NOT be a cell reference (A1, B2, etc.)
- NOT be a reserved keyword (TRUE, FALSE, NULL)

```typescript
workbook.nameManager.define('Sales', 'A1');        // ✓ Valid
workbook.nameManager.define('Q1_2024', 'A1');      // ✓ Valid
workbook.nameManager.define('_Total', 'A1');       // ✓ Valid
workbook.nameManager.define('A1', 'B1');           // ✗ Invalid (cell reference)
workbook.nameManager.define('1Sales', 'A1');       // ✗ Invalid (starts with number)
workbook.nameManager.define('TRUE', 'A1');         // ✗ Invalid (reserved keyword)
```

### Using Named Ranges in Formulas

Named ranges can be used anywhere a cell reference can be used:

```typescript
// In functions
sheet.createCell('B1', { formula: '=SUM(SalesData)' });
sheet.createCell('B2', { formula: '=AVERAGE(Prices)' });
sheet.createCell('B3', { formula: '=MAX(Scores)' });

// In arithmetic
sheet.createCell('C1', { formula: '=Price * Quantity' });
sheet.createCell('C2', { formula: '=Total * TaxRate' });
sheet.createCell('C3', { formula: '=Revenue - Cost' });

// Mixed with cell references
sheet.createCell('D1', { formula: '=SalesData + A10' });
sheet.createCell('D2', { formula: '=IF(Score > Target, "Pass", "Fail")' });
```

### Auto-Recalculation

Named ranges fully support auto-recalculation. When a cell referenced by a named range changes, all dependent cells are automatically updated:

```typescript
workbook.nameManager.define('Price', 'A1');
sheet.createCell('B1', { formula: '=Price * 2' });

workbook.build();
workbook.calculate();

// Change the source value
const cell = sheet.getCell('A1');
cell.value = 150;

// B1 is automatically recalculated!
```

### Management API

```typescript
// Check if named range exists
workbook.nameManager.has('Name');

// Get named range definition
const definition = workbook.nameManager.get('Name');

// Get all named ranges
const all = workbook.nameManager.getAll();

// Get the reference string
const ref = workbook.nameManager.getReference('Name');

// Resolve to value (without formula)
const value = workbook.nameManager.resolve('Name');

// Remove named range
workbook.nameManager.remove('Name');

// Clear all named ranges
workbook.nameManager.clear();

// Update by redefining
workbook.nameManager.define('Name', 'NewReference');
```

### Priority

Named ranges take priority over sheet variables when resolving names in formulas.

### Error Handling

- Undefined named ranges return `#NAME?`
- This error propagates correctly through formulas
- Empty cells in named ranges are handled gracefully (SUM returns 0)

```typescript
sheet.createCell('A1', { formula: '=UndefinedName * 2' });
// Result: #NAME?

workbook.nameManager.define('Empty', 'B1:B3'); // B1:B3 don't have values
sheet.createCell('A2', { formula: '=SUM(Empty)' });
// Result: 0
```
