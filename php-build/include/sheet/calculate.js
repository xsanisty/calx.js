/**
 * calculate all the sheet!
 */
sheet.fx.calculate = function(){
    //console.log('sheet[#'+this.elementId+'] : calculating the sheet');

    if(typeof(this.config.onBeforeCalculate) == 'function'){
        this.config.onBeforeCalculate.apply(this);
    }

    var a;

    /** set all cell with formula as affected */
    this.clearProcessedFlag();

    for(a in this.cells){
        this.cells[a].processDependency();
    }

    this.setCalculated();
    //console.log(this.isCalculated());

    for(a in this.dependant){
        if(!this.dependant[a].isCalculated()){
            this.dependant[a].calculate();
        }
    }

    for(a in this.cells){
        //console.log('recalculating cell');
        if(this.cells[a].hasRemoteDependency()){
            this.cells[a].evaluateFormula();

            //console.log('recalculating cell #'+this.el.attr('id')+'!'+a+'='+this.cells[a].getValue());
        }
    }

    if(typeof(this.config.onAfterCalculate) == 'function'){
        this.config.onAfterCalculate.apply(this);
    }

    if(typeof(this.config.onBeforeRender) == 'function'){
        this.config.onBeforeRender.apply(this);
    }

    this.renderComputedValue();

    if(typeof(this.config.onAfterRender) == 'function'){
        this.config.onAfterRender.apply(this);
    }
};