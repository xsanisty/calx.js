/**
 * Process all cell that depend on this cell once this cel value is updated
 *
 * @return {[type]} [description]
 */
cell.prototype.processDependant = function(){
    this.evaluateFormula();

    if(this.sheet.config.autoCalculate){
        this.renderComputedValue();
    }

    for(var a in this.dependant){
        this.dependant[a].processDependant();
    }
};