sheet.fx.getVariable = function(varName){
    var varIndex = varName[0],
        varUpperCase = varIndex.toUpperCase();

    if(varUpperCase == 'TRUE'){
        return true;
    }

    if(varUpperCase == 'FALSE'){
        return false;
    }

    if(varUpperCase == 'NULL'){
        return null;
    }

    if(typeof(this.variables[varIndex]) == 'undefined'){
        if(typeof(data.VARIABLE[varIndex]) == 'undefined'){
            return '#UNDEFINED_VARIABLE!';
        }else if(typeof(data.VARIABLE[varIndex]) == 'function'){
            return data.VARIABLE[varIndex].call(this);
        }else{
            return data.VARIABLE[varIndex];
        }
    }else if(typeof(this.variables[varIndex]) == 'function'){
        return this.variables[varIndex].call(this);
    }else{
        return this.variables[varIndex];
    }
};