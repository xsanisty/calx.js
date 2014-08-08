/**
 * evaluate given formula
 * @param  {string} formula     the formula need to be evaluated
 * @return {mixed}              result returned by the formula
 */
sheet.prototype.evaluate = function(formula){
    return this.parser.parse(formula);
};