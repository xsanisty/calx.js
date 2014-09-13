/**
 * Process all cell that depend on this cell once this cel value is updated
 *
 * @return {[type]} [description]
 */
cell.prototype.processDependant = function(){
    //console.log('cell['+this.address+'] : processing dependants');


    //prefix       = (typeof(prefix) == 'undefined') ? '--' : prefix;
    //selfRender   = (typeof(selfRender) == 'undefined') ? false : selfRender;
    //parentRender = (typeof(parentRender) == 'undefined') ? false : parentRender;

    ////console.log(selfRender);
    if(false == this.isProcessed()){
        //console.log('cell['+this.address+'] : processing flag is ['+this.processed+'], processing...')

        this.processDependency();
        this.evaluateFormula();

        for(var a in this.dependant){
            //prefix = prefix+'--';
            //console.log('cell['+this.address+'] : processing dependant ['+a+']');
            if(!this.dependant[a].isProcessed()){
                this.dependant[a].processDependant();
            }else{
                //console.log(a+' is already processed, leaving...');
            }
        }

        this.setAffected(false);
        this.setProcessed(true);
    }else{
        //console.log('cell['+this.address+'] : processing flag is ['+this.processed+'], leaving...')
    }

};