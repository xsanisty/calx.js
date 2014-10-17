/**
 * register singgle cell to sheet's cell registry
 * @param  {object} cell    cell object
 * @return {void}
 */
sheet.fx.registerCell = function(cell){
    this.cells[cell.getAddress()] = cell;
};