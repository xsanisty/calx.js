/**
 * calculate sheet object related to the selected element
 *
 * @return {object} jQuery Object
 */
calculate : function(){

    return this.each(function(){
        /** get the sheet identifier attached to the element */
        var sheetIdentifier = $(this).attr('data-calx-identifier');
        //console.log(sheetIdentifier);

        /** retrieve te sheet objectfrom registry, and calculate */
        if(sheetIdentifier && typeof(calx.sheetRegistry[sheetIdentifier]) != 'undefined'){
            calx.sheetRegistry[sheetIdentifier].calculate();
        }
    });
}
