sheet.fx.callFunction = function(functionName, params){
    var category, func;

    func = functionName.toUpperCase();
    if(typeof(formula[func]) == 'function'){
        return formula[func].apply(this, params);
    }

    for(category in formula){
        if(typeof(formula[category][func]) == 'function' ){
            return formula[category][func].apply(this, params);
        }
    }

    return '#NAME?'
};