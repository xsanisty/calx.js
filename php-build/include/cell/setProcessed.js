/**
 * [setProcessed description]
 * @param {[type]} processed [description]
 */
cell.prototype.setProcessed = function(processed){
    this.processed = (typeof(processed) == 'undefined') ? true : processed;

    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : mark as processed ['+processed+']');
    return this;
}