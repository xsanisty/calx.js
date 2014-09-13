/**
 * calculate cells formula and process dependant
 */
cell.prototype.calculate  = function(){
    console.log('cell['+this.address+'] : calculating result of ['+this.formula+']');

    if(this.formula){
        this.evaluateFormula();
    }

    for(var a in this.dependant){
        this.dependant[a].processDependant();
    }
};