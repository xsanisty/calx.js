# CalxJS Thin Build

The thin build option for CalxJS allows you to load FormulaJS separately, significantly reducing the bundle size.

## Bundle Size Comparison

| Build Type | Size | Reduction |
|------------|------|-----------|
| **Standard Build** | ~323 KB | - |
| **Thin Build** | ~195 KB | **40%** |
| **jQuery Standard** | ~330 KB | - |
| **jQuery Thin** | ~202 KB | **39%** |

## When to Use Thin Build

The thin build is ideal when:

- You want to minimize initial bundle size
- You're already using FormulaJS in your project
- You want to load FormulaJS from a CDN
- You need more control over dependency loading
- You're building a modular application with shared dependencies

## Usage

### 1. NPM/Yarn Installation

```bash
npm install @xsanisty/calxjs
# or
yarn add @xsanisty/calxjs
```

### 2. Load FormulaJS First

The thin build expects FormulaJS to be available before CalxJS is loaded.

#### Browser (UMD)

```html
<!-- Load FormulaJS first -->
<script src="https://unpkg.com/@formulajs/formulajs@4.3.0/dist/formulajs.umd.min.js"></script>

<!-- Then load CalxJS thin build -->
<script src="node_modules/@xsanisty/calxjs/dist/calx.thin.js"></script>
```

#### With jQuery

```html
<!-- Load jQuery first -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Load FormulaJS second -->
<script src="https://unpkg.com/@formulajs/formulajs@4.3.0/dist/formulajs.umd.min.js"></script>

<!-- Load CalxJS jQuery thin build last -->
<script src="node_modules/@xsanisty/calxjs/dist/jquery.calx.thin.js"></script>
```

#### ES Modules

```javascript
// Import FormulaJS first
import * as formulajs from '@formulajs/formulajs';

// Make it available globally
window.formulajs = formulajs;

// Then import CalxJS thin
import Calx from '@xsanisty/calxjs/thin';

// Use as normal
const workbook = Calx.createWorkbook();
```

#### CommonJS

```javascript
// Load FormulaJS first
global.formulajs = require('@formulajs/formulajs');

// Load CalxJS thin build
const Calx = require('@xsanisty/calxjs/thin');

const workbook = Calx.createWorkbook();
```

## Building From Source

### Build Thin Versions Only

```bash
npm run build:thin
```

This creates:
- `dist/calx.thin.js` - Core thin build
- `dist/jquery.calx.thin.js` - jQuery plugin thin build

### Build All Versions

```bash
npm run build:all
```

This creates both standard and thin builds.

### Individual Builds

```bash
# Standard builds
npm run build:core          # Core standard build
npm run build:jquery        # jQuery standard build

# Thin builds
npm run build:thin-core     # Core thin build
npm run build:thin-jquery   # jQuery thin build
```

## Examples

See the example files for complete working demonstrations:

- [`thin-build-example.html`](../examples/thin-build-example.html) - Core thin build example
- [`jquery-thin-build-example.html`](../examples/jquery-thin-build-example.html) - jQuery thin build example

## API

The thin build provides the exact same API as the standard build. All features, functions, and methods work identically.

```javascript
// Standard build
const workbook = Calx.createWorkbook();
const sheet = workbook.createSheet('Sheet1');
sheet.createCell('A1', { value: 10 });
sheet.createCell('A2', { formula: '=A1*2' });
workbook.build();
workbook.calculate();

// Works exactly the same with thin build!
```

## FormulaJS CDN Options

You can load FormulaJS from various CDNs:

### unpkg (Recommended)
```html
<script src="https://unpkg.com/@formulajs/formulajs@4.3.0/dist/formulajs.umd.min.js"></script>
```

### jsDelivr
```html
<script src="https://cdn.jsdelivr.net/npm/@formulajs/formulajs@4.3.0/dist/formulajs.umd.min.js"></script>
```

### Local Installation
```bash
npm install @formulajs/formulajs
```

## Troubleshooting

### "formulajs is not defined"

Make sure FormulaJS is loaded **before** CalxJS thin build:

```html
<!-- ✓ Correct order -->
<script src="formulajs.min.js"></script>
<script src="calx.thin.js"></script>

<!-- ✗ Wrong order -->
<script src="calx.thin.js"></script>
<script src="formulajs.min.js"></script>
```

### Module Loading Issues

For ES modules, ensure FormulaJS is available globally:

```javascript
import * as formulajs from '@formulajs/formulajs';
window.formulajs = formulajs; // Make it global
import Calx from '@xsanisty/calxjs/thin';
```

## Performance

The thin build has the same performance characteristics as the standard build. The only difference is the initial load time, which is reduced due to the smaller bundle size.

If you're loading FormulaJS from a CDN, make sure to:
- Use a CDN with good global coverage
- Enable browser caching
- Consider using a version-specific URL for better caching

## Migration from Standard Build

Switching from standard to thin build requires minimal changes:

1. Add FormulaJS script tag/import before CalxJS
2. Change the CalxJS script source from `calx.js` to `calx.thin.js`
3. No code changes required - the API is identical

```diff
  <!-- Before -->
- <script src="dist/calx.js"></script>

  <!-- After -->
+ <script src="https://unpkg.com/@formulajs/formulajs@4.3.0/dist/formulajs.umd.min.js"></script>
+ <script src="dist/calx.thin.js"></script>
```

## License

Same as CalxJS - MIT License
