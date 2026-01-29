/**
 * Reset the form to the initial value and re-sync the value with the sheet object
 */

reset: function(){
    return this.each(function(){
        var sheetIdentifier = $(this).attr('data-calx-identifier');
        //console.log(sheetIdentifier);

        if(sheetIdentifier && typeof(calx.sheetRegistry[sheetIdentifier]) != 'undefined'){
            calx.sheetRegistry[sheetIdentifier].reset();
        }
    });
}
