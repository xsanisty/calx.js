#jQuery Calx

[![Join the chat at https://gitter.im/xsanisty/jquery-calx](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/xsanisty/jquery-calx?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
jQuery Calx is an Excel calculation engine and formula parser built as jQuery plugin, it offer spreadsheet like functionality without bringing spreadsheet like user interface into html.

In the core of jQuery Calx is formula parser generated using [jison](https://github.com/zaach/jison) and formula set imported from [formula.js](https://github.com/sutoiku/formula.js), glued together by virtual cell and sheet.

Creating caluclation form in html never been easier and simpler than this:

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
            B4 : {formula: 'NPV()'}
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

```
<script src="jquery.min.js"></script>
<script src="numeral.min.js"></script>
<script src="jquery-calx-2.1.0.min.js"></script>
```

# Building from source

I am not so cool at javascrit world and still don't know how properly build the js file using grunt or gulp, but willing to learn to improve my skill.
So, to make the full plugin easily maintainable, I split up into several js, concatenate it using single php script and minify using closure compiler.

The full source of jQuery calx is located in `php-build/include` directory, and splitted up based on object API

to build calx from source, you need to do this in terminal
(php and java is required, run on *nix environment)

```
user@machine:/$ cd php-build
user@machine:/php-build$ php build

```

to build sample calx, with alls required script included, use build-sample

```
user@machine:/$ cd php-build
user@machine:/php-build$ php build
user@machine:/php-build$ php build-sample

```

thats all, the compiled and minified js should be updated

For detailed documentation, [http://www.xsanisty.com/project/calx2](http://www.xsanisty.com/project/calx2).
For jQuery Calx 1.x please visit [http://www.xsanisty.com/project/calx](http://www.xsanisty.com/project/calx)
