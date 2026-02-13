# Cross-Sheet Dependencies Test Suite

## Overview
Comprehensive test suite covering cross-sheet reference functionality and dependency tracking across multiple sheets in a workbook.

## Test Coverage

### Basic Cross-Sheet References (3 tests)
- ✅ **Reference cell from another sheet**: `=Sales!A1`
- ✅ **Cross-sheet formula calculations**: Multi-step formulas across sheets
- ✅ **Cross-sheet range references**: `=SUM(Data!A1:A3)`

### Cross-Sheet Dependency Updates (3 tests)
- ✅ **Auto-calculate on source value change**: Changes in Sales sheet propagate to Report sheet
- ✅ **Formula chain updates across sheets**: Sales!A1 → Sales!A2 → Sales!A3 → Report!B1 → Report!B2
- ✅ **Intermediate formula cell changes**: Product price/quantity changes cascade through totals

### Named Variables with Cross-Sheet References (2 tests)
- ✅ **Named variable pointing to another sheet**: `TaxRate: 'Config!A1'`
- ✅ **Multiple named variables from different sheets**: TaxRate and DiscountRate affecting calculations

### Multi-Sheet Complex Scenarios (3 tests)
- ✅ **Three-way cross-sheet dependencies**: Input → Calc → Output
- ✅ **Circular cross-sheet reference detection**: Handles circular references gracefully
- ✅ **Cross-sheet references with data types**: DATE, BOOLEAN, TEXT type preservation

### Edge Cases (3 tests)
- ✅ **Sheet names with underscores and numbers**: `Sheet_2024_Q1!A1`
- ✅ **Absolute references in cross-sheet formulas**: `Data!$D$1`
- ✅ **Empty cross-sheet references**: Handles missing cells gracefully

## Key Features Tested

### 1. Cross-Sheet Formula Syntax
```javascript
'=Sales!D5'              // Basic reference
'=SUM(Data!A1:A3)'       // Range reference
'=Sales!$D$1'            // Absolute reference
'=Sheet_2024_Q1!A1'      // Named sheets with special characters
```

### 2. Named Variables
```javascript
workbook.nameManager.define('TaxRate', 'Config!A1');
report.createCell('B2', { formula: '=B1*TaxRate' });
```

### 3. Auto-Calculate Cascade
When `sheet.autoCalculate = true`:
- Changing Sales!A1 automatically updates all dependent cells
- Changes cascade through multiple sheets
- Full dependency tree is traversed and recalculated

### 4. Dependency Tracking
- Local dependencies: same-sheet references
- Remote dependencies: cross-sheet references
- Both types are properly tracked and updated

## Implementation Details

### Modified Files
1. **src/Calx/Cell.ts**
   - Added `remoteDependents` property for cross-sheet tracking
   - Modified `getDependents()` to merge local and remote dependents
   - Added `addRemoteDependent(cell)` method

2. **src/Calx/Workbook/DependencyBuilder.ts**
   - Modified regex patterns to handle optional `#` prefix
   - Changed `build()` to return `{ localDeps, remoteDeps }`
   - Added cross-sheet dependency registration logic
   - Implemented `parseRemoteReference()` helper

3. **src/jquery.calx.ts**
   - Two-pass initialization: create all sheets, then process data
   - Prevents race conditions in multi-sheet scenarios

## Usage Example

```typescript
import { Calx } from '@xsanisty/calxjs';

// Create workbook and sheets
const workbook = Calx.createWorkbook();
const sales = workbook.createSheet('Sales');
const config = workbook.createSheet('Config');
const report = workbook.createSheet('Report');

// Enable auto-calculate
sales.autoCalculate = true;
config.autoCalculate = true;
report.autoCalculate = true;

// Setup data
sales.createCell('D1', { value: 1000 });
config.createCell('A1', { value: 0.08 }); // 8% tax

// Define named variable
workbook.nameManager.define('TaxRate', 'Config!A1');

// Cross-sheet formulas
report.createCell('B1', { formula: '=Sales!D1' });
report.createCell('B2', { formula: '=B1*TaxRate' });

// Build and calculate
workbook.build();
workbook.calculate();

// Change tax rate - automatically updates report
config.getCellDirect('A1').value = 0.10;
// Report!B2 now shows 100 (1000 * 0.10)
```

## Running Tests

```bash
# Run only cross-sheet tests
npm test -- CrossSheetDependencies.test.ts

# Run all tests
npm test
```

## Test Results
- **Total Tests**: 14
- **Passing**: 14 ✅
- **Failing**: 0
- **Test Suite**: PASS

All tests verify that cross-sheet dependencies work correctly with:
- Initial calculation
- Value changes triggering auto-recalculation
- Named variables across sheets
- Complex multi-sheet cascades
- Edge cases and error handling
