/**
 * remove key from the dependency list
 * @param  {string} key [the dependency key, can be cellAddress, or #sheet>cellAddress]
 * @return {void}
 */
cell.fx.removeDependency = function(key){
    if(typeof(this.dependencies[key]) != 'undefined'){
        delete this.dependencies[key];
    }
};
