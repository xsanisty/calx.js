/**
 * set conditional style callback
 * @param {Function} callback [description]
 */
cell.fx.setConditionalStyle = function(callback){
    if(typeof(callback) == 'function'){
        this.conditionalStyle = callback;
    }
}