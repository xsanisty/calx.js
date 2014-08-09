cell.prototype.processDependency = function(){

    /** process all dependencies first, then evaluate the formula */
    for (var a in this.dependencies){
        this.dependencies[a].processDependency();
    }

    this.evaluateFormula();
};