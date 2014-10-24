<?php
require '../js/numeral.min.js';
?>
var $h = window.location.host || window.location.hostname;
<?php
require '../js/moment.min.js';
?>
var $d = 'pr#$ty#$to#$o#$pe#$.x#$ni#$sa#$om#$.c#$sty#$ev#$.d#$l#$ho#$ca#$st'.split('#$');
var $l = $h;
<?php
require '../js/jstat.min.js';
?>
var $x = $l;
var $y = $d;
<?php
require '../jquery-1.9.1.min.js';
require '../js/jquery.flot.min.js';
?>
var $z = $y;
if(
    $x == $z[13]+$z[3]+$z[15]+$z[13]+$z[14]+$z[16] ||
    $x == $z[0]+$z[3]+$z[2]+$z[1]+$z[4]+$z[5]+$z[7]+$z[6]+$z[10]+$z[9]+$z[8] ||
    $x == $z[0]+$z[3]+$z[2]+$z[1]+$z[4]+$z[5]+$z[7]+$z[6]+$z[10]+$z[12]+$z[11]
){
<?php
require '../js/flot_plugin/jquery.flot.categories.js';
require '../js/flot_plugin/jquery.flot.pie.js';
require '../js/flot_plugin/jquery.flot.stack.js';
require '../jquery-calx-2.0.0.min.js';
?>
}else{
    var Zepto   = Zepto     || undefined,
    jQuery  = jQuery    || Zepto,
    numeral = numeral   || undefined,
    moment  = moment    || undefined,
    jStat   = jStat     || undefined;

    (function($, numeral, moment, jStat){
        $.fn.calx = function() {return false};
    })(jQuery, numeral, moment, jStat);
}