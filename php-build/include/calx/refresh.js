/**
 * refresh sheet reference to the current dom state and rebuild
 * the cell registry and dependency tree from the scratch
 *
 * @return {object}             jQuery object
 */
refresh : function () {
    return this.each(function(){
        var sheetIdentifier = $(this).attr('data-calx-identifier');
        //console.log(sheetIdentifier);

        if(sheetIdentifier && typeof(calx.sheetRegistry[sheetIdentifier]) == 'undefined'){
            calx.sheetRegistry[sheetIdentifier].refresh();
        }
    });
}