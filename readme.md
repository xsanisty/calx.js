# Calx.JS

## About

Calx.JS is continuation of jQuery-Calx, a library that act as headless spreadsheet to perform spreadsheet like calculation in a web page using similar formula and syntax.

Calx is now written in TypeScript and restructured, so it easier for developers to contribute.

## Usage

Calx.JS no longer depend on jQuery, but it can be used as jQuery plugin, similar with jQuery-Calx.

#### With jQuery
```
$('#element').calx(options)
```
#### Without jQuery
```
let calx = require('calx');
let workbook = calx.createWorkbook();
let sheet = workbook.createSheet('sheet_1');

sheet.mount('#element');
```

## Developer
This section is targetted to developers.

### Class Structure
```
-Calx
-- Range
-- Formulae
-- Parser
-- Sheet
-- Utility
-- Workbook
```

### Build

To build distrbutable script, you may run the following command

```
npm run build
```
Build distributale script

```
npm run build-with-parser
```
Parser's grammar is rarely updated, but if you update the grammar file, you need to update the distributable using this command to make new grammar to take effect.

```
npm run generate-parser
```
```
npm run test
```
Run the test suite, currently not implemented
