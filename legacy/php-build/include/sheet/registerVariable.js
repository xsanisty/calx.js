/**
 * register custom variable to the calx object
 * @param  {string} varName     variable name
 * @return {mixed}  varValue    variable value
 */
sheet.fx.registerVariable = function (varName, varValue) {
    if(typeof(varName) == 'object'){
        for(var a in varName){
            this.variables[a] = varName[a];
        }
    }else{
        this.variables[varName] = varValue;
    }
};
