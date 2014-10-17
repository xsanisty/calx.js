/**
 * calculate cells formula and process dependant
 */
cell.prototype.calculate  = function(triggerEvent){
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : calculating result of ['+this.formula+']');
    triggerEvent = (typeof triggerEvent == 'undefined') ? true : triggerEvent;

    if(this.sheet.config.autoCalculate && triggerEvent && typeof(this.sheet.config.onBeforeCalculate) == 'function'){
        this.sheet.config.onBeforeCalculate.apply(this.sheet);
    }

    calx.isCalculating = true;
    if(this.formula){
        this.evaluateFormula();
    }

    for(var a in this.dependant){
        this.dependant[a].processDependant();
    }

    for(var a in this.sheet.dependant){
        this.sheet.dependant[a].calculate(false);
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

    if(this.sheet.config.autoCalculate && triggerEvent && typeof(this.sheet.config.onAfterCalculate) == 'function'){
        this.sheet.config.onAfterCalculate.apply(this.sheet);
    }

    if(this.sheet.config.autoCalculate && triggerEvent && typeof(this.sheet.config.onBeforeRender) == 'function'){
        this.sheet.config.onBeforeRender.apply(this.sheet);
    }

    this.renderComputedValue();

    if(this.sheet.config.autoCalculate && triggerEvent && typeof(this.sheet.config.onAfterRender) == 'function'){
        this.sheet.config.onAfterRender.apply(this.sheet);
    }

    return this;
};