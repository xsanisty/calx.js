cell.prototype.processDependency = function(){

    /** process all dependencies first, then evaluate the formula */
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