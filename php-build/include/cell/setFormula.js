/**
 * set formula definition to the cell
 * @param {string} formula       formula definition
 */
cell.prototype.setFormula = function(formula){
    //console.log('set formula of #'+this.sheet.elementId+'!'+this.address+' to be '+formula);
    if(typeof(formula) !== 'string'){
        return false;
    }

    this.formula = formula;
    if(false !== this.el){
        this.el.attr('data-formula', formula);
    }

    //console.log('building dependency');
    this.buildDependency();

    //console.log('processing dependant');
    //this.processDependant(true, true);

    //this.evaluateFormula();
    //
    return this;
};