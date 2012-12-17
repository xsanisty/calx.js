## Overview 
jQuery Calx is simple jQuery plugin for building javascript based calculation form. This is the first initial release, so there is still lack of features and still changed recently. In the core of jQuery Calx, it uses standard calculator jison parser <

http://zaach.github.com/jison/try/ which is generated using standard jison calculator grammar. If you are interested about developing this plugin, please kindly fork it on github <a href="https://github.com/ikhsan017/calx" target="_blank">https://github.com/ikhsan017/calx</a> 
## Documentation 
Since this plugin is still under intensive development, the documentation is very limited 

#### HTML Structure Firstly, of course you need to build the form structure, its simple enough to make the calculation form work 

*   Specify the form id for each form element (*e.g. id="A", id="B"*)
*   Specify data-formula attribute for the calculation formula, the variable placeholder format is $ (dollar sign)+reference Id followed by standard calculation operators \[+-/*^()\] (*e.g.data-formula="( $A + $B)*$B^2"*)
*   Specify data-format attribute if you want to format the value of the form. Format syntax use css like syntax with key:value pair and delimited by semicolon (;). (*e.g. data-format="format:currency; decimal:2; suffix:$"*) Below is available data format:  
    *   format, define how the number should be formatted (currency, percent, number | default:number)
    *   decimal, define how many decimal place at the end of number (default: 2)
    *   prefix, define the prefix, useful for money format (default: none)
    *   suffix, define the suffix (default:none)
    *   digitsep, digit separator per thousand (default:, | comma character)
    *   decsep, decimal separator (default:. | dot character)
    *   absolute, mark negative number as absolute number (will add "absolute" class to the input |default:false)
*   Every input field that contain data-formula attribute, will be marked as readonly and "readonly" class added to the input element
*   Every input field that have no data-formula defined, will have "writeable" class added to the input element

<form id="calx">
         A = <input id="A" type="text" value="3" /> 
         B = <input id="B" type="text" value="4" /> 
        (A+B)= <input id="C" type="text" data-formula="$A+$B" />
</form>

#### CSS class 
Css class is optional, you can define class for readonly, writeable, and absolute type of input field 

input.writeable{
    background:#ffffcc;
}
input.readonly{
    background:#f8f8f8;
}
input.absolute{
    color:red;
}</pre>

#### Javascript Section 
Finally, after building the HTML structure and CSS rule, you can apply the calculator by simply type 

$(document).ready(function(){
   $('#calx').calx();
})

That's all, now your calculation form should work.