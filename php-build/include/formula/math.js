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

    SUM : function() {
        var numbers = utility.toArray(arguments);
        var result = 0;
        for (var i = 0; i < numbers.length; i++) {
            if (numbers[i] instanceof Array) {
                for (var j = 0; j < numbers[i].length; j++) {
                    result += ($.isNumeric(numbers[i][j])) ? numbers[i][j] : 0;
                }
            } else {
                result += ($.isNumeric(numbers[i])) ? numbers[i] : 0;
            }
        }
        return result;
    },

    SUMIF : function(range, criteria) {
        var result = 0;
        for (var i = 0; i < range.length; i++) {
            result += (eval(range[i] + criteria)) ? range[i] : 0;
        }
        return result;
    },

    SUMIFS : function() {
        var criteria = (arguments.length - 1) / 2;
        var range = arguments[0];
        var result = 0;
        for (var i = 0; i < range.length; i++) {
            var fit = true;
            for (var j = 0; j < criteria; j++) {
                if (!eval(arguments[2 * j + 1][i] + arguments[2 * j + 2])) {
                    fit = false;
                }
            }
            result += (fit) ? range[i] : 0;
        }
        return result;
    },

    SUMPRODUCT : function() {
        var arrays = arguments.length + 1;
        var result = 0;
        for (var i = 0; i < arguments[0].length; i++) {
            for (var j = 0; j < arguments[0][i].length; j++) {
                var product = 1;
                for (var k = 1; k < arrays; k++) {
                    product *= arguments[k - 1][i][j];
                }
                result += product;
            }
        }
        return result;
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
}