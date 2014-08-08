cell.prototype.removeDependant = function(key){
    if(typeof(this.dependant[key]) != 'undefined'){
        delete this.dependant[key];
    }
};