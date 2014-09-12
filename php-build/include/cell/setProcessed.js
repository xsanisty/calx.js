/**
 * [setProcessed description]
 * @param {[type]} processed [description]
 */
cell.prototype.setProcessed = function(processed){
    this.processed = (typeof(processed) == 'undefined') ? true : false;
}