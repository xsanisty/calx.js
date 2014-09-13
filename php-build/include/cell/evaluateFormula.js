/**
 * evaluate cell formula and put the result in computed value container
 * @return {null}
 */
cell.prototype.evaluateFormula = function(){
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : evaluating formula ['+this.formula+']');

    if(this.formula){
        try{
            this.computedValue = this.sheet.evaluate(this.formula);
        }catch(e){
            this.computedValue = '#ERROR!';
            //console.error('formula error on '+this.address+' : '+this.formula);
        }
    }
};