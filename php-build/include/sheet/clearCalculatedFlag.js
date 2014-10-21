sheet.fx.clearCalculatedFlag = function(){
    var a;

    for(a in this.dependant){
        this.dependant[a].setCalculated(false);
    }


    for(a in this.dependencies){
        this.dependencies[a].setCalculated(false);
    }
};