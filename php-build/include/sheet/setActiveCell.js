/**
 * tell the sheet which cell is currently evaluating formula
 * @param {object} cell cell object
 */
sheet.prototype.setActiveCell = function(cell){
    this.activeCell = cell;
};