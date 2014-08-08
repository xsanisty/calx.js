getSheet : function(){
    var $this       = $(this),
        $identifier = $this.attr('data-calx-identifier');

    return typeof(calx.sheetRegistry[$identifier]) == 'undefined' ? false : calx.sheetRegistry[$identifier];
}