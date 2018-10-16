/**
 * register custom function to the calx formula sets
 * @param  {string}     funcName        the function name, must be all uppercase
 * @param  {function}   funcDefinition  the function definition to describe how the function should behave
 * @param  {bool}       override        override flag, should it override built in function if the same name exists
 * @return {void}
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
