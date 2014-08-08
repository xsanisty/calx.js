init : function (option) {
    this.each(function(){
        var sheetIdentifier = 'CALX'+(new Date()).valueOf();

        calx.sheetRegistry[sheetIdentifier] = new sheet(sheetIdentifier, this, option);
    });

    for(var a in calx.sheetRegistry){
        calx.sheetRegistry[a].buildCellDependency();

        var reference = calx.sheetRegistry[a].checkCircularReference();

        if(reference.isCircular){
            var errorMessage = 'Circular reference detected, this may cause calx to stop working.\ncell : '
                                +reference.cell.getAddress()
                                +'\nformula : '
                                +reference.cell.getFormula()
                                +'\n\nPlease check each cells involved in the formula that has direct or indirect reference to '
                                +reference.cell.getAddress();

            alert(errorMessage);
            $.error(errorMessage);
        }
    }

    return this;
}