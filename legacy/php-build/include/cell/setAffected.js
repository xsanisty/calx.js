/**
 * mark cell as affected by other cell, used to decide whether to
 * process the cell or not when processing dependency tree
 */
cell.fx.setAffected = function(affected){
    affected = typeof(affected) == 'undefined' ? true : affected;
    this.affected = affected;

    return this;
};
