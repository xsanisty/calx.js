/**
 * Highlight cell dependant
 */
cell.fx.highlightDependant = function(){
    for(var a in this.dependant){
        if (this.dependant[a].el) {
            this.dependant[a].el.css('border', 'solid 1px blue');
        }
    }
};

/**
 * Highlight cell dependency
 */
cell.fx.highlightDependency = function(){
    for(var a in this.dependencies){
        if (this.dependencies[a].el) {
            this.dependencies[a].el.css('border', 'solid 1px red');
        }
    }
};
