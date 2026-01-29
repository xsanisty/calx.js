# jQuery Calx 3.0

<div align="center">

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Tests](https://img.shields.io/badge/tests-209%2F223-yellow.svg)

**Modern spreadsheet-like calculation engine for the web**

Transform your HTML forms into powerful spreadsheet calculators with real-time formula evaluation, cell dependencies, and Excel-compatible functions.

[Documentation](https://calx.xsanisty.com/) • [Examples](examples/index.html) • [Legacy Docs](https://www.xsanisty.com/project/calx2/)

</div>

---

## ✨ Features

- 🔧 **TypeScript Rewrite** - Complete modern rewrite with improved type safety
- ⚡ **Dynamic Dependencies** - Automatic dependency tracking and calculation
- 💰 **Input Masking** - Built-in formatters (currency, percent, number, etc.)
- 🎨 **Conditional Styling** - Apply CSS styles based on cell values
- 🏷️ **Named Variables** - Use readable names instead of cell addresses
- 📊 **Multi-Sheet Support** - Work with multiple calculation sheets
- 🚀 **Auto Addresses** - Formula cells get automatic CALX addresses
- 📱 **Responsive** - Mobile-friendly with modern UI
- 🧮 **Excel Functions** - 400+ Excel-compatible functions via FormulaJS
- 🔄 **Backward Compatible** - Works with jQuery Calx 2.x code

## 🚀 Quick Start

### Installation

#### Via NPM
```bash
npm install @xsanisty/calxjs
```

#### Via CDN (Coming Soon)
```html
<!-- jQuery (required for plugin) -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- jQuery Calx -->
<script src="https://cdn.jsdelivr.net/npm/@xsanisty/calxjs@3.0.0/dist/jquery.calx.js"></script>
```

### Basic Example

```html
<form id="calculator">
    <input type="number" data-cell="A1" value="10">
    <input type="number" data-cell="A2" value="20">
    <input type="text" data-formula="A1+A2" readonly>
</form>

<script>
    $('#calculator').calx();
</script>
```

### With Formatters

```html
<form id="invoice">
    <input data-cell="A1" data-var="PRICE" value="100" data-format="currency">
    <input data-cell="A2" data-var="QTY" value="5">
    <input data-cell="A3" data-var="TAX" value="0.08" data-format="percent">
    <input data-formula="PRICE*QTY*(1+TAX)" data-format="currency" readonly>
</form>

<script>
    $('#invoice').calx({ autoCalculate: true });
</script>
```

## 📚 Documentation

- **[Full Documentation](https://calx.xsanisty.com/)** - Complete guide with API reference
- **[Migration Guide](docs/MIGRATION_GUIDE.md)** - Upgrading from 2.x
- **[jQuery Plugin Guide](docs/JQUERY_PLUGIN.md)** - jQuery-specific features
- **[TypeScript Guide](docs/TYPESCRIPT_README.md)** - Using with TypeScript
- **[Testing Guide](docs/TESTING_GUIDE.md)** - Running tests
- **[Architecture Comparison](docs/ARCHITECTURE_COMPARISON.md)** - v2 vs v3

## 💡 Examples

Explore interactive examples in the [examples/](examples/) directory:

- **[Basic Calculator](https://calx.xsanisty.com/examples/jquery-basic.html)** - Simple arithmetic
- **[Formatters & Masks](https://calx.xsanisty.com/examples/jquery-formatters.html)** - Currency, percent, number formatting
- **[Data Types](https://calx.xsanisty.com/examples/jquery-datatypes.html)** - Working with different data types
- **[Dynamic Forms](https://calx.xsanisty.com/examples/jquery-dynamic-form.html)** - Adding/removing rows
- **[Multiple Sheets](https://calx.xsanisty.com/examples/jquery-multisheet.html)** - Cross-sheet references
- **[Mortgage Calculator](https://calx.xsanisty.com/examples/jquery-mortgage.html)** - Complex financial calculations
- **[Advanced Features](https://calx.xsanisty.com/examples/jquery-advanced.html)** - Custom functions and formatters

## 📖 Usage

### jQuery Plugin

```javascript
// Initialize
$('#form').calx({
    autoCalculate: true,
    data: {
        A1: { value: 100, format: 'currency' }
    },
    variables: {
        TAX: 'A1'
    },
    functions: {
        CUSTOM: function(x) { return x * 2; }
    }
});

// Methods
$('#form').calx('getCellValue', 'A1');
$('#form').calx('setCellValue', 'A1', 100);
$('#form').calx('calculate');
```

### TypeScript API

```typescript
import { Calx } from '@xsanisty/calxjs';

const workbook = Calx.createWorkbook();
const sheet = workbook.createSheet('sheet1');

sheet.mount('#element');
sheet.setCell('A1', 10);
sheet.setCell('A2', 20);
sheet.setCell('A3', '=A1+A2');

sheet.calculate();
console.log(sheet.getCell('A3').value); // 30
```

## 🔧 Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Build both core and jQuery plugin
npm run build

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm run test:coverage
```

### Build Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build both core and jQuery plugin |
| `npm run build:core` | Build core library only |
| `npm run build:jquery` | Build jQuery plugin only |
| `npm run build-parser` | Regenerate formula parser (rarely needed) |

### Project Structure

```
calx.js/
├── src/                    # TypeScript source
│   ├── Calx.ts            # Main entry point
│   ├── Calx/              # Core classes
│   │   ├── Cell.ts
│   │   ├── Sheet.ts
│   │   ├── Workbook.ts
│   │   ├── Formula/       # Formula engine
│   │   ├── Parser/        # Expression parser
│   │   └── Utility/       # Helper functions
│   └── jquery.calx.ts     # jQuery plugin
├── dist/                   # Compiled output
│   ├── calx.js            # Core library
│   └── jquery.calx.js     # jQuery plugin
├── examples/               # Live examples
├── test/                   # Jest tests
├── docs/                   # Documentation
└── legacy/                 # jQuery Calx 2.x

```

## 🧪 Testing

Currently **209 out of 223 tests passing** (93.7%).

```bash
# Run all tests
npm test

# Watch mode
npm test:watch

# With coverage
npm run test:coverage
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original jQuery Calx 2.x by [@xsanisty](https://github.com/xsanisty)
- [FormulaJS](https://formulajs.info/) for Excel function implementations
- [Chevrotain](https://chevrotain.io/) for parser infrastructure
- All contributors and users of jQuery Calx

## 📞 Support

- **Documentation**: [https://calx.xsanisty.com/](https://calx.xsanisty.com/)
- **Issues**: [GitHub Issues](https://github.com/xsanisty/calx.js/issues)
- **Legacy Docs**: [www.xsanisty.com/project/calx2/](https://www.xsanisty.com/project/calx2/)

---

<div align="center">

**Made with ❤️ by [Xsanisty](https://www.xsanisty.com)**

⭐ Star us on GitHub — it helps!

[GitHub](https://github.com/xsanisty/calx.js) • [npm](https://www.npmjs.com/package/@xsanisty/calxjs)

</div>
