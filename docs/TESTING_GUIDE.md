# Testing Guide

This document explains how to run tests for Calx.js.

## Test Framework

We use **Jest** with **ts-jest** for TypeScript support.

## Running Tests

### Install Dependencies

First, install the test dependencies:

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

Coverage report will be generated in the `coverage/` directory.

## Test Structure

### Unit Tests

Unit tests focus on individual classes and methods:

- **Range.test.ts** - Tests for the Range class (lowest unit of work)
- **Cell.test.ts** - Tests for the Cell class
- **Sheet.test.ts** - Tests for the Sheet class
- **Workbook.test.ts** - Tests for the Workbook class
- **Parser.test.ts** - Tests for the formula parser

### Integration Tests

Integration tests verify that components work together correctly:

- **Integration.test.ts** - End-to-end scenarios
  - Simple calculations
  - Range operations
  - Dynamic recalculation
  - Multi-sheet operations
  - Complex formulas
  - Data-driven workbooks
  - Edge cases
  - Performance tests

## Test Coverage

Our goal is to achieve >80% code coverage for:

- Core classes (Workbook, Sheet, Cell, Range)
- Parser and interpreter
- Dependency management
- Event system

Current coverage (run `npm run test:coverage` to see latest):

```bash
npm run test:coverage
```

## Writing Tests

### Example Unit Test

```typescript
import { Calx } from '../src/Calx';

describe('MyFeature', () => {
    let workbook: any;
    let sheet: any;

    beforeEach(() => {
        workbook = Calx.createWorkbook();
        sheet = workbook.createSheet('TestSheet');
    });

    test('should do something', () => {
        // Arrange
        sheet.createCell('A1', { value: 100 });

        // Act
        const range = sheet.getRange('A1');

        // Assert
        expect(range.value).toBe(100);
    });
});
```

### Example Integration Test

```typescript
describe('Integration: Feature X', () => {
    test('should work end-to-end', () => {
        // Create workbook
        const workbook = Calx.createWorkbook();
        const sheet = workbook.createSheet('Sheet1');

        // Set up data
        sheet.createCell('A1', { value: 10 });
        sheet.createCell('A2', { formula: '=A1*2' });

        // Build and calculate
        workbook.build();
        workbook.calculate();

        // Verify results
        expect(sheet.getCellValue('A2')).toBe(20);
    });
});
```

## Test Categories

### 1. Unit Tests

Focus on individual components in isolation:

- ✅ Range operations
- ✅ Cell creation and values
- ✅ Sheet management
- ✅ Workbook creation
- ✅ Parser expressions
- ✅ Formula functions

### 2. Integration Tests

Test interactions between components:

- ✅ End-to-end calculations
- ✅ Range-based workflows
- ✅ Dynamic recalculation
- ✅ Multi-sheet workbooks
- ✅ Complex formula chains
- ✅ Data-driven initialization

### 3. Performance Tests

Verify performance with large datasets:

- ✅ Large number of cells (1000+)
- ✅ Deep dependency chains (100+ levels)
- ✅ Complex calculations
- ⚠️ Memory usage (TODO)
- ⚠️ Calculation speed benchmarks (TODO)

### 4. Edge Case Tests

Handle unusual scenarios:

- ✅ Empty formulas
- ✅ Circular references
- ✅ Division by zero
- ✅ Non-existent cells
- ✅ Reverse ranges (B2:A1)

## Continuous Integration

Tests should run automatically on:

- Every commit (pre-commit hook)
- Every pull request
- Every merge to main branch

### Setting up Pre-commit Hook

```bash
# Add to .git/hooks/pre-commit
#!/bin/sh
npm test
```

## Debugging Tests

### Run Specific Test File

```bash
npx jest test/Range.test.ts
```

### Run Specific Test

```bash
npx jest -t "should create range for single cell"
```

### Debug with VS Code

Add to `.vscode/launch.json`:

```json
{
    "type": "node",
    "request": "launch",
    "name": "Jest Debug",
    "program": "${workspaceFolder}/node_modules/.bin/jest",
    "args": ["--runInBand", "--no-cache"],
    "console": "integratedTerminal",
    "internalConsoleOptions": "neverOpen"
}
```

## Test Metrics

### Coverage Goals

| Component | Target Coverage | Current |
|-----------|----------------|---------|
| Range | 90% | TBD |
| Cell | 85% | TBD |
| Sheet | 85% | TBD |
| Workbook | 80% | TBD |
| Parser | 85% | TBD |
| Overall | 80% | TBD |

### Quality Metrics

- ✅ All tests passing
- ✅ No console errors
- ✅ No memory leaks
- ✅ Fast execution (<10s for all tests)
- 🔄 100% deterministic (no flaky tests)

## Common Testing Patterns

### 1. Testing Range Operations

```typescript
test('range operation', () => {
    const range = sheet.getRange('A1:B2');
    expect(range.count).toBe(4);
    expect(range.isSingleCell()).toBe(false);
});
```

### 2. Testing Formulas

```typescript
test('formula calculation', () => {
    sheet.createCell('A1', { value: 10 });
    sheet.createCell('A2', { formula: '=A1*2' });

    workbook.build();
    workbook.calculate();

    expect(sheet.getCellValue('A2')).toBe(20);
});
```

### 3. Testing Events

```typescript
test('cell change event', () => {
    const events: any[] = [];

    sheet.dispatcher.listen(CellEvent.VALUE_CHANGED, (event) => {
        events.push(event);
    });

    sheet.createCell('A1', { value: 100 });
    sheet.getCellDirect('A1').value = 200;

    expect(events.length).toBeGreaterThan(0);
});
```

## Troubleshooting

### Tests Not Running

1. Check Jest is installed: `npm list jest`
2. Check TypeScript config: `tsconfig.test.json`
3. Run with verbose: `npm test -- --verbose`

### Type Errors

1. Ensure `@types/jest` is installed
2. Check `tsconfig.test.json` includes test files
3. Restart TypeScript server in VS Code

### Import Errors

1. Check module resolution in `jest.config.js`
2. Verify file paths are correct
3. Check `moduleNameMapper` configuration

## Next Steps

1. ✅ Run all tests: `npm test`
2. ✅ Check coverage: `npm run test:coverage`
3. 📝 Write tests for new features
4. 🎯 Improve coverage to >80%
5. 🚀 Set up CI/CD pipeline

## Resources

- [Jest Documentation](https://jestjs.io/)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [Testing Best Practices](https://testingjavascript.com/)
