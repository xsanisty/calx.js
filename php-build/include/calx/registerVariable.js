/**
 * register custom variable to the calx object
 * @param  {string} varName     variable name
 * @return {mixed}  varValue    variable value
 */
registerVariable : function (varName, varValue) {
    if(typeof(varName) == 'object'){
        for(var a in varName){
            data.VARIABLE[a] = varName[a];
        }
    }else{
        data.VARIABLE[varName] = varValue;
    }
}