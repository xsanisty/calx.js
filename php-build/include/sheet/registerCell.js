/**
 * register singgle cell to sheet's cell registry
 * @param  {object} cell    cell object
 * @return {void}
 */
sheet.prototype.registerCell = function(cell){
    this.cells[cell.getAddress()] = cell;
};