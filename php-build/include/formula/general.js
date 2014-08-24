general: {
    SUM : function(){
    	var cell, a, floatVal, stringVal = '', result = 0;

    	for(a = 0; a < arguments.length; a++){
    		if(typeof(arguments[a]) == 'object'){
                for(cell in arguments[a]){
                    stringVal   += arguments[a][cell];
                    floatVal    = !isNaN(parseFloat(arguments[a][cell], 10)) ? parseFloat(arguments[a][cell], 10) : 0;
                    result      += floatVal;
                }
    		}else{
                stringVal   += arguments[a][cell];
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

    VLOOKUP : function($value, $table, $colIndex){

    },

    HLOOKUP : function($value, $table, $rowIndex){

    }
}