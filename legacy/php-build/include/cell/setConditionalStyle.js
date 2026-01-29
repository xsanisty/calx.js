/**
 * set conditional style callback (deprecated)
 * @param {Function} callback [description]
 */
cell.fx.setConditionalStyle = function(callback){
    if(typeof(callback) == 'function'){
        this.conditionalStyle = callback;
        this.styleFormatter   = callback;
    }
}

cell.fx.setStyleFormatter = cell.fx.setConditionalStyle;
