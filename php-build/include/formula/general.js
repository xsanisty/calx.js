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

        params.function = funcName;

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

    GRAPH : function(data, options){

        var graphOptions= {},
            cellElement = this.getActiveCell().el,
            plotOptions = {},
            options     = (typeof(options) == 'undefined') ? [] : options,
            keyval, graphData;

        /**
         * parsing option come from formula into javascript object
         */
        for(var a = 0; a < options.length; a++){
            keyval = options[a].split('=');
            graphOptions[keyval[0]] = keyval[1];
        }

        /**
         * setup default height and width
         */
        if(!cellElement.height()){
            cellElement.css('height', '300px');
        }

        if(!cellElement.width){
            cellElement.css('width', '300px');
        }

        switch(graphOptions.type){
            case 'bar':
                graphData   = utility.rangeToTable(data);
                plotOptions.series = {
                    bars: {
                        show: true,
                        barWidth: 0.6,
                        align: "center"
                    },
                    stack: true
                };
                break;

            case 'pie':
                graphData   = utility.objectToArray(data);
                plotOptions.series = {
                    pie: {
                        show: true,
                        radius: 0.8
                    }
                };
                plotOptions.legend = {
                    show:false
                }
                break;

            case 'doughnut':
            case 'donut':
                graphData   = utility.objectToArray(data);
                plotOptions.series = {
                    pie: {
                        show: true,
                        innerRadius: 0.5,
                        radius: 0.8
                    }
                };
                plotOptions.legend = {
                    show:false
                }
                break;

            default:
                graphData   = utility.rangeToTable(data);
                break;
        }

        /**
         * change the table orientation if configured
         * @type {[type]}
         */
        if(typeof(graphOptions.orientation) != 'undefined' && graphOptions.orientation == 'vertical'){
            graphData = utility.transposeTable(graphData);
        }

        /**
         * parsing label as x-axis label
         */
        if(typeof(graphOptions.label) != 'undefined'){
            var label = this.evaluate(graphOptions.label),
                label = utility.objectToArray(label),
                rowLength = graphData.length,
                colLength, row, col, data;

            for(row = 0; row < rowLength; row++){

                colLength = graphData[row].length;

                for(col = 0; col < colLength; col++){
                    data = graphData[row][col];
                    graphData[row][col] = [label[col], data];
                }
            }

            plotOptions.xaxis = {
                mode: "categories",
                tickLength: 0
            };
        }else{

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

        /**
         * parsing legend and merge with the graph data
         */
        if(typeof(graphOptions.legend) != 'undefined'){
            var legend = this.evaluate(graphOptions.legend),
                legend = utility.objectToArray(legend),
                newGraphData = [];

            for(var graphLength = 0; graphLength < graphData.length; graphLength++){
                newGraphData.push({
                    label : legend[graphLength],
                    data  : graphData[graphLength]
                });
            }

            graphData = newGraphData;
        }

        plotOptions.grid = {
            backgroundColor: { colors: [ "#fff", "#eee" ] },
            borderWidth: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        };

        $.plot(cellElement, graphData, plotOptions);

        return false;

    }
}