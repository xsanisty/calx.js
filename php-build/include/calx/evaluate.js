evaluate : function(formula){
    var $this       = $(this),
        $identifier = $this.attr('data-calx-identifier')
        $sheet      = calx.sheetRegistry[$identifier];

    return $sheet.evaluate(formula);
}