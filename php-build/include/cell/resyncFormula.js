/**
 * sync formula from the el to the cells object
 */
cell.prototype.resyncFormula = function(){
    console.log('cell['+this.address+'] : resyncing formula with the element formula');

    if(this.el && this.el.attr('data-formula') != this.formula){
        this.formula = this.el.attr('data-formula');
        this.buildDependency();
    }
}