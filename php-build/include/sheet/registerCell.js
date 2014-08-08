
sheet.prototype.registerCell = function($cell){
    this.cells[$cell.getAddress()] = $cell;
};