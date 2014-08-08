cell.prototype.removeDependency = function(key){
    if(typeof(this.dependencies[key]) != 'undefined'){
        delete this.dependencies[key];
    }
};