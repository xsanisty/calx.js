text:{
    CONCAT : function(){
        var result = '', cell;

        for(cell in arguments){
            if(typeof(arguments[cell]) == 'object'){
                result += formula.text.CONCAT.apply(this, arguments[cell]);
            }else{
                result += arguments[cell];
            }
        }

        return result;
    },

    TRIM : function(text){
        return $.trim(text);
    }
}