# Build Size Comparison

## CalxJS Bundle Sizes

| Build Type | Size | Reduction vs Standard |
|------------|------|-----------------------|
| **ESM Standard** | 396 KB | - |
| **Core Standard (UMD)** | 323 KB | - |
| **jQuery Standard** | 330 KB | - |
| **Core Thin (UMD)** | **187 KB** | **42%** ↓ |
| **jQuery Thin** | **194 KB** | **41%** ↓ |

## What's Different?

### Standard Builds
- ✅ Include FormulaJS (~135 KB)
- ✅ Ready to use immediately
- ✅ Single file deployment
- ⚠️ Larger bundle size

### Thin Builds
- ✅ Exclude FormulaJS
- ✅ **42% smaller** bundle
- ✅ Better for modern bundlers
- ✅ Avoids duplicate FormulaJS if already in project
- ⚠️ Requires FormulaJS loaded separately

## When to Use Each

### Use Standard Build When:
- You want simplicity (single file)
- You don't have FormulaJS in your project
- Bundle size is not critical
- You want the quickest setup

### Use Thin Build When:
- You want smaller bundle sizes
- You already use FormulaJS elsewhere
- You're using a module bundler (webpack, rollup, etc.)
- You want to load dependencies from CDN
- You need precise control over dependency versions

## Loading Examples

### Standard Build
```html
<!-- Single file - ready to use -->
<script src="dist/calx.js"></script>
<script>
  const workbook = Calx.createWorkbook();
</script>
```

### Thin Build
```html
<!-- Load FormulaJS first -->
<script src="https://cdn.jsdelivr.net/npm/@formulajs/formulajs@3/dist/formulajs.min.js"></script>
<!-- Then load CalxJS thin -->
<script src="dist/calx.thin.js"></script>
<script>
  const workbook = Calx.createWorkbook();
</script>
```

## Build Commands

```bash
# Standard builds (full)
npm run build              # Both standard builds
npm run build:core         # Core only
npm run build:jquery       # jQuery only

# Thin builds (FormulaJS external)
npm run build:thin         # Both thin builds
npm run build:thin-core    # Core thin only
npm run build:thin-jquery  # jQuery thin only

# Everything
npm run build:all          # All standard + thin builds
```

## Module Bundler Setup

### Webpack

For thin build with webpack, FormulaJS will be automatically externalized:

```javascript
// webpack.config.js
module.exports = {
  externals: {
    '@formulajs/formulajs': 'formulajs'
  }
};
```

### Rollup

```javascript
// rollup.config.js
export default {
  external: ['@formulajs/formulajs'],
  output: {
    globals: {
      '@formulajs/formulajs': 'formulajs'
    }
  }
};
```

## CDN Usage

### Standard Build (jsDelivr)
```html
<script src="https://cdn.jsdelivr.net/npm/@xsanisty/calxjs@latest/dist/calx.js"></script>
```

### Thin Build (jsDelivr)
```html
<!-- FormulaJS -->
<script src="https://cdn.jsdelivr.net/npm/@formulajs/formulajs@3/dist/formulajs.min.js"></script>
<!-- CalxJS Thin -->
<script src="https://cdn.jsdelivr.net/npm/@xsanisty/calxjs@latest/dist/calx.thin.js"></script>
```

## Performance Impact

The thin build has **no runtime performance difference** compared to the standard build. The only benefit is:

- ⚡ **Faster initial page load** (smaller bundle)
- 💾 **Better caching** (FormulaJS can be cached separately)
- 📦 **Smaller deployments** (less data to transfer)

## See Also

- [Thin Build Documentation](./THIN_BUILD.md) - Detailed guide
- [Examples](../examples/) - Working examples for both builds
