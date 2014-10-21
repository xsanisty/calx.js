sheet.fx.registerDependency = function(dep){
    this.relatedSheet = true;
    if(typeof(this.dependencies[dep.identifier]) == 'undefined'){
        this.dependencies[dep.identifier] = dep;
    }
};