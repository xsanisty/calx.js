/**
 * Process all cell that depend on this cell once this cel value is updated
 *
 * @return {[type]} [description]
 */
cell.prototype.processDependant = function(selfRender, parentRender){

    selfRender   = (typeof(selfRender) == 'undefined') ? false : selfRender;
    parentRender = (typeof(parentRender) == 'undefined') ? false : parentRender;

    //console.log(selfRender);
    this.evaluateFormula();

    if(selfRender){
        console.log('render computed val of '+this.address);
        this.renderComputedValue();
    }

    for(var a in this.dependant){
        this.dependant[a].processDependant(parentRender, parentRender);
    }
};