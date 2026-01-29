#jQuery Calx

[![Baikal](https://baikal.io/badges/xsanisty/jquery-calx)](https://baikal.io/xsanisty/jquery-calx)
[![Join the chat at https://gitter.im/xsanisty/jquery-calx](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/xsanisty/jquery-calx?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

jQuery Calx is an Excel calculation engine and formula parser built as jQuery plugin, it offer spreadsheet ability to process and
calculate the formula without bringing table-like spreadsheet interface.

In the core of jQuery Calx is formula parser generated using [jison](https://github.com/zaach/jison) which parse and process the
formula and set of formulas imported from [formula.js](https://github.com/sutoiku/formula.js).

Creating calculation form in html never been easier and simpler than this:

```html
<form id="calx_form">
    <input data-cell="A1">
    <input data-cell="A2">
    <input data-cell="A3">

    <input data-formula="SUM(A1:A3)">
    <input data-formula="AVERAGE(A1:A3)">
    <input data-formula="(A1+A2)*A3">
    <input data-formula="(A1^2)+(A2^2)+(A3^2)">
</form>

<script>
    $('#calx_form').calx();
</script>
```

If you don't want the formula make your html looks messy, you can move all formula and formatting rule into the js, and leave only `data-cell` attribute.

```html
<form id="calx_form">
    <input data-cell="A1">
    <input data-cell="A2">
    <input data-cell="A3">

    <input data-cell="B1">
    <input data-cell="B2">
    <input data-cell="B3">
    <input data-cell="B4">
</form>

<script>
    $('#calx_form').calx({
        data : {
            B1 : {format: '$ 0,0', formula: 'SUM(A1:A3)'},
            B2 : {format: '0.00', formula: 'AVERAGE(A1:A3)'},
            B3 : {formula: 'LOG(A1)*(A2/A3)'},
            B4 : {formula: 'MAX(A1:A3)'}
        }
    });
</script>
```

You can even completely remove hidden cell that act as proxy or intermediate cell and move it to javascript section

```html
<form id="calx_form">
    <input data-cell="B4">
</form>

<script>
    $('#calx_form').calx({
        data : {
            B1 : {value: '100'},
            B2 : {value: '200'},
            B3 : {formula: 'B1+B2'},
            B4 : {formula: 'B3^2'}
        }
    });
</script>
```

# Installation

You can install jQuery Calx by downloading the latest version from this repository, or install it using bower

```
bower install jquery-calx
```

or

```
bower install xsanisty/jquery-calx
```

and load the required script into your html page

```html
<!-- the only required dependency -->
<script src="jquery.min.js"></script>
<!-- required for number formatting only -->
<script src="numeral.min.js"></script>
<!-- the jquery calx lib -->
<script src="jquery-calx-2.2.7.min.js"></script>
```

For detailed documentation, [http://www.xsanisty.com/project/calx2](http://www.xsanisty.com/project/calx2).

For jQuery Calx 1.x please visit [http://www.xsanisty.com/project/calx](http://www.xsanisty.com/project/calx)
