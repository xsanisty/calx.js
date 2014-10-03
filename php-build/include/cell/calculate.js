/**
 * calculate cells formula and process dependant
 */
cell.prototype.calculate  = function(){
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : calculating result of ['+this.formula+']');

    calx.isCalculating = true;
    if(this.formula){
        this.evaluateFormula();
    }

    for(var a in this.dependant){
        this.dependant[a].processDependant();
    }

    for(var a in this.sheet.dependant){
        this.sheet.dependant[a].calculate();
    }


    for(a in this.sheet.cells){
        //console.log('recalculating cell');
        if(this.sheet.cells[a].hasRemoteDependency()){
            this.sheet.cells[a].evaluateFormula();
            this.sheet.cells[a].processDependant();
            this.sheet.cells[a].renderComputedValue();

            //console.log('recalculating cell #'+this.sheet.el.attr('id')+'!'+a+'='+this.sheet.cells[a].getValue());
        }
    }
    calx.isCalculating = false;
};