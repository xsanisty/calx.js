/**
 * process cell's dependency list and mark it as processed
 * @param  {bool} selfRender  [set render itself or not]
 * @param  {bool} childRender [set render child as well or not]
 * @return {void}
 */
cell.prototype.processDependency = function(){
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : processing dependency');

    //selfRender  = (typeof(selfRender) == 'undefined') ? false : selfRender;
    //childRender = (typeof(childRender) == 'undefined') ? false : childRender;

    /**
     * process all affected dependencies first, then evaluate the formula
     * mark each cell as processed by setting the processed flag as true
     */
    if(false == this.isProcessed()){
        //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : processing flag is ['+this.processed+'], processing...')
        for (var a in this.dependencies){
            if(false == this.dependencies[a].isProcessed()){
                this.dependencies[a].processDependency();
            }
        }

        this.evaluateFormula();
        this.setProcessed(true);
    }else{
        //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : processing flag is ['+this.processed+'], leaving...')
    }

    //if(selfRender){
    //    this.renderComputedValue();
    //}
};