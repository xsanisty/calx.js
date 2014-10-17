/**
 * Process all cell that depend on this cell once this cel value is updated
 *
 * @return {[type]} [description]
 */
cell.fx.processDependant = function(){
    var $continue;
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : processing dependants');


    //prefix       = (typeof(prefix) == 'undefined') ? '--' : prefix;
    //selfRender   = (typeof(selfRender) == 'undefined') ? false : selfRender;
    //parentRender = (typeof(parentRender) == 'undefined') ? false : parentRender;

    if(false === this.isProcessed() || true === calx.isCalculating){
        //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : processing flag is ['+this.processed+'], processing...')

        this.processDependency();
        this.evaluateFormula();

        for(var a in this.dependant){
            //prefix = prefix+'--';
            //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : processing dependant ['+a+']');
            if(!this.dependant[a].isProcessed()){
                $continue = this.dependant[a].processDependant();
                if(false === $continue){
                    return $continue;
                }
            }else{
                //console.log(a+' is already processed, leaving...');
            }
        }

        this.setAffected(false);
        this.setProcessed(true);
    }else{
        //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : processing flag is ['+this.processed+'], leaving...')
        return false;
    }

};