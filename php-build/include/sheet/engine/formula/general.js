general: {
    'SUM' : function(){
    	var result = 0, cell;

    	for(cell in arguments){
    		if(typeof(arguments[cell]) == 'object' && arguments[cell].constructor.name !== 'cell'){
                result += this.engine.formula.general.SUM.apply(this, arguments[cell]);
    		}else{
                result += arguments[cell].getFloatValue();
            }
    	}

        return result;
    },

    'VLOOKUP' : function($value, $table, $colIndex){

    },

    'HLOOKUP' : function($value, $table, $rowIndex){

    }
}