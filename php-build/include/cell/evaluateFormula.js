/**
 * evaluate cell formula and put the result in computed value container
 * @return {null}
 */
cell.prototype.evaluateFormula = function(){
    if(this.formula){
        this.computedValue = this.sheet.evaluate(this.formula);
    }
};