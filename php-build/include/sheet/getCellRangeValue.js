sheet.fx.getCellRangeValue = function(addressStart, addressStop){
    addressStart = addressStart.toUpperCase();
    addressStop = addressStop.toUpperCase();

    var cellRangeAddress= utility.cellRange(addressStart, addressStop),
        cellRangeLength = cellRangeAddress.length,
        cellRangeValue  = {},
        i;

    for (i = 0; i < cellRangeLength; i++) {
        cellRangeValue[cellRangeAddress[i]] = this.getCellValue(cellRangeAddress[i]);
    }

    return cellRangeValue;
};