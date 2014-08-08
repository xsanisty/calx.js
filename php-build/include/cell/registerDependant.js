cell.prototype.registerDependant = function(key, cell){
    if(typeof(this.dependant[key]) == 'undefined' && cell){
        this.dependant[key] = cell;
    }
};