general: {
    SUM : function(){
    	var result = 0, cell, a, floatVal;

    	for(a = 0; a < arguments.length; a++){
    		if(typeof(arguments[a]) == 'object'){
                for(cell in arguments[a]){
                    floatVal = !isNaN(parseFloat(arguments[a][cell], 10)) ? parseFloat(arguments[a][cell], 10) : 0;
                    result  += floatVal;
                }
    		}else{
                floatVal = !isNaN(parseFloat(arguments[a], 10)) ? parseFloat(arguments[a], 10) : 0;
                result += floatVal;
            }
    	}

        return result;
    },

    VLOOKUP : function($value, $table, $colIndex){

    },

    HLOOKUP : function($value, $table, $rowIndex){

    }
}