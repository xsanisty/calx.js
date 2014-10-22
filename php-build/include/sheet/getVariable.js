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

    if(typeof(data.VARIABLE[varIndex]) == 'undefined'){
        return '#UNDEFINED_VARIABLE!';
    }else{
        return data.VARIABLE[varIndex];
    }
};