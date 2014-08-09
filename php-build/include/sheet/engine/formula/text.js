text:{
    CONCAT : function(){
        var result = '', cell;

        for(cell in arguments){
            if(typeof(arguments[cell]) == 'object'){
                result += this.engine.formula.text.CONCAT.apply(this, arguments[cell]);
            }else{
                result += arguments[cell];
            }
        }

        return result;
    }
}