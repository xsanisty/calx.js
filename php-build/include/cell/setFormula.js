cell.prototype.setFormula = function(formula){
    this.formula = formula;
    if(false !== this.el){
        this.el.attr('data-formula', formula);
    }

    this.buildDependency();
};