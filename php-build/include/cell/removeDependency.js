/**
 * remove key from the dependency list
 * @param  {string} key [the dependency key, can be cellAddress, or #sheet>cellAddress]
 * @return {void}
 */
cell.prototype.removeDependency = function(key){
    if(typeof(this.dependencies[key]) != 'undefined'){
        delete this.dependencies[key];
    }
};