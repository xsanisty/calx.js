/**
 * Destroy calx instance and remove reference from the element
 *
 * @return {object}     jQuery Object
 */
destroy : function(){
    this.each(function(){
        var $sheet          = $(this),
            a,
            sheetIdentifier = $sheet.attr('data-calx-identifier');

        $sheet.removeAttr('data-calx-identifier');

        if(typeof(calx.sheetRegistry[sheetIdentifier]) != 'undefined'){
            calx.sheetRegistry[sheetIdentifier].detachEvent();
            calx.sheetRegistry[sheetIdentifier].clearDependencies();
            delete calx.sheetRegistry[sheetIdentifier];
        }
    });

    return this;
}