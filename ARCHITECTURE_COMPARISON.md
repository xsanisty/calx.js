# Architecture Comparison: Legacy vs TypeScript

## Overview

This document compares the legacy jQuery-based implementation with the new TypeScript implementation.

## 1. Top-Level Architecture

### Legacy (v2.x)
```
Sheet (Top-level)
  ├── cells (Object of Cell objects)
  ├── parser (Jison-based)
  ├── formulae (Built-in functions)
  └── sheetRegistry (Global registry for cross-sheet refs - BUGGY)
```

**Problem**: Having Sheet as the top-level object made cross-sheet calculations buggy because there was no unified coordinator. Each sheet had its own context, making it difficult to manage dependencies across sheets.

### TypeScript (v3.0)
```
Workbook (Top-level)
  ├── Sheets (Collection of Sheet objects)
  ├── Parser (Chevrotain-based, shared across sheets)
  ├── NameManager (Unified name/variable management)
  ├── DependencyTree (Workbook-level dependencies)
  └── EventDispatcher (Unified event system)
      └── Sheet
            ├── Cells (CellRegistry)
            ├── Variables (Sheet-specific)
            └── DependencyTree (Sheet-level dependencies)
```

**Solution**: Workbook as the top-level object provides unified coordination, shared context, and proper cross-sheet dependency management.

## 2. Parser Implementation

### Legacy (Jison)

**File**: `legacy/jquery-calx/library/parser-2.0.0-rev-4.jison`

```jison
/* Grammar rules in Jison */
%lex
%%

[0-9]+("."[0-9]+)?\b  return 'NUMBER';
"+"                   return '+';
"-"                   return '-';
"*"                   return '*';
"/"                   return '/';

/lex

%start expressions

%%

expressions
    : e EOF
        { return $1; }
    ;

e
    : e '+' e
        { $$ = $1 + $3; }
    | e '-' e
        { $$ = $1 - $3; }
    | NUMBER
        { $$ = Number($1); }
    ;
```

**Pros**:
- Mature, battle-tested
- Easy to write grammar

**Cons**:
- JavaScript-only, poor TypeScript support
- Generated code is hard to debug
- Limited error recovery
- Not actively maintained

### TypeScript (Chevrotain)

**Files**:
- `src/Calx/Parser/Chevrotain/Tokens.ts`
- `src/Calx/Parser/Chevrotain/Parser.ts`
- `src/Calx/Parser/Chevrotain/Interpreter.ts`

```typescript
// Define tokens
const NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /\d+(\.\d+)?/
});

// Define grammar rules
class CalxParser extends CstParser {
    constructor() {
        super(allTokens);

        this.RULE("expression", () => {
            this.SUBRULE(this.additionExpression);
        });

        this.RULE("additionExpression", () => {
            this.SUBRULE(this.multiplicationExpression, { LABEL: "lhs" });
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.CONSUME(Plus) },
                    { ALT: () => this.CONSUME(Minus) }
                ]);
                this.SUBRULE2(this.multiplicationExpression, { LABEL: "rhs" });
            });
        });
    }
}

// Interpret the CST
class CalxInterpreter extends BaseVisitor {
    additionExpression(ctx: any) {
        let result = this.visit(ctx.lhs[0]);

        if (ctx.rhs) {
            for (let i = 0; i < ctx.rhs.length; i++) {
                const rightValue = this.visit(ctx.rhs[i]);
                if (ctx.Plus && ctx.Plus[i]) {
                    result += rightValue;
                } else if (ctx.Minus && ctx.Minus[i]) {
                    result -= rightValue;
                }
            }
        }

        return result;
    }
}
```

**Pros**:
- First-class TypeScript support
- Better error messages
- Easier to debug (no code generation)
- Actively maintained
- Better IDE support
- Visitor pattern for interpretation

**Cons**:
- Slightly more verbose
- Learning curve for new developers

## 3. Cell Management

### Legacy

```javascript
// Cell is a simple object
var cell = {
    address: 'A1',
    value: 100,
    formula: null,
    calculated: false,
    dependents: [],
    precedents: []
};

// Stored in sheet.cells object
sheet.cells['A1'] = cell;
```

**Problems**:
- No type safety
- Manual dependency tracking
- No separation of concerns
- Difficult to extend

### TypeScript

```typescript
// Cell is a class with proper encapsulation
class Cell {
    private _value: any;
    private _formula: string;
    private _computed: any;
    private _dirty: boolean = false;
    private _calculated: boolean = false;

    protected precedents: Record<string, Cell> = {};
    protected dependents: Record<string, Cell> = {};

    constructor(
        address: string,
        protected sheet: Sheet,
        protected _type: DataType = DataType.TEXT
    ) {
        this.address = address;
    }

    public calculate() {
        if (!this._formula) return this._value;

        try {
            this._computed = this.sheet.eval(this._formula);
            this._calculated = true;
            this._dirty = false;
            return this._computed;
        } catch (error) {
            this._computed = ErrorType.ERROR;
            return this._computed;
        }
    }
}

// Managed by CellRegistry
class CellRegistry {
    private cells: Record<string, Cell> = {};

    public get(address: string): Cell {
        return this.cells[address] || this.create(address);
    }

    public create(address: string, data: CellData): Cell {
        const cell = new Cell(address, this.sheet, data.type);
        this.cells[address] = cell;
        return cell;
    }
}
```

