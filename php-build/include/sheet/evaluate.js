/**
 * evaluate given formula
 * @param  {string} formula     the formula need to be evaluated
 * @return {mixed}              result returned by the formula
 */
sheet.prototype.evaluate = function(formula){
    //console.log('sheet[#'+this.elementId+'] : evaluating formula => '+formula);

    return this.parser.parse(formula);
};