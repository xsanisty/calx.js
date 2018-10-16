// numeral.js
// version : 1.4.5
// author : Adam Draper
// license : MIT
// http://adamwdraper.github.com/Numeral-js/
(function(){function o(e){this._n=e}function u(e,t,n){var r=Math.pow(10,t),i;i=(Math.round(e*r)/r).toFixed(t);if(n){var s=new RegExp("0{1,"+n+"}$");i=i.replace(s,"")}return i}function a(e,t){var n;t.indexOf("$")>-1?n=l(e,t):t.indexOf("%")>-1?n=c(e,t):t.indexOf(":")>-1?n=h(e,t):n=d(e,t);return n}function f(e,t){if(t.indexOf(":")>-1)e._n=p(t);else if(t===i)e._n=0;else{var s=t;n[r].delimiters.decimal!=="."&&(t=t.replace(/\./g,"").replace(n[r].delimiters.decimal,"."));var o=new RegExp(n[r].abbreviations.thousand+"(?:\\)|(\\"+n[r].currency.symbol+")?(?:\\))?)?$"),u=new RegExp(n[r].abbreviations.million+"(?:\\)|(\\"+n[r].currency.symbol+")?(?:\\))?)?$"),a=new RegExp(n[r].abbreviations.billion+"(?:\\)|(\\"+n[r].currency.symbol+")?(?:\\))?)?$"),f=new RegExp(n[r].abbreviations.trillion+"(?:\\)|(\\"+n[r].currency.symbol+")?(?:\\))?)?$"),l=["KB","MB","GB","TB","PB","EB","ZB","YB"],c=!1;for(var h=0;h<=l.length;h++){c=t.indexOf(l[h])>-1?Math.pow(1024,h+1):!1;if(c)break}e._n=(c?c:1)*(s.match(o)?Math.pow(10,3):1)*(s.match(u)?Math.pow(10,6):1)*(s.match(a)?Math.pow(10,9):1)*(s.match(f)?Math.pow(10,12):1)*(t.indexOf("%")>-1?.01:1)*Number((t.indexOf("(")>-1?"-":"")+t.replace(/[^0-9\.'-]+/g,""));e._n=c?Math.ceil(e._n):e._n}return e._n}function l(e,t){var i=t.indexOf("$")<=1?!0:!1,s="";if(t.indexOf(" $")>-1){s=" ";t=t.replace(" $","")}else if(t.indexOf("$ ")>-1){s=" ";t=t.replace("$ ","")}else t=t.replace("$","");var o=a(e,t);if(i)if(o.indexOf("(")>-1||o.indexOf("-")>-1){o=o.split("");o.splice(1,0,n[r].currency.symbol+s);o=o.join("")}else o=n[r].currency.symbol+s+o;else if(o.indexOf(")")>-1){o=o.split("");o.splice(-1,0,s+n[r].currency.symbol);o=o.join("")}else o=o+s+n[r].currency.symbol;return o}function c(e,t){var n="";if(t.indexOf(" %")>-1){n=" ";t=t.replace(" %","")}else t=t.replace("%","");e._n=e._n*100;var r=a(e,t);if(r.indexOf(")")>-1){r=r.split("");r.splice(-1,0,n+"%");r=r.join("")}else r=r+n+"%";return r}function h(e,t){var n=Math.floor(e._n/60/60),r=Math.floor((e._n-n*60*60)/60),i=Math.round(e._n-n*60*60-r*60);return n+":"+(r<10?"0"+r:r)+":"+(i<10?"0"+i:i)}function p(e){var t=e.split(":"),n=0;if(t.length===3){n+=Number(t[0])*60*60;n+=Number(t[1])*60;n+=Number(t[2])}else if(t.lenght===2){n+=Number(t[0])*60;n+=Number(t[1])}return Number(n)}function d(e,t){var s=!1,o=!1,a="",f="",l="",c=Math.abs(e._n);if(e._n===0&&i!==null)return i;if(t.indexOf("(")>-1){s=!0;t=t.slice(1,-1)}if(t.indexOf("a")>-1){if(t.indexOf(" a")>-1){a=" ";t=t.replace(" a","")}else t=t.replace("a","");if(c>=Math.pow(10,12)){a+=n[r].abbreviations.tillion;e._n=e._n/Math.pow(10,12)}else if(c<Math.pow(10,12)&&c>=Math.pow(10,9)){a+=n[r].abbreviations.billion;e._n=e._n/Math.pow(10,9)}else if(c<Math.pow(10,9)&&c>=Math.pow(10,6)){a+=n[r].abbreviations.million;e._n=e._n/Math.pow(10,6)}else if(c<Math.pow(10,6)&&c>=Math.pow(10,3)){a+=n[r].abbreviations.thousand;e._n=e._n/Math.pow(10,3)}}if(t.indexOf("b")>-1){if(t.indexOf(" b")>-1){f=" ";t=t.replace(" b","")}else t=t.replace("b","");var h=["B","KB","MB","GB","TB","PB","EB","ZB","YB"],p,d;for(var v=0;v<=h.length;v++){p=Math.pow(1024,v);d=Math.pow(1024,v+1);if(e._n>=p&&e._n<d){f+=h[v];p>0&&(e._n=e._n/p);break}}}if(t.indexOf("o")>-1){if(t.indexOf(" o")>-1){l=" ";t=t.replace(" o","")}else t=t.replace("o","");l+=n[r].ordinal(e._n)}if(t.indexOf("[.]")>-1){o=!0;t=t.replace("[.]",".")}var m=e._n.toString().split(".")[0],g=t.split(".")[1],y=t.indexOf(","),b="",w=!1;if(g){if(g.indexOf("[")>-1){g=g.replace("]","");g=g.split("[");b=u(e._n,g[0].length+g[1].length,g[1].length)}else b=u(e._n,g.length);m=b.split(".")[0];b.split(".")[1].length?b=n[r].delimiters.decimal+b.split(".")[1]:b="";o&&Number(b)===0&&(b="")}else m=u(e._n,null);if(m.indexOf("-")>-1){m=m.slice(1);w=!0}y>-1&&(m=m.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1"+n[r].delimiters.thousands));t.indexOf(".")===0&&(m="");return(s&&w?"(":"")+(!s&&w?"-":"")+m+b+(l?l:"")+(a?a:"")+(f?f:"")+(s&&w?")":"")}function v(e,t){n[e]=t}var e,t="1.4.5",n={},r="en",i=null,s=typeof module!="undefined"&&module.exports;e=function(t){e.isNumeral(t)?t=t.value():Number(t)||(t=0);return new o(Number(t))};e.version=t;e.isNumeral=function(e){return e instanceof o};e.language=function(t,i){if(!t)return r;t&&!i&&(r=t);(i||!n[t])&&v(t,i);return e};e.language("en",{delimiters:{thousands:",",decimal:"."},abbreviations:{thousand:"k",million:"m",billion:"b",trillion:"t"},ordinal:function(e){var t=e%10;return~~(e%100/10)===1?"th":t===1?"st":t===2?"nd":t===3?"rd":"th"},currency:{symbol:"$"}});e.zeroFormat=function(e){typeof e=="string"?i=e:i=null};e.fn=o.prototype={clone:function(){return e(this)},format:function(t){return a(this,t?t:e.defaultFormat)},unformat:function(t){return f(this,t?t:e.defaultFormat)},value:function(){return this._n},valueOf:function(){return this._n},set:function(e){this._n=Number(e);return this},add:function(e){this._n=this._n+Number(e);return this},subtract:function(e){this._n=this._n-Number(e);return this},multiply:function(e){this._n=this._n*Number(e);return this},divide:function(e){this._n=this._n/Number(e);return this},difference:function(e){var t=this._n-Number(e);t<0&&(t=-t);return t}};s&&(module.exports=e);typeof ender=="undefined"&&(this.numeral=e);typeof define=="function"&&define.amd&&define([],function(){return e})}).call(this);// moment.js
// version : 1.7.2
// author : Tim Wood
// license : MIT
// momentjs.com
(function(a){function E(a,b,c,d){var e=c.lang();return e[a].call?e[a](c,d):e[a][b]}function F(a,b){return function(c){return K(a.call(this,c),b)}}function G(a){return function(b){var c=a.call(this,b);return c+this.lang().ordinal(c)}}function H(a,b,c){this._d=a,this._isUTC=!!b,this._a=a._a||null,this._lang=c||!1}function I(a){var b=this._data={},c=a.years||a.y||0,d=a.months||a.M||0,e=a.weeks||a.w||0,f=a.days||a.d||0,g=a.hours||a.h||0,h=a.minutes||a.m||0,i=a.seconds||a.s||0,j=a.milliseconds||a.ms||0;this._milliseconds=j+i*1e3+h*6e4+g*36e5,this._days=f+e*7,this._months=d+c*12,b.milliseconds=j%1e3,i+=J(j/1e3),b.seconds=i%60,h+=J(i/60),b.minutes=h%60,g+=J(h/60),b.hours=g%24,f+=J(g/24),f+=e*7,b.days=f%30,d+=J(f/30),b.months=d%12,c+=J(d/12),b.years=c,this._lang=!1}function J(a){return a<0?Math.ceil(a):Math.floor(a)}function K(a,b){var c=a+"";while(c.length<b)c="0"+c;return c}function L(a,b,c){var d=b._milliseconds,e=b._days,f=b._months,g;d&&a._d.setTime(+a+d*c),e&&a.date(a.date()+e*c),f&&(g=a.date(),a.date(1).month(a.month()+f*c).date(Math.min(g,a.daysInMonth())))}function M(a){return Object.prototype.toString.call(a)==="[object Array]"}function N(a,b){var c=Math.min(a.length,b.length),d=Math.abs(a.length-b.length),e=0,f;for(f=0;f<c;f++)~~a[f]!==~~b[f]&&e++;return e+d}function O(a,b,c,d){var e,f,g=[];for(e=0;e<7;e++)g[e]=a[e]=a[e]==null?e===2?1:0:a[e];return a[7]=g[7]=b,a[8]!=null&&(g[8]=a[8]),a[3]+=c||0,a[4]+=d||0,f=new Date(0),b?(f.setUTCFullYear(a[0],a[1],a[2]),f.setUTCHours(a[3],a[4],a[5],a[6])):(f.setFullYear(a[0],a[1],a[2]),f.setHours(a[3],a[4],a[5],a[6])),f._a=g,f}function P(a,c){var d,e,g=[];!c&&h&&(c=require("./lang/"+a));for(d=0;d<i.length;d++)c[i[d]]=c[i[d]]||f.en[i[d]];for(d=0;d<12;d++)e=b([2e3,d]),g[d]=new RegExp("^"+(c.months[d]||c.months(e,""))+"|^"+(c.monthsShort[d]||c.monthsShort(e,"")).replace(".",""),"i");return c.monthsParse=c.monthsParse||g,f[a]=c,c}function Q(a){var c=typeof a=="string"&&a||a&&a._lang||null;return c?f[c]||P(c):b}function R(a){return a.match(/\[.*\]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function S(a){var b=a.match(k),c,d;for(c=0,d=b.length;c<d;c++)D[b[c]]?b[c]=D[b[c]]:b[c]=R(b[c]);return function(e){var f="";for(c=0;c<d;c++)f+=typeof b[c].call=="function"?b[c].call(e,a):b[c];return f}}function T(a,b){function d(b){return a.lang().longDateFormat[b]||b}var c=5;while(c--&&l.test(b))b=b.replace(l,d);return A[b]||(A[b]=S(b)),A[b](a)}function U(a){switch(a){case"DDDD":return p;case"YYYY":return q;case"S":case"SS":case"SSS":case"DDD":return o;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":case"a":case"A":return r;case"Z":case"ZZ":return s;case"T":return t;case"MM":case"DD":case"YY":case"HH":case"hh":case"mm":case"ss":case"M":case"D":case"d":case"H":case"h":case"m":case"s":return n;default:return new RegExp(a.replace("\\",""))}}function V(a,b,c,d){var e,f;switch(a){case"M":case"MM":c[1]=b==null?0:~~b-1;break;case"MMM":case"MMMM":for(e=0;e<12;e++)if(Q().monthsParse[e].test(b)){c[1]=e,f=!0;break}f||(c[8]=!1);break;case"D":case"DD":case"DDD":case"DDDD":b!=null&&(c[2]=~~b);break;case"YY":c[0]=~~b+(~~b>70?1900:2e3);break;case"YYYY":c[0]=~~Math.abs(b);break;case"a":case"A":d.isPm=(b+"").toLowerCase()==="pm";break;case"H":case"HH":case"h":case"hh":c[3]=~~b;break;case"m":case"mm":c[4]=~~b;break;case"s":case"ss":c[5]=~~b;break;case"S":case"SS":case"SSS":c[6]=~~(("0."+b)*1e3);break;case"Z":case"ZZ":d.isUTC=!0,e=(b+"").match(x),e&&e[1]&&(d.tzh=~~e[1]),e&&e[2]&&(d.tzm=~~e[2]),e&&e[0]==="+"&&(d.tzh=-d.tzh,d.tzm=-d.tzm)}b==null&&(c[8]=!1)}function W(a,b){var c=[0,0,1,0,0,0,0],d={tzh:0,tzm:0},e=b.match(k),f,g;for(f=0;f<e.length;f++)g=(U(e[f]).exec(a)||[])[0],g&&(a=a.slice(a.indexOf(g)+g.length)),D[e[f]]&&V(e[f],g,c,d);return d.isPm&&c[3]<12&&(c[3]+=12),d.isPm===!1&&c[3]===12&&(c[3]=0),O(c,d.isUTC,d.tzh,d.tzm)}function X(a,b){var c,d=a.match(m)||[],e,f=99,g,h,i;for(g=0;g<b.length;g++)h=W(a,b[g]),e=T(new H(h),b[g]).match(m)||[],i=N(d,e),i<f&&(f=i,c=h);return c}function Y(a){var b="YYYY-MM-DDT",c;if(u.exec(a)){for(c=0;c<4;c++)if(w[c][1].exec(a)){b+=w[c][0];break}return s.exec(a)?W(a,b+" Z"):W(a,b)}return new Date(a)}function Z(a,b,c,d,e){var f=e.relativeTime[a];return typeof f=="function"?f(b||1,!!c,a,d):f.replace(/%d/i,b||1)}function $(a,b,c){var e=d(Math.abs(a)/1e3),f=d(e/60),g=d(f/60),h=d(g/24),i=d(h/365),j=e<45&&["s",e]||f===1&&["m"]||f<45&&["mm",f]||g===1&&["h"]||g<22&&["hh",g]||h===1&&["d"]||h<=25&&["dd",h]||h<=45&&["M"]||h<345&&["MM",d(h/30)]||i===1&&["y"]||["yy",i];return j[2]=b,j[3]=a>0,j[4]=c,Z.apply({},j)}function _(a,c){b.fn[a]=function(a){var b=this._isUTC?"UTC":"";return a!=null?(this._d["set"+b+c](a),this):this._d["get"+b+c]()}}function ab(a){b.duration.fn[a]=function(){return this._data[a]}}function bb(a,c){b.duration.fn["as"+a]=function(){return+this/c}}var b,c="1.7.2",d=Math.round,e,f={},g="en",h=typeof module!="undefined"&&module.exports,i="months|monthsShort|weekdays|weekdaysShort|weekdaysMin|longDateFormat|calendar|relativeTime|ordinal|meridiem".split("|"),j=/^\/?Date\((\-?\d+)/i,k=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|zz?|ZZ?|.)/g,l=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?)/g,m=/([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,n=/\d\d?/,o=/\d{1,3}/,p=/\d{3}/,q=/\d{1,4}/,r=/[0-9a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/i,s=/Z|[\+\-]\d\d:?\d\d/i,t=/T/i,u=/^\s*\d{4}-\d\d-\d\d(T(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,v="YYYY-MM-DDTHH:mm:ssZ",w=[["HH:mm:ss.S",/T\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/T\d\d:\d\d:\d\d/],["HH:mm",/T\d\d:\d\d/],["HH",/T\d\d/]],x=/([\+\-]|\d\d)/gi,y="Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"),z={Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6},A={},B="DDD w M D d".split(" "),C="M D H h m s w".split(" "),D={M:function(){return this.month()+1},MMM:function(a){return E("monthsShort",this.month(),this,a)},MMMM:function(a){return E("months",this.month(),this,a)},D:function(){return this.date()},DDD:function(){var a=new Date(this.year(),this.month(),this.date()),b=new Date(this.year(),0,1);return~~((a-b)/864e5+1.5)},d:function(){return this.day()},dd:function(a){return E("weekdaysMin",this.day(),this,a)},ddd:function(a){return E("weekdaysShort",this.day(),this,a)},dddd:function(a){return E("weekdays",this.day(),this,a)},w:function(){var a=new Date(this.year(),this.month(),this.date()-this.day()+5),b=new Date(a.getFullYear(),0,4);return~~((a-b)/864e5/7+1.5)},YY:function(){return K(this.year()%100,2)},YYYY:function(){return K(this.year(),4)},a:function(){return this.lang().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.lang().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return~~(this.milliseconds()/100)},SS:function(){return K(~~(this.milliseconds()/10),2)},SSS:function(){return K(this.milliseconds(),3)},Z:function(){var a=-this.zone(),b="+";return a<0&&(a=-a,b="-"),b+K(~~(a/60),2)+":"+K(~~a%60,2)},ZZ:function(){var a=-this.zone(),b="+";return a<0&&(a=-a,b="-"),b+K(~~(10*a/6),4)}};while(B.length)e=B.pop(),D[e+"o"]=G(D[e]);while(C.length)e=C.pop(),D[e+e]=F(D[e],2);D.DDDD=F(D.DDD,3),b=function(c,d){if(c===null||c==="")return null;var e,f;return b.isMoment(c)?new H(new Date(+c._d),c._isUTC,c._lang):(d?M(d)?e=X(c,d):e=W(c,d):(f=j.exec(c),e=c===a?new Date:f?new Date(+f[1]):c instanceof Date?c:M(c)?O(c):typeof c=="string"?Y(c):new Date(c)),new H(e))},b.utc=function(a,c){return M(a)?new H(O(a,!0),!0):(typeof a=="string"&&!s.exec(a)&&(a+=" +0000",c&&(c+=" Z")),b(a,c).utc())},b.unix=function(a){return b(a*1e3)},b.duration=function(a,c){var d=b.isDuration(a),e=typeof a=="number",f=d?a._data:e?{}:a,g;return e&&(c?f[c]=a:f.milliseconds=a),g=new I(f),d&&(g._lang=a._lang),g},b.humanizeDuration=function(a,c,d){return b.duration(a,c===!0?null:c).humanize(c===!0?!0:d)},b.version=c,b.defaultFormat=v,b.lang=function(a,c){var d;if(!a)return g;(c||!f[a])&&P(a,c);if(f[a]){for(d=0;d<i.length;d++)b[i[d]]=f[a][i[d]];b.monthsParse=f[a].monthsParse,g=a}},b.langData=Q,b.isMoment=function(a){return a instanceof H},b.isDuration=function(a){return a instanceof I},b.lang("en",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},meridiem:function(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinal:function(a){var b=a%10;return~~(a%100/10)===1?"th":b===1?"st":b===2?"nd":b===3?"rd":"th"}}),b.fn=H.prototype={clone:function(){return b(this)},valueOf:function(){return+this._d},unix:function(){return Math.floor(+this._d/1e3)},toString:function(){return this._d.toString()},toDate:function(){return this._d},toArray:function(){var a=this;return[a.year(),a.month(),a.date(),a.hours(),a.minutes(),a.seconds(),a.milliseconds(),!!this._isUTC]},isValid:function(){return this._a?this._a[8]!=null?!!this._a[8]:!N(this._a,(this._a[7]?b.utc(this._a):b(this._a)).toArray()):!isNaN(this._d.getTime())},utc:function(){return this._isUTC=!0,this},local:function(){return this._isUTC=!1,this},format:function(a){return T(this,a?a:b.defaultFormat)},add:function(a,c){var d=c?b.duration(+c,a):b.duration(a);return L(this,d,1),this},subtract:function(a,c){var d=c?b.duration(+c,a):b.duration(a);return L(this,d,-1),this},diff:function(a,c,e){var f=this._isUTC?b(a).utc():b(a).local(),g=(this.zone()-f.zone())*6e4,h=this._d-f._d-g,i=this.year()-f.year(),j=this.month()-f.month(),k=this.date()-f.date(),l;return c==="months"?l=i*12+j+k/30:c==="years"?l=i+(j+k/30)/12:l=c==="seconds"?h/1e3:c==="minutes"?h/6e4:c==="hours"?h/36e5:c==="days"?h/864e5:c==="weeks"?h/6048e5:h,e?l:d(l)},from:function(a,c){return b.duration(this.diff(a)).lang(this._lang).humanize(!c)},fromNow:function(a){return this.from(b(),a)},calendar:function(){var a=this.diff(b().sod(),"days",!0),c=this.lang().calendar,d=c.sameElse,e=a<-6?d:a<-1?c.lastWeek:a<0?c.lastDay:a<1?c.sameDay:a<2?c.nextDay:a<7?c.nextWeek:d;return this.format(typeof e=="function"?e.apply(this):e)},isLeapYear:function(){var a=this.year();return a%4===0&&a%100!==0||a%400===0},isDST:function(){return this.zone()<b([this.year()]).zone()||this.zone()<b([this.year(),5]).zone()},day:function(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return a==null?b:this.add({d:a-b})},startOf:function(a){switch(a.replace(/s$/,"")){case"year":this.month(0);case"month":this.date(1);case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return this},endOf:function(a){return this.startOf(a).add(a.replace(/s?$/,"s"),1).subtract("ms",1)},sod:function(){return this.clone().startOf("day")},eod:function(){return this.clone().endOf("day")},zone:function(){return this._isUTC?0:this._d.getTimezoneOffset()},daysInMonth:function(){return b.utc([this.year(),this.month()+1,0]).date()},lang:function(b){return b===a?Q(this):(this._lang=b,this)}};for(e=0;e<y.length;e++)_(y[e].toLowerCase(),y[e]);_("year","FullYear"),b.duration.fn=I.prototype={weeks:function(){return J(this.days()/7)},valueOf:function(){return this._milliseconds+this._days*864e5+this._months*2592e6},humanize:function(a){var b=+this,c=this.lang().relativeTime,d=$(b,!a,this.lang()),e=b<=0?c.past:c.future;return a&&(typeof e=="function"?d=e(d):d=e.replace(/%s/i,d)),d},lang:b.fn.lang};for(e in z)z.hasOwnProperty(e)&&(bb(e,z[e]),ab(e.toLowerCase()));bb("Weeks",6048e5),h&&(module.exports=b),typeof ender=="undefined"&&(this.moment=b),typeof define=="function"&&define.amd&&define("moment",[],function(){return b})}).call(this);/**
 * jStat - JavaScript Statistical Library
 * Copyright (c) 2011
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php */this.j$=this.jStat=function(a,b){function j(){return new j.fn.init(arguments)}var c=Array.prototype.slice,d=Object.prototype.toString,e=function(b,c){var d=b>c?b:c;return a.pow(10,17-~~(a.log(d>0?d:-d)*a.LOG10E))},f=Array.isArray||function(a){return d.call(a)==="[object Array]"},g=function(a){return d.call(a)==="[object Function]"},h=function(a){return d.call(a)==="[object Number]"&&!isNaN(a)},i=function(a){return[].concat.apply([],a)};return j.fn=j.prototype={constructor:j,init:function(a){var b=0;if(f(a[0]))if(f(a[0][0])){g(a[1])&&(a[0]=j.map(a[0],a[1]));for(;b<a[0].length;b++)this[b]=a[0][b];this.length=a[0].length}else this[0]=g(a[1])?j.map(a[0],a[1]):a[0],this.length=1;else if(h(a[0]))this[0]=j.seq.apply(null,a),this.length=1;else{if(a[0]instanceof j)return j(a[0].toArray());this[0]=[],this.length=1}return this},length:0,toArray:function(){return this.length>1?c.call(this):c.call(this)[0]},push:[].push,sort:[].sort,splice:[].splice,slice:[].slice},j.fn.init.prototype=j.fn,j.utils={calcRdx:e,isArray:f,isFunction:g,isNumber:h,toVector:i},j.extend=function(a){var b=c.call(arguments),d=1,e;if(b.length===1){for(e in a)j[e]=a[e];return this}for(;d<b.length;d++)for(e in b[d])a[e]=b[d][e];return a},j.extend({rows:function(a){return a.length||1},cols:function(a){return a[0].length||1},dimensions:function(a){return{rows:j.rows(a),cols:j.cols(a)}},row:function(a,b){return a[b]},col:function(a,b){var c=new Array(a.length),d=0;for(;d<a.length;d++)c[d]=[a[d][b]];return c},diag:function(a){var b=0,c=j.rows(a),d=new Array(c);for(;b<c;b++)d[b]=[a[b][b]];return d},antidiag:function(a){var b=j.rows(a)-1,c=new Array(b),d=0;for(;b>=0;b--,d++)c[d]=[a[d][b]];return c},transpose:function(a){var b=[],c=0,d,e,g;f(a[0])||(a=[a]),d=a.length,e=a[0].length;for(;c<e;c++){b.push(new Array(d));for(g=0;g<d;g++)b[c][g]=a[g][c]}return b.length===1?b[0]:b},map:function(a,b,c){var d=0,e,g,h,i;f(a[0])||(a=[a]),e=a.length,g=a[0].length,h=c?a:new Array(e);for(;d<e;d++){h[d]||(h[d]=new Array(g));for(i=0;i<g;i++)h[d][i]=b(a[d][i],d,i)}return h.length===1?h[0]:h},alter:function(a,b){return j.map(a,b,!0)},create:function(a,b,c){var d=new Array(a),e,f;g(b)&&(c=b,b=a);for(e=0;e<a;e++){d[e]=new Array(b);for(f=0;f<b;f++)d[e][f]=c(e,f)}return d},zeros:function(a,b){return h(b)||(b=a),j.create(a,b,function(){return 0})},ones:function(a,b){return h(b)||(b=a),j.create(a,b,function(){return 1})},rand:function(b,c){return h(c)||(c=b),j.create(b,c,function(){return a.random()})},identity:function(a,b){return h(b)||(b=a),j.create(a,b,function(a,b){return a===b?1:0})},symmetric:function(a){var b=!0,c=0,d=a.length,e;if(a.length!==a[0].length)return!1;for(;c<d;c++)for(e=0;e<d;e++)if(a[e][c]!==a[c][e])return!1;return!0},clear:function(a){return j.alter(a,function(){return 0})},seq:function(a,b,c,d){g(d)||(d=!1);var f=[],h=e(a,b),i=(b*h-a*h)/((c-1)*h),j=a,k=0;for(;j<=b;k++,j=(a*h+i*h*k)/h)f.push(d?d(j,k):j);return f}}),function(a){for(var b=0;b<a.length;b++)(function(a){j.fn[a]=function(b){var c=this,d;return b?(setTimeout(function(){b.call(c,j.fn[a].call(c))},15),this):(d=j[a](this),f(d)?j(d):d)}})(a[b])}("transpose clear symmetric rows cols dimensions diag antidiag".split(" ")),function(a){for(var b=0;b<a.length;b++)(function(a){j.fn[a]=function(b,c){var d=this;return c?(setTimeout(function(){c.call(d,j.fn[a].call(d,b))},15),this):j(j[a](this,b))}})(a[b])}("row col".split(" ")),function(a){for(var b=0;b<a.length;b++)(function(a){j.fn[a]=function(){return j(j[a].apply(null,arguments))}})(a[b])}("create zeros ones rand identity".split(" ")),j.extend(j.fn,{map:function(a,b){return j(j.map(this,a,b))},alter:function(a){return j.alter(this,a),this}}),j}(Math),function(a,b){var c=a.utils.isFunction,d=function(a,b){return a-b};a.extend({sum:function(a){var b=0,c=a.length,d;while(--c>=0)b+=a[c];return b},sumsqrd:function(a){var b=0,c=a.length;while(--c>=0)b+=a[c]*a[c];return b},sumsqerr:function(b){var c=a.mean(b),d=0,e=b.length,f;while(--e>=0)f=b[e]-c,d+=f*f;return d},product:function(a){var b=1,c=a.length;while(--c>=0)b*=a[c];return b},min:function(a){var b=a[0],c=0;while(++c<a.length)a[c]<b&&(b=a[c]);return b},max:function(a){var b=a[0],c=0;while(++c<a.length)a[c]>b&&(b=a[c]);return b},mean:function(b){return a.sum(b)/b.length},meansqerr:function(b){return a.sumsqerr(b)/b.length},geomean:function(c){return b.pow(a.product(c),1/c.length)},median:function(a){var b=a.length,c=a.slice().sort(d);return b&1?c[b/2|0]:(c[b/2-1]+c[b/2])/2},cumsum:function(a){var b=a.length,c=new Array(b),d=1;c[0]=a[0];for(;d<b;d++)c[d]=c[d-1]+a[d];return c},diff:function(a){var b=[],c=a.length,d=1;for(d=1;d<c;d++)b.push(a[d]-a[d-1]);return b},mode:function(a){var b=a.length,c=a.slice().sort(d),e=1,f=0,g=0,h=0,i=[];for(;h<b;h++)c[h]===c[h+1]?e++:(e>f?(i=[c[h]],f=e,g=0):e===f&&(i.push(c[h]),g++),e=1);return g===0?i[0]:i},range:function(b){return a.max(b)-a.min(b)},variance:function(b,c){return a.sumsqerr(b)/(b.length-(c?1:0))},stdev:function(c,d){return b.sqrt(a.variance(c,d))},meandev:function(c){var d=0,e=a.mean(c),f=c.length-1;for(;f>=0;f--)d+=b.abs(c[f]-e);return d/c.length},meddev:function(c){var d=0,e=a.median(c),f=c.length-1;for(;f>=0;f--)d+=b.abs(c[f]-e);return d/c.length},coeffvar:function(b){return a.stdev(b)/a.mean(b)},quartiles:function(a){var c=a.length,e=a.slice().sort(d);return[e[b.round(c/4)-1],e[b.round(c/2)-1],e[b.round(c*3/4)-1]]},covariance:function(b,c){var d=a.mean(b),e=a.mean(c),f=b.length,g=new Array(f),h=0;for(;h<f;h++)g[h]=(b[h]-d)*(c[h]-e);return a.sum(g)/(f-1)},corrcoeff:function(b,c){return a.covariance(b,c)/a.stdev(b,1)/a.stdev(c,1)}}),function(b){for(var d=0;d<b.length;d++)(function(b){a.fn[b]=function(d,e){var f=[],g=0,h=this;c(d)&&(e=d,d=!1);if(e)return setTimeout(function(){e.call(h,a.fn[b].call(h,d))},15),this;if(this.length>1){h=d===!0?this:this.transpose();for(;g<h.length;g++)f[g]=a[b](h[g]);return d===!0?a[b](a.utils.toVector(f)):f}return a[b](this[0],d)}})(b[d])}("sum sumsqrd sumsqerr product min max mean meansqerr geomean median diff mode range variance stdev meandev meddev coeffvar quartiles".split(" ")),a.fn.cumsum=function(b,d){var e=[],f=0,g=this;c(b)&&(d=b,b=!1);if(d)return setTimeout(function(){d.call(g,a.fn.cumsum.call(g,b))},15),this;if(this.length>1){g=b===!0?this:this.transpose();for(;f<g.length;f++)e[f]=a.cumsum(g[f]);return e}return a.cumsum(this[0],b)}}(this.jStat,Math),function(a,b){a.extend({gammaln:function(a){var c=0,d=[76.18009172947146,-86.50532032941678,24.01409824083091,-1.231739572450155,.001208650973866179,-0.000005395239384953],e=1.000000000190015,f,g,h;h=(g=f=a)+5.5,h-=(f+.5)*b.log(h);for(;c<6;c++)e+=d[c]/++g;return b.log(2.5066282746310007*e/f)-h},gammafn:function(a){var c=[-1.716185138865495,24.76565080557592,-379.80425647094563,629.3311553128184,866.9662027904133,-31451.272968848367,-36144.413418691176,66456.14382024054],d=[-30.8402300119739,315.35062697960416,-1015.1563674902192,-3107.771671572311,22538.11842098015,4755.846277527881,-134659.9598649693,-115132.2596755535],e=!1,f=0,g=0,h=0,i=a,j,k,l,m,n,o;if(i<=0){m=i%1+3.6e-16;if(m)e=(i&1?-1:1)*b.PI/b.sin(b.PI*m),i=1-i;else return Infinity}l=i,i<1?k=i++:k=(i-=f=(i|0)-1)-1;for(j=0;j<8;++j)h=(h+c[j])*k,g=g*k+d[j];m=h/g+1;if(l<i)m/=l;else if(l>i)for(j=0;j<f;++j)m*=i,i++;return e&&(m=e/m),m},gammap:function(c,d){var e=a.gammaln(c),f=c,g=1/c,h=g,i=d+1-c,j=1/1e-30,k=1/i,l=k,m=1,n=-~(b.log(c>=1?c:1/c)*8.5+c*.4+17),o,p;if(d<0||c<=0)return NaN;if(d<c+1){for(;m<=n;m++)g+=h*=d/++f;return g*b.exp(-d+c*b.log(d)-e)}for(;m<=n;m++)o=-m*(m-c),i+=2,k=o*k+i,j=i+o/j,k=1/k,l*=k*j;return 1-l*b.exp(-d+c*b.log(d)-e)},factorialln:function(b){return b<0?NaN:a.gammaln(b+1)},factorial:function(b){return b<0?NaN:a.gammafn(b+1)},combination:function(c,d){return c>170||d>170?b.exp(a.combinationln(c,d)):a.factorial(c)/a.factorial(d)/a.factorial(c-d)},combinationln:function(b,c){return a.factorialln(b)-a.factorialln(c)-a.factorialln(b-c)},permutation:function(b,c){return a.factorial(b)/a.factorial(b-c)},betafn:function(c,d){return c<=0||d<=0?undefined:c+d>170?b.exp(a.betaln(c,d)):a.gammafn(c)*a.gammafn(d)/a.gammafn(c+d)},betaln:function(b,c){return a.gammaln(b)+a.gammaln(c)-a.gammaln(b+c)},betacf:function(a,c,d){var e=1e-30,f=1,g,h,i,j,k,l,m,n,o;m=c+d,o=c+1,n=c-1,i=1,j=1-m*a/o,b.abs(j)<e&&(j=e),j=1/j,l=j;for(;f<=100;f++){g=2*f,h=f*(d-f)*a/((n+g)*(c+g)),j=1+h*j,b.abs(j)<e&&(j=e),i=1+h/i,b.abs(i)<e&&(i=e),j=1/j,l*=j*i,h=-(c+f)*(m+f)*a/((c+g)*(o+g)),j=1+h*j,b.abs(j)<e&&(j=e),i=1+h/i,b.abs(i)<e&&(i=e),j=1/j,k=j*i,l*=k;if(b.abs(k-1)<3e-7)break}return l},gammapinv:function(c,d){var e=0,f=d-1,g=1e-8,h=a.gammaln(d),i,j,k,l,m,n,o;if(c>=1)return b.max(100,d+100*b.sqrt(d));if(c<=0)return 0;d>1?(n=b.log(f),o=b.exp(f*(n-1)-h),m=c<.5?c:1-c,k=b.sqrt(-2*b.log(m)),i=(2.30753+k*.27061)/(1+k*(.99229+k*.04481))-k,c<.5&&(i=-i),i=b.max(.001,d*b.pow(1-1/(9*d)-i/(3*b.sqrt(d)),3))):(k=1-d*(.253+d*.12),c<k?i=b.pow(c/k,1/d):i=1-b.log(1-(c-k)/(1-k)));for(;e<12;e++){if(i<=0)return 0;j=a.gammap(d,i)-c,d>1?k=o*b.exp(-(i-f)+f*(b.log(i)-n)):k=b.exp(-i+f*b.log(i)-h),l=j/k,i-=k=l/(1-.5*b.min(1,l*((d-1)/i-1))),i<=0&&(i=.5*(i+k));if(b.abs(k)<g*i)break}return i},erf:function(a){var c=[-1.3026537197817094,.6419697923564902,.019476473204185836,-0.00956151478680863,-0.000946595344482036,.000366839497852761,42523324806907e-18,-0.000020278578112534,-0.000001624290004647,130365583558e-17,1.5626441722e-8,-8.5238095915e-8,6.529054439e-9,5.059343495e-9,-9.91364156e-10,-2.27365122e-10,9.6467911e-11,2.394038e-12,-6.886027e-12,8.94487e-13,3.13092e-13,-1.12708e-13,3.81e-16,7.106e-15,-1.523e-15,-9.4e-17,1.21e-16,-2.8e-17],d=c.length-1,e=!1,f=0,g=0,h,i,j,k;a<0&&(a=-a,e=!0),h=2/(2+a),i=4*h-2;for(;d>0;d--)j=f,f=i*f-g+c[d],g=j;return k=h*b.exp(-a*a+.5*(c[0]+i*f)-g),e?k-1:1-k},erfc:function(b){return 1-a.erf(b)},erfcinv:function(c){var d=0,e,f,g,h;if(c>=2)return-100;if(c<=0)return 100;h=c<1?c:2-c,g=b.sqrt(-2*b.log(h/2)),e=-0.70711*((2.30753+g*.27061)/(1+g*(.99229+g*.04481))-g);for(;d<2;d++)f=a.erfc(e)-h,e+=f/(1.1283791670955126*b.exp(-e*e)-e*f);return c<1?e:-e},ibetainv:function(c,d,e){var f=1e-8,g=d-1,h=e-1,i=0,j,k,l,m,n,o,p,q,r,s,t;if(c<=0)return 0;if(c>=1)return 1;d>=1&&e>=1?(l=c<.5?c:1-c,m=b.sqrt(-2*b.log(l)),p=(2.30753+m*.27061)/(1+m*(.99229+m*.04481))-m,c<.5&&(p=-p),q=(p*p-3)/6,r=2/(1/(2*d-1)+1/(2*e-1)),s=p*b.sqrt(q+r)/r-(1/(2*e-1)-1/(2*d-1))*(q+5/6-2/(3*r)),p=d/(d+e*b.exp(2*s))):(j=b.log(d/(d+e)),k=b.log(e/(d+e)),m=b.exp(d*j)/d,n=b.exp(e*k)/e,s=m+n,c<m/s?p=b.pow(d*s*c,1/d):p=1-b.pow(e*s*(1-c),1/e)),t=-a.gammaln(d)-a.gammaln(e)+a.gammaln(d+e);for(;i<10;i++){if(p===0||p===1)return p;o=a.ibeta(p,d,e)-c,m=b.exp(g*b.log(p)+h*b.log(1-p)+t),n=o/m,p-=m=n/(1-.5*b.min(1,n*(g/p-h/(1-p)))),p<=0&&(p=.5*(p+m)),p>=1&&(p=.5*(p+m+1));if(b.abs(m)<f*p&&i>0)break}return p},ibeta:function(c,d,e){var f=c===0||c===1?0:b.exp(a.gammaln(d+e)-a.gammaln(d)-a.gammaln(e)+d*b.log(c)+e*b.log(1-c));return c<0||c>1?!1:c<(d+1)/(d+e+2)?f*a.betacf(c,d,e)/d:1-f*a.betacf(1-c,e,d)/e},randn:function(c,d){var e,f,g,h,i,j;d||(d=c);if(c)return a.create(c,d,function(){return a.randn()});do e=b.random(),f=1.7156*(b.random()-.5),g=e-.449871,h=b.abs(f)+.386595,i=g*g+h*(.196*h-.25472*g);while(i>.27597&&(i>.27846||f*f>-4*b.log(e)*e*e));return f/e},randg:function(c,d,e){var f=c,g,h,i,j,k,l;e||(e=d),c||(c=1);if(d)return l=a.zeros(d,e),l.alter(function(){return a.randg(c)}),l;c<1&&(c+=1),g=c-1/3,h=1/b.sqrt(9*g);do{do k=a.randn(),j=1+h*k;while(j<=0);j=j*j*j,i=b.random()}while(i>1-.331*b.pow(k,4)&&b.log(i)>.5*k*k+g*(1-j+b.log(j)));if(c==f)return g*j;do i=b.random();while(i===0);return b.pow(i,1/f)*g*j}}),function(b){for(var c=0;c<b.length;c++)(function(b){a.fn[b]=function(){return a(a.map(this,function(c){return a[b](c)}))}})(b[c])}("gammaln gammafn factorial factorialln".split(" ")),function(b){for(var c=0;c<b.length;c++)(function(b){a.fn[b]=function(){return a(a[b].apply(null,arguments))}})(b[c])}("randn".split(" "))}(this.jStat,Math),function(a,b){(function(b){for(var c=0;c<b.length;c++)(function(b){a[b]=function(a,b,c){return this instanceof arguments.callee?(this._a=a,this._b=b,this._c=c,this):new arguments.callee(a,b,c)},a.fn[b]=function(c,d,e){var f=a[b](c,d,e);return f.data=this,f},a[b].prototype.sample=function(c){var d=this._a,e=this._b,f=this._c;return c?a.alter(c,function(){return a[b].sample(d,e,f)}):a[b].sample(d,e,f)},function(c){for(var d=0;d<c.length;d++)(function(c){a[b].prototype[c]=function(d){var e=this._a,f=this._b,g=this._c;return d||(d=this.data),typeof d!="number"?a.fn.map.call(d,function(d){return a[b][c](d,e,f,g)}):a[b][c](d,e,f,g)}})(c[d])}("pdf cdf inv".split(" ")),function(c){for(var d=0;d<c.length;d++)(function(c){a[b].prototype[c]=function(){return a[b][c](this._a,this._b,this._c)}})(c[d])}("mean median mode variance".split(" "))})(b[c])})("beta centralF cauchy chisquare exponential gamma invgamma kumaraswamy lognormal normal pareto studentt weibull uniform  binomial negbin hypgeom poisson triangular".split(" ")),a.extend(a.beta,{pdf:function(c,d,e){return c>1||c<0?0:b.pow(c,d-1)*b.pow(1-c,e-1)/a.betafn(d,e)},cdf:function(b,c,d){return b>1||b<0?(b>1)*1:a.ibeta(b,c,d)},inv:function(b,c,d){return a.ibetainv(b,c,d)},mean:function(a,b){return a/(a+b)},median:function(a,b){},mode:function(a,c){return a*c/(b.pow(a+c,2)*(a+c+1))},sample:function(b,c){var d=a.randg(b);return d/(d+a.randg(c))},variance:function(a,c){return a*c/(b.pow(a+c,2)*(a+c+1))}}),a.extend(a.centralF,{pdf:function(c,d,e){return c>=0?b.sqrt(b.pow(d*c,d)*b.pow(e,e)/b.pow(d*c+e,d+e))/(c*a.betafn(d/2,e/2)):undefined},cdf:function(b,c,d){return a.ibeta(c*b/(c*b+d),c/2,d/2)},inv:function(b,c,d){return d/(c*(1/a.ibetainv(b,c/2,d/2)-1))},mean:function(a,b){return b>2?b/(b-2):undefined},mode:function(a,b){return a>2?b*(a-2)/(a*(b+2)):undefined},sample:function(b,c){var d=a.randg(b/2)*2,e=a.randg(c/2)*2;return d/b/(e/c)},variance:function(a,b){return b>4?2*b*b*(a+b-2)/(a*(b-2)*(b-2)*(b-4)):undefined}}),a.extend(a.cauchy,{pdf:function(a,c,d){return d/(b.pow(a-c,2)+b.pow(d,2))/b.PI},cdf:function(a,c,d){return b.atan((a-c)/d)/b.PI+.5},inv:function(a,c,d){return c+d*b.tan(b.PI*(a-.5))},median:function(a,b){return a},mode:function(a,b){return a},sample:function(c,d){return a.randn()*b.sqrt(1/(2*a.randg(.5)))*d+c}}),a.extend(a.chisquare,{pdf:function(c,d){return b.exp((d/2-1)*b.log(c)-c/2-d/2*b.log(2)-a.gammaln(d/2))},cdf:function(b,c){return a.gammap(c/2,b/2)},inv:function(b,c){return 2*a.gammapinv(b,.5*c)},mean:function(a){return a},median:function(a){return a*b.pow(1-2/(9*a),3)},mode:function(a){return a-2>0?a-2:0},sample:function(b){return a.randg(b/2)*2},variance:function(a){return 2*a}}),a.extend(a.exponential,{pdf:function(a,c){return a<0?0:c*b.exp(-c*a)},cdf:function(a,c){return a<0?0:1-b.exp(-c*a)},inv:function(a,c){return-b.log(1-a)/c},mean:function(a){return 1/a},median:function(a){return 1/a*b.log(2)},mode:function(a){return 0},sample:function(a){return-1/a*b.log(b.random())},variance:function(a){return b.pow(a,-2)}}),a.extend(a.gamma,{pdf:function(c,d,e){return b.exp((d-1)*b.log(c)-c/e-a.gammaln(d)-d*b.log(e))},cdf:function(b,c,d){return a.gammap(c,b/d)},inv:function(b,c,d){return a.gammapinv(b,c)*d},mean:function(a,b){return a*b},mode:function(a,b){return a>1?(a-1)*b:undefined},sample:function(b,c){return a.randg(b)*c},variance:function(a,b){return a*b*b}}),a.extend(a.invgamma,{pdf:function(c,d,e){return b.exp(-(d+1)*b.log(c)-e/c-a.gammaln(d)+d*b.log(e))},cdf:function(b,c,d){return 1-a.gammap(c,d/b)},inv:function(b,c,d){return d/a.gammapinv(1-b,c)},mean:function(a,b){return a>1?b/(a-1):undefined},mode:function(a,b){return b/(a+1)},sample:function(b,c){return c/a.randg(b)},variance:function(a,b){return a>2?b*b/((a-1)*(a-1)*(a-2)):undefined}}),a.extend(a.kumaraswamy,{pdf:function(a,c,d){return b.exp(b.log(c)+b.log(d)+(c-1)*b.log(a)+(d-1)*b.log(1-b.pow(a,c)))},cdf:function(a,c,d){return 1-b.pow(1-b.pow(a,c),d)},mean:function(b,c){return c*a.gammafn(1+1/b)*a.gammafn(c)/a.gammafn(1+1/b+c)},median:function(a,c){return b.pow(1-b.pow(2,-1/c),1/a)},mode:function(a,c){return a>=1&&c>=1&&a!==1&&c!==1?b.pow((a-1)/(a*c-1),1/a):undefined},variance:function(a,b){}}),a.extend(a.lognormal,{pdf:function(a,c,d){return b.exp(-b.log(a)-.5*b.log(2*b.PI)-b.log(d)-b.pow(b.log(a)-c,2)/(2*d*d))},cdf:function(c,d,e){return.5+.5*a.erf((b.log(c)-d)/b.sqrt(2*e*e))},inv:function(c,d,e){return b.exp(-1.4142135623730951*e*a.erfcinv(2*c)+d)},mean:function(a,c){return b.exp(a+c*c/2)},median:function(a,c){return b.exp(a)},mode:function(a,c){return b.exp(a-c*c)},sample:function(c,d){return b.exp(a.randn()*d+c)},variance:function(a,c){return(b.exp(c*c)-1)*b.exp(2*a+c*c)}}),a.extend(a.normal,{pdf:function(a,c,d){return b.exp(-0.5*b.log(2*b.PI)-b.log(d)-b.pow(a-c,2)/(2*d*d))},cdf:function(c,d,e){return.5*(1+a.erf((c-d)/b.sqrt(2*e*e)))},inv:function(b,c,d){return-1.4142135623730951*d*a.erfcinv(2*b)+c},mean:function(a,b){return a},median:function(a,b){return a},mode:function(a,b){return a},sample:function(b,c){return a.randn()*c+b},variance:function(a,b){return b*b}}),a.extend(a.pareto,{pdf:function(a,c,d){return a>c?d*b.pow(c,d)/b.pow(a,d+1):undefined},cdf:function(a,c,d){return 1-b.pow(c/a,d)},mean:function(a,c){return c>1?c*b.pow(a,c)/(c-1):undefined},median:function(a,c){return a*c*b.SQRT2},mode:function(a,b){return a},variance:function(a,c){return c>2?a*a*c/(b.pow(c-1,2)*(c-2)):undefined}}),a.extend(a.studentt,{pdf:function(c,d){return a.gammafn((d+1)/2)/(b.sqrt(d*b.PI)*a.gammafn(d/2))*b.pow(1+c*c/d,-((d+1)/2))},cdf:function(c,d){var e=d/2;return a.ibeta((c+b.sqrt(c*c+d))/(2*b.sqrt(c*c+d)),e,e)},inv:function(c,d){var e=a.ibetainv(2*b.min(c,1-c),.5*d,.5);return e=b.sqrt(d*(1-e)/e),c>0?e:-e},mean:function(a){return a>1?0:undefined},median:function(a){return 0},mode:function(a){return 0},sample:function(c){return a.randn()*b.sqrt(c/(2*a.randg(c/2)))},variance:function(a){return a>2?a/(a-2):a>1?Infinity:undefined}}),a.extend(a.weibull,{pdf:function(a,c,d){return a<0?0:d/c*b.pow(a/c,d-1)*b.exp(-b.pow(a/c,d))},cdf:function(a,c,d){return a<0?0:1-b.exp(-b.pow(a/c,d))},inv:function(a,c,d){return c*b.pow(-b.log(1-a),1/d)},mean:function(b,c){return b*a.gammafn(1+1/c)},median:function(a,c){return a*b.pow(b.log(2),1/c)},mode:function(a,c){return c>1?a*b.pow((c-1)/c,1/c):undefined},sample:function(a,c){return a*b.pow(-b.log(b.random()),1/c)},variance:function(c,d){return c*c*a.gammafn(1+2/d)-b.pow(this.mean(c,d),2)}}),a.extend(a.uniform,{pdf:function(a,b,c){return a<b||a>c?0:1/(c-b)},cdf:function(a,b,c){return a<b?0:a<c?(a-b)/(c-b):1},mean:function(a,b){return.5*(a+b)},median:function(b,c){return a.mean(b,c)},mode:function(a,b){},sample:function(a,c){return a/2+c/2+(c/2-a/2)*(2*b.random()-1)},variance:function(a,c){return b.pow(c-a,2)/12}}),a.extend(a.binomial,{pdf:function(c,d,e){return e===0||e===1?d*e===c?1:0:a.combination(d,c)*b.pow(e,c)*b.pow(1-e,d-c)},cdf:function(b,c,d){var e=[],f=0;if(b<0)return 0;if(b<c){for(;f<=b;f++)e[f]=a.binomial.pdf(f,c,d);return a.sum(e)}return 1}}),a.extend(a.negbin,{pdf:function(c,d,e){return c!==c|0?!1:c<0?0:a.combination(c+d-1,c)*b.pow(1-e,d)*b.pow(e,c)},cdf:function(b,c,d){var e=0,f=0;if(b<0)return 0;for(;f<=b;f++)e+=a.negbin.pdf(f,c,d);return e}}),a.extend(a.hypgeom,{pdf:function(b,c,d,e){return b!==b|0?!1:b<0?0:a.combination(d,b)*a.combination(c-d,e-b)/a.combination(c,e)},cdf:function(b,c,d,e){var f=0,g=0;if(b<0)return 0;for(;g<=b;g++)f+=a.hypgeom.pdf(g,c,d,e);return f}}),a.extend(a.poisson,{pdf:function(c,d){return b.pow(d,c)*b.exp(-d)/a.factorial(c)},cdf:function(b,c){var d=[],e=0;if(b<0)return 0;for(;e<=b;e++)d.push(a.poisson.pdf(e,c));return a.sum(d)},mean:function(a){return a},variance:function(a){return a},sample:function(a){var c=1,d=0,e=b.exp(-a);do d++,c*=b.random();while(c>e);return d-1}}),a.extend(a.triangular,{pdf:function(a,b,c,d){return c<=b||d<b||d>c?undefined:a<b||a>c?0:a<=d?2*(a-b)/((c-b)*(d-b)):2*(c-a)/((c-b)*(c-d))},cdf:function(a,c,d,e){return d<=c||e<c||e>d?undefined:a<c?0:a<=e?b.pow(a-c,2)/((d-c)*(e-c)):1-b.pow(d-a,2)/((d-c)*(d-e))},mean:function(a,b,c){return(a+b+c)/3},median:function(a,c,d){if(d<=(a+c)/2)return c-b.sqrt((c-a)*(c-d))/b.sqrt(2);if(d>(a+c)/2)return a+b.sqrt((c-a)*(d-a))/b.sqrt(2)},mode:function(a,b,c){return c},sample:function(a,c,d){var e=b.random();return e<(d-a)/(c-a)?a+b.sqrt(e*(c-a)*(d-a)):c-b.sqrt((1-e)*(c-a)*(c-d))},variance:function(a,b,c){return(a*a+b*b+c*c-a*b-a*c-b*c)/18}})}(this.jStat,Math),function(a,b){var d=Array.prototype.push,e=a.utils.isArray;a.extend({add:function(b,c){return e(c)?(e(c[0])||(c=[c]),a.map(b,function(a,b,d){return a+c[b][d]})):a.map(b,function(a){return a+c})},subtract:function(b,c){return e(c)?(e(c[0])||(c=[c]),a.map(b,function(a,b,d){return a-c[b][d]||0})):a.map(b,function(a){return a-c})},divide:function(b,c){return e(c)?(e(c[0])||(c=[c]),a.multiply(b,a.inv(c))):a.map(b,function(a){return a/c})},multiply:function(b,c){var d,f,g,h,i=b.length,j=b[0].length,k=a.zeros(i,g=e(c)?c[0].length:j),l=0;if(e(c)){for(;l<g;l++)for(d=0;d<i;d++){h=0;for(f=0;f<j;f++)h+=b[d][f]*c[f][l];k[d][l]=h}return i===1&&l===1?k[0][0]:k}return a.map(b,function(a){return a*c})},dot:function(b,c){e(b[0])||(b=[b]),e(c[0])||(c=[c]);var d=b[0].length===1&&b.length!==1?a.transpose(b):b,f=c[0].length===1&&c.length!==1?a.transpose(c):c,g=[],h=0,i=d.length,j=d[0].length,k,l;for(;h<i;h++){g[h]=[],k=0;for(l=0;l<j;l++)k+=d[h][l]*f[h][l];g[h]=k}return g.length===1?g[0]:g},pow:function(c,d){return a.map(c,function(a){return b.pow(a,d)})},abs:function(c){return a.map(c,function(a){return b.abs(a)})},norm:function(a,c){var d=0,f=0;isNaN(c)&&(c=2),e(a[0])&&(a=a[0]);for(;f<a.length;f++)d+=b.pow(b.abs(a[f]),c);return b.pow(d,1/c)},angle:function(c,d){return b.acos(a.dot(c,d)/(a.norm(c)*a.norm(d)))},aug:function(a,b){var c=a.slice(),e=0;for(;e<c.length;e++)d.apply(c[e],b[e]);return c},inv:function(b){var c=b.length,d=b[0].length,e=a.identity(c,d),f=a.gauss_jordan(b,e),g=[],h=0,i;for(;h<c;h++){g[h]=[];for(i=d-1;i<f[0].length;i++)g[h][i-d]=f[h][i]}return g},det:function(a){var b=a.length,c=b*2,d=new Array(c),e=b-1,f=c-1,g=e-b+1,h=f,i=0,j=0,k;if(b===2)return a[0][0]*a[1][1]-a[0][1]*a[1][0];for(;i<c;i++)d[i]=1;for(i=0;i<b;i++){for(k=0;k<b;k++)d[g<0?g+b:g]*=a[i][k],d[h<b?h+b:h]*=a[i][k],g++,h--;g=--e-b+1,h=--f}for(i=0;i<b;i++)j+=d[i];for(;i<c;i++)j-=d[i];return j},gauss_elimination:function(c,d){var e=0,f=0,g=c.length,h=c[0].length,i=1,j=0,k=[],l,m,n,o;c=a.aug(c,d),l=c[0].length;for(;e<g;e++){m=c[e][e],f=e;for(o=e+1;o<h;o++)m<b.abs(c[o][e])&&(m=c[o][e],f=o);if(f!=e)for(o=0;o<l;o++)n=c[e][o],c[e][o]=c[f][o],c[f][o]=n;for(f=e+1;f<g;f++){i=c[f][e]/c[e][e];for(o=e;o<l;o++)c[f][o]=c[f][o]-i*c[e][o]}}for(e=g-1;e>=0;e--){j=0;for(f=e+1;f<=g-1;f++)j=k[f]*c[e][f];k[e]=(c[e][l-1]-j)/c[e][e]}return k},gauss_jordan:function(d,e){var f=a.aug(d,e),g=f.length,h=f[0].length;for(var i=0;i<g;i++){var j=i;for(var k=i+1;k<g;k++)b.abs(f[k][i])>b.abs(f[j][i])&&(j=k);var l=f[i];f[i]=f[j],f[j]=l;for(var k=i+1;k<g;k++){c=f[k][i]/f[i][i];for(var m=i;m<h;m++)f[k][m]-=f[i][m]*c}}for(var i=g-1;i>=0;i--){c=f[i][i];for(var k=0;k<i;k++)for(var m=h-1;m>i-1;m--)f[k][m]-=f[i][m]*f[k][i]/c;f[i][i]/=c;for(var m=g;m<h;m++)f[i][m]/=c}return f},lu:function(a,b){},cholesky:function(a,b){},gauss_jacobi:function(c,d,e,f){var g=0,h=0,i=c.length,j=[],k=[],l=[],m,n,o,p;for(;g<i;g++){j[g]=[],k[g]=[],l[g]=[];for(h=0;h<i;h++)g>h?(j[g][h]=c[g][h],k[g][h]=l[g][h]=0):g<h?(k[g][h]=c[g][h],j[g][h]=l[g][h]=0):(l[g][h]=c[g][h],j[g][h]=k[g][h]=0)}o=a.multiply(a.multiply(a.inv(l),a.add(j,k)),-1),n=a.multiply(a.inv(l),d),m=e,p=a.add(a.multiply(o,e),n),g=2;while(b.abs(a.norm(a.subtract(p,m)))>f)m=p,p=a.add(a.multiply(o,m),n),g++;return p},gauss_seidel:function(c,d,e,f){var g=0,h=c.length,i=[],j=[],k=[],l,m,n,o,p;for(;g<h;g++){i[g]=[],j[g]=[],k[g]=[];for(l=0;l<h;l++)g>l?(i[g][l]=c[g][l],j[g][l]=k[g][l]=0):g<l?(j[g][l]=c[g][l],i[g][l]=k[g][l]=0):(k[g][l]=c[g][l],i[g][l]=j[g][l]=0)}o=a.multiply(a.multiply(a.inv(a.add(k,i)),j),-1),n=a.multiply(a.inv(a.add(k,i)),d),m=e,p=a.add(a.multiply(o,e),n),g=2;while(b.abs(a.norm(a.subtract(p,m)))>f)m=p,p=a.add(a.multiply(o,m),n),g+=1;return p},SOR:function(c,d,e,f,g){var h=0,i=c.length,j=[],k=[],l=[],m,n,o,p,q;for(;h<i;h++){j[h]=[],k[h]=[],l[h]=[];for(m=0;m<i;m++)h>m?(j[h][m]=c[h][m],k[h][m]=l[h][m]=0):h<m?(k[h][m]=c[h][m],j[h][m]=l[h][m]=0):(l[h][m]=c[h][m],j[h][m]=k[h][m]=0)}p=a.multiply(a.inv(a.add(l,a.multiply(j,g))),a.subtract(a.multiply(l,1-g),a.multiply(k,g))),o=a.multiply(a.multiply(a.inv(a.add(l,a.multiply(j,g))),d),g),n=e,q=a.add(a.multiply(p,e),o),h=2;while(b.abs(a.norm(a.subtract(q,n)))>f)n=q,q=a.add(a.multiply(p,n),o),h++;return q},householder:function(c){var d=c.length,e=c[0].length,f=0,g=[],h=[],i,j,k,l,m;for(;f<d-1;f++){i=0;for(l=f+1;l<e;l++)i+=c[l][f]*c[l][f];m=c[f+1][f]>0?-1:1,i=m*b.sqrt(i),j=b.sqrt((i*i-c[f+1][f]*i)/2),g=a.zeros(d,1),g[f+1][0]=(c[f+1][f]-i)/(2*j);for(k=f+2;k<d;k++)g[k][0]=c[k][f]/(2*j);h=a.subtract(a.identity(d,e),a.multiply(a.multiply(g,a.transpose(g)),2)),c=a.multiply(h,a.multiply(c,h))}return c},QR:function(c,d){var e=c.length,f=c[0].length,g=0,h=[],i=[],j=[],k,l,m,n,o,p;for(;g<e-1;g++){l=0;for(k=g+1;k<f;k++)l+=c[k][g]*c[k][g];o=c[g+1][g]>0?-1:1,l=o*b.sqrt(l),m=b.sqrt((l*l-c[g+1][g]*l)/2),h=a.zeros(e,1),h[g+1][0]=(c[g+1][g]-l)/(2*m);for(n=g+2;n<e;n++)h[n][0]=c[n][g]/(2*m);i=a.subtract(a.identity(e,f),a.multiply(a.multiply(h,a.transpose(h)),2)),c=a.multiply(i,c),d=a.multiply(i,d)}for(g=e-1;g>=0;g--){p=0;for(k=g+1;k<=f-1;k++)p=j[k]*c[g][k];j[g]=d[g][0]/c[g][g]}return j},jacobi:function(c){var d=1,e=0,f=c.length,g=a.identity(f,f),h=[],i,j,k,l,m,n,o,p;while(d===1){e++,n=c[0][1],l=0,m=1;for(j=0;j<f;j++)for(k=0;k<f;k++)j!=k&&n<b.abs(c[j][k])&&(n=b.abs(c[j][k]),l=j,m=k);c[l][l]===c[m][m]?o=c[l][m]>0?b.PI/4:-b.PI/4:o=b.atan(2*c[l][m]/(c[l][l]-c[m][m]))/2,p=a.identity(f,f),p[l][l]=b.cos(o),p[l][m]=-b.sin(o),p[m][l]=b.sin(o),p[m][m]=b.cos(o),g=a.multiply(g,p),i=a.multiply(a.multiply(a.inv(p),c),p),c=i,d=0;for(j=1;j<f;j++)for(k=1;k<f;k++)j!=k&&b.abs(c[j][k])>.001&&(d=1)}for(j=0;j<f;j++)h.push(c[j][j]);return[g,h]},rungekutta:function(a,b,c,d,e,f){var g,h,i,j,k;if(f===2)while(d<=c)g=b*a(d,e),h=b*a(d+b,e+g),i=e+(g+h)/2,e=i,d+=b;if(f===4)while(d<=c)g=b*a(d,e),h=b*a(d+b/2,e+g/2),j=b*a(d+b/2,e+h/2),k=b*a(d+b,e+j),i=e+(g+2*h+2*j+k)/6,e=i,d+=b;return e},romberg:function(a,c,d,e){var f=0,g=(d-c)/2,h=[],i=[],j=[],k,l,m,n,o,p;while(f<e/2){o=a(c);for(m=c,n=0;m<=d;m+=g,n++)h[n]=m;k=h.length;for(m=1;m<k-1;m++)o+=(m%2!==0?4:2)*a(h[m]);o=g/3*(o+a(d)),j[f]=o,g/=2,f++}l=j.length,k=1;while(l!==1){for(m=0;m<l-1;m++)i[m]=(b.pow(4,k)*j[m+1]-j[m])/(b.pow(4,k)-1);l=i.length,j=i,i=[],k++}return j},richardson:function(a,c,d,e){function f(a,b){var c=0,d=a.length,e;for(;c<d;c++)a[c]===b&&(e=c);return e}var g=a.length,h=b.abs(d-a[f(a,d)+1]),i=0,j=[],k=[],l,m,n,o,p;while(e>=h)l=f(a,d+e),m=f(a,d),j[i]=(c[l]-2*c[m]+c[2*m-l])/(e*e),e/=2,i++;o=j.length,n=1;while(o!=1){for(p=0;p<o-1;p++)k[p]=(b.pow(4,n)*j[p+1]-j[p])/(b.pow(4,n)-1);o=k.length,j=k,k=[],n++}return j},simpson:function(a,b,c,d){var e=(c-b)/d,f=a(b),g=[],h=b,i=0,j=1,k;for(;h<=c;h+=e,i++)g[i]=h;k=g.length;for(;j<k-1;j++)f+=(j%2!==0?4:2)*a(g[j]);return e/3*(f+a(c))},hermite:function(a,b,c,d){var e=a.length,f=0,g=0,h=[],i=[],j=[],k=[],l;for(;g<e;g++){h[g]=1;for(l=0;l<e;l++)g!=l&&(h[g]*=(d-a[l])/(a[g]-a[l]));i[g]=0;for(l=0;l<e;l++)g!=l&&(i[g]+=1/(a[g]-a[l]));j[g]=(1-2*(d-a[g])*i[g])*h[g]*h[g],k[g]=(d-a[g])*h[g]*h[g],f+=j[g]*b[g]+k[g]*c[g]}return f},lagrange:function(a,b,c){var d=0,e=0,f,g,h=a.length;for(;e<h;e++){g=b[e];for(f=0;f<h;f++)e!=f&&(g*=(c-a[f])/(a[e]-a[f]));d+=g}return d},cubic_spline:function(b,c,d){var e=b.length,f=0,g,h=[],i=[],j=[],k=[],l=[],m=[],n=[];for(;f<e-1;f++)l[f]=b[f+1]-b[f];j[0]=0;for(f=1;f<e-1;f++)j[f]=3/l[f]*(c[f+1]-c[f])-3/l[f-1]*(c[f]-c[f-1]);for(f=1;f<e-1;f++)h[f]=[],i[f]=[],h[f][f-1]=l[f-1],h[f][f]=2*(l[f-1]+l[f]),h[f][f+1]=l[f],i[f][0]=j[f];k=a.multiply(a.inv(h),i);for(g=0;g<e-1;g++)m[g]=(c[g+1]-c[g])/l[g]-l[g]*(k[g+1][0]+2*k[g][0])/3,n[g]=(k[g+1][0]-k[g][0])/(3*l[g]);for(g=0;g<e;g++)if(b[g]>d)break;return g-=1,c[g]+(d-b[g])*m[g]+a.sq(d-b[g])*k[g]+(d-b[g])*a.sq(d-b[g])*n[g]},gauss_quadrature:function(){},PCA:function(b){var c=b.length,d=b[0].length,e=!1,f=0,g,h,i=[],j=[],k=[],l=[],m=[],n=[],o=[],p=[],q=[],r=[];for(f=0;f<c;f++)i[f]=a.sum(b[f])/d;for(f=0;f<d;f++){o[f]=[];for(g=0;g<c;g++)o[f][g]=b[g][f]-i[g]}o=a.transpose(o);for(f=0;f<c;f++){p[f]=[];for(g=0;g<c;g++)p[f][g]=a.dot([o[f]],[o[g]])/(d-1)}k=a.jacobi(p),q=k[0],j=k[1],r=a.transpose(q);for(f=0;f<j.length;f++)for(g=f;g<j.length;g++)j[f]<j[g]&&(h=j[f],j[f]=j[g],j[g]=h,l=r[f],r[f]=r[g],r[g]=l);n=a.transpose(o);for(f=0;f<c;f++){m[f]=[];for(g=0;g<n.length;g++)m[f][g]=a.dot([r[f]],[n[g]])}return[b,j,r,m]}}),function(b){for(var c=0;c<b.length;c++)(function(b){a.fn[b]=function(c,d){var e=this;return d?(setTimeout(function(){d.call(e,a.fn[b].call(e,c))},15),this):a(a[b](this,c))}})(b[c])}("add divide multiply subtract dot pow abs norm angle".split(" "))}(this.jStat,Math),function(a,b){var c=[].slice,d=a.utils.isNumber;a.extend({zscore:function(){var b=c.call(arguments);return d(b[1])?(b[0]-b[1])/b[2]:(b[0]-a.mean(b[1]))/a.stdev(b[1],b[2])},ztest:function(){var e=c.call(arguments);if(e.length===4){if(d(e[1])){var f=a.zscore(e[0],e[1],e[2]);return e[3]===1?a.normal.cdf(-b.abs(f),0,1):a.normal.cdf(-b.abs(f),0,1)*2}var f=e[0];return e[2]===1?a.normal.cdf(-b.abs(f),0,1):a.normal.cdf(-b.abs(f),0,1)*2}var f=a.zscore(e[0],e[1],e[3]);return e[1]===1?a.normal.cdf(-b.abs(f),0,1):a.normal.cdf(-b.abs(f),0,1)*2}}),a.extend(a.fn,{zscore:function(a,b){return(a-this.mean())/this.stdev(b)},ztest:function(c,d,e){var f=b.abs(this.zscore(c,e));return d===1?a.normal.cdf(-f,0,1):a.normal.cdf(-f,0,1)*2}}),a.extend({tscore:function(){var d=c.call(arguments);return d.length===4?(d[0]-d[1])/(d[2]/b.sqrt(d[3])):(d[0]-a.mean(d[1]))/(a.stdev(d[1],!0)/b.sqrt(d[1].length))},ttest:function(){var e=c.call(arguments),f;return e.length===5?(f=b.abs(a.tscore(e[0],e[1],e[2],e[3])),e[4]===1?a.studentt.cdf(-f,e[3]-1):a.studentt.cdf(-f,e[3]-1)*2):d(e[1])?(f=b.abs(e[0]),e[2]==1?a.studentt.cdf(-f,e[1]-1):a.studentt.cdf(-f,e[1]-1)*2):(f=b.abs(a.tscore(e[0],e[1])),e[2]==1?a.studentt.cdf(-f,e[1].length-1):a.studentt.cdf(-f,e[1].length-1)*2)}}),a.extend(a.fn,{tscore:function(a){return(a-this.mean())/(this.stdev(!0)/b.sqrt(this.cols()))},ttest:function(c,d){return d===1?1-a.studentt.cdf(b.abs(this.tscore(c)),this.cols()-1):a.studentt.cdf(-b.abs(this.tscore(c)),this.cols()-1)*2}}),a.extend({anovafscore:function(){var d=c.call(arguments),e,f,g,h,i,j,k,l;if(d.length===1){i=new Array(d[0].length);for(k=0;k<d[0].length;k++)i[k]=d[0][k];d=i}if(d.length===2)return a.variance(d[0])/a.variance(d[1]);f=new Array;for(k=0;k<d.length;k++)f=f.concat(d[k]);g=a.mean(f),e=0;for(k=0;k<d.length;k++)e+=d[k].length*b.pow(a.mean(d[k])-g,2);e/=d.length-1,j=0;for(k=0;k<d.length;k++){h=a.mean(d[k]);for(l=0;l<d[k].length;l++)j+=b.pow(d[k][l]-h,2)}return j/=f.length-d.length,e/j},anovaftest:function(){var b=c.call(arguments),e,f,g,h;if(d(b[0]))return 1-a.centralF.cdf(b[0],b[1],b[2]);anovafscore=a.anovafscore(b),e=b.length-1,g=0;for(h=0;h<b.length;h++)g+=b[h].length;return f=g-e-1,1-a.centralF.cdf(anovafscore,e,f)},ftest:function(b,c,d){return 1-a.centralF.cdf(b,c,d)}}),a.extend(a.fn,{anovafscore:function(){return a.anovafscore(this.toArray())},anovaftest:function(){var b=0,c;for(c=0;c<this.length;c++)b+=this[c].length;return a.ftest(this.anovafscore(),this.length-1,b-this.length)}}),a.extend({normalci:function(){var d=c.call(arguments),e=new Array(2),f;return d.length===4?f=b.abs(a.normal.inv(d[1]/2,0,1)*d[2]/b.sqrt(d[3])):f=b.abs(a.normal.inv(d[1]/2,0,1)*a.stdev(d[2])/b.sqrt(d[2].length)),e[0]=d[0]-f,e[1]=d[0]+f,e},tci:function(){var d=c.call(arguments),e=new Array(2),f;return d.length===4?f=b.abs(a.studentt.inv(d[1]/2,d[3]-1)*d[2]/b.sqrt(d[3])):f=b.abs(a.studentt.inv(d[1]/2,d[2].length)*a.stdev(d[2],!0)/b.sqrt(d[2].length)),e[0]=d[0]-f,e[1]=d[0]+f,e},significant:function(a,b){return a<b}}),a.extend(a.fn,{normalci:function(b,c){return a.normalci(b,c,this.toArray())},tci:function(b,c){return a.tci(b,c,this.toArray())}})}(this.jStat,Math);/*! jQuery v1.9.1 | (c) 2005, 2012 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery.min.map
*/(function(e,t){var n,r,i=typeof t,o=e.document,a=e.location,s=e.jQuery,u=e.$,l={},c=[],p="1.9.1",f=c.concat,d=c.push,h=c.slice,g=c.indexOf,m=l.toString,y=l.hasOwnProperty,v=p.trim,b=function(e,t){return new b.fn.init(e,t,r)},x=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,w=/\S+/g,T=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,N=/^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,k=/^[\],:{}\s]*$/,E=/(?:^|:|,)(?:\s*\[)+/g,S=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,A=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,j=/^-ms-/,D=/-([\da-z])/gi,L=function(e,t){return t.toUpperCase()},H=function(e){(o.addEventListener||"load"===e.type||"complete"===o.readyState)&&(q(),b.ready())},q=function(){o.addEventListener?(o.removeEventListener("DOMContentLoaded",H,!1),e.removeEventListener("load",H,!1)):(o.detachEvent("onreadystatechange",H),e.detachEvent("onload",H))};b.fn=b.prototype={jquery:p,constructor:b,init:function(e,n,r){var i,a;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:N.exec(e),!i||!i[1]&&n)return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e);if(i[1]){if(n=n instanceof b?n[0]:n,b.merge(this,b.parseHTML(i[1],n&&n.nodeType?n.ownerDocument||n:o,!0)),C.test(i[1])&&b.isPlainObject(n))for(i in n)b.isFunction(this[i])?this[i](n[i]):this.attr(i,n[i]);return this}if(a=o.getElementById(i[2]),a&&a.parentNode){if(a.id!==i[2])return r.find(e);this.length=1,this[0]=a}return this.context=o,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):b.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),b.makeArray(e,this))},selector:"",length:0,size:function(){return this.length},toArray:function(){return h.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=b.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return b.each(this,e,t)},ready:function(e){return b.ready.promise().done(e),this},slice:function(){return this.pushStack(h.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(b.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:d,sort:[].sort,splice:[].splice},b.fn.init.prototype=b.fn,b.extend=b.fn.extend=function(){var e,n,r,i,o,a,s=arguments[0]||{},u=1,l=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},u=2),"object"==typeof s||b.isFunction(s)||(s={}),l===u&&(s=this,--u);l>u;u++)if(null!=(o=arguments[u]))for(i in o)e=s[i],r=o[i],s!==r&&(c&&r&&(b.isPlainObject(r)||(n=b.isArray(r)))?(n?(n=!1,a=e&&b.isArray(e)?e:[]):a=e&&b.isPlainObject(e)?e:{},s[i]=b.extend(c,a,r)):r!==t&&(s[i]=r));return s},b.extend({noConflict:function(t){return e.$===b&&(e.$=u),t&&e.jQuery===b&&(e.jQuery=s),b},isReady:!1,readyWait:1,holdReady:function(e){e?b.readyWait++:b.ready(!0)},ready:function(e){if(e===!0?!--b.readyWait:!b.isReady){if(!o.body)return setTimeout(b.ready);b.isReady=!0,e!==!0&&--b.readyWait>0||(n.resolveWith(o,[b]),b.fn.trigger&&b(o).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===b.type(e)},isArray:Array.isArray||function(e){return"array"===b.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[m.call(e)]||"object":typeof e},isPlainObject:function(e){if(!e||"object"!==b.type(e)||e.nodeType||b.isWindow(e))return!1;try{if(e.constructor&&!y.call(e,"constructor")&&!y.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(n){return!1}var r;for(r in e);return r===t||y.call(e,r)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||o;var r=C.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=b.buildFragment([e],t,i),i&&b(i).remove(),b.merge([],r.childNodes))},parseJSON:function(n){return e.JSON&&e.JSON.parse?e.JSON.parse(n):null===n?n:"string"==typeof n&&(n=b.trim(n),n&&k.test(n.replace(S,"@").replace(A,"]").replace(E,"")))?Function("return "+n)():(b.error("Invalid JSON: "+n),t)},parseXML:function(n){var r,i;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(o){r=t}return r&&r.documentElement&&!r.getElementsByTagName("parsererror").length||b.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&b.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(j,"ms-").replace(D,L)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,a=M(e);if(n){if(a){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(a){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:v&&!v.call("\ufeff\u00a0")?function(e){return null==e?"":v.call(e)}:function(e){return null==e?"":(e+"").replace(T,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(M(Object(e))?b.merge(n,"string"==typeof e?[e]:e):d.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(g)return g.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,o=0;if("number"==typeof r)for(;r>o;o++)e[i++]=n[o];else while(n[o]!==t)e[i++]=n[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,a=M(e),s=[];if(a)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(s[s.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(s[s.length]=r);return f.apply([],s)},guid:1,proxy:function(e,n){var r,i,o;return"string"==typeof n&&(o=e[n],n=e,e=o),b.isFunction(e)?(r=h.call(arguments,2),i=function(){return e.apply(n||this,r.concat(h.call(arguments)))},i.guid=e.guid=e.guid||b.guid++,i):t},access:function(e,n,r,i,o,a,s){var u=0,l=e.length,c=null==r;if("object"===b.type(r)){o=!0;for(u in r)b.access(e,n,u,r[u],!0,a,s)}else if(i!==t&&(o=!0,b.isFunction(i)||(s=!0),c&&(s?(n.call(e,i),n=null):(c=n,n=function(e,t,n){return c.call(b(e),n)})),n))for(;l>u;u++)n(e[u],r,s?i:i.call(e[u],u,n(e[u],r)));return o?e:c?n.call(e):l?n(e[0],r):a},now:function(){return(new Date).getTime()}}),b.ready.promise=function(t){if(!n)if(n=b.Deferred(),"complete"===o.readyState)setTimeout(b.ready);else if(o.addEventListener)o.addEventListener("DOMContentLoaded",H,!1),e.addEventListener("load",H,!1);else{o.attachEvent("onreadystatechange",H),e.attachEvent("onload",H);var r=!1;try{r=null==e.frameElement&&o.documentElement}catch(i){}r&&r.doScroll&&function a(){if(!b.isReady){try{r.doScroll("left")}catch(e){return setTimeout(a,50)}q(),b.ready()}}()}return n.promise(t)},b.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function M(e){var t=e.length,n=b.type(e);return b.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}r=b(o);var _={};function F(e){var t=_[e]={};return b.each(e.match(w)||[],function(e,n){t[n]=!0}),t}b.Callbacks=function(e){e="string"==typeof e?_[e]||F(e):b.extend({},e);var n,r,i,o,a,s,u=[],l=!e.once&&[],c=function(t){for(r=e.memory&&t,i=!0,a=s||0,s=0,o=u.length,n=!0;u&&o>a;a++)if(u[a].apply(t[0],t[1])===!1&&e.stopOnFalse){r=!1;break}n=!1,u&&(l?l.length&&c(l.shift()):r?u=[]:p.disable())},p={add:function(){if(u){var t=u.length;(function i(t){b.each(t,function(t,n){var r=b.type(n);"function"===r?e.unique&&p.has(n)||u.push(n):n&&n.length&&"string"!==r&&i(n)})})(arguments),n?o=u.length:r&&(s=t,c(r))}return this},remove:function(){return u&&b.each(arguments,function(e,t){var r;while((r=b.inArray(t,u,r))>-1)u.splice(r,1),n&&(o>=r&&o--,a>=r&&a--)}),this},has:function(e){return e?b.inArray(e,u)>-1:!(!u||!u.length)},empty:function(){return u=[],this},disable:function(){return u=l=r=t,this},disabled:function(){return!u},lock:function(){return l=t,r||p.disable(),this},locked:function(){return!l},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],!u||i&&!l||(n?l.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},b.extend({Deferred:function(e){var t=[["resolve","done",b.Callbacks("once memory"),"resolved"],["reject","fail",b.Callbacks("once memory"),"rejected"],["notify","progress",b.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return b.Deferred(function(n){b.each(t,function(t,o){var a=o[0],s=b.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&b.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?b.extend(e,r):r}},i={};return r.pipe=r.then,b.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=h.call(arguments),r=n.length,i=1!==r||e&&b.isFunction(e.promise)?r:0,o=1===i?e:b.Deferred(),a=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?h.call(arguments):r,n===s?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},s,u,l;if(r>1)for(s=Array(r),u=Array(r),l=Array(r);r>t;t++)n[t]&&b.isFunction(n[t].promise)?n[t].promise().done(a(t,l,n)).fail(o.reject).progress(a(t,u,s)):--i;return i||o.resolveWith(l,n),o.promise()}}),b.support=function(){var t,n,r,a,s,u,l,c,p,f,d=o.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*"),r=d.getElementsByTagName("a")[0],!n||!r||!n.length)return{};s=o.createElement("select"),l=s.appendChild(o.createElement("option")),a=d.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t={getSetAttribute:"t"!==d.className,leadingWhitespace:3===d.firstChild.nodeType,tbody:!d.getElementsByTagName("tbody").length,htmlSerialize:!!d.getElementsByTagName("link").length,style:/top/.test(r.getAttribute("style")),hrefNormalized:"/a"===r.getAttribute("href"),opacity:/^0.5/.test(r.style.opacity),cssFloat:!!r.style.cssFloat,checkOn:!!a.value,optSelected:l.selected,enctype:!!o.createElement("form").enctype,html5Clone:"<:nav></:nav>"!==o.createElement("nav").cloneNode(!0).outerHTML,boxModel:"CSS1Compat"===o.compatMode,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},a.checked=!0,t.noCloneChecked=a.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!l.disabled;try{delete d.test}catch(h){t.deleteExpando=!1}a=o.createElement("input"),a.setAttribute("value",""),t.input=""===a.getAttribute("value"),a.value="t",a.setAttribute("type","radio"),t.radioValue="t"===a.value,a.setAttribute("checked","t"),a.setAttribute("name","t"),u=o.createDocumentFragment(),u.appendChild(a),t.appendChecked=a.checked,t.checkClone=u.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;return d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip,b(function(){var n,r,a,s="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",u=o.getElementsByTagName("body")[0];u&&(n=o.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",u.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",a=d.getElementsByTagName("td"),a[0].style.cssText="padding:0;margin:0;border:0;display:none",p=0===a[0].offsetHeight,a[0].style.display="",a[1].style.display="none",t.reliableHiddenOffsets=p&&0===a[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",t.boxSizing=4===d.offsetWidth,t.doesNotIncludeMarginInBodyOffset=1!==u.offsetTop,e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,r=d.appendChild(o.createElement("div")),r.style.cssText=d.style.cssText=s,r.style.marginRight=r.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),typeof d.style.zoom!==i&&(d.innerHTML="",d.style.cssText=s+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(u.style.zoom=1)),u.removeChild(n),n=d=a=r=null)}),n=s=u=l=r=a=null,t}();var O=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,B=/([A-Z])/g;function P(e,n,r,i){if(b.acceptData(e)){var o,a,s=b.expando,u="string"==typeof n,l=e.nodeType,p=l?b.cache:e,f=l?e[s]:e[s]&&s;if(f&&p[f]&&(i||p[f].data)||!u||r!==t)return f||(l?e[s]=f=c.pop()||b.guid++:f=s),p[f]||(p[f]={},l||(p[f].toJSON=b.noop)),("object"==typeof n||"function"==typeof n)&&(i?p[f]=b.extend(p[f],n):p[f].data=b.extend(p[f].data,n)),o=p[f],i||(o.data||(o.data={}),o=o.data),r!==t&&(o[b.camelCase(n)]=r),u?(a=o[n],null==a&&(a=o[b.camelCase(n)])):a=o,a}}function R(e,t,n){if(b.acceptData(e)){var r,i,o,a=e.nodeType,s=a?b.cache:e,u=a?e[b.expando]:b.expando;if(s[u]){if(t&&(o=n?s[u]:s[u].data)){b.isArray(t)?t=t.concat(b.map(t,b.camelCase)):t in o?t=[t]:(t=b.camelCase(t),t=t in o?[t]:t.split(" "));for(r=0,i=t.length;i>r;r++)delete o[t[r]];if(!(n?$:b.isEmptyObject)(o))return}(n||(delete s[u].data,$(s[u])))&&(a?b.cleanData([e],!0):b.support.deleteExpando||s!=s.window?delete s[u]:s[u]=null)}}}b.extend({cache:{},expando:"jQuery"+(p+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(e){return e=e.nodeType?b.cache[e[b.expando]]:e[b.expando],!!e&&!$(e)},data:function(e,t,n){return P(e,t,n)},removeData:function(e,t){return R(e,t)},_data:function(e,t,n){return P(e,t,n,!0)},_removeData:function(e,t){return R(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&b.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),b.fn.extend({data:function(e,n){var r,i,o=this[0],a=0,s=null;if(e===t){if(this.length&&(s=b.data(o),1===o.nodeType&&!b._data(o,"parsedAttrs"))){for(r=o.attributes;r.length>a;a++)i=r[a].name,i.indexOf("data-")||(i=b.camelCase(i.slice(5)),W(o,i,s[i]));b._data(o,"parsedAttrs",!0)}return s}return"object"==typeof e?this.each(function(){b.data(this,e)}):b.access(this,function(n){return n===t?o?W(o,e,b.data(o,e)):null:(this.each(function(){b.data(this,e,n)}),t)},null,n,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){b.removeData(this,e)})}});function W(e,n,r){if(r===t&&1===e.nodeType){var i="data-"+n.replace(B,"-$1").toLowerCase();if(r=e.getAttribute(i),"string"==typeof r){try{r="true"===r?!0:"false"===r?!1:"null"===r?null:+r+""===r?+r:O.test(r)?b.parseJSON(r):r}catch(o){}b.data(e,n,r)}else r=t}return r}function $(e){var t;for(t in e)if(("data"!==t||!b.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}b.extend({queue:function(e,n,r){var i;return e?(n=(n||"fx")+"queue",i=b._data(e,n),r&&(!i||b.isArray(r)?i=b._data(e,n,b.makeArray(r)):i.push(r)),i||[]):t},dequeue:function(e,t){t=t||"fx";var n=b.queue(e,t),r=n.length,i=n.shift(),o=b._queueHooks(e,t),a=function(){b.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),o.cur=i,i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return b._data(e,n)||b._data(e,n,{empty:b.Callbacks("once memory").add(function(){b._removeData(e,t+"queue"),b._removeData(e,n)})})}}),b.fn.extend({queue:function(e,n){var r=2;return"string"!=typeof e&&(n=e,e="fx",r--),r>arguments.length?b.queue(this[0],e):n===t?this:this.each(function(){var t=b.queue(this,e,n);b._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&b.dequeue(this,e)})},dequeue:function(e){return this.each(function(){b.dequeue(this,e)})},delay:function(e,t){return e=b.fx?b.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,o=b.Deferred(),a=this,s=this.length,u=function(){--i||o.resolveWith(a,[a])};"string"!=typeof e&&(n=e,e=t),e=e||"fx";while(s--)r=b._data(a[s],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(u));return u(),o.promise(n)}});var I,z,X=/[\t\r\n]/g,U=/\r/g,V=/^(?:input|select|textarea|button|object)$/i,Y=/^(?:a|area)$/i,J=/^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,G=/^(?:checked|selected)$/i,Q=b.support.getSetAttribute,K=b.support.input;b.fn.extend({attr:function(e,t){return b.access(this,b.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){b.removeAttr(this,e)})},prop:function(e,t){return b.access(this,b.prop,e,t,arguments.length>1)},removeProp:function(e){return e=b.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,u="string"==typeof e&&e;if(b.isFunction(e))return this.each(function(t){b(this).addClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(X," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=b.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,u=0===arguments.length||"string"==typeof e&&e;if(b.isFunction(e))return this.each(function(t){b(this).removeClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(X," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?b.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e,r="boolean"==typeof t;return b.isFunction(e)?this.each(function(n){b(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var o,a=0,s=b(this),u=t,l=e.match(w)||[];while(o=l[a++])u=r?u:!s.hasClass(o),s[u?"addClass":"removeClass"](o)}else(n===i||"boolean"===n)&&(this.className&&b._data(this,"__className__",this.className),this.className=this.className||e===!1?"":b._data(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(X," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,o=this[0];{if(arguments.length)return i=b.isFunction(e),this.each(function(n){var o,a=b(this);1===this.nodeType&&(o=i?e.call(this,n,a.val()):e,null==o?o="":"number"==typeof o?o+="":b.isArray(o)&&(o=b.map(o,function(e){return null==e?"":e+""})),r=b.valHooks[this.type]||b.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,o,"value")!==t||(this.value=o))});if(o)return r=b.valHooks[o.type]||b.valHooks[o.nodeName.toLowerCase()],r&&"get"in r&&(n=r.get(o,"value"))!==t?n:(n=o.value,"string"==typeof n?n.replace(U,""):null==n?"":n)}}}),b.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,u=0>i?s:o?i:0;for(;s>u;u++)if(n=r[u],!(!n.selected&&u!==i||(b.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&b.nodeName(n.parentNode,"optgroup"))){if(t=b(n).val(),o)return t;a.push(t)}return a},set:function(e,t){var n=b.makeArray(t);return b(e).find("option").each(function(){this.selected=b.inArray(b(this).val(),n)>=0}),n.length||(e.selectedIndex=-1),n}}},attr:function(e,n,r){var o,a,s,u=e.nodeType;if(e&&3!==u&&8!==u&&2!==u)return typeof e.getAttribute===i?b.prop(e,n,r):(a=1!==u||!b.isXMLDoc(e),a&&(n=n.toLowerCase(),o=b.attrHooks[n]||(J.test(n)?z:I)),r===t?o&&a&&"get"in o&&null!==(s=o.get(e,n))?s:(typeof e.getAttribute!==i&&(s=e.getAttribute(n)),null==s?t:s):null!==r?o&&a&&"set"in o&&(s=o.set(e,r,n))!==t?s:(e.setAttribute(n,r+""),r):(b.removeAttr(e,n),t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(w);if(o&&1===e.nodeType)while(n=o[i++])r=b.propFix[n]||n,J.test(n)?!Q&&G.test(n)?e[b.camelCase("default-"+n)]=e[r]=!1:e[r]=!1:b.attr(e,n,""),e.removeAttribute(Q?n:r)},attrHooks:{type:{set:function(e,t){if(!b.support.radioValue&&"radio"===t&&b.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(e,n,r){var i,o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return a=1!==s||!b.isXMLDoc(e),a&&(n=b.propFix[n]||n,o=b.propHooks[n]),r!==t?o&&"set"in o&&(i=o.set(e,r,n))!==t?i:e[n]=r:o&&"get"in o&&null!==(i=o.get(e,n))?i:e[n]},propHooks:{tabIndex:{get:function(e){var n=e.getAttributeNode("tabindex");return n&&n.specified?parseInt(n.value,10):V.test(e.nodeName)||Y.test(e.nodeName)&&e.href?0:t}}}}),z={get:function(e,n){var r=b.prop(e,n),i="boolean"==typeof r&&e.getAttribute(n),o="boolean"==typeof r?K&&Q?null!=i:G.test(n)?e[b.camelCase("default-"+n)]:!!i:e.getAttributeNode(n);return o&&o.value!==!1?n.toLowerCase():t},set:function(e,t,n){return t===!1?b.removeAttr(e,n):K&&Q||!G.test(n)?e.setAttribute(!Q&&b.propFix[n]||n,n):e[b.camelCase("default-"+n)]=e[n]=!0,n}},K&&Q||(b.attrHooks.value={get:function(e,n){var r=e.getAttributeNode(n);return b.nodeName(e,"input")?e.defaultValue:r&&r.specified?r.value:t},set:function(e,n,r){return b.nodeName(e,"input")?(e.defaultValue=n,t):I&&I.set(e,n,r)}}),Q||(I=b.valHooks.button={get:function(e,n){var r=e.getAttributeNode(n);return r&&("id"===n||"name"===n||"coords"===n?""!==r.value:r.specified)?r.value:t},set:function(e,n,r){var i=e.getAttributeNode(r);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(r)),i.value=n+="","value"===r||n===e.getAttribute(r)?n:t}},b.attrHooks.contenteditable={get:I.get,set:function(e,t,n){I.set(e,""===t?!1:t,n)}},b.each(["width","height"],function(e,n){b.attrHooks[n]=b.extend(b.attrHooks[n],{set:function(e,r){return""===r?(e.setAttribute(n,"auto"),r):t}})})),b.support.hrefNormalized||(b.each(["href","src","width","height"],function(e,n){b.attrHooks[n]=b.extend(b.attrHooks[n],{get:function(e){var r=e.getAttribute(n,2);return null==r?t:r}})}),b.each(["href","src"],function(e,t){b.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}})),b.support.style||(b.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),b.support.optSelected||(b.propHooks.selected=b.extend(b.propHooks.selected,{get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}})),b.support.enctype||(b.propFix.enctype="encoding"),b.support.checkOn||b.each(["radio","checkbox"],function(){b.valHooks[this]={get:function(e){return null===e.getAttribute("value")?"on":e.value}}}),b.each(["radio","checkbox"],function(){b.valHooks[this]=b.extend(b.valHooks[this],{set:function(e,n){return b.isArray(n)?e.checked=b.inArray(b(e).val(),n)>=0:t}})});var Z=/^(?:input|select|textarea)$/i,et=/^key/,tt=/^(?:mouse|contextmenu)|click/,nt=/^(?:focusinfocus|focusoutblur)$/,rt=/^([^.]*)(?:\.(.+)|)$/;function it(){return!0}function ot(){return!1}b.event={global:{},add:function(e,n,r,o,a){var s,u,l,c,p,f,d,h,g,m,y,v=b._data(e);if(v){r.handler&&(c=r,r=c.handler,a=c.selector),r.guid||(r.guid=b.guid++),(u=v.events)||(u=v.events={}),(f=v.handle)||(f=v.handle=function(e){return typeof b===i||e&&b.event.triggered===e.type?t:b.event.dispatch.apply(f.elem,arguments)},f.elem=e),n=(n||"").match(w)||[""],l=n.length;while(l--)s=rt.exec(n[l])||[],g=y=s[1],m=(s[2]||"").split(".").sort(),p=b.event.special[g]||{},g=(a?p.delegateType:p.bindType)||g,p=b.event.special[g]||{},d=b.extend({type:g,origType:y,data:o,handler:r,guid:r.guid,selector:a,needsContext:a&&b.expr.match.needsContext.test(a),namespace:m.join(".")},c),(h=u[g])||(h=u[g]=[],h.delegateCount=0,p.setup&&p.setup.call(e,o,m,f)!==!1||(e.addEventListener?e.addEventListener(g,f,!1):e.attachEvent&&e.attachEvent("on"+g,f))),p.add&&(p.add.call(e,d),d.handler.guid||(d.handler.guid=r.guid)),a?h.splice(h.delegateCount++,0,d):h.push(d),b.event.global[g]=!0;e=null}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,p,f,d,h,g,m=b.hasData(e)&&b._data(e);if(m&&(c=m.events)){t=(t||"").match(w)||[""],l=t.length;while(l--)if(s=rt.exec(t[l])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){p=b.event.special[d]||{},d=(r?p.delegateType:p.bindType)||d,f=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),u=o=f.length;while(o--)a=f[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(f.splice(o,1),a.selector&&f.delegateCount--,p.remove&&p.remove.call(e,a));u&&!f.length&&(p.teardown&&p.teardown.call(e,h,m.handle)!==!1||b.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)b.event.remove(e,d+t[l],n,r,!0);b.isEmptyObject(c)&&(delete m.handle,b._removeData(e,"events"))}},trigger:function(n,r,i,a){var s,u,l,c,p,f,d,h=[i||o],g=y.call(n,"type")?n.type:n,m=y.call(n,"namespace")?n.namespace.split("."):[];if(l=f=i=i||o,3!==i.nodeType&&8!==i.nodeType&&!nt.test(g+b.event.triggered)&&(g.indexOf(".")>=0&&(m=g.split("."),g=m.shift(),m.sort()),u=0>g.indexOf(":")&&"on"+g,n=n[b.expando]?n:new b.Event(g,"object"==typeof n&&n),n.isTrigger=!0,n.namespace=m.join("."),n.namespace_re=n.namespace?RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=i),r=null==r?[n]:b.makeArray(r,[n]),p=b.event.special[g]||{},a||!p.trigger||p.trigger.apply(i,r)!==!1)){if(!a&&!p.noBubble&&!b.isWindow(i)){for(c=p.delegateType||g,nt.test(c+g)||(l=l.parentNode);l;l=l.parentNode)h.push(l),f=l;f===(i.ownerDocument||o)&&h.push(f.defaultView||f.parentWindow||e)}d=0;while((l=h[d++])&&!n.isPropagationStopped())n.type=d>1?c:p.bindType||g,s=(b._data(l,"events")||{})[n.type]&&b._data(l,"handle"),s&&s.apply(l,r),s=u&&l[u],s&&b.acceptData(l)&&s.apply&&s.apply(l,r)===!1&&n.preventDefault();if(n.type=g,!(a||n.isDefaultPrevented()||p._default&&p._default.apply(i.ownerDocument,r)!==!1||"click"===g&&b.nodeName(i,"a")||!b.acceptData(i)||!u||!i[g]||b.isWindow(i))){f=i[u],f&&(i[u]=null),b.event.triggered=g;try{i[g]()}catch(v){}b.event.triggered=t,f&&(i[u]=f)}return n.result}},dispatch:function(e){e=b.event.fix(e);var n,r,i,o,a,s=[],u=h.call(arguments),l=(b._data(this,"events")||{})[e.type]||[],c=b.event.special[e.type]||{};if(u[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){s=b.event.handlers.call(this,e,l),n=0;while((o=s[n++])&&!e.isPropagationStopped()){e.currentTarget=o.elem,a=0;while((i=o.handlers[a++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,r=((b.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,u),r!==t&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,n){var r,i,o,a,s=[],u=n.delegateCount,l=e.target;if(u&&l.nodeType&&(!e.button||"click"!==e.type))for(;l!=this;l=l.parentNode||this)if(1===l.nodeType&&(l.disabled!==!0||"click"!==e.type)){for(o=[],a=0;u>a;a++)i=n[a],r=i.selector+" ",o[r]===t&&(o[r]=i.needsContext?b(r,this).index(l)>=0:b.find(r,this,null,[l]).length),o[r]&&o.push(i);o.length&&s.push({elem:l,handlers:o})}return n.length>u&&s.push({elem:this,handlers:n.slice(u)}),s},fix:function(e){if(e[b.expando])return e;var t,n,r,i=e.type,a=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=tt.test(i)?this.mouseHooks:et.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new b.Event(a),t=r.length;while(t--)n=r[t],e[n]=a[n];return e.target||(e.target=a.srcElement||o),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,a):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,i,a,s=n.button,u=n.fromElement;return null==e.pageX&&null!=n.clientX&&(i=e.target.ownerDocument||o,a=i.documentElement,r=i.body,e.pageX=n.clientX+(a&&a.scrollLeft||r&&r.scrollLeft||0)-(a&&a.clientLeft||r&&r.clientLeft||0),e.pageY=n.clientY+(a&&a.scrollTop||r&&r.scrollTop||0)-(a&&a.clientTop||r&&r.clientTop||0)),!e.relatedTarget&&u&&(e.relatedTarget=u===e.target?n.toElement:u),e.which||s===t||(e.which=1&s?1:2&s?3:4&s?2:0),e}},special:{load:{noBubble:!0},click:{trigger:function(){return b.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):t}},focus:{trigger:function(){if(this!==o.activeElement&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===o.activeElement&&this.blur?(this.blur(),!1):t},delegateType:"focusout"},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=b.extend(new b.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?b.event.trigger(i,null,t):b.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},b.removeEvent=o.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===i&&(e[r]=null),e.detachEvent(r,n))},b.Event=function(e,n){return this instanceof b.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?it:ot):this.type=e,n&&b.extend(this,n),this.timeStamp=e&&e.timeStamp||b.now(),this[b.expando]=!0,t):new b.Event(e,n)},b.Event.prototype={isDefaultPrevented:ot,isPropagationStopped:ot,isImmediatePropagationStopped:ot,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=it,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=it,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=it,this.stopPropagation()}},b.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){b.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;
return(!i||i!==r&&!b.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),b.support.submitBubbles||(b.event.special.submit={setup:function(){return b.nodeName(this,"form")?!1:(b.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=b.nodeName(n,"input")||b.nodeName(n,"button")?n.form:t;r&&!b._data(r,"submitBubbles")&&(b.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),b._data(r,"submitBubbles",!0))}),t)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&b.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return b.nodeName(this,"form")?!1:(b.event.remove(this,"._submit"),t)}}),b.support.changeBubbles||(b.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(b.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),b.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),b.event.simulate("change",this,e,!0)})),!1):(b.event.add(this,"beforeactivate._change",function(e){var t=e.target;Z.test(t.nodeName)&&!b._data(t,"changeBubbles")&&(b.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||b.event.simulate("change",this.parentNode,e,!0)}),b._data(t,"changeBubbles",!0))}),t)},handle:function(e){var n=e.target;return this!==n||e.isSimulated||e.isTrigger||"radio"!==n.type&&"checkbox"!==n.type?e.handleObj.handler.apply(this,arguments):t},teardown:function(){return b.event.remove(this,"._change"),!Z.test(this.nodeName)}}),b.support.focusinBubbles||b.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){b.event.simulate(t,e.target,b.event.fix(e),!0)};b.event.special[t]={setup:function(){0===n++&&o.addEventListener(e,r,!0)},teardown:function(){0===--n&&o.removeEventListener(e,r,!0)}}}),b.fn.extend({on:function(e,n,r,i,o){var a,s;if("object"==typeof e){"string"!=typeof n&&(r=r||n,n=t);for(a in e)this.on(a,n,r,e[a],o);return this}if(null==r&&null==i?(i=n,r=n=t):null==i&&("string"==typeof n?(i=r,r=t):(i=r,r=n,n=t)),i===!1)i=ot;else if(!i)return this;return 1===o&&(s=i,i=function(e){return b().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=b.guid++)),this.each(function(){b.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,b(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,n,e[o]);return this}return(n===!1||"function"==typeof n)&&(r=n,n=t),r===!1&&(r=ot),this.each(function(){b.event.remove(this,e,r,n)})},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},trigger:function(e,t){return this.each(function(){b.event.trigger(e,t,this)})},triggerHandler:function(e,n){var r=this[0];return r?b.event.trigger(e,n,r,!0):t}}),function(e,t){var n,r,i,o,a,s,u,l,c,p,f,d,h,g,m,y,v,x="sizzle"+-new Date,w=e.document,T={},N=0,C=0,k=it(),E=it(),S=it(),A=typeof t,j=1<<31,D=[],L=D.pop,H=D.push,q=D.slice,M=D.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},_="[\\x20\\t\\r\\n\\f]",F="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",O=F.replace("w","w#"),B="([*^$|!~]?=)",P="\\["+_+"*("+F+")"+_+"*(?:"+B+_+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+O+")|)|)"+_+"*\\]",R=":("+F+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+P.replace(3,8)+")*)|.*)\\)|)",W=RegExp("^"+_+"+|((?:^|[^\\\\])(?:\\\\.)*)"+_+"+$","g"),$=RegExp("^"+_+"*,"+_+"*"),I=RegExp("^"+_+"*([\\x20\\t\\r\\n\\f>+~])"+_+"*"),z=RegExp(R),X=RegExp("^"+O+"$"),U={ID:RegExp("^#("+F+")"),CLASS:RegExp("^\\.("+F+")"),NAME:RegExp("^\\[name=['\"]?("+F+")['\"]?\\]"),TAG:RegExp("^("+F.replace("w","w*")+")"),ATTR:RegExp("^"+P),PSEUDO:RegExp("^"+R),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+_+"*(even|odd|(([+-]|)(\\d*)n|)"+_+"*(?:([+-]|)"+_+"*(\\d+)|))"+_+"*\\)|)","i"),needsContext:RegExp("^"+_+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+_+"*((?:-\\d)?\\d*)"+_+"*\\)|)(?=[^-]|$)","i")},V=/[\x20\t\r\n\f]*[+~]/,Y=/^[^{]+\{\s*\[native code/,J=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,G=/^(?:input|select|textarea|button)$/i,Q=/^h\d$/i,K=/'|\\/g,Z=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,et=/\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,tt=function(e,t){var n="0x"+t-65536;return n!==n?t:0>n?String.fromCharCode(n+65536):String.fromCharCode(55296|n>>10,56320|1023&n)};try{q.call(w.documentElement.childNodes,0)[0].nodeType}catch(nt){q=function(e){var t,n=[];while(t=this[e++])n.push(t);return n}}function rt(e){return Y.test(e+"")}function it(){var e,t=[];return e=function(n,r){return t.push(n+=" ")>i.cacheLength&&delete e[t.shift()],e[n]=r}}function ot(e){return e[x]=!0,e}function at(e){var t=p.createElement("div");try{return e(t)}catch(n){return!1}finally{t=null}}function st(e,t,n,r){var i,o,a,s,u,l,f,g,m,v;if((t?t.ownerDocument||t:w)!==p&&c(t),t=t||p,n=n||[],!e||"string"!=typeof e)return n;if(1!==(s=t.nodeType)&&9!==s)return[];if(!d&&!r){if(i=J.exec(e))if(a=i[1]){if(9===s){if(o=t.getElementById(a),!o||!o.parentNode)return n;if(o.id===a)return n.push(o),n}else if(t.ownerDocument&&(o=t.ownerDocument.getElementById(a))&&y(t,o)&&o.id===a)return n.push(o),n}else{if(i[2])return H.apply(n,q.call(t.getElementsByTagName(e),0)),n;if((a=i[3])&&T.getByClassName&&t.getElementsByClassName)return H.apply(n,q.call(t.getElementsByClassName(a),0)),n}if(T.qsa&&!h.test(e)){if(f=!0,g=x,m=t,v=9===s&&e,1===s&&"object"!==t.nodeName.toLowerCase()){l=ft(e),(f=t.getAttribute("id"))?g=f.replace(K,"\\$&"):t.setAttribute("id",g),g="[id='"+g+"'] ",u=l.length;while(u--)l[u]=g+dt(l[u]);m=V.test(e)&&t.parentNode||t,v=l.join(",")}if(v)try{return H.apply(n,q.call(m.querySelectorAll(v),0)),n}catch(b){}finally{f||t.removeAttribute("id")}}}return wt(e.replace(W,"$1"),t,n,r)}a=st.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},c=st.setDocument=function(e){var n=e?e.ownerDocument||e:w;return n!==p&&9===n.nodeType&&n.documentElement?(p=n,f=n.documentElement,d=a(n),T.tagNameNoComments=at(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),T.attributes=at(function(e){e.innerHTML="<select></select>";var t=typeof e.lastChild.getAttribute("multiple");return"boolean"!==t&&"string"!==t}),T.getByClassName=at(function(e){return e.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",e.getElementsByClassName&&e.getElementsByClassName("e").length?(e.lastChild.className="e",2===e.getElementsByClassName("e").length):!1}),T.getByName=at(function(e){e.id=x+0,e.innerHTML="<a name='"+x+"'></a><div name='"+x+"'></div>",f.insertBefore(e,f.firstChild);var t=n.getElementsByName&&n.getElementsByName(x).length===2+n.getElementsByName(x+0).length;return T.getIdNotName=!n.getElementById(x),f.removeChild(e),t}),i.attrHandle=at(function(e){return e.innerHTML="<a href='#'></a>",e.firstChild&&typeof e.firstChild.getAttribute!==A&&"#"===e.firstChild.getAttribute("href")})?{}:{href:function(e){return e.getAttribute("href",2)},type:function(e){return e.getAttribute("type")}},T.getIdNotName?(i.find.ID=function(e,t){if(typeof t.getElementById!==A&&!d){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},i.filter.ID=function(e){var t=e.replace(et,tt);return function(e){return e.getAttribute("id")===t}}):(i.find.ID=function(e,n){if(typeof n.getElementById!==A&&!d){var r=n.getElementById(e);return r?r.id===e||typeof r.getAttributeNode!==A&&r.getAttributeNode("id").value===e?[r]:t:[]}},i.filter.ID=function(e){var t=e.replace(et,tt);return function(e){var n=typeof e.getAttributeNode!==A&&e.getAttributeNode("id");return n&&n.value===t}}),i.find.TAG=T.tagNameNoComments?function(e,n){return typeof n.getElementsByTagName!==A?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},i.find.NAME=T.getByName&&function(e,n){return typeof n.getElementsByName!==A?n.getElementsByName(name):t},i.find.CLASS=T.getByClassName&&function(e,n){return typeof n.getElementsByClassName===A||d?t:n.getElementsByClassName(e)},g=[],h=[":focus"],(T.qsa=rt(n.querySelectorAll))&&(at(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||h.push("\\["+_+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),e.querySelectorAll(":checked").length||h.push(":checked")}),at(function(e){e.innerHTML="<input type='hidden' i=''/>",e.querySelectorAll("[i^='']").length&&h.push("[*^$]="+_+"*(?:\"\"|'')"),e.querySelectorAll(":enabled").length||h.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),h.push(",.*:")})),(T.matchesSelector=rt(m=f.matchesSelector||f.mozMatchesSelector||f.webkitMatchesSelector||f.oMatchesSelector||f.msMatchesSelector))&&at(function(e){T.disconnectedMatch=m.call(e,"div"),m.call(e,"[s!='']:x"),g.push("!=",R)}),h=RegExp(h.join("|")),g=RegExp(g.join("|")),y=rt(f.contains)||f.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},v=f.compareDocumentPosition?function(e,t){var r;return e===t?(u=!0,0):(r=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t))?1&r||e.parentNode&&11===e.parentNode.nodeType?e===n||y(w,e)?-1:t===n||y(w,t)?1:0:4&r?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,s=[e],l=[t];if(e===t)return u=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:0;if(o===a)return ut(e,t);r=e;while(r=r.parentNode)s.unshift(r);r=t;while(r=r.parentNode)l.unshift(r);while(s[i]===l[i])i++;return i?ut(s[i],l[i]):s[i]===w?-1:l[i]===w?1:0},u=!1,[0,0].sort(v),T.detectDuplicates=u,p):p},st.matches=function(e,t){return st(e,null,null,t)},st.matchesSelector=function(e,t){if((e.ownerDocument||e)!==p&&c(e),t=t.replace(Z,"='$1']"),!(!T.matchesSelector||d||g&&g.test(t)||h.test(t)))try{var n=m.call(e,t);if(n||T.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(r){}return st(t,p,null,[e]).length>0},st.contains=function(e,t){return(e.ownerDocument||e)!==p&&c(e),y(e,t)},st.attr=function(e,t){var n;return(e.ownerDocument||e)!==p&&c(e),d||(t=t.toLowerCase()),(n=i.attrHandle[t])?n(e):d||T.attributes?e.getAttribute(t):((n=e.getAttributeNode(t))||e.getAttribute(t))&&e[t]===!0?t:n&&n.specified?n.value:null},st.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},st.uniqueSort=function(e){var t,n=[],r=1,i=0;if(u=!T.detectDuplicates,e.sort(v),u){for(;t=e[r];r++)t===e[r-1]&&(i=n.push(r));while(i--)e.splice(n[i],1)}return e};function ut(e,t){var n=t&&e,r=n&&(~t.sourceIndex||j)-(~e.sourceIndex||j);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function lt(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function ct(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function pt(e){return ot(function(t){return t=+t,ot(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}o=st.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=o(t);return n},i=st.selectors={cacheLength:50,createPseudo:ot,match:U,find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(et,tt),e[3]=(e[4]||e[5]||"").replace(et,tt),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||st.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&st.error(e[0]),e},PSEUDO:function(e){var t,n=!e[5]&&e[2];return U.CHILD.test(e[0])?null:(e[4]?e[2]=e[4]:n&&z.test(n)&&(t=ft(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){return"*"===e?function(){return!0}:(e=e.replace(et,tt).toLowerCase(),function(t){return t.nodeName&&t.nodeName.toLowerCase()===e})},CLASS:function(e){var t=k[e+" "];return t||(t=RegExp("(^|"+_+")"+e+"("+_+"|$)"))&&k(e,function(e){return t.test(e.className||typeof e.getAttribute!==A&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=st.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,p,f,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!u&&!s;if(m){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){c=m[x]||(m[x]={}),l=c[e]||[],d=l[0]===N&&l[1],f=l[0]===N&&l[2],p=d&&m.childNodes[d];while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[N,d,f];break}}else if(v&&(l=(t[x]||(t[x]={}))[e])&&l[0]===N)f=l[1];else while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(v&&((p[x]||(p[x]={}))[e]=[N,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=i.pseudos[e]||i.setFilters[e.toLowerCase()]||st.error("unsupported pseudo: "+e);return r[x]?r(t):r.length>1?(n=[e,e,"",t],i.setFilters.hasOwnProperty(e.toLowerCase())?ot(function(e,n){var i,o=r(e,t),a=o.length;while(a--)i=M.call(e,o[a]),e[i]=!(n[i]=o[a])}):function(e){return r(e,0,n)}):r}},pseudos:{not:ot(function(e){var t=[],n=[],r=s(e.replace(W,"$1"));return r[x]?ot(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:ot(function(e){return function(t){return st(e,t).length>0}}),contains:ot(function(e){return function(t){return(t.textContent||t.innerText||o(t)).indexOf(e)>-1}}),lang:ot(function(e){return X.test(e||"")||st.error("unsupported lang: "+e),e=e.replace(et,tt).toLowerCase(),function(t){var n;do if(n=d?t.getAttribute("xml:lang")||t.getAttribute("lang"):t.lang)return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===f},focus:function(e){return e===p.activeElement&&(!p.hasFocus||p.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!i.pseudos.empty(e)},header:function(e){return Q.test(e.nodeName)},input:function(e){return G.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:pt(function(){return[0]}),last:pt(function(e,t){return[t-1]}),eq:pt(function(e,t,n){return[0>n?n+t:n]}),even:pt(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:pt(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:pt(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:pt(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}};for(n in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})i.pseudos[n]=lt(n);for(n in{submit:!0,reset:!0})i.pseudos[n]=ct(n);function ft(e,t){var n,r,o,a,s,u,l,c=E[e+" "];if(c)return t?0:c.slice(0);s=e,u=[],l=i.preFilter;while(s){(!n||(r=$.exec(s)))&&(r&&(s=s.slice(r[0].length)||s),u.push(o=[])),n=!1,(r=I.exec(s))&&(n=r.shift(),o.push({value:n,type:r[0].replace(W," ")}),s=s.slice(n.length));for(a in i.filter)!(r=U[a].exec(s))||l[a]&&!(r=l[a](r))||(n=r.shift(),o.push({value:n,type:a,matches:r}),s=s.slice(n.length));if(!n)break}return t?s.length:s?st.error(e):E(e,u).slice(0)}function dt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function ht(e,t,n){var i=t.dir,o=n&&"parentNode"===i,a=C++;return t.first?function(t,n,r){while(t=t[i])if(1===t.nodeType||o)return e(t,n,r)}:function(t,n,s){var u,l,c,p=N+" "+a;if(s){while(t=t[i])if((1===t.nodeType||o)&&e(t,n,s))return!0}else while(t=t[i])if(1===t.nodeType||o)if(c=t[x]||(t[x]={}),(l=c[i])&&l[0]===p){if((u=l[1])===!0||u===r)return u===!0}else if(l=c[i]=[p],l[1]=e(t,n,s)||r,l[1]===!0)return!0}}function gt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function mt(e,t,n,r,i){var o,a=[],s=0,u=e.length,l=null!=t;for(;u>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),l&&t.push(s));return a}function yt(e,t,n,r,i,o){return r&&!r[x]&&(r=yt(r)),i&&!i[x]&&(i=yt(i,o)),ot(function(o,a,s,u){var l,c,p,f=[],d=[],h=a.length,g=o||xt(t||"*",s.nodeType?[s]:s,[]),m=!e||!o&&t?g:mt(g,f,e,s,u),y=n?i||(o?e:h||r)?[]:a:m;if(n&&n(m,y,s,u),r){l=mt(y,d),r(l,[],s,u),c=l.length;while(c--)(p=l[c])&&(y[d[c]]=!(m[d[c]]=p))}if(o){if(i||e){if(i){l=[],c=y.length;while(c--)(p=y[c])&&l.push(m[c]=p);i(null,y=[],l,u)}c=y.length;while(c--)(p=y[c])&&(l=i?M.call(o,p):f[c])>-1&&(o[l]=!(a[l]=p))}}else y=mt(y===a?y.splice(h,y.length):y),i?i(null,a,y,u):H.apply(a,y)})}function vt(e){var t,n,r,o=e.length,a=i.relative[e[0].type],s=a||i.relative[" "],u=a?1:0,c=ht(function(e){return e===t},s,!0),p=ht(function(e){return M.call(t,e)>-1},s,!0),f=[function(e,n,r){return!a&&(r||n!==l)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;o>u;u++)if(n=i.relative[e[u].type])f=[ht(gt(f),n)];else{if(n=i.filter[e[u].type].apply(null,e[u].matches),n[x]){for(r=++u;o>r;r++)if(i.relative[e[r].type])break;return yt(u>1&&gt(f),u>1&&dt(e.slice(0,u-1)).replace(W,"$1"),n,r>u&&vt(e.slice(u,r)),o>r&&vt(e=e.slice(r)),o>r&&dt(e))}f.push(n)}return gt(f)}function bt(e,t){var n=0,o=t.length>0,a=e.length>0,s=function(s,u,c,f,d){var h,g,m,y=[],v=0,b="0",x=s&&[],w=null!=d,T=l,C=s||a&&i.find.TAG("*",d&&u.parentNode||u),k=N+=null==T?1:Math.random()||.1;for(w&&(l=u!==p&&u,r=n);null!=(h=C[b]);b++){if(a&&h){g=0;while(m=e[g++])if(m(h,u,c)){f.push(h);break}w&&(N=k,r=++n)}o&&((h=!m&&h)&&v--,s&&x.push(h))}if(v+=b,o&&b!==v){g=0;while(m=t[g++])m(x,y,u,c);if(s){if(v>0)while(b--)x[b]||y[b]||(y[b]=L.call(f));y=mt(y)}H.apply(f,y),w&&!s&&y.length>0&&v+t.length>1&&st.uniqueSort(f)}return w&&(N=k,l=T),x};return o?ot(s):s}s=st.compile=function(e,t){var n,r=[],i=[],o=S[e+" "];if(!o){t||(t=ft(e)),n=t.length;while(n--)o=vt(t[n]),o[x]?r.push(o):i.push(o);o=S(e,bt(i,r))}return o};function xt(e,t,n){var r=0,i=t.length;for(;i>r;r++)st(e,t[r],n);return n}function wt(e,t,n,r){var o,a,u,l,c,p=ft(e);if(!r&&1===p.length){if(a=p[0]=p[0].slice(0),a.length>2&&"ID"===(u=a[0]).type&&9===t.nodeType&&!d&&i.relative[a[1].type]){if(t=i.find.ID(u.matches[0].replace(et,tt),t)[0],!t)return n;e=e.slice(a.shift().value.length)}o=U.needsContext.test(e)?0:a.length;while(o--){if(u=a[o],i.relative[l=u.type])break;if((c=i.find[l])&&(r=c(u.matches[0].replace(et,tt),V.test(a[0].type)&&t.parentNode||t))){if(a.splice(o,1),e=r.length&&dt(a),!e)return H.apply(n,q.call(r,0)),n;break}}}return s(e,p)(r,t,d,n,V.test(e)),n}i.pseudos.nth=i.pseudos.eq;function Tt(){}i.filters=Tt.prototype=i.pseudos,i.setFilters=new Tt,c(),st.attr=b.attr,b.find=st,b.expr=st.selectors,b.expr[":"]=b.expr.pseudos,b.unique=st.uniqueSort,b.text=st.getText,b.isXMLDoc=st.isXML,b.contains=st.contains}(e);var at=/Until$/,st=/^(?:parents|prev(?:Until|All))/,ut=/^.[^:#\[\.,]*$/,lt=b.expr.match.needsContext,ct={children:!0,contents:!0,next:!0,prev:!0};b.fn.extend({find:function(e){var t,n,r,i=this.length;if("string"!=typeof e)return r=this,this.pushStack(b(e).filter(function(){for(t=0;i>t;t++)if(b.contains(r[t],this))return!0}));for(n=[],t=0;i>t;t++)b.find(e,this[t],n);return n=this.pushStack(i>1?b.unique(n):n),n.selector=(this.selector?this.selector+" ":"")+e,n},has:function(e){var t,n=b(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(b.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e,!1))},filter:function(e){return this.pushStack(ft(this,e,!0))},is:function(e){return!!e&&("string"==typeof e?lt.test(e)?b(e,this.context).index(this[0])>=0:b.filter(e,this).length>0:this.filter(e).length>0)},closest:function(e,t){var n,r=0,i=this.length,o=[],a=lt.test(e)||"string"!=typeof e?b(e,t||this.context):0;for(;i>r;r++){n=this[r];while(n&&n.ownerDocument&&n!==t&&11!==n.nodeType){if(a?a.index(n)>-1:b.find.matchesSelector(n,e)){o.push(n);break}n=n.parentNode}}return this.pushStack(o.length>1?b.unique(o):o)},index:function(e){return e?"string"==typeof e?b.inArray(this[0],b(e)):b.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?b(e,t):b.makeArray(e&&e.nodeType?[e]:e),r=b.merge(this.get(),n);return this.pushStack(b.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),b.fn.andSelf=b.fn.addBack;function pt(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}b.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return b.dir(e,"parentNode")},parentsUntil:function(e,t,n){return b.dir(e,"parentNode",n)},next:function(e){return pt(e,"nextSibling")},prev:function(e){return pt(e,"previousSibling")},nextAll:function(e){return b.dir(e,"nextSibling")},prevAll:function(e){return b.dir(e,"previousSibling")},nextUntil:function(e,t,n){return b.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return b.dir(e,"previousSibling",n)},siblings:function(e){return b.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return b.sibling(e.firstChild)},contents:function(e){return b.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:b.merge([],e.childNodes)}},function(e,t){b.fn[e]=function(n,r){var i=b.map(this,t,n);return at.test(e)||(r=n),r&&"string"==typeof r&&(i=b.filter(r,i)),i=this.length>1&&!ct[e]?b.unique(i):i,this.length>1&&st.test(e)&&(i=i.reverse()),this.pushStack(i)}}),b.extend({filter:function(e,t,n){return n&&(e=":not("+e+")"),1===t.length?b.find.matchesSelector(t[0],e)?[t[0]]:[]:b.find.matches(e,t)},dir:function(e,n,r){var i=[],o=e[n];while(o&&9!==o.nodeType&&(r===t||1!==o.nodeType||!b(o).is(r)))1===o.nodeType&&i.push(o),o=o[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function ft(e,t,n){if(t=t||0,b.isFunction(t))return b.grep(e,function(e,r){var i=!!t.call(e,r,e);return i===n});if(t.nodeType)return b.grep(e,function(e){return e===t===n});if("string"==typeof t){var r=b.grep(e,function(e){return 1===e.nodeType});if(ut.test(t))return b.filter(t,r,!n);t=b.filter(t,r)}return b.grep(e,function(e){return b.inArray(e,t)>=0===n})}function dt(e){var t=ht.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}var ht="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gt=/ jQuery\d+="(?:null|\d+)"/g,mt=RegExp("<(?:"+ht+")[\\s/>]","i"),yt=/^\s+/,vt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bt=/<([\w:]+)/,xt=/<tbody/i,wt=/<|&#?\w+;/,Tt=/<(?:script|style|link)/i,Nt=/^(?:checkbox|radio)$/i,Ct=/checked\s*(?:[^=]|=\s*.checked.)/i,kt=/^$|\/(?:java|ecma)script/i,Et=/^true\/(.*)/,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,At={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:b.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},jt=dt(o),Dt=jt.appendChild(o.createElement("div"));At.optgroup=At.option,At.tbody=At.tfoot=At.colgroup=At.caption=At.thead,At.th=At.td,b.fn.extend({text:function(e){return b.access(this,function(e){return e===t?b.text(this):this.empty().append((this[0]&&this[0].ownerDocument||o).createTextNode(e))},null,e,arguments.length)},wrapAll:function(e){if(b.isFunction(e))return this.each(function(t){b(this).wrapAll(e.call(this,t))});if(this[0]){var t=b(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&1===e.firstChild.nodeType)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return b.isFunction(e)?this.each(function(t){b(this).wrapInner(e.call(this,t))}):this.each(function(){var t=b(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=b.isFunction(e);return this.each(function(n){b(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){b.nodeName(this,"body")||b(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(e){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&this.appendChild(e)})},prepend:function(){return this.domManip(arguments,!0,function(e){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&this.insertBefore(e,this.firstChild)})},before:function(){return this.domManip(arguments,!1,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,!1,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=0;for(;null!=(n=this[r]);r++)(!e||b.filter(e,[n]).length>0)&&(t||1!==n.nodeType||b.cleanData(Ot(n)),n.parentNode&&(t&&b.contains(n.ownerDocument,n)&&Mt(Ot(n,"script")),n.parentNode.removeChild(n)));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++){1===e.nodeType&&b.cleanData(Ot(e,!1));while(e.firstChild)e.removeChild(e.firstChild);e.options&&b.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return b.clone(this,e,t)})},html:function(e){return b.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(gt,""):t;if(!("string"!=typeof e||Tt.test(e)||!b.support.htmlSerialize&&mt.test(e)||!b.support.leadingWhitespace&&yt.test(e)||At[(bt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(vt,"<$1></$2>");try{for(;i>r;r++)n=this[r]||{},1===n.nodeType&&(b.cleanData(Ot(n,!1)),n.innerHTML=e);n=0}catch(o){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(e){var t=b.isFunction(e);return t||"string"==typeof e||(e=b(e).not(this).detach()),this.domManip([e],!0,function(e){var t=this.nextSibling,n=this.parentNode;n&&(b(this).remove(),n.insertBefore(e,t))})},detach:function(e){return this.remove(e,!0)},domManip:function(e,n,r){e=f.apply([],e);var i,o,a,s,u,l,c=0,p=this.length,d=this,h=p-1,g=e[0],m=b.isFunction(g);if(m||!(1>=p||"string"!=typeof g||b.support.checkClone)&&Ct.test(g))return this.each(function(i){var o=d.eq(i);m&&(e[0]=g.call(this,i,n?o.html():t)),o.domManip(e,n,r)});if(p&&(l=b.buildFragment(e,this[0].ownerDocument,!1,this),i=l.firstChild,1===l.childNodes.length&&(l=i),i)){for(n=n&&b.nodeName(i,"tr"),s=b.map(Ot(l,"script"),Ht),a=s.length;p>c;c++)o=l,c!==h&&(o=b.clone(o,!0,!0),a&&b.merge(s,Ot(o,"script"))),r.call(n&&b.nodeName(this[c],"table")?Lt(this[c],"tbody"):this[c],o,c);if(a)for(u=s[s.length-1].ownerDocument,b.map(s,qt),c=0;a>c;c++)o=s[c],kt.test(o.type||"")&&!b._data(o,"globalEval")&&b.contains(u,o)&&(o.src?b.ajax({url:o.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):b.globalEval((o.text||o.textContent||o.innerHTML||"").replace(St,"")));l=i=null}return this}});function Lt(e,t){return e.getElementsByTagName(t)[0]||e.appendChild(e.ownerDocument.createElement(t))}function Ht(e){var t=e.getAttributeNode("type");return e.type=(t&&t.specified)+"/"+e.type,e}function qt(e){var t=Et.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function Mt(e,t){var n,r=0;for(;null!=(n=e[r]);r++)b._data(n,"globalEval",!t||b._data(t[r],"globalEval"))}function _t(e,t){if(1===t.nodeType&&b.hasData(e)){var n,r,i,o=b._data(e),a=b._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)b.event.add(t,n,s[n][r])}a.data&&(a.data=b.extend({},a.data))}}function Ft(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!b.support.noCloneEvent&&t[b.expando]){i=b._data(t);for(r in i.events)b.removeEvent(t,r,i.handle);t.removeAttribute(b.expando)}"script"===n&&t.text!==e.text?(Ht(t).text=e.text,qt(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),b.support.html5Clone&&e.innerHTML&&!b.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&Nt.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}b.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){b.fn[e]=function(e){var n,r=0,i=[],o=b(e),a=o.length-1;for(;a>=r;r++)n=r===a?this:this.clone(!0),b(o[r])[t](n),d.apply(i,n.get());return this.pushStack(i)}});function Ot(e,n){var r,o,a=0,s=typeof e.getElementsByTagName!==i?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==i?e.querySelectorAll(n||"*"):t;if(!s)for(s=[],r=e.childNodes||e;null!=(o=r[a]);a++)!n||b.nodeName(o,n)?s.push(o):b.merge(s,Ot(o,n));return n===t||n&&b.nodeName(e,n)?b.merge([e],s):s}function Bt(e){Nt.test(e.type)&&(e.defaultChecked=e.checked)}b.extend({clone:function(e,t,n){var r,i,o,a,s,u=b.contains(e.ownerDocument,e);if(b.support.html5Clone||b.isXMLDoc(e)||!mt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(Dt.innerHTML=e.outerHTML,Dt.removeChild(o=Dt.firstChild)),!(b.support.noCloneEvent&&b.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||b.isXMLDoc(e)))for(r=Ot(o),s=Ot(e),a=0;null!=(i=s[a]);++a)r[a]&&Ft(i,r[a]);if(t)if(n)for(s=s||Ot(e),r=r||Ot(o),a=0;null!=(i=s[a]);a++)_t(i,r[a]);else _t(e,o);return r=Ot(o,"script"),r.length>0&&Mt(r,!u&&Ot(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){var i,o,a,s,u,l,c,p=e.length,f=dt(t),d=[],h=0;for(;p>h;h++)if(o=e[h],o||0===o)if("object"===b.type(o))b.merge(d,o.nodeType?[o]:o);else if(wt.test(o)){s=s||f.appendChild(t.createElement("div")),u=(bt.exec(o)||["",""])[1].toLowerCase(),c=At[u]||At._default,s.innerHTML=c[1]+o.replace(vt,"<$1></$2>")+c[2],i=c[0];while(i--)s=s.lastChild;if(!b.support.leadingWhitespace&&yt.test(o)&&d.push(t.createTextNode(yt.exec(o)[0])),!b.support.tbody){o="table"!==u||xt.test(o)?"<table>"!==c[1]||xt.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;while(i--)b.nodeName(l=o.childNodes[i],"tbody")&&!l.childNodes.length&&o.removeChild(l)
}b.merge(d,s.childNodes),s.textContent="";while(s.firstChild)s.removeChild(s.firstChild);s=f.lastChild}else d.push(t.createTextNode(o));s&&f.removeChild(s),b.support.appendChecked||b.grep(Ot(d,"input"),Bt),h=0;while(o=d[h++])if((!r||-1===b.inArray(o,r))&&(a=b.contains(o.ownerDocument,o),s=Ot(f.appendChild(o),"script"),a&&Mt(s),n)){i=0;while(o=s[i++])kt.test(o.type||"")&&n.push(o)}return s=null,f},cleanData:function(e,t){var n,r,o,a,s=0,u=b.expando,l=b.cache,p=b.support.deleteExpando,f=b.event.special;for(;null!=(n=e[s]);s++)if((t||b.acceptData(n))&&(o=n[u],a=o&&l[o])){if(a.events)for(r in a.events)f[r]?b.event.remove(n,r):b.removeEvent(n,r,a.handle);l[o]&&(delete l[o],p?delete n[u]:typeof n.removeAttribute!==i?n.removeAttribute(u):n[u]=null,c.push(o))}}});var Pt,Rt,Wt,$t=/alpha\([^)]*\)/i,It=/opacity\s*=\s*([^)]*)/,zt=/^(top|right|bottom|left)$/,Xt=/^(none|table(?!-c[ea]).+)/,Ut=/^margin/,Vt=RegExp("^("+x+")(.*)$","i"),Yt=RegExp("^("+x+")(?!px)[a-z%]+$","i"),Jt=RegExp("^([+-])=("+x+")","i"),Gt={BODY:"block"},Qt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:0,fontWeight:400},Zt=["Top","Right","Bottom","Left"],en=["Webkit","O","Moz","ms"];function tn(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=en.length;while(i--)if(t=en[i]+n,t in e)return t;return r}function nn(e,t){return e=t||e,"none"===b.css(e,"display")||!b.contains(e.ownerDocument,e)}function rn(e,t){var n,r,i,o=[],a=0,s=e.length;for(;s>a;a++)r=e[a],r.style&&(o[a]=b._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&nn(r)&&(o[a]=b._data(r,"olddisplay",un(r.nodeName)))):o[a]||(i=nn(r),(n&&"none"!==n||!i)&&b._data(r,"olddisplay",i?n:b.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}b.fn.extend({css:function(e,n){return b.access(this,function(e,n,r){var i,o,a={},s=0;if(b.isArray(n)){for(o=Rt(e),i=n.length;i>s;s++)a[n[s]]=b.css(e,n[s],!1,o);return a}return r!==t?b.style(e,n,r):b.css(e,n)},e,n,arguments.length>1)},show:function(){return rn(this,!0)},hide:function(){return rn(this)},toggle:function(e){var t="boolean"==typeof e;return this.each(function(){(t?e:nn(this))?b(this).show():b(this).hide()})}}),b.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Wt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":b.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,u=b.camelCase(n),l=e.style;if(n=b.cssProps[u]||(b.cssProps[u]=tn(l,u)),s=b.cssHooks[n]||b.cssHooks[u],r===t)return s&&"get"in s&&(o=s.get(e,!1,i))!==t?o:l[n];if(a=typeof r,"string"===a&&(o=Jt.exec(r))&&(r=(o[1]+1)*o[2]+parseFloat(b.css(e,n)),a="number"),!(null==r||"number"===a&&isNaN(r)||("number"!==a||b.cssNumber[u]||(r+="px"),b.support.clearCloneStyle||""!==r||0!==n.indexOf("background")||(l[n]="inherit"),s&&"set"in s&&(r=s.set(e,r,i))===t)))try{l[n]=r}catch(c){}}},css:function(e,n,r,i){var o,a,s,u=b.camelCase(n);return n=b.cssProps[u]||(b.cssProps[u]=tn(e.style,u)),s=b.cssHooks[n]||b.cssHooks[u],s&&"get"in s&&(a=s.get(e,!0,r)),a===t&&(a=Wt(e,n,i)),"normal"===a&&n in Kt&&(a=Kt[n]),""===r||r?(o=parseFloat(a),r===!0||b.isNumeric(o)?o||0:a):a},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),e.getComputedStyle?(Rt=function(t){return e.getComputedStyle(t,null)},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),u=s?s.getPropertyValue(n)||s[n]:t,l=e.style;return s&&(""!==u||b.contains(e.ownerDocument,e)||(u=b.style(e,n)),Yt.test(u)&&Ut.test(n)&&(i=l.width,o=l.minWidth,a=l.maxWidth,l.minWidth=l.maxWidth=l.width=u,u=s.width,l.width=i,l.minWidth=o,l.maxWidth=a)),u}):o.documentElement.currentStyle&&(Rt=function(e){return e.currentStyle},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),u=s?s[n]:t,l=e.style;return null==u&&l&&l[n]&&(u=l[n]),Yt.test(u)&&!zt.test(n)&&(i=l.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),l.left="fontSize"===n?"1em":u,u=l.pixelLeft+"px",l.left=i,a&&(o.left=a)),""===u?"auto":u});function on(e,t,n){var r=Vt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function an(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;for(;4>o;o+=2)"margin"===n&&(a+=b.css(e,n+Zt[o],!0,i)),r?("content"===n&&(a-=b.css(e,"padding"+Zt[o],!0,i)),"margin"!==n&&(a-=b.css(e,"border"+Zt[o]+"Width",!0,i))):(a+=b.css(e,"padding"+Zt[o],!0,i),"padding"!==n&&(a+=b.css(e,"border"+Zt[o]+"Width",!0,i)));return a}function sn(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Rt(e),a=b.support.boxSizing&&"border-box"===b.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=Wt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Yt.test(i))return i;r=a&&(b.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+an(e,t,n||(a?"border":"content"),r,o)+"px"}function un(e){var t=o,n=Gt[e];return n||(n=ln(e,t),"none"!==n&&n||(Pt=(Pt||b("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(Pt[0].contentWindow||Pt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=ln(e,t),Pt.detach()),Gt[e]=n),n}function ln(e,t){var n=b(t.createElement(e)).appendTo(t.body),r=b.css(n[0],"display");return n.remove(),r}b.each(["height","width"],function(e,n){b.cssHooks[n]={get:function(e,r,i){return r?0===e.offsetWidth&&Xt.test(b.css(e,"display"))?b.swap(e,Qt,function(){return sn(e,n,i)}):sn(e,n,i):t},set:function(e,t,r){var i=r&&Rt(e);return on(e,t,r?an(e,n,r,b.support.boxSizing&&"border-box"===b.css(e,"boxSizing",!1,i),i):0)}}}),b.support.opacity||(b.cssHooks.opacity={get:function(e,t){return It.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=b.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===b.trim(o.replace($t,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=$t.test(o)?o.replace($t,i):o+" "+i)}}),b(function(){b.support.reliableMarginRight||(b.cssHooks.marginRight={get:function(e,n){return n?b.swap(e,{display:"inline-block"},Wt,[e,"marginRight"]):t}}),!b.support.pixelPosition&&b.fn.position&&b.each(["top","left"],function(e,n){b.cssHooks[n]={get:function(e,r){return r?(r=Wt(e,n),Yt.test(r)?b(e).position()[n]+"px":r):t}}})}),b.expr&&b.expr.filters&&(b.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!b.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||b.css(e,"display"))},b.expr.filters.visible=function(e){return!b.expr.filters.hidden(e)}),b.each({margin:"",padding:"",border:"Width"},function(e,t){b.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+Zt[r]+t]=o[r]||o[r-2]||o[0];return i}},Ut.test(e)||(b.cssHooks[e+t].set=on)});var cn=/%20/g,pn=/\[\]$/,fn=/\r?\n/g,dn=/^(?:submit|button|image|reset|file)$/i,hn=/^(?:input|select|textarea|keygen)/i;b.fn.extend({serialize:function(){return b.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=b.prop(this,"elements");return e?b.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!b(this).is(":disabled")&&hn.test(this.nodeName)&&!dn.test(e)&&(this.checked||!Nt.test(e))}).map(function(e,t){var n=b(this).val();return null==n?null:b.isArray(n)?b.map(n,function(e){return{name:t.name,value:e.replace(fn,"\r\n")}}):{name:t.name,value:n.replace(fn,"\r\n")}}).get()}}),b.param=function(e,n){var r,i=[],o=function(e,t){t=b.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=b.ajaxSettings&&b.ajaxSettings.traditional),b.isArray(e)||e.jquery&&!b.isPlainObject(e))b.each(e,function(){o(this.name,this.value)});else for(r in e)gn(r,e[r],n,o);return i.join("&").replace(cn,"+")};function gn(e,t,n,r){var i;if(b.isArray(t))b.each(t,function(t,i){n||pn.test(e)?r(e,i):gn(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==b.type(t))r(e,t);else for(i in t)gn(e+"["+i+"]",t[i],n,r)}b.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){b.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),b.fn.hover=function(e,t){return this.mouseenter(e).mouseleave(t||e)};var mn,yn,vn=b.now(),bn=/\?/,xn=/#.*$/,wn=/([?&])_=[^&]*/,Tn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Nn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Cn=/^(?:GET|HEAD)$/,kn=/^\/\//,En=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Sn=b.fn.load,An={},jn={},Dn="*/".concat("*");try{yn=a.href}catch(Ln){yn=o.createElement("a"),yn.href="",yn=yn.href}mn=En.exec(yn.toLowerCase())||[];function Hn(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(w)||[];if(b.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function qn(e,n,r,i){var o={},a=e===jn;function s(u){var l;return o[u]=!0,b.each(e[u]||[],function(e,u){var c=u(n,r,i);return"string"!=typeof c||a||o[c]?a?!(l=c):t:(n.dataTypes.unshift(c),s(c),!1)}),l}return s(n.dataTypes[0])||!o["*"]&&s("*")}function Mn(e,n){var r,i,o=b.ajaxSettings.flatOptions||{};for(i in n)n[i]!==t&&((o[i]?e:r||(r={}))[i]=n[i]);return r&&b.extend(!0,e,r),e}b.fn.load=function(e,n,r){if("string"!=typeof e&&Sn)return Sn.apply(this,arguments);var i,o,a,s=this,u=e.indexOf(" ");return u>=0&&(i=e.slice(u,e.length),e=e.slice(0,u)),b.isFunction(n)?(r=n,n=t):n&&"object"==typeof n&&(a="POST"),s.length>0&&b.ajax({url:e,type:a,dataType:"html",data:n}).done(function(e){o=arguments,s.html(i?b("<div>").append(b.parseHTML(e)).find(i):e)}).complete(r&&function(e,t){s.each(r,o||[e.responseText,t,e])}),this},b.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){b.fn[t]=function(e){return this.on(t,e)}}),b.each(["get","post"],function(e,n){b[n]=function(e,r,i,o){return b.isFunction(r)&&(o=o||i,i=r,r=t),b.ajax({url:e,type:n,dataType:o,data:r,success:i})}}),b.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yn,type:"GET",isLocal:Nn.test(mn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Dn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":e.String,"text html":!0,"text json":b.parseJSON,"text xml":b.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?Mn(Mn(e,b.ajaxSettings),t):Mn(b.ajaxSettings,e)},ajaxPrefilter:Hn(An),ajaxTransport:Hn(jn),ajax:function(e,n){"object"==typeof e&&(n=e,e=t),n=n||{};var r,i,o,a,s,u,l,c,p=b.ajaxSetup({},n),f=p.context||p,d=p.context&&(f.nodeType||f.jquery)?b(f):b.event,h=b.Deferred(),g=b.Callbacks("once memory"),m=p.statusCode||{},y={},v={},x=0,T="canceled",N={readyState:0,getResponseHeader:function(e){var t;if(2===x){if(!c){c={};while(t=Tn.exec(a))c[t[1].toLowerCase()]=t[2]}t=c[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===x?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return x||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return x||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>x)for(t in e)m[t]=[m[t],e[t]];else N.always(e[N.status]);return this},abort:function(e){var t=e||T;return l&&l.abort(t),k(0,t),this}};if(h.promise(N).complete=g.add,N.success=N.done,N.error=N.fail,p.url=((e||p.url||yn)+"").replace(xn,"").replace(kn,mn[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=b.trim(p.dataType||"*").toLowerCase().match(w)||[""],null==p.crossDomain&&(r=En.exec(p.url.toLowerCase()),p.crossDomain=!(!r||r[1]===mn[1]&&r[2]===mn[2]&&(r[3]||("http:"===r[1]?80:443))==(mn[3]||("http:"===mn[1]?80:443)))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=b.param(p.data,p.traditional)),qn(An,p,n,N),2===x)return N;u=p.global,u&&0===b.active++&&b.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Cn.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bn.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=wn.test(o)?o.replace(wn,"$1_="+vn++):o+(bn.test(o)?"&":"?")+"_="+vn++)),p.ifModified&&(b.lastModified[o]&&N.setRequestHeader("If-Modified-Since",b.lastModified[o]),b.etag[o]&&N.setRequestHeader("If-None-Match",b.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&N.setRequestHeader("Content-Type",p.contentType),N.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Dn+"; q=0.01":""):p.accepts["*"]);for(i in p.headers)N.setRequestHeader(i,p.headers[i]);if(p.beforeSend&&(p.beforeSend.call(f,N,p)===!1||2===x))return N.abort();T="abort";for(i in{success:1,error:1,complete:1})N[i](p[i]);if(l=qn(jn,p,n,N)){N.readyState=1,u&&d.trigger("ajaxSend",[N,p]),p.async&&p.timeout>0&&(s=setTimeout(function(){N.abort("timeout")},p.timeout));try{x=1,l.send(y,k)}catch(C){if(!(2>x))throw C;k(-1,C)}}else k(-1,"No Transport");function k(e,n,r,i){var c,y,v,w,T,C=n;2!==x&&(x=2,s&&clearTimeout(s),l=t,a=i||"",N.readyState=e>0?4:0,r&&(w=_n(p,N,r)),e>=200&&300>e||304===e?(p.ifModified&&(T=N.getResponseHeader("Last-Modified"),T&&(b.lastModified[o]=T),T=N.getResponseHeader("etag"),T&&(b.etag[o]=T)),204===e?(c=!0,C="nocontent"):304===e?(c=!0,C="notmodified"):(c=Fn(p,w),C=c.state,y=c.data,v=c.error,c=!v)):(v=C,(e||!C)&&(C="error",0>e&&(e=0))),N.status=e,N.statusText=(n||C)+"",c?h.resolveWith(f,[y,C,N]):h.rejectWith(f,[N,C,v]),N.statusCode(m),m=t,u&&d.trigger(c?"ajaxSuccess":"ajaxError",[N,p,c?y:v]),g.fireWith(f,[N,C]),u&&(d.trigger("ajaxComplete",[N,p]),--b.active||b.event.trigger("ajaxStop")))}return N},getScript:function(e,n){return b.get(e,t,n,"script")},getJSON:function(e,t,n){return b.get(e,t,n,"json")}});function _n(e,n,r){var i,o,a,s,u=e.contents,l=e.dataTypes,c=e.responseFields;for(s in c)s in r&&(n[c[s]]=r[s]);while("*"===l[0])l.shift(),o===t&&(o=e.mimeType||n.getResponseHeader("Content-Type"));if(o)for(s in u)if(u[s]&&u[s].test(o)){l.unshift(s);break}if(l[0]in r)a=l[0];else{for(s in r){if(!l[0]||e.converters[s+" "+l[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==l[0]&&l.unshift(a),r[a]):t}function Fn(e,t){var n,r,i,o,a={},s=0,u=e.dataTypes.slice(),l=u[0];if(e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u[1])for(i in e.converters)a[i.toLowerCase()]=e.converters[i];for(;r=u[++s];)if("*"!==r){if("*"!==l&&l!==r){if(i=a[l+" "+r]||a["* "+r],!i)for(n in a)if(o=n.split(" "),o[1]===r&&(i=a[l+" "+o[0]]||a["* "+o[0]])){i===!0?i=a[n]:a[n]!==!0&&(r=o[0],u.splice(s--,0,r));break}if(i!==!0)if(i&&e["throws"])t=i(t);else try{t=i(t)}catch(c){return{state:"parsererror",error:i?c:"No conversion from "+l+" to "+r}}}l=r}return{state:"success",data:t}}b.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return b.globalEval(e),e}}}),b.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),b.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=o.head||b("head")[0]||o.documentElement;return{send:function(t,i){n=o.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success"))},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var On=[],Bn=/(=)\?(?=&|$)|\?\?/;b.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=On.pop()||b.expando+"_"+vn++;return this[e]=!0,e}}),b.ajaxPrefilter("json jsonp",function(n,r,i){var o,a,s,u=n.jsonp!==!1&&(Bn.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Bn.test(n.data)&&"data");return u||"jsonp"===n.dataTypes[0]?(o=n.jsonpCallback=b.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,u?n[u]=n[u].replace(Bn,"$1"+o):n.jsonp!==!1&&(n.url+=(bn.test(n.url)?"&":"?")+n.jsonp+"="+o),n.converters["script json"]=function(){return s||b.error(o+" was not called"),s[0]},n.dataTypes[0]="json",a=e[o],e[o]=function(){s=arguments},i.always(function(){e[o]=a,n[o]&&(n.jsonpCallback=r.jsonpCallback,On.push(o)),s&&b.isFunction(a)&&a(s[0]),s=a=t}),"script"):t});var Pn,Rn,Wn=0,$n=e.ActiveXObject&&function(){var e;for(e in Pn)Pn[e](t,!0)};function In(){try{return new e.XMLHttpRequest}catch(t){}}function zn(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}b.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&In()||zn()}:In,Rn=b.ajaxSettings.xhr(),b.support.cors=!!Rn&&"withCredentials"in Rn,Rn=b.support.ajax=!!Rn,Rn&&b.ajaxTransport(function(n){if(!n.crossDomain||b.support.cors){var r;return{send:function(i,o){var a,s,u=n.xhr();if(n.username?u.open(n.type,n.url,n.async,n.username,n.password):u.open(n.type,n.url,n.async),n.xhrFields)for(s in n.xhrFields)u[s]=n.xhrFields[s];n.mimeType&&u.overrideMimeType&&u.overrideMimeType(n.mimeType),n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)u.setRequestHeader(s,i[s])}catch(l){}u.send(n.hasContent&&n.data||null),r=function(e,i){var s,l,c,p;try{if(r&&(i||4===u.readyState))if(r=t,a&&(u.onreadystatechange=b.noop,$n&&delete Pn[a]),i)4!==u.readyState&&u.abort();else{p={},s=u.status,l=u.getAllResponseHeaders(),"string"==typeof u.responseText&&(p.text=u.responseText);try{c=u.statusText}catch(f){c=""}s||!n.isLocal||n.crossDomain?1223===s&&(s=204):s=p.text?200:404}}catch(d){i||o(-1,d)}p&&o(s,c,p,l)},n.async?4===u.readyState?setTimeout(r):(a=++Wn,$n&&(Pn||(Pn={},b(e).unload($n)),Pn[a]=r),u.onreadystatechange=r):r()},abort:function(){r&&r(t,!0)}}}});var Xn,Un,Vn=/^(?:toggle|show|hide)$/,Yn=RegExp("^(?:([+-])=|)("+x+")([a-z%]*)$","i"),Jn=/queueHooks$/,Gn=[nr],Qn={"*":[function(e,t){var n,r,i=this.createTween(e,t),o=Yn.exec(t),a=i.cur(),s=+a||0,u=1,l=20;if(o){if(n=+o[2],r=o[3]||(b.cssNumber[e]?"":"px"),"px"!==r&&s){s=b.css(i.elem,e,!0)||n||1;do u=u||".5",s/=u,b.style(i.elem,e,s+r);while(u!==(u=i.cur()/a)&&1!==u&&--l)}i.unit=r,i.start=s,i.end=o[1]?s+(o[1]+1)*n:n}return i}]};function Kn(){return setTimeout(function(){Xn=t}),Xn=b.now()}function Zn(e,t){b.each(t,function(t,n){var r=(Qn[t]||[]).concat(Qn["*"]),i=0,o=r.length;for(;o>i;i++)if(r[i].call(e,t,n))return})}function er(e,t,n){var r,i,o=0,a=Gn.length,s=b.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;var t=Xn||Kn(),n=Math.max(0,l.startTime+l.duration-t),r=n/l.duration||0,o=1-r,a=0,u=l.tweens.length;for(;u>a;a++)l.tweens[a].run(o);return s.notifyWith(e,[l,o,n]),1>o&&u?n:(s.resolveWith(e,[l]),!1)},l=s.promise({elem:e,props:b.extend({},t),opts:b.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Xn||Kn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=b.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)l.tweens[n].run(1);return t?s.resolveWith(e,[l,t]):s.rejectWith(e,[l,t]),this}}),c=l.props;for(tr(c,l.opts.specialEasing);a>o;o++)if(r=Gn[o].call(l,e,c,l.opts))return r;return Zn(l,c),b.isFunction(l.opts.start)&&l.opts.start.call(e,l),b.fx.timer(b.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always)}function tr(e,t){var n,r,i,o,a;for(i in e)if(r=b.camelCase(i),o=t[r],n=e[i],b.isArray(n)&&(o=n[1],n=e[i]=n[0]),i!==r&&(e[r]=n,delete e[i]),a=b.cssHooks[r],a&&"expand"in a){n=a.expand(n),delete e[r];for(i in n)i in e||(e[i]=n[i],t[i]=o)}else t[r]=o}b.Animation=b.extend(er,{tweener:function(e,t){b.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Qn[n]=Qn[n]||[],Qn[n].unshift(t)},prefilter:function(e,t){t?Gn.unshift(e):Gn.push(e)}});function nr(e,t,n){var r,i,o,a,s,u,l,c,p,f=this,d=e.style,h={},g=[],m=e.nodeType&&nn(e);n.queue||(c=b._queueHooks(e,"fx"),null==c.unqueued&&(c.unqueued=0,p=c.empty.fire,c.empty.fire=function(){c.unqueued||p()}),c.unqueued++,f.always(function(){f.always(function(){c.unqueued--,b.queue(e,"fx").length||c.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[d.overflow,d.overflowX,d.overflowY],"inline"===b.css(e,"display")&&"none"===b.css(e,"float")&&(b.support.inlineBlockNeedsLayout&&"inline"!==un(e.nodeName)?d.zoom=1:d.display="inline-block")),n.overflow&&(d.overflow="hidden",b.support.shrinkWrapBlocks||f.always(function(){d.overflow=n.overflow[0],d.overflowX=n.overflow[1],d.overflowY=n.overflow[2]}));for(i in t)if(a=t[i],Vn.exec(a)){if(delete t[i],u=u||"toggle"===a,a===(m?"hide":"show"))continue;g.push(i)}if(o=g.length){s=b._data(e,"fxshow")||b._data(e,"fxshow",{}),"hidden"in s&&(m=s.hidden),u&&(s.hidden=!m),m?b(e).show():f.done(function(){b(e).hide()}),f.done(function(){var t;b._removeData(e,"fxshow");for(t in h)b.style(e,t,h[t])});for(i=0;o>i;i++)r=g[i],l=f.createTween(r,m?s[r]:0),h[r]=s[r]||b.style(e,r),r in s||(s[r]=l.start,m&&(l.end=l.start,l.start="width"===r||"height"===r?1:0))}}function rr(e,t,n,r,i){return new rr.prototype.init(e,t,n,r,i)}b.Tween=rr,rr.prototype={constructor:rr,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(b.cssNumber[n]?"":"px")},cur:function(){var e=rr.propHooks[this.prop];return e&&e.get?e.get(this):rr.propHooks._default.get(this)},run:function(e){var t,n=rr.propHooks[this.prop];return this.pos=t=this.options.duration?b.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):rr.propHooks._default.set(this),this}},rr.prototype.init.prototype=rr.prototype,rr.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=b.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){b.fx.step[e.prop]?b.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[b.cssProps[e.prop]]||b.cssHooks[e.prop])?b.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},rr.propHooks.scrollTop=rr.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},b.each(["toggle","show","hide"],function(e,t){var n=b.fn[t];b.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ir(t,!0),e,r,i)}}),b.fn.extend({fadeTo:function(e,t,n,r){return this.filter(nn).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=b.isEmptyObject(e),o=b.speed(t,n,r),a=function(){var t=er(this,b.extend({},e),o);a.finish=function(){t.stop(!0)},(i||b._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return"string"!=typeof e&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",o=b.timers,a=b._data(this);if(n)a[n]&&a[n].stop&&i(a[n]);else for(n in a)a[n]&&a[n].stop&&Jn.test(n)&&i(a[n]);for(n=o.length;n--;)o[n].elem!==this||null!=e&&o[n].queue!==e||(o[n].anim.stop(r),t=!1,o.splice(n,1));(t||!r)&&b.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=b._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=b.timers,a=r?r.length:0;for(n.finish=!0,b.queue(this,e,[]),i&&i.cur&&i.cur.finish&&i.cur.finish.call(this),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function ir(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=Zt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}b.each({slideDown:ir("show"),slideUp:ir("hide"),slideToggle:ir("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){b.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),b.speed=function(e,t,n){var r=e&&"object"==typeof e?b.extend({},e):{complete:n||!n&&t||b.isFunction(e)&&e,duration:e,easing:n&&t||t&&!b.isFunction(t)&&t};return r.duration=b.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in b.fx.speeds?b.fx.speeds[r.duration]:b.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){b.isFunction(r.old)&&r.old.call(this),r.queue&&b.dequeue(this,r.queue)},r},b.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},b.timers=[],b.fx=rr.prototype.init,b.fx.tick=function(){var e,n=b.timers,r=0;for(Xn=b.now();n.length>r;r++)e=n[r],e()||n[r]!==e||n.splice(r--,1);n.length||b.fx.stop(),Xn=t},b.fx.timer=function(e){e()&&b.timers.push(e)&&b.fx.start()},b.fx.interval=13,b.fx.start=function(){Un||(Un=setInterval(b.fx.tick,b.fx.interval))},b.fx.stop=function(){clearInterval(Un),Un=null},b.fx.speeds={slow:600,fast:200,_default:400},b.fx.step={},b.expr&&b.expr.filters&&(b.expr.filters.animated=function(e){return b.grep(b.timers,function(t){return e===t.elem}).length}),b.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){b.offset.setOffset(this,e,t)});var n,r,o={top:0,left:0},a=this[0],s=a&&a.ownerDocument;if(s)return n=s.documentElement,b.contains(n,a)?(typeof a.getBoundingClientRect!==i&&(o=a.getBoundingClientRect()),r=or(s),{top:o.top+(r.pageYOffset||n.scrollTop)-(n.clientTop||0),left:o.left+(r.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):o},b.offset={setOffset:function(e,t,n){var r=b.css(e,"position");"static"===r&&(e.style.position="relative");var i=b(e),o=i.offset(),a=b.css(e,"top"),s=b.css(e,"left"),u=("absolute"===r||"fixed"===r)&&b.inArray("auto",[a,s])>-1,l={},c={},p,f;u?(c=i.position(),p=c.top,f=c.left):(p=parseFloat(a)||0,f=parseFloat(s)||0),b.isFunction(t)&&(t=t.call(e,n,o)),null!=t.top&&(l.top=t.top-o.top+p),null!=t.left&&(l.left=t.left-o.left+f),"using"in t?t.using.call(e,l):i.css(l)}},b.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===b.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),b.nodeName(e[0],"html")||(n=e.offset()),n.top+=b.css(e[0],"borderTopWidth",!0),n.left+=b.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-b.css(r,"marginTop",!0),left:t.left-n.left-b.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||o.documentElement;while(e&&!b.nodeName(e,"html")&&"static"===b.css(e,"position"))e=e.offsetParent;return e||o.documentElement})}}),b.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);b.fn[e]=function(i){return b.access(this,function(e,i,o){var a=or(e);return o===t?a?n in a?a[n]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(r?b(a).scrollLeft():o,r?o:b(a).scrollTop()):e[i]=o,t)},e,i,arguments.length,null)}});function or(e){return b.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}b.each({Height:"height",Width:"width"},function(e,n){b.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){b.fn[i]=function(i,o){var a=arguments.length&&(r||"boolean"!=typeof i),s=r||(i===!0||o===!0?"margin":"border");return b.access(this,function(n,r,i){var o;return b.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(o=n.documentElement,Math.max(n.body["scroll"+e],o["scroll"+e],n.body["offset"+e],o["offset"+e],o["client"+e])):i===t?b.css(n,r,s):b.style(n,r,i,s)},n,a?i:t,a,null)}})}),e.jQuery=e.$=b,"function"==typeof define&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return b})})(window);/* Javascript plotting library for jQuery, version 0.8.1.

Copyright (c) 2007-2013 IOLA and Ole Laursen.
Licensed under the MIT license.

*/// first an inline dependency, jquery.colorhelpers.js, we inline it here
// for convenience
/* Plugin for jQuery for working with colors.
 *
 * Version 1.1.
 *
 * Inspiration from jQuery color animation plugin by John Resig.
 *
 * Released under the MIT license by Ole Laursen, October 2009.
 *
 * Examples:
 *
 *   $.color.parse("#fff").scale('rgb', 0.25).add('a', -0.5).toString()
 *   var c = $.color.extract($("#mydiv"), 'background-color');
 *   console.log(c.r, c.g, c.b, c.a);
 *   $.color.make(100, 50, 25, 0.4).toString() // returns "rgba(100,50,25,0.4)"
 *
 * Note that .scale() and .add() return the same modified object
 * instead of making a new one.
 *
 * V. 1.1: Fix error handling so e.g. parsing an empty string does
 * produce a color rather than just crashing.
 */(function(e){e.color={},e.color.make=function(t,n,r,i){var s={};return s.r=t||0,s.g=n||0,s.b=r||0,s.a=i!=null?i:1,s.add=function(e,t){for(var n=0;n<e.length;++n)s[e.charAt(n)]+=t;return s.normalize()},s.scale=function(e,t){for(var n=0;n<e.length;++n)s[e.charAt(n)]*=t;return s.normalize()},s.toString=function(){return s.a>=1?"rgb("+[s.r,s.g,s.b].join(",")+")":"rgba("+[s.r,s.g,s.b,s.a].join(",")+")"},s.normalize=function(){function e(e,t,n){return t<e?e:t>n?n:t}return s.r=e(0,parseInt(s.r),255),s.g=e(0,parseInt(s.g),255),s.b=e(0,parseInt(s.b),255),s.a=e(0,s.a,1),s},s.clone=function(){return e.color.make(s.r,s.b,s.g,s.a)},s.normalize()},e.color.extract=function(t,n){var r;do{r=t.css(n).toLowerCase();if(r!=""&&r!="transparent")break;t=t.parent()}while(!e.nodeName(t.get(0),"body"));return r=="rgba(0, 0, 0, 0)"&&(r="transparent"),e.color.parse(r)},e.color.parse=function(n){var r,i=e.color.make;if(r=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(n))return i(parseInt(r[1],10),parseInt(r[2],10),parseInt(r[3],10));if(r=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(n))return i(parseInt(r[1],10),parseInt(r[2],10),parseInt(r[3],10),parseFloat(r[4]));if(r=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(n))return i(parseFloat(r[1])*2.55,parseFloat(r[2])*2.55,parseFloat(r[3])*2.55);if(r=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(n))return i(parseFloat(r[1])*2.55,parseFloat(r[2])*2.55,parseFloat(r[3])*2.55,parseFloat(r[4]));if(r=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(n))return i(parseInt(r[1],16),parseInt(r[2],16),parseInt(r[3],16));if(r=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(n))return i(parseInt(r[1]+r[1],16),parseInt(r[2]+r[2],16),parseInt(r[3]+r[3],16));var s=e.trim(n).toLowerCase();return s=="transparent"?i(255,255,255,0):(r=t[s]||[0,0,0],i(r[0],r[1],r[2]))};var t={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]}})(jQuery),function(e){function n(t,n){var r=n.children("."+t)[0];if(r==null){r=document.createElement("canvas"),r.className=t,e(r).css({direction:"ltr",position:"absolute",left:0,top:0}).appendTo(n);if(!r.getContext){if(!window.G_vmlCanvasManager)throw new Error("Canvas is not available. If you're using IE with a fall-back such as Excanvas, then there's either a mistake in your conditional include, or the page has no DOCTYPE and is rendering in Quirks Mode.");r=window.G_vmlCanvasManager.initElement(r)}}this.element=r;var i=this.context=r.getContext("2d"),s=window.devicePixelRatio||1,o=i.webkitBackingStorePixelRatio||i.mozBackingStorePixelRatio||i.msBackingStorePixelRatio||i.oBackingStorePixelRatio||i.backingStorePixelRatio||1;this.pixelRatio=s/o,this.resize(n.width(),n.height()),this.textContainer=null,this.text={},this._textCache={}}function r(t,r,s,o){function E(e,t){t=[w].concat(t);for(var n=0;n<e.length;++n)e[n].apply(this,t)}function S(){var t={Canvas:n};for(var r=0;r<o.length;++r){var i=o[r];i.init(w,t),i.options&&e.extend(!0,a,i.options)}}function x(n){e.extend(!0,a,n),n&&n.colors&&(a.colors=n.colors),a.xaxis.color==null&&(a.xaxis.color=e.color.parse(a.grid.color).scale("a",.22).toString()),a.yaxis.color==null&&(a.yaxis.color=e.color.parse(a.grid.color).scale("a",.22).toString()),a.xaxis.tickColor==null&&(a.xaxis.tickColor=a.grid.tickColor||a.xaxis.color),a.yaxis.tickColor==null&&(a.yaxis.tickColor=a.grid.tickColor||a.yaxis.color),a.grid.borderColor==null&&(a.grid.borderColor=a.grid.color),a.grid.tickColor==null&&(a.grid.tickColor=e.color.parse(a.grid.color).scale("a",.22).toString());var r,i,s,o={style:t.css("font-style"),size:Math.round(.8*(+t.css("font-size").replace("px","")||13)),variant:t.css("font-variant"),weight:t.css("font-weight"),family:t.css("font-family")};o.lineHeight=o.size*1.15,s=a.xaxes.length||1;for(r=0;r<s;++r)i=a.xaxes[r],i&&!i.tickColor&&(i.tickColor=i.color),i=e.extend(!0,{},a.xaxis,i),a.xaxes[r]=i,i.font&&(i.font=e.extend({},o,i.font),i.font.color||(i.font.color=i.color));s=a.yaxes.length||1;for(r=0;r<s;++r)i=a.yaxes[r],i&&!i.tickColor&&(i.tickColor=i.color),i=e.extend(!0,{},a.yaxis,i),a.yaxes[r]=i,i.font&&(i.font=e.extend({},o,i.font),i.font.color||(i.font.color=i.color));a.xaxis.noTicks&&a.xaxis.ticks==null&&(a.xaxis.ticks=a.xaxis.noTicks),a.yaxis.noTicks&&a.yaxis.ticks==null&&(a.yaxis.ticks=a.yaxis.noTicks),a.x2axis&&(a.xaxes[1]=e.extend(!0,{},a.xaxis,a.x2axis),a.xaxes[1].position="top"),a.y2axis&&(a.yaxes[1]=e.extend(!0,{},a.yaxis,a.y2axis),a.yaxes[1].position="right"),a.grid.coloredAreas&&(a.grid.markings=a.grid.coloredAreas),a.grid.coloredAreasColor&&(a.grid.markingsColor=a.grid.coloredAreasColor),a.lines&&e.extend(!0,a.series.lines,a.lines),a.points&&e.extend(!0,a.series.points,a.points),a.bars&&e.extend(!0,a.series.bars,a.bars),a.shadowSize!=null&&(a.series.shadowSize=a.shadowSize),a.highlightColor!=null&&(a.series.highlightColor=a.highlightColor);for(r=0;r<a.xaxes.length;++r)O(d,r+1).options=a.xaxes[r];for(r=0;r<a.yaxes.length;++r)O(v,r+1).options=a.yaxes[r];for(var u in b)a.hooks[u]&&a.hooks[u].length&&(b[u]=b[u].concat(a.hooks[u]));E(b.processOptions,[a])}function T(e){u=N(e),M(),_()}function N(t){var n=[];for(var r=0;r<t.length;++r){var i=e.extend(!0,{},a.series);t[r].data!=null?(i.data=t[r].data,delete t[r].data,e.extend(!0,i,t[r]),t[r].data=i.data):i.data=t[r],n.push(i)}return n}function C(e,t){var n=e[t+"axis"];return typeof n=="object"&&(n=n.n),typeof n!="number"&&(n=1),n}function k(){return e.grep(d.concat(v),function(e){return e})}function L(e){var t={},n,r;for(n=0;n<d.length;++n)r=d[n],r&&r.used&&(t["x"+r.n]=r.c2p(e.left));for(n=0;n<v.length;++n)r=v[n],r&&r.used&&(t["y"+r.n]=r.c2p(e.top));return t.x1!==undefined&&(t.x=t.x1),t.y1!==undefined&&(t.y=t.y1),t}function A(e){var t={},n,r,i;for(n=0;n<d.length;++n){r=d[n];if(r&&r.used){i="x"+r.n,e[i]==null&&r.n==1&&(i="x");if(e[i]!=null){t.left=r.p2c(e[i]);break}}}for(n=0;n<v.length;++n){r=v[n];if(r&&r.used){i="y"+r.n,e[i]==null&&r.n==1&&(i="y");if(e[i]!=null){t.top=r.p2c(e[i]);break}}}return t}function O(t,n){return t[n-1]||(t[n-1]={n:n,direction:t==d?"x":"y",options:e.extend(!0,{},t==d?a.xaxis:a.yaxis)}),t[n-1]}function M(){var t=u.length,n=-1,r;for(r=0;r<u.length;++r){var i=u[r].color;i!=null&&(t--,typeof i=="number"&&i>n&&(n=i))}t<=n&&(t=n+1);var s,o=[],f=a.colors,l=f.length,c=0;for(r=0;r<t;r++)s=e.color.parse(f[r%l]||"#666"),r%l==0&&r&&(c>=0?c<.5?c=-c-.2:c=0:c=-c),o[r]=s.scale("rgb",1+c);var h=0,p;for(r=0;r<u.length;++r){p=u[r],p.color==null?(p.color=o[h].toString(),++h):typeof p.color=="number"&&(p.color=o[p.color].toString());if(p.lines.show==null){var m,g=!0;for(m in p)if(p[m]&&p[m].show){g=!1;break}g&&(p.lines.show=!0)}p.lines.zero==null&&(p.lines.zero=!!p.lines.fill),p.xaxis=O(d,C(p,"x")),p.yaxis=O(v,C(p,"y"))}}function _(){function x(e,t,n){t<e.datamin&&t!=-r&&(e.datamin=t),n>e.datamax&&n!=r&&(e.datamax=n)}var t=Number.POSITIVE_INFINITY,n=Number.NEGATIVE_INFINITY,r=Number.MAX_VALUE,i,s,o,a,f,l,c,h,p,d,v,m,g,y,w,S;e.each(k(),function(e,r){r.datamin=t,r.datamax=n,r.used=!1});for(i=0;i<u.length;++i)l=u[i],l.datapoints={points:[]},E(b.processRawData,[l,l.data,l.datapoints]);for(i=0;i<u.length;++i){l=u[i],w=l.data,S=l.datapoints.format;if(!S){S=[],S.push({x:!0,number:!0,required:!0}),S.push({y:!0,number:!0,required:!0});if(l.bars.show||l.lines.show&&l.lines.fill){var T=!!(l.bars.show&&l.bars.zero||l.lines.show&&l.lines.zero);S.push({y:!0,number:!0,required:!1,defaultValue:0,autoscale:T}),l.bars.horizontal&&(delete S[S.length-1].y,S[S.length-1].x=!0)}l.datapoints.format=S}if(l.datapoints.pointsize!=null)continue;l.datapoints.pointsize=S.length,h=l.datapoints.pointsize,c=l.datapoints.points;var N=l.lines.show&&l.lines.steps;l.xaxis.used=l.yaxis.used=!0;for(s=o=0;s<w.length;++s,o+=h){y=w[s];var C=y==null;if(!C)for(a=0;a<h;++a)m=y[a],g=S[a],g&&(g.number&&m!=null&&(m=+m,isNaN(m)?m=null:m==Infinity?m=r:m==-Infinity&&(m=-r)),m==null&&(g.required&&(C=!0),g.defaultValue!=null&&(m=g.defaultValue))),c[o+a]=m;if(C)for(a=0;a<h;++a)m=c[o+a],m!=null&&(g=S[a],g.autoscale&&(g.x&&x(l.xaxis,m,m),g.y&&x(l.yaxis,m,m))),c[o+a]=null;else if(N&&o>0&&c[o-h]!=null&&c[o-h]!=c[o]&&c[o-h+1]!=c[o+1]){for(a=0;a<h;++a)c[o+h+a]=c[o+a];c[o+1]=c[o-h+1],o+=h}}}for(i=0;i<u.length;++i)l=u[i],E(b.processDatapoints,[l,l.datapoints]);for(i=0;i<u.length;++i){l=u[i],c=l.datapoints.points,h=l.datapoints.pointsize,S=l.datapoints.format;var L=t,A=t,O=n,M=n;for(s=0;s<c.length;s+=h){if(c[s]==null)continue;for(a=0;a<h;++a){m=c[s+a],g=S[a];if(!g||g.autoscale===!1||m==r||m==-r)continue;g.x&&(m<L&&(L=m),m>O&&(O=m)),g.y&&(m<A&&(A=m),m>M&&(M=m))}}if(l.bars.show){var _;switch(l.bars.align){case"left":_=0;break;case"right":_=-l.bars.barWidth;break;case"center":_=-l.bars.barWidth/2;break;default:throw new Error("Invalid bar alignment: "+l.bars.align)}l.bars.horizontal?(A+=_,M+=_+l.bars.barWidth):(L+=_,O+=_+l.bars.barWidth)}x(l.xaxis,L,O),x(l.yaxis,A,M)}e.each(k(),function(e,r){r.datamin==t&&(r.datamin=null),r.datamax==n&&(r.datamax=null)})}function D(){t.css("padding",0).children(":not(.flot-base,.flot-overlay)").remove(),t.css("position")=="static"&&t.css("position","relative"),f=new n("flot-base",t),l=new n("flot-overlay",t),h=f.context,p=l.context,c=e(l.element).unbind();var r=t.data("plot");r&&(r.shutdown(),l.clear()),t.data("plot",w)}function P(){a.grid.hoverable&&(c.mousemove(at),c.bind("mouseleave",ft)),a.grid.clickable&&c.click(lt),E(b.bindEvents,[c])}function H(){ot&&clearTimeout(ot),c.unbind("mousemove",at),c.unbind("mouseleave",ft),c.unbind("click",lt),E(b.shutdown,[c])}function B(e){function t(e){return e}var n,r,i=e.options.transform||t,s=e.options.inverseTransform;e.direction=="x"?(n=e.scale=g/Math.abs(i(e.max)-i(e.min)),r=Math.min(i(e.max),i(e.min))):(n=e.scale=y/Math.abs(i(e.max)-i(e.min)),n=-n,r=Math.max(i(e.max),i(e.min))),i==t?e.p2c=function(e){return(e-r)*n}:e.p2c=function(e){return(i(e)-r)*n},s?e.c2p=function(e){return s(r+e/n)}:e.c2p=function(e){return r+e/n}}function j(e){var t=e.options,n=e.ticks||[],r=t.labelWidth||0,i=t.labelHeight||0,s=r||e.direction=="x"?Math.floor(f.width/(n.length||1)):null;legacyStyles=e.direction+"Axis "+e.direction+e.n+"Axis",layer="flot-"+e.direction+"-axis flot-"+e.direction+e.n+"-axis "+legacyStyles,font=t.font||"flot-tick-label tickLabel";for(var o=0;o<n.length;++o){var u=n[o];if(!u.label)continue;var a=f.getTextInfo(layer,u.label,font,null,s);r=Math.max(r,a.width),i=Math.max(i,a.height)}e.labelWidth=t.labelWidth||r,e.labelHeight=t.labelHeight||i}function F(t){var n=t.labelWidth,r=t.labelHeight,i=t.options.position,s=t.options.tickLength,o=a.grid.axisMargin,u=a.grid.labelMargin,l=t.direction=="x"?d:v,c,h,p=e.grep(l,function(e){return e&&e.options.position==i&&e.reserveSpace});e.inArray(t,p)==p.length-1&&(o=0);if(s==null){var g=e.grep(l,function(e){return e&&e.reserveSpace});h=e.inArray(t,g)==0,h?s="full":s=5}isNaN(+s)||(u+=+s),t.direction=="x"?(r+=u,i=="bottom"?(m.bottom+=r+o,t.box={top:f.height-m.bottom,height:r}):(t.box={top:m.top+o,height:r},m.top+=r+o)):(n+=u,i=="left"?(t.box={left:m.left+o,width:n},m.left+=n+o):(m.right+=n+o,t.box={left:f.width-m.right,width:n})),t.position=i,t.tickLength=s,t.box.padding=u,t.innermost=h}function I(e){e.direction=="x"?(e.box.left=m.left-e.labelWidth/2,e.box.width=f.width-m.left-m.right+e.labelWidth):(e.box.top=m.top-e.labelHeight/2,e.box.height=f.height-m.bottom-m.top+e.labelHeight)}function q(){var t=a.grid.minBorderMargin,n={x:0,y:0},r,i;if(t==null){t=0;for(r=0;r<u.length;++r)t=Math.max(t,2*(u[r].points.radius+u[r].points.lineWidth/2))}n.x=n.y=Math.ceil(t),e.each(k(),function(e,t){var r=t.direction;t.reserveSpace&&(n[r]=Math.ceil(Math.max(n[r],(r=="x"?t.labelWidth:t.labelHeight)/2)))}),m.left=Math.max(n.x,m.left),m.right=Math.max(n.x,m.right),m.top=Math.max(n.y,m.top),m.bottom=Math.max(n.y,m.bottom)}function R(){var t,n=k(),r=a.grid.show;for(var i in m){var s=a.grid.margin||0;m[i]=typeof s=="number"?s:s[i]||0}E(b.processOffset,[m]);for(var i in m)typeof a.grid.borderWidth=="object"?m[i]+=r?a.grid.borderWidth[i]:0:m[i]+=r?a.grid.borderWidth:0;e.each(n,function(e,t){t.show=t.options.show,t.show==null&&(t.show=t.used),t.reserveSpace=t.show||t.options.reserveSpace,U(t)});if(r){var o=e.grep(n,function(e){return e.reserveSpace});e.each(o,function(e,t){z(t),W(t),X(t,t.ticks),j(t)});for(t=o.length-1;t>=0;--t)F(o[t]);q(),e.each(o,function(e,t){I(t)})}g=f.width-m.left-m.right,y=f.height-m.bottom-m.top,e.each(n,function(e,t){B(t)}),r&&G(),it()}function U(e){var t=e.options,n=+(t.min!=null?t.min:e.datamin),r=+(t.max!=null?t.max:e.datamax),i=r-n;if(i==0){var s=r==0?1:.01;t.min==null&&(n-=s);if(t.max==null||t.min!=null)r+=s}else{var o=t.autoscaleMargin;o!=null&&(t.min==null&&(n-=i*o,n<0&&e.datamin!=null&&e.datamin>=0&&(n=0)),t.max==null&&(r+=i*o,r>0&&e.datamax!=null&&e.datamax<=0&&(r=0)))}e.min=n,e.max=r}function z(t){var n=t.options,r;typeof n.ticks=="number"&&n.ticks>0?r=n.ticks:r=.3*Math.sqrt(t.direction=="x"?f.width:f.height);var s=(t.max-t.min)/r,o=-Math.floor(Math.log(s)/Math.LN10),u=n.tickDecimals;u!=null&&o>u&&(o=u);var a=Math.pow(10,-o),l=s/a,c;l<1.5?c=1:l<3?(c=2,l>2.25&&(u==null||o+1<=u)&&(c=2.5,++o)):l<7.5?c=5:c=10,c*=a,n.minTickSize!=null&&c<n.minTickSize&&(c=n.minTickSize),t.delta=s,t.tickDecimals=Math.max(0,u!=null?u:o),t.tickSize=n.tickSize||c;if(n.mode=="time"&&!t.tickGenerator)throw new Error("Time mode requires the flot.time plugin.");t.tickGenerator||(t.tickGenerator=function(e){var t=[],n=i(e.min,e.tickSize),r=0,s=Number.NaN,o;do o=s,s=n+r*e.tickSize,t.push(s),++r;while(s<e.max&&s!=o);return t},t.tickFormatter=function(e,t){var n=t.tickDecimals?Math.pow(10,t.tickDecimals):1,r=""+Math.round(e*n)/n;if(t.tickDecimals!=null){var i=r.indexOf("."),s=i==-1?0:r.length-i-1;if(s<t.tickDecimals)return(s?r:r+".")+(""+n).substr(1,t.tickDecimals-s)}return r}),e.isFunction(n.tickFormatter)&&(t.tickFormatter=function(e,t){return""+n.tickFormatter(e,t)});if(n.alignTicksWithAxis!=null){var h=(t.direction=="x"?d:v)[n.alignTicksWithAxis-1];if(h&&h.used&&h!=t){var p=t.tickGenerator(t);p.length>0&&(n.min==null&&(t.min=Math.min(t.min,p[0])),n.max==null&&p.length>1&&(t.max=Math.max(t.max,p[p.length-1]))),t.tickGenerator=function(e){var t=[],n,r;for(r=0;r<h.ticks.length;++r)n=(h.ticks[r].v-h.min)/(h.max-h.min),n=e.min+n*(e.max-e.min),t.push(n);return t};if(!t.mode&&n.tickDecimals==null){var m=Math.max(0,-Math.floor(Math.log(t.delta)/Math.LN10)+1),g=t.tickGenerator(t);g.length>1&&/\..*0$/.test((g[1]-g[0]).toFixed(m))||(t.tickDecimals=m)}}}}function W(t){var n=t.options.ticks,r=[];n==null||typeof n=="number"&&n>0?r=t.tickGenerator(t):n&&(e.isFunction(n)?r=n(t):r=n);var i,s;t.ticks=[];for(i=0;i<r.length;++i){var o=null,u=r[i];typeof u=="object"?(s=+u[0],u.length>1&&(o=u[1])):s=+u,o==null&&(o=t.tickFormatter(s,t)),isNaN(s)||t.ticks.push({v:s,label:o})}}function X(e,t){e.options.autoscaleMargin&&t.length>0&&(e.options.min==null&&(e.min=Math.min(e.min,t[0].v)),e.options.max==null&&t.length>1&&(e.max=Math.max(e.max,t[t.length-1].v)))}function V(){f.clear(),E(b.drawBackground,[h]);var e=a.grid;e.show&&e.backgroundColor&&K(),e.show&&!e.aboveData&&Q();for(var t=0;t<u.length;++t)E(b.drawSeries,[h,u[t]]),Y(u[t]);E(b.draw,[h]),e.show&&e.aboveData&&Q(),f.render(),ht()}function J(e,t){var n,r,i,s,o=k();for(var u=0;u<o.length;++u){n=o[u];if(n.direction==t){s=t+n.n+"axis",!e[s]&&n.n==1&&(s=t+"axis");if(e[s]){r=e[s].from,i=e[s].to;break}}}e[s]||(n=t=="x"?d[0]:v[0],r=e[t+"1"],i=e[t+"2"]);if(r!=null&&i!=null&&r>i){var a=r;r=i,i=a}return{from:r,to:i,axis:n}}function K(){h.save(),h.translate(m.left,m.top),h.fillStyle=bt(a.grid.backgroundColor,y,0,"rgba(255, 255, 255, 0)"),h.fillRect(0,0,g,y),h.restore()}function Q(){var t,n,r,i;h.save(),h.translate(m.left,m.top);var s=a.grid.markings;if(s){e.isFunction(s)&&(n=w.getAxes(),n.xmin=n.xaxis.min,n.xmax=n.xaxis.max,n.ymin=n.yaxis.min,n.ymax=n.yaxis.max,s=s(n));for(t=0;t<s.length;++t){var o=s[t],u=J(o,"x"),f=J(o,"y");u.from==null&&(u.from=u.axis.min),u.to==null&&(u.to=u.axis.max),f.from==null&&(f.from=f.axis.min),f.to==null&&(f.to=f.axis.max);if(u.to<u.axis.min||u.from>u.axis.max||f.to<f.axis.min||f.from>f.axis.max)continue;u.from=Math.max(u.from,u.axis.min),u.to=Math.min(u.to,u.axis.max),f.from=Math.max(f.from,f.axis.min),f.to=Math.min(f.to,f.axis.max);if(u.from==u.to&&f.from==f.to)continue;u.from=u.axis.p2c(u.from),u.to=u.axis.p2c(u.to),f.from=f.axis.p2c(f.from),f.to=f.axis.p2c(f.to),u.from==u.to||f.from==f.to?(h.beginPath(),h.strokeStyle=o.color||a.grid.markingsColor,h.lineWidth=o.lineWidth||a.grid.markingsLineWidth,h.moveTo(u.from,f.from),h.lineTo(u.to,f.to),h.stroke()):(h.fillStyle=o.color||a.grid.markingsColor,h.fillRect(u.from,f.to,u.to-u.from,f.from-f.to))}}n=k(),r=a.grid.borderWidth;for(var l=0;l<n.length;++l){var c=n[l],p=c.box,d=c.tickLength,v,b,E,S;if(!c.show||c.ticks.length==0)continue;h.lineWidth=1,c.direction=="x"?(v=0,d=="full"?b=c.position=="top"?0:y:b=p.top-m.top+(c.position=="top"?p.height:0)):(b=0,d=="full"?v=c.position=="left"?0:g:v=p.left-m.left+(c.position=="left"?p.width:0)),c.innermost||(h.strokeStyle=c.options.color,h.beginPath(),E=S=0,c.direction=="x"?E=g+1:S=y+1,h.lineWidth==1&&(c.direction=="x"?b=Math.floor(b)+.5:v=Math.floor(v)+.5),h.moveTo(v,b),h.lineTo(v+E,b+S),h.stroke()),h.strokeStyle=c.options.tickColor,h.beginPath();for(t=0;t<c.ticks.length;++t){var x=c.ticks[t].v;E=S=0;if(isNaN(x)||x<c.min||x>c.max||d=="full"&&(typeof r=="object"&&r[c.position]>0||r>0)&&(x==c.min||x==c.max))continue;c.direction=="x"?(v=c.p2c(x),S=d=="full"?-y:d,c.position=="top"&&(S=-S)):(b=c.p2c(x),E=d=="full"?-g:d,c.position=="left"&&(E=-E)),h.lineWidth==1&&(c.direction=="x"?v=Math.floor(v)+.5:b=Math.floor(b)+.5),h.moveTo(v,b),h.lineTo(v+E,b+S)}h.stroke()}r&&(i=a.grid.borderColor,typeof r=="object"||typeof i=="object"?(typeof r!="object"&&(r={top:r,right:r,bottom:r,left:r}),typeof i!="object"&&(i={top:i,right:i,bottom:i,left:i}),r.top>0&&(h.strokeStyle=i.top,h.lineWidth=r.top,h.beginPath(),h.moveTo(0-r.left,0-r.top/2),h.lineTo(g,0-r.top/2),h.stroke()),r.right>0&&(h.strokeStyle=i.right,h.lineWidth=r.right,h.beginPath(),h.moveTo(g+r.right/2,0-r.top),h.lineTo(g+r.right/2,y),h.stroke()),r.bottom>0&&(h.strokeStyle=i.bottom,h.lineWidth=r.bottom,h.beginPath(),h.moveTo(g+r.right,y+r.bottom/2),h.lineTo(0,y+r.bottom/2),h.stroke()),r.left>0&&(h.strokeStyle=i.left,h.lineWidth=r.left,h.beginPath(),h.moveTo(0-r.left/2,y+r.bottom),h.lineTo(0-r.left/2,0),h.stroke())):(h.lineWidth=r,h.strokeStyle=a.grid.borderColor,h.strokeRect(-r/2,-r/2,g+r,y+r))),h.restore()}function G(){e.each(k(),function(e,t){if(!t.show||t.ticks.length==0)return;var n=t.box,r=t.direction+"Axis "+t.direction+t.n+"Axis",i="flot-"+t.direction+"-axis flot-"+t.direction+t.n+"-axis "+r,s=t.options.font||"flot-tick-label tickLabel",o,u,a,l,c;f.removeText(i);for(var h=0;h<t.ticks.length;++h){o=t.ticks[h];if(!o.label||o.v<t.min||o.v>t.max)continue;t.direction=="x"?(l="center",u=m.left+t.p2c(o.v),t.position=="bottom"?a=n.top+n.padding:(a=n.top+n.height-n.padding,c="bottom")):(c="middle",a=m.top+t.p2c(o.v),t.position=="left"?(u=n.left+n.width-n.padding,l="right"):u=n.left+n.padding),f.addText(i,u,a,o.label,s,null,null,l,c)}})}function Y(e){e.lines.show&&Z(e),e.bars.show&&nt(e),e.points.show&&et(e)}function Z(e){function t(e,t,n,r,i){var s=e.points,o=e.pointsize,u=null,a=null;h.beginPath();for(var f=o;f<s.length;f+=o){var l=s[f-o],c=s[f-o+1],p=s[f],d=s[f+1];if(l==null||p==null)continue;if(c<=d&&c<i.min){if(d<i.min)continue;l=(i.min-c)/(d-c)*(p-l)+l,c=i.min}else if(d<=c&&d<i.min){if(c<i.min)continue;p=(i.min-c)/(d-c)*(p-l)+l,d=i.min}if(c>=d&&c>i.max){if(d>i.max)continue;l=(i.max-c)/(d-c)*(p-l)+l,c=i.max}else if(d>=c&&d>i.max){if(c>i.max)continue;p=(i.max-c)/(d-c)*(p-l)+l,d=i.max}if(l<=p&&l<r.min){if(p<r.min)continue;c=(r.min-l)/(p-l)*(d-c)+c,l=r.min}else if(p<=l&&p<r.min){if(l<r.min)continue;d=(r.min-l)/(p-l)*(d-c)+c,p=r.min}if(l>=p&&l>r.max){if(p>r.max)continue;c=(r.max-l)/(p-l)*(d-c)+c,l=r.max}else if(p>=l&&p>r.max){if(l>r.max)continue;d=(r.max-l)/(p-l)*(d-c)+c,p=r.max}(l!=u||c!=a)&&h.moveTo(r.p2c(l)+t,i.p2c(c)+n),u=p,a=d,h.lineTo(r.p2c(p)+t,i.p2c(d)+n)}h.stroke()}function n(e,t,n){var r=e.points,i=e.pointsize,s=Math.min(Math.max(0,n.min),n.max),o=0,u,a=!1,f=1,l=0,c=0;for(;;){if(i>0&&o>r.length+i)break;o+=i;var p=r[o-i],d=r[o-i+f],v=r[o],m=r[o+f];if(a){if(i>0&&p!=null&&v==null){c=o,i=-i,f=2;continue}if(i<0&&o==l+i){h.fill(),a=!1,i=-i,f=1,o=l=c+i;continue}}if(p==null||v==null)continue;if(p<=v&&p<t.min){if(v<t.min)continue;d=(t.min-p)/(v-p)*(m-d)+d,p=t.min}else if(v<=p&&v<t.min){if(p<t.min)continue;m=(t.min-p)/(v-p)*(m-d)+d,v=t.min}if(p>=v&&p>t.max){if(v>t.max)continue;d=(t.max-p)/(v-p)*(m-d)+d,p=t.max}else if(v>=p&&v>t.max){if(p>t.max)continue;m=(t.max-p)/(v-p)*(m-d)+d,v=t.max}a||(h.beginPath(),h.moveTo(t.p2c(p),n.p2c(s)),a=!0);if(d>=n.max&&m>=n.max){h.lineTo(t.p2c(p),n.p2c(n.max)),h.lineTo(t.p2c(v),n.p2c(n.max));continue}if(d<=n.min&&m<=n.min){h.lineTo(t.p2c(p),n.p2c(n.min)),h.lineTo(t.p2c(v),n.p2c(n.min));continue}var g=p,y=v;d<=m&&d<n.min&&m>=n.min?(p=(n.min-d)/(m-d)*(v-p)+p,d=n.min):m<=d&&m<n.min&&d>=n.min&&(v=(n.min-d)/(m-d)*(v-p)+p,m=n.min),d>=m&&d>n.max&&m<=n.max?(p=(n.max-d)/(m-d)*(v-p)+p,d=n.max):m>=d&&m>n.max&&d<=n.max&&(v=(n.max-d)/(m-d)*(v-p)+p,m=n.max),p!=g&&h.lineTo(t.p2c(g),n.p2c(d)),h.lineTo(t.p2c(p),n.p2c(d)),h.lineTo(t.p2c(v),n.p2c(m)),v!=y&&(h.lineTo(t.p2c(v),n.p2c(m)),h.lineTo(t.p2c(y),n.p2c(m)))}}h.save(),h.translate(m.left,m.top),h.lineJoin="round";var r=e.lines.lineWidth,i=e.shadowSize;if(r>0&&i>0){h.lineWidth=i,h.strokeStyle="rgba(0,0,0,0.1)";var s=Math.PI/18;t(e.datapoints,Math.sin(s)*(r/2+i/2),Math.cos(s)*(r/2+i/2),e.xaxis,e.yaxis),h.lineWidth=i/2,t(e.datapoints,Math.sin(s)*(r/2+i/4),Math.cos(s)*(r/2+i/4),e.xaxis,e.yaxis)}h.lineWidth=r,h.strokeStyle=e.color;var o=rt(e.lines,e.color,0,y);o&&(h.fillStyle=o,n(e.datapoints,e.xaxis,e.yaxis)),r>0&&t(e.datapoints,0,0,e.xaxis,e.yaxis),h.restore()}function et(e){function t(e,t,n,r,i,s,o,u){var a=e.points,f=e.pointsize;for(var l=0;l<a.length;l+=f){var c=a[l],p=a[l+1];if(c==null||c<s.min||c>s.max||p<o.min||p>o.max)continue;h.beginPath(),c=s.p2c(c),p=o.p2c(p)+r,u=="circle"?h.arc(c,p,t,0,i?Math.PI:Math.PI*2,!1):u(h,c,p,t,i),h.closePath(),n&&(h.fillStyle=n,h.fill()),h.stroke()}}h.save(),h.translate(m.left,m.top);var n=e.points.lineWidth,r=e.shadowSize,i=e.points.radius,s=e.points.symbol;n==0&&(n=1e-4);if(n>0&&r>0){var o=r/2;h.lineWidth=o,h.strokeStyle="rgba(0,0,0,0.1)",t(e.datapoints,i,null,o+o/2,!0,e.xaxis,e.yaxis,s),h.strokeStyle="rgba(0,0,0,0.2)",t(e.datapoints,i,null,o/2,!0,e.xaxis,e.yaxis,s)}h.lineWidth=n,h.strokeStyle=e.color,t(e.datapoints,i,rt(e.points,e.color),0,!1,e.xaxis,e.yaxis,s),h.restore()}function tt(e,t,n,r,i,s,o,u,a,f,l,c){var h,p,d,v,m,g,y,b,w;l?(b=g=y=!0,m=!1,h=n,p=e,v=t+r,d=t+i,p<h&&(w=p,p=h,h=w,m=!0,g=!1)):(m=g=y=!0,b=!1,h=e+r,p=e+i,d=n,v=t,v<d&&(w=v,v=d,d=w,b=!0,y=!1));if(p<u.min||h>u.max||v<a.min||d>a.max)return;h<u.min&&(h=u.min,m=!1),p>u.max&&(p=u.max,g=!1),d<a.min&&(d=a.min,b=!1),v>a.max&&(v=a.max,y=!1),h=u.p2c(h),d=a.p2c(d),p=u.p2c(p),v=a.p2c(v),o&&(f.beginPath(),f.moveTo(h,d),f.lineTo(h,v),f.lineTo(p,v),f.lineTo(p,d),f.fillStyle=o(d,v),f.fill()),c>0&&(m||g||y||b)&&(f.beginPath(),f.moveTo(h,d+s),m?f.lineTo(h,v+s):f.moveTo(h,v+s),y?f.lineTo(p,v+s):f.moveTo(p,v+s),g?f.lineTo(p,d+s):f.moveTo(p,d+s),b?f.lineTo(h,d+s):f.moveTo(h,d+s),f.stroke())}function nt(e){function t(t,n,r,i,s,o,u){var a=t.points,f=t.pointsize;for(var l=0;l<a.length;l+=f){if(a[l]==null)continue;tt(a[l],a[l+1],a[l+2],n,r,i,s,o,u,h,e.bars.horizontal,e.bars.lineWidth)}}h.save(),h.translate(m.left,m.top),h.lineWidth=e.bars.lineWidth,h.strokeStyle=e.color;var n;switch(e.bars.align){case"left":n=0;break;case"right":n=-e.bars.barWidth;break;case"center":n=-e.bars.barWidth/2;break;default:throw new Error("Invalid bar alignment: "+e.bars.align)}var r=e.bars.fill?function(t,n){return rt(e.bars,e.color,t,n)}:null;t(e.datapoints,n,n+e.bars.barWidth,0,r,e.xaxis,e.yaxis),h.restore()}function rt(t,n,r,i){var s=t.fill;if(!s)return null;if(t.fillColor)return bt(t.fillColor,r,i,n);var o=e.color.parse(n);return o.a=typeof s=="number"?s:.4,o.normalize(),o.toString()}function it(){t.find(".legend").remove();if(!a.legend.show)return;var n=[],r=[],i=!1,s=a.legend.labelFormatter,o,f;for(var l=0;l<u.length;++l)o=u[l],o.label&&(f=s?s(o.label,o):o.label,f&&r.push({label:f,color:o.color}));if(a.legend.sorted)if(e.isFunction(a.legend.sorted))r.sort(a.legend.sorted);else if(a.legend.sorted=="reverse")r.reverse();else{var c=a.legend.sorted!="descending";r.sort(function(e,t){return e.label==t.label?0:e.label<t.label!=c?1:-1})}for(var l=0;l<r.length;++l){var h=r[l];l%a.legend.noColumns==0&&(i&&n.push("</tr>"),n.push("<tr>"),i=!0),n.push('<td class="legendColorBox"><div style="border:1px solid '+a.legend.labelBoxBorderColor+';padding:1px"><div style="width:4px;height:0;border:5px solid '+h.color+';overflow:hidden"></div></div></td>'+'<td class="legendLabel">'+h.label+"</td>")}i&&n.push("</tr>");if(n.length==0)return;var p='<table style="font-size:smaller;color:'+a.grid.color+'">'+n.join("")+"</table>";if(a.legend.container!=null)e(a.legend.container).html(p);else{var d="",v=a.legend.position,g=a.legend.margin;g[0]==null&&(g=[g,g]),v.charAt(0)=="n"?d+="top:"+(g[1]+m.top)+"px;":v.charAt(0)=="s"&&(d+="bottom:"+(g[1]+m.bottom)+"px;"),v.charAt(1)=="e"?d+="right:"+(g[0]+m.right)+"px;":v.charAt(1)=="w"&&(d+="left:"+(g[0]+m.left)+"px;");var y=e('<div class="legend">'+p.replace('style="','style="position:absolute;'+d+";")+"</div>").appendTo(t);if(a.legend.backgroundOpacity!=0){var b=a.legend.backgroundColor;b==null&&(b=a.grid.backgroundColor,b&&typeof b=="string"?b=e.color.parse(b):b=e.color.extract(y,"background-color"),b.a=1,b=b.toString());var w=y.children();e('<div style="position:absolute;width:'+w.width()+"px;height:"+w.height()+"px;"+d+"background-color:"+b+';"> </div>').prependTo(y).css("opacity",a.legend.backgroundOpacity)}}}function ut(e,t,n){var r=a.grid.mouseActiveRadius,i=r*r+1,s=null,o=!1,f,l,c;for(f=u.length-1;f>=0;--f){if(!n(u[f]))continue;var h=u[f],p=h.xaxis,d=h.yaxis,v=h.datapoints.points,m=p.c2p(e),g=d.c2p(t),y=r/p.scale,b=r/d.scale;c=h.datapoints.pointsize,p.options.inverseTransform&&(y=Number.MAX_VALUE),d.options.inverseTransform&&(b=Number.MAX_VALUE);if(h.lines.show||h.points.show)for(l=0;l<v.length;l+=c){var w=v[l],E=v[l+1];if(w==null)continue;if(w-m>y||w-m<-y||E-g>b||E-g<-b)continue;var S=Math.abs(p.p2c(w)-e),x=Math.abs(d.p2c(E)-t),T=S*S+x*x;T<i&&(i=T,s=[f,l/c])}if(h.bars.show&&!s){var N=h.bars.align=="left"?0:-h.bars.barWidth/2,C=N+h.bars.barWidth;for(l=0;l<v.length;l+=c){var w=v[l],E=v[l+1],k=v[l+2];if(w==null)continue;if(u[f].bars.horizontal?m<=Math.max(k,w)&&m>=Math.min(k,w)&&g>=E+N&&g<=E+C:m>=w+N&&m<=w+C&&g>=Math.min(k,E)&&g<=Math.max(k,E))s=[f,l/c]}}}return s?(f=s[0],l=s[1],c=u[f].datapoints.pointsize,{datapoint:u[f].datapoints.points.slice(l*c,(l+1)*c),dataIndex:l,series:u[f],seriesIndex:f}):null}function at(e){a.grid.hoverable&&ct("plothover",e,function(e){return e["hoverable"]!=0})}function ft(e){a.grid.hoverable&&ct("plothover",e,function(e){return!1})}function lt(e){ct("plotclick",e,function(e){return e["clickable"]!=0})}function ct(e,n,r){var i=c.offset(),s=n.pageX-i.left-m.left,o=n.pageY-i.top-m.top,u=L({left:s,top:o});u.pageX=n.pageX,u.pageY=n.pageY;var f=ut(s,o,r);f&&(f.pageX=parseInt(f.series.xaxis.p2c(f.datapoint[0])+i.left+m.left,10),f.pageY=parseInt(f.series.yaxis.p2c(f.datapoint[1])+i.top+m.top,10));if(a.grid.autoHighlight){for(var l=0;l<st.length;++l){var h=st[l];h.auto==e&&(!f||h.series!=f.series||h.point[0]!=f.datapoint[0]||h.point[1]!=f.datapoint[1])&&vt(h.series,h.point)}f&&dt(f.series,f.datapoint,e)}t.trigger(e,[u,f])}function ht(){var e=a.interaction.redrawOverlayInterval;if(e==-1){pt();return}ot||(ot=setTimeout(pt,e))}function pt(){ot=null,p.save(),l.clear(),p.translate(m.left,m.top);var e,t;for(e=0;e<st.length;++e)t=st[e],t.series.bars.show?yt(t.series,t.point):gt(t.series,t.point);p.restore(),E(b.drawOverlay,[p])}function dt(e,t,n){typeof e=="number"&&(e=u[e]);if(typeof t=="number"){var r=e.datapoints.pointsize;t=e.datapoints.points.slice(r*t,r*(t+1))}var i=mt(e,t);i==-1?(st.push({series:e,point:t,auto:n}),ht()):n||(st[i].auto=!1)}function vt(e,t){if(e==null&&t==null){st=[],ht();return}typeof e=="number"&&(e=u[e]);if(typeof t=="number"){var n=e.datapoints.pointsize;t=e.datapoints.points.slice(n*t,n*(t+1))}var r=mt(e,t);r!=-1&&(st.splice(r,1),ht())}function mt(e,t){for(var n=0;n<st.length;++n){var r=st[n];if(r.series==e&&r.point[0]==t[0]&&r.point[1]==t[1])return n}return-1}function gt(t,n){var r=n[0],i=n[1],s=t.xaxis,o=t.yaxis,u=typeof t.highlightColor=="string"?t.highlightColor:e.color.parse(t.color).scale("a",.5).toString();if(r<s.min||r>s.max||i<o.min||i>o.max)return;var a=t.points.radius+t.points.lineWidth/2;p.lineWidth=a,p.strokeStyle=u;var f=1.5*a;r=s.p2c(r),i=o.p2c(i),p.beginPath(),t.points.symbol=="circle"?p.arc(r,i,f,0,2*Math.PI,!1):t.points.symbol(p,r,i,f,!1),p.closePath(),p.stroke()}function yt(t,n){var r=typeof t.highlightColor=="string"?t.highlightColor:e.color.parse(t.color).scale("a",.5).toString(),i=r,s=t.bars.align=="left"?0:-t.bars.barWidth/2;p.lineWidth=t.bars.lineWidth,p.strokeStyle=r,tt(n[0],n[1],n[2]||0,s,s+t.bars.barWidth,0,function(){return i},t.xaxis,t.yaxis,p,t.bars.horizontal,t.bars.lineWidth)}function bt(t,n,r,i){if(typeof t=="string")return t;var s=h.createLinearGradient(0,r,0,n);for(var o=0,u=t.colors.length;o<u;++o){var a=t.colors[o];if(typeof a!="string"){var f=e.color.parse(i);a.brightness!=null&&(f=f.scale("rgb",a.brightness)),a.opacity!=null&&(f.a*=a.opacity),a=f.toString()}s.addColorStop(o/(u-1),a)}return s}var u=[],a={colors:["#edc240","#afd8f8","#cb4b4b","#4da74d","#9440ed"],legend:{show:!0,noColumns:1,labelFormatter:null,labelBoxBorderColor:"#ccc",container:null,position:"ne",margin:5,backgroundColor:null,backgroundOpacity:.85,sorted:null},xaxis:{show:null,position:"bottom",mode:null,font:null,color:null,tickColor:null,transform:null,inverseTransform:null,min:null,max:null,autoscaleMargin:null,ticks:null,tickFormatter:null,labelWidth:null,labelHeight:null,reserveSpace:null,tickLength:null,alignTicksWithAxis:null,tickDecimals:null,tickSize:null,minTickSize:null},yaxis:{autoscaleMargin:.02,position:"left"},xaxes:[],yaxes:[],series:{points:{show:!1,radius:3,lineWidth:2,fill:!0,fillColor:"#ffffff",symbol:"circle"},lines:{lineWidth:2,fill:!1,fillColor:null,steps:!1},bars:{show:!1,lineWidth:2,barWidth:1,fill:!0,fillColor:null,align:"left",horizontal:!1,zero:!0},shadowSize:3,highlightColor:null},grid:{show:!0,aboveData:!1,color:"#545454",backgroundColor:null,borderColor:null,tickColor:null,margin:0,labelMargin:5,axisMargin:8,borderWidth:2,minBorderMargin:null,markings:null,markingsColor:"#f4f4f4",markingsLineWidth:2,clickable:!1,hoverable:!1,autoHighlight:!0,mouseActiveRadius:10},interaction:{redrawOverlayInterval:1e3/60},hooks:{}},f=null,l=null,c=null,h=null,p=null,d=[],v=[],m={left:0,right:0,top:0,bottom
:0},g=0,y=0,b={processOptions:[],processRawData:[],processDatapoints:[],processOffset:[],drawBackground:[],drawSeries:[],draw:[],bindEvents:[],drawOverlay:[],shutdown:[]},w=this;w.setData=T,w.setupGrid=R,w.draw=V,w.getPlaceholder=function(){return t},w.getCanvas=function(){return f.element},w.getPlotOffset=function(){return m},w.width=function(){return g},w.height=function(){return y},w.offset=function(){var e=c.offset();return e.left+=m.left,e.top+=m.top,e},w.getData=function(){return u},w.getAxes=function(){var t={},n;return e.each(d.concat(v),function(e,n){n&&(t[n.direction+(n.n!=1?n.n:"")+"axis"]=n)}),t},w.getXAxes=function(){return d},w.getYAxes=function(){return v},w.c2p=L,w.p2c=A,w.getOptions=function(){return a},w.highlight=dt,w.unhighlight=vt,w.triggerRedrawOverlay=ht,w.pointOffset=function(e){return{left:parseInt(d[C(e,"x")-1].p2c(+e.x)+m.left,10),top:parseInt(v[C(e,"y")-1].p2c(+e.y)+m.top,10)}},w.shutdown=H,w.resize=function(){var e=t.width(),n=t.height();f.resize(e,n),l.resize(e,n)},w.hooks=b,S(w),x(s),D(),T(r),R(),V(),P();var st=[],ot=null}function i(e,t){return t*Math.floor(e/t)}var t=Object.prototype.hasOwnProperty;n.prototype.resize=function(e,t){if(e<=0||t<=0)throw new Error("Invalid dimensions for plot, width = "+e+", height = "+t);var n=this.element,r=this.context,i=this.pixelRatio;this.width!=e&&(n.width=e*i,n.style.width=e+"px",this.width=e),this.height!=t&&(n.height=t*i,n.style.height=t+"px",this.height=t),r.restore(),r.save(),r.scale(i,i)},n.prototype.clear=function(){this.context.clearRect(0,0,this.width,this.height)},n.prototype.render=function(){var e=this._textCache;for(var n in e)if(t.call(e,n)){var r=this.getTextLayer(n),i=e[n];r.hide();for(var s in i)if(t.call(i,s)){var o=i[s];for(var u in o)if(t.call(o,u)){var a=o[u].positions;for(var f=0,l;l=a[f];f++)l.active?l.rendered||(r.append(l.element),l.rendered=!0):(a.splice(f--,1),l.rendered&&l.element.detach());a.length==0&&delete o[u]}}r.show()}},n.prototype.getTextLayer=function(t){var n=this.text[t];return n==null&&(this.textContainer==null&&(this.textContainer=e("<div class='flot-text'></div>").css({position:"absolute",top:0,left:0,bottom:0,right:0,"font-size":"smaller",color:"#545454"}).insertAfter(this.element)),n=this.text[t]=e("<div></div>").addClass(t).css({position:"absolute",top:0,left:0,bottom:0,right:0}).appendTo(this.textContainer)),n},n.prototype.getTextInfo=function(t,n,r,i,s){var o,u,a,f;n=""+n,typeof r=="object"?o=r.style+" "+r.variant+" "+r.weight+" "+r.size+"px/"+r.lineHeight+"px "+r.family:o=r,u=this._textCache[t],u==null&&(u=this._textCache[t]={}),a=u[o],a==null&&(a=u[o]={}),f=a[n];if(f==null){var l=e("<div></div>").html(n).css({position:"absolute","max-width":s,top:-9999}).appendTo(this.getTextLayer(t));typeof r=="object"?l.css({font:o,color:r.color}):typeof r=="string"&&l.addClass(r),f=a[n]={width:l.outerWidth(!0),height:l.outerHeight(!0),element:l,positions:[]},l.detach()}return f},n.prototype.addText=function(e,t,n,r,i,s,o,u,a){var f=this.getTextInfo(e,r,i,s,o),l=f.positions;u=="center"?t-=f.width/2:u=="right"&&(t-=f.width),a=="middle"?n-=f.height/2:a=="bottom"&&(n-=f.height);for(var c=0,h;h=l[c];c++)if(h.x==t&&h.y==n){h.active=!0;return}h={active:!0,rendered:!1,element:l.length?f.element.clone():f.element,x:t,y:n},l.push(h),h.element.css({top:Math.round(n),left:Math.round(t),"text-align":u})},n.prototype.removeText=function(e,n,r,i,s,o){if(i==null){var u=this._textCache[e];if(u!=null)for(var a in u)if(t.call(u,a)){var f=u[a];for(var l in f)if(t.call(f,l)){var c=f[l].positions;for(var h=0,p;p=c[h];h++)p.active=!1}}}else{var c=this.getTextInfo(e,i,s,o).positions;for(var h=0,p;p=c[h];h++)p.x==n&&p.y==r&&(p.active=!1)}},e.plot=function(t,n,i){var s=new r(e(t),n,i,e.plot.plugins);return s},e.plot.version="0.8.1",e.plot.plugins=[],e.fn.plot=function(t,n){return this.each(function(){e.plot(this,t,n)})}}(jQuery);/* Flot plugin for plotting textual data or categories.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

Consider a dataset like [["February", 34], ["March", 20], ...]. This plugin
allows you to plot such a dataset directly.

To enable it, you must specify mode: "categories" on the axis with the textual
labels, e.g.

	$.plot("#placeholder", data, { xaxis: { mode: "categories" } });

By default, the labels are ordered as they are met in the data series. If you
need a different ordering, you can specify "categories" on the axis options
and list the categories there:

	xaxis: {
		mode: "categories",
		categories: ["February", "March", "April"]
	}

If you need to customize the distances between the categories, you can specify
"categories" as an object mapping labels to values

	xaxis: {
		mode: "categories",
		categories: { "February": 1, "March": 3, "April": 4 }
	}

If you don't specify all categories, the remaining categories will be numbered
from the max value plus 1 (with a spacing of 1 between each).

Internally, the plugin works by transforming the input data through an auto-
generated mapping where the first category becomes 0, the second 1, etc.
Hence, a point like ["February", 34] becomes [0, 34] internally in Flot (this
is visible in hover and click events that return numbers rather than the
category labels). The plugin also overrides the tick generator to spit out the
categories as ticks instead of the values.

If you need to map a value back to its label, the mapping is always accessible
as "categories" on the axis object, e.g. plot.getAxes().xaxis.categories.

*/

(function ($) {
    var options = {
        xaxis: {
            categories: null
        },
        yaxis: {
            categories: null
        }
    };
    
    function processRawData(plot, series, data, datapoints) {
        // if categories are enabled, we need to disable
        // auto-transformation to numbers so the strings are intact
        // for later processing

        var xCategories = series.xaxis.options.mode == "categories",
            yCategories = series.yaxis.options.mode == "categories";
        
        if (!(xCategories || yCategories))
            return;

        var format = datapoints.format;

        if (!format) {
            // FIXME: auto-detection should really not be defined here
            var s = series;
            format = [];
            format.push({ x: true, number: true, required: true });
            format.push({ y: true, number: true, required: true });

            if (s.bars.show || (s.lines.show && s.lines.fill)) {
                var autoscale = !!((s.bars.show && s.bars.zero) || (s.lines.show && s.lines.zero));
                format.push({ y: true, number: true, required: false, defaultValue: 0, autoscale: autoscale });
                if (s.bars.horizontal) {
                    delete format[format.length - 1].y;
                    format[format.length - 1].x = true;
                }
            }
            
            datapoints.format = format;
        }

        for (var m = 0; m < format.length; ++m) {
            if (format[m].x && xCategories)
                format[m].number = false;
            
            if (format[m].y && yCategories)
                format[m].number = false;
        }
    }

    function getNextIndex(categories) {
        var index = -1;
        
        for (var v in categories)
            if (categories[v] > index)
                index = categories[v];

        return index + 1;
    }

    function categoriesTickGenerator(axis) {
        var res = [];
        for (var label in axis.categories) {
            var v = axis.categories[label];
            if (v >= axis.min && v <= axis.max)
                res.push([v, label]);
        }

        res.sort(function (a, b) { return a[0] - b[0]; });

        return res;
    }
    
    function setupCategoriesForAxis(series, axis, datapoints) {
        if (series[axis].options.mode != "categories")
            return;
        
        if (!series[axis].categories) {
            // parse options
            var c = {}, o = series[axis].options.categories || {};
            if ($.isArray(o)) {
                for (var i = 0; i < o.length; ++i)
                    c[o[i]] = i;
            }
            else {
                for (var v in o)
                    c[v] = o[v];
            }
            
            series[axis].categories = c;
        }

        // fix ticks
        if (!series[axis].options.ticks)
            series[axis].options.ticks = categoriesTickGenerator;

        transformPointsOnAxis(datapoints, axis, series[axis].categories);
    }
    
    function transformPointsOnAxis(datapoints, axis, categories) {
        // go through the points, transforming them
        var points = datapoints.points,
            ps = datapoints.pointsize,
            format = datapoints.format,
            formatColumn = axis.charAt(0),
            index = getNextIndex(categories);

        for (var i = 0; i < points.length; i += ps) {
            if (points[i] == null)
                continue;
            
            for (var m = 0; m < ps; ++m) {
                var val = points[i + m];

                if (val == null || !format[m][formatColumn])
                    continue;

                if (!(val in categories)) {
                    categories[val] = index;
                    ++index;
                }
                
                points[i + m] = categories[val];
            }
        }
    }

    function processDatapoints(plot, series, datapoints) {
        setupCategoriesForAxis(series, "xaxis", datapoints);
        setupCategoriesForAxis(series, "yaxis", datapoints);
    }

    function init(plot) {
        plot.hooks.processRawData.push(processRawData);
        plot.hooks.processDatapoints.push(processDatapoints);
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'categories',
        version: '1.0'
    });
})(jQuery);
/* Flot plugin for rendering pie charts.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

The plugin assumes that each series has a single data value, and that each
value is a positive integer or zero.  Negative numbers don't make sense for a
pie chart, and have unpredictable results.  The values do NOT need to be
passed in as percentages; the plugin will calculate the total and per-slice
percentages internally.

* Created by Brian Medendorp

* Updated with contributions from btburnett3, Anthony Aragues and Xavi Ivars

The plugin supports these options:

	series: {
		pie: {
			show: true/false
			radius: 0-1 for percentage of fullsize, or a specified pixel length, or 'auto'
			innerRadius: 0-1 for percentage of fullsize or a specified pixel length, for creating a donut effect
			startAngle: 0-2 factor of PI used for starting angle (in radians) i.e 3/2 starts at the top, 0 and 2 have the same result
			tilt: 0-1 for percentage to tilt the pie, where 1 is no tilt, and 0 is completely flat (nothing will show)
			offset: {
				top: integer value to move the pie up or down
				left: integer value to move the pie left or right, or 'auto'
			},
			stroke: {
				color: any hexidecimal color value (other formats may or may not work, so best to stick with something like '#FFF')
				width: integer pixel width of the stroke
			},
			label: {
				show: true/false, or 'auto'
				formatter:  a user-defined function that modifies the text/style of the label text
				radius: 0-1 for percentage of fullsize, or a specified pixel length
				background: {
					color: any hexidecimal color value (other formats may or may not work, so best to stick with something like '#000')
					opacity: 0-1
				},
				threshold: 0-1 for the percentage value at which to hide labels (if they're too small)
			},
			combine: {
				threshold: 0-1 for the percentage value at which to combine slices (if they're too small)
				color: any hexidecimal color value (other formats may or may not work, so best to stick with something like '#CCC'), if null, the plugin will automatically use the color of the first slice to be combined
				label: any text value of what the combined slice should be labeled
			}
			highlight: {
				opacity: 0-1
			}
		}
	}

More detail and specific examples can be found in the included HTML file.

*/

(function($) {

	// Maximum redraw attempts when fitting labels within the plot

	var REDRAW_ATTEMPTS = 10;

	// Factor by which to shrink the pie when fitting labels within the plot

	var REDRAW_SHRINK = 0.95;

	function init(plot) {

		var canvas = null,
			target = null,
			options = null,
			maxRadius = null,
			centerLeft = null,
			centerTop = null,
			processed = false,
			ctx = null;

		// interactive variables

		var highlights = [];

		// add hook to determine if pie plugin in enabled, and then perform necessary operations

		plot.hooks.processOptions.push(function(plot, options) {
			if (options.series.pie.show) {

				options.grid.show = false;

				// set labels.show

				if (options.series.pie.label.show == "auto") {
					if (options.legend.show) {
						options.series.pie.label.show = false;
					} else {
						options.series.pie.label.show = true;
					}
				}

				// set radius

				if (options.series.pie.radius == "auto") {
					if (options.series.pie.label.show) {
						options.series.pie.radius = 3/4;
					} else {
						options.series.pie.radius = 1;
					}
				}

				// ensure sane tilt

				if (options.series.pie.tilt > 1) {
					options.series.pie.tilt = 1;
				} else if (options.series.pie.tilt < 0) {
					options.series.pie.tilt = 0;
				}
			}
		});

		plot.hooks.bindEvents.push(function(plot, eventHolder) {
			var options = plot.getOptions();
			if (options.series.pie.show) {
				if (options.grid.hoverable) {
					eventHolder.unbind("mousemove").mousemove(onMouseMove);
				}
				if (options.grid.clickable) {
					eventHolder.unbind("click").click(onClick);
				}
			}
		});

		plot.hooks.processDatapoints.push(function(plot, series, data, datapoints) {
			var options = plot.getOptions();
			if (options.series.pie.show) {
				processDatapoints(plot, series, data, datapoints);
			}
		});

		plot.hooks.drawOverlay.push(function(plot, octx) {
			var options = plot.getOptions();
			if (options.series.pie.show) {
				drawOverlay(plot, octx);
			}
		});

		plot.hooks.draw.push(function(plot, newCtx) {
			var options = plot.getOptions();
			if (options.series.pie.show) {
				draw(plot, newCtx);
			}
		});

		function processDatapoints(plot, series, datapoints) {
			if (!processed)	{
				processed = true;
				canvas = plot.getCanvas();
				target = $(canvas).parent();
				options = plot.getOptions();
				plot.setData(combine(plot.getData()));
			}
		}

		function combine(data) {

			var total = 0,
				combined = 0,
				numCombined = 0,
				color = options.series.pie.combine.color,
				newdata = [];

			// Fix up the raw data from Flot, ensuring the data is numeric

			for (var i = 0; i < data.length; ++i) {

				var value = data[i].data;

				// If the data is an array, we'll assume that it's a standard
				// Flot x-y pair, and are concerned only with the second value.

				// Note how we use the original array, rather than creating a
				// new one; this is more efficient and preserves any extra data
				// that the user may have stored in higher indexes.

				if ($.isArray(value) && value.length == 1) {
    				value = value[0];
				}

				if ($.isArray(value)) {
					// Equivalent to $.isNumeric() but compatible with jQuery < 1.7
					if (!isNaN(parseFloat(value[1])) && isFinite(value[1])) {
						value[1] = +value[1];
					} else {
						value[1] = 0;
					}
				} else if (!isNaN(parseFloat(value)) && isFinite(value)) {
					value = [1, +value];
				} else {
					value = [1, 0];
				}

				data[i].data = [value];
			}

			// Sum up all the slices, so we can calculate percentages for each

			for (var i = 0; i < data.length; ++i) {
				total += data[i].data[0][1];
			}

			// Count the number of slices with percentages below the combine
			// threshold; if it turns out to be just one, we won't combine.

			for (var i = 0; i < data.length; ++i) {
				var value = data[i].data[0][1];
				if (value / total <= options.series.pie.combine.threshold) {
					combined += value;
					numCombined++;
					if (!color) {
						color = data[i].color;
					}
				}
			}

			for (var i = 0; i < data.length; ++i) {
				var value = data[i].data[0][1];
				if (numCombined < 2 || value / total > options.series.pie.combine.threshold) {
					newdata.push(
						$.extend(data[i], {     /* extend to allow keeping all other original data values
						                           and using them e.g. in labelFormatter. */
							data: [[1, value]],
							color: data[i].color,
							label: data[i].label,
							angle: value * Math.PI * 2 / total,
							percent: value / (total / 100)
						})
					);
				}
			}

			if (numCombined > 1) {
				newdata.push({
					data: [[1, combined]],
					color: color,
					label: options.series.pie.combine.label,
					angle: combined * Math.PI * 2 / total,
					percent: combined / (total / 100)
				});
			}

			return newdata;
		}

		function draw(plot, newCtx) {

			if (!target) {
				return; // if no series were passed
			}

			var canvasWidth = plot.getPlaceholder().width(),
				canvasHeight = plot.getPlaceholder().height(),
				legendWidth = target.children().filter(".legend").children().width() || 0;

			ctx = newCtx;

			// WARNING: HACK! REWRITE THIS CODE AS SOON AS POSSIBLE!

			// When combining smaller slices into an 'other' slice, we need to
			// add a new series.  Since Flot gives plugins no way to modify the
			// list of series, the pie plugin uses a hack where the first call
			// to processDatapoints results in a call to setData with the new
			// list of series, then subsequent processDatapoints do nothing.

			// The plugin-global 'processed' flag is used to control this hack;
			// it starts out false, and is set to true after the first call to
			// processDatapoints.

			// Unfortunately this turns future setData calls into no-ops; they
			// call processDatapoints, the flag is true, and nothing happens.

			// To fix this we'll set the flag back to false here in draw, when
			// all series have been processed, so the next sequence of calls to
			// processDatapoints once again starts out with a slice-combine.
			// This is really a hack; in 0.9 we need to give plugins a proper
			// way to modify series before any processing begins.

			processed = false;

			// calculate maximum radius and center point

			maxRadius =  Math.min(canvasWidth, canvasHeight / options.series.pie.tilt) / 2;
			centerTop = canvasHeight / 2 + options.series.pie.offset.top;
			centerLeft = canvasWidth / 2;

			if (options.series.pie.offset.left == "auto") {
				if (options.legend.position.match("w")) {
					centerLeft += legendWidth / 2;
				} else {
					centerLeft -= legendWidth / 2;
				}
				if (centerLeft < maxRadius) {
					centerLeft = maxRadius;
				} else if (centerLeft > canvasWidth - maxRadius) {
					centerLeft = canvasWidth - maxRadius;
				}
			} else {
				centerLeft += options.series.pie.offset.left;
			}

			var slices = plot.getData(),
				attempts = 0;

			// Keep shrinking the pie's radius until drawPie returns true,
			// indicating that all the labels fit, or we try too many times.

			do {
				if (attempts > 0) {
					maxRadius *= REDRAW_SHRINK;
				}
				attempts += 1;
				clear();
				if (options.series.pie.tilt <= 0.8) {
					drawShadow();
				}
			} while (!drawPie() && attempts < REDRAW_ATTEMPTS)

			if (attempts >= REDRAW_ATTEMPTS) {
				clear();
				target.prepend("<div class='error'>Could not draw pie with labels contained inside canvas</div>");
			}

			if (plot.setSeries && plot.insertLegend) {
				plot.setSeries(slices);
				plot.insertLegend();
			}

			// we're actually done at this point, just defining internal functions at this point

			function clear() {
				ctx.clearRect(0, 0, canvasWidth, canvasHeight);
				target.children().filter(".pieLabel, .pieLabelBackground").remove();
			}

			function drawShadow() {

				var shadowLeft = options.series.pie.shadow.left;
				var shadowTop = options.series.pie.shadow.top;
				var edge = 10;
				var alpha = options.series.pie.shadow.alpha;
				var radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius;

				if (radius >= canvasWidth / 2 - shadowLeft || radius * options.series.pie.tilt >= canvasHeight / 2 - shadowTop || radius <= edge) {
					return;	// shadow would be outside canvas, so don't draw it
				}

				ctx.save();
				ctx.translate(shadowLeft,shadowTop);
				ctx.globalAlpha = alpha;
				ctx.fillStyle = "#000";

				// center and rotate to starting position

				ctx.translate(centerLeft,centerTop);
				ctx.scale(1, options.series.pie.tilt);

				//radius -= edge;

				for (var i = 1; i <= edge; i++) {
					ctx.beginPath();
					ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
					ctx.fill();
					radius -= i;
				}

				ctx.restore();
			}

			function drawPie() {

				var startAngle = Math.PI * options.series.pie.startAngle;
				var radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius;

				// center and rotate to starting position

				ctx.save();
				ctx.translate(centerLeft,centerTop);
				ctx.scale(1, options.series.pie.tilt);
				//ctx.rotate(startAngle); // start at top; -- This doesn't work properly in Opera

				// draw slices

				ctx.save();
				var currentAngle = startAngle;
				for (var i = 0; i < slices.length; ++i) {
					slices[i].startAngle = currentAngle;
					drawSlice(slices[i].angle, slices[i].color, true);
				}
				ctx.restore();

				// draw slice outlines

				if (options.series.pie.stroke.width > 0) {
					ctx.save();
					ctx.lineWidth = options.series.pie.stroke.width;
					currentAngle = startAngle;
					for (var i = 0; i < slices.length; ++i) {
						drawSlice(slices[i].angle, options.series.pie.stroke.color, false);
					}
					ctx.restore();
				}

				// draw donut hole

				drawDonutHole(ctx);

				ctx.restore();

				// Draw the labels, returning true if they fit within the plot

				if (options.series.pie.label.show) {
					return drawLabels();
				} else return true;

				function drawSlice(angle, color, fill) {

					if (angle <= 0 || isNaN(angle)) {
						return;
					}

					if (fill) {
						ctx.fillStyle = color;
					} else {
						ctx.strokeStyle = color;
						ctx.lineJoin = "round";
					}

					ctx.beginPath();
					if (Math.abs(angle - Math.PI * 2) > 0.000000001) {
						ctx.moveTo(0, 0); // Center of the pie
					}

					//ctx.arc(0, 0, radius, 0, angle, false); // This doesn't work properly in Opera
					ctx.arc(0, 0, radius,currentAngle, currentAngle + angle / 2, false);
					ctx.arc(0, 0, radius,currentAngle + angle / 2, currentAngle + angle, false);
					ctx.closePath();
					//ctx.rotate(angle); // This doesn't work properly in Opera
					currentAngle += angle;

					if (fill) {
						ctx.fill();
					} else {
						ctx.stroke();
					}
				}

				function drawLabels() {

					var currentAngle = startAngle;
					var radius = options.series.pie.label.radius > 1 ? options.series.pie.label.radius : maxRadius * options.series.pie.label.radius;

					for (var i = 0; i < slices.length; ++i) {
						if (slices[i].percent >= options.series.pie.label.threshold * 100) {
							if (!drawLabel(slices[i], currentAngle, i)) {
								return false;
							}
						}
						currentAngle += slices[i].angle;
					}

					return true;

					function drawLabel(slice, startAngle, index) {

						if (slice.data[0][1] == 0) {
							return true;
						}

						// format label text

						var lf = options.legend.labelFormatter, text, plf = options.series.pie.label.formatter;

						if (lf) {
							text = lf(slice.label, slice);
						} else {
							text = slice.label;
						}

						if (plf) {
							text = plf(text, slice);
						}

						var halfAngle = ((startAngle + slice.angle) + startAngle) / 2;
						var x = centerLeft + Math.round(Math.cos(halfAngle) * radius);
						var y = centerTop + Math.round(Math.sin(halfAngle) * radius) * options.series.pie.tilt;

						var html = "<span class='pieLabel' id='pieLabel" + index + "' style='position:absolute;top:" + y + "px;left:" + x + "px;'>" + text + "</span>";
						target.append(html);

						var label = target.children("#pieLabel" + index);
						var labelTop = (y - label.height() / 2);
						var labelLeft = (x - label.width() / 2);

						label.css("top", labelTop);
						label.css("left", labelLeft);

						// check to make sure that the label is not outside the canvas

						if (0 - labelTop > 0 || 0 - labelLeft > 0 || canvasHeight - (labelTop + label.height()) < 0 || canvasWidth - (labelLeft + label.width()) < 0) {
							return false;
						}

						if (options.series.pie.label.background.opacity != 0) {

							// put in the transparent background separately to avoid blended labels and label boxes

							var c = options.series.pie.label.background.color;

							if (c == null) {
								c = slice.color;
							}

							var pos = "top:" + labelTop + "px;left:" + labelLeft + "px;";
							$("<div class='pieLabelBackground' style='position:absolute;width:" + label.width() + "px;height:" + label.height() + "px;" + pos + "background-color:" + c + ";'></div>")
								.css("opacity", options.series.pie.label.background.opacity)
								.insertBefore(label);
						}

						return true;
					} // end individual label function
				} // end drawLabels function
			} // end drawPie function
		} // end draw function

		// Placed here because it needs to be accessed from multiple locations

		function drawDonutHole(layer) {
			if (options.series.pie.innerRadius > 0) {

				// subtract the center

				layer.save();
				var innerRadius = options.series.pie.innerRadius > 1 ? options.series.pie.innerRadius : maxRadius * options.series.pie.innerRadius;
				layer.globalCompositeOperation = "destination-out"; // this does not work with excanvas, but it will fall back to using the stroke color
				layer.beginPath();
				layer.fillStyle = options.series.pie.stroke.color;
				layer.arc(0, 0, innerRadius, 0, Math.PI * 2, false);
				layer.fill();
				layer.closePath();
				layer.restore();

				// add inner stroke

				layer.save();
				layer.beginPath();
				layer.strokeStyle = options.series.pie.stroke.color;
				layer.arc(0, 0, innerRadius, 0, Math.PI * 2, false);
				layer.stroke();
				layer.closePath();
				layer.restore();

				// TODO: add extra shadow inside hole (with a mask) if the pie is tilted.
			}
		}

		//-- Additional Interactive related functions --

		function isPointInPoly(poly, pt) {
			for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
				((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1]< poly[i][1]))
				&& (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
				&& (c = !c);
			return c;
		}

		function findNearbySlice(mouseX, mouseY) {

			var slices = plot.getData(),
				options = plot.getOptions(),
				radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius,
				x, y;

			for (var i = 0; i < slices.length; ++i) {

				var s = slices[i];

				if (s.pie.show) {

					ctx.save();
					ctx.beginPath();
					ctx.moveTo(0, 0); // Center of the pie
					//ctx.scale(1, options.series.pie.tilt);	// this actually seems to break everything when here.
					ctx.arc(0, 0, radius, s.startAngle, s.startAngle + s.angle / 2, false);
					ctx.arc(0, 0, radius, s.startAngle + s.angle / 2, s.startAngle + s.angle, false);
					ctx.closePath();
					x = mouseX - centerLeft;
					y = mouseY - centerTop;

					if (ctx.isPointInPath) {
						if (ctx.isPointInPath(mouseX - centerLeft, mouseY - centerTop)) {
							ctx.restore();
							return {
								datapoint: [s.percent, s.data],
								dataIndex: 0,
								series: s,
								seriesIndex: i
							};
						}
					} else {

						// excanvas for IE doesn;t support isPointInPath, this is a workaround.

						var p1X = radius * Math.cos(s.startAngle),
							p1Y = radius * Math.sin(s.startAngle),
							p2X = radius * Math.cos(s.startAngle + s.angle / 4),
							p2Y = radius * Math.sin(s.startAngle + s.angle / 4),
							p3X = radius * Math.cos(s.startAngle + s.angle / 2),
							p3Y = radius * Math.sin(s.startAngle + s.angle / 2),
							p4X = radius * Math.cos(s.startAngle + s.angle / 1.5),
							p4Y = radius * Math.sin(s.startAngle + s.angle / 1.5),
							p5X = radius * Math.cos(s.startAngle + s.angle),
							p5Y = radius * Math.sin(s.startAngle + s.angle),
							arrPoly = [[0, 0], [p1X, p1Y], [p2X, p2Y], [p3X, p3Y], [p4X, p4Y], [p5X, p5Y]],
							arrPoint = [x, y];

						// TODO: perhaps do some mathmatical trickery here with the Y-coordinate to compensate for pie tilt?

						if (isPointInPoly(arrPoly, arrPoint)) {
							ctx.restore();
							return {
								datapoint: [s.percent, s.data],
								dataIndex: 0,
								series: s,
								seriesIndex: i
							};
						}
					}

					ctx.restore();
				}
			}

			return null;
		}

		function onMouseMove(e) {
			triggerClickHoverEvent("plothover", e);
		}

		function onClick(e) {
			triggerClickHoverEvent("plotclick", e);
		}

		// trigger click or hover event (they send the same parameters so we share their code)

		function triggerClickHoverEvent(eventname, e) {

			var offset = plot.offset();
			var canvasX = parseInt(e.pageX - offset.left);
			var canvasY =  parseInt(e.pageY - offset.top);
			var item = findNearbySlice(canvasX, canvasY);

			if (options.grid.autoHighlight) {

				// clear auto-highlights

				for (var i = 0; i < highlights.length; ++i) {
					var h = highlights[i];
					if (h.auto == eventname && !(item && h.series == item.series)) {
						unhighlight(h.series);
					}
				}
			}

			// highlight the slice

			if (item) {
				highlight(item.series, eventname);
			}

			// trigger any hover bind events

			var pos = { pageX: e.pageX, pageY: e.pageY };
			target.trigger(eventname, [pos, item]);
		}

		function highlight(s, auto) {
			//if (typeof s == "number") {
			//	s = series[s];
			//}

			var i = indexOfHighlight(s);

			if (i == -1) {
				highlights.push({ series: s, auto: auto });
				plot.triggerRedrawOverlay();
			} else if (!auto) {
				highlights[i].auto = false;
			}
		}

		function unhighlight(s) {
			if (s == null) {
				highlights = [];
				plot.triggerRedrawOverlay();
			}

			//if (typeof s == "number") {
			//	s = series[s];
			//}

			var i = indexOfHighlight(s);

			if (i != -1) {
				highlights.splice(i, 1);
				plot.triggerRedrawOverlay();
			}
		}

		function indexOfHighlight(s) {
			for (var i = 0; i < highlights.length; ++i) {
				var h = highlights[i];
				if (h.series == s)
					return i;
			}
			return -1;
		}

		function drawOverlay(plot, octx) {

			var options = plot.getOptions();

			var radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius;

			octx.save();
			octx.translate(centerLeft, centerTop);
			octx.scale(1, options.series.pie.tilt);

			for (var i = 0; i < highlights.length; ++i) {
				drawHighlight(highlights[i].series);
			}

			drawDonutHole(octx);

			octx.restore();

			function drawHighlight(series) {

				if (series.angle <= 0 || isNaN(series.angle)) {
					return;
				}

				//octx.fillStyle = parseColor(options.series.pie.highlight.color).scale(null, null, null, options.series.pie.highlight.opacity).toString();
				octx.fillStyle = "rgba(255, 255, 255, " + options.series.pie.highlight.opacity + ")"; // this is temporary until we have access to parseColor
				octx.beginPath();
				if (Math.abs(series.angle - Math.PI * 2) > 0.000000001) {
					octx.moveTo(0, 0); // Center of the pie
				}
				octx.arc(0, 0, radius, series.startAngle, series.startAngle + series.angle / 2, false);
				octx.arc(0, 0, radius, series.startAngle + series.angle / 2, series.startAngle + series.angle, false);
				octx.closePath();
				octx.fill();
			}
		}
	} // end init (plugin body)

	// define pie specific options and their default values

	var options = {
		series: {
			pie: {
				show: false,
				radius: "auto",	// actual radius of the visible pie (based on full calculated radius if <=1, or hard pixel value)
				innerRadius: 0, /* for donut */
				startAngle: 3/2,
				tilt: 1,
				shadow: {
					left: 5,	// shadow left offset
					top: 15,	// shadow top offset
					alpha: 0.02	// shadow alpha
				},
				offset: {
					top: 0,
					left: "auto"
				},
				stroke: {
					color: "#fff",
					width: 1
				},
				label: {
					show: "auto",
					formatter: function(label, slice) {
						return "<div style='font-size:x-small;text-align:center;padding:2px;color:" + slice.color + ";'>" + label + "<br/>" + Math.round(slice.percent) + "%</div>";
					},	// formatter function
					radius: 1,	// radius at which to place the labels (based on full calculated radius if <=1, or hard pixel value)
					background: {
						color: null,
						opacity: 0
					},
					threshold: 0	// percentage at which to hide the label (i.e. the slice is too narrow)
				},
				combine: {
					threshold: -1,	// percentage at which to combine little slices into one larger slice
					color: null,	// color to give the new slice (auto-generated if null)
					label: "Other"	// label to give the new slice
				},
				highlight: {
					//color: "#fff",		// will add this functionality once parseColor is available
					opacity: 0.5
				}
			}
		}
	};

	$.plot.plugins.push({
		init: init,
		options: options,
		name: "pie",
		version: "1.1"
	});

})(jQuery);
/* Flot plugin for stacking data sets rather than overlyaing them.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

The plugin assumes the data is sorted on x (or y if stacking horizontally).
For line charts, it is assumed that if a line has an undefined gap (from a
null point), then the line above it should have the same gap - insert zeros
instead of "null" if you want another behaviour. This also holds for the start
and end of the chart. Note that stacking a mix of positive and negative values
in most instances doesn't make sense (so it looks weird).

Two or more series are stacked when their "stack" attribute is set to the same
key (which can be any number or string or just "true"). To specify the default
stack, you can set the stack option like this:

	series: {
		stack: null/false, true, or a key (number/string)
	}

You can also specify it for a single series, like this:

	$.plot( $("#placeholder"), [{
		data: [ ... ],
		stack: true
	}])

The stacking order is determined by the order of the data series in the array
(later series end up on top of the previous).

Internally, the plugin modifies the datapoints in each series, adding an
offset to the y value. For line series, extra data points are inserted through
interpolation. If there's a second y value, it's also adjusted (e.g for bar
charts or filled areas).

*/

(function ($) {
    var options = {
        series: { stack: null } // or number/string
    };
    
    function init(plot) {
        function findMatchingSeries(s, allseries) {
            var res = null;
            for (var i = 0; i < allseries.length; ++i) {
                if (s == allseries[i])
                    break;
                
                if (allseries[i].stack == s.stack)
                    res = allseries[i];
            }
            
            return res;
        }
        
        function stackData(plot, s, datapoints) {
            if (s.stack == null || s.stack === false)
                return;

            var other = findMatchingSeries(s, plot.getData());
            if (!other)
                return;

            var ps = datapoints.pointsize,
                points = datapoints.points,
                otherps = other.datapoints.pointsize,
                otherpoints = other.datapoints.points,
                newpoints = [],
                px, py, intery, qx, qy, bottom,
                withlines = s.lines.show,
                horizontal = s.bars.horizontal,
                withbottom = ps > 2 && (horizontal ? datapoints.format[2].x : datapoints.format[2].y),
                withsteps = withlines && s.lines.steps,
                fromgap = true,
                keyOffset = horizontal ? 1 : 0,
                accumulateOffset = horizontal ? 0 : 1,
                i = 0, j = 0, l, m;

            while (true) {
                if (i >= points.length)
                    break;

                l = newpoints.length;

                if (points[i] == null) {
                    // copy gaps
                    for (m = 0; m < ps; ++m)
                        newpoints.push(points[i + m]);
                    i += ps;
                }
                else if (j >= otherpoints.length) {
                    // for lines, we can't use the rest of the points
                    if (!withlines) {
                        for (m = 0; m < ps; ++m)
                            newpoints.push(points[i + m]);
                    }
                    i += ps;
                }
                else if (otherpoints[j] == null) {
                    // oops, got a gap
                    for (m = 0; m < ps; ++m)
                        newpoints.push(null);
                    fromgap = true;
                    j += otherps;
                }
                else {
                    // cases where we actually got two points
                    px = points[i + keyOffset];
                    py = points[i + accumulateOffset];
                    qx = otherpoints[j + keyOffset];
                    qy = otherpoints[j + accumulateOffset];
                    bottom = 0;

                    if (px == qx) {
                        for (m = 0; m < ps; ++m)
                            newpoints.push(points[i + m]);

                        newpoints[l + accumulateOffset] += qy;
                        bottom = qy;
                        
                        i += ps;
                        j += otherps;
                    }
                    else if (px > qx) {
                        // we got past point below, might need to
                        // insert interpolated extra point
                        if (withlines && i > 0 && points[i - ps] != null) {
                            intery = py + (points[i - ps + accumulateOffset] - py) * (qx - px) / (points[i - ps + keyOffset] - px);
                            newpoints.push(qx);
                            newpoints.push(intery + qy);
                            for (m = 2; m < ps; ++m)
                                newpoints.push(points[i + m]);
                            bottom = qy; 
                        }

                        j += otherps;
                    }
                    else { // px < qx
                        if (fromgap && withlines) {
                            // if we come from a gap, we just skip this point
                            i += ps;
                            continue;
                        }
                            
                        for (m = 0; m < ps; ++m)
                            newpoints.push(points[i + m]);
                        
                        // we might be able to interpolate a point below,
                        // this can give us a better y
                        if (withlines && j > 0 && otherpoints[j - otherps] != null)
                            bottom = qy + (otherpoints[j - otherps + accumulateOffset] - qy) * (px - qx) / (otherpoints[j - otherps + keyOffset] - qx);

                        newpoints[l + accumulateOffset] += bottom;
                        
                        i += ps;
                    }

                    fromgap = false;
                    
                    if (l != newpoints.length && withbottom)
                        newpoints[l + 2] += bottom;
                }

                // maintain the line steps invariant
                if (withsteps && l != newpoints.length && l > 0
                    && newpoints[l] != null
                    && newpoints[l] != newpoints[l - ps]
                    && newpoints[l + 1] != newpoints[l - ps + 1]) {
                    for (m = 0; m < ps; ++m)
                        newpoints[l + ps + m] = newpoints[l + m];
                    newpoints[l + 1] = newpoints[l - ps + 1];
                }
            }

            datapoints.points = newpoints;
        }
        
        plot.hooks.processDatapoints.push(stackData);
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'stack',
        version: '1.2'
    });
})(jQuery);
/**
 * jQuery Calx 2.2.8
 *
 * author       : Xsanisty Developer Team <developers@xsanisty.com>
 *                Ikhsan Agustian <ikhsan017@gmail.com>
 * website      : http://www.xsanisty.com/project/calx2
 * repository   : https://github.com/xsanisty/jquery-calx
 * license      : MIT
 */

if(typeof(Zepto)     == 'undefined'){
    Zepto    = undefined;
}
if(typeof(jQuery)    == 'undefined'){
    jQuery   = Zepto;
}
if(typeof(numeral)   == 'undefined'){
    numeral  = undefined;
}
if(typeof(moment)    == 'undefined'){
    moment   = undefined;
}
if(typeof(jStat)     == 'undefined'){
    jStat    = undefined;
}

(function($, numeral, moment, jStat){

    if(typeof($) == 'undefined'){
        return false;
    }
    
    /************************************************
     *                Begin of IE Hack              *
     ************************************************/
    //ie support for Array.indexOf
    if (typeof Array.indexOf !== "function") {
        Array.prototype.indexOf = function(obj, start) {
            for (var i = (start || 0); i < this.length; i++) {
                if (this[i] == obj) {
                    return i;
                }
            }
            return -1;
        };
    }

    //ie support for getPrototypeOf
    if (typeof Object.getPrototypeOf !== "function") {
        if (typeof "test".__proto__ === "object") {
            Object.getPrototypeOf = function(object) {
                return object.__proto__;
            };
        } else {
            Object.getPrototypeOf = function(object) {
                // May break if the constructor has been tampered with
                return object.constructor.prototype;
            };
        }
    }
/************************************************
 *             Default Configuration            *
 ************************************************/

var defaultConfig = {
    /** tell calx to perform auto calculate after change has been made or trigger calculation manually */
    autoCalculate         : true,

    /** event that trigger calculation to be executed */
    autoCalculateTrigger  : 'blur',

    /** callback triggered right before calculation is performed */
    onBeforeCalculate     : null ,

    /** callback triggered right after calculation is performed */
    onAfterCalculate      : null ,

    /** callback triggered right before calculation result is applied */
    onBeforeRender         : null ,

    /** callback triggered right after calculation result is applied */
    onAfterRender          : null ,

    /** default fomatting rule when data-format is not present */
    defaultFormat         : false,

    /** used for server side formula */
    ajaxUrl               : null,

    /** ajax method used for requesting formula result */
    ajaxMethod            : 'get',

    /** Available option is morris, highchart, d3 */
    graphHandler          : 'flot',

    /** check for circular reference on init, default false */
    checkCircularReference: false,

    /** the sheet data contain list of cells with value, formula, and format */
    data                  : {}

};
function parserFactory(sheet) {

    var parser = {
        trace: function trace() {},
        yy: {},
        symbols_: {
            "error": 2,
            "expressions": 3,
            "e": 4,
            "EOF": 5,
            "variableSequence": 6,
            "TIME_AMPM": 7,
            "TIME_24": 8,
            "number": 9,
            "STRING": 10,
            "TRUE": 11,
            "FALSE": 12,
            "NULL": 13,
            "=": 14,
            "+": 15,
            "(": 16,
            ")": 17,
            "[": 18,
            "expseq": 19,
            "]": 20,
            "<": 21,
            ">": 22,
            "NOT": 23,
            "-": 24,
            "*": 25,
            "/": 26,
            "^": 27,
            "E": 28,
            "FUNCTION": 29,
            "cell": 30,
            "FIXEDCELL": 31,
            ":": 32,
            "CELL": 33,
            "SHEET": 34,
            "!": 35,
            ";": 36,
            ",": 37,
            "VARIABLE": 38,
            "DECIMAL": 39,
            "NUMBER": 40,
            "%": 41,
            "#": 42,
            "$accept": 0,
            "$end": 1
        },
        terminals_: {
            5: "EOF",
            7: "TIME_AMPM",
            8: "TIME_24",
            10: "STRING",
            11: "TRUE",
            12: "FALSE",
            13: "NULL",
            14: "=",
            15: "+",
            16: "(",
            17: ")",
            18: "[",
            20: "]",
            21: "<",
            22: ">",
            23: "NOT",
            24: "-",
            25: "*",
            26: "/",
            27: "^",
            28: "E",
            29: "FUNCTION",
            31: "FIXEDCELL",
            32: ":",
            33: "CELL",
            34: "SHEET",
            35: "!",
            36: ";",
            37: ",",
            38: "VARIABLE",
            39: "DECIMAL",
            40: "NUMBER",
            41: "%",
            42: "#"
        },
        productions_: [0, [3, 2],
            [4, 1],
            [4, 1],
            [4, 1],
            [4, 1],
            [4, 1],
            [4, 1],
            [4, 1],
            [4, 1],
            [4, 3],
            [4, 3],
            [4, 3],
            [4, 3],
            [4, 4],
            [4, 4],
            [4, 4],
            [4, 3],
            [4, 3],
            [4, 3],
            [4, 3],
            [4, 3],
            [4, 3],
            [4, 3],
            [4, 2],
            [4, 2],
            [4, 1],
            [4, 3],
            [4, 4],
            [4, 1],
            [4, 1],
            [4, 2],
            [30, 1],
            [30, 3],
            [30, 1],
            [30, 3],
            [30, 3],
            [30, 5],
            [19, 1],
            [19, 3],
            [19, 3],
            [6, 1],
            [6, 3],
            [9, 1],
            [9, 3],
            [9, 2],
            [2, 3],
            [2, 4]
        ],
        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
            /* this == yyval */

            var $0 = $$.length - 1;
            switch (yystate) {
                case 1:
                    return $$[$0 - 1];
                    break;
                case 2:
                    this.$ = sheet.getVariable($$[$0])

                    break;
                case 3:
                    this.$ = sheet.time($$[$0]);

                    break;
                case 4:
                    this.$ = sheet.time($$[$0]);

                    break;
                case 5:
                    this.$ = $$[$0] * 1;

                    if (isNaN(this.$)) this.$ = 0;

                    break;
                case 6:
                    this.$ = $$[$0].substring(1, $$[$0].length - 1);

                    break;
                case 7:
                    this.$ = true;

                    break;
                case 8:
                    this.$ = false;

                    break;
                case 9:
                    this.$ = null;

                    break;
                case 10:
                    this.$ = sheet.comparator.equal.apply(sheet, [$$[$0 - 2], $$[$0]]);

                    break;
                case 11:
                    this.$ = formula.math.SUM.apply(sheet, [$$[$0 - 2], $$[$0]]);

                    break;
                case 12:
                    this.$ = $$[$0 - 1] * 1;
                    break;
                case 13:
                    this.$ = $$[$0 - 1];

                    break;
                case 14:
                    this.$ = sheet.comparator.lessEqual.apply(sheet, [$$[$0 - 3], $$[$0]]);

                    break;
                case 15:
                    this.$ = sheet.comparator.greaterEqual.apply(sheet, [$$[$0 - 3], $$[$0]]);

                    break;
                case 16:
                    this.$ = sheet.comparator.notEqual.apply(sheet, [$$[$0 - 3], $$[$0]]);

                    break;
                case 17:
                    this.$ = $$[$0 - 2] != $$[$0];

                    break;
                case 18:
                    this.$ = sheet.comparator.greater.apply(sheet, [$$[$0 - 2], $$[$0]]);

                    break;
                case 19:
                    this.$ = sheet.comparator.less.apply(sheet, [$$[$0 - 2], $$[$0]]);

                    break;
                case 20:
                    this.$ = formula.math.SUBTRACT.apply(sheet, [$$[$0 - 2], $$[$0]]);

                    break;
                case 21:
                    this.$ = formula.math.MULTIPLY.apply(sheet, [$$[$0 - 2], $$[$0]]);

                    break;
                case 22:
                    this.$ = formula.math.DIVIDE.apply(sheet, [$$[$0 - 2], $$[$0]]);

                    break;
                case 23:
                    this.$ = formula.math.POWER.apply(sheet, [$$[$0 - 2], $$[$0]]);

                    break;
                case 24:
                    this.$ = $$[$0] * -1;
                    if (isNaN(this.$)) this.$ = 0;

                    break;
                case 25:
                    this.$ = $$[$0] * 1;
                    if (isNaN(this.$)) this.$ = 0;

                    break;
                case 26:
                    this.$ = Math.E;

                    break;
                case 27:
                    this.$ = sheet.callFunction($$[$0 - 2]);

                    break;
                case 28:
                    this.$ = sheet.callFunction($$[$0 - 3], $$[$0 - 1]);

                    break;
                case 32:
                    this.$ = sheet.getCellValue($$[$0]);

                    break;
                case 33:
                    this.$ = sheet.getCellRangeValue($$[$0 - 2], $$[$0]);

                    break;
                case 34:
                    this.$ = sheet.getCellValue($$[$0]);

                    break;
                case 35:
                    this.$ = sheet.getCellRangeValue($$[$0 - 2], $$[$0]);

                    break;
                case 36:
                    this.$ = sheet.getRemoteCellValue($$[$0 - 2], $$[$0]);

                    break;
                case 37:
                    this.$ = sheet.getRemoteCellRangeValue($$[$0 - 4], $$[$0 - 2], $$[$0]);

                    break;
                case 38:
                    this.$ = [$$[$0]];

                    break;
                case 39:
                    $$[$0 - 2].push($$[$0]);
                    this.$ = $$[$0 - 2];


                    break;
                case 40:
                    $$[$0 - 2].push($$[$0]);
                    this.$ = $$[$0 - 2];


                    break;
                case 41:
                    this.$ = [$$[$0]];

                    break;
                case 42:
                    this.$ = ($.isArray($$[$0 - 2]) ? $$[$0 - 2] : [$$[$0 - 2]]);
                    this.$.push($$[$0]);


                    break;
                case 43:
                    this.$ = $$[$0] * 1;

                    break;
                case 44:
                    this.$ = ($$[$0 - 2] + '.' + $$[$0]) * 1;

                    break;
                case 45:
                    this.$ = $$[$0 - 1] * 0.01;

                    break;
                case 46:
                    this.$ = $$[$0 - 2] + $$[$0 - 1] + $$[$0];

                    break;
                case 47:
                    this.$ = $$[$0 - 2] + $$[$0 - 1] + $$[$0];

                    break;
            }
        },
        table: [{
            2: 18,
            3: 1,
            4: 2,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            1: [3]
        }, {
            5: [1, 25],
            14: [1, 26],
            15: [1, 27],
            21: [1, 28],
            22: [1, 29],
            23: [1, 30],
            24: [1, 31],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34]
        }, {
            5: [2, 2],
            14: [2, 2],
            15: [2, 2],
            17: [2, 2],
            20: [2, 2],
            21: [2, 2],
            22: [2, 2],
            23: [2, 2],
            24: [2, 2],
            25: [2, 2],
            26: [2, 2],
            27: [2, 2],
            36: [2, 2],
            37: [2, 2],
            39: [1, 35]
        }, {
            5: [2, 3],
            14: [2, 3],
            15: [2, 3],
            17: [2, 3],
            20: [2, 3],
            21: [2, 3],
            22: [2, 3],
            23: [2, 3],
            24: [2, 3],
            25: [2, 3],
            26: [2, 3],
            27: [2, 3],
            36: [2, 3],
            37: [2, 3]
        }, {
            5: [2, 4],
            14: [2, 4],
            15: [2, 4],
            17: [2, 4],
            20: [2, 4],
            21: [2, 4],
            22: [2, 4],
            23: [2, 4],
            24: [2, 4],
            25: [2, 4],
            26: [2, 4],
            27: [2, 4],
            36: [2, 4],
            37: [2, 4]
        }, {
            5: [2, 5],
            14: [2, 5],
            15: [2, 5],
            17: [2, 5],
            20: [2, 5],
            21: [2, 5],
            22: [2, 5],
            23: [2, 5],
            24: [2, 5],
            25: [2, 5],
            26: [2, 5],
            27: [2, 5],
            36: [2, 5],
            37: [2, 5],
            41: [1, 36]
        }, {
            5: [2, 6],
            14: [2, 6],
            15: [2, 6],
            17: [2, 6],
            20: [2, 6],
            21: [2, 6],
            22: [2, 6],
            23: [2, 6],
            24: [2, 6],
            25: [2, 6],
            26: [2, 6],
            27: [2, 6],
            36: [2, 6],
            37: [2, 6]
        }, {
            5: [2, 7],
            14: [2, 7],
            15: [2, 7],
            17: [2, 7],
            20: [2, 7],
            21: [2, 7],
            22: [2, 7],
            23: [2, 7],
            24: [2, 7],
            25: [2, 7],
            26: [2, 7],
            27: [2, 7],
            36: [2, 7],
            37: [2, 7]
        }, {
            5: [2, 8],
            14: [2, 8],
            15: [2, 8],
            17: [2, 8],
            20: [2, 8],
            21: [2, 8],
            22: [2, 8],
            23: [2, 8],
            24: [2, 8],
            25: [2, 8],
            26: [2, 8],
            27: [2, 8],
            36: [2, 8],
            37: [2, 8]
        }, {
            5: [2, 9],
            14: [2, 9],
            15: [2, 9],
            17: [2, 9],
            20: [2, 9],
            21: [2, 9],
            22: [2, 9],
            23: [2, 9],
            24: [2, 9],
            25: [2, 9],
            26: [2, 9],
            27: [2, 9],
            36: [2, 9],
            37: [2, 9]
        }, {
            2: 18,
            4: 37,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            2: 18,
            4: 39,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            19: 38,
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            2: 18,
            4: 40,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            2: 18,
            4: 41,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            5: [2, 26],
            14: [2, 26],
            15: [2, 26],
            17: [2, 26],
            20: [2, 26],
            21: [2, 26],
            22: [2, 26],
            23: [2, 26],
            24: [2, 26],
            25: [2, 26],
            26: [2, 26],
            27: [2, 26],
            36: [2, 26],
            37: [2, 26]
        }, {
            16: [1, 42]
        }, {
            5: [2, 29],
            14: [2, 29],
            15: [2, 29],
            17: [2, 29],
            20: [2, 29],
            21: [2, 29],
            22: [2, 29],
            23: [2, 29],
            24: [2, 29],
            25: [2, 29],
            26: [2, 29],
            27: [2, 29],
            36: [2, 29],
            37: [2, 29]
        }, {
            2: 43,
            5: [2, 30],
            14: [2, 30],
            15: [2, 30],
            17: [2, 30],
            20: [2, 30],
            21: [2, 30],
            22: [2, 30],
            23: [2, 30],
            24: [2, 30],
            25: [2, 30],
            26: [2, 30],
            27: [2, 30],
            36: [2, 30],
            37: [2, 30],
            38: [1, 44],
            42: [1, 24]
        }, {
            5: [2, 41],
            14: [2, 41],
            15: [2, 41],
            17: [2, 41],
            20: [2, 41],
            21: [2, 41],
            22: [2, 41],
            23: [2, 41],
            24: [2, 41],
            25: [2, 41],
            26: [2, 41],
            27: [2, 41],
            36: [2, 41],
            37: [2, 41],
            39: [2, 41],
            42: [1, 45]
        }, {
            5: [2, 43],
            14: [2, 43],
            15: [2, 43],
            17: [2, 43],
            20: [2, 43],
            21: [2, 43],
            22: [2, 43],
            23: [2, 43],
            24: [2, 43],
            25: [2, 43],
            26: [2, 43],
            27: [2, 43],
            36: [2, 43],
            37: [2, 43],
            39: [1, 46],
            41: [2, 43]
        }, {
            5: [2, 32],
            14: [2, 32],
            15: [2, 32],
            17: [2, 32],
            20: [2, 32],
            21: [2, 32],
            22: [2, 32],
            23: [2, 32],
            24: [2, 32],
            25: [2, 32],
            26: [2, 32],
            27: [2, 32],
            32: [1, 47],
            36: [2, 32],
            37: [2, 32]
        }, {
            5: [2, 34],
            14: [2, 34],
            15: [2, 34],
            17: [2, 34],
            20: [2, 34],
            21: [2, 34],
            22: [2, 34],
            23: [2, 34],
            24: [2, 34],
            25: [2, 34],
            26: [2, 34],
            27: [2, 34],
            32: [1, 48],
            36: [2, 34],
            37: [2, 34]
        }, {
            35: [1, 49]
        }, {
            38: [1, 50]
        }, {
            1: [2, 1]
        }, {
            2: 18,
            4: 51,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            2: 18,
            4: 52,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            2: 18,
            4: 55,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            14: [1, 53],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            22: [1, 54],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            2: 18,
            4: 57,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            14: [1, 56],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            2: 18,
            4: 58,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            2: 18,
            4: 59,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            2: 18,
            4: 60,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            2: 18,
            4: 61,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            2: 18,
            4: 62,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            38: [1, 63]
        }, {
            5: [2, 45],
            14: [2, 45],
            15: [2, 45],
            17: [2, 45],
            20: [2, 45],
            21: [2, 45],
            22: [2, 45],
            23: [2, 45],
            24: [2, 45],
            25: [2, 45],
            26: [2, 45],
            27: [2, 45],
            36: [2, 45],
            37: [2, 45],
            41: [2, 45]
        }, {
            14: [1, 26],
            15: [1, 27],
            17: [1, 64],
            21: [1, 28],
            22: [1, 29],
            23: [1, 30],
            24: [1, 31],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34]
        }, {
            20: [1, 65],
            36: [1, 66],
            37: [1, 67]
        }, {
            14: [1, 26],
            15: [1, 27],
            17: [2, 38],
            20: [2, 38],
            21: [1, 28],
            22: [1, 29],
            23: [1, 30],
            24: [1, 31],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34],
            36: [2, 38],
            37: [2, 38]
        }, {
            5: [2, 24],
            14: [2, 24],
            15: [2, 24],
            17: [2, 24],
            20: [2, 24],
            21: [2, 24],
            22: [2, 24],
            23: [2, 24],
            24: [2, 24],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34],
            36: [2, 24],
            37: [2, 24]
        }, {
            5: [2, 25],
            14: [2, 25],
            15: [2, 25],
            17: [2, 25],
            20: [2, 25],
            21: [2, 25],
            22: [2, 25],
            23: [2, 25],
            24: [2, 25],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34],
            36: [2, 25],
            37: [2, 25]
        }, {
            2: 18,
            4: 39,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            17: [1, 68],
            18: [1, 12],
            19: 69,
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            5: [2, 31],
            14: [2, 31],
            15: [2, 31],
            17: [2, 31],
            20: [2, 31],
            21: [2, 31],
            22: [2, 31],
            23: [2, 31],
            24: [2, 31],
            25: [2, 31],
            26: [2, 31],
            27: [2, 31],
            36: [2, 31],
            37: [2, 31]
        }, {
            42: [1, 45]
        }, {
            38: [1, 70]
        }, {
            40: [1, 71]
        }, {
            31: [1, 72]
        }, {
            33: [1, 73]
        }, {
            33: [1, 74]
        }, {
            35: [1, 75]
        }, {
            5: [2, 10],
            14: [2, 10],
            15: [1, 27],
            17: [2, 10],
            20: [2, 10],
            21: [1, 28],
            22: [1, 29],
            23: [1, 30],
            24: [1, 31],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34],
            36: [2, 10],
            37: [2, 10]
        }, {
            5: [2, 11],
            14: [2, 11],
            15: [2, 11],
            17: [2, 11],
            20: [2, 11],
            21: [2, 11],
            22: [2, 11],
            23: [2, 11],
            24: [2, 11],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34],
            36: [2, 11],
            37: [2, 11]
        }, {
            2: 18,
            4: 76,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            2: 18,
            4: 77,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            5: [2, 19],
            14: [2, 19],
            15: [1, 27],
            17: [2, 19],
            20: [2, 19],
            21: [2, 19],
            22: [2, 19],
            23: [2, 19],
            24: [1, 31],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34],
            36: [2, 19],
            37: [2, 19]
        }, {
            2: 18,
            4: 78,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            5: [2, 18],
            14: [2, 18],
            15: [1, 27],
            17: [2, 18],
            20: [2, 18],
            21: [2, 18],
            22: [2, 18],
            23: [2, 18],
            24: [1, 31],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34],
            36: [2, 18],
            37: [2, 18]
        }, {
            5: [2, 17],
            14: [2, 17],
            15: [1, 27],
            17: [2, 17],
            20: [2, 17],
            21: [1, 28],
            22: [1, 29],
            23: [2, 17],
            24: [1, 31],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34],
            36: [2, 17],
            37: [2, 17]
        }, {
            5: [2, 20],
            14: [2, 20],
            15: [2, 20],
            17: [2, 20],
            20: [2, 20],
            21: [2, 20],
            22: [2, 20],
            23: [2, 20],
            24: [2, 20],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34],
            36: [2, 20],
            37: [2, 20]
        }, {
            5: [2, 21],
            14: [2, 21],
            15: [2, 21],
            17: [2, 21],
            20: [2, 21],
            21: [2, 21],
            22: [2, 21],
            23: [2, 21],
            24: [2, 21],
            25: [2, 21],
            26: [2, 21],
            27: [1, 34],
            36: [2, 21],
            37: [2, 21]
        }, {
            5: [2, 22],
            14: [2, 22],
            15: [2, 22],
            17: [2, 22],
            20: [2, 22],
            21: [2, 22],
            22: [2, 22],
            23: [2, 22],
            24: [2, 22],
            25: [2, 22],
            26: [2, 22],
            27: [1, 34],
            36: [2, 22],
            37: [2, 22]
        }, {
            5: [2, 23],
            14: [2, 23],
            15: [2, 23],
            17: [2, 23],
            20: [2, 23],
            21: [2, 23],
            22: [2, 23],
            23: [2, 23],
            24: [2, 23],
            25: [2, 23],
            26: [2, 23],
            27: [2, 23],
            36: [2, 23],
            37: [2, 23]
        }, {
            5: [2, 42],
            14: [2, 42],
            15: [2, 42],
            17: [2, 42],
            20: [2, 42],
            21: [2, 42],
            22: [2, 42],
            23: [2, 42],
            24: [2, 42],
            25: [2, 42],
            26: [2, 42],
            27: [2, 42],
            36: [2, 42],
            37: [2, 42],
            39: [2, 42]
        }, {
            5: [2, 12],
            14: [2, 12],
            15: [2, 12],
            17: [2, 12],
            20: [2, 12],
            21: [2, 12],
            22: [2, 12],
            23: [2, 12],
            24: [2, 12],
            25: [2, 12],
            26: [2, 12],
            27: [2, 12],
            36: [2, 12],
            37: [2, 12]
        }, {
            5: [2, 13],
            14: [2, 13],
            15: [2, 13],
            17: [2, 13],
            20: [2, 13],
            21: [2, 13],
            22: [2, 13],
            23: [2, 13],
            24: [2, 13],
            25: [2, 13],
            26: [2, 13],
            27: [2, 13],
            36: [2, 13],
            37: [2, 13]
        }, {
            2: 18,
            4: 79,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            2: 18,
            4: 80,
            6: 3,
            7: [1, 4],
            8: [1, 5],
            9: 6,
            10: [1, 7],
            11: [1, 8],
            12: [1, 9],
            13: [1, 10],
            15: [1, 14],
            16: [1, 11],
            18: [1, 12],
            24: [1, 13],
            28: [1, 15],
            29: [1, 16],
            30: 17,
            31: [1, 21],
            33: [1, 22],
            34: [1, 23],
            38: [1, 19],
            40: [1, 20],
            42: [1, 24]
        }, {
            5: [2, 27],
            14: [2, 27],
            15: [2, 27],
            17: [2, 27],
            20: [2, 27],
            21: [2, 27],
            22: [2, 27],
            23: [2, 27],
            24: [2, 27],
            25: [2, 27],
            26: [2, 27],
            27: [2, 27],
            36: [2, 27],
            37: [2, 27]
        }, {
            17: [1, 81],
            36: [1, 66],
            37: [1, 67]
        }, {
            35: [1, 82]
        }, {
            5: [2, 44],
            14: [2, 44],
            15: [2, 44],
            17: [2, 44],
            20: [2, 44],
            21: [2, 44],
            22: [2, 44],
            23: [2, 44],
            24: [2, 44],
            25: [2, 44],
            26: [2, 44],
            27: [2, 44],
            36: [2, 44],
            37: [2, 44],
            41: [2, 44]
        }, {
            5: [2, 33],
            14: [2, 33],
            15: [2, 33],
            17: [2, 33],
            20: [2, 33],
            21: [2, 33],
            22: [2, 33],
            23: [2, 33],
            24: [2, 33],
            25: [2, 33],
            26: [2, 33],
            27: [2, 33],
            36: [2, 33],
            37: [2, 33]
        }, {
            5: [2, 35],
            14: [2, 35],
            15: [2, 35],
            17: [2, 35],
            20: [2, 35],
            21: [2, 35],
            22: [2, 35],
            23: [2, 35],
            24: [2, 35],
            25: [2, 35],
            26: [2, 35],
            27: [2, 35],
            36: [2, 35],
            37: [2, 35]
        }, {
            5: [2, 36],
            14: [2, 36],
            15: [2, 36],
            17: [2, 36],
            20: [2, 36],
            21: [2, 36],
            22: [2, 36],
            23: [2, 36],
            24: [2, 36],
            25: [2, 36],
            26: [2, 36],
            27: [2, 36],
            32: [1, 83],
            36: [2, 36],
            37: [2, 36]
        }, {
            5: [2, 46],
            14: [2, 46],
            15: [2, 46],
            17: [2, 46],
            20: [2, 46],
            21: [2, 46],
            22: [2, 46],
            23: [2, 46],
            24: [2, 46],
            25: [2, 46],
            26: [2, 46],
            27: [2, 46],
            36: [2, 46],
            37: [2, 46],
            38: [2, 46],
            42: [2, 46]
        }, {
            5: [2, 14],
            14: [2, 14],
            15: [1, 27],
            17: [2, 14],
            20: [2, 14],
            21: [2, 14],
            22: [2, 14],
            23: [2, 14],
            24: [1, 31],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34],
            36: [2, 14],
            37: [2, 14]
        }, {
            5: [2, 16],
            14: [2, 16],
            15: [1, 27],
            17: [2, 16],
            20: [2, 16],
            21: [2, 16],
            22: [2, 16],
            23: [2, 16],
            24: [1, 31],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34],
            36: [2, 16],
            37: [2, 16]
        }, {
            5: [2, 15],
            14: [2, 15],
            15: [1, 27],
            17: [2, 15],
            20: [2, 15],
            21: [2, 15],
            22: [2, 15],
            23: [2, 15],
            24: [1, 31],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34],
            36: [2, 15],
            37: [2, 15]
        }, {
            14: [1, 26],
            15: [1, 27],
            17: [2, 39],
            20: [2, 39],
            21: [1, 28],
            22: [1, 29],
            23: [1, 30],
            24: [1, 31],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34],
            36: [2, 39],
            37: [2, 39]
        }, {
            14: [1, 26],
            15: [1, 27],
            17: [2, 40],
            20: [2, 40],
            21: [1, 28],
            22: [1, 29],
            23: [1, 30],
            24: [1, 31],
            25: [1, 32],
            26: [1, 33],
            27: [1, 34],
            36: [2, 40],
            37: [2, 40]
        }, {
            5: [2, 28],
            14: [2, 28],
            15: [2, 28],
            17: [2, 28],
            20: [2, 28],
            21: [2, 28],
            22: [2, 28],
            23: [2, 28],
            24: [2, 28],
            25: [2, 28],
            26: [2, 28],
            27: [2, 28],
            36: [2, 28],
            37: [2, 28]
        }, {
            5: [2, 47],
            14: [2, 47],
            15: [2, 47],
            17: [2, 47],
            20: [2, 47],
            21: [2, 47],
            22: [2, 47],
            23: [2, 47],
            24: [2, 47],
            25: [2, 47],
            26: [2, 47],
            27: [2, 47],
            36: [2, 47],
            37: [2, 47],
            38: [2, 47],
            42: [2, 47]
        }, {
            33: [1, 84]
        }, {
            5: [2, 37],
            14: [2, 37],
            15: [2, 37],
            17: [2, 37],
            20: [2, 37],
            21: [2, 37],
            22: [2, 37],
            23: [2, 37],
            24: [2, 37],
            25: [2, 37],
            26: [2, 37],
            27: [2, 37],
            36: [2, 37],
            37: [2, 37]
        }],
        defaultActions: {
            25: [2, 1]
        },
        parseError: function parseError(str, hash) {
            if (hash.recoverable) {
                this.trace(str)
            } else {
                throw new Error(str)
            }
        },
        parse: function parse(input) {
            var self = this,
                stack = [0],
                vstack = [null],
                lstack = [],
                table = this.table,
                yytext = "",
                yylineno = 0,
                yyleng = 0,
                recovering = 0,
                TERROR = 2,
                EOF = 1;
            var args = lstack.slice.call(arguments, 1);
            this.lexer.setInput(input);
            this.lexer.yy = this.yy;
            this.yy.lexer = this.lexer;
            this.yy.parser = this;
            if (typeof this.lexer.yylloc == "undefined") {
                this.lexer.yylloc = {}
            }
            var yyloc = this.lexer.yylloc;
            lstack.push(yyloc);
            var ranges = this.lexer.options && this.lexer.options.ranges;
            if (typeof this.yy.parseError === "function") {
                this.parseError = this.yy.parseError
            } else {
                this.parseError = Object.getPrototypeOf(this).parseError
            }

            function popStack(n) {
                stack.length = stack.length - 2 * n;
                vstack.length = vstack.length - n;
                lstack.length = lstack.length - n
            }

            function lex() {
                var token;
                token = self.lexer.lex() || EOF;
                if (typeof token !== "number") {
                    token = self.symbols_[token] || token
                }
                return token
            }
            var symbol, preErrorSymbol, state, action, a, r, yyval = {},
                p, len, newState, expected;
            while (true) {
                state = stack[stack.length - 1];
                if (this.defaultActions[state]) {
                    action = this.defaultActions[state]
                } else {
                    if (symbol === null || typeof symbol == "undefined") {
                        symbol = lex()
                    }
                    action = table[state] && table[state][symbol]
                }
                _handle_error: if (typeof action === "undefined" || !action.length || !action[0]) {
                    var error_rule_depth;
                    var errStr = "";

                    function locateNearestErrorRecoveryRule(state) {
                        var stack_probe = stack.length - 1;
                        var depth = 0;
                        for (;;) {
                            if (TERROR.toString() in table[state]) {
                                return depth
                            }
                            if (state === 0 || stack_probe < 2) {
                                return false
                            }
                            stack_probe -= 2;
                            state = stack[stack_probe];
                            ++depth
                        }
                    }
                    if (!recovering) {
                        error_rule_depth = locateNearestErrorRecoveryRule(state);
                        expected = [];
                        for (p in table[state]) {
                            if (this.terminals_[p] && p > TERROR) {
                                expected.push("'" + this.terminals_[p] + "'")
                            }
                        }
                        if (this.lexer.showPosition) {
                            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'"
                        } else {
                            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'")
                        }
                        this.parseError(errStr, {
                            text: this.lexer.match,
                            token: this.terminals_[symbol] || symbol,
                            line: this.lexer.yylineno,
                            loc: yyloc,
                            expected: expected,
                            recoverable: error_rule_depth !== false
                        })
                    } else if (preErrorSymbol !== EOF) {
                        error_rule_depth = locateNearestErrorRecoveryRule(state)
                    }
                    if (recovering == 3) {
                        if (symbol === EOF || preErrorSymbol === EOF) {
                            throw new Error(errStr || "Parsing halted while starting to recover from another error.")
                        }
                        yyleng = this.lexer.yyleng;
                        yytext = this.lexer.yytext;
                        yylineno = this.lexer.yylineno;
                        yyloc = this.lexer.yylloc;
                        symbol = lex()
                    }
                    if (error_rule_depth === false) {
                        throw new Error(errStr || "Parsing halted. No suitable error recovery rule available.")
                    }
                    popStack(error_rule_depth);
                    preErrorSymbol = symbol == TERROR ? null : symbol;
                    symbol = TERROR;
                    state = stack[stack.length - 1];
                    action = table[state] && table[state][TERROR];
                    recovering = 3
                }
                if (action[0] instanceof Array && action.length > 1) {
                    throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol)
                }
                switch (action[0]) {
                    case 1:
                        stack.push(symbol);
                        vstack.push(this.lexer.yytext);
                        lstack.push(this.lexer.yylloc);
                        stack.push(action[1]);
                        symbol = null;
                        if (!preErrorSymbol) {
                            yyleng = this.lexer.yyleng;
                            yytext = this.lexer.yytext;
                            yylineno = this.lexer.yylineno;
                            yyloc = this.lexer.yylloc;
                            if (recovering > 0) {
                                recovering--
                            }
                        } else {
                            symbol = preErrorSymbol;
                            preErrorSymbol = null
                        }
                        break;
                    case 2:
                        len = this.productions_[action[1]][1];
                        yyval.$ = vstack[vstack.length - len];
                        yyval._$ = {
                            first_line: lstack[lstack.length - (len || 1)].first_line,
                            last_line: lstack[lstack.length - 1].last_line,
                            first_column: lstack[lstack.length - (len || 1)].first_column,
                            last_column: lstack[lstack.length - 1].last_column
                        };
                        if (ranges) {
                            yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]]
                        }
                        r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack].concat(args));
                        if (typeof r !== "undefined") {
                            return r
                        }
                        if (len) {
                            stack = stack.slice(0, -1 * len * 2);
                            vstack = vstack.slice(0, -1 * len);
                            lstack = lstack.slice(0, -1 * len)
                        }
                        stack.push(this.productions_[action[1]][0]);
                        vstack.push(yyval.$);
                        lstack.push(yyval._$);
                        newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                        stack.push(newState);
                        break;
                    case 3:
                        return true
                }
            }
            return true
        }
    };
    /* generated by jison-lex 0.2.1 */
    var lexer = (function() {
        var lexer = {

            EOF: 1,

            parseError: function parseError(str, hash) {
                "use strict";
                if (this.yy.parser) {
                    this.yy.parser.parseError(str, hash)
                } else {
                    throw new Error(str)
                }
            },

            // resets the lexer, sets new input
            setInput: function(input) {
                "use strict";
                this._input = input;
                this._more = this._backtrack = this.done = false;
                this.yylineno = this.yyleng = 0;
                this.yytext = this.matched = this.match = "";
                this.conditionStack = ["INITIAL"];
                this.yylloc = {
                    first_line: 1,
                    first_column: 0,
                    last_line: 1,
                    last_column: 0
                };
                if (this.options.ranges) {
                    this.yylloc.range = [0, 0]
                }
                this.offset = 0;
                return this
            },

            // consumes and returns one char from the input
            input: function() {
                "use strict";
                var ch = this._input[0];
                this.yytext += ch;
                this.yyleng++;
                this.offset++;
                this.match += ch;
                this.matched += ch;
                var lines = ch.match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno++;
                    this.yylloc.last_line++
                } else {
                    this.yylloc.last_column++
                } if (this.options.ranges) {
                    this.yylloc.range[1]++
                }
                this._input = this._input.slice(1);
                return ch
            },

            // unshifts one char (or a string) into the input
            unput: function(ch) {
                "use strict";
                var len = ch.length;
                var lines = ch.split(/(?:\r\n?|\n)/g);
                this._input = ch + this._input;
                this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
                this.offset -= len;
                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                this.match = this.match.substr(0, this.match.length - 1);
                this.matched = this.matched.substr(0, this.matched.length - 1);
                if (lines.length - 1) {
                    this.yylineno -= lines.length - 1
                }
                var r = this.yylloc.range;
                this.yylloc = {
                    first_line: this.yylloc.first_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.first_column,
                    last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                };
                if (this.options.ranges) {
                    this.yylloc.range = [r[0], r[0] + this.yyleng - len]
                }
                this.yyleng = this.yytext.length;
                return this
            },

            // When called from action, caches matched text and appends it on next action
            more: function() {
                "use strict";
                this._more = true;
                return this
            },

            // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
            reject: function() {
                "use strict";
                if (this.options.backtrack_lexer) {
                    this._backtrack = true
                } else {
                    return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    })
                }
                return this
            },

            // retain first n characters of the match
            less: function(n) {
                "use strict";
                this.unput(this.match.slice(n))
            },

            // displays already matched input, i.e. for error messages
            pastInput: function() {
                "use strict";
                var past = this.matched.substr(0, this.matched.length - this.match.length);
                return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "")
            },

            // displays upcoming input, i.e. for error messages
            upcomingInput: function() {
                "use strict";
                var next = this.match;
                if (next.length < 20) {
                    next += this._input.substr(0, 20 - next.length)
                }
                return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "")
            },

            // displays the character position where the lexing error occurred, i.e. for error messages
            showPosition: function() {
                "use strict";
                var pre = this.pastInput();
                var c = new Array(pre.length + 1).join("-");
                return pre + this.upcomingInput() + "\n" + c + "^"
            },

            // test the lexed token: return FALSE when not a match, otherwise return token
            test_match: function(match, indexed_rule) {
                "use strict";
                var token, lines, backup;
                if (this.options.backtrack_lexer) {
                    backup = {
                        yylineno: this.yylineno,
                        yylloc: {
                            first_line: this.yylloc.first_line,
                            last_line: this.last_line,
                            first_column: this.yylloc.first_column,
                            last_column: this.yylloc.last_column
                        },
                        yytext: this.yytext,
                        match: this.match,
                        matches: this.matches,
                        matched: this.matched,
                        yyleng: this.yyleng,
                        offset: this.offset,
                        _more: this._more,
                        _input: this._input,
                        yy: this.yy,
                        conditionStack: this.conditionStack.slice(0),
                        done: this.done
                    };
                    if (this.options.ranges) {
                        backup.yylloc.range = this.yylloc.range.slice(0)
                    }
                }
                lines = match[0].match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno += lines.length
                }
                this.yylloc = {
                    first_line: this.yylloc.last_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.last_column,
                    last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
                };
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                if (this.options.ranges) {
                    this.yylloc.range = [this.offset, this.offset += this.yyleng]
                }
                this._more = false;
                this._backtrack = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
                if (this.done && this._input) {
                    this.done = false
                }
                if (token) {
                    return token
                } else if (this._backtrack) {
                    for (var k in backup) {
                        this[k] = backup[k]
                    }
                    return false
                }
                return false
            },

            // return next match in input
            next: function() {
                "use strict";
                if (this.done) {
                    return this.EOF
                }
                if (!this._input) {
                    this.done = true
                }
                var token, match, tempMatch, index;
                if (!this._more) {
                    this.yytext = "";
                    this.match = ""
                }
                var rules = this._currentRules();
                for (var i = 0; i < rules.length; i++) {
                    tempMatch = this._input.match(this.rules[rules[i]]);
                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                        match = tempMatch;
                        index = i;
                        if (this.options.backtrack_lexer) {
                            token = this.test_match(tempMatch, rules[i]);
                            if (token !== false) {
                                return token
                            } else if (this._backtrack) {
                                match = false;
                                continue
                            } else {
                                return false
                            }
                        } else if (!this.options.flex) {
                            break
                        }
                    }
                }
                if (match) {
                    token = this.test_match(match, rules[index]);
                    if (token !== false) {
                        return token
                    }
                    return false
                }
                if (this._input === "") {
                    return this.EOF
                } else {
                    return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    })
                }
            },

            // return next match that has a token
            lex: function lex() {
                "use strict";
                var r = this.next();
                if (r) {
                    return r
                } else {
                    return this.lex()
                }
            },

            // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
            begin: function begin(condition) {
                "use strict";
                this.conditionStack.push(condition)
            },

            // pop the previously active lexer condition state off the condition stack
            popState: function popState() {
                "use strict";
                var n = this.conditionStack.length - 1;
                if (n > 0) {
                    return this.conditionStack.pop()
                } else {
                    return this.conditionStack[0]
                }
            },

            // produce the lexer rule set which is active for the currently active lexer condition state
            _currentRules: function _currentRules() {
                "use strict";
                if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
                } else {
                    return this.conditions["INITIAL"].rules
                }
            },

            // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
            topState: function topState(n) {
                "use strict";
                n = this.conditionStack.length - 1 - Math.abs(n || 0);
                if (n >= 0) {
                    return this.conditionStack[n]
                } else {
                    return "INITIAL"
                }
            },

            // alias for begin(condition)
            pushState: function pushState(condition) {
                "use strict";
                this.begin(condition)
            },

            // return the number of states currently on the stack
            stateStackSize: function stateStackSize() {
                "use strict";
                return this.conditionStack.length
            },
            options: {},
            performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {

                var YYSTATE = YY_START;
                switch ($avoiding_name_collisions) {
                    case 0:
                        /* skip whitespace */
                            break;
                    case 1:
                        return 10;
                        break;
                    case 2:
                        return 10;
                        break;
                    case 3:
                        return 34;
                        break;
                    case 4:
                        return 29;
                        break;
                    case 5:
                        return 7;
                        break;
                    case 6:
                        return 8;
                        break;
                    case 7:
                        if (sheet.obj.type == 'cell') return 34;
                        return 38;


                        break;
                    case 8:
                        if (sheet.obj.type == 'cell') return 31;
                        return 38;


                        break;
                    case 9:
                        if (sheet.obj.type == 'cell') return 33;
                        return 38;


                        break;
                    case 10:
                        return 29;
                        break;
                    case 11:
                        return 38;
                        break;
                    case 12:
                        return 38;
                        break;
                    case 13:
                        return 40;
                        break;
                    case 14:
                        /* skip whitespace */
                            break;
                    case 15:
                        return ' ';
                        break;
                    case 16:
                        return 39;
                        break;
                    case 17:
                        return 32;
                        break;
                    case 18:
                        return 36;
                        break;
                    case 19:
                        return 37;
                        break;
                    case 20:
                        return 25;
                        break;
                    case 21:
                        return 26;
                        break;
                    case 22:
                        return 24;
                        break;
                    case 23:
                        return 15;
                        break;
                    case 24:
                        return 27;
                        break;
                    case 25:
                        return 16;
                        break;
                    case 26:
                        return 17;
                        break;
                    case 27:
                        return 18;
                        break;
                    case 28:
                        return 20;
                        break;
                    case 29:
                        return 22;
                        break;
                    case 30:
                        return 21;
                        break;
                    case 31:
                        return 23;
                        break;
                    case 32:
                        return 'PI';
                        break;
                    case 33:
                        return 28;
                        break;
                    case 34:
                        return 11;
                        break;
                    case 35:
                        return 12;
                        break;
                    case 36:
                        return 13;
                        break;
                    case 37:
                        return '"';
                        break;
                    case 38:
                        return "'";
                        break;
                    case 39:
                        return "!";
                        break;
                    case 40:
                        return 14;
                        break;
                    case 41:
                        return 41;
                        break;
                    case 42:
                        return 42;
                        break;
                    case 43:
                        return 5;
                        break;
                }
            },
            rules: [
                /^(?:\s+)/,
                /^(?:"(\\["]|[^"])*")/,
                /^(?:'(\\[']|[^'])*')/,
                /^(?:#[A-Za-z0-9_]+)/,
                /^(?:[A-Za-z]{1,}[A-Za-z_0-9]+(?=[(]))/,
                /^(?:([0]?[1-9]|1[0-2])[:][0-5][0-9]([:][0-5][0-9])?[ ]?(AM|am|aM|Am|PM|pm|pM|Pm))/,
                /^(?:([0]?[0-9]|1[0-9]|2[0-3])[:][0-5][0-9]([:][0-5][0-9])?)/,
                /^(?:[A-Za-z0-9_]+>[A-Za-z0-9_]+)/,
                /^(?:\$[A-Za-z]+\$[0-9]+)/,
                /^(?:[A-Za-z]+[0-9]+)/,
                /^(?:[A-Za-z]+(?=[(]))/,
                /^(?:[A-Za-z]{1,}[A-Za-z_0-9]+)/,
                /^(?:[A-Za-z_]+)/,
                /^(?:[0-9]+)/,
                /^(?:\$)/,
                /^(?: )/,
                /^(?:[.])/,
                /^(?::)/,
                /^(?:;)/,
                /^(?:,)/,
                /^(?:\*)/,
                /^(?:\/)/,
                /^(?:-)/,
                /^(?:\+)/,
                /^(?:\^)/,
                /^(?:\()/,
                /^(?:\))/,
                /^(?:\[)/,
                /^(?:\])/,
                /^(?:>)/,
                /^(?:<)/,
                /^(?:NOT\b)/,
                /^(?:PI\b)/,
                /^(?:E\b)/,
                /^(?:TRUE\b)/,
                /^(?:FALSE\b)/,
                /^(?:NULL\b)/,
                /^(?:")/,
                /^(?:')/,
                /^(?:!)/,
                /^(?:=)/,
                /^(?:%)/,
                /^(?:[#])/,
                /^(?:$)/
            ],
            conditions: {
                "INITIAL": {
                    "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
                    "inclusive": true
                }
            }
        };
        return lexer;
    })();
    parser.lexer = lexer;

    function Parser() {
        this.yy = {};
    }
    Parser.prototype = parser;
    parser.Parser = Parser;
    return new Parser;
};
var formula = {
    custom : {

},
    /**
 * date formula group.
 * adapted from stoic's formula.js (http://www.stoic.com/pages/formula)
 * with modification to adapt Calx environment
 * @type {Object}
 */
date: {
    DATE : function(year, month, day) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }
        if(typeof(month) == 'undefined'){
            return moment(year);
        }

        return new Date(year, month - 1, day);
    },

    DATEDIFF : function (start_date, end_date, period) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(end_date).diff(moment.utc(start_date), period);
    },

    DATEFORMAT : function(date, format){
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(date).format(format);
    },

    DATEVALUE : function(date_text) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return Math.ceil((moment(date_text) - moment('1900-1-1')) / 86400000) + 2;
    },

    DAY : function(date) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(date)).date();
    },

    DAYNAME : function(date){
        return data.DAY_NAME[formula.date.WEEKDAY(date)-1];
    },

    DAYS : function(end_date, start_date) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(end_date)).diff(moment(new Date(start_date)), 'days');
    },

    DAYS360 : function(start_date, end_date, method) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        var start = moment(new Date(start_date));
        var end = moment(new Date(end_date));
        var smd = 31;
        var emd = 31;
        var sd = start.date();
        var ed = end.date();
        if (method) {
            sd = (sd === 31) ? 30 : sd;
            ed = (ed === 31) ? 30 : ed;
        } else {
            if (start.month() === 1) {
                smd = start.daysInMonth();
            }
            if (end.month() === 1) {
                emd = end.daysInMonth();
            }
            sd = (sd === smd) ? 30 : sd;
            if (sd === 30 || sd === smd) {
                ed = (ed === emd) ? 30 : ed;
            }
        }
        return 360 * (end.year() - start.year()) + 30 * (end.month() - start.month()) + (ed - sd);
    },

    EDATE : function(start_date, months) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(start_date)).add('months', months).toDate();
    },

    EOMONTH : function(start_date, months) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        var edate = moment(new Date(start_date)).add('months', months);
        return new Date(edate.year(), edate.month(), edate.daysInMonth());
    },

    FROMNOW : function(timestamp, nosuffix) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(timestamp)).fromNow(nosuffix);
    },

    HOUR : function(timestamp) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return (timestamp <= 1) ? Math.floor(24 * timestamp) : moment(new Date(timestamp)).hours();
    },

    MINUTE : function(timestamp) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return (timestamp <= 1) ? Math.floor(24 * 60 * timestamp) - 60 * Math.floor(24 * timestamp) : moment(new Date(timestamp)).minutes();
    },

    ISOWEEKNUM : function(date) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(date)).format('w');
    },

    MONTH : function(timestamp) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(timestamp)).month() + 1;
    },

    NETWORKDAYS : function(start_date, end_date, holidays) {
        return formula.date.NETWORKDAYSINTL(start_date, end_date, 1, holidays);
    },

    NETWORKDAYSINTL : function(start_date, end_date, weekend, holidays) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        var weekend_type = (typeof weekend === 'undefined') ? 1 : weekend;
        var weekend_days = data.WEEKEND_TYPES[weekend_type];
        var sd = moment(start_date);
        var ed = moment(end_date);
        var net_days = ed.diff(sd, 'days') + 1;
        var net_work_days = net_days;
        var day_of_week = '';
        var cd = sd;
        var holiday_dates = [];
        if (typeof holidays !== 'undefined') {
            for (var i = 0; i < holidays.length; i++) {
                holiday_dates[i] = moment(new Date(holidays[i])).format('MM-DD-YYYY');
            }
        }
        var j = 0;
        while (j < net_days) {
            day_of_week = cd.format('d');
            if (weekend_days.indexOf(parseInt(day_of_week, 10)) >= 0) {
                net_work_days--;
            } else if (holiday_dates.indexOf(cd.format('MM-DD-YYYY')) >= 0) {
                net_work_days--;
            }
            cd = cd.add('days', 1);
            j++;
        }
        return net_work_days;
    },

    NOW : function() {
        return new Date();
    },

    SECOND : function(timestamp) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(timestamp)).seconds();
    },

    TIME : function(hour, minute, second) {
        return (3600 * hour + 60 * minute + second) / 86400;
    },

    TIMEVALUE : function(time_text) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        var timestamp = moment(new Date(time_text));
        return (3600 * timestamp.hours() + 60 * timestamp.minutes() + timestamp.seconds()) / 86400;
    },

    TODAY : function() {
        return new Date();
    },

    WEEKDAY : function(date, type) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        var week_day = moment(new Date(date)).format('d');
        var week_type = (typeof type === 'undefined') ? 1 : type;
        return data.WEEK_TYPES[week_type][week_day];
    },

    WEEKNUM : function(date, type) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        var current_date = moment(new Date(date));
        var january_first = moment(new Date(current_date.year(), 0, 1));
        var week_type = (typeof type === 'undefined') ? 1 : type;
        var week_start = data.WEEK_STARTS[week_type];
        var first_day = january_first.format('d');
        var offset = (first_day < week_start) ? week_start - first_day + 1 : first_day - week_start;
        if (week_type === 21) {
            return formula.date.ISOWEEKNUM(date);
        } else {
            return Math.floor(current_date.diff(january_first.subtract('days', offset), 'days') / 7) + 1;
        }
    },

    WORKDAY : function(start_date, days, holidays) {
        return formula.date.WORKDAYINTL(start_date, days, 1, holidays);
    },

    WORKDAYINTL : function(start_date, days, weekend, holidays) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        var weekend_type = (typeof weekend === 'undefined') ? 1 : weekend;
        var weekend_days = data.WEEKEND_TYPES[weekend_type];
        var sd = moment(new Date(start_date));
        var cd = sd;
        var day_of_week = '';
        var holiday_dates = [];
        if (typeof holidays !== 'undefined') {
            for (var i = 0; i < holidays.length; i++) {
                holiday_dates[i] = moment(new Date(holidays[i])).format('MM-DD-YYYY');
            }
        }
        var j = 0;
        while (j < days) {
            cd = cd.add('days', 1);
            day_of_week = cd.format('d');
            if (weekend_days.indexOf(parseInt(day_of_week, 10)) < 0 && holiday_dates.indexOf(cd.format('MM-DD-YYYY')) < 0) {
                j++;
            }
        }
        return cd.toDate();
    },

    YEAR : function(date) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        return moment(new Date(date)).year();
    },

    YEARFRAC : function(start_date, end_date, basis) {
        if(typeof (moment) == 'undefined'){
            return data.ERRKEY.momentRequired;
        }

        // Credits: David A. Wheeler [http://www.dwheeler.com/]

        // Initialize parameters
        basis = (typeof basis === 'undefined') ? 0 : basis;
        var sdate = moment(new Date(start_date));
        var edate = moment(new Date(end_date));

        // Return error if either date is invalid
        if (!sdate.isValid() || !edate.isValid()) {
            return '#VALUE!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0, 1, 2, 3, 4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // Return zero if start_date and end_date are the same
        if (sdate === edate) {
            return 0;
        }

        // Swap dates if start_date is later than end_date
        if (sdate.diff(edate) > 0) {
            edate = moment(new Date(start_date));
            sdate = moment(new Date(end_date));
        }

        // Lookup years, months, and days
        var syear = sdate.year();
        var smonth = sdate.month();
        var sday = sdate.date();
        var eyear = edate.year();
        var emonth = edate.month();
        var eday = edate.date();

        switch (basis) {
            case 0:
                // US (NASD) 30/360
                // Note: if eday == 31, it stays 31 if sday < 30
                if (sday === 31 && eday === 31) {
                    sday = 30;
                    eday = 30;
                } else if (sday === 31) {
                    sday = 30;
                } else if (sday === 30 && eday === 31) {
                    eday = 30;
                } else if (smonth === 1 && emonth === 1 && sdate.daysInMonth() === sday && edate.daysInMonth() === eday) {
                    sday = 30;
                    eday = 30;
                } else if (smonth === 1 && sdate.daysInMonth() === sday) {
                    sday = 30;
                }
                return ((eday + emonth * 30 + eyear * 360) - (sday + smonth * 30 + syear * 360)) / 360;

            case 1:
                // Actual/actual
                var feb29Between = function(date1, date2) {
                    // Requires year2 == (year1 + 1) or year2 == year1
                    // Returns TRUE if February 29 is between the two dates (date1 may be February 29), with two possibilities:
                    // year1 is a leap year and date1 <= Februay 29 of year1
                    // year2 is a leap year and date2 > Februay 29 of year2

                    var mar1year1 = moment(new Date(date1.year(), 2, 1));
                    if (moment([date1.year()]).isLeapYear() && date1.diff(mar1year1) < 0 && date2.diff(mar1year1) >= 0) {
                        return true;
                    }
                    var mar1year2 = moment(new Date(date2.year(), 2, 1));
                    if (moment([date2.year()]).isLeapYear() && date2.diff(mar1year2) >= 0 && date1.diff(mar1year2) < 0) {
                        return true;
                    }
                    return false;
                };
                var ylength = 365;
                if (syear === eyear || ((syear + 1) === eyear) && ((smonth > emonth) || ((smonth === emonth) && (sday >= eday)))) {
                    if (syear === eyear && moment([syear]).isLeapYear()) {
                        ylength = 366;
                    } else if (feb29Between(sdate, edate) || (emonth === 1 && eday === 29)) {
                        ylength = 366;
                    }
                    return edate.diff(sdate, 'days') / ylength;
                } else {
                    var years = (eyear - syear) + 1;
                    var days = moment(new Date(eyear + 1, 0, 1)).diff(moment(new Date(syear, 0, 1)), 'days');
                    var average = days / years;
                    return edate.diff(sdate, 'days') / average;
                }
                break;

            case 2:
                // Actual/360
                return edate.diff(sdate, 'days') / 360;

            case 3:
                // Actual/365
                return edate.diff(sdate, 'days') / 365;

            case 4:
                // European 30/360
                if (sday === 31) {
                    sday = 30;
                }

                if (eday === 31) {
                    eday = 30;
                }
                // Remarkably, do NOT change February 28 or February 29 at ALL
                return ((eday + emonth * 30 + eyear * 360) - (sday + smonth * 30 + syear * 360)) / 360;
        }
    }
},
    math : {
    ABS : function(number) {
        return Math.abs(number);
    },

    ACOS : function(number) {
        return Math.acos(number);
    },

    ACOSH : function(number) {
        return Math.log(number + Math.sqrt(number * number - 1));
    },

    ACOT : function(number) {
        return Math.atan(1 / number);
    },

    ACOTH : function(number) {
        return 0.5 * Math.log((number + 1) / (number - 1));
    },

    AGGREGATE : function(function_code, options) {
        var result = [];
        for (var i = 2; i < arguments.length; i++) {
            switch (function_code) {
                case 1:
                    result[i - 2] = formula.statistic.AVERAGE(arguments[i]);
                    break;
                case 2:
                    result[i - 2] = formula.statistic.COUNT(arguments[i]);
                    break;
                case 3:
                    result[i - 2] = formula.statistic.COUNTA(arguments[i]);
                    break;
                case 4:
                    result[i - 2] = formula.statistic.MAX(arguments[i]);
                    break;
                case 5:
                    result[i - 2] = formula.statistic.MIN(arguments[i]);
                    break;
                case 6:
                    result[i - 2] = formula.statistic.PRODUCT(arguments[i]);
                    break;
                case 7:
                    result[i - 2] = formula.statistic.STDEVS(arguments[i]);
                    break;
                case 8:
                    result[i - 2] = formula.statistic.STDEVP(arguments[i]);
                    break;
                case 9:
                    result[i - 2] = formula.math.SUM(arguments[i]);
                    break;
                case 10:
                    result[i - 2] = formula.statistic.VARS(arguments[i]);
                    break;
                case 11:
                    result[i - 2] = formula.statistic.VARP(arguments[i]);
                    break;
                case 12:
                    result[i - 2] = formula.statistic.MEDIAN(arguments[i]);
                    break;
                case 13:
                    result[i - 2] = formula.statistic.MODESNGL(arguments[i]);
                    break;
                case 14:
                    result[i - 2] = formula.statistic.LARGE(arguments[i]);
                    break;
                case 15:
                    result[i - 2] = formula.statistic.SMALL(arguments[i]);
                    break;
                case 16:
                    result[i - 2] = formula.statistic.PERCENTILEINC(arguments[i]);
                    break;
                case 17:
                    result[i - 2] = formula.statistic.QUARTILEINC(arguments[i]);
                    break;
                case 18:
                    result[i - 2] = formula.statistic.PERCENTILEEXC(arguments[i]);
                    break;
                case 19:
                    result[i - 2] = formula.statistic.QUARTILEEXC(arguments[i]);
                    break;
            }
        }
        return result;
    },

    ARABIC : function(text) {
        // Credits: Rafa? Kukawski
        if (!/^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(text)) {
            return '#VALUE!';
        }
        var r = 0;
        text.replace(/[MDLV]|C[MD]?|X[CL]?|I[XV]?/g, function(i) {
            r += {
                M: 1000,
                CM: 900,
                D: 500,
                CD: 400,
                C: 100,
                XC: 90,
                L: 50,
                XL: 40,
                X: 10,
                IX: 9,
                V: 5,
                IV: 4,
                I: 1
            }[i];
        });
        return r;
    },

    ASIN : function(number) {
        return Math.asin(number);
    },

    ASINH : function(number) {
        return Math.log(number + Math.sqrt(number * number + 1));
    },

    ATAN : function(number) {
        return Math.atan(number);
    },

    ATAN2 : function(number_x, number_y) {
        return Math.atan2(number_x, number_y);
    },

    ATANH : function(number) {
        return Math.log((1 + number) / (1 - number)) / 2;
    },

    BASE : function(number, radix, min_length) {
        min_length = (typeof min_length === 'undefined') ? 0 : min_length;
        var result = number.toString(radix);
        return new Array(Math.max(min_length + 1 - result.length, 0)).join('0') + result;
    },

    CEILING : function(number, significance, mode) {
        if (significance === 0) {
            return 0;
        }
        significance = (typeof significance === 'undefined') ? 1 : Math.abs(significance);
        mode = (typeof mode === 'undefined') ? 0 : mode;
        var precision = -Math.floor(Math.log(significance) / Math.log(10));
        if (number >= 0) {
            return formula.math.ROUND(Math.ceil(number / significance) * significance, precision);
        } else {
            if (mode === 0) {
                return -formula.math.ROUND(Math.floor(Math.abs(number) / significance) * significance, precision);
            } else {
                return -formula.math.ROUND(Math.ceil(Math.abs(number) / significance) * significance, precision);
            }
        }
    },

    CEILINGMATH : function(number, significance, mode) {
        return formula.math.CEILING(number, significance, mode);
    },

    CEILINGPRECISE : function(number, significance, mode) {
        return formula.math.CEILING(number, significance, mode);
    },

    COMBIN : function(number, number_chosen) {
        return formula.math.FACT(number) / (formula.math.FACT(number_chosen) * formula.math.FACT(number - number_chosen));
    },

    COMBINA : function(number, number_chosen) {
        return (number === 0 && number_chosen === 0) ? 1 : formula.math.COMBIN(number + number_chosen - 1, number - 1);
    },

    COS : function(number) {
        return Math.cos(number);
    },

    COSH : function(number) {
        return (Math.exp(number) + Math.exp(-number)) / 2;
    },

    COT : function(number) {
        return 1 / Math.tan(number);
    },

    COTH : function(number) {
        var e2 = Math.exp(2 * number);
        return (e2 + 1) / (e2 - 1);
    },

    CSC : function(number) {
        return 1 / Math.sin(number);
    },

    CSCH : function(number) {
        return 2 / (Math.exp(number) - Math.exp(-number));
    },

    DECIMAL : function(number, radix) {
        return parseInt(number, radix);
    },

    DEGREES : function(number) {
        return number * 180 / Math.PI;
    },

    DIVIDE : function(num1, num2){
        if(num1 === '' || num2 === ''){
            return '';
        }

        if(num2 == 0){
            return '#DIV/0';
        }

        return parseFloat(num1)/parseFloat(num2);
    },

    EVEN : function(number) {
        return formula.math.CEILING(number, -2, -1);
    },

    EXP : function(number) {
        return Math.exp(number);
    },

    FACT : function(number) {
        var n = Math.floor(number);
        if (n === 0 || n === 1) {
            return 1;
        } else if (data.MEMOIZED_FACT[n] > 0) {
            return data.MEMOIZED_FACT[n];
        } else {
            data.MEMOIZED_FACT[n] = formula.math.FACT(n - 1) * n;
            return data.MEMOIZED_FACT[n];
        }
    },

    FACTDOUBLE : function(number) {
        var n = Math.floor(number);
        if (n <= 0) {
            return 1;
        } else {
            return n * formula.math.FACTDOUBLE(n - 2);
        }
    },

    FLOOR : function(number, significance, mode) {
        if (significance === 0) {
            return 0;
        }
        significance = (typeof significance === 'undefined') ? 1 : Math.abs(significance);
        mode = (typeof mode === 'undefined') ? 0 : mode;
        var precision = -Math.floor(Math.log(significance) / Math.log(10));
        if (number >= 0) {
            return formula.math.ROUND(Math.floor(number / significance) * significance, precision);
        } else {
            if (mode === 0) {
                return -formula.math.ROUND(Math.ceil(Math.abs(number) / significance) * significance, precision);
            } else {
                return -formula.math.ROUND(Math.floor(Math.abs(number) / significance) * significance, precision);
            }
        }
    },

    FLOORMATH : function(number, significance, mode) {
        return formula.math.FLOOR(number, significance, mode);
    },

    FLOORPRECISE : function(number, significance, mode) {
        return formula.math.FLOOR(number, significance, mode);
    },

    GCD : function() {
        // Credits: Andrew Pociu
        for (var r, a, i = arguments.length - 1, result = arguments[i]; i;) {
            for (a = arguments[--i];
                (r = a % result); a = result, result = r) {
                //empty
            }
        }
        return result;
    },

    INT : function(number) {
        return Math.floor(number);
    },

    ISEVEN : function(number) {
        return (Math.floor(Math.abs(number)) & 1) ? false : true;
    },

    ISOCEILING : function(number, significance, mode) {
        return formula.math.CEILING(number, significance, mode);
    },

    ISODD : function(number) {
        return (Math.floor(Math.abs(number)) & 1) ? true : false;
    },

    LCM : function() {
        // Credits: Jonas Raoni Soares Silva
        var o = utility.toArray(arguments);
        for (var i, j, n, d, r = 1;
            (n = o.pop()) !== undefined;) {
            while (n > 1) {
                if (n % 2) {
                    for (i = 3, j = Math.floor(Math.sqrt(n)); i <= j && n % i; i += 2) {
                        //empty
                    }
                    d = (i <= j) ? i : n;
                } else {
                    d = 2;
                }
                for (n /= d, r *= d, i = o.length; i;
                    (o[--i] % d) === 0 && (o[i] /= d) === 1 && o.splice(i, 1)) {
                    //empty
                }
            }
        }
        return r;
    },

    LN : function(number) {
        return Math.log(number);
    },

    LOG : function(number, base) {
        base = (typeof base === 'undefined') ? 10 : base;
        return Math.log(number) / Math.log(base);
    },

    LOG10 : function(number) {
        return Math.log(number) / Math.log(10);
    },

    //MDETERM :,numeric.det;

    //MINVER,E : numeric.inv;

    //MM,LT : numeric.dot;


    MOD : function(dividend, divisor) {
        var modulus = Math.abs(dividend % divisor);
        return (divisor > 0) ? modulus : -modulus;
    },

    MROUND : function(number, multiple) {
        if (number * multiple < 0) {
            throw new Error('Number and multiple must have the same sign.');
        }

        return Math.round(number / multiple) * multiple;
    },

    MULTINOMIAL : function() {
        var sum = 0;
        var divisor = 1;
        for (var i = 0; i < arguments.length; i++) {
            sum += arguments[i];
            divisor *= formula.math.FACT(arguments[i]);
        }
        return formula.math.FACT(sum) / divisor;
    },

    MULTIPLY : function(num1, num2){
        if(num1 === '' || num2 === ''){
            return '';
        }

        num1 = isNaN(parseFloat(num1)) ? 0 : parseFloat(num1);
        num2 = isNaN(parseFloat(num2)) ? 0 : parseFloat(num2);

        return num1*num2;
    },

    //MU,IT : numeric.identity;

    ODD : function(number) {
        var temp = Math.ceil(Math.abs(number));
        temp = (temp & 1) ? temp : temp + 1;
        return (number > 0) ? temp : -temp;
    },

    PI : function() {
        return Math.PI;
    },

    POWER : function(number, power) {
        return Math.pow(number, power);
    },

    PRODUCT : function() {
        var result = 1;
        for (var i = 0; i < arguments.length; i++) {
            result *= arguments[i];
        }
        return result;
    },

    QUOTIENT : function(numerator, denominator) {
        return (numerator / denominator).toFixed(0);
    },

    RADIANS : function(number) {
        return number * Math.PI / 180;
    },

    RAND : function() {
        return Math.random();
    },

    RANDBETWEEN : function(bottom, top) {
        // Creative Commons Attribution 3.0 License
        // Copyright (c) 2012 eqcode
        return bottom + Math.ceil((top - bottom + 1) * Math.random()) - 1;
    },

    ROUND : function(number, digits) {
        return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
    },

    ROUNDDOWN : function(number, digits) {
        var sign = (number > 0) ? 1 : -1;
        return sign * (Math.floor(Math.abs(number) * Math.pow(10, digits))) / Math.pow(10, digits);
    },

    ROUNDUP : function(number, digits) {
        var sign = (number > 0) ? 1 : -1;
        return sign * (Math.ceil(Math.abs(number) * Math.pow(10, digits))) / Math.pow(10, digits);
    },

    SERIESSUM : function(x, n, m, coefficients) {
        var result = coefficients[0] * Math.pow(x, n);
        for (var i = 1; i < coefficients.length; i++) {
            result += coefficients[i] * Math.pow(x, n + i * m);
        }
        return result;
    },

    SEC : function(number) {
        return 1 / Math.cos(number);
    },

    SECH : function(number) {
        return 2 / (Math.exp(number) + Math.exp(-number));
    },

    SIGN : function(number) {
        if (number < 0) {
            return -1;
        } else if (number === 0) {
            return 0;
        } else {
            return 1;
        }
    },

    SIN : function(number) {
        return Math.sin(number);
    },

    SINH : function(number) {
        return (Math.exp(number) - Math.exp(-number)) / 2;
    },

    SQRT : function(number) {
        return Math.sqrt(number);
    },

    SQRTPI : function(number) {
        return Math.sqrt(number * Math.PI);
    },

    SUBTOTAL : function(function_code) {
        var result = [];
        for (var i = 1; i < arguments.length; i++) {
            switch (function_code) {
                case 1:
                    result[i - 1] = formula.statistic.AVERAGE(arguments[i]);
                    break;
                case 2:
                    result[i - 1] = formula.statistic.COUNT(arguments[i]);
                    break;
                case 3:
                    result[i - 1] = formula.statistic.COUNTA(arguments[i]);
                    break;
                case 4:
                    result[i - 1] = formula.statistic.MAX(arguments[i]);
                    break;
                case 5:
                    result[i - 1] = formula.statistic.MIN(arguments[i]);
                    break;
                case 6:
                    result[i - 1] = formula.statistic.PRODUCT(arguments[i]);
                    break;
                case 7:
                    result[i - 1] = formula.statistic.STDEV(arguments[i]);
                    break;
                case 8:
                    result[i - 1] = formula.statistic.STDEVP(arguments[i]);
                    break;
                case 9:
                    result[i - 1] = formula.math.SUM(arguments[i]);
                    break;
                case 10:
                    result[i - 1] = formula.statistic.VAR(arguments[i]);
                    break;
                case 11:
                    result[i - 1] = formula.statistic.VARP(arguments[i]);
                    break;
            }
        }
        return result;
    },

    SUBTRACT : function(num1, num2){
        if(num1 === '' && num2 === ''){
            return '';
        }


        num1 = isNaN(parseFloat(num1)) ? 0 : parseFloat(num1);
        num2 = isNaN(parseFloat(num2)) ? 0 : parseFloat(num2);

        return num1 - num2;
    },


    SUM : function(){
        var cell, a, floatVal, stringVal = '', result = 0;

        for(a = 0; a < arguments.length; a++){
            if(typeof(arguments[a]) == 'object'){
                for(cell in arguments[a]){
                    stringVal   += (typeof(arguments[a][cell]) != 'undefined') ? arguments[a][cell] : '';
                    floatVal    = !isNaN(parseFloat(arguments[a][cell], 10)) ? parseFloat(arguments[a][cell], 10) : 0;
                    result      += floatVal;
                }
            }else{
                stringVal   += (typeof(arguments[a]) != 'undefined') ? arguments[a] : '';
                floatVal    = !isNaN(parseFloat(arguments[a], 10)) ? parseFloat(arguments[a], 10) : 0;
                result      += floatVal;
            }
        }

        if(result === 0 && $.trim(stringVal) === ''){
            return '';
        }else{
            return result;
        }
    },

    SUMIF : function(range, criteria, sum_range) {
        var result = 0;
            range = utility.objectToArray(range);

        if(typeof(sum_range) == 'undefined'){
            sum_range = range;
        } else {
            sum_range = utility.objectToArray(sum_range);
        }

        for(var i = 0; i < range.length; i++) {
            if (this.evaluate(range[i] + criteria)) {
                result += sum_range[i];
            }
        }

        return result;
    },

    /** need review */
    SUMIFS : function() {
        var criteria = (arguments.length - 1) / 2;
        var range = utility.objectToArray(arguments[0]);
        var result = 0;

        for (var i = 0; i < range.length; i++) {
            var fit = true;
            for (var j = 0; j < criteria; j++) {
                var criteria_clause = arguments[2 * j + 1];
                var criteria_range  = utility.objectToArray(arguments[2 * j + 2]);

                if (fit) {
                    fit = this.evaluate(criteria_range[i] + criteria_clause);
                }
            }
            result += (fit) ? range[i] : 0;
        }
        return result;
    },

    /** need review */
    SUMPRODUCT : function() {
        for (var a in arguments) {
            arguments[a] = utility.objectToArray(arguments[a]);

            if (a > 0 && arguments[(a - 1)].length !== arguments[a].length) {
                return '#VALUE!';
            }
        }

        var resultArray = [];

        for(var i = 0; i < arguments.length; i++){
            for(var j = 0; j < arguments[i].length; j++){
                if(0 == i){
                    resultArray[j] = arguments[i][j];
                } else {
                    resultArray[j] = formula.math.MULTIPLY(resultArray[j] , arguments[i][j]);
                }
            }
        }

        return formula.math.SUM(resultArray);
    },

    SUMSQ : function() {
        var numbers = utility.toArray(arguments);
        var result = 0;
        for (var i = 0; i < numbers.length; i++) {
            result += ($.isNumeric(numbers[i])) ? numbers[i] * numbers[i] : 0;
        }
        return result;
    },

    SUMX2MY2 : function(array_x, array_y) {
        var result = 0;
        for (var i = 0; i < array_x.length; i++) {
            result += array_x[i] * array_x[i] - array_y[i] * array_y[i];
        }
        return result;
    },

    SUMX2PY2 : function(array_x, array_y) {
        var result = 0;
        for (var i = 0; i < array_x.length; i++) {
            result += array_x[i] * array_x[i] + array_y[i] * array_y[i];
        }
        return result;
    },

    SUMXMY2 : function(array_x, array_y) {
        var result = 0;
        for (var i = 0; i < array_x.length; i++) {
            result += Math.pow(array_x[i] - array_y[i], 2);
        }
        return result;
    },

    TAN : function(number) {
        return Math.tan(number);
    },

    TANH : function(number) {
        var e2 = Math.exp(2 * number);
        return (e2 - 1) / (e2 + 1);
    },

    TRUNC : function(number, digits) {
        digits = (typeof digits === 'undefined') ? 0 : digits;
        var sign = (number > 0) ? 1 : -1;
        return sign * (Math.floor(Math.abs(number) * Math.pow(10, digits))) / Math.pow(10, digits);
    }
},
    /**
 * financial formula group.
 * adapted from stoic's formula.js (http://www.stoic.com/pages/formula)
 * with modification to adapt Calx environment
 * @type {Object}
 */
financial: {
    ACCRINT : function(issue, first, settlement, rate, par, frequency, basis, method) {
        if(typeof(moment) == 'undefined'){
            return '#NAME?';
        }

        // Return error if either date is invalid
        if (!moment(issue).isValid() || !moment(first).isValid() || !moment(settlement).isValid()) {
            return '#VALUE!';
        }

        // Return error if either rate or par are lower than or equal to zero
        if (rate <= 0 || par <= 0) {
            return '#NUM!';
        }

        // Return error if frequency is neither 1, 2, or 4
        if ([1, 2, 4].indexOf(frequency) === -1) {
            return '#NUM!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0, 1, 2, 3, 4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // Return error if issue greater than or equal to settlement
        if (moment(issue).diff(moment(settlement)) >= 0) {
            return '#NUM!';
        }

        // Set default values
        par = (typeof par === 'undefined') ? 0 : par;
        basis = (typeof basis === 'undefined') ? 0 : basis;
        method = (typeof method === 'undefined') ? true : method;

        // Compute accrued interest
        var factor = 0;
        var id = moment(new Date(issue));
        var fd = moment(new Date(first));
        var sd = moment(new Date(settlement));
        var days = (moment([id.year()]).isLeapYear()) ? 366 : 365;

        switch (basis) {
            case 0:
                // US (NASD) 30/360
                factor = formula.date.YEARFRAC(issue, settlement, basis);
                break;
            case 1:
                // Actual/actual
                factor = formula.date.YEARFRAC(issue, settlement, basis);
                break;
            case 2:
                // Actual/360
                factor = formula.date.YEARFRAC(issue, settlement, basis);
                break;
            case 3:
                // Actual/365
                factor = formula.date.YEARFRAC(issue, settlement, basis);
                break;
            case 4:
                // European 30/360
                factor = formula.date.YEARFRAC(issue, settlement, basis);
                break;
        }
        return par * rate * factor;
    },

    ACCRINTM : function() {
        return;
    },

    AMORDEGRC : function() {
        return;
    },

    AMORLINC : function() {
        return;
    },

    COUPDAYBS : function() {
        return;
    },

    COUPDAYS : function() {
        return;
    },

    COUPDAYSNC : function() {
        return;
    },

    COUPNCD : function() {
        return;
    },

    COUPNUM : function() {
        return;
    },

    COUPPCD : function() {
        return;
    },

    CUMIPMT : function(rate, periods, value, start, end, type) {
        // Credits: algorithm inspired by Apache OpenOffice
        // Credits: Ha,nes Stieb,tzhofer f,r the translations of function and variable names
        // Requires FV(: and PMT(: from js :http://stoic.com/formula/]

        // Evaluate rate and periods (TODO: replace with secure expression evaluator)
        ////rate = eval(rate);
        ////periods = eval(periods);

        // Return error if either rate, periods, or value are lower than or equal to zero
        if (rate <= 0 || periods <= 0 || value <= 0) {
            return '#NUM!';
        }

        // Return error if start < 1, end < 1, or start > end
        if (start < 1 || end < 1 || start > end) {
            return '#NUM!';
        }

        // Return error if type is neither 0 nor 1
        if (type !== 0 && type !== 1) {
            return '#NUM!';
        }

        // Compute cumulative interest
        var payment = formula.financial.PMT(rate, periods, value, 0, type);
        var interest = 0;

        if (start === 1) {
            if (type === 0) {
                interest = -value;
                start++;
            }
        }

        for (var i = start; i <= end; i++) {
            if (type === 1) {
                interest += formula.financial.FV(rate, i - 2, payment, value, 1) - payment;
            } else {
                interest += formula.financial.FV(rate, i - 1, payment, value, 0);
            }
        }
        interest *= rate;

        // Return cumulative interest
        return interest;
    },

    CUMPRINC : function(rate, periods, value, start, end, type) {
        // Credits: algorithm inspired by Apache OpenOffice
        // Credits: Ha,nes Stieb,tzhofer f,r the translations of function and variable names
        // Requires FV(: and PMT(: from js :http://stoic.com/formula/]

        // Evaluate rate and periods (TODO: replace with secure expression evaluator)
        ////rate = eval(rate);
        ////periods = eval(periods);

        // Return error if either rate, periods, or value are lower than or equal to zero
        if (rate <= 0 || periods <= 0 || value <= 0) {
            return '#NUM!';
        }

        // Return error if start < 1, end < 1, or start > end
        if (start < 1 || end < 1 || start > end) {
            return '#NUM!';
        }

        // Return error if type is neither 0 nor 1
        if (type !== 0 && type !== 1) {
            return '#NUM!';
        }

        // Compute cumulative principal
        var payment = formula.financial.PMT(rate, periods, value, 0, type);
        var principal = 0;
        if (start === 1) {
            if (type === 0) {
                principal = payment + value * rate;
            } else {
                principal = payment;
            }
            start++;
        }
        for (var i = start; i <= end; i++) {
            if (type > 0) {
                principal += payment - (formula.financial.FV(rate, i - 2, payment, value, 1) - payment) * rate;
            } else {
                principal += payment - formula.financial.FV(rate, i - 1, payment, value, 0) * rate;
            }
        }

        // Return cumulative principal
        return principal;
    },

    DB : function(cost, salvage, life, period, month) {
        // Initialize month
        month = (typeof month === 'undefined') ? 12 : month;

        // Return error if any of the parameters is not a number
        if (isNaN(cost) || isNaN(salvage) || isNaN(life) || isNaN(period) || isNaN(month)) {
            return '#VALUE!';
        }

        // Return error if any of the parameters is negative   [

        if (cost < 0 || salvage < 0 || life < 0 || period < 0) {
            return '#NUM!';
        }

        // Return error if month is not an integer between 1 and 12
        if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(month) === -1) {
            return '#NUM!';
        }

        // Return error if period is greater than life
        if (period > life) {
            return '#NUM!';
        }

        // Return 0 (zero) if salvage is greater than or equal to cost
        if (salvage >= cost) {
            return 0;
        }

        // Rate is rounded to three decimals places
        var rate = (1 - Math.pow(salvage / cost, 1 / life)).toFixed(3);

        // Compute initial depreciation
        var initial = cost * rate * month / 12;

        // Compute total depreciation
        var total = initial;
        var current = 0;
        var ceiling = (period === life) ? life - 1 : period;
        for (var i = 2; i <= ceiling; i++) {
            current = (cost - total) * rate;
            total += current;
        }

        // Depreciation for the first and last periods are special cases
        if (period === 1) {
            // First period
            return initial;
        } else if (period === life) {
            // Last period
            return (cost - total) * rate;
        } else {
            return current;
        }
    },

    DDB : function(cost, salvage, life, period, factor) {
        // Initialize factor
        factor = (typeof factor === 'undefined') ? 2 : factor;

        // Return error if any of the parameters is not a number
        if (isNaN(cost) || isNaN(salvage) || isNaN(life) || isNaN(period) || isNaN(factor)) {
            return '#VALUE!';
        }

        // Return error if any of the parameters is negative or if factor is null
        if (cost < 0 || salvage < 0 || life < 0 || period < 0 || factor <= 0) {
            return '#NUM!';
        }

        // Return error if period is greater than life
        if (period > life) {
            return '#NUM!';
        }

        // Return 0 (zero) if salvage is greater than or equal to cost
        if (salvage >= cost) {
            return 0;
        }

        // Compute depreciation
        var total = 0;
        var current = 0;
        for (var i = 1; i <= period; i++) {
            current = Math.min((cost - total) * (factor / life), (cost - salvage - total));
            total += current;
        }

        // Return depreciation
        return current;
    },

    DISC : function() {
        return;
    },

    DOLLARDE : function(dollar, fraction) {
        // Credits: algorithm inspired by Apache OpenOffice

        // Return error if any of the parameters is not a number
        if (isNaN(dollar) || isNaN(fraction)) {
            return '#VALUE!';
        }

        // Return error if fraction is negative
        if (fraction < 0) {
            return '#NUM!';
        }

        // Return error if fraction is greater than or equal to 0 and less than 1
        if (fraction >= 0 && fraction < 1) {
            return '#DIV/0!';
        }

        // Truncate fraction if it is not an integer
        fraction = parseInt(fraction, 10);

        // Compute integer part
        var result = parseInt(dollar, 10);

        // Add decimal part
        result += (dollar % 1) * Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN10)) / fraction;

        // Round result
        var power = Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN2) + 1);
        result = Math.round(result * power) / power;

        // Return converted dollar price
        return result;
    },

    DOLLARFR : function(dollar, fraction) {
        // Credits: algorithm inspired by Apache OpenOffice

        // Return error if any of the parameters is not a number
        if (isNaN(dollar) || isNaN(fraction)) {
            return '#VALUE!';
        }

        // Return error if fraction is negative
        if (fraction < 0) {
            return '#NUM!';
        }

        // Return error if fraction is greater than or equal to 0 and less than 1
        if (fraction >= 0 && fraction < 1) {
            return '#DIV/0!';
        }

        // Truncate fraction if it is not an integer
        fraction = parseInt(fraction, 10);

        // Compute integer part
        var result = parseInt(dollar, 10);

        // Add decimal part
        result += (dollar % 1) * Math.pow(10, -Math.ceil(Math.log(fraction) / Math.LN10)) * fraction;

        // Return converted dollar price
        return result;
    },

    DURATION : function() {
        return;
    },

    EFFECT : function(rate, periods) {
        // Return error if any of the parameters is not a number
        if (isNaN(rate) || isNaN(periods)) {
            return '#VALUE!';
        }

        // Return error if rate <=0 or periods < 1
        if (rate <= 0 || periods < 1) {
            return '#NUM!';
        }

        // Truncate periods if it is not an integer
        periods = parseInt(periods, 10);

        // Return effective annual interest rate
        return Math.pow(1 + rate / periods, periods) - 1;
    },

    FV : function(rate, periods, payment, value, type) {
        // Credits: algorithm inspired by Apache OpenOffice

        // Initialize type
        type = (typeof type === 'undefined') ? 0 : type;

        // Evaluate rate (TODO: replace with secure expression evaluator)
        //rate = eval(rate);

        // Return future value
        var result;
        if (rate === 0) {
            result = value + payment * periods;
        } else {
            var term = Math.pow(1 + rate, periods);
            if (type === 1) {
                result = value * term + payment * (1 + rate) * (term - 1.0) / rate;
            } else {
                result = value * term + payment * (term - 1) / rate;
            }
        }
        return -result;
    },

    FVSCHEDULE : function(principal, schedule) {
        // Initialize future value
        var future = principal;

        // Apply all interests in schedule
        for (var i = 0; i < schedule.length; i++) {
            // Return error if schedule value is not a number
            if (isNaN(schedule[i])) {
                return '#VALUE!';
            }

            // Apply scheduled interest
            future *= 1 + schedule[i];
        }

        // Return future value
        return future;
    },

    INTRATE : function() {
        return;
    },

    IPMT : function(rate, period, periods, present, future, type) {
        // Credits: algorithm inspired by Apache OpenOffice

        // Initialize type
        type = (typeof type === 'undefined') ? 0 : type;

        // Evaluate rate and periods (TODO: replace with secure expression evaluator)
        //rate = eval(rate);
        //periods = eval(periods);

        // Compute payment
        var payment = formula.financial.PMT(rate, periods, present, future, type);

        // Compute interest
        var interest;
        if (period === 1) {
            if (type === 1) {
                interest = 0;
            } else {
                interest = -present;
            }
        } else {
            if (type === 1) {
                interest = formula.financial.FV(rate, period - 2, payment, present, 1) - payment;
            } else {
                interest = formula.financial.FV(rate, period - 1, payment, present, 0);
            }
        }

        // Return interest
        return interest * rate;
    },

    IRR : function(valuesObject, guess) {
        // Credits: algorithm inspired by Apache OpenOffice

        var floatVal, values = [];
        for(var a in valuesObject){
            floatVal = parseFloat(valuesObject[a], 10);
            floatVal = isNaN(floatVal) ? 0 : floatVal;
            values.push(floatVal);
        }

        // Calculates the resulting amount
        var irrResult = function(values, dates, rate) {
            var r = rate + 1;
            var result = values[0];
            for (var i = 1; i < values.length; i++) {
                result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
            }
            return result;
        };

        // Calculates the first derivation
        var irrResultDeriv = function(values, dates, rate) {
            var r = rate + 1;
            var result = 0;
            for (var i = 1; i < values.length; i++) {
                var frac = (dates[i] - dates[0]) / 365;
                result -= frac * values[i] / Math.pow(r, frac + 1);
            }
            return result;
        };

        // Initialize dates and check that values contains at least one positive value and one negative value
        var dates = [];
        var positive = false;
        var negative = false;
        for (var i = 0; i < values.length; i++) {
            dates[i] = (i === 0) ? 0 : dates[i - 1] + 365;
            if (values[i] > 0) {
                positive = true;
            }
            if (values[i] < 0) {
                negative = true;
            }
        }

        // Return error if values does not contain at least one positive value and one negative value
        if (!positive || !negative) {
            return '#NUM!';
        }

        // Initialize guess and resultRate
        guess = (typeof guess === 'undefined') ? 0.1 : guess;
        var resultRate = guess;

        // Set maximum epsilon for end of iteration
        var epsMax = 1e-10;

        // Set maximum number of iterations
        var iterMax = 50;

        // Implement Newton's method
        var newRate, epsRate, resultValue;
        var iteration = 0;
        var contLoop = true;
        do {
            resultValue = irrResult(values, dates, resultRate);
            newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
            epsRate = Math.abs(newRate - resultRate);
            resultRate = newRate;
            contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
        } while (contLoop && (++iteration < iterMax));

        if (contLoop) {
            return '#NUM!';
        }

        // Return internal rate of return
        return resultRate;
    },

    ISPMT : function(rate, period, periods, value) {
        // Evaluate rate and periods (TODO: replace with secure expression evaluator)
        //rate = eval(rate);
        //periods = eval(periods);

        // Return interest
        return value * rate * (period / periods - 1);
    },

    MDURATION : function() {
        return;
    },

    MIRR : function(valuesObject, finance_rate, reinvest_rate) {

        var values = [];
        for(var a in valuesObject){
            values.push(valuesObject[a]);
        }
        // Initialize number of values
        var n = values.length;

        // Lookup payments (negative values) and incomes (positive values)
        var payments = [];
        var incomes = [];
        for (var i = 0; i < n; i++) {
            if (values[i] < 0) {
                payments.push(values[i]);
            } else {
                incomes.push(values[i]);
            }
        }

        // Return modified internal rate of return
        var num = -formula.financial.NPV(reinvest_rate, incomes) * Math.pow(1 + reinvest_rate, n - 1);
        var den = formula.financial.NPV(finance_rate, payments) * (1 + finance_rate);
        return Math.pow(num / den, 1 / (n - 1)) - 1;
    },

    NOMINAL : function(rate, periods) {
        // Return error if any of the parameters is not a number
        if (isNaN(rate) || isNaN(periods)) {
            return '#VALUE!';
        }

        // Return error if rate <=0 or periods < 1
        if (rate <= 0 || periods < 1) {
            return '#NUM!';
        }

        // Truncate periods if it is not an integer
        periods = parseInt(periods, 10);

        // Return nominal annual interest rate
        return (Math.pow(rate + 1, 1 / periods) - 1) * periods;
    },

    NPER : function(rate, payment, present, future, type) {
        // Initialize type
        type = (typeof type === 'undefined') ? 0 : type;

        // Initialize future value
        future = (typeof future === 'undefined') ? 0 : future;

        // Evaluate rate and periods (TODO: replace with secure expression evaluator)
        //rate = eval(rate);

        // Return number of periods
        var num = payment * (1 + rate * type) - future * rate;
        var den = (present * rate + payment * (1 + rate * type));
        return Math.log(num / den) / Math.log(1 + rate);
    },


    NPV : function() {
        // Cast arguments to array
        var floatVal, args = [];
        for (var i = 0; i < arguments.length; i++) {
            if(typeof(arguments[i]) == 'object'){
                for(var a in arguments[i]){
                    floatVal = parseFloat(arguments[i][a], 10);
                    floatVal = isNaN(floatVal) ? 0 : floatVal;
                    args = args.concat([floatVal]);
                }
            }else{

                floatVal = parseFloat(arguments[i], 10);
                floatVal = isNaN(floatVal) ? 0 : floatVal;
                args = args.concat([floatVal]);
            }
        }

        // Lookup rate
        var rate = args[0];

        // Initialize net present value
        var value = 0;

        // Loop on all values
        for (var j = 1; j < args.length; j++) {
            value += args[j] / Math.pow(1 + rate, j);
        }

        // Return net present value
        return value;
    },

    ODDFPRICE : function() {
        return;
    },

    ODDFYIELD : function() {
        return;
    },

    ODDLPRICE : function() {
        return;
    },

    ODDLYIELD : function() {
        return;
    },

    PDURATION : function(rate, present, future) {
        // Return error if any of the parameters is not a number
        if (isNaN(rate) || isNaN(present) || isNaN(future)) {
            return '#VALUE!';
        }

        // Return error if rate <=0
        if (rate <= 0) {
            return '#NUM!';
        }

        // Return number of periods
        return (Math.log(future) - Math.log(present)) / Math.log(1 + rate);
    },

    PMT : function(rate, periods, present, future, type) {
        // Credits: algorithm inspired by Apache OpenOffice

        // Initialize type
        type = (typeof type === 'undefined') ? 0 : type;
        future = (typeof future === 'undefined') ? 0 : future;

        // Evaluate rate and periods (TODO: replace with secure expression evaluator)
        //rate = eval(rate);
        //periods = eval(periods);

        // Return payment
        var result;
        if (rate === 0) {
            result = (present + future) / periods;
        } else {
            var term = Math.pow(1 + rate, periods);
            if (type === 1) {
                result = (future * rate / (term - 1) + present * rate / (1 - 1 / term)) / (1 + rate);
            } else {
                result = future * rate / (term - 1) + present * rate / (1 - 1 / term);
            }
        }
        return -result;
    },

    PPMT : function(rate, period, periods, present, future, type) {
        return formula.financial.PMT(rate, periods, present, future, type) - formula.financial.IPMT(rate, period, periods, present, future, type);
    },

    PRICE : function() {
        return;
    },

    PRICEDISC : function() {
        return;
    },

    PRICEMAT : function() {
        return;
    },

    PV : function(rate, periods, payment, future, type) {
        // Initialize type
        type = (typeof type === 'undefined') ? 0 : type;
        future = (typeof future === 'undefined') ? 0 : future;

        // Evaluate rate and periods (TODO: replace with secure expression evaluator)
        //rate = eval(rate);
        //periods = eval(periods);

        // Return present value
        if (rate === 0) {
            return -payment * periods - future;
        } else {
            return (((1 - Math.pow(1 + rate, periods)) / rate) * payment * (1 + rate * type) - future) / Math.pow(1 + rate, periods);
        }
    },

    RATE : function(periods, payment, present, future, type, guess) {
        // Credits: rabugento

        // Initialize guess
        guess = (typeof guess === 'undefined') ? 0.01 : guess;

        // Initialize future
        future = (typeof future === 'undefined') ? 0 : future;

        // Initialize type
        type = (typeof type === 'undefined') ? 0 : type;

        // Evaluate periods (TODO: replace with secure expression evaluator)
        //periods = eval(periods);

        // Set maximum epsilon for end of iteration
        var epsMax = 1e-10;

        // Set maximum number of iterations
        var iterMax = 50;

        // Implement Newton's method
        var y, y0, y1, x0, x1 = 0,
            f = 0,
            i = 0;
        var rate = guess;
        if (Math.abs(rate) < epsMax) {
            y = present * (1 + periods * rate) + payment * (1 + rate * type) * periods + future;
        } else {
            f = Math.exp(periods * Math.log(1 + rate));
            y = present * f + payment * (1 / rate + type) * (f - 1) + future;
        }
        y0 = present + payment * periods + future;
        y1 = present * f + payment * (1 / rate + type) * (f - 1) + future;
        i = x0 = 0;
        x1 = rate;
        while ((Math.abs(y0 - y1) > epsMax) && (i < iterMax)) {
            rate = (y1 * x0 - y0 * x1) / (y1 - y0);
            x0 = x1;
            x1 = rate;
            if (Math.abs(rate) < epsMax) {
                y = present * (1 + periods * rate) + payment * (1 + rate * type) * periods + future;
            } else {
                f = Math.exp(periods * Math.log(1 + rate));
                y = present * f + payment * (1 / rate + type) * (f - 1) + future;
            }
            y0 = y1;
            y1 = y;
            ++i;
        }
        return rate;
    },

    RECEIVED : function() {
        return;
    },

    RRI : function(periods, present, future) {
        // Return error if any of the parameters is not a number
        if (isNaN(periods) || isNaN(present) || isNaN(future)) {
            return '#VALUE!';
        }

        // Return error if periods or present is equal to 0 (zero)
        if (periods === 0 || present === 0) {
            return '#NUM!';
        }

        // Return equivalent interest rate
        return Math.pow(future / present, 1 / periods) - 1;
    },

    SLN : function(cost, salvage, life) {
        // Return error if any of the parameters is not a number
        if (isNaN(cost) || isNaN(salvage) || isNaN(life)) {
            return '#VALUE!';
        }

        // Return error if life equal to 0 (zero)
        if (life === 0) {
            return '#NUM!';
        }

        // Return straight-line depreciation
        return (cost - salvage) / life;
    },

    SYD : function(cost, salvage, life, period) {
        // Return error if any of the parameters is not a number
        if (isNaN(cost) || isNaN(salvage) || isNaN(life) || isNaN(period)) {
            return '#VALUE!';
        }

        // Return error if life equal to 0 (zero)
        if (life === 0) {
            return '#NUM!';
        }

        // Return error if period is lower than 1 or greater than life
        if (period < 1 || period > life) {
            return '#NUM!';
        }

        // Truncate period if it is not an integer
        period = parseInt(period, 10);

        // Return straight-line depreciation
        return (cost - salvage) * (life - period + 1) * 2 / (life * (life + 1));
    },

    TBILLEQ : function(settlement, maturity, discount) {
        // Return error if either date is invalid
        if (!moment(settlement).isValid() || !moment(maturity).isValid()) {
            return '#VALUE!';
        }

        // Return error if discount is lower than or equal to zero
        if (discount <= 0) {
            return '#NUM!';
        }

        // Return error if settlement is greater than maturity
        if (moment(settlement).diff(moment(maturity)) > 0) {
            return '#NUM!';
        }

        // Return error if maturity is more than one year after settlement
        if (moment(maturity).diff(moment(settlement), 'years') > 1) {
            return '#NUM!';
        }

        // Return bond-equivalent yield
        return (365 * discount) / (360 - discount * formula.date.DAYS360(settlement, maturity));
    },

    TBILLPRICE : function(settlement, maturity, discount) {
        // Return error if either date is invalid
        if (!moment(settlement).isValid() || !moment(maturity).isValid()) {
            return '#VALUE!';
        }

        // Return error if discount is lower than or equal to zero
        if (discount <= 0) {
            return '#NUM!';
        }

        // Return error if settlement is greater than maturity
        if (moment(settlement).diff(moment(maturity)) > 0) {
            return '#NUM!';
        }

        // Return error if maturity is more than one year after settlement
        if (moment(maturity).diff(moment(settlement), 'years') > 1) {
            return '#NUM!';
        }

        // Return bond-equivalent yield
        return 100 * (1 - discount * formula.date.DAYS360(settlement, maturity) / 360);
    },

    TBILLYIELD : function(settlement, maturity, price) {
        // Return error if either date is invalid
        if (!moment(settlement).isValid() || !moment(maturity).isValid()) {
            return '#VALUE!';
        }

        // Return error if price is lower than or equal to zero
        if (price <= 0) {
            return '#NUM!';
        }

        // Return error if settlement is greater than maturity
        if (moment(settlement).diff(moment(maturity)) > 0) {
            return '#NUM!';
        }

        // Return error if maturity is more than one year after settlement
        if (moment(maturity).diff(moment(settlement), 'years') > 1) {
            return '#NUM!';
        }

        // Return bond-equivalent yield
        return (100 - price) * 360 / (price * formula.date.DAYS360(settlement, maturity));
    },

    VDB : function() {
        return;
    },

    XIRR : function(valuesObject, dates, guess) {
        // Credits: algorithm inspired by Apache OpenOffice
        var values = [];
        for(var a in valuesObject){
            values.push(valuesObject[a]);
        }

        // Calculates the resulting amount
        var irrResult = function(values, dates, rate) {
            var r = rate + 1;
            var result = values[0];
            for (var i = 1; i < values.length; i++) {
                result += values[i] / Math.pow(r, moment(dates[i]).diff(moment(dates[0]), 'days') / 365);
            }
            return result;
        };

        // Calculates the first derivation
        var irrResultDeriv = function(values, dates, rate) {
            var r = rate + 1;
            var result = 0;
            for (var i = 1; i < values.length; i++) {
                var frac = moment(dates[i]).diff(moment(dates[0]), 'days') / 365;
                result -= frac * values[i] / Math.pow(r, frac + 1);
            }
            return result;
        };

        // Check that values contains at least one positive value and one negative value
        var positive = false;
        var negative = false;
        for (var i = 0; i < values.length; i++) {
            if (values[i] > 0) {
                positive = true;
            }
            if (values[i] < 0) {
                negative = true;
            }
        }

        // Return error if values does not contain at least one positive value and one negative value
        if (!positive || !negative) {
            return '#NUM!';
        }

        // Initialize guess and resultRate
        guess = guess || 0.1;
        var resultRate = guess;

        // Set maximum epsilon for end of iteration
        var epsMax = 1e-10;

        // Set maximum number of iterations
        var iterMax = 50;

        // Implement Newton's method
        var newRate, epsRate, resultValue;
        var iteration = 0;
        var contLoop = true;
        do {
            resultValue = irrResult(values, dates, resultRate);
            newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
            epsRate = Math.abs(newRate - resultRate);
            resultRate = newRate;
            contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
        } while (contLoop && (++iteration < iterMax));

        if (contLoop) {
            return '#NUM!';
        }

        // Return internal rate of return
        return resultRate;
    },

    XNPV : function(rate, values, dates) {
        var result = 0;
        for (var i = 0; i < values.length; i++) {
            result += values[i] / Math.pow(1 + rate, moment(dates[i]).diff(moment(dates[0]), 'days') / 365);
        }
        return result;
    },

    YIELD : function() {
        return;
    },

    YIELDDISC : function() {
        return;
    },

    YIELDMAT : function() {
        return
    }
},
    statistic: {
    AVEDEV : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        return jStat.sum(jStat(range).subtract(jStat.mean(range)).abs()[0]) / range.length;
    },

    AVERAGE : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var count = 0;
        var sigma = 0;
        var floatVal = 0;
        for (var i = 0; i < n; i++) {
            if (range[i] !== true && range[i] !== false) {
                floatVal = parseFloat(range[i]);
                sigma += isNaN(floatVal) ? 0 : floatVal;
                count++;
            }
        }
        return sigma / count;
    },

    AVERAGEA : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.mean(utility.arrayMerge(arguments));
    },

    /** need fix */
    AVERAGEIF : function(range, criteria, average_range) {
        average_range = (typeof average_range === 'undefined') ? range : average_range;
        var average_count = 0;
        var result = 0;
        for (var i = 0; i < range.length; i++) {
            if (eval(range[i] + criteria)) {
                result += average_range[i];
                average_count++;
            }
        }
        return result / average_count;
    },

    /** need fix */
    AVERAGEIFS : function() {
        var criteria = (arguments.length - 1) / 2;
        var range = arguments[0];
        var count = 0;
        var result = 0;
        for (var i = 0; i < range.length; i++) {
            var fit = true;
            for (var j = 0; j < criteria; j++) {
                if (!eval(arguments[2 * j + 1][i] + arguments[2 * j + 2])) {
                    fit = false;
                }
            }
            if (fit) {
                result += range[i];
                count++;
            }
        }
        return result / count;
    },

    BETADIST : function(x, alpha, beta, cumulative, A, B) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        A = (typeof A === 'undefined') ? 0 : A;
        B = (typeof B === 'undefined') ? 1 : B;
        x = (x - A) / (B - A);
        return (cumulative) ? jStat.beta.cdf(x, alpha, beta) : jStat.beta.pdf(x, alpha, beta);
    },

    BETAINV : function(probability, alpha, beta, A, B) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        A = (typeof A === 'undefined') ? 0 : A;
        B = (typeof B === 'undefined') ? 1 : B;
        return jStat.beta.inv(probability, alpha, beta) * (B - A) + A;
    },

    BINOMDIST : function(successes, trials, probability, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.binomial.cdf(successes, trials, probability) : jStat.binomial.pdf(successes, trials, probability);
    },

    BINOMDISTRANGE : function(trials, probability, successes, successes2) {
        successes2 = (typeof successes2 === 'undefined') ? successes : successes2;
        var result = 0;
        for (var i = successes; i <= successes2; i++) {
            result += formula.math.COMBIN(trials, i) * Math.pow(probability, i) * Math.pow(1 - probability, trials - i);
        }
        return result;
    },

    BINOMINV : function(trials, probability, alpha) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var x = 0;
        while (x <= trials) {
            if (jStat.binomial.cdf(x, trials, probability) >= alpha) {
                return x;
            }
            x++;
        }
    },

    CHISQDIST : function(x, k, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.chisquare.cdf(x, k) : jStat.chisquare.pdf(x, k);
    },

    CHISQDISTRT : function(x, k) {
        return;
    },

    CHISQINV : function(probability, k) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.chisquare.inv(probability, k);
    },

    CHISQINVRT : function() {
        return;
    },

    CHISQTEST : function() {
        return;
    },

    CONFIDENCENORM : function(alpha, sd, n) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.normalci(1, alpha, sd, n)[1] - 1;
    },

    CONFIDENCET : function(alpha, sd, n) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.tci(1, alpha, sd, n)[1] - 1;
    },

    CORREL : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.corrcoeff.apply(this, arguments);
    },

    COUNT : function() {
        return utility.arrayMerge(arguments).length;
    },

    COUNTA : function() {
        var range = utility.arrayMerge(arguments);
        return range.length - formula.statistic.COUNTBLANK(range);
    },

    COUNTBLANK : function() {
        var range = utility.arrayMerge(arguments);
        var blanks = 0;
        for (var i = 0; i < range.length; i++) {
            if (range[i] === null || range[i] === '') {
                blanks++;
            }
        }
        return blanks;
    },

    /** need review */
    COUNTIF : function(range, criteria) {
        var matches = 0, i;
        for (i in range) {
            if (range[i].match(new RegExp(criteria))) {
                matches++;
            }
        }
        return matches;
    },

    /** need review */
    COUNTIFS : function() {
        var criteria = (arguments.length - 1) / 2;
        var range = arguments[0];
        var result = 0;
        var i;
        for (i in range) {
            var fit = true;
            for (var j = 0; j < criteria; j++) {
                if (!eval(arguments[2 * j + 1][i] + arguments[2 * j + 2])) {
                    fit = false;
                }
            }
            result += (fit) ? 1 : 0;
        }
        return result;
    },

    COUNTUNIQUE : function () {
        return utility.unique(utility.arrayMerge(arguments)).length;
    },

    COVARIANCEP : function(array1, array2) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var mean1 = jStat.mean(array1);
        var mean2 = jStat.mean(array2);
        var result = 0;
        var n = array1.length;
        for (var i = 0; i < n; i++) {
            result += (array1[i] - mean1) * (array2[i] - mean2);
        }
        return result / n;
    },

    COVARIANCES : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.covariance.apply(this, arguments);
    },

    DEVSQ : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        var mean = jStat.mean(range);
        var result = 0;
        for (var i = 0; i < range.length; i++) {
            result += Math.pow((range[i] - mean), 2);
        }
        return result;
    },

    EXPONDIST : function(x, lambda, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.exponential.cdf(x, lambda) : jStat.exponential.pdf(x, lambda);
    },

    FDIST : function(x, d1, d2, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.centralF.cdf(x, d1, d2) : jStat.centralF.pdf(x, d1, d2);
    },

    FDISTRT : function() {
        return;
    },

    FINV : function(probability, d1, d2) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.centralF.inv(probability, d1, d2);
    },

    FINVRT : function() {
        return;
    },

    FTEST : function() {
        return;
    },

    FISHER : function(x) {
        return Math.log((1 + x) / (1 - x)) / 2;
    },

    FISHERINV : function(y) {
        var e2y = Math.exp(2 * y);
        return (e2y - 1) / (e2y + 1);
    },

    FORECAST : function(x, data_y, data_x) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var xmean = jStat.mean(data_x);
        var ymean = jStat.mean(data_y);
        var n = data_x.length;
        var num = 0;
        var den = 0;
        for (var i = 0; i < n; i++) {
            num += (data_x[i] - xmean) * (data_y[i] - ymean);
            den += Math.pow(data_x[i] - xmean, 2);
        }
        var b = num / den;
        var a = ymean - b * xmean;
        return a + b * x;
    },

    FREQUENCY : function(data, bins) {
        var n = data.length;
        var b = bins.length;
        var r = [];
        for (var i = 0; i <= b; i++) {
            r[i] = 0;
            for (var j = 0; j < n; j++) {
                if (i === 0) {
                    if (data[j] <= bins[0]) {
                        r[0] += 1;
                    }
                } else if (i < b) {
                    if (data[j] > bins[i - 1] && data[j] <= bins[i]) {
                        r[i] += 1;
                    }
                } else if (i === b) {
                    if (data[j] > bins[b - 1]) {
                        r[b] += 1;
                    }
                }
            }
        }
        return r;
    },

    GAMMA : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.gammafn.apply(this, arguments);
    },

    GAMMADIST : function(x, alpha, beta, cumulative) {
        /*
           var shape = alpha;
           var scale = 1 / beta;
           return (cumulative) ? jStat.gamma.cdf(x, shape, scale) : jStat.gamma.pdf(x, shape, scale);
           */
        return;
    },

    GAMMAINV : function(probability, alpha, beta) {
        /*
           var shape = alpha;
           var scale = 1 / beta;
           return jStat.gamma.inv(probability, shape, scale);
           */
        return;
    },

    GAMMALN : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.gammaln.apply(this, arguments);
    },

    GAMMALNPRECISE : function() {
        return;
    },

    GAUSS : function(z) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.normal.cdf(z, 0, 1) - 0.5;
    },

    GEOMEAN : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.geomean(utility.arrayMerge(arguments));
    },

    GROWTH : function(known_y, known_x, new_x, use_const) {
        // Credits: Ilmari Karonen

        // Default values for optional parameters:
        var i;
        if (typeof(known_x) === 'undefined') {
            known_x = [];
            for (i = 1; i <= known_y.length; i++) {
                known_x.push(i);
            }
        }
        if (typeof(new_x) === 'undefined') {
            new_x = [];
            for (i = 1; i <= known_y.length; i++) {
                new_x.push(i);
            }
        }
        if (typeof(use_const) === 'undefined') {
            use_const = true;
        }

        // Calculate sums over the data:
        var n = known_y.length;
        var avg_x = 0;
        var avg_y = 0;
        var avg_xy = 0;
        var avg_xx = 0;
        for (i = 0; i < n; i++) {
            var x = known_x[i];
            var y = Math.log(known_y[i]);
            avg_x += x;
            avg_y += y;
            avg_xy += x * y;
            avg_xx += x * x;
        }
        avg_x /= n;
        avg_y /= n;
        avg_xy /= n;
        avg_xx /= n;

        // Compute linear regression coefficients:
        var beta;
        var alpha;
        if (use_const) {
            beta = (avg_xy - avg_x * avg_y) / (avg_xx - avg_x * avg_x);
            alpha = avg_y - beta * avg_x;
        } else {
            beta = avg_xy / avg_xx;
            alpha = 0;
        }

        // Compute and return result array:
        var new_y = [];
        for (i = 0; i < new_x.length; i++) {
            new_y.push(Math.exp(alpha + beta * new_x[i]));
        }
        return new_y;
    },

    HARMEAN : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var den = 0;
        for (var i = 0; i < n; i++) {
            den += 1 / range[i];
        }
        return n / den;
    },

    HYPGEOMDIST : function(x, n, M, N, cumulative) {
        function pdf(x, n, M, N) {
            return formula.math.COMBIN(M, x) * formula.math.COMBIN(N - M, n - x) / formula.math.COMBIN(N, n);
        }

        function cdf(x, n, M, N) {
            var result = 0;
            for (var i = 0; i <= x; i++) {
                result += pdf(i, n, M, N);
            }
            return result;
        }

        return (cumulative) ? cdf(x, n, M, N) : pdf(x, n, M, N);
    },

    INTERCEPT : function(data_y, data_x) {
        return formula.statistic.FORECAST(0, data_y, data_x);
    },

    KURT : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        var mean = jStat.mean(range);
        var n = range.length;
        var sigma = 0;
        for (var i = 0; i < n; i++) {
            sigma += Math.pow(range[i] - mean, 4);
        }
        sigma = sigma / Math.pow(jStat.stdev(range, true), 4);
        return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sigma - 3 * (n - 1) * (n - 1) / ((n - 2) * (n - 3));
    },

    LARGE : function(array, k) {
        array = utility.objectToArray(array);
        return array.sort(function(a, b) {
            return b - a;
        })[k - 1];
    },

    LINEST : function(data_y, data_x) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var xmean = jStat.mean(data_x);
        var ymean = jStat.mean(data_y);
        var n = data_x.length;
        var num = 0;
        var den = 0;
        for (var i = 0; i < n; i++) {
            num += (data_x[i] - xmean) * (data_y[i] - ymean);
            den += Math.pow(data_x[i] - xmean, 2);
        }
        var m = num / den;
        var b = ymean - m * xmean;
        return [m, b];
    },

    LOGEST : function() {
        return;
    },

    LOGNORMDIST : function(x, mean, sd, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }

        return (cumulative) ? jStat.lognormal.cdf(x, mean, sd) : jStat.lognormal.pdf(x, mean, sd);
    },

    LOGNORMINV : function(probability, mean, sd) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.lognormal.inv(probability, mean, sd);
    },

    MAX : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var max = (n > 0) ? range[0] : 0;
        for (var i = 0; i < n; i++) {
            max = (range[i] > max && (range[i] !== true) && (range[i] !== false)) ? range[i] : max;
        }
        return max;
    },

    MAXA : function() {
        var range = utility.arrayMerge(arguments);
        return (range.length > 0) ? Math.max.apply(Math, range) : 0;
    },

    MEDIAN : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.median(utility.arrayMerge(arguments));
    },

    MIN : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var min = (n > 0) ? range[0] : 0;
        for (var i = 0; i < n; i++) {
            min = (range[i] < min && (range[i] !== true) && (range[i] !== false)) ? range[i] : min;
        }
        return min;
    },

    MINA : function() {
        var range = utility.arrayMerge(arguments);
        return (range.length > 0) ? Math.min.apply(Math, range) : 0;
    },

    MODEMULT : function() {
        // Credits: Roönaän
        var range = utility.arrayMerge(arguments),
            n = range.length,
            count = {},
            maxItems = [],
            max = 0,
            currentItem;
        for (var i = 0; i < n; i++) {
            currentItem = range[i];
            count[currentItem] = count[currentItem] ? count[currentItem] + 1 : 1;
            if (count[currentItem] > max) {
                max = count[currentItem];
                maxItems = [];
            }
            if (count[currentItem] === max) {
                maxItems[maxItems.length] = currentItem;
            }
        }
        return maxItems;
    },

    MODESNGL : function() {
        return formula.statistic.MODEMULT(utility.arrayMerge(arguments)).sort(function(a, b) {
            return a - b;
        })[0];
    },

    NEGBINOMDIST : function(k, r, p, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.negbin.cdf(k, r, p) : jStat.negbin.pdf(k, r, p);
    },

    NORMDIST : function(x, mean, sd, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        // Check parameters
        if (isNaN(x) || isNaN(mean) || isNaN(sd)) {
            return '#VALUE!';
        }
        if (sd <= 0) {
            return '#NUM!';
        }

        // Return normal distribution computed by jStat [http://jstat.org]
        return (cumulative) ? jStat.normal.cdf(x, mean, sd) : jStat.normal.pdf(x, mean, sd);
    },

    NORMINV : function(probability, mean, sd) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.normal.inv(probability, mean, sd);
    },

    NORMSDIST : function(z, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.normal.cdf(z, 0, 1) : jStat.normal.pdf(z, 0, 1);
    },

    NORMSINV : function(probability) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.normal.inv(probability, 0, 1);
    },

    PEARSON : function(data_x, data_y) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var xmean = jStat.mean(data_x);
        var ymean = jStat.mean(data_y);
        var n = data_x.length;
        var num = 0;
        var den1 = 0;
        var den2 = 0;
        for (var i = 0; i < n; i++) {
            num += (data_x[i] - xmean) * (data_y[i] - ymean);
            den1 += Math.pow(data_x[i] - xmean, 2);
            den2 += Math.pow(data_y[i] - ymean, 2);
        }
        return num / Math.sqrt(den1 * den2);
    },

    PERCENTILEEXC : function(array, k) {
        array = array.sort(function(a, b) {
            {
                return a - b;
            }
        });
        var n = array.length;
        if (k < 1 / (n + 1) || k > 1 - 1 / (n + 1)) {
            return '#NUM!';
        }
        var l = k * (n + 1) - 1;
        var fl = Math.floor(l);
        return utility.cleanFloat((l === fl) ? array[l] : array[fl] + (l - fl) * (array[fl + 1] - array[fl]));
    },

    PERCENTILEINC : function(array, k) {
        array = array.sort(function(a, b) {
            return a - b;
        });
        var n = array.length;
        var l = k * (n - 1);
        var fl = Math.floor(l);
        return utility.cleanFloat((l === fl) ? array[l] : array[fl] + (l - fl) * (array[fl + 1] - array[fl]));
    },

    PERCENTRANKEXC : function(array, x, significance) {
        array = array.sort(function(a, b) {
            return a - b;
        });
        var uniques = utility.unique(array);
        var n = array.length;
        var m = uniques.length;
        significance = (typeof significance === 'undefined') ? 3 : significance;
        var power = Math.pow(10, significance);
        var result = 0;
        var match = false;
        var i = 0;
        while (!match && i < m) {
            if (x === uniques[i]) {
                result = (array.indexOf(uniques[i]) + 1) / (n + 1);
                match = true;
            } else if (x >= uniques[i] && (x < uniques[i + 1] || i === m - 1)) {
                result = (array.indexOf(uniques[i]) + 1 + (x - uniques[i]) / (uniques[i + 1] - uniques[i])) / (n + 1);
                match = true;
            }
            i++;
        }
        return Math.floor(result * power) / power;
    },

    PERCENTRANKINC : function(array, x, significance) {
        array = array.sort(function(a, b) {
            return a - b;
        });
        var uniques = utility.unique(array);
        var n = array.length;
        var m = uniques.length;
        significance = (typeof significance === 'undefined') ? 3 : significance;
        var power = Math.pow(10, significance);
        var result = 0;
        var match = false;
        var i = 0;
        while (!match && i < m) {
            if (x === uniques[i]) {
                result = array.indexOf(uniques[i]) / (n - 1);
                match = true;
            } else if (x >= uniques[i] && (x < uniques[i + 1] || i === m - 1)) {
                result = (array.indexOf(uniques[i]) + (x - uniques[i]) / (uniques[i + 1] - uniques[i])) / (n - 1);
                match = true;
            }
            i++;
        }
        return Math.floor(result * power) / power;
    },

    PERMUT : function(number, number_chosen) {
        return formula.math.FACT(number) / formula.math.FACT(number - number_chosen);
    },

    PERMUTATIONA : function(number, number_chosen) {
        return Math.pow(number, number_chosen);
    },

    PHI : function(x) {
        return Math.exp(-0.5 * x * x) / data.SQRT2PI;
    },

    POISSONDIST : function(x, mean, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.poisson.cdf(x, mean) : jStat.poisson.pdf(x, mean);
    },

    PROB : function(range, probability, lower, upper) {
        if (typeof lower === 'undefined') {
            return 0;
        }

        upper = (typeof upper === 'undefined') ? lower : upper;
        if (lower === upper) {
            return (range.indexOf(lower) >= 0) ? probability[range.indexOf(lower)] : 0;
        }

        var sorted = range.sort(function(a, b) {
            return a - b;
        });
        var n = sorted.length;
        var result = 0;
        for (var i = 0; i < n; i++) {
            if (sorted[i] >= lower && sorted[i] <= upper) {
                result += probability[range.indexOf(sorted[i])];
            }
        }
        return result;
    },

    QUARTILEEXC : function(range, quart) {
        switch (quart) {
            case 1:
                return formula.statistic.PERCENTILEEXC(range, 0.25);
            case 2:
                return formula.statistic.PERCENTILEEXC(range, 0.5);
            case 3:
                return formula.statistic.PERCENTILEEXC(range, 0.75);
            default:
                return '#NUM!';
        }
    },

    QUARTILEINC : function(range, quart) {
        switch (quart) {
            case 1:
                return formula.statistic.PERCENTILEINC(range, 0.25);
            case 2:
                return formula.statistic.PERCENTILEINC(range, 0.5);
            case 3:
                return formula.statistic.PERCENTILEINC(range, 0.75);
            default:
                return '#NUM!';
        }
    },

    RANKAVG : function(number, range, order) {
        order = (typeof order === 'undefined') ? false : order;
        var sort = (order) ? function(a, b) {
            return a - b;
        } : function(a, b) {
            return b - a;
        };
        range = range.sort(sort);
        var count = utility.countIn(range, number);
        return (count > 1) ? (2 * range.indexOf(number) + count + 1) / 2 : range.indexOf(number) + 1;
    },

    RANKEQ : function(number, range, order) {
        order = (typeof order === 'undefined') ? false : order;
        var sort = (order) ? function(a, b) {
            return a - b;
        } : function(a, b) {
            return b - a;
        };
        range = range.sort(sort);
        return range.indexOf(number) + 1;
    },

    RSQ : function(data_x, data_y) {
        return Math.pow(formula.statistic.PEARSON(data_x, data_y), 2);
    },

    SKEW : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        var mean = jStat.mean(range);
        var n = range.length;
        var sigma = 0;
        for (var i = 0; i < n; i++) {
            sigma += Math.pow(range[i] - mean, 3);
        }
        return n * sigma / ((n - 1) * (n - 2) * Math.pow(jStat.stdev(range, true), 3));
    },

    SKEWP : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        var mean = jStat.mean(range);
        var n = range.length;
        var m2 = 0;
        var m3 = 0;
        for (var i = 0; i < n; i++) {
            m3 += Math.pow(range[i] - mean, 3);
            m2 += Math.pow(range[i] - mean, 2);
        }
        m3 = m3 / n;
        m2 = m2 / n;
        return m3 / Math.pow(m2, 3 / 2);
    },

    SLOPE : function(data_y, data_x) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var xmean = jStat.mean(data_x);
        var ymean = jStat.mean(data_y);
        var n = data_x.length;
        var num = 0;
        var den = 0;
        for (var i = 0; i < n; i++) {
            num += (data_x[i] - xmean) * (data_y[i] - ymean);
            den += Math.pow(data_x[i] - xmean, 2);
        }
        return num / den;
    },

    SMALL : function(array, k) {
        return array.sort(function(a, b) {
            return a - b;
        })[k - 1];
    },

    STANDARDIZE : function(x, mean, sd) {
        return (x - mean) / sd;
    },

    STDEVA : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var mean = jStat.mean(range);
        for (var i = 0; i < n; i++) {
            sigma += Math.pow(range[i] - mean, 2);
        }
        return Math.sqrt(sigma / (n - 1));
    },

    STDEVP : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var count = 0;
        var mean = formula.statistic.AVERAGE(range);
        for (var i = 0; i < n; i++) {
            if (range[i] !== true && range[i] !== false) {
                sigma += Math.pow(range[i] - mean, 2);
                count++;
            }
        }
        return Math.sqrt(sigma / count);
    },

    STDEVPA : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var mean = jStat.mean(range);
        for (var i = 0; i < n; i++) {
            sigma += Math.pow(range[i] - mean, 2);
        }
        return Math.sqrt(sigma / n);
    },

    STDEVS : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var count = 0;
        var mean = formula.statistic.AVERAGE(range);
        for (var i = 0; i < n; i++) {
            if (range[i] !== true && range[i] !== false) {
                sigma += Math.pow(range[i] - mean, 2);
                count++;
            }
        }
        return Math.sqrt(sigma / (count - 1));
    },

    STEYX : function(data_y, data_x) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var xmean = jStat.mean(data_x);
        var ymean = jStat.mean(data_y);
        var n = data_x.length;
        var lft = 0;
        var num = 0;
        var den = 0;
        for (var i = 0; i < n; i++) {
            lft += Math.pow(data_y[i] - ymean, 2);
            num += (data_x[i] - xmean) * (data_y[i] - ymean);
            den += Math.pow(data_x[i] - xmean, 2);
        }
        return Math.sqrt((lft - num * num / den) / (n - 2));
    },

    TDIST : function(x, df, cumulative) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return (cumulative) ? jStat.studentt.cdf(x, df) : jStat.studentt.pdf(x, df);
    },

    TDIST2T : function() {
        return;
    },

    TDISTRT : function() {
        return;
    },

    TINV : function(probability, df) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        return jStat.studentt.inv(probability, df);
    },

    TINV2T : function() {
        return;
    },

    TTEST : function() {
        return;
    },

    TREND : function() {
        return;
    },

    TRIMMEAN : function(range, percent) {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var n = range.length;
        var trim = formula.math.FLOOR(range.length * percent, 2) / 2;
        return jStat.mean(utility.initial(utility.rest(range.sort(function(a, b) {
            return a - b;
        }), trim), trim));
    },

    VARA : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var mean = jStat.mean(range);
        for (var i = 0; i < n; i++) {
            sigma += Math.pow(range[i] - mean, 2);
        }
        return sigma / (n - 1);
    },

    VARP : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var count = 0;
        var mean = formula.statistic.AVERAGE(range);
        for (var i = 0; i < n; i++) {
            if (range[i] !== true && range[i] !== false) {
                sigma += Math.pow(range[i] - mean, 2);
                count++;
            }
        }
        return sigma / count;
    },

    VARPA : function() {
        if(typeof(jStat) == 'undefined'){
            return data.ERRKEY.jStatRequired;
        }
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var mean = jStat.mean(range);
        for (var i = 0; i < n; i++) {
            sigma += Math.pow(range[i] - mean, 2);
        }
        return sigma / n;
    },

    VARS : function() {
        var range = utility.arrayMerge(arguments);
        var n = range.length;
        var sigma = 0;
        var count = 0;
        var mean = formula.statistic.AVERAGE(range);
        for (var i = 0; i < n; i++) {
            if (range[i] !== true && range[i] !== false) {
                sigma += Math.pow(range[i] - mean, 2);
                count++;
            }
        }
        return sigma / (count - 1);
    },

    WEIBULLDIST : function(x, alpha, beta, cumulative) {
        return (cumulative) ? 1 - Math.exp(-Math.pow(x / beta, alpha)) : Math.pow(x, alpha - 1) * Math.exp(-Math.pow(x / beta, alpha)) * alpha / Math.pow(beta, alpha);
    },

    ZTEST : function(range, x, sigma) {
        var n = range.length;
        var sd = (typeof sigma === 'undefined') ? formula.statistic.STDEVS(range) : sigma;
        return 1 - formula.statistic.NORMSDIST((formula.statistic.AVERAGE(range) - x) / (sd / Math.sqrt(n)), formula.logical.TRUE);
    }
},
    /**
 * logical formula group.
 * adapted from stoic's formula.js (http://www.stoic.com/pages/formula)
 * with modification to adapt Calx environment
 * @type {Object}
 */
logical : {
    AND : function() {
        var result = true;
        for (var i = 0; i < arguments.length; i++) {
            if (!arguments[i]) {
                result = false;
            }
        }
        return result;
    },

    CHOOSE : function(){
        var key = arguments[0];

        return (typeof(arguments[key]) == 'undefined') ? '#NUM!' : arguments[key];
    },

    FALSE : function(){
        return false;
    },

    IF : function(test, then_value, otherwise_value) {
        if (test) {
            return (typeof then_value === 'undefined') ? true : then_value;
        } else {
            return (typeof otherwise_value === 'undefined') ? false : otherwise_value;
        }
    },

    IFERROR : function(value, value_if_error) {
        return (data.ERROR.indexOf(value) >= 0) ? value_if_error : value;
    },

    IFNA : function(value, value_if_na) {
        return (value === '#N/A') ? value_if_na : value;
    },

    NOT : function(logical) {
        return !logical;
    },

    OR : function() {
        var result = false;
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i]) {
                result = true;
            }
        }
        return result;
    },

    SWITCH : function() {
        var result;
        if (arguments.length > 0) {
            var targetValue = arguments[0];
            var argc = arguments.length - 1;
            var switchCount = Math.floor(argc / 2);
            var switchSatisfied = false;
            var defaultClause = argc % 2 === 0 ? null : arguments[arguments.length - 1];

            if (switchCount) {
                for (var index = 0; index < switchCount; index++) {
                    if (targetValue == arguments[index * 2 + 1]) {
                        result = arguments[index * 2 + 2];
                        switchSatisfied = true;
                        break;
                    }
                }
            }

            if (!switchSatisfied && defaultClause) {
                result = defaultClause;
            }
        }

        return result;
    },

    TRUE : function() {
        return true;
    },

    XOR : function() {
        var result = 0;
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i]) {
                result++;
            }
        }
        return (Math.floor(Math.abs(result)) & 1) ? true : false;
    },

    NULL : function(){
        return null;
    }


},
    geometry : {
    
},
    text:{
    CONCAT : function(){
        var result = '', cell;

        for(cell in arguments){
            if(typeof(arguments[cell]) == 'object'){
                result += formula.text.CONCAT.apply(this, arguments[cell]);
            }else{
                result += arguments[cell];
            }
        }

        return result;
    },

    CHAR : function(number) {
        return String.fromCharCode(number);
    },

    CLEAN : function(text) {
        var re = /[\0-\x1F]/g;
        return text.replace(re, "");
    },

    CODE : function(text) {
        return text.charCodeAt(0);
    },

    CONCATENATE : function() {
        var string = '';
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] !== null && arguments[i] !== undefined) {
                string += arguments[i];
            }
        }

        return string;
    },

    DOLLAR : function(number, decimals) {

        if(typeof(numeral) == 'undefined'){
            return '#NAME?';
        }
        decimals = (typeof decimals === 'undefined') ? 2 : decimals;
        var format = '';
        if (decimals <= 0) {
            number = Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
            format = '($0,0)';
        } else if (decimals > 0) {
            format = '($0,0.' + new Array(decimals + 1).join('0') + ')';
        }
        return numeral(number).format(format);
    },

    EXACT : function(text1, text2) {
        return text1 === text2;
    },

    FIND : function(find_text, within_text, position) {
        position = (typeof position === 'undefined') ? 0 : position;
        return within_text ? within_text.indexOf(find_text, position - 1) + 1 : null;
    },

    FIXED : function(number, decimals, no_commas) {
        if(typeof(numeral) == 'undefined'){
            return '#NAME?';
        }
        decimals = (typeof decimals === 'undefined') ? 2 : decimals;
        no_commas = (typeof no_commas === 'undefined') ? false : no_commas;
        var format = no_commas ? '0' : '0,0';
        if (decimals <= 0) {
            number = Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
        } else if (decimals > 0) {
            format += '.' + new Array(decimals + 1).join('0');
        }
        return numeral(number).format(format);
    },

    HTML2TEXT : function(value) {
        var result = '';

        if (value) {
            if (value instanceof Array) {
                value.forEach(function(line) {
                    if (result !== '') {
                        result += '\n';
                    }
                    result += (line.replace(/<(?:.|\n)*?>/gm, ''));
                });
            } else {
                result = value.replace(/<(?:.|\n)*?>/gm, '');
            }
        }

        return result;
    },

    HUMANIZE : function(value) {
        if (value instanceof Date) {
            var dvalue = moment(value);
            if (dvalue.hours() || dvalue.minutes() || dvalue.seconds()) {
                return dvalue.format("dddd, MMMM Do YYYY, h:mm:ss");
            } else {
                return dvalue.format("dddd, MMMM Do YYYY");
            }
        }

        return value;
    },

    JOIN : function(array, separator) {
        return array.join(separator);
    },

    LEFT : function(text, number) {
        number = (typeof number === 'undefined') ? 1 : number;
        return text ? text.substring(0, number) : null;
    },

    LEN : function(text) {
        return (text+'').length;
    },

    LOWER : function(text) {
        return text ? text.toLowerCase() : text;
    },

    MID : function(text, start, number) {
        return text.substring(start - 1, number);
    },

    NUMBERVALUE : function(text, decimal_separator, group_separator) {
        decimal_separator = (typeof decimal_separator === 'undefined') ? '.' : decimal_separator;
        group_separator = (typeof group_separator === 'undefined') ? ',' : group_separator;
        return Number(text.replace(decimal_separator, '.').replace(group_separator, ''));
    },

    PROPER : function(text) {
        return text.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },

    REGEXEXTRACT : function(text, regular_expression) {
        var match = text.match(new RegExp(regular_expression));
        return match ? match[0] : null;
    },

    REGEXMATCH : function(text, regular_expression, full) {
        var match = text.match(new RegExp(regular_expression));
        return full ? match : (text.match(new RegExp(regular_expression)) ? true : false);
    },

    REGEXREPLACE : function(text, regular_expression, replacement) {
        return text.replace(new RegExp(regular_expression), replacement);
    },

    REPLACE : function(text, position, length, new_text) {
        return text.substr(0, position - 1) + new_text + text.substr(position - 1 + length);
    },

    REPT : function(text, number) {
        return new Array(number + 1).join(text);
    },

    RIGHT : function(text, number) {
        number = (typeof number === 'undefined') ? 1 : number;
        return text ? text.substring(text.length - number) : null;
    },

    ROMAN : function(number) {
        // The MIT License
        // Copyright (c) 2008 Steven Levithan
        var digits = String(number).split('');
        var key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM', '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC', '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
        var roman = '';
        var i = 3;
        while (i--) {
            roman = (key[+digits.pop() + (i * 10)] || '') + roman;
        }
        return new Array(+digits.join('') + 1).join('M') + roman;
    },

    SEARCH : function(find_text, within_text, position) {
        position = (typeof position === 'undefined') ? 0 : position;
        return within_text.toLowerCase().indexOf(find_text.toLowerCase(), position - 1) + 1;
    },

    SPLIT : function(text, separator) {
        text = $.trim(text);
        return text.split(text, separator || /\s+/);
    },

    SUBSTITUTE : function(text, old_text, new_text, occurrence) {
        if (!text || !old_text || !new_text) {
            return text;
        } else if (typeof occurrence === 'undefined') {
            return text.replace(new RegExp(old_text, 'g'), new_text);
        } else {
            var index = 0;
            var i = 0;
            while (text.indexOf(old_text, index) > 0) {
                index = text.indexOf(old_text, index + 1);
                i++;
                if (i === occurrence) {
                    return text.substring(0, index) + new_text + text.substring(index + old_text.length);
                }
            }
        }
    },

    T : function(value) {
        return (typeof value === "string") ? value : null;
    },

    TEXT : function(value, format) {
        if(typeof(numeral) == 'undefined'){
            return '#NAME?';
        }
        var text = '';

        if (value) {
            if (value instanceof Object) {
                try {
                    text = JSON.stringify(value);
                } catch (err) {
                    // ignore
                }
            } else if (typeof value === 'string') {
                if (format) {
                    text = (format.indexOf('0') >= 0) ? numeral(value).format(format) : moment(new Date(value)).format(format);
                } else {
                    text = value;
                }
            } else if (value.toString && typeof value.toString === 'function') {
                text = value.toString();
            }
        }

        return text;
    },

    TRIM : function(text){
        return $.trim(text);
    },

    UNICHAR : function(number){
        return formula.text.CHAR(number);
    },

    UNICODE : function(text){
        return formula.text.CODE(text);
    },

    UPPER : function(text) {
        return text.toUpperCase();
    },

    VALUE : function(text) {
        if(typeof(numeral) == 'undefined'){
            return '#NAME?';
        }
        return numeral().unformat(text);
    }
},
    trigonometry:{
    
},
    general: {

    VLOOKUP: function(value, table, colIndex, approx) {
        var col, row, rowLength, colLength;

        if (typeof(table == 'object') && table.constructor.name == 'Object') {
            table = utility.rangeToTable(table);
        }

        rowLength = table.length;
        colLength = table[0].length;
        colIndex  = colIndex - 1;
        /** default approx to false */
        approx = typeof(approx) == 'undefined' ? false : approx;

        if (colIndex > colLength - 1) {
            return '#REF!';
        }

        if (colIndex < 0) {
            return '#VALUE!';
        }

        if (false == approx) {
            for (row = 0; row < rowLength; row++) {
                if (value == table[row][0]) {
                    return table[row][colIndex];
                }
            }

            return '#N/A!';
        } else {
            var delta = {}, deltaMax, deltaLength, difference;

            /** collect the difference between value on index 0, dismiss if delta is positive */
            for (row = 0; row < rowLength; row++) {
                if (value == table[row][0]) {
                    return table[row][colIndex];
                }

                difference = table[row][0] - value;

                if (difference < 0) {
                    delta[row] = difference;
                }
            }

            var deltaLength = delta.length;
            var deltaMax = null;
            var rowIndex = null;


            for (var a in delta) {
                if (deltaMax == null) {
                    deltaMax = delta[a];
                    rowIndex = a;
                } else {
                    deltaMax = (deltaMax > delta[a]) ? deltaMax : delta[a];
                    rowIndex = (deltaMax > delta[a]) ? rowIndex : a;
                }
            }

            if (rowIndex == null) {
                return '#N/A!';
            }

            return table[rowIndex][colIndex];
        }
    },

    HLOOKUP: function(value, table, rowIndex, approx) {
        if (typeof(table == 'object')) {
            table = utility.rangeToTable(table);
        }

        table = utility.transposeTable(table);

        return formula.general.VLOOKUP(value, table, rowIndex, approx);
    },

    LOOKUP: function(value, lookup, target) {
        var lookupIndex, lookupLength, targetIndex, targetLength, delta = [],
            deltaLength, deltaIndex, deltaMax, deltaMin;

        target = typeof target == 'undefined' ? false : target;

        if (typeof(lookup == 'object') && lookup.constructor.name == 'Object') {
            lookup = utility.objectToArray(lookup);
            lookupLength = lookup.length;
        }

        if (typeof(target == 'object') && target.constructor.name == 'Object') {
            target = utility.objectToArray(target);
            targetLength = target.length;
        }

        if (value < Math.min.apply(Math, lookup)) {
            return '#N/A!';
        }

        for (lookupIndex = 0; lookupIndex < lookupLength; lookupIndex++) {

            if (value == lookup[lookupIndex]) {
                return target ? target[lookupIndex] : lookup[lookupIndex];
            } else {
                delta[lookupIndex] = value - lookup[lookupIndex];
            }
        }

        /** convert minus to max */
        deltaLength = delta.length;
        deltaMax = Math.max.apply(Math, delta);
        for (deltaIndex = 0; deltaIndex < deltaLength; deltaIndex++) {
            if (delta[deltaIndex] < 0) {
                delta[deltaIndex] = deltaMax;
            }
        }

        deltaMin = Math.min.apply(Math, delta);
        lookupIndex = delta.indexOf(deltaMin);

        return (target) ? target[lookupIndex] : lookup[lookupIndex];

    },

    SERVER: function() {
        if (this.config.ajaxUrl == null) {
            return data.ERRKEY.ajaxUrlRequired;
        }

        var result,
            funcName = arguments[0],
            params = {};

        for (var a = 1; a < arguments.length; a++) {
            params['params[' + a + ']'] = arguments[a];
        }

        params['function'] = funcName;

        $.ajax({
            url: this.config.ajaxUrl,
            method: this.config.ajaxMethod,
            data: params,
            async: false,
            success: function(response) {
                result = response;
            },
            error: function(response) {
                result = data.ERRKEY.sendRequestError;
            }
        });

        return result;
    },

    GRAPH: function(data, options) {

        var graphOptions = {},
            cellElement = this.getActiveCell().el,
            plotOptions = {},
            options = (typeof(options) == 'undefined') ? [] : options,
            keyval, graphData;

        /**
         * parsing option come from formula into javascript object
         */
        for (var a = 0; a < options.length; a++) {
            keyval = options[a].split('=');
            graphOptions[keyval[0]] = keyval[1];
        }

        /**
         * setup default height and width
         */
        if (!cellElement.height()) {
            cellElement.css('height', '300px');
        }

        if (!cellElement.width) {
            cellElement.css('width', '300px');
        }

        switch (graphOptions.type) {
            case 'bar':
                graphData = utility.rangeToTable(data);
                if (typeof(graphOptions.reverse != 'undefined') && graphOptions.reverse == 'true') {
                    graphData.reverse();
                }
                plotOptions.series = {
                    bars: {
                        show: true,
                        barWidth: 0.6,
                        align: "center"
                    },
                    stack: true
                };
                if (typeof(graphOptions.bar_orientation) != 'undefined' && graphOptions.bar_orientation == 'horizontal') {
                    plotOptions.series.bars.horizontal = true;
                }
                break;

            case 'pie':
                graphData = utility.objectToArray(data);
                plotOptions.series = {
                    pie: {
                        show: true,
                        radius: 0.8
                    }
                };
                plotOptions.legend = {
                    show: false
                }
                break;

            case 'doughnut':
            case 'donut':
                graphData = utility.objectToArray(data);
                plotOptions.series = {
                    pie: {
                        show: true,
                        innerRadius: 0.5,
                        radius: 0.8
                    }
                };
                plotOptions.legend = {
                    show: false
                }
                break;

            default:
                graphData = utility.rangeToTable(data);
                if (typeof(graphOptions.reverse != 'undefined') && graphOptions.reverse == 'true') {
                    graphData.reverse();
                }
                break;
        }

        /**
         * change the table orientation if configured
         */
        if (typeof(graphOptions.orientation) != 'undefined' && graphOptions.orientation == 'vertical') {
            graphData = utility.transposeTable(graphData);
        }

        /**
         * parsing label as x-axis label
         */
        if (typeof(graphOptions.label) != 'undefined') {
            var label = this.evaluate(graphOptions.label),
                label = utility.objectToArray(label),
                rowLength = graphData.length,
                colLength, row, col, data;

            for (row = 0; row < rowLength; row++) {

                colLength = graphData[row].length;

                for (col = 0; col < colLength; col++) {
                    data = graphData[row][col];
                    graphData[row][col] = [label[col], data];
                }
            }

            plotOptions.xaxis = {
                mode: "categories",
                tickLength: 0
            };
        } else {

            var rowLength = graphData.length,
                colLength, row, col, data;

            for (row = 0; row < rowLength; row++) {

                colLength = graphData[row].length;

                for (col = 0; col < colLength; col++) {
                    data = graphData[row][col];
                    if (typeof(graphOptions.bar_orientation) != 'undefined' && graphOptions.bar_orientation == 'horizontal') {
                        graphData[row][col] = [data, col];
                    } else {
                        graphData[row][col] = [col, data];
                    }
                }
            }
        }

        /**
         * parsing legend and merge with the graph data
         */
        if (typeof(graphOptions.legend) != 'undefined') {
            var legend = this.evaluate(graphOptions.legend),
                legend = utility.objectToArray(legend),
                newGraphData = [];

            for (var graphLength = 0; graphLength < graphData.length; graphLength++) {
                newGraphData.push({
                    label: legend[graphLength],
                    data: graphData[graphLength]
                });
            }

            graphData = newGraphData;
        }

        /**
         * hide and show axis label
         */
        if (typeof(graphOptions.show_x_axis) != 'undefined' && graphOptions.show_x_axis == 'false') {
            plotOptions.xaxis = plotOptions.xaxis || {};
            plotOptions.xaxis.show = false;
        }

        if (typeof(graphOptions.show_y_axis) != 'undefined' && graphOptions.show_y_axis == 'false') {
            plotOptions.yaxis = plotOptions.yaxis || {};
            plotOptions.yaxis.show = false;
        }

        plotOptions.grid = {
            backgroundColor: {
                colors: ["#fff", "#eee"]
            },
            borderWidth: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        };


        setTimeout(function() {
            $.plot(cellElement, graphData, plotOptions);
        }, 100);


        return false;

    }
},
    engineering: {

    /**
     * Implement BIN2DEC function, part of the stoic's formula.js (http://www.stoic.com/pages/formula)
     * Converting binary number to decimal number
     * @param {[type]} number [description]
     */
    BIN2DEC: function(number) {
        // Return error if number is not binary or contains more than 10 characters (10 digits)
        if (!utility.isValidBinary(number)) {
            return '#NUM!';
        }

        // Convert binary number to decimal
        var result = parseInt(number, 2);

        // Handle negative numbers
        var stringified = number.toString();
        if (stringified.length === 10 && stringified.substring(0, 1) === '1') {
            return parseInt(stringified.substring(1), 2) - 512;
        } else {
            return result;
        }
    },

    /**
     * Implement BIN2HEX function, part of the stoic's formula.js (http://www.stoic.com/pages/formula)
     * Convert binary number into hexadecimal number
     * @param {integer} number [description]
     * @param {string} places [description]
     */
    BIN2HEX: function(number, places) {
        // Return error if number is not binary or contains more than 10 characters (10 digits)
        if (!utility.isValidBinary(number)) {
            return '#NUM!';
        }

        // Ignore places and return a 10-character hexadecimal number if number is negative
        var stringified = number.toString();
        if (stringified.length === 10 && stringified.substring(0, 1) === '1') {
            return (1099511627264 + parseInt(stringified.substring(1), 2)).toString(16);
        }

        // Convert binary number to hexadecimal
        var result = parseInt(number, 2).toString(16);

        // Return hexadecimal number using the minimum number of characters necessary if places is undefined
        if (typeof places === 'undefined') {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
                return '#VALUE!';
            }

            // Return error if places is negative
            if (places < 0) {
                return '#NUM!';
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
            return (places >= result.length) ? utility.repeat('0', places - result.length) + result : '#NUM!';
        }
    },

    /**
     * Implement BIN2OCT function, part of the stoic's formula.js (http://www.stoic.com/pages/formula)
     * Convert binary number into octal number
     * @param {integer} number [description]
     * @param {string}  places [description]
     */
    BIN2OCT: function(number, places) {
        // Return error if number is not binary or contains more than 10 characters (10 digits)
        if (!utility.isValidBinary(number)) {
            return '#NUM!';
        }

        // Ignore places and return a 10-character octal number if number is negative
        var stringified = number.toString();
        if (stringified.length === 10 && stringified.substring(0, 1) === '1') {
            return (1073741312 + parseInt(stringified.substring(1), 2)).toString(8);
        }

        // Convert binary number to octal
        var result = parseInt(number, 2).toString(8);

        // Return octal number using the minimum number of characters necessary if places is undefined
        if (typeof places === 'undefined') {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
                return '#VALUE!';
            }

            // Return error if places is negative
            if (places < 0) {
                return '#NUM!';
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
            return (places >= result.length) ? utility.repeat('0', places - result.length) + result : '#NUM!';
        }
    },

    /**
     * Implement BITAND function, part of the stoic's formula.js (http://www.stoic.com/pages/formula)
     * Bitwise AND operator
     * @param {integer} number1 [description]
     * @param {integer} number2 [description]
     */
    BITAND: function(number1, number2) {
        number1 = parseFloat(number1, 10);
        number2 = parseFloat(number2, 10);

        // Return error if either number is a non-numeric value
        if (isNaN(number1) || isNaN(number2)) {
            return '#VALUE!';
        }

        // Return error if either number is less than 0
        if (number1 < 0 || number2 < 0) {
            return '#NUM!';
        }

        // Return error if either number is a non-integer
        if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
            return '#NUM!';
        }

        // Return error if either number is greater than (2^48)-1
        if (number1 > 281474976710655 || number2 > 281474976710655) {
            return '#NUM!';
        }

        // Return bitwise AND of two numbers
        return number1 & number2;
    },

    /**
     * Implement BITLSHIFT function, part of the stoic's formula.js (http://www.stoic.com/pages/formula)
     * Bitwise Left Shift operator
     * @param {integer} number1 [description]
     * @param {integer} shift   [description]
     */
    BITLSHIFT: function(number, shift) {
        number = parseFloat(number, 10);
        shift  = parseFloat(shift , 10);
        // Return error if either number is a non-numeric value
        if (isNaN(number) || isNaN(shift)) {
            return '#VALUE!';
        }

        // Return error if number is less than 0
        if (number < 0) {
            return '#NUM!';
        }

        // Return error if number is a non-integer
        if (Math.floor(number) !== number) {
            return '#NUM!';
        }

        // Return error if number is greater than (2^48)-1
        if (number > 281474976710655) {
            return '#NUM!';
        }

        // Return error if the absolute value of shift is greater than 53
        if (Math.abs(shift) > 53) {
            return '#NUM!';
        }

        // Return number shifted by shift bits to the left or to the right if shift is negative
        return (shift >= 0) ? number << shift : number >> -shift;
    },

    /**
     * Implement BITOR function, part of the stoic's formula.js (http://www.stoic.com/pages/formula)
     * Bitwise OR operator
     * @param {integer} number1 [description]
     * @param {integer} number2 [description]
     */
    BITOR: function(number1, number2) {
        number1 = parseFloat(number1, 10);
        number2 = parseFloat(number2, 10);

        // Return error if either number is a non-numeric value
        if (isNaN(number1) || isNaN(number2)) {
            return '#VALUE!';
        }

        // Return error if either number is less than 0
        if (number1 < 0 || number2 < 0) {
            return '#NUM!';
        }

        // Return error if either number is a non-integer
        if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
            return '#NUM!';
        }

        // Return error if either number is greater than (2^48)-1
        if (number1 > 281474976710655 || number2 > 281474976710655) {
            return '#NUM!';
        }

        // Return bitwise OR of two numbers
        return number1 | number2;
    },

    /**
     * Implement BITRSHIFT function, part of the stoic's formula.js (http://www.stoic.com/pages/formula)
     * Bitwise Right Shift operator
     * @param {integer} number1 [description]
     * @param {integer} shift   [description]
     */
    BITRSHIFT : function(number, shift) {
        number = parseFloat(number, 10);
        shift  = parseFloat(shift,  10);

        // Return error if either number is a non-numeric value
        if (isNaN(number) || isNaN(shift)) {
            return '#VALUE!';
        }

        // Return error if number is less than 0
        if (number < 0) {
            return '#NUM!';
        }

        // Return error if number is a non-integer
        if (Math.floor(number) !== number) {
            return '#NUM!';
        }

        // Return error if number is greater than (2^48)-1
        if (number > 281474976710655) {
            return '#NUM!';
        }

        // Return error if the absolute value of shift is greater than 53
        if (Math.abs(shift) > 53) {
            return '#NUM!';
        }

        // Return number shifted by shift bits to the right or to the left if shift is negative
        return (shift >= 0) ? number >> shift : number << -shift;
    },

    /**
     * Implement BITXOR function, part of the stoic's formula.js (http://www.stoic.com/pages/formula)
     * Bitwise XOR operator
     * @param {integer} number1 [description]
     * @param {integer} number2 [description]
     */
    BITXOR : function(number1, number2) {
        number1 = parseFloat(number1, 10);
        number2 = parseFloat(number2, 10);

        // Return error if either number is a non-numeric value
        if (isNaN(number1) || isNaN(number2)) {
            return '#VALUE!';
        }

        // Return error if either number is less than 0
        if (number1 < 0 || number2 < 0) {
            return '#NUM!';
        }

        // Return error if either number is a non-integer
        if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
            return '#NUM!';
        }

        // Return error if either number is greater than (2^48)-1
        if (number1 > 281474976710655 || number2 > 281474976710655) {
            return '#NUM!';
        }

        // Return bitwise XOR of two numbers
        return number1 ^ number2;
    },

    COMPLEX: function(real, imaginary, suffix) {
        // Return error if either number is a non-numeric value
        if (isNaN(real) || isNaN(imaginary)) {
            return '#VALUE!';
        }

        // Set suffix
        suffix = (typeof suffix === 'undefined') ? 'i' : suffix;

        // Return error if suffix is neither "i" nor "j"
        if (suffix !== 'i' && suffix !== 'j') {
            return '#VALUE!';
        }

        // Return complex number
        if (real === 0 && imaginary === 0) {
            return 0;
        } else if (real === 0) {
            return (imaginary === 1) ? suffix : imaginary.toString() + suffix;
        } else if (imaginary === 0) {
            return real.toString();
        } else {
            var sign = (imaginary > 0) ? '+' : '';
            return real.toString() + sign + ((imaginary === 1) ? suffix : imaginary.toString() + suffix);
        }
    },

    /**
     * Implement CONVERT function, part of the stoic's formula.js (http://www.stoic.com/pages/formula)
     * Converting value from one measurement unit to another measurement unit
     * @param {int}     number      [value in first unit]
     * @param {string}  from_unit   [source measurement unit]
     * @param {string}  to_unit     [destinaition measurement unit]
     */
    CONVERT: function(number, from_unit, to_unit) {
        // Return error if number is a non-numeric value
        if (isNaN(number)) {
            return '#VALUE!';
        }

        // List of units supported by CONVERT and units defined by the International System of Units
        // [Name, Symbol, Alternate symbols, Quantity, ISU, CONVERT, Conversion ratio]
        var units = [
            ["a.u. of action", "?", null, "action", false, false, 1.05457168181818e-34],
            ["a.u. of charge", "e", null, "electric_charge", false, false, 1.60217653141414e-19],
            ["a.u. of energy", "Eh", null, "energy", false, false, 4.35974417757576e-18],
            ["a.u. of length", "a?", null, "length", false, false, 5.29177210818182e-11],
            ["a.u. of mass", "m?", null, "mass", false, false, 9.10938261616162e-31],
            ["a.u. of time", "?/Eh", null, "time", false, false, 2.41888432650516e-17],
            ["admiralty knot", "admkn", null, "speed", false, true, 0.514773333],
            ["ampere", "A", null, "electric_current", true, false, 1],
            ["ampere per meter", "A/m", null, "magnetic_field_intensity", true, false, 1],
            ["ångström", "Å", ["ang"], "length", false, true, 1e-10],
            ["are", "ar", null, "area", false, true, 100],
            ["astronomical unit", "ua", null, "length", false, false, 1.49597870691667e-11],
            ["bar", "bar", null, "pressure", false, false, 100000],
            ["barn", "b", null, "area", false, false, 1e-28],
            ["becquerel", "Bq", null, "radioactivity", true, false, 1],
            ["bit", "bit", ["b"], "information", false, true, 1],
            ["btu", "BTU", ["btu"], "energy", false, true, 1055.05585262],
            ["byte", "byte", null, "information", false, true, 8],
            ["candela", "cd", null, "luminous_intensity", true, false, 1],
            ["candela per square metre", "cd/m?", null, "luminance", true, false, 1],
            ["coulomb", "C", null, "electric_charge", true, false, 1],
            ["cubic ångström", "ang3", ["ang^3"], "volume", false, true, 1e-30],
            ["cubic foot", "ft3", ["ft^3"], "volume", false, true, 0.028316846592],
            ["cubic inch", "in3", ["in^3"], "volume", false, true, 0.000016387064],
            ["cubic light-year", "ly3", ["ly^3"], "volume", false, true, 8.46786664623715e-47],
            ["cubic metre", "m?", null, "volume", true, true, 1],
            ["cubic mile", "mi3", ["mi^3"], "volume", false, true, 4168181825.44058],
            ["cubic nautical mile", "Nmi3", ["Nmi^3"], "volume", false, true, 6352182208],
            ["cubic Pica", "Pica3", ["Picapt3", "Pica^3", "Picapt^3"], "volume", false, true, 7.58660370370369e-8],
            ["cubic yard", "yd3", ["yd^3"], "volume", false, true, 0.764554857984],
            ["cup", "cup", null, "volume", false, true, 0.0002365882365],
            ["dalton", "Da", ["u"], "mass", false, false, 1.66053886282828e-27],
            ["day", "d", ["day"], "time", false, true, 86400],
            ["degree", "°", null, "angle", false, false, 0.0174532925199433],
            ["degrees Rankine", "Rank", null, "temperature", false, true, 0.555555555555556],
            ["dyne", "dyn", ["dy"], "force", false, true, 0.00001],
            ["electronvolt", "eV", ["ev"], "energy", false, true, 1.60217656514141],
            ["ell", "ell", null, "length", false, true, 1.143],
            ["erg", "erg", ["e"], "energy", false, true, 1e-7],
            ["farad", "F", null, "electric_capacitance", true, false, 1],
            ["fluid ounce", "oz", null, "volume", false, true, 0.0000295735295625],
            ["foot", "ft", null, "length", false, true, 0.3048],
            ["foot-pound", "flb", null, "energy", false, true, 1.3558179483314],
            ["gal", "Gal", null, "acceleration", false, false, 0.01],
            ["gallon", "gal", null, "volume", false, true, 0.003785411784],
            ["gauss", "G", ["ga"], "magnetic_flux_density", false, true, 1],
            ["grain", "grain", null, "mass", false, true, 0.0000647989],
            ["gram", "g", null, "mass", false, true, 0.001],
            ["gray", "Gy", null, "absorbed_dose", true, false, 1],
            ["gross registered ton", "GRT", ["regton"], "volume", false, true, 2.8316846592],
            ["hectare", "ha", null, "area", false, true, 10000],
            ["henry", "H", null, "inductance", true, false, 1],
            ["hertz", "Hz", null, "frequency", true, false, 1],
            ["horsepower", "HP", ["h"], "power", false, true, 745.69987158227],
            ["horsepower-hour", "HPh", ["hh", "hph"], "energy", false, true, 2684519.538],
            ["hour", "h", ["hr"], "time", false, true, 3600],
            ["imperial gallon (U.K.)", "uk_gal", null, "volume", false, true, 0.00454609],
            ["imperial hundredweight", "lcwt", ["uk_cwt", "hweight"], "mass", false, true, 50.802345],
            ["imperial quart (U.K)", "uk_qt", null, "volume", false, true, 0.0011365225],
            ["imperial ton", "brton", ["uk_ton", "LTON"], "mass", false, true, 1016.046909],
            ["inch", "in", null, "length", false, true, 0.0254],
            ["international acre", "uk_acre", null, "area", false, true, 4046.8564224],
            ["IT calorie", "cal", null, "energy", false, true, 4.1868],
            ["joule", "J", null, "energy", true, true, 1],
            ["katal", "kat", null, "catalytic_activity", true, false, 1],
            ["kelvin", "K", ["kel"], "temperature", true, true, 1],
            ["kilogram", "kg", null, "mass", true, true, 1],
            ["knot", "kn", null, "speed", false, true, 0.514444444444444],
            ["light-year", "ly", null, "length", false, true, 9460730472580800],
            ["litre", "L", ["l", "lt"], "volume", false, true, 0.001],
            ["lumen", "lm", null, "luminous_flux", true, false, 1],
            ["lux", "lx", null, "illuminance", true, false, 1],
            ["maxwell", "Mx", null, "magnetic_flux", false, false, 1e-18],
            ["measurement ton", "MTON", null, "volume", false, true, 1.13267386368],
            ["meter per hour", "m/h", ["m/hr"], "speed", false, true, 0.00027777777777778],
            ["meter per second", "m/s", ["m/sec"], "speed", true, true, 1],
            ["meter per second squared", "m?s??", null, "acceleration", true, false, 1],
            ["parsec", "pc", ["parsec"], "length", false, true, 30856775814671900],
            ["meter squared per second", "m?/s", null, "kinematic_viscosity", true, false, 1],
            ["metre", "m", null, "length", true, true, 1],
            ["miles per hour", "mph", null, "speed", false, true, 0.44704],
            ["millimetre of mercury", "mmHg", null, "pressure", false, false, 133.322],
            ["minute", "?", null, "angle", false, false, 0.000290888208665722],
            ["minute", "min", ["mn"], "time", false, true, 60],
            ["modern teaspoon", "tspm", null, "volume", false, true, 0.000005],
            ["mole", "mol", null, "amount_of_substance", true, false, 1],
            ["morgen", "Morgen", null, "area", false, true, 2500],
            ["n.u. of action", "?", null, "action", false, false, 1.05457168181818e-34],
            ["n.u. of mass", "m?", null, "mass", false, false, 9.10938261616162e-31],
            ["n.u. of speed", "c?", null, "speed", false, false, 299792458],
            ["n.u. of time", "?/(me?c??)", null, "time", false, false, 1.28808866778687e-21],
            ["nautical mile", "M", ["Nmi"], "length", false, true, 1852],
            ["newton", "N", null, "force", true, true, 1],
            ["œrsted", "Oe ", null, "magnetic_field_intensity", false, false, 79.5774715459477],
            ["ohm", "Ω", null, "electric_resistance", true, false, 1],
            ["ounce mass", "ozm", null, "mass", false, true, 0.028349523125],
            ["pascal", "Pa", null, "pressure", true, false, 1],
            ["pascal second", "Pa?s", null, "dynamic_viscosity", true, false, 1],
            ["pferdestärke", "PS", null, "power", false, true, 735.49875],
            ["phot", "ph", null, "illuminance", false, false, 0.0001],
            ["pica (1/6 inch)", "pica", null, "length", false, true, 0.00035277777777778],
            ["pica (1/72 inch)", "Pica", ["Picapt"], "length", false, true, 0.00423333333333333],
            ["poise", "P", null, "dynamic_viscosity", false, false, 0.1],
            ["pond", "pond", null, "force", false, true, 0.00980665],
            ["pound force", "lbf", null, "force", false, true, 4.4482216152605],
            ["pound mass", "lbm", null, "mass", false, true, 0.45359237],
            ["quart", "qt", null, "volume", false, true, 0.000946352946],
            ["radian", "rad", null, "angle", true, false, 1],
            ["second", "?", null, "angle", false, false, 0.00000484813681109536],
            ["second", "s", ["sec"], "time", true, true, 1],
            ["short hundredweight", "cwt", ["shweight"], "mass", false, true, 45.359237],
            ["siemens", "S", null, "electrical_conductance", true, false, 1],
            ["sievert", "Sv", null, "equivalent_dose", true, false, 1],
            ["slug", "sg", null, "mass", false, true, 14.59390294],
            ["square ångström", "ang2", ["ang^2"], "area", false, true, 1e-20],
            ["square foot", "ft2", ["ft^2"], "area", false, true, 0.09290304],
            ["square inch", "in2", ["in^2"], "area", false, true, 0.00064516],
            ["square light-year", "ly2", ["ly^2"], "area", false, true, 8.95054210748189e+31],
            ["square meter", "m?", null, "area", true, true, 1],
            ["square mile", "mi2", ["mi^2"], "area", false, true, 2589988.110336],
            ["square nautical mile", "Nmi2", ["Nmi^2"], "area", false, true, 3429904],
            ["square Pica", "Pica2", ["Picapt2", "Pica^2", "Picapt^2"], "area", false, true, 0.00001792111111111],
            ["square yard", "yd2", ["yd^2"], "area", false, true, 0.83612736],
            ["statute mile", "mi", null, "length", false, true, 1609.344],
            ["steradian", "sr", null, "solid_angle", true, false, 1],
            ["stilb", "sb", null, "luminance", false, false, 0.0001],
            ["stokes", "St", null, "kinematic_viscosity", false, false, 0.0001],
            ["stone", "stone", null, "mass", false, true, 6.35029318],
            ["tablespoon", "tbs", null, "volume", false, true, 0.0000147868],
            ["teaspoon", "tsp", null, "volume", false, true, 0.00000492892],
            ["tesla", "T", null, "magnetic_flux_density", true, true, 1],
            ["thermodynamic calorie", "c", null, "energy", false, true, 4.184],
            ["ton", "ton", null, "mass", false, true, 907.18474],
            ["tonne", "t", null, "mass", false, false, 1000],
            ["U.K. pint", "uk_pt", null, "volume", false, true, 0.00056826125],
            ["U.S. bushel", "bushel", null, "volume", false, true, 0.03523907],
            ["U.S. oil barrel", "barrel", null, "volume", false, true, 0.158987295],
            ["U.S. pint", "pt", ["us_pt"], "volume", false, true, 0.000473176473],
            ["U.S. survey mile", "survey_mi", null, "length", false, true, 1609.347219],
            ["U.S. survey/statute acre", "us_acre", null, "area", false, true, 4046.87261],
            ["volt", "V", null, "voltage", true, false, 1],
            ["watt", "W", null, "power", true, true, 1],
            ["watt-hour", "Wh", ["wh"], "energy", false, true, 3600],
            ["weber", "Wb", null, "magnetic_flux", true, false, 1],
            ["yard", "yd", null, "length", false, true, 0.9144],
            ["year", "yr", null, "time", false, true, 31557600]
        ];

        // Binary prefixes
        // [Name, Prefix power of 2 value, Previx value, Abbreviation, Derived from]
        var binary_prefixes = {
            Yi: ["yobi", 80, 1208925819614629174706176, "Yi", "yotta"],
            Zi: ["zebi", 70, 1180591620717411303424, "Zi", "zetta"],
            Ei: ["exbi", 60, 1152921504606846976, "Ei", "exa"],
            Pi: ["pebi", 50, 1125899906842624, "Pi", "peta"],
            Ti: ["tebi", 40, 1099511627776, "Ti", "tera"],
            Gi: ["gibi", 30, 1073741824, "Gi", "giga"],
            Mi: ["mebi", 20, 1048576, "Mi", "mega"],
            ki: ["kibi", 10, 1024, "ki", "kilo"]
        };

        // Unit prefixes
        // [Name, Multiplier, Abbreviation]
        var unit_prefixes = {
            Y: ["yotta", 1e+24, "Y"],
            Z: ["zetta", 1e+21, "Z"],
            E: ["exa", 1e+18, "E"],
            P: ["peta", 1e+15, "P"],
            T: ["tera", 1e+12, "T"],
            G: ["giga", 1e+09, "G"],
            M: ["mega", 1e+06, "M"],
            k: ["kilo", 1e+03, "k"],
            h: ["hecto", 1e+02, "h"],
            e: ["dekao", 1e+01, "e"],
            d: ["deci", 1e-01, "d"],
            c: ["centi", 1e-02, "c"],
            m: ["milli", 1e-03, "m"],
            u: ["micro", 1e-06, "u"],
            n: ["nano", 1e-09, "n"],
            p: ["pico", 1e-12, "p"],
            f: ["femto", 1e-15, "f"],
            a: ["atto", 1e-18, "a"],
            z: ["zepto", 1e-21, "z"],
            y: ["yocto", 1e-24, "y"]
        };

        // Initialize units and multipliers
        var from = null;
        var to = null;
        var base_from_unit = from_unit;
        var base_to_unit = to_unit;
        var from_multiplier = 1;
        var to_multiplier = 1;
        var alt;

        // Lookup from and to units
        for (var i = 0; i < units.length; i++) {
            alt = (units[i][2] === null) ? [] : units[i][2];
            if (units[i][1] === base_from_unit || alt.indexOf(base_from_unit) >= 0) {
                from = units[i];
            }
            if (units[i][1] === base_to_unit || alt.indexOf(base_to_unit) >= 0) {
                to = units[i];
            }
        }

        // Lookup from prefix
        if (from === null) {
            var from_binary_prefix = binary_prefixes[from_unit.substring(0, 2)];
            var from_unit_prefix = unit_prefixes[from_unit.substring(0, 1)];

            // Handle dekao unit prefix (only unit prefix with two characters)
            if (from_unit.substring(0, 2) === 'da') {
                from_unit_prefix = ["dekao", 1e+01, "da"];
            }

            // Handle binary prefixes first (so that 'Yi' is processed before 'Y')
            if (from_binary_prefix) {
                from_multiplier = from_binary_prefix[2];
                base_from_unit = from_unit.substring(2);
            } else if (from_unit_prefix) {
                from_multiplier = from_unit_prefix[1];
                base_from_unit = from_unit.substring(from_unit_prefix[2].length);
            }

            // Lookup from unit
            for (var j = 0; j < units.length; j++) {
                alt = (units[j][2] === null) ? [] : units[j][2];
                if (units[j][1] === base_from_unit || alt.indexOf(base_from_unit) >= 0) {
                    from = units[j];
                }
            }
        }

        // Lookup to prefix
        if (to === null) {
            var to_binary_prefix = binary_prefixes[to_unit.substring(0, 2)];
            var to_unit_prefix = unit_prefixes[to_unit.substring(0, 1)];

            // Handle dekao unit prefix (only unit prefix with two characters)
            if (to_unit.substring(0, 2) === 'da') {
                to_unit_prefix = ["dekao", 1e+01, "da"];
            }

            // Handle binary prefixes first (so that 'Yi' is processed before 'Y')
            if (to_binary_prefix) {
                to_multiplier = to_binary_prefix[2];
                base_to_unit = to_unit.substring(2);
            } else if (to_unit_prefix) {
                to_multiplier = to_unit_prefix[1];
                base_to_unit = to_unit.substring(to_unit_prefix[2].length);
            }

            // Lookup to unit
            for (var k = 0; k < units.length; k++) {
                alt = (units[k][2] === null) ? [] : units[k][2];
                if (units[k][1] === base_to_unit || alt.indexOf(base_to_unit) >= 0) {
                    to = units[k];
                }
            }
        }

        // Return error if a unit does not exist
        if (from === null || to === null) {
            return '#N/A';
        }

        // Return error if units represent different quantities
        if (from[3] !== to[3]) {
            return '#N/A';
        }

        // Return converted number
        return number * from[6] * from_multiplier / (to[6] * to_multiplier);
    },

    DEC2BIN : function(number, places) {
        // Return error if number is not a number
        if (isNaN(number)) {
            return '#VALUE!';
        }

        // Return error if number is not decimal, is lower than -512, or is greater than 511
        if (!/^-?[0-9]{1,3}$/.test(number) || number < -512 || number > 511) {
            return '#NUM!';
        }

        // Ignore places and return a 10-character binary number if number is negative
        if (number < 0) {
            return '1' + utility.repeat('0', 9 - (512 + number).toString(2).length) + (512 + number).toString(2);
        }

        // Convert decimal number to binary
        var result = parseInt(number, 10).toString(2);

        // Return binary number using the minimum number of characters necessary if places is undefined
        if (typeof places === 'undefined') {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
                return '#VALUE!';
            }

            // Return error if places is negative
            if (places < 0) {
                return '#NUM!';
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
            return (places >= result.length) ? utility.repeat('0', places - result.length) + result : '#NUM!';
        }
    },

    DEC2HEX : function(number, places) {
        // Return error if number is not a number
        if (isNaN(number)) {
            return '#VALUE!';
        }

        // Return error if number is not decimal, is lower than -549755813888, or is greater than 549755813887
        if (!/^-?[0-9]{1,12}$/.test(number) || number < -549755813888 || number > 549755813887) {
            return '#NUM!';
        }

        // Ignore places and return a 10-character hexadecimal number if number is negative
        if (number < 0) {
            return (1099511627776 + number).toString(16);
        }

        // Convert decimal number to hexadecimal
        var result = parseInt(number, 10).toString(16);

        // Return hexadecimal number using the minimum number of characters necessary if places is undefined
        if (typeof places === 'undefined') {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
                return '#VALUE!';
            }

            // Return error if places is negative
            if (places < 0) {
                return '#NUM!';
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
            return (places >= result.length) ? utility.repeat('0', places - result.length) + result : '#NUM!';
        }
    },

    DEC2OCT : function(number, places) {
        // Return error if number is not a number
        if (isNaN(number)) {
            return '#VALUE!';
        }

        // Return error if number is not decimal, is lower than -549755813888, or is greater than 549755813887
        if (!/^-?[0-9]{1,9}$/.test(number) || number < -536870912 || number > 536870911) {
            return '#NUM!';
        }

        // Ignore places and return a 10-character octal number if number is negative
        if (number < 0) {
            return (1073741824 + number).toString(8);
        }

        // Convert decimal number to octal
        var result = parseInt(number, 10).toString(8);

        // Return octal number using the minimum number of characters necessary if places is undefined
        if (typeof places === 'undefined') {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
                return '#VALUE!';
            }

            // Return error if places is negative
            if (places < 0) {
                return '#NUM!';
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
            return (places >= result.length) ? utility.repeat('0', places - result.length) + result : '#NUM!';
        }
    },

    DELTA : function(number1, number2) {
        // Set number2 to zero if undefined
        number2 = (typeof number2 === 'undefined') ? 0 : number2;

        // Return error if either number is not a number
        if (isNaN(number1) || isNaN(number2)) {
            return '#VALUE!';
        }

        // Return delta
        return (number1 === number2) ? 1 : 0;
    },

    ERF : function(lower_bound, upper_bound) {
        // Set number2 to zero if undefined
        upper_bound = (typeof upper_bound === 'undefined') ? 0 : upper_bound;

        // Return error if either number is not a number
        if (isNaN(lower_bound) || isNaN(upper_bound)) {
            return '#VALUE!';
        }

        // Return ERFC using jStat [http://www.jstat.org/]
        return jStat.erf(lower_bound);
    },

    ERFC : function(x) {
        // Return error if x is not a number
        if (isNaN(x)) {
            return '#VALUE!';
        }

        // Return ERFC using jStat [http://www.jstat.org/]
        return jStat.erfc(x);
    },

    ERFCPRECISE : function() {
        return;
    },

    ERFPRECISE : function() {
        return;
    },

    GESTEP : function(number, step) {
        // Set step to zero if undefined
        step = (typeof step === 'undefined') ? 0 : step;

        // Return error if either number is not a number
        if (isNaN(number) || isNaN(step)) {
            return '#VALUE!';
        }

        // Return delta
        return (number >= step) ? 1 : 0;
    },

    HEX2BIN : function(number, places) {

        // Return error if number is not hexadecimal or contains more than ten characters (10 digits)
        if (!/^[0-9A-Fa-f]{1,10}$/.test(number)) {
            return '#NUM!';
        }

        // Check if number is negative
        var negative = (number.length === 10 && number.substring(0, 1).toLowerCase() === 'f') ? true : false;

        // Convert hexadecimal number to decimal
        var decimal = (negative) ? parseInt(number, 16) - 1099511627776 : parseInt(number, 16);

        // Return error if number is lower than -512 or greater than 511
        if (decimal < -512 || decimal > 511) {
            return '#NUM!';
        }

        // Ignore places and return a 10-character binary number if number is negative
        if (negative) {
            return '1' + utility.repeat('0', 9 - (512 + decimal).toString(2).length) + (512 + decimal).toString(2);
        }

        // Convert decimal number to binary
        var result = decimal.toString(2);

        // Return binary number using the minimum number of characters necessary if places is undefined
        if (typeof places === 'undefined') {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
                return '#VALUE!';
            }

            // Return error if places is negative
            if (places < 0) {
                return '#NUM!';
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
            return (places >= result.length) ? utility.repeat('0', places - result.length) + result : '#NUM!';
        }
    },

    HEX2DEC : function(number) {
        // Return error if number is not hexadecimal or contains more than ten characters (10 digits)
        if (!/^[0-9A-Fa-f]{1,10}$/.test(number)) {
            return '#NUM!';
        }

        // Convert hexadecimal number to decimal
        var decimal = parseInt(number, 16);

        // Return decimal number
        return (decimal >= 549755813888) ? decimal - 1099511627776 : decimal;
    },

    HEX2OCT : function(number, places) {
        // Return error if number is not hexadecimal or contains more than ten characters (10 digits)
        if (!/^[0-9A-Fa-f]{1,10}$/.test(number)) {
            return '#NUM!';
        }

        // Convert hexadecimal number to decimal
        var decimal = parseInt(number, 16);

        // Return error if number is positive and greater than 0x1fffffff (536870911)
        if (decimal > 536870911 && decimal < 1098974756864) {
            return '#NUM!';
        }

        // Ignore places and return a 10-character octal number if number is negative
        if (decimal >= 1098974756864) {
            return (decimal - 1098437885952).toString(8);
        }

        // Convert decimal number to octal
        var result = decimal.toString(8);

        // Return octal number using the minimum number of characters necessary if places is undefined
        if (typeof places === 'undefined') {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
                return '#VALUE!';
            }

            // Return error if places is negative
            if (places < 0) {
                return '#NUM!';
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
            return (places >= result.length) ? utility.repeat('0', places - result.length) + result : '#NUM!';
        }
    },

    IMABS : function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return absolute value of complex number
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    },

    IMAGINARY : function(inumber) {
        // Return 0 if inumber is equal to 0
        if (inumber === 0 || inumber === '0') {
            return 0;
        }

        // Handle special cases
        if (['i', 'j'].indexOf(inumber) >= 0) {
            return 1;
        }

        // Normalize imaginary coefficient
        inumber = inumber.replace('+i', '+1i').replace('-i', '-1i').replace('+j', '+1j').replace('-j', '-1j');

        // Lookup sign
        var plus = inumber.indexOf('+');
        var minus = inumber.indexOf('-');
        if (plus === 0) {
            plus = inumber.indexOf('+', 1);
        }

        if (minus === 0) {
            minus = inumber.indexOf('-', 1);
        }

        // Lookup imaginary unit
        var last = inumber.substring(inumber.length - 1, inumber.length);
        var unit = (last === 'i' || last === 'j');

        if (plus >= 0 || minus >= 0) {
            // Return error if imaginary unit is neither i nor j
            if (!unit) {
                return '#NUM!';
            }

            // Return imaginary coefficient of complex number
            if (plus >= 0) {
                return (isNaN(inumber.substring(0, plus)) || isNaN(inumber.substring(plus + 1, inumber.length - 1))) ?
                    '#NUM!' :
                    Number(inumber.substring(plus + 1, inumber.length - 1));
            } else {
                return (isNaN(inumber.substring(0, minus)) || isNaN(inumber.substring(minus + 1, inumber.length - 1))) ?
                    '#NUM!' :
                    -Number(inumber.substring(minus + 1, inumber.length - 1));
            }
        } else {
            if (unit) {
                return (isNaN(inumber.substring(0, inumber.length - 1))) ? '#NUM!' : inumber.substring(0, inumber.length - 1);
            } else {
                return (isNaN(inumber)) ? '#NUM!' : 0;
            }
        }
    },

    IMARGUMENT : function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return error if inumber is equal to zero
        if (x === 0 && y === 0) {
            return '#DIV/0!';
        }

        // Return PI/2 if x is equal to zero and y is positive
        if (x === 0 && y > 0) {
            return Math.PI / 2;
        }

        // Return -PI/2 if x is equal to zero and y is negative
        if (x === 0 && y < 0) {
            return -Math.PI / 2;
        }

        // Return zero if x is negative and y is equal to zero
        if (y === 0 && x > 0) {
            return 0;
        }

        // Return zero if x is negative and y is equal to zero
        if (y === 0 && x < 0) {
            return -Math.PI;
        }

        // Return argument of complex number
        if (x > 0) {
            return Math.atan(y / x);
        } else if (x < 0 && y >= 0) {
            return Math.atan(y / x) + Math.PI;
        } else {
            return Math.atan(y / x) - Math.PI;
        }
    },

    IMCONJUGATE : function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return conjugate of complex number
        return (y !== 0) ? formula.engineering.COMPLEX(x, -y, unit) : inumber;
    },

    IMCOS : function(inumber) {
        // Return error if inumber is a logical value
        if (inumber === true || inumber === false) {
            return '#VALUE!';
        }

        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return cosine of complex number
        return formula.engineering.COMPLEX(Math.cos(x) * (Math.exp(y) + Math.exp(-y)) / 2, -Math.sin(x) * (Math.exp(y) - Math.exp(-y)) / 2, unit);
    },

    IMCOSH : function(inumber) {
        // Return error if inumber is a logical value
        if (inumber === true || inumber === false) {
            return '#VALUE!';
        }

        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return hyperbolic cosine of complex number
        return formula.engineering.COMPLEX(Math.cos(y) * (Math.exp(x) + Math.exp(-x)) / 2, Math.sin(y) * (Math.exp(x) - Math.exp(-x)) / 2, unit);
    },

    IMCOT : function(inumber) {
        // Return error if inumber is a logical value
        if (inumber === true || inumber === false) {
            return '#VALUE!';
        }

        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return cotangent of complex number
        return formula.engineering.IMDIV(formula.engineering.IMCOS(inumber), formula.engineering.IMSIN(inumber));
    },

    IMCSC : function(inumber) {
        // Return error if inumber is a logical value
        if (inumber === true || inumber === false) {
            return '#VALUE!';
        }

        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return cosecant of complex number
        return formula.engineering.IMDIV('1', formula.engineering.IMSIN(inumber));
    },

    IMCSCH : function(inumber) {
        // Return error if inumber is a logical value
        if (inumber === true || inumber === false) {
            return '#VALUE!';
        }

        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return hyperbolic cosecant of complex number
        return formula.engineering.IMDIV('1', formula.engineering.IMSINH(inumber));
    },

    IMDIV : function(inumber1, inumber2) {
        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var a = formula.engineering.IMREAL(inumber1);
        var b = formula.engineering.IMAGINARY(inumber1);
        var c = formula.engineering.IMREAL(inumber2);
        var d = formula.engineering.IMAGINARY(inumber2);

        // Lookup imaginary unit
        var unit1 = inumber1.substring(inumber1.length - 1);
        var unit2 = inumber1.substring(inumber1.length - 1);
        var unit = 'i';
        if (unit1 === 'j') {
            unit = 'j';
        } else if (unit2 === 'j') {
            unit = 'j';
        }

        // Return error if either coefficient is not a number
        if (a === '#NUM!' || b === '#NUM!' || c === '#NUM!' || d === '#NUM!') {
            return '#NUM!';
        }

        // Return error if inumber2 is null
        if (c === 0 && d === 0) {
            return '#NUM!';
        }

        // Return exponential of complex number
        var den = c * c + d * d;
        return formula.engineering.COMPLEX((a * c + b * d) / den, (b * c - a * d) / den, unit);
    },

    IMEXP : function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return exponential of complex number
        var e = Math.exp(x);
        return formula.engineering.COMPLEX(e * Math.cos(y), e * Math.sin(y), unit);
    },

    IMLN : function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return exponential of complex number
        return formula.engineering.COMPLEX(Math.log(Math.sqrt(x * x + y * y)), Math.atan(y / x), unit);
    },

    IMLOG10 : function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return exponential of complex number
        return formula.engineering.COMPLEX(Math.log(Math.sqrt(x * x + y * y)) / Math.log(10), Math.atan(y / x) / Math.log(10), unit);
    },

    IMLOG2 : function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return exponential of complex number
        return formula.engineering.COMPLEX(Math.log(Math.sqrt(x * x + y * y)) / Math.log(2), Math.atan(y / x) / Math.log(2), unit);
    },

    IMPOWER : function(inumber, number) {
        // Return error if number is nonnumeric
        if (isNaN(number)) {
            return '#VALUE!';
        }

        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Calculate power of modulus
        var p = Math.pow(formula.engineering.IMABS(inumber), number);

        // Calculate argument
        var t = formula.engineering.IMARGUMENT(inumber);

        // Return exponential of complex number
        return formula.engineering.COMPLEX(p * Math.cos(number * t), p * Math.sin(number * t), unit);
    },

    IMPRODUCT : function() {
        // Initialize result
        var result = arguments[0];

        // Loop on all numbers
        for (var i = 1; i < arguments.length; i++) {
            // Lookup coefficients of two complex numbers
            var a = formula.engineering.IMREAL(result);
            var b = formula.engineering.IMAGINARY(result);
            var c = formula.engineering.IMREAL(arguments[i]);
            var d = formula.engineering.IMAGINARY(arguments[i]);

            // Return error if either coefficient is not a number
            if (a === '#NUM!' || b === '#NUM!' || c === '#NUM!' || d === '#NUM!') {
                return '#NUM!';
            }

            // Complute product of two complex numbers
            result = formula.engineering.COMPLEX(a * c - b * d, a * d + b * c);
        }

        // Return product of complex numbers
        return result;
    },

    IMREAL : function(inumber) {
        // Return 0 if inumber is equal to 0
        if (inumber === 0 || inumber === '0') {
            return 0;
        }

        // Handle special cases
        if (['i', '+i', '1i', '+1i', '-i', '-1i', 'j', '+j', '1j', '+1j', '-j', '-1j'].indexOf(inumber) >= 0) {
            return 0;
        }

        // Lookup sign
        var plus = inumber.indexOf('+');
        var minus = inumber.indexOf('-');
        if (plus === 0) {
            plus = inumber.indexOf('+', 1);
        }
        if (minus === 0) {
            minus = inumber.indexOf('-', 1);
        }

        // Lookup imaginary unit
        var last = inumber.substring(inumber.length - 1, inumber.length);
        var unit = (last === 'i' || last === 'j');

        if (plus >= 0 || minus >= 0) {
            // Return error if imaginary unit is neither i nor j
            if (!unit) {
                return '#NUM!';
            }

            // Return real coefficient of complex number
            if (plus >= 0) {
                return (isNaN(inumber.substring(0, plus)) || isNaN(inumber.substring(plus + 1, inumber.length - 1))) ?
                    '#NUM!' :
                    Number(inumber.substring(0, plus));
            } else {
                return (isNaN(inumber.substring(0, minus)) || isNaN(inumber.substring(minus + 1, inumber.length - 1))) ?
                    '#NUM!' :
                    Number(inumber.substring(0, minus));
            }
        } else {
            if (unit) {
                return (isNaN(inumber.substring(0, inumber.length - 1))) ? '#NUM!' : 0;
            } else {
                return (isNaN(inumber)) ? '#NUM!' : inumber;
            }
        }
    },

    IMSEC : function(inumber) {
        // Return error if inumber is a logical value
        if (inumber === true || inumber === false) {
            return '#VALUE!';
        }

        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return secant of complex number
        return formula.engineering.IMDIV('1', formula.engineering.IMCOS(inumber));
    },

    IMSECH : function(inumber) {
        // Return error if inumber is a logical value
        if (inumber === true || inumber === false) {
            return '#VALUE!';
        }

        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return hyperbolic secant of complex number
        return formula.engineering.IMDIV('1', formula.engineering.IMCOSH(inumber));
    },

    IMSIN : function(inumber) {
        // Return error if inumber is a logical value
        if (inumber === true || inumber === false) {
            return '#VALUE!';
        }

        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return sine of complex number
        return formula.engineering.COMPLEX(Math.sin(x) * (Math.exp(y) + Math.exp(-y)) / 2, Math.cos(x) * (Math.exp(y) - Math.exp(-y)) / 2, unit);
    },

    IMSINH : function(inumber) {
        // Return error if inumber is a logical value
        if (inumber === true || inumber === false) {
            return '#VALUE!';
        }

        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return hyperbolic sine of complex number
        return formula.engineering.COMPLEX(Math.cos(y) * (Math.exp(x) - Math.exp(-x)) / 2, Math.sin(y) * (Math.exp(x) + Math.exp(-x)) / 2, unit);
    },

    IMSQRT : function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Calculate power of modulus
        var s = Math.sqrt(formula.engineering.IMABS(inumber));

        // Calculate argument
        var t = formula.engineering.IMARGUMENT(inumber);

        // Return exponential of complex number
        return formula.engineering.COMPLEX(s * Math.cos(t / 2), s * Math.sin(t / 2), unit);
    },

    IMSUB : function(inumber1, inumber2) {
        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var a = formula.engineering.IMREAL(inumber1);
        var b = formula.engineering.IMAGINARY(inumber1);
        var c = formula.engineering.IMREAL(inumber2);
        var d = formula.engineering.IMAGINARY(inumber2);

        // Lookup imaginary unit
        var unit1 = inumber1.substring(inumber1.length - 1);
        var unit2 = inumber1.substring(inumber1.length - 1);
        var unit = 'i';
        if (unit1 === 'j') {
            unit = 'j';
        } else if (unit2 === 'j') {
            unit = 'j';
        }

        // Return error if either coefficient is not a number
        if (a === '#NUM!' || b === '#NUM!' || c === '#NUM!' || d === '#NUM!') {
            return '#NUM!';
        }

        // Return _ of two complex numbers
        return formula.engineering.COMPLEX(a - c, b - d, unit);
    },

    IMSUM : function() {
        // Initialize result
        var result = arguments[0];

        // Loop on all numbers
        for (var i = 1; i < arguments.length; i++) {
            // Lookup coefficients of two complex numbers
            var a = formula.engineering.IMREAL(result);
            var b = formula.engineering.IMAGINARY(result);
            var c = formula.engineering.IMREAL(arguments[i]);
            var d = formula.engineering.IMAGINARY(arguments[i]);

            // Return error if either coefficient is not a number
            if (a === '#NUM!' || b === '#NUM!' || c === '#NUM!' || d === '#NUM!') {
                return '#NUM!';
            }

            // Complute product of two complex numbers
            result = formula.engineering.COMPLEX(a + c, b + d);
        }

        // Return sum of complex numbers
        return result;
    },

    IMTAN : function(inumber) {
        // Return error if inumber is a logical value
        if (inumber === true || inumber === false) {
            return '#VALUE!';
        }

        // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
        var x = formula.engineering.IMREAL(inumber);
        var y = formula.engineering.IMAGINARY(inumber);

        // Return error if either coefficient is not a number
        if (x === '#NUM!' || y === '#NUM!') {
            return '#NUM!';
        }

        // Return tangent of complex number
        return formula.engineering.IMDIV(formula.engineering.IMSIN(inumber), formula.engineering.IMCOS(inumber));
    },

    OCT2BIN : function(number, places) {
        // Return error if number is not hexadecimal or contains more than ten characters (10 digits)
        if (!/^[0-7]{1,10}$/.test(number)) {
            return '#NUM!';
        }

        // Check if number is negative
        var negative = (number.length === 10 && number.substring(0, 1) === '7') ? true : false;

        // Convert octal number to decimal
        var decimal = (negative) ? parseInt(number, 8) - 1073741824 : parseInt(number, 8);

        // Return error if number is lower than -512 or greater than 511
        if (decimal < -512 || decimal > 511) {
            return '#NUM!';
        }

        // Ignore places and return a 10-character binary number if number is negative
        if (negative) {
            return '1' + utility.repeat('0', 9 - (512 + decimal).toString(2).length) + (512 + decimal).toString(2);
        }

        // Convert decimal number to binary
        var result = decimal.toString(2);

        // Return binary number using the minimum number of characters necessary if places is undefined
        if (typeof places === 'undefined') {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
                return '#VALUE!';
            }

            // Return error if places is negative
            if (places < 0) {
                return '#NUM!';
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
            return (places >= result.length) ? utility.repeat('0', places - result.length) + result : '#NUM!';
        }
    },

    OCT2DEC : function(number) {
        // Return error if number is not octal or contains more than ten characters (10 digits)
        if (!/^[0-7]{1,10}$/.test(number)) {
            return '#NUM!';
        }

        // Convert octal number to decimal
        var decimal = parseInt(number, 8);

        // Return decimal number
        return (decimal >= 536870912) ? decimal - 1073741824 : decimal;
    },

    OCT2HEX : function(number, places) {
        // Return error if number is not octal or contains more than ten characters (10 digits)
        if (!/^[0-7]{1,10}$/.test(number)) {
            return '#NUM!';
        }

        // Convert octal number to decimal
        var decimal = parseInt(number, 8);

        // Ignore places and return a 10-character octal number if number is negative
        if (decimal >= 536870912) {
            return 'ff' + (decimal + 3221225472).toString(16);
        }

        // Convert decimal number to hexadecimal
        var result = decimal.toString(16);

        // Return hexadecimal number using the minimum number of characters necessary if places is undefined
        if (typeof places === 'undefined') {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
                return '#VALUE!';
            }

            // Return error if places is negative
            if (places < 0) {
                return '#NUM!';
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
            return (places >= result.length) ? utility.repeat('0', places - result.length) + result : '#NUM!';
        }
    }
},
    user_defined : {

}};
var utility = {
    /**
     * translate numeric to alphabet
     * @param  {integer} num    numeric value translated to alphabet
     * @return {string}         alphabet representation of the value
     */
    toChr: function(num) {
        var s = "";
        num = num - 1;
        while (num >= 0) {
            s = String.fromCharCode(num % 26 + 97) + s;
            num = Math.floor(num / 26) - 1;
        }
        return s.toUpperCase();
    },

    /**
     * translate alphabet to numeric, A => 1, B => 2, Z => 26, AA => 27 etc
     * @param  {string} chr     Alphabet [A-Z]
     * @return {integer}        Integer representation of the alphabet
     */
    toNum: function(chr) {
        chr = chr.split('');
        var base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''),
            i, j, result = 0;

        for (i = 0, j = chr.length - 1; i < chr.length; i += 1, j -= 1) {
            result += Math.pow(base.length, j) * (base.indexOf(chr[i]) + 1);
        }
        return result;
    },

    /**
     * translate cellStart:cellStop to array containing all cell in range
     * e.g A1:B3 => [A1, A2, A3, B1, B2, B3]
     * @return {array} array containing all address in range
     */
    cellRange: function(addressStart, addressStop) {
        var alpha = /[A-Z]+/,
            num = /[0-9]+/,
            cellStart = addressStart.toUpperCase(),
            cellStop = addressStop.toUpperCase(),
            alphaAxisStart = this.toNum(cellStart.match(alpha)[0]),
            alphaAxisStop = this.toNum(cellStop.match(alpha)[0]),
            numAxisStart = parseInt(cellStart.match(num)[0], 10),
            numAxisStop = parseInt(cellStop.match(num)[0], 10),
            cellRange = [],
            cellAddress,
            row,
            col;

        if(alphaAxisStart < alphaAxisStop){
            for (col = alphaAxisStart; col <= alphaAxisStop; col++) {
                if(numAxisStart < numAxisStop){
                    for (row = numAxisStart; row <= numAxisStop; row++) {
                        cellAddress = this.toChr(col) + row;
                        cellRange.push(cellAddress);
                    }
                }else{
                    for (row = numAxisStart; row >= numAxisStop; row--) {
                        cellAddress = this.toChr(col) + row;
                        cellRange.push(cellAddress);
                    }
                }
            }
        }else{
            for (col = alphaAxisStart; col >= alphaAxisStop; col--) {
                if(numAxisStart < numAxisStop){
                    for (row = numAxisStart; row <= numAxisStop; row++) {
                        cellAddress = this.toChr(col) + row;
                        cellRange.push(cellAddress);
                    }
                }else{
                    for (row = numAxisStart; row >= numAxisStop; row--) {
                        cellAddress = this.toChr(col) + row;
                        cellRange.push(cellAddress);
                    }
                }
            }
        }

        return cellRange;
    },

    /**
     * taken from Formula.VALIDBIN of stoic's formula.js (http://www.stoic.com/pages/formula)
     * check if number is in valid binary format
     * @param  {string}  number [the binary number]
     * @return {Boolean}        [true if valid, false if invalid]
     */
    isValidBinary: function(number) {
        return (/^[01]{1,10}$/).test(number);
    },

    /**
     * String repeater, taken from underscore string (https://github.com/epeli/underscore.string)
     * @param  {[type]} str [description]
     * @param  {[type]} qty [description]
     * @return {[type]}     [description]
     */
    strRepeat: function(str, qty) {
        if (qty < 1) return '';
        var result = '';
        while (qty > 0) {
            if (qty & 1) result += str;
            qty >>= 1, str += str;
        }
        return result;
    },

    repeat: function(str, qty, separator) {
        if (str == null) {
            return '';
        }

        qty = ~~qty;

        // using faster implementation if separator is not needed;
        if (separator == null) {
            return this.strRepeat(String(str), qty);
        }

        // this one is about 300x slower in Google Chrome
        for (var repeat = []; qty > 0; repeat[--qty] = str) {}
        return repeat.join(separator);
    },

    unique: function(array) {
        return array.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    },

    initial : function(array, n, guard) {
        return Array.prototype.slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
    },

    rest : function(array, n, guard) {
        return Array.prototype.slice.call(array, n == null || guard ? 1 : n);
    },

    /** end of underscore func */

    arrayMerge: function(args) {
        var a, i, result = [];
        for (i = 0; i < args.length; i++) {
            if (typeof(args[i]) == 'object') {
                for (a in args[i]) {
                    if($.trim(args[i][a]) !== ''){
                        result = result.concat(args[i][a]);
                    }
                }
            } else {
                if($.trim(result.concat(args[i])) !== ''){
                    result = result.concat(args[i]);
                }
            }
        }
        return result;
    },

    toArray: function(args) {
        return Array.prototype.slice.call(args, 0);
    },

    /**
     * Converting object into plain array
     * @param  {object} obj Object need to be converted
     * @return {array}      Plain array
     */
    objectToArray: function(obj){
        var ar = [], a;

        for(a in obj){
            ar.push(obj[a]);
        }

        return ar;
    },

    /**
     * remove empty cell from cell range collection
     * @param  {object} cellRange
     * @return {object} trimmed cellRange
     */
    trimEmptyCell : function(cellRange){
        var result = {};

        for(var a in cellRange){
            if($.trim(cellRange[a]) !== ''){
                result[a] = cellRange[a];
            }
        }

        return result;
    },

    cleanFloat: function(number) {
        var power = Math.pow(10, 14);
        return Math.round(number * power) / power;
    },

    countIn: function(range, value) {
        var result = 0;
        for (var i = 0; i < range.length; i++) {
            if (range[i] === value) {
                result++;
            }
        }
        return result;
    },

    /**
     * convert range {A1: val1, A2: val2, B1: val3, B2: val4} into 2 dimensional table array
     * [
     *     [val1, val2],
     *     [val3, val4]
     * ]
     *
     * @param  {object} cellRange [description]
     * @return {array}            [description]
     */
    rangeToTable : function(cellRange){
        var cell, col,
            row = 0,
            alphaPattern = /[A-Z]+/,
            numPattern = /[0-9]+/,
            arrayTable = [],
            resultTable = [];

        for(cell in cellRange){

            col = this.toNum(cell.match(alphaPattern)[0])-1;
            row = parseInt(cell.match(numPattern)[0], 10)-1;

            if(typeof arrayTable[row] == 'undefined'){
                arrayTable[row] = [];
            }

            arrayTable[row][col] = cellRange[cell];
        }

        var resultRow = 0, rowLength = arrayTable.length, colLength;
        for (row = 0; row < rowLength; row++){
            if(typeof(arrayTable[row]) != 'undefined'){
                colLength = arrayTable[row].length;

                if(typeof(resultTable[resultRow]) == 'undefined'){
                    resultTable[resultRow] = [];
                }

                for(col = 0; col < colLength; col++ ){
                    if(typeof(arrayTable[row][col]) != 'undefined'){
                        resultTable[resultRow].push(arrayTable[row][col]);
                    }
                }

                resultRow++;
            }
        }

        return resultTable;
    },

    /**
     * transpose horizontal table to be vertical table, or vice-versa
     * e.g
     *     [[1,2,3,4],
     *      [1,2,3,4]]
     *
     * to be
     *     [[1,1],
     *      [2,2],
     *      [3,3],
     *      [4,4]]
     */
    transposeTable : function(table){
        var row, col, rowLength, colLength, newTable;

        rowLength = table.length;
        newTable  = [];

        for(row = 0; row < rowLength; row++){
            colLength = table[row].length;

            for(col = 0; col < colLength; col++){
                if(typeof(newTable[col]) == 'undefined'){
                    newTable[col] = [];
                }

                newTable[col].push(table[row][col]);
            }
        }

        return newTable;

    }
};
var data = {
    MEMOIZED_FACT : [],

    SQRT2PI : 2.5066282746310002,

    WEEK_STARTS : [
      undefined,
      0,
      1,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      1,
      2,
      3,
      4,
      5,
      6,
      0
    ],

    WEEK_TYPES : [
      [],
      [1, 2, 3, 4, 5, 6, 7],
      [7, 1, 2, 3, 4, 5, 6],
      [6, 0, 1, 2, 3, 4, 5],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [7, 1, 2, 3, 4, 5, 6],
      [6, 7, 1, 2, 3, 4, 5],
      [5, 6, 7, 1, 2, 3, 4],
      [4, 5, 6, 7, 1, 2, 3],
      [3, 4, 5, 6, 7, 1, 2],
      [2, 3, 4, 5, 6, 7, 1],
      [1, 2, 3, 4, 5, 6, 7]
    ],

    WEEKEND_TYPES : [
      [],
      [6, 0],
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      undefined,
      undefined,
      undefined,
      [0],
      [1],
      [2],
      [3],
      [4],
      [5],
      [6]
    ],

    DAY_NAME : [
        'Sunday',
        'Monday',
        'Thuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],

    ERROR : [
        '#DIV/0!',
        '#N/A',
        '#NAME?',
        '#NUM!',
        '#NULL!',
        '#REF!',
        '#VALUE!',
        '#ERROR!',
        '#ERROR_MOMENT_JS_REQUIRED!',
        '#ERROR_JSTAT_JS_REQUIRED!',
        '#ERROR_AJAX_URL_REQUIRED!',
        '#ERROR_SEND_REQUEST!',
        '#UNDEFINED_VARIABLE!'
    ],

    ERRKEY : {
        jStatRequired : '#ERROR_JSTAT_JS_REQUIRED!',
        momentRequired : '#ERROR_MOMENT_JS_REQUIRED!',
        ajaxUrlRequired : '#ERROR_AJAX_URL_REQUIRED!',
        sendRequestError : '#ERROR_SEND_REQUEST!'
    },

    VARIABLE : {},

    SELF_RENDER_FORMULA : [
        'GRAPH'
    ]
}
/**
 * cell hold single element with formula and value information
 * @param  {sheet}      sheet       the sheet object where the cell is belong to
 * @param  {element}    element     dom element represent the cell (optional)
 * @return {void}
 */
function cell(sheet, options){
    this.sheet = sheet;
    this.options = $.extend({}, {
        element: undefined,
        address: '',
        formatter: undefined,
        unformatter: undefined,
        styleFormatter: undefined,
        format: false,
        formula: false,
        value: null
    }, options);

    this.value              = null;
    this.format             = false;
    this.formula            = false;
    this.formatter          = undefined;
    this.unformatter        = undefined;
    this.formattedValue     = null;
    this.computedValue      = null;
    this.floatValue         = null;
    this.affected           = false;
    this.processed          = false;
    this.dependencies       = {};
    this.dependant          = {};
    this.conditionalStyle   = false; //deprecated
    this.styleFormatter     = false;
    this.address            = '';
    this.remoteDependency   = false;
    this.isCheckbox         = false;
    this.hasDynamicDependency = false;

    this.init();
};

cell.fx = cell.prototype;
/**
 * Initialize the cell object, preparing all necessary variables
 * @return {void}
 */
cell.fx.init = function(){
    /** set cell element, is it in dom, or in memory */
    if(typeof(this.options.element) != 'undefined'){
        this.el = $(this.options.element);
    }else{
        this.el = false;
        this.address = typeof(this.options.address) != 'undefined' ? this.options.address : '';
    }

    /** Set cell options based on given options or data attributes */
    var $address        = (this.el && this.el.attr('data-cell'))            ? this.el.attr('data-cell')    : this.options.address,
        $formula        = (this.el && this.el.attr('data-formula'))         ? this.el.attr('data-formula') : this.options.formula,
        $format         = (this.el && this.el.attr('data-format'))          ? this.el.attr('data-format')  : this.options.format,
        $value          = (this.el && this.el.val())                        ? this.el.val()                : this.options.value,
        $formatter      = (this.el && this.el.attr('data-formatter'))       ? window[this.el.attr('data-formatter')]        : this.options.formatter,
        $unformatter    = (this.el && this.el.attr('data-unformatter'))     ? window[this.el.attr('data-unformatter')]      : this.options.unformatter,
        $styleFormatter = (this.el && this.el.attr('data-style-formatter')) ? window[this.el.attr('data-style-formatter')]  : this.options.styleFormatter,
        tagName         = (this.el) ? this.el.prop('tagName').toLowerCase() : '';

    /** assign address if data-cell is not present */
    if(!$address || $.trim($address) == ''){
        $address = 'CALX'+this.sheet.counter;
        if(this.el) {
            this.el.attr('data-cell', $address);
        }
        this.sheet.counter++;
    }else{
        $address = $address.toUpperCase()
    }

    /** set the formula as false if data-formula exists, but empty */
    if(!$formula || $.trim($formula) == ''){
        $formula = false;
    }else{
        $formula = $formula.replace('&quot;', '"')
                           .replace('&#39;', "'")
                           .replace('&#34;', '"')
    }

    if(tagName == 'input' && (this.el.attr('type') == 'checkbox' || this.el.attr('type') == 'radio')){
        var uncheckedVal = this.el.attr('data-unchecked');
            uncheckedVal = (typeof(uncheckedVal) == 'undefined') ? '' : uncheckedVal;

        $value = (this.el.prop('checked')) ? this.el.val() : uncheckedVal;
        this.isCheckbox = true;
    }

    if(this.el && this.formTags.indexOf(tagName) == -1){
        $value = this.el.text();
    }

    /** fallback to default format where data-format is not present or empty */
    if($format === false || typeof($format) === 'undefined'){
        $format = this.sheet.config.defaultFormat;
    }

    this.formula            = $formula;
    this.format             = $format;
    this.address            = $address;
    this.formatter          = $formatter;
    this.unformatter        = $unformatter;
    this.conditionalStyle   = $styleFormatter; //deprecated
    this.styleFormatter     = $styleFormatter;


    //console.log('cell[#'+this.sheet.elementId+'!'+$address+'] : Initializing the cell');
    if($format && typeof(numeral) != 'undefined' && $.trim($value) !== ''){
        var rawValue = numeral().unformat($value);

        if($format.indexOf('%') > -1 && ($value).indexOf('%') == -1){
            rawValue = rawValue/100;
        }
    } else if (this.unformatter) {
        rawValue = this.unformatter($value, $format);
    } else {
        rawValue = ($.isNumeric($value)) ? parseFloat($value) : $value;
    }

    this.setValue(rawValue);

    if($.trim($value) != '' && $.isNumeric($value)){
        this.renderComputedValue();
    }
    //this.attachEvent();
};
/**
 * calculate cells formula and process dependant
 */
cell.fx.calculate  = function(triggerEvent, renderComputedValue){
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : calculating result of ['+this.formula+']');
    triggerEvent = (typeof triggerEvent == 'undefined') ? true : triggerEvent;
    renderComputedValue = (typeof renderComputedValue == 'undefined') ? true : renderComputedValue;

    /* clear list of affected cell */
    this.sheet.clearAffectedCell();

    if(this.sheet.config.autoCalculate && triggerEvent && typeof(this.sheet.config.onBeforeCalculate) == 'function'){
        this.sheet.config.onBeforeCalculate.call(this.sheet);
    }

    calx.isCalculating = true;
    this.evaluateFormula();

    for(var a in this.dependant){
        this.dependant[a].processDependant();
    }

    for(var a in this.sheet.dependant){
        this.sheet.dependant[a].calculate(false, false);
    }

    calx.isCalculating = false;


    if(this.sheet.hasRelatedSheet()){
        for(a in this.sheet.cells){
            //console.log('recalculating cell');
            if(this.sheet.cells[a].hasRemoteDependency()){
                this.sheet.cells[a].evaluateFormula();
                this.sheet.cells[a].processDependant();
                this.sheet.cells[a].renderComputedValue();

                //console.log('recalculating cell #'+this.sheet.el.attr('id')+'!'+a+'='+this.sheet.cells[a].getValue());
            }
        }
    }

    if(this.sheet.config.autoCalculate && triggerEvent && typeof(this.sheet.config.onAfterCalculate) == 'function'){
        this.sheet.config.onAfterCalculate.call(this.sheet);
    }

    if(this.sheet.config.autoCalculate && triggerEvent && typeof(this.sheet.config.onBeforeRender) == 'function'){
        this.sheet.config.onBeforeRender.call(this.sheet);
    }

    if(renderComputedValue){
        this.renderComputedValue();
    }

    if(this.sheet.config.autoCalculate && triggerEvent && typeof(this.sheet.config.onAfterRender) == 'function'){
        this.sheet.config.onAfterRender.call(this.sheet);
    }

    return this;
};
/**
 * build inter-cell dependency and dependant list, used for triggerring calculation that related to other cell
 * @return {void}
 */
cell.fx.buildDependency = function(){
    var patterns = {
            remoteColumnRange   : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+\s*:\s*[A-Za-z]+/g,
            remoteRowRange      : /\#[A-Za-z0-9_]+\s*!\s*[0-9]+\s*:\s*[0-9]+/g,
            remoteCellRange     : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+[0-9]+\s*:\s*[A-Za-z]+[0-9]+/g,
            remoteCell          : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+[0-9]+/g,
            columnRange         : /[A-Za-z]+\s*:\s*[A-Za-z]+/g,
            rowRange            : /[0-9]+\s*:\s*[0-9]+/g,
            cellRange           : /[A-Za-z]+[0-9]+\s*:\s*[A-Za-z]+[0-9]+/g,
            cell                : /[A-Z]+[0-9]+/g
        },
        formula     = this.formula,
        sheetKey    = '#'+this.sheet.el.attr('id'),
        cellAddress = this.address,
        dependencies,
        a, i, j, key,
        formulaPart,
        cellStart,
        cellStop,
        cellPart,
        cellObject,
        cellMatch,
        sheetId,
        sheetIdentifier;

    /** clear up the dependant and dependency reference */
    for(a in this.dependencies){

        /** remove self from dependant registry in dependencies list before removing */
        if(a.indexOf('#') < 0){
            this.dependencies[a].removeDependant(cellAddress);
        }else{
            this.dependencies[a].removeDependant(sheetKey+'!'+cellAddress);
        }

        /** remove cell from dependencies list after removing itself from dependant registry */
        delete this.dependencies[a];
    }


    /** if formula exist, start scanning cell address inside the formula */
    if(formula){
        /** searching for cells in formula */
        for(a in patterns){
            cellMatch   = formula.match(patterns[a]);
            formula     = formula.replace(patterns[a], '');

            if(null !== cellMatch){
                switch(a){
                    /* First round, find the remote cell range and take it from formula */
                    case "remoteCellRange":
                        for(i = 0; i < cellMatch.length; i++){
                            formulaPart = cellMatch[i].split('!');
                            sheetId     = $.trim(formulaPart[0]);
                            cellPart    = formulaPart[1].split(':');
                            cellStart   = $.trim(cellPart[0]);
                            cellStop    = $.trim(cellPart[1]);

                            /** list all cells in range as dependencies */
                            dependencies = this.sheet.getRemoteCellRange(sheetId, cellStart, cellStop);

                            /** get the calx identifier of the remote sheet */
                            sheetIdentifier = $(sheetId).attr('data-calx-identifier');


                            /** if not identified yet, init calx on it and get the identifier */
                            if(typeof(sheetIdentifier) == 'undefined' || typeof(calx.sheetRegistry[sheetIdentifier]) == 'undefined'){
                                $(sheetId).calx();

                                sheetIdentifier = $(sheetId).attr('data-calx-identifier');
                            }

                            /** build dependency relationship to each sheet */
                            if(typeof(sheetIdentifier) !='undefined' && typeof(calx.sheetRegistry[sheetIdentifier]) != 'undefined'){
                                calx.sheetRegistry[sheetIdentifier].registerDependant(this.sheet);
                                this.sheet.registerDependency(calx.sheetRegistry[sheetIdentifier]);
                            }

                            /** build dependency relationship on current cell and it's dependencies */
                            for(j in dependencies){
                                key = sheetId+'!'+j;
                                if(typeof(this.dependencies[key]) == 'undefined' && false !== dependencies[j]){
                                    this.hasRemoteDependency(true);
                                    this.dependencies[key] = dependencies[j];
                                    dependencies[j].registerDependant(sheetKey+'!'+this.getAddress(), this);
                                }
                            }
                        }
                        break;

                    case "remoteCell":
                        for(i = 0; i < cellMatch.length; i++){
                            formulaPart = cellMatch[i].split('!');
                            sheetId     = $.trim(formulaPart[0]);
                            cellPart    = $.trim(formulaPart[1]);

                            dependencies = this.sheet.getRemoteCell(sheetId, cellPart);
                            sheetIdentifier = $(sheetId).attr('data-calx-identifier');

                            if(typeof(sheetIdentifier) == 'undefined' || typeof(calx.sheetRegistry[sheetIdentifier]) == 'undefined'){
                                $(sheetId).calx();
                            }

                            if(typeof(sheetIdentifier) !='undefined' && typeof(calx.sheetRegistry[sheetIdentifier]) != 'undefined'){
                                calx.sheetRegistry[sheetIdentifier].registerDependant(this.sheet);
                                this.sheet.registerDependency(calx.sheetRegistry[sheetIdentifier]);
                            }

                            key = sheetId+'!'+cellPart;
                            if(typeof(this.dependencies[key]) == 'undefined' && false !== dependencies){
                                this.hasRemoteDependency(true);
                                this.dependencies[key] = dependencies;
                                dependencies.registerDependant(sheetKey+'!'+this.getAddress(), this);

                            }
                        }
                        break;

                    case "cellRange":
                        for(i = 0; i < cellMatch.length; i++){
                            cellPart    = cellMatch[i].split(':');
                            cellStart   = $.trim(cellPart[0]);
                            cellStop    = $.trim(cellPart[1]);

                            dependencies = this.sheet.getCellRange(cellStart, cellStop);
                            for(j in dependencies){
                                if(typeof(this.dependencies[j]) == 'undefined' && false !== dependencies[j]){
                                    this.dependencies[j] = dependencies[j];
                                    dependencies[j].registerDependant(this.getAddress(), this);

                                }
                            }
                        }
                        break;

                    case "cell":
                        for(i = 0; i < cellMatch.length; i++){
                            cellPart    = cellMatch[i];

                            dependencies = this.sheet.getCell(cellPart);
                            if(typeof(this.dependencies[cellPart]) == 'undefined' && false !== dependencies){
                                this.dependencies[cellPart] = dependencies;
                                dependencies.registerDependant(this.getAddress(), this);

                            }
                        }
                        break;
                }
            }
        }
    }

    return this;

    //var dlist = [];
    //for(a in this.dependencies){
    //    dlist.push(a);
    //}
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] :  Building dependency list '+dlist);
};
/**
 * remove key from the dependency list
 * @param  {string} key [the dependency key, can be cellAddress, or #sheet>cellAddress]
 * @return {void}
 */
cell.fx.removeDependency = function(key){
    if(typeof(this.dependencies[key]) != 'undefined'){
        delete this.dependencies[key];
    }
};
/**
 * process cell's dependency list and mark it as processed
 * @param  {bool} selfRender  [set render itself or not]
 * @param  {bool} childRender [set render child as well or not]
 * @return {void}
 */
cell.fx.processDependency = function(){
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : processing dependency');

    //selfRender  = (typeof(selfRender) == 'undefined') ? false : selfRender;
    //childRender = (typeof(childRender) == 'undefined') ? false : childRender;

    /**
     * process all affected dependencies first, then evaluate the formula
     * mark each cell as processed by setting the processed flag as true
     */
    if(false == this.isProcessed()){
        //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : processing flag is ['+this.processed+'], processing...')
        for (var a in this.dependencies){
            if(false == this.dependencies[a].isProcessed()){
                this.dependencies[a].processDependency();
            }
        }

        this.evaluateFormula();
        this.setProcessed(true);

        if(this.sheet.affectedCell.indexOf(this.address) == -1){
            this.sheet.affectedCell.push(this.address);
            //console.log(this.sheet.affectedCell);
        }
    } else {
        //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : processing flag is ['+this.processed+'], leaving...')
    }

    //if(selfRender){
    //    this.renderComputedValue();
    //}
};
cell.fx.registerDependant = function(key, cell){
    if(typeof(this.dependant[key]) == 'undefined' && cell){
        this.dependant[key] = cell;
    }
};
cell.fx.removeDependant = function(key){
    if(typeof(this.dependant[key]) != 'undefined'){
        delete this.dependant[key];
    }
};
/**
 * Process all cell that depend on this cell once this cel value is updated
 *
 * @return {[type]} [description]
 */
cell.fx.processDependant = function(){
    var $continue;
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : processing dependants');


    //prefix       = (typeof(prefix) == 'undefined') ? '--' : prefix;
    //selfRender   = (typeof(selfRender) == 'undefined') ? false : selfRender;
    //parentRender = (typeof(parentRender) == 'undefined') ? false : parentRender;

    if(false === this.isProcessed() || true === calx.isCalculating){
        //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : processing flag is ['+this.processed+'], processing...')

        this.processDependency();
        //console.log((new Date()).valueOf());
        //this.evaluateFormula();

        for(var a in this.dependant){
            //prefix = prefix+'--';
            //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : processing dependant ['+a+']');
            if(!this.dependant[a].isProcessed()){
                $continue = this.dependant[a].processDependant();
                if(false === $continue){
                    return $continue;
                }
            }else{
                //console.log(a+' is already processed, leaving...');
            }
        }

        this.setAffected(false);
        this.setProcessed(true);

        if(this.sheet.affectedCell.indexOf(this.address) == -1){
            this.sheet.affectedCell.push(this.address);
            //console.log(this.sheet.affectedCell);
        }
    }else{
        //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : processing flag is ['+this.processed+'], leaving...')
        return false;
    }

};
cell.fx.hasRemoteDependency = function(status){
    if(typeof(status) == 'undefined'){
        return this.remoteDependency
    }else{
        this.remoteDependency = status;
    }
};/**
 * render calculated value or final value to the element bound to this cell
 * @return {void}
 */
cell.fx.renderComputedValue = function(){
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : rendering computed value');

    if(this.formula && this.formula.substring(0,5).toLowerCase() == 'graph'){
        return this;
    } else if (false !== this.el){
        var tagName     = this.el.prop('tagName').toLowerCase(),
            isFormTag   = this.formTags.indexOf(tagName) > -1,
            originalVal = (this.formula) ? this.computedValue : this.value,
            formattedVal= this.getFormattedValue();

        //console.log('render computed value of '+this.address+ ' with formula '+this.formula);
        if(isFormTag){
            if(this.isCheckbox){
                this.el.prop('checked', (originalVal == this.el.val()));
            }else if(tagName == 'select'){
                this.el.val(originalVal);
            }else if(tagName == 'input' || tagName == 'textarea'){
                this.el.val(formattedVal);
            }
        }else{
            this.el.html(formattedVal);
        }
    }

    //console.log(typeof(this.conditionalStyle));

    //deprecated
    if(typeof(this.conditionalStyle) == 'function'){
        var css = this.conditionalStyle.apply(null, [this.getValue(), this.el]);

        if(typeof(css) == 'object'){
            this.el.css(css);
        }
    }

    if(typeof(this.styleFormatter) == 'function'){
        var css = this.styleFormatter.apply(null, [this.getValue(), this.el]);

        if(typeof(css) == 'object'){
            this.el.css(css);
        }
    }

    return this;
}
/**
 * resync cell value with element value, in case the form is reseted
 * @return {[type]} [description]
 */
cell.fx.resyncValue = function(){
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : resyncing value with element value');

    if(false !== this.el){
        var tagName     = this.el.prop('tagName').toLowerCase(),
            isFormTag   = this.formTags.indexOf(tagName) > -1,
            elValue     = (isFormTag) ? this.el.val() : this.el.text();

        if(this.isCheckbox && !this.el.prop('checked')){
            elValue = this.el.attr('data-unchecked-value') || '';
        }

        if(this.format && typeof(numeral) != 'undefined' && $.trim(elValue) !== ''){
            var rawValue = numeral().unformat(elValue);

            if(this.format.indexOf('%') > -1 && (elValue).indexOf('%') == -1){
                rawValue = rawValue/100;
            }
        } else if (this.unformatter) {
            rawValue = this.unformatter(elValue, this.format);
        } else {
            rawValue = ($.isNumeric(elValue)) ? parseFloat(elValue) : elValue;
        }

        this.setValue(rawValue);
    }
};
/**
 * sync formula from the el to the cells object
 */
cell.fx.resyncFormula = function(){
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : resyncing formula with the element formula');

    if(this.el && this.el.attr('data-formula') != this.formula){
        var formula = this.el.attr('data-formula');
        this.setFormula(formula);
    }
}
/**
 * find the circular reference in cell dependency tree
 * @param  {string} address     the cell address that need to be checked
 * @return {bool}               true if circular reference found, false if not found
 */
cell.fx.checkCircularReference = function(address){
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : checking circular reference');
    var a, isCircular = false;

    if(typeof(address) == 'undefined'){
        address = this.getAddress();
    }

    if(false !== this.formula){
        /** first, check if the dependencies is redudant */
        for(a in this.dependencies){
            isCircular = isCircular || (a == address);

            //console.log(prefix+'cell: '+this.getAddress()+', dependencies: '+a+', is circular: '+isCircular);
            if(isCircular){
                return true;
            }
        }

        /** second, check if the dependencies of the dependency is redudant */
        for(a in this.dependencies){
            //console.log(prefix+'cell: '+this.getAddress()+', dependencies of dependency: '+a+', is circular: '+isCircular);

            isCircular = isCircular || this.dependencies[a].checkCircularReference(address);
            if(isCircular){
                return true;
            }
        }
    }

    return isCircular;
};
/**
 * evaluate cell formula and put the result in computed value container
 * @return {mixed}
 */
cell.fx.evaluateFormula = function(){
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : evaluating formula ['+this.formula+']');

    if(this.formula){
        try{
            this.sheet.setActiveCell(this);
            this.computedValue = this.sheet.evaluate(this.formula);
            //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : formula result: '+this.computedValue);
            return this.computedValue;
        }catch(e){
            //console.log(e);
            this.computedValue = '#ERROR!';
            return false;
            //console.error('formula error on '+this.address+' : '+this.formula);
        }
    }

    return false;
};
/** form tag reference */
cell.fx.formTags = ['input', 'select', 'textarea', 'button'];
/**
 * set conditional style callback (deprecated)
 * @param {Function} callback [description]
 */
cell.fx.setConditionalStyle = function(callback){
    if(typeof(callback) == 'function'){
        this.conditionalStyle = callback;
        this.styleFormatter   = callback;
    }
}

cell.fx.setStyleFormatter = cell.fx.setConditionalStyle;
/**
 * set formatting rule to the cell
 * @param {string} format       format rule to define formatting on rendered value
 */
cell.fx.setFormat = function(format){
    this.format = format;
    if(false !== this.el){
        this.el.attr('data-format', format);
        this.renderComputedValue();
    }

    if(this.sheet.affectedCell.indexOf(this.address) == -1){
        this.sheet.affectedCell.push(this.address);
    }

    return this;
};

cell.fx.setFormatter = function(formatter){
    this.formatter = formatter;
}

cell.fx.setUnformatter = function(unformatter){
    this.unformatter = unformatter;
}
/**
 * return format definition of the current cell object
 * @return {string}     format definition or false
 */
cell.fx.getFormat = function(){
    return this.format;
};

cell.fx.getFormatter = function(){
    return this.formatter;
}

cell.fx.getUnformatter = function(){
    return this.unformatter;
}
/**
 * set formula definition to the cell
 * @param {string} formula       formula definition
 */
cell.fx.setFormula = function(formula){
    //console.log('set formula of #'+this.sheet.elementId+'!'+this.address+' to be '+formula);
    if(typeof(formula) !== 'string'){
        return false;
    }

    this.formula = formula;
    if(false !== this.el){
        this.el.attr('data-formula', formula);
    }

    //console.log('building dependency');
    this.buildDependency();

    //console.log('processing dependant');
    //this.processDependant(true, true);

    //this.evaluateFormula();
    //
    //
    if(this.sheet.affectedCell.indexOf(this.address) == -1){
        this.sheet.affectedCell.push(this.address);
    }
    return this;
};
/**
 * get formula of the cell
 * @return {string}     the formula
 */
cell.fx.getFormula = function(){
    return this.formula;
};
/**
 * get current cell address
 * @return {string}     cell address of the current cell object
 */
cell.fx.getAddress = function(){
    return this.address;
};
/**
 * get formatted value of the cell based on the formula definition
 * @return {string}     the formatted value
 */
cell.fx.getFormattedValue = function(){
    var originalVal = (this.formula) ? this.computedValue : this.value;
    var formattedVal;

    if (this.formatter) {
        formattedVal = this.formatter(originalVal, this.format);
    } else {
        formattedVal = (
            this.format != ''
            && typeof(numeral) != 'undefined'
            && originalVal !== ''
            && originalVal !== false
            && originalVal !== null
            && data.ERROR.indexOf(originalVal) == -1
            && $.isNumeric(originalVal)
        )
        ? numeral(originalVal).format(this.format)
        : originalVal;
    }

    return formattedVal;
};
/**
 * set cell value and sync it with the bound element, and trigger recalculation on all cell depend to it
 * @param {mixed}   value       value to be inserted into the cell
 */
cell.fx.setValue = function(value){

    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : setting value to be : '+value);

    this.value = value;

    if(this.sheet.affectedCell.indexOf(this.address) == -1){
        this.sheet.affectedCell.push(this.address);
    }

    /* set value mean set value, no other thing should be done */
    return this;
};
/**
 * Get final raw value of the cell
 * @return {mixed}     the cell value
 */
cell.fx.getValue = function(){
    var returnValue;

    if(this.formula){
        returnValue = this.computedValue;
    }else{
        returnValue = this.value;
    }

    return returnValue;
}
/**
 * mark cell as affected by other cell, used to decide whether to
 * process the cell or not when processing dependency tree
 */
cell.fx.setAffected = function(affected){
    affected = typeof(affected) == 'undefined' ? true : affected;
    this.affected = affected;

    return this;
};
cell.fx.isAffected = function(){
    return this.affected;
};
/**
 * [setProcessed description]
 * @param {[type]} processed [description]
 */
cell.fx.setProcessed = function(processed){
    this.processed = (typeof(processed) == 'undefined') ? true : processed;

    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : mark as processed ['+processed+']');
    return this;
}
/**
 * [isProcessed description]
 * @return {Boolean} [description]
 */
cell.fx.isProcessed = function(){
    return this.processed;
};
/**
 * Highlight cell dependant
 */
cell.fx.highlightDependant = function(){
    for(var a in this.dependant){
        if (this.dependant[a].el) {
            this.dependant[a].el.css('border', 'solid 1px blue');
        }
    }
};

/**
 * Highlight cell dependency
 */
cell.fx.highlightDependency = function(){
    for(var a in this.dependencies){
        if (this.dependencies[a].el) {
            this.dependencies[a].el.css('border', 'solid 1px red');
        }
    }
};
/**
 * Sheet object, represent each element as single sheet
 * @param  {string}     identifier :unique key for accessing sheet object internally
 * @param  {domElement} element    :dom element as scope for sheet to work with
 * @param  {object}     config     : configuration object
 * @return {void}
 */
function sheet(identifier, element, config){
    /** @type {string} The sheet unique identifier */
    this.identifier   = identifier;

    /** @type {object} jQuery dom element */
    this.el           = $(element);

    /** @type {string} The id of the element where the sheet is initialized and bound */
    this.elementId    = this.el.attr('id');

    /** @type {string} Default language setting */
    this.lang         = 'en';

    /** @type {object} Cells registry containing all available cell */
    this.cells        = {};

    /** @type {object} Variable registry, containing all defined variable */
    this.variables    = {};

    /** @type {object} Sheet configuration object */
    this.config       = config;

    /** @type {number} Cell counter, count total cell in the sheet */
    this.counter      = 1;

    /** @type {boolean} Indicate if the sheet has relation with other sheet */
    this.relatedSheet = false;

    /** @type {object} Registry containing sheets that depend on this sheet */
    this.dependant    = {};

    /** @type {object} Registry containing sheets that this sheet depend on*/
    this.dependencies = {};

    /** @type {boolean} Indicate the current sheet calculation is done */
    this.calculated   = false;

    /** @type {boolean} Indicate the current sheet calculation is in progress */
    this.calculating  = false;

    /** @type {object} Current cell object being calculated */
    this.activeCell   = null;
    this.totalCell    = 0;
    this.affectedCell = [];

    this.init();
};

sheet.fx = sheet.prototype;
sheet.fx.init = function(){
    //console.log('sheet[#'+this.elementId+'] : Initializing the sheet');
    var cells = this.el.find('[data-cell],[data-formula],[data-format]'),
        sheet = this,
        $cell
        defaultCellOptions = this.defaultCellOptions;

    this.totalCell = cells.length;
    this.parser = parserFactory(this);
    this.el.attr('data-calx-identifier', this.identifier);

    /** Register cells based on the found element, and configure if config exists */
    cells.each(function(){
        var cellAddress = $(this).attr('data-cell');
        var cellOptions = $.extend({element: this, address: cellAddress}, defaultCellOptions, sheet.config.data[cellAddress]);

        $cell = new cell(sheet, cellOptions);
        sheet.registerCell($cell);
    });

    /** Register cells based on config */
    for (var cellAddress in this.config.data) {
        if (typeof(this.cells[cellAddress]) == 'undefined'){
            var cellOptions = $.extend({address: cellAddress}, defaultCellOptions, sheet.config.data[cellAddress]);

            $cell = new cell(sheet, cellOptions);
            sheet.registerCell($cell);
        }
    }

    //sheet.buildCellDependency();
    sheet.attachEvent();
};
/**
 * check circular reference on each cell registered to this sheet
 * @return {bool} true if exist, false if clear
 */
sheet.fx.checkCircularReference = function(){
    //console.log('sheet[#'+this.elementId+'] : checking circular reference');
    var a, response = {
            isCircular : false,
            cell : null
        };

    for(a in this.cells){
        response.isCircular = this.cells[a].checkCircularReference();
        if(true === response.isCircular){
            response.cell = this.cells[a];
            return response;
        }
    }

    return response;
};
/**
 * mark all cell as not processed
 */
sheet.fx.clearProcessedFlag = function(){
    //console.log('sheet[#'+this.elementId+'] : clearing the processed flag');
    for(var a in this.cells){
        if(false !== this.cells[a].formula){
            this.cells[a].setProcessed(false);
            this.cells[a].setAffected(true);
        }else{
            this.cells[a].setProcessed(true);
            this.cells[a].setAffected(false);
        }
    }
};
/**
 * building inter-cell dependency
 * once the formula is evaluated,
 * make sure all cell involved is evaluated first
 * @return {[type]} [description]
 */
sheet.fx.buildCellDependency = function(){
    //console.log('sheet[#'+this.elementId+'] : building cells dependency');
    var cell;

    for(cell in this.cells){
        this.cells[cell].buildDependency();
    }
};
sheet.fx.renderComputedValue = function(){
    //console.log('sheet[#'+this.elementId+'] : rendering all computed value to the element');

    //console.log(this.el.attr('id'));
    //console.log(this.affectedCell);
    for(var a = 0; a < this.affectedCell.length; a++){
        this.cells[this.affectedCell[a]].renderComputedValue();
    }
    this.clearAffectedCell();
};
sheet.fx.clearAffectedCell = function(){
    this.affectedCell = [];
};
sheet.fx.hasRelatedSheet = function(){
    return this.relatedSheet;
};
sheet.fx.clearCalculatedFlag = function(){
    var a;

    for(a in this.dependant){
        this.dependant[a].setCalculated(false);
    }


    for(a in this.dependencies){
        this.dependencies[a].setCalculated(false);
    }
};
sheet.fx.isCalculated = function(){
    return this.calculated;
};
sheet.fx.setCalculated = function(calculated){
    calculated = (typeof(calculated) == 'undefined') ? true : calculated;
    this.calculated  = calculated;
};
sheet.fx.clearDependencies = function(){

};
sheet.fx.registerDependant = function(dep){
    this.relatedSheet = true;
    if(typeof(this.dependant[dep.identifier]) == 'undefined'){
        this.dependant[dep.identifier] = dep;
    }
};
sheet.fx.registerDependency = function(dep){
    this.relatedSheet = true;
    if(typeof(this.dependencies[dep.identifier]) == 'undefined'){
        this.dependencies[dep.identifier] = dep;
    }
};
sheet.fx.obj = {
    type : 'cell'
};

sheet.fx.defaultCellOptions = {
    element: undefined,
    address: '',
    formatter: undefined,
    unformatter: undefined,
    styleFormatter: undefined,
    format: false,
    formula: false,
    value: null
}
sheet.fx.comparator = {
    greater: function(a, b){
        return a > b;
    },

    greaterEqual: function(a, b){
        return a >= b;
    },

    less: function(a, b){
        return a < b;
    },

    lessEqual : function(a, b){
        return a <= b;
    },

    equal: function(a,b){
        return a == b;
    },

    notEqual: function(a,b){
        return a != b;
    }
};
sheet.fx.getVariable = function(varName){
    var varIndex = varName[0],
        varUpperCase = varIndex.toUpperCase();

    if(varUpperCase == 'TRUE'){
        return true;
    }

    if(varUpperCase == 'FALSE'){
        return false;
    }

    if(varUpperCase == 'NULL'){
        return null;
    }

    if(typeof(this.variables[varIndex]) == 'undefined'){
        if(typeof(data.VARIABLE[varIndex]) == 'undefined'){
            return '#UNDEFINED_VARIABLE!';
        }else if(typeof(data.VARIABLE[varIndex]) == 'function'){
            return data.VARIABLE[varIndex].call(this);
        }else{
            return data.VARIABLE[varIndex];
        }
    }else if(typeof(this.variables[varIndex]) == 'function'){
        return this.variables[varIndex].call(this);
    }else{
        return this.variables[varIndex];
    }
};
sheet.fx.time = function(time){
    var $time   = time.split(':'),
        $today  = new Date(),
        $hour   = typeof($time[0]) == 'undefined' ? 0 : $time[0],
        $minute = typeof($time[1]) == 'undefined' ? 0 : $time[1],
        $second = typeof($time[2]) == 'undefined' ? 0 : $time[2],
        $result = new Date($today.getFullYear(), $today.getMonth(), $today.getDate(), $hour, $minute, $second);

    return $result;
};
sheet.fx.callFunction = function(functionName, params){
    //console.log('<==== calling function '+functionName+' ====>');
    //console.log(params);
    var category, func;

    func = functionName.toUpperCase();
    if(typeof(formula[func]) == 'function'){
        return formula[func].apply(this, params);
    }

    for(category in formula){
        if(typeof(formula[category][func]) == 'function' ){
            return formula[category][func].apply(this, params);
        }
    }

    return '#NAME?'
};
sheet.fx.getRemoteCell = function(sheet, address){
    var identifier = $(sheet).attr('data-calx-identifier');

    if(!identifier || typeof(calx.sheetRegistry[identifier]) == 'undefined'){
        return false;
    }

    return calx.sheetRegistry[identifier].getCell(address);
};
sheet.fx.getRemoteCellRange = function(sheet, addressStart, addressStop){

    var identifier = $(sheet).attr('data-calx-identifier');

    if(!identifier || typeof(calx.sheetRegistry[identifier]) == 'undefined'){
        return false;
    }

    return calx.sheetRegistry[identifier].getCellRange(addressStart, addressStop);
};
sheet.fx.getRemoteCellValue = function(sheet, address){
    var identifier = $(sheet).attr('data-calx-identifier');

    if(!identifier || typeof(calx.sheetRegistry[identifier]) == 'undefined'){
        return false;
    }

    return calx.sheetRegistry[identifier].getCellValue(address);
};
sheet.fx.getRemoteCellRangeValue = function(sheet, addressStart, addressStop){

    var identifier = $(sheet).attr('data-calx-identifier');

    if(!identifier || typeof(calx.sheetRegistry[identifier]) == 'undefined'){
        return false;
    }

    return calx.sheetRegistry[identifier].getCellRangeValue(addressStart, addressStop);
};
sheet.fx.getCellRangeValue = function(addressStart, addressStop){
    addressStart = addressStart.toUpperCase();
    addressStop = addressStop.toUpperCase();

    var cellRangeAddress= utility.cellRange(addressStart, addressStop),
        cellRangeLength = cellRangeAddress.length,
        cellRangeValue  = {},
        i;

    for (i = 0; i < cellRangeLength; i++) {
        cellRangeValue[cellRangeAddress[i]] = this.getCellValue(cellRangeAddress[i]);
    }

    return cellRangeValue;
};
sheet.fx.getCellValue = function(address){
    var cell = address.toUpperCase();
    if(typeof(this.cells[cell]) == 'undefined'){
        return false;
    }
    return this.cells[cell].getValue();
};
/**
 * evaluate given formula
 * @param  {string} formula     the formula need to be evaluated
 * @return {mixed}              result returned by the formula
 */
sheet.fx.evaluate = function(formula){
    //console.log('sheet[#'+this.elementId+'] : evaluating formula => '+formula);

    return this.parser.parse(formula);
};
/**
 * update cell reference inside the sheet, detect removed and added cells
 */
sheet.fx.update = function(){
    //console.log('sheet[#'+this.elementId+'] : updating cells registry with current state of the element');

    var cells = this.el.find('[data-cell],[data-formula],[data-format]'),
        sheet = this,
        $cell;

    this.totalCell = cells.length;

    /** detect and remove detached cells and its reference */
    for(var a in this.cells){
        if(this.cells[a].el && !$.contains(document, this.cells[a].el[0])){
            delete(this.cells[a]);
        }
    }

    /** add new cell reference */
    cells.each(function(){
        var cellAddr = $(this).attr('data-cell');

        if(cellAddr && typeof(sheet.cells[cellAddr]) == 'undefined'){
            //console.log('new cell found '+cellAddr);
            var cellOptions = $.extend({element: this, address: cellAddr}, defaultCellOptions, sheet.config.data[cellAddr]);

            $cell = new cell(sheet, cellOptions);
            sheet.registerCell($cell);
        }else{
            //console.log('resync cell '+cellAddr);
            sheet.cells[cellAddr].resyncValue();
            sheet.cells[cellAddr].resyncFormula();
        }
    });

    /** rebuild the dependency tree */
    this.buildCellDependency();
};
/**
 * calculate all the sheet!
 */
sheet.fx.calculate = function(){
    //console.log('sheet[#'+this.elementId+'] : calculating the sheet');

    this.clearAffectedCell();

    if(typeof(this.config.onBeforeCalculate) == 'function'){
        this.config.onBeforeCalculate.call(this);
    }

    var a;

    this.calculateDependency(this.identifier);
    /** set all cell with formula as affected */
    this.clearProcessedFlag();

    for(a in this.cells){
        this.cells[a].processDependency();
    }

    this.setCalculated();
    //console.log(this.isCalculated());

    /*
    for(a in this.dependant){
        if(!this.dependant[a].isCalculated()){
            this.dependant[a].calculate();
        }
    }
    */

    for(a in this.cells){
        //console.log('recalculating cell');
        if(this.cells[a].hasRemoteDependency()){
            this.cells[a].evaluateFormula();
            //console.log('recalculating cell #'+this.el.attr('id')+'!'+a+'='+this.cells[a].getValue());
        }
    }

    this.calculateDependant(this.identifier);


    if(typeof(this.config.onAfterCalculate) == 'function'){
        this.config.onAfterCalculate.call(this);
    }

    if(typeof(this.config.onBeforeRender) == 'function'){
        this.config.onBeforeRender.call(this);
    }

    this.renderComputedValue();

    if(typeof(this.config.onAfterRender) == 'function'){
        this.config.onAfterRender.call(this);
    }

    return this;
};
sheet.fx.calculateDependant = function(skip){

};
sheet.fx.calculateDependency = function(skip){

};
/**
 * register singgle cell to sheet's cell registry
 * @param  {object} cell    cell object
 * @return {void}
 */
sheet.fx.registerCell = function(cell){
    var address = cell.getAddress()
    this.cells[address] = cell;

    if(this.affectedCell.indexOf(cell.getAddress()) == -1){
        this.affectedCell.push(cell.getAddress());
    }
};
/**
 * register custom variable to the calx object
 * @param  {string} varName     variable name
 * @return {mixed}  varValue    variable value
 */
sheet.fx.registerVariable = function (varName, varValue) {
    if(typeof(varName) == 'object'){
        for(var a in varName){
            this.variables[a] = varName[a];
        }
    }else{
        this.variables[varName] = varValue;
    }
};
/**
 * get cell object based on given address
 * @param  {string} address     cell address (A1, B1 etc)
 * @return {cell|false}         cell object represented by the address or false if not found
 */
sheet.fx.getCell = function(address){

    address = address.toUpperCase();
    if(typeof(this.cells[address]) != 'undefined'){
        return this.cells[address];
    }else{
        return false;
    }
};
/**
 * get list of cell object based on given range
 * @param  {string} addressStart range start
 * @param  {string} addressStop  range stop
 * @return {object}              object containing all cell object in given range
 */
sheet.fx.getCellRange = function(addressStart, addressStop){

    addressStart = addressStart.toUpperCase();
    addressStop = addressStop.toUpperCase();

    var cellList        = utility.cellRange(addressStart, addressStop),
        cellListLength  = cellList.length,
        cellRange       = {},
        a;

    for(a = 0; a < cellListLength; a++){
        cellRange[cellList[a]] = this.getCell(cellList[a]);
    }

    return cellRange;
};
/**
 * Apply calculated and formatted value to elements that represent the cell
 * @return sheet object
 */
sheet.fx.applyChange = function(){
    //console.log('sheet[#'+this.elementId+'] : applying all computed value to the element');
    var a;
    for(a in this.cells){
        this.cells[a].processDependency(false, false);
    }

    for(a in this.cells){
        this.cells[a].renderComputedValue();
    }

    return this;
};
sheet.fx.scan = function(){

};
/**
 * refresh is similar to update, but instead of scanning for added/removed cells,
 * it's remove whole cell registry and rebuild it
 */
sheet.fx.refresh = function(){
    //console.log('sheet[#'+this.elementId+'] : refreshing the sheet cells registry');
    var cells = this.el.find('[data-cell],[data-formula],[data-format]'),
        sheet = this,
        $cell,
        defaultCellOptions = this.defaultCellOptions;

    this.totalCell = cells.length;
    this.cells = {};

    cells.each(function(){
        var cellAddress = $(this).attr('data-cell');
        var cellOptions = $.extend({element: this, address: cellAddress}, defaultCellOptions, sheet.config.data[cellAddress]);

        $cell = new cell(sheet, cellOptions);
        sheet.registerCell($cell);
    });

    /** rebuild the dependency tree */
    this.buildCellDependency();
};
/**
 * reset the form to  it's original value, and resync the value with the cell registry
 */
sheet.fx.reset = function(){
    //console.log('sheet[#'+this.elementId+'] : resetting form elements');

    var forms;

    if(this.el.prop('tagName').toLowerCase() == 'form'){
        forms = this.el;
    }else{
        forms = this.el.find('form');
    }

    forms.each(function(){
        this.reset();
    });

    for(var a in this.cells){
        this.cells[a].resyncValue();
    }

    this.calculate();
};
/**
 * tell the sheet which cell is currently evaluating formula
 * @param {object} cell cell object
 */
sheet.fx.setActiveCell = function(cell){
    this.activeCell = cell;
};
/**
 * get the current active cell
 * @return {object} currently active cell object
 */
sheet.fx.getActiveCell = function(){
    return this.activeCell;
};
sheet.fx.attachEvent = function(){
    //console.log('sheet[#'+this.elementId+'] : attaching events to the element');

    var currentSheet = this;

    /**
     * get the unformatted value of the cell, and display it to the element
     */
    this.el.on('calx.getValue', 'input[data-cell]', function(){
        var cellAddr    = $(this).attr('data-cell'),
            currentCell = currentSheet.cells[cellAddr],
            cellValue   = currentCell.getValue(),
            cellFormat  = currentCell.getFormat();

        if(cellFormat && cellFormat.indexOf('%') >= 0){
            cellValue = cellValue*100+' %';
        }

        if(!currentCell.isCheckbox){
            currentCell.el.val(cellValue);
        }
        //console.log(currentCell.getValue());
    });

    /**
     * get the formatted value of the cell, and display it to the element
     */
    this.el.on('calx.renderComputedValue', 'input[data-cell]', function(){
        var cellAddr    = $(this).attr('data-cell'),
            currentCell = currentSheet.cells[cellAddr];

        currentCell.renderComputedValue();
    });

    /**
     * update value of the current cell internally
     */
    this.el.on('calx.setValue', 'input[data-cell], select[data-cell]', function(){
        var element     = $(this),
            cellAddr    = element.attr('data-cell'),
            currentCell = currentSheet.cells[cellAddr],
            oldVal      = currentCell.getValue(),
            newVal      = currentCell.el.val(),
            cellFormat  = currentCell.getFormat();

        if(currentCell.isCheckbox && currentCell.el.attr('type') == 'checkbox'){
            if(currentCell.el.prop('checked')){
                currentCell.setValue(newVal);
            }else{
                var uncheckedVal = currentCell.el.attr('data-unchecked');
                    uncheckedVal = (typeof(uncheckedVal) == 'undefined') ? '' : uncheckedVal,
                    newVal       = uncheckedVal;

                currentCell.setValue(uncheckedVal);
            }
        }else if(currentCell.isCheckbox && currentCell.el.attr('type') == 'radio'){
            currentCell.setValue(newVal);

            currentSheet.el
                        .find('[name="'+currentCell.el.attr('name')+'"]')
                        .not(currentCell.el)
                        .each(function(){
                            var radioBox     = $(this),
                                uncheckedVal = radioBox.attr('data-unchecked'),
                                cellAddr     = radioBox.attr('data-cell');

                            uncheckedVal = (typeof(uncheckedVal) == 'undefined') ? '' : uncheckedVal;

                            currentSheet.cells[cellAddr].setValue(uncheckedVal);
                        });
        }else{
            if(cellFormat && typeof(numeral) != 'undefined' && $.trim(newVal) !== ''){
                rawValue = numeral().unformat(newVal);

                if(cellFormat.indexOf('%') > -1 && (newVal).indexOf('%') == -1){
                    rawValue = rawValue/100;

                }
            }else{
                rawValue = ($.isNumeric(newVal)) ? parseFloat(newVal) : newVal;
            }

            currentCell.setValue(rawValue);
        }

        if(oldVal != newVal){
            currentCell.setAffected(true);
        }

    });

    /**
     * calculate the whole sheet
     */
    this.el.on('calx.calculateSheet', 'input[data-cell]', function(){
        currentSheet.calculate();
    });

    /**
     * update current cell value, and recalculate it's dependant
     */
    this.el.on('calx.calculateCellDependant', 'input[data-cell], select[data-cell]', function(){
        var cellAddr    = $(this).attr('data-cell'),
            currentCell = currentSheet.cells[cellAddr];

        if(!currentCell.isAffected()){
            return;
        }

        if(true === calx.isCalculating){
            calx.isCalculating = false;
        }
        currentSheet.clearProcessedFlag();
        currentCell.calculate(true, false);

        if(currentSheet.hasRelatedSheet()){
            currentSheet.calculate();
        }else{
            currentSheet.renderComputedValue();
        }

    });

    /**
     * bind to internal event, so no need to unbind the real event on destroy
     */
    this.el.on(currentSheet.config.autoCalculateTrigger, 'input[data-cell]',function(){
        //console.log('blurred');
        var $this = $(this);
        if(!$this.attr('data-formula')){
            if(currentSheet.config.autoCalculate){
                //console.log('calculating dependant');
                setTimeout(function(){
                    $this.trigger('calx.calculateCellDependant');
                }, 50);
            }
        }
    });

    this.el.on('blur', 'input[data-cell]', function(){
        //console.log($(this).attr('data-cell')+'blur');
        $(this).trigger('calx.renderComputedValue');
    });

    /**
     * change behaviour, based on configuration
     * autoCalculate : on   => calx.calculateCellDependant
     * autoCalculate : off  => calx.setValue
     */
    this.el.on('change', 'select[data-cell]', function(){
        $(this).trigger('calx.setValue');

        if(currentSheet.config.autoCalculate){
            $(this).trigger('calx.calculateCellDependant');
        }
    });

    this.el.on('click', 'input[data-cell][type=checkbox], input[data-cell][type=radio]', function(){

        $(this).trigger('calx.setValue');

        if(currentSheet.config.autoCalculate){
            $(this).trigger('calx.calculateCellDependant');
        }
    });

    /** focus does not depend on configuration, always get the value on focus */
    this.el.on('focus', 'input[data-cell]',function(){
        //console.log($(this).attr('data-cell')+'focus');
        $(this).trigger('calx.getValue');
    });

    /** keyup does not depend on configuration, always set value on keyup */
    this.el.on('keyup', 'input[data-cell]',function(e){
        //console.log($(this).attr('data-cell')+'key up');
        if($(this).attr('data-formula')){
            e.preventDefault();
            return false;
        }else{
            $(this).trigger('calx.setValue');
        }
    });
};

sheet.fx.detachEvent = function(){
    //console.log('sheet[#'+this.elementId+'] : detaching events from the element');

    this.el.off('calx.getValue');
    this.el.off('calx.setValue');
    this.el.off('calx.renderComputedValue');
    this.el.off('calx.calculateSheet');
    this.el.off('calx.calculateCellDependant');
}
    /**
     * [calx : the calx core object to work with jquery as plugin]
     * @type {Object}
     */
    var calx = {
        /** flag to indicate that calx is calculating */
        isCalculating : false,

        /** Calx version */
        version : '2.2.8',

        /** sheets collection */
        sheetRegistry : {},

        /**
 * initialize sheet object and register to internal calx.sheetRegistry
 *
 * @param  {object} option      option to override the default option
 * @return {object}             jQuery object
 */
init : function (option) {
    var a, sheetIdentifier, sheetElementId, sheetOption;

    /** initializing sheet object on each elements */
    this.each(function(){
        //console.log('initialize sheet');
        sheetIdentifier = $(this).attr('data-calx-identifier');
        sheetElementId  = $(this).attr('id');

        /** extract option data for individual sheet if it exists */
        sheetOption     = $.extend({}, defaultConfig, option);

        if (typeof(sheetOption.data[sheetElementId]) !== 'undefined') {
            sheetOption.data = sheetOption.data[sheetElementId];
        }

        if(!sheetIdentifier || typeof(calx.sheetRegistry[sheetIdentifier]) == 'undefined'){
            sheetIdentifier = 'CALX'+(new Date()).valueOf();

            calx.sheetRegistry[sheetIdentifier] = new sheet(sheetIdentifier, this, sheetOption);

        }else{
            //console.log('second call should be refresh');
            calx.sheetRegistry[sheetIdentifier].refresh();
        }
    });

    /** building dependency tree between cell and sheet */
    for(sheetIdentifier in calx.sheetRegistry){
        //console.log('build cell dependency');
        calx.sheetRegistry[sheetIdentifier].buildCellDependency();
    }

    /** apply additional action based on configuration */
    for(sheetIdentifier in calx.sheetRegistry){

        /** check circular reference after tree has been built */
        if(calx.sheetRegistry[sheetIdentifier].config.checkCircularReference){
            var reference = calx.sheetRegistry[sheetIdentifier].checkCircularReference();

            if(reference.isCircular){
                var errorMessage = 'Circular reference detected, this may cause calx to stop working.\ncell : '
                                    +reference.cell.getAddress()
                                    +'\nformula : '
                                    +reference.cell.getFormula()
                                    +'\n\nPlease check each cells involved in the formula that has direct or indirect reference to '
                                    +reference.cell.getAddress();

                alert(errorMessage);
                $.error(errorMessage);
            }
        }

        /** calculate and render the result */
        if(calx.sheetRegistry[sheetIdentifier].config.autoCalculate){
            calx.sheetRegistry[sheetIdentifier].calculate();
        }

        calx.sheetRegistry[sheetIdentifier].renderComputedValue();
    }

    return this;
}
,
        /**
 * register custom function to the calx formula sets
 * @param  {string}     funcName        the function name, must be all uppercase
 * @param  {function}   funcDefinition  the function definition to describe how the function should behave
 * @param  {bool}       override        override flag, should it override built in function if the same name exists
 * @return {void}
 */
registerFunction : function (funcName, funcDefinition, override) {
    override = (typeof(override) == 'undefined') ? false : override;

    if(override){
        for(var a in formula){
            if(typeof(formula[a][funcName]) != 'undefined'){
                delete(formula[a][funcName]);
            }
        }
    }
    formula.user_defined[funcName] = funcDefinition;
}
,
        /**
 * register custom variable to the calx object / sheet object
 * @param  {string} varName     variable name
 * @param  {mixed}  varValue    variable value
 * @param  {bool}   global      register variable as global or only in current sheet
 */
registerVariable : function (varName, varValue, global) {
    global = typeof(global) == 'undefined' ? false : global;

    if(this.length === 0){
        global = true;
    }

    if(global){
        if(typeof(varName) == 'object'){
            for(var a in varName){
                data.VARIABLE[a] = varName[a];
            }
        }else{
            data.VARIABLE[varName] = varValue;
        }
    }else{
        this.each(function(){
            var sheetIdentifier = $(this).attr('data-calx-identifier');

            if(sheetIdentifier && typeof(calx.sheetRegistry[sheetIdentifier]) != 'undefined'){
                calx.sheetRegistry[sheetIdentifier].registerVariable(varName, varValue);
                calx.sheetRegistry[sheetIdentifier].calculate();
            }
        });
    }

    return this;
}
,
        /**
 * refresh sheet reference to the current dom state and rebuild
 * the cell registry and dependency tree from the scratch
 *
 * @return {object}             jQuery object
 */
refresh : function () {
    return this.each(function(){
        var sheetIdentifier = $(this).attr('data-calx-identifier');
        //console.log(sheetIdentifier);

        if(sheetIdentifier && typeof(calx.sheetRegistry[sheetIdentifier]) != 'undefined'){
            calx.sheetRegistry[sheetIdentifier].refresh();
        }
    });
}
,
        /**
 * update sheet reference to the current dom state
 */
update : function () {
    return this.each(function(){
        var sheetIdentifier = $(this).attr('data-calx-identifier');
        //console.log(sheetIdentifier);

        if(sheetIdentifier && typeof(calx.sheetRegistry[sheetIdentifier]) != 'undefined'){
            calx.sheetRegistry[sheetIdentifier].update();
        }
    });
}
,
        /**
 * get sheet object bound to the element
 * @return {object}             the sheet object
 */
getSheet : function(){
    var $this       = $(this),
        $identifier = $this.attr('data-calx-identifier');

    return typeof(calx.sheetRegistry[$identifier]) == 'undefined' ? false : calx.sheetRegistry[$identifier];
}
,
        /**
 * get cell object of current sheet related to the selected element,
 * the selector should only select single object, e.g. $('#id')
 *
 * @param  {string} address     the cell's address
 * @return {object}             the cell's object
 */
getCell : function(address){
    var $this       = $(this),
        $identifier = $this.attr('data-calx-identifier'),
        $sheet      = calx.sheetRegistry[$identifier];

    return $sheet.getCell(address);
}
,
        /**
 * Get the utility object in case its needed
 * @return {object}     utility object
 */
getUtility : function(){
    return utility;
}
,
        /**
 * Get the full forula set object in case its needed
 * @return {object}     formula object
 */
getFormula : function(){
    return formula;
}
,
        /**
 * Evaluate formula specific to the selected sheet,
 * the selector should only select single object, e.g. $('#id')
 *
 * @param  {string} formula     the formula to be evaluated
 * @return {mixed}              result of the formula evaluation
 */
evaluate : function(formula){
    var $this       = $(this),
        $identifier = $this.attr('data-calx-identifier'),
        $sheet      = calx.sheetRegistry[$identifier];

    return $sheet.evaluate(formula);
}
,
        /**
 * Destroy calx instance and remove reference from the element
 *
 * @return {object}     jQuery Object
 */
destroy : function(){
    this.each(function(){
        var $sheet          = $(this),
            a,
            sheetIdentifier = $sheet.attr('data-calx-identifier');

        $sheet.removeAttr('data-calx-identifier');

        if(typeof(calx.sheetRegistry[sheetIdentifier]) != 'undefined'){
            calx.sheetRegistry[sheetIdentifier].detachEvent();
            calx.sheetRegistry[sheetIdentifier].clearDependencies();
            delete calx.sheetRegistry[sheetIdentifier];
        }
    });

    return this;
}
,
        /**
 * Reset the form to the initial value and re-sync the value with the sheet object
 */

reset: function(){
    return this.each(function(){
        var sheetIdentifier = $(this).attr('data-calx-identifier');
        //console.log(sheetIdentifier);

        if(sheetIdentifier && typeof(calx.sheetRegistry[sheetIdentifier]) != 'undefined'){
            calx.sheetRegistry[sheetIdentifier].reset();
        }
    });
}
,
        /**
 * calculate sheet object related to the selected element
 *
 * @return {object} jQuery Object
 */
calculate : function(){

    return this.each(function(){
        /** get the sheet identifier attached to the element */
        var sheetIdentifier = $(this).attr('data-calx-identifier');
        //console.log(sheetIdentifier);

        /** retrieve te sheet objectfrom registry, and calculate */
        if(sheetIdentifier && typeof(calx.sheetRegistry[sheetIdentifier]) != 'undefined'){
            calx.sheetRegistry[sheetIdentifier].calculate();
        }
    });
}
,
        /**
 * set value of specific cell on the sheet related to the selected element,
 * the selector should only select single object, e.g. $('#id')
 *
 * @param  {string} address     the cell's address
 * @param  {string} value       the cell's value
 * @return {void}
 */
setValue : function(address, value){
    var $this       = $(this),
        $identifier = $this.attr('data-calx-identifier'),
        $sheet      = calx.sheetRegistry[$identifier],
        $cell       = $sheet.getCell(address);

    $cell.setValue(value).renderComputedValue();

    if($sheet.config.autoCalculate){
        $sheet.calculate();
    }
}

    };
    /**
     * the surrogate of the calx world to the jQuery world
     * @param  string $action  [calx method]
     * @param  object $options [option object]
     * @return jQuery
     */
    $.fn.calx = function($action, $options) {
        if (calx[$action]) {
            return calx[$action].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof($action) == 'object' || typeof($action) == 'undefined') {
            var $calx = calx.init.apply(this, arguments);
            return $calx;
        } else {
            $.error('Method ' + $action + ' does not exist on jQuery.calx');
        }
    };

})(jQuery, numeral, moment, jStat);