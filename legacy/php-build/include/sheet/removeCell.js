/**
 * remove cell address from the current sheet
 * @param  {atring} address     cell address
 * @return {void}
 */
sheet.fx.removeCell = function(address){
    delete this.cells[address];
};
