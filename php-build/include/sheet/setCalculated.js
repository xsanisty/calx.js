sheet.fx.setCalculated = function(calculated){
    calculated = (typeof(calculated) == 'undefined') ? true : calculated;
    this.calculated  = calculated;
};