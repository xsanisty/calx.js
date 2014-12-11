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