## Overview 
jQuery Calx is simple jQuery plugin for building javascript based calculation form. This is the initial release, so there is still lack of features and still changed recently. In the core of jQuery Calx, it uses standard calculator jison parser

[http://zaach.github.com/jison/try/](http://zaach.github.com/jison/try/) which is generated using standard jison calculator grammar. But you can extend the parser to use your own parser (this feature still in dev)

## Documentation 
Since this plugin is still under intensive development, the documentation is very limited 

#### HTML Structure 
Firstly, of course you need to build the form structure, its simple enough to make the calculation form work 

*   Specify the form id and the id for each form element, this id attribute will be used as formula reference. ( e.g. : <input type="text" id="A1" /> )
*   Specify data-formula attribute for the calculation formula. the variable placeholder format is dollar sign [$+reference_id] followed by standard calculation operators \[+-/*^()\] ( e.g.<input type="text" data-formula="( $A + $B) * $B^2" /> )
*   Specify data-format attribute if you want to format the value of the form, data-ormat syntax use css like syntax with key:value pair and delimited by semicolon (;). ( e.g. <input type="text" data-format="format:currency; decimal:2; suffix:$" /> ) Below is available data format:  
    *   format, define how the number should be formatted (default : number)
        *   number : format input value as number without any formatting ( e.g. 109878.2345 )
        *   percent : format input value as percentage and will be divided by 100 on calculation process ( e.g. value of 10 will be parsed as 0.1 when calculation is performed )
        *   currency : format input value as currency, the decimal separator and thousand separator depend on decsep and digitsep
    *   decimal, define how many decimal place at the end of number ( default: 0 )
    *   prefix, append prefix to the value, useful for currency format ( e.g. $ 1,000.00 | default: '' )
    *   suffix, append prefix to the value, useful for percentage, measurement unit, etc ( e.g. 100 miles, 80 % | default: '' )
    *   digitsep, digit separator per thousand ( e.g. 1,000,987 | default: , <comma>)
    *   decsep, decimal separator ( e.g. 1,000,987.34 | default: . <dot> )
    *   absolute, mark negative number as absolute number (will add "absolute" class to the input | default:false)
*   Every input field that contain data-formula attribute, will be marked as readonly and "readonly" class added to the input element
*   Every input field that have no data-formula defined, will have "writeable" class added to the input element

```html
<form id="calx">
    Price :<br />
    <input type="text" id="price" value="29.5" data-format="format:currency;decimal:2;prefix:$ " /><br />
    Qty :<br />
    <input type="text" id="qty" value="4" /><br />
    Discount :<br />
    <input type="text" id="discount" value="15" data-format="format:percent;decimal:2;suffix: %" /><br />
    Total :<br />
    <input type="text" id="total" data-formula="($price*$qty)*(1-$discount)" data-format="format:currency;decimal:2;prefix:$ " /><br />
    </form>
```

#### CSS Classes
Css classew is optional, you can define class for readonly, writeable, and absolute type of input field. Below is the sample input classes

```css
input.writeable{
    background:#ffffcc;
}
input.readonly{
    background:#f8f8f8;
}
input.absolute{
    color:red;
}
```

#### Javascript Section 
Finally, after building the HTML structure and CSS rule, you can apply the calculator by simply type 

```javascript
$(document).ready(function(){
   $('#calx').calx();
});
```

That's all, now your calculation form should work.