# Calx.js v3.0 - TypeScript Rewrite

A powerful spreadsheet calculation engine written in TypeScript, featuring a Chevrotain-based parser for Excel formula evaluation.

## 🎯 Key Changes from v2.x

### Architecture Improvements

1. **Workbook-Centric Design**
   - **Before**: Sheet was the top-level object, making cross-sheet calculations buggy
   - **After**: Workbook is now the top-level object that manages multiple sheets
   - This fixes issues with cross-sheet references and dependencies

2. **Parser Migration**
   - **Before**: Jison-based grammar parser
   - **After**: Chevrotain-based parser (more maintainable, better TypeScript support)

3. **TypeScript Rewrite**
   - Full TypeScript implementation with proper type safety
   - Better IDE support and autocompletion
   - Easier to maintain and extend

## 📦 Installation

```bash
npm install @xsanisty/calxjs
```

## 🚀 Quick Start

### Creating a Simple Workbook

```typescript
import { Calx } from '@xsanisty/calxjs';
import { DataType } from '@xsanisty/calxjs/Cell/DataType';

// Create a new workbook
const workbook = Calx.createWorkbook();

// Create a sheet
const sheet = workbook.createSheet('Budget');

// Add cells with values
sheet.createCell('A1', { value: 100, type: DataType.NUMBER });
sheet.createCell('A2', { value: 200, type: DataType.NUMBER });

// Add a cell with formula
sheet.createCell('A3', { formula: '=A1+A2', type: DataType.NUMBER });

// Build dependencies and calculate
workbook.build();
workbook.calculate();

// Get calculated value
console.log(sheet.getCell('A3').value); // 300
```

### Creating from Data

```typescript
const workbook = Calx.createWorkbookFromData({
    sheets: {
        'Sales': {
            cells: {
                'A1': { value: 'Product A', type: DataType.TEXT },
                'B1': { value: 1000, type: DataType.NUMBER },
                'A2': { value: 'Product B', type: DataType.TEXT },
                'B2': { value: 2000, type: DataType.NUMBER },
                'A3': { value: 'Total', type: DataType.TEXT },
                'B3': { formula: '=B1+B2', type: DataType.NUMBER }
            },
            variables: {}
        }
    }
});

workbook.build();
workbook.calculate();
```

## 📚 Core Concepts

### Workbook

The Workbook is the top-level container that manages multiple sheets and coordinates calculations across them.

```typescript
// Create workbook
const workbook = Calx.createWorkbook();

// Create sheets
const sheet1 = workbook.createSheet('Sheet1');
const sheet2 = workbook.createSheet('Sheet2');

// Build dependency tree
workbook.build();

// Calculate all sheets
workbook.calculate();

// Get a specific sheet
const sheet = workbook.getSheet('Sheet1');
```

### Sheet

A Sheet contains cells and manages their calculations within a single spreadsheet.

```typescript
// Create cells
sheet.createCell('A1', { value: 100 });
sheet.createCell('A2', { formula: '=A1*2' });

// Get cell value
const value = sheet.getCellValue('A2');

// Evaluate a formula directly
const result = sheet.eval('=SUM(A1,A2)');

// Set variables
sheet.setVariable('TAX_RATE', 0.08);
```

### Cell

A Cell represents a single spreadsheet cell that can contain a value or formula.

```typescript
// Get a cell
const cell = sheet.getCell('A1');

// Access cell properties
console.log(cell.value);
console.log(cell.formula);
console.log(cell.address);

// Check cell state
console.log(cell.isCalculated());
console.log(cell.isDirty());
console.log(cell.isNumeric());

// Calculate a single cell
cell.calculate();
```

## 🔧 Features

### Supported Formula Functions

- **Math**: `SUM`, `AVERAGE`, `MAX`, `MIN`, `COUNT`
- **Logical**: `IF`, `AND`, `OR`, `IFERROR`, `IFS`, `SWITCH`
- **Text**: `CONCATENATE`
- **Operators**: `+`, `-`, `*`, `/`, `^`, `&`
- **Comparisons**: `=`, `<>`, `>`, `<`, `>=`, `<=`

### Cell References

```typescript
// Simple cell reference
sheet.createCell('A1', { formula: '=B1+C1' });

// Cell range (future feature)
sheet.createCell('A1', { formula: '=SUM(B1:B10)' });

// Cross-sheet reference (future feature)
sheet.createCell('A1', { formula: '=#Sheet2!A1' });
```

### Dependency Management

The library automatically builds a dependency tree and calculates cells in the correct order:

```typescript
sheet.createCell('A1', { value: 10 });
sheet.createCell('A2', { formula: '=A1*2' });
sheet.createCell('A3', { formula: '=A2+5' });

workbook.build();
workbook.calculate();

// A1 is calculated first (no dependencies)
// A2 is calculated next (depends on A1)
// A3 is calculated last (depends on A2)
```

