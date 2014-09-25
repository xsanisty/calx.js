/**
 * initialize sheet object and register to internal calx.sheetRegistry
 * @param  {object} option      option to override the default option
 * @return {object}             jQuery object for chaining
 */
init : function (option) {
    var a, sheetIdentifier;
    this.each(function(){
        //console.log('initialize sheet');
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

    for(sheetIdentifier in calx.sheetRegistry){
        //console.log('build cell dependency');
        calx.sheetRegistry[sheetIdentifier].buildCellDependency();
    }

    for(sheetIdentifier in calx.sheetRegistry){

        if(calx.sheetRegistry[sheetIdentifier].config.autoCalculate){
            calx.sheetRegistry[sheetIdentifier].calculate();
            calx.sheetRegistry[sheetIdentifier].renderComputedValue();
        }
    }

    return this;
}