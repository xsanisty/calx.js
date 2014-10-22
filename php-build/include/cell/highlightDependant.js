cell.fx.highlightDependant = function(){
    for(var a in this.dependant){
        this.dependant[a].el.css('border', 'solid 1px blue');
    }
};

cell.fx.highlightDependency = function(){
    for(var a in this.dependencies){
        this.dependencies[a].el.css('border', 'solid 1px red');
    }
};

