sheet.fx.registerDependant = function(dep){
    this.relatedSheet = true;
    if(typeof(this.dependant[dep.identifier]) == 'undefined'){
        this.dependant[dep.identifier] = dep;
    }
};
