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

        for(a in calx.sheetRegistry[sheetIdentifier].cells){
            calx.sheetRegistry[sheetIdentifier].cells[a].detachEvent();
        }

        delete calx.sheetRegistry[sheetIdentifier];
    });

    return this;
}