/**
 * @return {void}
 */
/**
 * process cell's dependency list and mark it as processed
 * @param  {bool} selfRender  [set render itself or not]
 * @param  {bool} childRender [set render child as well or not]
 * @return {void}
 */
cell.prototype.processDependency = function(selfRender, childRender){
    selfRender  = (typeof(selfRender) == 'undefined') ? false : selfRender;
    childRender = (typeof(childRender) == 'undefined') ? false : childRender;

    /**
     * process all affected dependencies first, then evaluate the formula
     * mark each cell as processed by setting the affected flag as false
     */
    for (var a in this.dependencies){
        if(this.dependencies[a].isAffected()){
            this.dependencies[a].processDependency(childRender, childRender);
        }
        this.dependencies[a].setAffected(false);

    }
    this.evaluateFormula();
    this.setAffected(false);

    if(selfRender){
        this.renderComputedValue();
    }
};