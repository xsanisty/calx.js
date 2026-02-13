# Test Organization

This directory contains all tests for the calx.js project, organized by test type.

## Directory Structure

```
test/
├── unit/              # Unit tests for individual classes and functions
├── integration/       # Integration tests for multiple components working together
├── debug/            # Debug-specific tests for troubleshooting
├── performance/      # Performance and benchmark tests
└── README.md         # This file
```

## Test Categories

### Unit Tests (`unit/`)
Tests that focus on individual classes or modules in isolation:
- `Cell.test.ts` - Cell class functionality
- `Sheet.test.ts` - Sheet class functionality
- `Workbook.test.ts` - Workbook class functionality
- `DependencyBuilder.test.ts` - Dependency builder functionality
- `Parser.test.ts` - Parser functionality
- `Range.test.ts` - Range functionality
- `NamedRange.test.ts` - Named range functionality
- `DateHandling.test.ts` - Date handling utilities
- `DateArithmetic.test.ts` - Date arithmetic operations
- `DateUTC.test.ts` - UTC date handling

### Integration Tests (`integration/`)
Tests that verify multiple components working together:
- `Integration.test.ts` - General integration tests
- `CrossSheetDependencies.test.ts` - Cross-sheet reference handling
- `RangeDependencies.test.ts` - Range dependency tracking
- `DependencyTopology.test.ts` - Dependency graph topology
- `CircularReference.test.ts` - Circular reference detection
- `ArrayFormula.test.ts` - Array formula functionality
- `AutoCalculate.test.ts` - Auto-calculation behavior
- `DynamicUpdates.test.ts` - Dynamic cell updates
- `DynamicRange.test.ts` - Dynamic range behavior
- `FormulaJS.test.ts` - Formula.js library integration
- `lazy-evaluation.test.ts` - Lazy evaluation optimization
- `loadArray.test.ts` - Array loading functionality
- `moveAndCopyRange.test.ts` - Range move and copy operations
- `exportJSON.test.ts` - JSON export functionality

### Debug Tests (`debug/`)
Tests for debugging and troubleshooting specific issues:
- `Debug.test.ts` - General debugging tests
- `Debug2D.test.ts` - 2D array debugging
- `DebugArithmetic.test.ts` - Arithmetic operation debugging
- `DebugAutoCalc.test.ts` - Auto-calculation debugging
- `DebugTopo.test.ts` - Topology debugging

### Performance Tests (`performance/`)
Benchmark and performance tests:
- `performance.test.ts` - Performance benchmarks for various operations

## Running Tests

Run all tests:
```bash
npm test
```

Run specific test category:
```bash
npm test -- --testPathPattern=unit           # Run only unit tests
npm test -- --testPathPattern=integration    # Run only integration tests
npm test -- --testPathPattern=debug          # Run only debug tests
npm test -- --testPathPattern=performance    # Run only performance tests
```

Run a specific test file:
```bash
npm test -- Cell.test.ts                     # Run specific test by name
npm test -- test/unit/Cell.test.ts          # Run specific test by path
```

Run tests matching a pattern:
```bash
npm test -- -t "should calculate"            # Run tests with matching description
```

## Guidelines

### Writing Unit Tests
- Focus on testing a single class or function
- Mock external dependencies
- Test edge cases and error conditions
- Keep tests fast and isolated

### Writing Integration Tests
- Test interactions between multiple components
- Use realistic scenarios
- Verify end-to-end behavior
- Test cross-sheet and cross-component functionality

### Writing Debug Tests
- Create reproducible test cases for specific bugs
- Include detailed comments explaining the issue
- Keep these tests even after bugs are fixed (regression prevention)

### Writing Performance Tests
- Establish baseline performance metrics
- Test at scale (large datasets, complex formulas)
- Monitor for performance regressions
- Include timing information in assertions
