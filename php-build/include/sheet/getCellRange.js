/**
 * get list of cell object based on given range
 * @param  {string} addressStart range start
 * @param  {string} addressStop  range stop
 * @return {object}              object containing all cell object in given range
 */
sheet.prototype.getCellRange = function(addressStart, addressStop){
    var cellList        = utility.cellRange(addressStart, addressStop),
        cellListLength  = cellList.length,
        cellRange       = {},
        a;

    for(a = 0; a < cellListLength; a++){
        cellRange[cellList[a]] = this.getCell(cellList[a]);
    }

    return cellRange;
};