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

        for (col = alphaAxisStart; col <= alphaAxisStop; col++) {
            for (row = numAxisStart; row <= numAxisStop; row++) {
                cellAddress = this.toChr(col) + row;
                cellRange.push(cellAddress);

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

    unique : function(array){
        return array.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    },

    arrayMerge : function(){

    }
};