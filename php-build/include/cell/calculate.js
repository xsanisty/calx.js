/**
 * calculate cells formula and process dependant
 */
cell.fx.calculate  = function(triggerEvent, renderComputedValue){
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : calculating result of ['+this.formula+']');
    triggerEvent = (typeof triggerEvent == 'undefined') ? true : triggerEvent;
    renderComputedValue = (typeof renderComputedValue == 'undefined') ? true : renderComputedValue;

    /* clear list of affected cell */
    this.sheet.clearAffectedCell();

    if(this.sheet.config.autoCalculate && triggerEvent && typeof(this.sheet.config.onBeforeCalculate) == 'function'){
        this.sheet.config.onBeforeCalculate.call(this.sheet);
    }

    calx.isCalculating = true;
    this.evaluateFormula();

    for(var a in this.dependant){
        this.dependant[a].processDependant();
    }

    for(var a in this.sheet.dependant){
        this.sheet.dependant[a].calculate(false, false);
    }

    calx.isCalculating = false;


    if(this.sheet.hasRelatedSheet()){
        for(a in this.sheet.cells){
            //console.log('recalculating cell');
            if(this.sheet.cells[a].hasRemoteDependency()){
                this.sheet.cells[a].evaluateFormula();
                this.sheet.cells[a].processDependant();
                this.sheet.cells[a].renderComputedValue();

                //console.log('recalculating cell #'+this.sheet.el.attr('id')+'!'+a+'='+this.sheet.cells[a].getValue());
            }
        }
    }

    if(this.sheet.config.autoCalculate && triggerEvent && typeof(this.sheet.config.onAfterCalculate) == 'function'){
        this.sheet.config.onAfterCalculate.call(this.sheet);
    }

    if(this.sheet.config.autoCalculate && triggerEvent && typeof(this.sheet.config.onBeforeRender) == 'function'){
        this.sheet.config.onBeforeRender.call(this.sheet);
    }

    if(renderComputedValue){
        this.renderComputedValue();
    }

    if(this.sheet.config.autoCalculate && triggerEvent && typeof(this.sheet.config.onAfterRender) == 'function'){
        this.sheet.config.onAfterRender.call(this.sheet);
    }

    return this;
};