/**
 * calculate all the sheet!
 */
sheet.prototype.calculate = function(){
    //console.log('sheet[#'+this.elementId+'] : calculating the sheet');

    var a;
    /** set all cell with formula as affected */
    this.clearProcessedFlag();

    for(a in this.cells){
        this.cells[a].processDependency();
    }
};