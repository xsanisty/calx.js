/**
 * sync formula from the el to the cells object
 */
cell.prototype.resyncFormula = function(){
    if(this.el && this.el.attr('data-formula') != this.formula){
        this.formula = this.el.attr('data-formula');
        this.buildDependency();
    }
}