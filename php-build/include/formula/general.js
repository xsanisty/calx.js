general: {

    VLOOKUP : function(value, table, colIndex, approx){
        var col, row, rowLength, colLength;

        if(typeof(table == 'object') && table.constructor.name == 'Object'){
            table = utility.rangeToTable(table);
        }

        rowLength = table.length;
        colLength = table[0].length;
        colIndex  = colIndex-1;
        /** default approx to false */
        approx = typeof(approx) == 'undefined' ? false : approx;

        if(colIndex > colLength-1){
            return '#REF!';
        }

        if(colIndex < 0){
            return '#VALUE!';
        }

        if(false == approx){
            for(row = 0; row < rowLength; row++){
                if(value == table[row][0]){
                    return table[row][colIndex];
                }
            }

            return '#N/A!';
        }else{
            var delta = [];

            for(row = 0; row < rowLength; row++){
                delta[row] = Math.abs(table[row][0] - value);
            }

            var deltaMin = Math.min.apply(null, delta);
            var rowIndex = delta.indexOf(deltaMin);

            return table[rowIndex][colIndex];
        }
    },

    HLOOKUP : function(value, table, rowIndex, approx){
        if(typeof(table == 'object')){
            table = utility.rangeToTable(table);
        }

        table = utility.transposeTable(table);

        return formula.general.VLOOKUP(value, table, rowIndex, approx);
    }
}