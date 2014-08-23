/**
 * mark cell as affected by other cell, used to decide whether to
 * process the cell or not when processing dependency tree
 */
cell.prototype.setAffected = function(affected){
    affected = typeof(affected) == 'undefined' ? true : false;
    this.affected = affected;
};