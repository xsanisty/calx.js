sheet.fx.getRemoteCellRange = function(sheet, addressStart, addressStop){

    var identifier = $(sheet).attr('data-calx-identifier');

    if(!identifier || typeof(calx.sheetRegistry[identifier]) == 'undefined'){
        return false;
    }

    return calx.sheetRegistry[identifier].getCellRange(addressStart, addressStop);
};
