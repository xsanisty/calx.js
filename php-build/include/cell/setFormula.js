/**
 * set formula definition to the cell
 * @param {string} formula       formula definition
 */
cell.prototype.setFormula = function(formula){
    ////console.log('set formula of '+this.address+' to be '+formula);
    this.formula = formula;
    if(false !== this.el){
        this.el.attr('data-formula', formula);
    }

    ////console.log('building dependency');
    this.buildDependency();

    ////console.log('processing dependant');
    //this.processDependant(true, true);

    //this.evaluateFormula();
};