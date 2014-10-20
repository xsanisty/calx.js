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
            var delta = [], deltaMin, rowIndex, deltaLength;

            for(row = 0; row < rowLength; row++){
                if(value == table[row][0]){
                    return table[row][colIndex];
                }
                delta[row] = Math.abs(table[row][0] - value);

                if(isNaN(delta[row])){
                    delta[row] = -1;
                }

            }

            deltaLength = delta.length;
            deltaMin    = null;

            for(var a = 0; a < deltaLength; a++){
                if(delta[a] >= 0){
                    if(deltaMin === null){
                        deltaMin = delta[a];
                    }else{
                        deltaMin = (deltaMin < delta[a]) ? deltaMin : delta[a];
                    }
                }
            }

            rowIndex = delta.indexOf(deltaMin);

            if(rowIndex < 0){
                return '#N/A!';
            }

            return table[rowIndex][colIndex];
        }
    },

    HLOOKUP : function(value, table, rowIndex, approx){
        if(typeof(table == 'object')){
            table = utility.rangeToTable(table);
        }

        table = utility.transposeTable(table);

        return formula.general.VLOOKUP(value, table, rowIndex, approx);
    },

    SERVER : function(){
        if(this.config.ajaxUrl == null){
            return data.ERRKEY.ajaxUrlRequired;
        }

        var result,
            funcName = arguments[0],
            params = {};

        for (var a = 1; a < arguments.length; a++){
            params['params['+a+']'] = arguments[a];
        }

        $.ajax({
            url: this.config.ajaxUrl,
            method: this.config.ajaxMethod,
            data: params,
            async: false,
            success: function(response){
                result = response;
            },
            error: function(response){
                result = data.ERRKEY.sendRequestError;
            }
        });

        return result;
    },

    GRAPH : function(data, legend, label, options){

        var graphOptions = {},
            cellElement = this.getActiveCell().el,
            graphData = utility.rangeToTable(data),
            plotOptions = {},
            legend = (typeof(legend) == 'object') ? utility.arrayMerge([legend]) : false,
            label = (typeof(label) == 'object') ? utility.arrayMerge([label]) : false,
            keyval;

        console.log(legend);
        console.log(label);

        /**
         * parsing option come from formula into javascript object
         */
        for(var a = 0; a < options.length; a++){
            keyval = options[a].split('=');
            graphOptions[keyval[0]] = keyval[1];
        }

        /**
         * parsing table header as x-axis label
         */
        if(graphOptions.column_header == 'true'){
            var header = graphData.shift(),
                rowLength = graphData.length,
                colLength, row, col, data;

            for(row = 0; row < rowLength; row++){

                colLength = graphData[row].length;

                for(col = 0; col < colLength; col++){
                    data = graphData[row][col];
                    graphData[row][col] = [header[col], data];
                }
            }

            plotOptions.xaxis = {
                mode: "categories",
                tickLength: 0
            };
        }

        /**
         * using incremental number as x-axis
         */
        if(graphOptions.column_header == 'false'){

            var rowLength = graphData.length,
                colLength, row, col, data;

            for(row = 0; row < rowLength; row++){

                colLength = graphData[row].length;

                for(col = 0; col < colLength; col++){
                    data = graphData[row][col];
                    graphData[row][col] = [col, data];
                }
            }
        }

        if(graphOptions.type == 'pie' || graphOptions.type == 'doughnut'){
            var pieData = graphData.shift();


        }

        switch(graphOptions.type){
            case 'bar':
                plotOptions.series = {
                    bars: {
                        show: true,
                        barWidth: 0.6,
                        align: "center"
                    }
                };
                break;

            case 'pie':
                plotOptions.series = {
                    pie: {
                        show: true
                    }
                };
                break;

            case 'doughnut':
                plotOptions.series = {
                    pie: {
                        show: true,
                        innerRadius: 0.65
                    }
                };
                break;

            default:
                break;
        }

        $.plot(cellElement, graphData, plotOptions);

        return false;

    }
}