**Improvements**:
- Type safety
- Proper encapsulation
- Event-driven updates
- Automatic dependency tracking
- Easy to extend and test

## 4. Dependency Management

### Legacy

```javascript
// Manual dependency tracking
sheet.fx.getCellRange = function(addressStart, addressStop) {
    var cellRangeAddress = this.getCellRange(addressStart, addressStop);
    var cellRangeValue = {};

    for (var i in cellRangeAddress) {
        cellRangeValue[cellRangeAddress[i]] = this.getCellValue(cellRangeAddress[i]);

        // Manual dependency registration
        if (this.currentCell) {
            this.currentCell.precedents.push(cellRangeAddress[i]);
        }
    }

    return cellRangeValue;
};

// Simple calculation (no topological sort)
sheet.calculate = function() {
    for (var addr in this.cells) {
        if (this.cells[addr].formula) {
            this.cells[addr].value = this.eval(this.cells[addr].formula);
        }
    }
};
```

**Problems**:
- No proper dependency graph
- Circular dependency issues
- Incorrect calculation order
- Manual tracking is error-prone

### TypeScript

```typescript
// Automatic dependency detection
class DependencyBuilder {
    build(cells: CellRegistry): DependencyTree {
        cells.each((cell: Cell) => {
            if (cell.formula) {
                // Parse formula and extract dependencies
                const dependencies = this.getFormulaDependencies(cell.formula);

                // Set precedents
                cell.setPrecedents(dependencies);

                // Set this cell as dependent for each precedent
                for (const address in dependencies) {
                    const precedentCell = cells.get(address);
                    precedentCell.addDependent(cell);
                }
            }
        });

        return new DependencyTree(cells, dispatcher, this);
    }
}

// Topological sort for correct calculation order
class DependencyTree {
    topologicalSort(): Array<Array<Cell>> {
        const levels: Array<Array<Cell>> = [];
        const cellLevels = new Map<string, number>();

        // Calculate level for each cell based on its precedents
        const calculateLevel = (cell: Cell): number => {
            if (cellLevels.has(cell.address)) {
                return cellLevels.get(cell.address)!;
            }

            const precedents = cell.getPrecedents();
            if (!precedents || Object.keys(precedents).length === 0) {
                cellLevels.set(cell.address, 0);
                return 0;
            }

            // Find max level among precedents
            let maxLevel = -1;
            for (const address in precedents) {
                const precedentLevel = calculateLevel(precedents[address]);
                if (precedentLevel > maxLevel) {
                    maxLevel = precedentLevel;
                }
            }

            const level = maxLevel + 1;
            cellLevels.set(cell.address, level);
            return level;
        };

        // Group cells by level
        this.cellRegistry.each((cell: Cell) => {
            if (cell.formula) {
                const level = calculateLevel(cell);
                if (!levels[level]) levels[level] = [];
                levels[level].push(cell);
            }
        });

        return levels;
    }
}

// Calculate in correct order
sheet.calculate = function() {
    const calculationOrder = this._depTree.topologicalSort();

    // Calculate level by level
    for (const level of calculationOrder) {
        for (const cell of level) {
            if (cell.isDirty() || !cell.isCalculated()) {
                cell.calculate();
            }
        }
    }
};
```

**Improvements**:
- Automatic dependency detection
- Proper topological sorting
- Correct calculation order
- Circular dependency detection
- Efficient recalculation (only dirty cells)

## 5. Event System

### Legacy

```javascript
// No unified event system
// Events handled manually via callbacks

sheet.on('cellChanged', function(e) {
    // Manual handling
});

// Or jQuery events
$(sheet.element).on('calculated', function() {
    // Update UI
});
```

**Problems**:
- No standard event system
- Hard to track event flow
- Coupling between components
- jQuery dependency

### TypeScript

```typescript
// Unified event system
class EventDispatcher {
    private listeners: Record<string, Array<Function>> = {};

    listen(eventName: string, callback: Function) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);
    }

    dispatch(eventName: string, eventData: any) {
        if (this.listeners[eventName]) {
            for (const listener of this.listeners[eventName]) {
                listener(eventData);
            }
        }
    }
}

// Well-defined events
enum CellEvent {
    VALUE_CHANGED = 'value.changed',
    FORMULA_CHANGED = 'formula.changed',
    CALCULATED = 'calculated',
}

enum SheetEvent {
    CELL_ADDED = 'cell.added',
    CELL_REMOVED = 'cell.removed',
    CALCULATION_COMPLETE = 'calculation.complete',
}

// Usage
sheet.dispatcher.listen(CellEvent.VALUE_CHANGED, (event) => {
    console.log(`Cell ${event.cell} changed to ${event.value}`);
});

cell.value = 100; // Triggers VALUE_CHANGED event
```

**Improvements**:
- Unified event system
- Type-safe events
- No external dependencies
- Easy to test
- Clear event flow

## 6. Cross-Sheet References

