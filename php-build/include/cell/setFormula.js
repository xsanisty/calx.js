/**
 * set formula definition to the cell
 * @param {string} formula       formula definition
 */
cell.prototype.setFormula = function(formula){
    this.formula = formula;
    if(false !== this.el){
        this.el.attr('data-formula', formula);
    }

    this.buildDependency();
};