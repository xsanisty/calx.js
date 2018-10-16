/**
 * register singgle cell to sheet's cell registry
 * @param  {object} cell    cell object
 * @return {void}
 */
sheet.fx.registerCell = function(cell){
    var address = cell.getAddress()
    this.cells[address] = cell;

    if(this.affectedCell.indexOf(cell.getAddress()) == -1){
        this.affectedCell.push(cell.getAddress());
    }
};
