/**
 * register custom function to the calx object
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
registerFunction : function (funcName, funcDefinition, override) {
    override = (typeof(override) == 'undefined') ? false : override;

    if(override){
        for(var a in formula){
            if(typeof(formula[a][funcName]) != 'undefined'){
                delete(formula[a][funcName]);
            }
        }
    }
    formula.user_defined[funcName] = funcDefinition;
}