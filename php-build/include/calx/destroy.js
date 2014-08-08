/**
 * destroy calx intance and remove reference from the element
 * @return {object}     jQuery Object
 */
destroy : function(){
    this.each(function(){
        var $sheet          = $(this),
            sheetIdentifier = $sheet.attr('data-calx-identifier');

        $sheet.removeAttr('data-calx-identifier');

        delete calx.sheetRegistry[sheetIdentifier];
    });

    return this;
}