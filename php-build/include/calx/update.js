/**
 * update sheet reference to the current dom state
 */
update : function () {
    return this.each(function(){
        var sheetIdentifier = $(this).attr('data-calx-identifier');
        //console.log(sheetIdentifier);

        if(sheetIdentifier && typeof(calx.sheetRegistry[sheetIdentifier]) != 'undefined'){
            calx.sheetRegistry[sheetIdentifier].update();
        }
    });
}