### Dynamic Recalculation

When a cell value changes, dependent cells are automatically marked as dirty:

```typescript
sheet.createCell('A1', { value: 5 });
sheet.createCell('A2', { formula: '=A1*2' });

workbook.build();
workbook.calculate();

console.log(sheet.getCell('A2').value); // 10

// Change A1
sheet.getCell('A1').value = 7;

// Recalculate
sheet.requestCalculate('A1');
sheet.calculate();

console.log(sheet.getCell('A2').value); // 14
```

## 🏗️ Architecture

### Class Hierarchy

```
Calx (Static Factory)
  └── Workbook (Top-level container)
        ├── Sheet (Individual spreadsheet)
        │     ├── Cell (Individual cell)
        │     ├── CellRegistry (Cell management)
        │     └── DependencyTree (Cell dependencies)
        ├── NameManager (Named ranges)
        ├── Parser (Chevrotain-based)
        └── SharedContext (Parser context)
```

### Key Components

1. **Parser System**
   - `CalxParser`: Chevrotain-based parser that converts formulas to CST
   - `CalxInterpreter`: Visitor that evaluates the CST
   - `CalxLexer`: Tokenizes formula input
   - `SharedContext`: Provides context for formula evaluation

2. **Dependency System**
   - `DependencyBuilder`: Analyzes formulas and builds dependency graph
   - `DependencyTree`: Manages cell dependencies and topological sorting

3. **Event System**
   - `EventDispatcher`: Handles cell and sheet events
   - `CellEvent`: Cell-level events (value changed, formula changed, etc.)
   - `SheetEvent`: Sheet-level events (cell added, calculation complete, etc.)

## 🔄 Migration from v2.x

### Before (v2.x - jQuery-based, Jison parser)

```javascript
// Create sheet directly
var sheet = new calx.Sheet('#myTable');

// Set values
sheet.set('A1', 100);
sheet.set('A2', 200);

// Set formula
sheet.set('A3', '=A1+A2');

// Calculate
sheet.calculate();
```

### After (v3.0 - TypeScript, Chevrotain parser)

```typescript
// Create workbook first
const workbook = Calx.createWorkbook();

// Create sheet
const sheet = workbook.createSheet('MySheet');

// Set values
sheet.createCell('A1', { value: 100 });
sheet.createCell('A2', { value: 200 });

// Set formula
sheet.createCell('A3', { formula: '=A1+A2' });

// Build and calculate
workbook.build();
workbook.calculate();
```

## 📖 API Reference

### Calx (Static)

- `createWorkbook()`: Create an empty workbook
- `createWorkbookFromData(data)`: Create workbook from data object
- `createWorkbookFromElement(element, data?)`: Create workbook from HTML element
- `createParser()`: Create a standalone parser instance
- `createInterpreter()`: Create a standalone interpreter instance

### Workbook

- `createSheet(name, element?)`: Create a new sheet
- `getSheet(name)`: Get sheet by name
- `getSheets()`: Get all sheets
- `build()`: Build dependency trees
- `calculate()`: Calculate all sheets
- `setActiveSheet(sheet)`: Set active sheet for formula context
- `hydrateObj(obj)`: Hydrate object with cell values

### Sheet

- `createCell(address, data)`: Create a new cell
- `getCell(address)`: Get cell by address
- `getCellValue(address)`: Get cell value
- `eval(formula)`: Evaluate a formula
- `calculate(options?)`: Calculate all cells in sheet
- `requestCalculate(address)`: Request calculation for specific cell
- `buildDependencyTree()`: Build dependency tree for cells
- `setVariable(name, value)`: Set a variable
- `getVariable(name)`: Get a variable value

### Cell

- `value`: Get/set cell value
- `formula`: Get/set cell formula
- `address`: Get cell address
- `calculate()`: Calculate cell value
- `isCalculated()`: Check if cell is calculated
- `isDirty()`: Check if cell needs recalculation
- `isNumeric()`: Check if cell contains numeric value
- `isEmpty()`: Check if cell is empty
- `getPrecedents()`: Get cells this cell depends on
- `getDependents()`: Get cells that depend on this cell

## 🛠️ Development

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

## 📝 TODO

- [ ] Implement cell range support (A1:B10)
- [ ] Implement cross-sheet references (#Sheet!A1)
- [ ] Add more Excel functions
- [ ] Implement row/column range operations
- [ ] Add cell formatting support
- [ ] Implement named ranges
- [ ] Add array formula support
- [ ] Create DOM binding utilities
- [ ] Add undo/redo functionality
- [ ] Performance optimization for large datasets

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [GitHub Repository](https://github.com/xsanisty/calx.js)
- [Legacy v2.x Documentation](https://xsanisty.com/project/calxjs)
- [Chevrotain Parser](https://chevrotain.io/)
