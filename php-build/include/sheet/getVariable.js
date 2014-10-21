sheet.fx.getVariable = function(varName){
    var varIndex = varName[0];

    if(typeof(data.VARIABLE[varIndex]) == 'undefined'){
        return '#NAME?';
    }else{
        return data.VARIABLE[varIndex];
    }
};