### Legacy

```javascript
// Global sheet registry (buggy)
var calx = {
    sheetRegistry: {}
};

// Register sheet
calx.sheetRegistry['sheet1'] = sheet1;
calx.sheetRegistry['sheet2'] = sheet2;

// Access cross-sheet
sheet.fx.getRemoteCellValue = function(sheetName, address) {
    if (calx.sheetRegistry[sheetName]) {
        return calx.sheetRegistry[sheetName].getCellValue(address);
    }
    return null;
};

// In formula: =#sheet1!A1
```

**Problems**:
- Global state
- No dependency tracking across sheets
- Manual registry management
- Race conditions
- Hard to test

### TypeScript

```typescript
// Workbook manages all sheets
class Workbook {
    private _sheets: Record<string, Sheet>;

    createSheet(name: string): Sheet {
        const sheet = new Sheet(this, name);
        this._sheets[name] = sheet;
        this._parser.yy.sheets[name] = sheet;
        return sheet;
    }

    getSheet(name: string): Sheet {
        return this._sheets[name];
    }
}

// Shared context for cross-sheet access
class SharedContext {
    public sheets: Record<string, Sheet> = {};
    public activeSheet?: Sheet;

    getCellValue(ref: string, sheetName?: string): any {
        const sheet = sheetName ? this.sheets[sheetName] : this.activeSheet;
        if (sheet) {
            return sheet.getCellValue(ref);
        }
        return "#REF!";
    }
}

// In formula: =#Sheet2!A1
// Parser resolves to: context.getCellValue('A1', 'Sheet2')
```

**Improvements**:
- Proper encapsulation
- Unified context
- Automatic dependency tracking
- Type safety
- Easy to test

## 7. Formula Functions

### Legacy

```javascript
// Functions defined globally
sheet.fx.SUM = function() {
    var sum = 0;
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'object') {
            for (var key in arguments[i]) {
                sum += parseFloat(arguments[i][key]) || 0;
            }
        } else {
            sum += parseFloat(arguments[i]) || 0;
        }
    }
    return sum;
};

// Called in parser
return sheet.fx.SUM.apply(sheet, args);
```

**Problems**:
- No type checking
- Hard to extend
- Inconsistent behavior
- Manual argument handling

### TypeScript

```typescript
// Built-in functions in interpreter
class CalxInterpreter {
    private executeBuiltInFunction(name: string, args: any[]): any {
        switch (name) {
            case "SUM":
                return args.reduce((sum, val) => {
                    if (Array.isArray(val)) {
                        return sum + this.flattenAndSum(val);
                    } else if (!isNaN(val)) {
                        return sum + Number(val);
                    }
                    return sum;
                }, 0);

            case "AVERAGE":
                let sum = 0;
                let count = 0;

                args.forEach(val => {
                    if (Array.isArray(val)) {
                        const flattened = this.flattenArray(val);
                        sum += flattened.reduce((s, v) => s + (isNaN(v) ? 0 : Number(v)), 0);
                        count += flattened.filter(v => !isNaN(v)).length;
                    } else if (!isNaN(val)) {
                        sum += Number(val);
                        count++;
                    }
                });

                return count > 0 ? sum / count : "#DIV/0!";

            // More functions...
        }
    }
}

// Custom functions via Calx API
Calx.setFormula('CUSTOM_FUNCTION', (arg1, arg2) => {
    return arg1 * arg2;
});
```

**Improvements**:
- Type-safe arguments
- Proper error handling
- Easy to extend
- Consistent behavior
- Support for custom functions

## Summary of Improvements

| Aspect | Legacy | TypeScript | Improvement |
|--------|--------|------------|-------------|
| **Architecture** | Sheet-centric | Workbook-centric | ✅ Better organization |
| **Parser** | Jison | Chevrotain | ✅ Better TS support |
| **Type Safety** | None | Full TypeScript | ✅ Catch errors early |
| **Dependencies** | Manual | Automatic | ✅ Correct calculation |
| **Events** | jQuery/Manual | Unified system | ✅ Decoupled components |
| **Cross-sheet** | Buggy global | Workbook-managed | ✅ Fixed bugs |
| **Testing** | Difficult | Easy | ✅ Better quality |
| **Maintenance** | Hard | Easy | ✅ Long-term support |
| **Extensibility** | Limited | High | ✅ Add features easily |

## Migration Path

1. **Phase 1**: Keep legacy code in `legacy/` folder
2. **Phase 2**: Complete TypeScript implementation (✅ Done)
3. **Phase 3**: Add DOM binding utilities
4. **Phase 4**: Create migration guide for users
5. **Phase 5**: Deprecate legacy code

## Conclusion

The TypeScript rewrite provides:
- **Better Architecture**: Workbook-centric design fixes cross-sheet bugs
- **Modern Parser**: Chevrotain provides better TypeScript support
- **Type Safety**: Catch errors at compile-time
- **Proper Dependencies**: Automatic tracking and topological sorting
- **Maintainability**: Easier to extend and maintain
- **Testing**: Much easier to write unit tests

The investment in rewriting pays off in long-term maintainability, reliability, and developer experience.
