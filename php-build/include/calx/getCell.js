/**
 * get cell object of current sheet related to the selected element,
 * the selector should only select single object, e.g. $('#id')
 *
 * @param  {string} address     the cell's address
 * @return {object}             the cell's object
 */
getCell : function(address){
    var $this       = $(this),
        $identifier = $this.attr('data-calx-identifier'),
        $sheet      = calx.sheetRegistry[$identifier];

    return $sheet.getCell(address);
}