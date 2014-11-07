### Overview
jQuery Calx is an Excel calculation engine and formula parser built as jQuery plugin.

Creating caluclation form in html never been easier and simpler than this:

```
<form id="calx_form">
    <input data-cell="A1" type="text">
    <input data-cell="A2" type="text">
    <input data-cell="A3" type="text">

    <input data-formula="SUM(A1:A3)" type="text">
</form>

<script>
    $('#calx_form').calx();
</script>
```

### Building from source

to build calx from source, you need to do this in terminal
(php and java is required, run on *nix environment)

```
$ cd php-build
$ php build

```html

to build sample calx, with alls required script included, use build-sample

```
$ cd php-build
$ php build
$ php build-sample

```

thats all, the compiled and minified js should be updated

For detailed documentation, [http://www.xsanisty.com/project/calx2](http://www.xsanisty.com/project/calx2) for jQuery Calx 2.x.

For jQuery Calx 1.x please visit [http://www.xsanisty.com/project/calx](http://www.xsanisty.com/project/calx)
