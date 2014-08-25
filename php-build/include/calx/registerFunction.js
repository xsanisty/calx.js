/**
 * register custom function to the calx object
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
registerFunction : function (funcName, funcDefinition) {
    formula.user_defined[funcName] = funcDefinition;
}