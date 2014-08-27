/**
 * Destroy calx instance and remove reference from the element
 * @return {object}     jQuery Object
 */
destroy : function(){
    this.each(function(){
        var $sheet          = $(this),
            a,
            sheetIdentifier = $sheet.attr('data-calx-identifier');

        $sheet.removeAttr('data-calx-identifier');

        calx.sheetRegistry[sheetIdentifier].detachEvent();

        delete calx.sheetRegistry[sheetIdentifier];
    });

    return this;
}