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
}