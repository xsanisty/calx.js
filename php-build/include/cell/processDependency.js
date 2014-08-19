/**
 * process cell's dependency list and mark it as processed
 * @return {void}
 */
cell.prototype.processDependency = function(){

    /**
     * process all affected dependencies first, then evaluate the formula
     * mark each cell as processed by setting the affected flag as false
     */
    for (var a in this.dependencies){
        if(this.dependencies[a].isAffected()){
            this.dependencies[a].processDependency();
        }
        this.dependencies[a].setAffected(false);

    }
    this.evaluateFormula();
    this.setAffected(false);

    if(this.sheet.config.autoCalculate){
        this.renderComputedValue();
    }
};