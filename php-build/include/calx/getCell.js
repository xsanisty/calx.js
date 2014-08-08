getCell : function(address){
    var $this       = $(this),
        $identifier = $this.attr('data-calx-identifier')
        $sheet      = calx.sheetRegistry[$identifier];

    return $sheet.getCell(address);
}