### Overview
jQuery Calx is an Excel calculation engine and formula parser built as jQuery plugin.

Creating caluclation form in html never been easier and simpler than this:

```html
<form id="calx_form">
    <input data-cell="A1" type="text">
    <input data-cell="A2" type="text">
    <input data-cell="A3" type="text">

    <input data-formula="SUM(A1:A3)" type="text">
    <input data-formula="AVERAGE(A1:A3)" type="text">
    <input data-formula="(A1+A2)*A3" type="text">
    <input data-formula="(A1^2)+(A2^2)+(A3^2)" type="text">
</form>

<script>
    $('#calx_form').calx();
</script>
```

### Installation

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
<script src="jquery-calx-2.0.3.min.js"></script>
```

### Building from source

to build calx from source, you need to do this in terminal
(php and java is required, run on *nix environment)

```
$ cd php-build
$ php build

```

to build sample calx, with alls required script included, use build-sample

```
$ cd php-build
$ php build
$ php build-sample

```

thats all, the compiled and minified js should be updated

For detailed documentation, [http://www.xsanisty.com/project/calx2](http://www.xsanisty.com/project/calx2).
For jQuery Calx 1.x please visit [http://www.xsanisty.com/project/calx](http://www.xsanisty.com/project/calx)
