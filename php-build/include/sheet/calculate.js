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

    this.setCalculated();
    //console.log(this.isCalculated());

    for(a in this.dependant){
        if(!this.dependant[a].isCalculated()){
            this.dependant[a].calculate();
        }
    }

    for(a in this.cells){
        //console.log('recalculating cell');
        if(this.cells[a].hasRemoteDependency()){
            this.cells[a].evaluateFormula();
            this.cells[a].renderComputedValue();

            //console.log('recalculating cell #'+this.el.attr('id')+'!'+a+'='+this.cells[a].getValue());
        }
    }

    this.renderComputedValue();
};