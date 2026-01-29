# Date Handling in Calx.js

Calx.js provides comprehensive support for working with dates, including conversion between JavaScript Date objects and Excel serial dates.

## Features

- **DateUtil**: Utility class for converting between Excel serial dates and JavaScript Date objects
- **Cell Date Methods**: Special methods on Cell objects for working with dates
- **Excel Compatibility**: Dates are stored as Excel serial numbers (days since December 30, 1899)
- **Type Safety**: Automatic validation and type checking for date values

## DateUtil Usage

### Converting Between Formats

```typescript
import { DateUtil } from './src/Calx';

// Convert Excel serial date to JavaScript Date
const date = DateUtil.serialToDate(45292); // January 1, 2024
console.log(date); // Date object

// Convert JavaScript Date to Excel serial date
const jsDate = new Date(2024, 0, 1);
const serialDate = DateUtil.dateToSerial(jsDate);
console.log(serialDate); // 45292

// Create from components
const serial = DateUtil.fromComponents(2024, 1, 15); // January 15, 2024

// Get date components
const components = DateUtil.toComponents(45292);
console.log(components);
// { year: 2024, month: 1, day: 1, weekday: 1, hours: 0, minutes: 0, seconds: 0 }
```

### Formatting and Parsing

```typescript
// Format as ISO string
const isoString = DateUtil.toISOString(45292);
console.log(isoString); // "2024-01-01"

// Parse ISO string
const serial = DateUtil.fromISOString("2024-01-01");
console.log(serial); // 45292
```

### Current Date/Time

```typescript
// Get today (date only, no time)
const today = DateUtil.today();

// Get now (date and time as fractional day)
const now = DateUtil.now();
```

### Validation

```typescript
// Check if a value is a valid Excel serial date
DateUtil.isValidSerialDate(45292); // true
DateUtil.isValidSerialDate(NaN); // false
DateUtil.isValidSerialDate(9999999); // false (too far in future)
```

## Cell Date Methods

### Setting Date Values

```typescript
import { Calx, DateUtil } from './src/Calx';

const workbook = Calx.createWorkbook();
const sheet = workbook.createSheet('Sheet1');

// Set date from JavaScript Date object
const cell = sheet.createCell('A1', {});
cell.setDateValue(new Date(2024, 0, 15)); // January 15, 2024

// Set date from Excel serial number
cell.setSerialDateValue(45292); // January 1, 2024

// Set date with type specified during creation
sheet.createCell('B1', {
    value: 45292,
    type: DataType.DATE
});
```

### Getting Date Values

```typescript
// Get as JavaScript Date object
const date = cell.getDateValue();
console.log(date); // Date { ... }

// Get as Excel serial number
const serialDate = cell.getSerialDateValue();
console.log(serialDate); // 45292

// Get formatted ISO string
const formatted = cell.getFormattedDate();
console.log(formatted); // "2024-01-15"

// Check if cell contains a date
if (cell.isDate()) {
    console.log('This cell contains a date');
}
```

### Date Arithmetic in Formulas

```typescript
// Date arithmetic works with Excel serial numbers
sheet.createCell('A1', { value: 45292, type: DataType.DATE }); // Jan 1, 2024
sheet.createCell('B1', { formula: '=A1+7' }); // Add 7 days

workbook.build();
workbook.calculate();

console.log(sheet.getCellValue('B1')); // 45299 (January 8, 2024)

// Calculate date differences
sheet.createCell('C1', { value: 45323, type: DataType.DATE }); // Feb 1, 2024
sheet.createCell('D1', { formula: '=C1-A1' }); // Days between

workbook.build();
workbook.calculate();

console.log(sheet.getCellValue('D1')); // 31 days
```

### Using Date Functions

```typescript
// DATE function creates Excel serial date
sheet.createCell('A1', { formula: '=DATE(2024, 1, 15)' });

workbook.build();
workbook.calculate();

// Mark the cell as a date type to use date methods
const cell = sheet.getCell('A1');
cell.type = DataType.DATE;

// Now you can use date methods
const date = cell.getDateValue();
console.log(date.getFullYear()); // 2024

// YEAR, MONTH, DAY functions extract components
sheet.createCell('B1', { formula: '=YEAR(A1)' });
sheet.createCell('C1', { formula: '=MONTH(A1)' });
sheet.createCell('D1', { formula: '=DAY(A1)' });

workbook.build();
workbook.calculate();

console.log(sheet.getCellValue('B1')); // 2024
console.log(sheet.getCellValue('C1')); // 1
console.log(sheet.getCellValue('D1')); // 15
```

