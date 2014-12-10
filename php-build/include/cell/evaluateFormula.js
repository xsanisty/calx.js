/**
 * evaluate cell formula and put the result in computed value container
 * @return {mixed}
 */
cell.fx.evaluateFormula = function(){
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : evaluating formula ['+this.formula+']');

    if(this.formula){
        try{
            this.sheet.setActiveCell(this);
            this.computedValue = this.sheet.evaluate(this.formula);
            //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : formula result: '+this.computedValue);
            return this.computedValue;
        }catch(e){
            //console.log(e);
            this.computedValue = '#ERROR!';
            return false;
            //console.error('formula error on '+this.address+' : '+this.formula);
        }
    }

    return false;
};