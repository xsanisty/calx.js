/**
 * Apply calculated and formatted value to elements that represent cell
 * @return void
 */
sheet.prototype.applyChange = function(){
    var a;
    for(a in this.cells){
        this.cells[a].processDependency(false, false);
    }

    for(a in this.cells){
        this.cells[a].renderComputedValue();
    }
};