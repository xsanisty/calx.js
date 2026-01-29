# Auto-Assignment of CALX Addresses

## Overview

The jQuery plugin now supports auto-assignment of cell addresses for elements that have `data-formula` but no `data-cell` attribute. This maintains backward compatibility with the legacy jQuery Calx 2.x behavior.

## How It Works

When you initialize Calx on an element:

```javascript
$('#mySheet').calx();
```

The plugin will:

1. **Scan for elements with `data-formula` but no `data-cell`**: These elements get auto-assigned addresses like `CALX1`, `CALX2`, `CALX3`, etc.

2. **Process all elements with `data-cell`**: This includes both explicitly defined and auto-assigned addresses.

3. **Merge with data from arguments**: If you provide cell data in the initialization options, it takes precedence over HTML attributes.

## Examples

### Example 1: Basic Auto-Assignment

```html
<div id="calculator">
    <input type="number" data-formula="" value="10" />
    <input type="number" data-formula="" value="20" />
    <input type="text" data-formula="=CALX1+CALX2" readonly />
</div>

<script>
    $('#calculator').calx();
    // First input becomes CALX1
    // Second input becomes CALX2
    // Third input becomes CALX3 and calculates CALX1+CALX2 = 30
</script>
```

### Example 2: Mix of Explicit and Auto Addresses

```html
<div id="invoice">
    <input type="number" data-cell="A1" value="100" />
    <input type="number" data-cell="B1" value="5" />
    <input type="number" data-formula="" value="0.1" />
    <input type="text" data-formula="=A1*B1" readonly />
    <input type="text" data-formula="=CALX2*CALX1" readonly />
</div>

<script>
    $('#invoice').calx();
    // A1 = 100 (explicit)
    // B1 = 5 (explicit)
    // CALX1 = 0.1 (auto-assigned)
    // CALX2 = 500 (auto-assigned, A1*B1)
    // CALX3 = 50 (auto-assigned, CALX2*CALX1)
</script>
```

### Example 3: Override with Argument Data

```html
<div id="sheet">
    <input type="number" data-formula="" value="10" />
    <input type="number" data-formula="" value="3" />
    <input type="text" data-formula="=CALX1*CALX2" readonly />
</div>

<script>
    $('#sheet').calx({
        data: {
            'CALX1': { value: 50 }  // Override HTML value
        }
    });
    // CALX1 = 50 (overridden from 10)
    // CALX2 = 3
    // CALX3 = 150 (50*3)
</script>
```

## Benefits

1. **Backward Compatibility**: Maintains compatibility with legacy jQuery Calx 2.x code
2. **Simpler HTML**: No need to manually assign addresses for all formula elements
3. **Flexible**: Mix auto-assigned and explicit addresses as needed
4. **Override Support**: Data from JavaScript arguments takes precedence

## Notes

- Auto-assigned addresses start from `CALX1` and increment sequentially
- Elements are processed in document order
- Empty `data-formula=""` attributes are used to mark elements for auto-assignment
- The auto-assignment happens before processing data from initialization arguments
- Explicit `data-cell` addresses are always preserved