## Data Types

Calx.js supports the following date-related data types:

- `DataType.DATE` - Date only (no time component)
- `DataType.TIME` - Time only (no date component)
- `DataType.DATETIME` - Combined date and time

All three types work with the date methods, storing values as Excel serial numbers internally.

## Excel Compatibility

### Serial Date Format

Excel stores dates as serial numbers representing days since December 30, 1899:
- Day 0 = December 30, 1899
- Day 1 = January 1, 1900
- Day 45292 = January 1, 2024

### Fractional Days

Time is represented as the fractional part of the day:
- 0.5 = 12:00 PM (noon)
- 0.25 = 6:00 AM
- 0.75 = 6:00 PM

### Date Arithmetic

You can add/subtract days directly:
```typescript
const tomorrow = today + 1;
const nextWeek = today + 7;
const lastMonth = today - 30;
```

## Error Handling

All date methods include validation:

```typescript
// Invalid date throws error
try {
    cell.setDateValue('invalid date');
} catch (error) {
    console.error('Invalid date:', error.message);
}

// Invalid serial date throws error
try {
    cell.setSerialDateValue(NaN);
} catch (error) {
    console.error('Invalid serial date:', error.message);
}

// Out of range throws error
try {
    cell.setSerialDateValue(9999999); // Too far in future
} catch (error) {
    console.error('Date out of range:', error.message);
}
```

## Complete Example

```typescript
import { Calx, DateUtil, DataType } from './src/Calx';

const workbook = Calx.createWorkbook();
const sheet = workbook.createSheet('Dates');

// Create cells with different date representations
const cell1 = sheet.createCell('A1', {});
cell1.setDateValue(new Date(2024, 0, 1)); // JavaScript Date

const cell2 = sheet.createCell('A2', {});
cell2.setSerialDateValue(45292); // Excel serial

sheet.createCell('A3', { formula: '=DATE(2024, 1, 15)' }); // Formula

// Add date arithmetic formulas
sheet.createCell('B1', { formula: '=A1+30' }); // 30 days later
sheet.createCell('B2', { formula: '=A2-A1' }); // Difference
sheet.createCell('B3', { formula: '=YEAR(A3)' }); // Extract year

workbook.build();
workbook.calculate();

// Read and display results
console.log('Date 1:', cell1.getFormattedDate()); // "2024-01-01"
console.log('Date 2:', cell2.getDateValue().toLocaleDateString()); // "1/1/2024"
console.log('30 days later:', sheet.getCellValue('B1')); // 45322
console.log('Days difference:', sheet.getCellValue('B2')); // 0
console.log('Year:', sheet.getCellValue('B3')); // 2024
```

## Best Practices

1. **Use DateUtil for conversions**: Always use DateUtil methods instead of manual calculations
2. **Store as serial numbers**: Internally, dates are stored as Excel serial numbers for compatibility
3. **Set type explicitly**: Mark cells as DATE type when using date methods
4. **Validate input**: Use the built-in validation to catch invalid dates early
5. **Use getDateValue()**: When you need a JavaScript Date object, call `getDateValue()`
6. **Use getSerialDateValue()**: When you need the raw Excel serial number

## API Reference

### DateUtil Static Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `serialToDate(serialDate)` | Convert Excel serial to Date | `Date` |
| `dateToSerial(date)` | Convert Date to Excel serial | `number` |
| `fromComponents(year, month, day)` | Create from year/month/day | `number` |
| `toComponents(serialDate)` | Extract date components | `object` |
| `toISOString(serialDate)` | Format as ISO string | `string` |
| `fromISOString(isoString)` | Parse ISO string | `number` |
| `today()` | Get today as serial date | `number` |
| `now()` | Get now with time | `number` |
| `isValidSerialDate(value)` | Validate serial date | `boolean` |

### Cell Date Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `getDateValue()` | Get as JavaScript Date | `Date \| null` |
| `getSerialDateValue()` | Get as Excel serial | `number \| null` |
| `getFormattedDate()` | Get as ISO string | `string \| null` |
| `setDateValue(date)` | Set from JavaScript Date | `void` |
| `setSerialDateValue(serial)` | Set from Excel serial | `void` |
| `isDate()` | Check if contains date | `boolean` |
