general: {
    'SUM' : function(){
    	var result = 0, cell;

    	for(cell in arguments){
    		if(typeof(arguments[cell]) == 'object'){
                result += this.engine.formula.general.SUM.apply(this, arguments[cell]);
    		}else{
                result += (arguments[cell] * 1);
            }
    	}

        return result;
    },

    'VLOOKUP' : function($value, $table, $colIndex){

    },

    'HLOOKUP' : function($value, $table, $rowIndex){

    }
}