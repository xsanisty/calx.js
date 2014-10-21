sheet.fx.getCellValue = function(address){
    var cell = address.toUpperCase();
    if(typeof(this.cells[cell]) == 'undefined'){
        return false;
    }
    return this.cells[cell].getValue();
};