/**
 * processing each cell's dependency list
 * @return {void}
 */
sheet.prototype.processDependencyTree = function(){
    var a;

    /** mark all cell as affected, so it will be processed */
    for(a in this.cells){
        this.cells[a].setAffected(true);
    }

    /** start processing the dependency tree */
    for(a in this.cells){
        this.cells[a].processDependency();
    }
};