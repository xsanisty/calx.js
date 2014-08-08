/**
 * building inter-cell dependency
 * once the formula is evaluated,
 * make sure all cell involved is evaluated first
 * @return {[type]} [description]
 */
sheet.prototype.buildCellDependency = function(){
    var cell;

    for(cell in this.cells){
        this.cells[cell].buildDependency();
    }
};