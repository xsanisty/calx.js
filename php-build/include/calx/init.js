/**
 * initialize sheet object and register to internal calx.sheetRegistry
 * @param  {object} option      option to override the default option
 * @return {object}             jQuery object for chaining
 */
init : function (option) {
    var sheetIdentifier;
    this.each(function(){
        console.log('initialize sheet');
        sheetIdentifier = $(this).attr('data-calx-identifier');

        if(!sheetIdentifier || typeof(calx.sheetRegistry[sheetIdentifier]) == 'undefined'){
            sheetIdentifier = 'CALX'+(new Date()).valueOf();

            calx.sheetRegistry[sheetIdentifier] = new sheet(sheetIdentifier, this, option);

            if(calx.sheetRegistry[sheetIdentifier].config.checkCircularReference){
                /** check circular reference after tree has been built */
                var reference = calx.sheetRegistry[sheetIdentifier].checkCircularReference();

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

        }else{
            //console.log('second call should be refresh');
            //calx.sheetRegistry[sheetIdentifier].refresh();
        }
    });

    this.each(function(){
        console.log('build cell dependency');
        sheetIdentifier = $(this).attr('data-calx-identifier');
        var sheet = calx.sheetRegistry[sheetIdentifier];
        sheet.buildCellDependency();
    });

    this.each(function(){
        console.log('calculate sheet');
        sheetIdentifier = $(this).attr('data-calx-identifier');
        var sheet = calx.sheetRegistry[sheetIdentifier];

        if(sheet.config.autoCalculate){
            sheet.calculate();
            sheet.renderComputedValue();
        }
    });

    return this;
}